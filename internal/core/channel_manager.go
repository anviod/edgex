package core

import (
	"context"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	drv "github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"

	"go.uber.org/zap"
)

type ChannelStatus struct {
	ID              string                `json:"id"`
	Name            string                `json:"name"`
	Protocol        string                `json:"protocol"`
	Status          string                `json:"status"`
	Enable          bool                  `json:"enable"`
	DeviceCount     int                   `json:"device_count"`
	OnlineCount     int                   `json:"online_count"`
	OfflineCount    int                   `json:"offline_count"`
	QualityScore    int                   `json:"qualityScore"`      // 质量评分
	SuccessRate     float64               `json:"successRate"`       // 成功率
	LastCollectTime string                `json:"last_collect_time"` // 最后采集时间
	Metrics         *model.ChannelMetrics `json:"metrics,omitempty"` // 详细指标
}

// ChannelManager 管理所有采集通道及其下的设备
type ChannelManager struct {
	channels              map[string]*model.Channel // channel.id -> channel
	drivers               map[string]drv.Driver     // channel.id -> driver
	driverMus             map[string]*sync.Mutex    // channel.id -> mutex for driver access
	pipeline              *DataPipeline
	stateManager          *CommunicationManageTemplate
	deviceAdapterManager  *DeviceAdapterManager
	protocolRegistry      *ProtocolAdapterRegistry
	scanEngineAdapter     *ScanEngineAdapter
	shadowCore            *ShadowCore
	mu                    sync.RWMutex
	ctx                   context.Context
	cancel                context.CancelFunc
	saveFunc              func([]model.Channel) error
	statusHandler         func(deviceID string, status int)
	topologyChangeHandler func()
	tagRegistry           *TagRegistry
	pointDegradation      *PointDegradationManager
}

func NewChannelManager(pipeline *DataPipeline, saveFunc func([]model.Channel) error) *ChannelManager {
	ctx, cancel := context.WithCancel(context.Background())
	deviceAdapterManager := NewDeviceAdapterManager()
	protocolRegistry := NewProtocolAdapterRegistry()

	scanEngine := NewScanEngine(ScanEngineConfig{
		TickInterval:      10 * time.Millisecond,
		WorkerCount:       32,
		MaxQueueSize:      10000,
		AntiStarvationSec: 300,
		GoroutineLimit:    2048,
		ConnectionLimit:   500,
	})
	cm := &ChannelManager{
		channels:             make(map[string]*model.Channel),
		drivers:              make(map[string]drv.Driver),
		driverMus:            make(map[string]*sync.Mutex),
		pipeline:             pipeline,
		stateManager:         NewCommunicationManageTemplate(),
		deviceAdapterManager: deviceAdapterManager,
		protocolRegistry:     protocolRegistry,
		scanEngineAdapter:    NewScanEngineAdapter(scanEngine),
		ctx:                  ctx,
		cancel:               cancel,
		saveFunc:             saveFunc,
		tagRegistry:          NewTagRegistry(),
		pointDegradation:     NewPointDegradationManager(),
	}

	scanEngine.SetCollectFinalize(cm.finalizeScanCollect)
	cm.scanEngineAdapter.scanEngine.SetPointDegradation(cm.pointDegradation)
	cm.scanEngineAdapter.scanEngine.SetIOProfileProvider(cm.deviceIOProfile)

	// Wire state manager events
	cm.stateManager.OnStateChange = func(deviceID string, oldState, newState NodeState) {
		cm.mu.RLock()
		handler := cm.statusHandler
		cm.mu.RUnlock()
		if handler != nil {
			handler(deviceID, int(newState))
		}
	}

	return cm
}

func (cm *ChannelManager) SetShadowCore(sc *ShadowCore) {
	cm.shadowCore = sc
	cm.scanEngineAdapter.scanEngine.SetShadowCore(sc)
}

func (cm *ChannelManager) deviceIOProfile(deviceID string) DeviceIOProfile {
	defaultProfile := DeviceIOProfile{Gap: 64, BatchSize: 120}
	cm.mu.RLock()
	sc := cm.shadowCore
	cm.mu.RUnlock()
	if sc == nil {
		return defaultProfile
	}
	opt := sc.GetDeviceOptimization(deviceID)
	if opt == nil {
		return defaultProfile
	}
	profile := defaultProfile
	if g, ok := opt["gap"].(int); ok && g > 0 {
		profile.Gap = g
	}
	if mtu, ok := opt["mtu"].(int); ok && mtu > 0 {
		batch := mtu / 4
		if batch < 16 {
			batch = 16
		}
		if batch > 125 {
			batch = 125
		}
		profile.BatchSize = batch
	}
	return profile
}

func (cm *ChannelManager) GetScanEngineMetricsSnapshot() map[string]any {
	se := cm.scanEngineAdapter.scanEngine
	if se == nil || se.GetMetrics() == nil {
		return map[string]any{}
	}
	snap := se.GetMetrics().Snapshot()
	snap["active_tasks"] = se.GetActiveTaskCount()
	snap["pending_tasks"] = se.GetPendingTaskCount()
	return snap
}

func (cm *ChannelManager) GetDeviceDiagnostics(deviceID string) map[string]any {
	out := map[string]any{
		"device_id": deviceID,
	}
	cm.mu.RLock()
	sc := cm.shadowCore
	cm.mu.RUnlock()
	if sc != nil {
		out["io_profile"] = sc.GetDeviceOptimization(deviceID)
	}
	node := cm.stateManager.GetNode(deviceID)
	if node != nil {
		out["state"] = int(node.Runtime.State)
		total := node.Runtime.SuccessCount + node.Runtime.FailCount
		if total > 0 {
			out["success_rate"] = float64(node.Runtime.SuccessCount) / float64(total)
		}
		out["consecutive_failures"] = node.Runtime.FailCount
	}
	var pointIDs []string
	now := time.Now()
	scanTasks := make([]map[string]any, 0)
	for _, task := range cm.scanEngineAdapter.scanEngine.GetTasksByDeviceKey(deviceID) {
		pointIDs = append(pointIDs, task.PointIDs...)
		task.mu.RLock()
		lagMs := float64(0)
		if !task.NextRun.IsZero() && now.After(task.NextRun) {
			lagMs = float64(now.Sub(task.NextRun).Milliseconds())
		}
		degradeOnFailure := true
		if task.Params != nil {
			if v, ok := task.Params["degradeOnFailure"].(bool); ok {
				degradeOnFailure = v
			}
		}
		scanTasks = append(scanTasks, map[string]any{
			"task_id":              task.ID,
			"scan_class":           task.ScanClass,
			"interval_ms":          task.Interval.Milliseconds(),
			"base_interval_ms":     task.BaseInterval.Milliseconds(),
			"status":               task.Status.String(),
			"lag_ms":               lagMs,
			"consecutive_failures": task.ConsecutiveFailures,
			"point_count":          len(task.PointIDs),
			"degrade_on_failure":   degradeOnFailure,
		})
		task.mu.RUnlock()
	}
	if len(scanTasks) > 0 {
		out["scan_tasks"] = scanTasks
	}
	if cm.pointDegradation != nil && len(pointIDs) > 0 {
		out["point_degradation"] = cm.pointDegradation.SnapshotDevice(deviceID, pointIDs)
	}
	return out
}

func (cm *ChannelManager) finalizeScanCollect(deviceID string, result *ExecuteResult) {
	channelID := cm.channelIDForDevice(deviceID)
	recordCollectCycle := func(success bool) {
		if channelID == "" {
			return
		}
		if mc := model.GetGlobalMetricsCollector(); mc != nil {
			mc.RecordCycle(channelID, success)
		}
	}

	if result != nil && isChannelLinkError(result.Error) {
		if channelID != "" {
			cm.markChannelDevicesOffline(channelID)
		}
		recordCollectCycle(false)
		return
	}

	node := cm.stateManager.GetNode(deviceID)
	if node == nil {
		return
	}

	ctx := &CollectContext{}
	if result.Success && len(result.Values) > 0 {
		for _, v := range result.Values {
			if v.Quality == "Good" {
				ctx.SuccessCmd++
			} else {
				ctx.FailCmd++
			}
		}
	} else {
		pointCount := 0
		for _, task := range cm.scanEngineAdapter.scanEngine.GetTasksByDeviceKey(deviceID) {
			pointCount += len(task.PointIDs)
		}
		if pointCount == 0 {
			ctx.FailCmd = 1
		} else {
			ctx.FailCmd = pointCount
		}
	}

	cm.stateManager.FinalizeCollect(node, ctx)
	recordCollectCycle(result != nil && result.Success)
}

func (cm *ChannelManager) SetStatusHandler(h func(deviceID string, status int)) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	cm.statusHandler = h
}

// SetTopologyChangeHandler registers a callback invoked when channels/devices/points change.
// Used to rebuild northbound OPC UA address space.
func (cm *ChannelManager) SetTopologyChangeHandler(h func()) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	cm.topologyChangeHandler = h
}

func (cm *ChannelManager) notifyTopologyChange() {
	go func() {
		cm.mu.RLock()
		handler := cm.topologyChangeHandler
		cm.mu.RUnlock()
		if handler != nil {
			handler()
		}
	}()
}

// parseTime 解析时间字符串
func parseTime(s string) time.Time {
	if s == "" {
		return time.Time{}
	}
	t, _ := time.Parse(time.RFC3339, s)
	return t
}

func (cm *ChannelManager) GetChannelStats() []ChannelStatus {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	var stats []ChannelStatus
	for _, ch := range cm.channels {
		online := 0
		offline := 0
		lastCollectTime := ""

		for _, dev := range ch.Devices {
			node := cm.stateManager.GetNode(dev.ID)
			if node != nil && node.Runtime.State == NodeStateOnline {
				online++
				// 更新最后采集时间
				if node.Runtime.LastSuccess.After(time.Time{}) {
					if lastCollectTime == "" || node.Runtime.LastSuccess.After(parseTime(lastCollectTime)) {
						lastCollectTime = node.Runtime.LastSuccess.Format(time.RFC3339)
					}
				}
			} else {
				offline++
			}
		}

		status := "Running"
		if !ch.Enable {
			status = "Disabled"
		} else if offline > 0 && online == 0 {
			status = "Error"
		} else if offline > 0 {
			status = "Warning"
		}

		stats = append(stats, ChannelStatus{
			ID:              ch.ID,
			Name:            ch.Name,
			Protocol:        ch.Protocol,
			Status:          status,
			Enable:          ch.Enable,
			DeviceCount:     len(ch.Devices),
			OnlineCount:     online,
			OfflineCount:    offline,
			LastCollectTime: lastCollectTime,
		})
	}
	return stats
}

func (cm *ChannelManager) GetTagRegistry() *TagRegistry {
	return cm.tagRegistry
}

// AddChannel 添加一个采集通道
func (cm *ChannelManager) AddChannel(ch *model.Channel) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if err := model.EnsureChannelID(ch); err != nil {
		return err
	}

	if _, exists := cm.channels[ch.ID]; exists {
		return fmt.Errorf("channel %s already exists", ch.ID)
	}

	if ch.Protocol == "opc-ua" {
		model.NormalizeOpcUaChannelConfig(ch.Config)
	}
	if ch.Protocol == "modbus-tcp" || ch.Protocol == "modbus-rtu-over-tcp" {
		normalizeModbusChannelConfig(ch.Config)
	}

	// 格式化所有设备配置
	for i := range ch.Devices {
		sanitizeDeviceConfig(ch.Devices[i].Config)
		if (ch.Protocol == "modbus-tcp" || ch.Protocol == "modbus-rtu" || ch.Protocol == "modbus-rtu-over-tcp") && ch.Devices[i].Config != nil {
			if _, ok := ch.Devices[i].Config["auto_points_range"]; ok && len(ch.Devices[i].Points) == 0 {
				// 只有在设备的 Points 字段为空时，才自动生成点位配置
				cm.autoGenerateModbusPointsFromConfig(&ch.Devices[i])
			}
		}
	}

	// 初始化驱动
	d, ok := drv.GetDriver(ch.Protocol)
	if !ok {
		return fmt.Errorf("driver for protocol %s not found", ch.Protocol)
	}

	err := d.Init(model.DriverConfig{
		ChannelID: ch.ID,
		Config:    ch.Config,
	})
	if err != nil {
		return fmt.Errorf("failed to init driver: %v", err)
	}

	cm.channels[ch.ID] = ch
	for i := range ch.Devices {
		cm.tagRegistry.RegisterFromDevice(ch.ID, &ch.Devices[i])
	}
	cm.drivers[ch.ID] = d
	cm.driverMus[ch.ID] = &sync.Mutex{}
	cm.stateManager.RegisterNode(ch.ID, ch.Name)

	// Register all devices in state manager
	for _, dev := range ch.Devices {
		cm.stateManager.RegisterNode(dev.ID, dev.Name)
	}

	// Persist
	if cm.saveFunc != nil {
		channels := make([]model.Channel, 0, len(cm.channels))
		for _, c := range cm.channels {
			channels = append(channels, *c)
		}
		// Since map iteration order is random, this might reshuffle channels in config.
		// For now it's acceptable, or we can maintain order if needed.
		if err := cm.saveFunc(channels); err != nil {
			zap.L().Warn("Failed to save config after adding channel", zap.Error(err))
		}
	}

	//	zap.L().Info("Channel added", zap.String("channel", ch.Name), zap.String("protocol", ch.Protocol), zap.Int("device_count", len(ch.Devices)))
	cm.notifyTopologyChange()
	return nil
}

// UpdateChannel 更新采集通道
func (cm *ChannelManager) UpdateChannel(ch *model.Channel) error {
	// 1. Stop existing channel
	if err := cm.StopChannel(ch.ID); err != nil {
		// Ignore error if channel was not running or found (but we should check existence)
		zap.L().Warn("Stopping channel before update", zap.String("channel_id", ch.ID), zap.Error(err))
	}

	cm.mu.Lock()
	defer cm.mu.Unlock()

	if ch.Protocol == "opc-ua" {
		model.NormalizeOpcUaChannelConfig(ch.Config)
	}
	if ch.Protocol == "modbus-tcp" || ch.Protocol == "modbus-rtu-over-tcp" {
		normalizeModbusChannelConfig(ch.Config)
	}

	// 格式化所有设备配置
	for i := range ch.Devices {
		sanitizeDeviceConfig(ch.Devices[i].Config)
	}

	// 2. Re-init driver with new config
	d, ok := drv.GetDriver(ch.Protocol)
	if !ok {
		return fmt.Errorf("driver for protocol %s not found", ch.Protocol)
	}
	err := d.Init(model.DriverConfig{
		ChannelID: ch.ID,
		Config:    ch.Config,
	})
	if err != nil {
		return fmt.Errorf("failed to init driver: %v", err)
	}

	// 3. Update map
	cm.channels[ch.ID] = ch
	for i := range ch.Devices {
		cm.tagRegistry.RegisterFromDevice(ch.ID, &ch.Devices[i])
	}
	cm.drivers[ch.ID] = d
	if _, ok := cm.driverMus[ch.ID]; !ok {
		cm.driverMus[ch.ID] = &sync.Mutex{}
	}

	// Register all devices in state manager
	for _, dev := range ch.Devices {
		cm.stateManager.RegisterNode(dev.ID, dev.Name)
	}

	// 4. Persist
	if cm.saveFunc != nil {
		channels := make([]model.Channel, 0, len(cm.channels))
		for _, c := range cm.channels {
			channels = append(channels, *c)
		}
		if err := cm.saveFunc(channels); err != nil {
			zap.L().Warn("Failed to save config after updating channel", zap.Error(err))
		}
	}

	zap.L().Info("Channel updated", zap.String("channel", ch.Name))
	cm.notifyTopologyChange()
	return nil
}

// RemoveChannel 删除采集通道
func (cm *ChannelManager) RemoveChannel(channelID string) error {
	// 1. Stop channel
	_ = cm.StopChannel(channelID)

	cm.mu.Lock()
	defer cm.mu.Unlock()

	if _, exists := cm.channels[channelID]; !exists {
		return fmt.Errorf("channel not found")
	}

	delete(cm.channels, channelID)
	delete(cm.drivers, channelID)
	delete(cm.driverMus, channelID)

	// 2. Persist
	if cm.saveFunc != nil {
		channels := make([]model.Channel, 0, len(cm.channels))
		for _, c := range cm.channels {
			channels = append(channels, *c)
		}
		if err := cm.saveFunc(channels); err != nil {
			zap.L().Warn("Failed to save config after removing channel", zap.Error(err))
		}
	}

	zap.L().Info("Channel removed", zap.String("channel_id", channelID))
	cm.notifyTopologyChange()
	return nil
}

// registerDeviceToScanEngine 将设备注册到 ScanEngine（使用通道已连接的驱动与完整点位配置）。
func (cm *ChannelManager) registerDeviceToScanEngine(ch *model.Channel, dev *model.Device) error {
	interval, ok := cm.validateDeviceInterval(dev)
	if !ok {
		return nil
	}
	d, okDrv := cm.drivers[ch.ID]
	if !okDrv {
		return fmt.Errorf("driver not found for channel %s", ch.ID)
	}
	cm.registerProtocolToScanEngine(ch.Protocol)
	return cm.scanEngineAdapter.RegisterDevice(
		dev.ID,
		ch.Protocol,
		d,
		cm.driverMus[ch.ID],
		ch,
		dev,
		interval,
		5,
	)
}

// tryConnectChannel 尝试连接通道驱动（用于批量添加设备后尽快建立连接）。
func (cm *ChannelManager) tryConnectChannel(channelID string) {
	cm.mu.RLock()
	d, ok := cm.drivers[channelID]
	cm.mu.RUnlock()
	if !ok || d == nil {
		return
	}
	ctx, cancel := context.WithTimeout(cm.ctx, 10*time.Second)
	defer cancel()
	if err := d.Connect(ctx); err != nil {
		zap.L().Warn("Channel connect failed", zap.String("channel_id", channelID), zap.Error(err))
		cm.markChannelDevicesOffline(channelID)
	}
}

// StartChannel 启动一个采集通道
func (cm *ChannelManager) StartChannel(channelID string) error {
	cm.mu.RLock()
	ch, ok := cm.channels[channelID]
	d, okDrv := cm.drivers[channelID]
	cm.mu.RUnlock()

	if !ok || !okDrv {
		return fmt.Errorf("channel or driver not found")
	}

	if !ch.Enable {
		zap.L().Info("Channel is disabled, skipping connection", zap.String("channel", ch.Name))
		return nil
	}

	// 连接驱动
	err := d.Connect(cm.ctx)
	if err != nil {
		cm.markChannelDevicesOffline(channelID)
		zap.L().Error("Failed to connect driver for channel", zap.String("channel", ch.Name), zap.Error(err))
		return err
	}
	//zap.L().Info("Driver connected for channel", zap.String("channel", ch.Name))

	// 注册协议类型到ScanEngine
	cm.registerProtocolToScanEngine(ch.Protocol)

	// 为该通道下的每个设备注册到ScanEngine
	for i := range ch.Devices {
		dev := &ch.Devices[i]
		if !dev.Enable {
			zap.L().Info("Device is disabled, skipping", zap.String("device", dev.Name), zap.String("channel", ch.Name))
			continue
		}

		if err := cm.registerDeviceToScanEngine(ch, dev); err != nil {
			zap.L().Error("Failed to register device to ScanEngine", zap.String("device", dev.Name), zap.Error(err))
		}
	}

	// 启动ScanEngine（仅第一次启动）
	cm.scanEngineAdapter.Start()

	//zap.L().Info("Channel started", zap.String("channel", ch.Name), zap.Int("device_count", len(ch.Devices)))
	return nil
}

// StopChannel 停止一个采集通道
func (cm *ChannelManager) StopChannel(channelID string) error {
	cm.mu.RLock()
	ch, ok := cm.channels[channelID]
	d, okDrv := cm.drivers[channelID]
	cm.mu.RUnlock()

	if !ok || !okDrv {
		return fmt.Errorf("channel or driver not found")
	}

	// 通知所有设备停止并从 ScanEngine 注销
	for _, device := range ch.Devices {
		cm.scanEngineAdapter.UnregisterDevice(device.ID)
		select {
		case device.StopChan <- struct{}{}:
			zap.L().Info("Device stopping", zap.String("device", device.Name))
		default:
		}
	}

	// 断开驱动连接
	d.Disconnect()

	return nil
}

// GetChannels 获取所有通道
func (cm *ChannelManager) GetChannels() []model.Channel {
	cm.mu.RLock()
	defer cm.mu.RUnlock()
	channels := make([]model.Channel, 0, len(cm.channels))
	for _, ch := range cm.channels {
		c := *ch
		if node := cm.stateManager.GetNode(c.ID); node != nil {
			c.NodeRuntime = &model.NodeRuntime{
				FailCount:     node.Runtime.FailCount,
				SuccessCount:  node.Runtime.SuccessCount,
				LastFailTime:  node.Runtime.LastFailTime,
				NextRetryTime: node.Runtime.NextRetryTime,
				State:         int(node.Runtime.State),
			}
		}
		// Also update Device Runtime
		d := cm.drivers[c.ID]
		for i := range c.Devices {
			cm.applyDeviceRuntimeState(&c, d, &c.Devices[i])
		}

		channels = append(channels, c)
	}
	return channels
}

// GetStateManager 获取状态管理器
func (cm *ChannelManager) GetStateManager() *CommunicationManageTemplate {
	cm.mu.RLock()
	defer cm.mu.RUnlock()
	return cm.stateManager
}

// GetDriver 获取通道的驱动实例
func (cm *ChannelManager) GetDriver(channelID string) drv.Driver {
	cm.mu.RLock()
	defer cm.mu.RUnlock()
	return cm.drivers[channelID]
}

func (cm *ChannelManager) GetAllPoints() []map[string]any {
	cm.mu.RLock()
	defer cm.mu.RUnlock()
	var result []map[string]any
	for _, ch := range cm.channels {
		for _, dev := range ch.Devices {
			for _, p := range dev.Points {
				result = append(result, map[string]any{
					"channel_id":   ch.ID,
					"channel_name": ch.Name,
					"device_id":    dev.ID,
					"device_name":  dev.Name,
					"point_id":     p.ID,
					"point_name":   p.Name,
					"data_type":    p.DataType,
				})
			}
		}
	}
	return result
}

// GetChannel 获取指定通道
func (cm *ChannelManager) GetChannel(channelID string) *model.Channel {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	if ch, ok := cm.channels[channelID]; ok {
		c := *ch
		if node := cm.stateManager.GetNode(c.ID); node != nil {
			c.NodeRuntime = &model.NodeRuntime{
				FailCount:     node.Runtime.FailCount,
				SuccessCount:  node.Runtime.SuccessCount,
				LastFailTime:  node.Runtime.LastFailTime,
				NextRetryTime: node.Runtime.NextRetryTime,
				State:         int(node.Runtime.State),
			}
		}
		return &c
	}
	return nil
}

// GetChannelDevices 获取指定通道的所有设备
func (cm *ChannelManager) GetChannelDevices(channelID string) []model.Device {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	if ch, ok := cm.channels[channelID]; ok {
		d := cm.drivers[channelID]
		// Return a copy with state populated
		devices := make([]model.Device, len(ch.Devices))
		for i, dev := range ch.Devices {
			devices[i] = dev
			cm.applyDeviceRuntimeState(ch, d, &devices[i])
			if mc := model.GetGlobalMetricsCollector(); mc != nil {
				metrics := mc.GetDeviceMetrics(dev.ID)
				devices[i].QualityScore = metrics.HealthScore
			}
		}
		return devices
	}
	return nil
}

// GetDevice 获取指定通道下的指定设备
func (cm *ChannelManager) GetDevice(channelID, deviceID string) *model.Device {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	if ch, ok := cm.channels[channelID]; ok {
		for i, dev := range ch.Devices {
			if dev.ID == deviceID {
				// Return a copy with state populated
				d := ch.Devices[i]
				driver := cm.drivers[channelID]
				cm.applyDeviceRuntimeState(ch, driver, &d)
				if mc := model.GetGlobalMetricsCollector(); mc != nil {
					metrics := mc.GetDeviceMetrics(d.ID)
					d.QualityScore = metrics.HealthScore
				}
				return &d
			}
		}
	}
	return nil
}

// GetDevicePoints 获取指定设备的所有点位数据
func (cm *ChannelManager) GetDevicePoints(channelID, deviceID string) ([]model.PointData, error) {
	cm.mu.RLock()

	// 1. 获取 Channel 和 Driver
	ch, ok := cm.channels[channelID]
	d, okDrv := cm.drivers[channelID]
	mu, okMu := cm.driverMus[channelID]

	if !ok || !okDrv {
		cm.mu.RUnlock()
		return nil, fmt.Errorf("channel not found")
	}

	// 2. 查找设备 (直接在 map/slice 中查找，避免 GetDevice 的锁开销和指针逃逸问题)
	var foundDev *model.Device
	for i := range ch.Devices {
		if ch.Devices[i].ID == deviceID {
			foundDev = &ch.Devices[i]
			break
		}
	}

	if foundDev == nil {
		cm.mu.RUnlock()
		return nil, fmt.Errorf("device not found")
	}

	// 3. 复制必要的数据 (避免持有锁进行 IO，也避免竞态条件)
	pointsCopy := make([]model.Point, len(foundDev.Points))
	copy(pointsCopy, foundDev.Points)

	slaveIDVal := foundDev.Config["slave_id"]
	devID := foundDev.ID
	// 提前复制 slave_id 值，避免释放锁后指针无效
	slaveID := uint8(0)
	if slaveIDVal != nil {
		switch val := slaveIDVal.(type) {
		case float64:
			slaveID = uint8(val)
		case int:
			slaveID = uint8(val)
		case int64:
			slaveID = uint8(val)
		case uint8:
			slaveID = val
		case string:
			if i, err := strconv.Atoi(val); err == nil {
				slaveID = uint8(i)
			}
		}
	}
	// 获取节点以便后续根据读取结果更新状态
	node := cm.stateManager.GetNode(devID)

	cm.mu.RUnlock() // 释放 ChannelManager 锁

	// 优先从影子设备快照读取（ScanEngine 周期写入）
	if cm.shadowCore != nil {
		if points, ok := cm.getDevicePointsFromShadow(foundDev, slaveID, channelID); ok {
			return points, nil
		}
	}

	// 4. 互斥锁保护驱动访问
	if okMu {
		mu.Lock()
		defer mu.Unlock()
	}

	// 设置从机 ID（如果是 Modbus）
	if slaveIDVal != nil {
		if slaveIDUint, ok := slaveIDVal.(float64); ok {
			d.SetSlaveID(uint8(slaveIDUint))
		} else if slaveIDInt, ok := slaveIDVal.(int); ok {
			d.SetSlaveID(uint8(slaveIDInt))
		}
	}

	// 设置设备配置 (BACnet 等需要 IP/Port)
	// For BACnet, add _internal_device_id to map string device ID to BACnet instance ID
	configCopy := buildDriverDeviceConfig(ch, foundDev.Config, map[string]any{
		"_internal_device_id": devID,
	})
	d.SetDeviceConfig(configCopy)

	// Ensure DeviceID is set on points for the driver
	for i := range pointsCopy {
		pointsCopy[i].DeviceID = devID
	}

	// 读取点位数据
	timeout := 5 * time.Second

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	results, err := d.ReadPoints(ctx, pointsCopy)
	if err != nil {
		zap.L().Warn("Failed to read points for device", zap.String("device_id", deviceID), zap.Error(err))
		// Don't return error, return points with Bad quality so user can still manage them
	}

	// 转换为 PointData 格式
	points := make([]model.PointData, 0, len(pointsCopy))
	now := time.Now()

	// 构建结果 map 以便快速查找
	resultMap := make(map[string]model.Value)
	if results != nil {
		for _, result := range results {
			resultMap[result.PointID] = result
		}
	}

	// 按配置顺序返回点位数据
	successCount := 0
	failCount := 0
	for _, point := range pointsCopy {
		pd := model.PointData{
			ID:           point.ID,
			Name:         point.Name,
			SlaveID:      slaveID,
			RegisterType: point.RegisterType.String(),
			FunctionCode: point.FunctionCode,
			Address:      point.Address,
			DataType:     point.DataType,
			Unit:         point.Unit,
			Timestamp:    now,
			Quality:      "Bad", // Default to Bad if read failed
			Value:        0.0,
			ReadWrite:    point.ReadWrite,
		}

		// 从结果中获取实际读取的值
		if result, exists := resultMap[point.ID]; exists {
			pd.Value = result.Value
			pd.Quality = result.Quality
			if !result.TS.IsZero() {
				pd.Timestamp = result.TS
				pd.CollectedAt = result.TS
			}
			if pd.Quality == "Good" {
				successCount++
			} else {
				failCount++
			}
		} else {
			// 未返回视为失败一次
			failCount++
		}

		points = append(points, pd)
	}

	// 根据读点结果立即修正设备状态：一次成功即可恢复 Online
	if node != nil {
		collectCtx := &CollectContext{
			TotalCmd:   successCount + failCount,
			SuccessCmd: successCount,
			FailCmd:    failCount,
		}
		cm.stateManager.FinalizeCollect(node, collectCtx)
	}

	return points, nil
}

// GetShadowPoint 从影子设备实时快照中读取单个点位数据。
// 供 OPC UA Server 的 ReadHandler 调用，使第三方客户端能按需获取实时值。
func (cm *ChannelManager) GetShadowPoint(channelID, deviceID, pointID string) (*model.ShadowPoint, error) {
	if cm.shadowCore == nil {
		return nil, fmt.Errorf("shadow core not initialized")
	}
	shadowID := fmt.Sprintf("shadow-%s", deviceID)
	if pt, err := cm.shadowCore.GetShadowPoint(shadowID, pointID); err == nil {
		return pt, nil
	}
	return cm.shadowCore.GetVirtualShadowPoint(deviceID, pointID)
}

func (cm *ChannelManager) getDevicePointsFromShadow(dev *model.Device, slaveID uint8, channelID string) ([]model.PointData, bool) {
	shadowID := fmt.Sprintf("shadow-%s", dev.ID)
	shadow, err := cm.shadowCore.GetShadowDevice(shadowID)
	if err != nil || shadow == nil || len(shadow.Points) == 0 {
		return nil, false
	}
	if channelID != "" && shadow.ChannelID != "" && shadow.ChannelID != channelID {
		return nil, false
	}

	points := make([]model.PointData, 0, len(dev.Points))
	for _, point := range dev.Points {
		collectedAt := time.Time{}
		updatedAt := time.Time{}
		pd := model.PointData{
			ID:           point.ID,
			Name:         point.Name,
			SlaveID:      slaveID,
			RegisterType: point.RegisterType.String(),
			FunctionCode: point.FunctionCode,
			Address:      point.Address,
			DataType:     point.DataType,
			Unit:         point.Unit,
			Quality:      "Bad",
			Value:        nil,
			ReadWrite:    point.ReadWrite,
		}
		if sp, exists := shadow.Points[point.ID]; exists {
			pd.Value = sp.Value
			pd.Quality = sp.Quality
			collectedAt = sp.CollectedAt
			if collectedAt.IsZero() {
				collectedAt = sp.Timestamp
			}
			updatedAt = sp.UpdatedAt
			pd.Timestamp = collectedAt
			pd.CollectedAt = collectedAt
			pd.UpdatedAt = updatedAt
		}
		points = append(points, pd)
	}
	return points, true
}

// validateDeviceInterval 验证设备采集间隔
func (cm *ChannelManager) validateDeviceInterval(dev *model.Device) (time.Duration, bool) {
	// 检查设备是否为 nil
	if dev == nil {
		zap.L().Error("Device is nil in validateDeviceInterval")
		return 0, false
	}

	// 检查设备名称是否为空
	if dev.Name == "" {
		zap.L().Error("Device name is empty in validateDeviceInterval")
		return 0, false
	}

	// 检查设备采集间隔是否为正数
	if dev.Interval <= 0 {
		zap.L().Warn("Device interval must be positive", zap.String("device", dev.Name), zap.Duration("interval", time.Duration(dev.Interval)))
		return 0, false
	}

	// 转换为时间间隔
	interval := time.Duration(dev.Interval)

	// 确保 interval 至少为 1 纳秒
	if interval < time.Nanosecond {
		interval = time.Nanosecond
		zap.L().Warn("Device interval is too small, setting to 1ns", zap.String("device", dev.Name), zap.Duration("interval", interval))
	}

	return interval, true
}

// registerProtocolToScanEngine 注册协议类型到ScanEngine
func (cm *ChannelManager) registerProtocolToScanEngine(protocol string) {
	switch protocol {
	case "modbus-tcp", "modbus-rtu", "modbus-rtu-over-tcp", "dlt645", "omron-fins", "mitsubishi-slmp":
		cm.scanEngineAdapter.scanEngine.RegisterProtocol(protocol, ProtocolTypeSerial)
	case "opc-ua", "http", "rest", "mqtt":
		cm.scanEngineAdapter.scanEngine.RegisterProtocol(protocol, ProtocolTypeParallel)
	case "s7", "bacnet-ip", "ethernet-ip":
		cm.scanEngineAdapter.scanEngine.RegisterProtocol(protocol, ProtocolTypeLimited)
	default:
		cm.scanEngineAdapter.scanEngine.RegisterProtocol(protocol, ProtocolTypeSerial)
	}
}

// validatePoint validates point configuration based on channel protocol
func (cm *ChannelManager) validatePoint(ch *model.Channel, point *model.Point) error {
	switch ch.Protocol {
	case "modbus-tcp", "modbus-rtu", "modbus-rtu-over-tcp":
		return cm.validateModbusPoint(point)
	case "bacnet-ip":
		return cm.validateBACnetPoint(point)
	case "s7":
		return cm.validateS7Point(point)
	case "dlt645":
		return cm.validateDLT645Point(point)
	case "ethernet-ip":
		return cm.validateEtherNetIPPoint(point)
	case "mitsubishi-slmp":
		return cm.validateMitsubishiPoint(point)
	case "omron-fins":
		return cm.validateOmronFinsPoint(point)
	default:
		return nil
	}
}

func (cm *ChannelManager) validateOmronFinsPoint(point *model.Point) error {
	if point.Address == "" {
		return fmt.Errorf("omron address cannot be empty")
	}
	// Basic regex for Omron FINS Address
	// Supports: D100, CIO1.2, W3.4, H4.15L, EM10.100
	re := regexp.MustCompile(`^(?i)(CIO|A|W|H|D|P|F|EM\d*)(\d+)(\.\d+)?([HL]|\.\d+[HL]?)?$`)
	if !re.MatchString(point.Address) {
		return fmt.Errorf("invalid omron address format: e.g. D100, W3.4, CIO1.2, EM10.100")
	}
	return nil
}

func (cm *ChannelManager) validateMitsubishiPoint(point *model.Point) error {
	if point.Address == "" {
		return fmt.Errorf("mitsubishi address cannot be empty")
	}
	// Basic check for AREA ADDRESS
	re := regexp.MustCompile(`^([A-Z]+)([0-9]+)`)
	if !re.MatchString(strings.ToUpper(point.Address)) {
		return fmt.Errorf("invalid mitsubishi address format: e.g. D100, M0, X10")
	}
	return nil
}

func (cm *ChannelManager) validateModbusPoint(point *model.Point) error {
	if _, err := strconv.Atoi(point.Address); err != nil {
		return fmt.Errorf("invalid modbus address '%s': must be an integer", point.Address)
	}
	switch point.DataType {
	case "int16", "uint16", "int32", "uint32", "float32", "float64", "bool":
		return nil
	default:
		return fmt.Errorf("invalid modbus datatype '%s'", point.DataType)
	}
}

func (cm *ChannelManager) validateBACnetPoint(point *model.Point) error {
	parts := strings.Split(point.Address, ":")
	if len(parts) != 2 {
		return fmt.Errorf("invalid bacnet address '%s': format must be ObjectType:Instance", point.Address)
	}

	validTypes := map[string]bool{
		"AnalogInput": true, "AnalogOutput": true, "AnalogValue": true,
		"BinaryInput": true, "BinaryOutput": true, "BinaryValue": true,
		"MultiStateInput": true, "MultiStateOutput": true, "MultiStateValue": true,
	}
	if !validTypes[parts[0]] {
		return fmt.Errorf("invalid bacnet object type '%s'", parts[0])
	}

	if _, err := strconv.Atoi(parts[1]); err != nil {
		return fmt.Errorf("invalid bacnet instance '%s': must be an integer", parts[1])
	}
	return nil
}

func (cm *ChannelManager) validateS7Point(point *model.Point) error {
	if point.Address == "" {
		return fmt.Errorf("s7 address cannot be empty")
	}
	return nil
}

func (cm *ChannelManager) validateDLT645Point(point *model.Point) error {
	if point.Address == "" {
		return fmt.Errorf("dlt645 address cannot be empty")
	}
	// Basic format check: Address#DataID
	parts := strings.Split(point.Address, "#")
	if len(parts) != 2 {
		return fmt.Errorf("invalid dlt645 address format: must be Address#DataID")
	}
	return nil
}

func (cm *ChannelManager) validateEtherNetIPPoint(point *model.Point) error {
	if point.Address == "" {
		return fmt.Errorf("ethernet/ip tag name cannot be empty")
	}
	return nil
}

// WritePoint 写入指定通道下设备点位的值
func (cm *ChannelManager) WritePoint(channelID, deviceID, pointID string, value any) error {
	cm.mu.RLock()
	ch, ok := cm.channels[channelID]
	d, okDrv := cm.drivers[channelID]
	mu, okMu := cm.driverMus[channelID]
	cm.mu.RUnlock()

	if !ok || !okDrv {
		return fmt.Errorf("channel not found")
	}

	dev := cm.GetDevice(channelID, deviceID)
	if dev == nil {
		return fmt.Errorf("device not found")
	}

	// 查找点位配置
	var targetPoint model.Point
	found := false
	for _, p := range dev.Points {
		if p.ID == pointID {
			targetPoint = p
			found = true
			break
		}
	}
	if !found {
		return fmt.Errorf("point not found")
	}

	if !pointAllowsWrite(targetPoint.ReadWrite) {
		return fmt.Errorf("point %s is read-only", pointID)
	}

	// Ensure DeviceID is set
	targetPoint.DeviceID = dev.ID

	// 互斥锁保护驱动访问
	if okMu {
		mu.Lock()
		defer mu.Unlock()
	}

	// 设置从机 ID（如果是 Modbus）
	if slaveID, ok := dev.Config["slave_id"]; ok {
		if slaveIDUint, ok := slaveID.(float64); ok {
			d.SetSlaveID(uint8(slaveIDUint))
		} else if slaveIDInt, ok := slaveID.(int); ok {
			d.SetSlaveID(uint8(slaveIDInt))
		}
	}

	// 设置设备配置
	config := buildDriverDeviceConfig(ch, dev.Config, map[string]any{
		"_internal_device_id": dev.ID,
	})
	d.SetDeviceConfig(config)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := d.WritePoint(ctx, targetPoint, value); err != nil {
		return err
	}

	cm.publishWrittenValue(channelID, deviceID, pointID, value)
	return nil
}

func pointAllowsWrite(readWrite string) bool {
	if readWrite == "" {
		return true
	}
	return strings.Contains(strings.ToUpper(readWrite), "W")
}

// publishWrittenValue 将北向/REST 写入结果同步到 ShadowCore，经 ShadowBridge 扇出到 Pipeline 与北向。
func (cm *ChannelManager) publishWrittenValue(channelID, deviceID, pointID string, value any) {
	now := time.Now()
	if cm.shadowCore != nil {
		msg := model.ShadowIngressMessage{
			DeviceID:  deviceID,
			ChannelID: channelID,
			Timestamp: now,
			Points: []model.ShadowIngressPoint{
				{
					PointID:     pointID,
					Value:       value,
					Quality:     "Good",
					CollectedAt: now,
				},
			},
			Meta: model.ShadowIngressMeta{Source: "write_point"},
		}
		if _, err := cm.shadowCore.WriteShadowDevice(msg); err != nil {
			zap.L().Warn("Failed to sync write to shadow",
				zap.String("device_id", deviceID),
				zap.String("point_id", pointID),
				zap.Error(err),
			)
		}
		return
	}

	if cm.pipeline != nil {
		cm.pipeline.Push(model.Value{
			ChannelID: channelID,
			DeviceID:  deviceID,
			PointID:   pointID,
			Value:     value,
			Quality:   "Good",
			TS:        now,
		})
	}
}

// ReadPoint 读取指定通道下设备点位的值
func (cm *ChannelManager) ReadPoint(channelID, deviceID, pointID string) (model.Value, error) {
	cm.mu.RLock()
	ch, ok := cm.channels[channelID]
	d, okDrv := cm.drivers[channelID]
	mu, okMu := cm.driverMus[channelID]
	cm.mu.RUnlock()

	if !ok || !okDrv {
		return model.Value{}, fmt.Errorf("channel not found")
	}

	dev := cm.GetDevice(channelID, deviceID)
	if dev == nil {
		return model.Value{}, fmt.Errorf("device not found")
	}

	// 查找点位配置
	var targetPoint model.Point
	found := false
	for _, p := range dev.Points {
		if p.ID == pointID {
			targetPoint = p
			found = true
			break
		}
	}
	if !found {
		return model.Value{}, fmt.Errorf("point not found")
	}

	// Ensure DeviceID is set
	targetPoint.DeviceID = dev.ID

	// 互斥锁保护驱动访问
	if okMu {
		mu.Lock()
		defer mu.Unlock()
	}

	// 设置从机 ID（如果是 Modbus）
	if slaveID, ok := dev.Config["slave_id"]; ok {
		if slaveIDUint, ok := slaveID.(float64); ok {
			d.SetSlaveID(uint8(slaveIDUint))
		} else if slaveIDInt, ok := slaveID.(int); ok {
			d.SetSlaveID(uint8(slaveIDInt))
		}
	}

	// 设置设备配置
	config := buildDriverDeviceConfig(ch, dev.Config, map[string]any{
		"_internal_device_id": dev.ID,
	})
	d.SetDeviceConfig(config)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	results, err := d.ReadPoints(ctx, []model.Point{targetPoint})
	if err != nil {
		return model.Value{}, err
	}

	// Try finding by Name (most common)
	if v, ok := results[targetPoint.Name]; ok {
		return v, nil
	}
	// Try finding by ID
	if v, ok := results[targetPoint.ID]; ok {
		return v, nil
	}
	// Fallback: if single result, return it
	if len(results) == 1 {
		for _, v := range results {
			return v, nil
		}
	}

	return model.Value{}, fmt.Errorf("point value not returned")
}

// Shutdown 关闭所有通道
func (cm *ChannelManager) Shutdown() {
	cm.cancel()
	cm.mu.Lock()
	defer cm.mu.Unlock()

	for _, ch := range cm.channels {
		for _, dev := range ch.Devices {
			select {
			case dev.StopChan <- struct{}{}:
			default:
			}
		}
	}

	for _, d := range cm.drivers {
		d.Disconnect()
	}
}

// ScanChannel 扫描通道下的设备
func (cm *ChannelManager) ScanChannel(channelID string, params map[string]any) (any, error) {
	cm.mu.RLock()
	d, okDrv := cm.drivers[channelID]
	mu, okMu := cm.driverMus[channelID]
	ch, okCh := cm.channels[channelID]
	cm.mu.RUnlock()

	if !okDrv {
		return nil, fmt.Errorf("channel driver not found")
	}

	// Cast to Scanner
	scanner, ok := d.(drv.Scanner)
	if !ok {
		return nil, fmt.Errorf("driver does not support scanning")
	}

	if params == nil {
		params = make(map[string]any)
	}

	// Inject existing device IDs for BACnet to mark duplicates
	if okCh && ch.Protocol == "bacnet-ip" {
		var existingIDs []int
		for _, dev := range ch.Devices {
			if v, ok := dev.Config["device_id"]; ok {
				if id, ok := v.(int); ok {
					existingIDs = append(existingIDs, id)
				} else if id, ok := v.(float64); ok {
					existingIDs = append(existingIDs, int(id))
				}
			}
		}
		params["existing_device_ids"] = existingIDs
	}

	if okCh && ch.Protocol == "opc-ua" {
		merged := model.MergeOpcUaDeviceConfig(ch.Config, params)
		for k, v := range merged {
			params[k] = v
		}
	}

	if okMu {
		mu.Lock()
		defer mu.Unlock()
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	return scanner.Scan(ctx, params)
}

// ScanDevice 扫描设备下的对象（点位）
func (cm *ChannelManager) ScanDevice(channelID, deviceID string, params map[string]any) (any, error) {
	cm.mu.RLock()
	d, okDrv := cm.drivers[channelID]
	mu, okMu := cm.driverMus[channelID]
	ch, okCh := cm.channels[channelID]
	cm.mu.RUnlock()

	if !okDrv || !okCh {
		return nil, fmt.Errorf("channel or driver not found")
	}

	// Cast to ObjectScanner
	scanner, ok := d.(drv.ObjectScanner)
	if !ok {
		return nil, fmt.Errorf("driver does not support object scanning")
	}

	// Find the device to extract configuration
	var targetDev *model.Device
	for _, dev := range ch.Devices {
		if dev.ID == deviceID {
			targetDev = &dev
			break
		}
	}
	if targetDev == nil {
		return nil, fmt.Errorf("device not found")
	}

	if params == nil {
		params = make(map[string]any)
	}

	// Inject protocol-specific device ID into params
	// For BACnet, we need "device_id" (int)
	if ch.Protocol == "bacnet-ip" {
		// 优先使用 instance_id，其次 device_id
		if v, ok := targetDev.Config["instance_id"]; ok {
			params["device_id"] = v
		} else if v, ok := targetDev.Config["device_id"]; ok {
			params["device_id"] = v
		}
		// Also pass IP if available (for unicast optimization)
		if v, ok := targetDev.Config["ip"]; ok {
			params["ip"] = v
		}
	} else if ch.Protocol == "opc-ua" {
		merged := model.MergeOpcUaDeviceConfig(ch.Config, targetDev.Config)
		for k, v := range merged {
			params[k] = v
		}
	}

	if okMu {
		mu.Lock()
		defer mu.Unlock()
	}

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second) // Increased timeout for object scan
	defer cancel()

	return scanner.ScanObjects(ctx, params)
}

// AddDevice 添加设备到通道
func (cm *ChannelManager) AddDevice(channelID string, dev *model.Device) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if err := model.EnsureDeviceID(dev); err != nil {
		return err
	}

	ch, ok := cm.channels[channelID]
	if !ok {
		return fmt.Errorf("channel not found")
	}

	// 检查设备是否存在
	for _, d := range ch.Devices {
		if d.ID == dev.ID {
			return fmt.Errorf("device %s already exists", dev.ID)
		}
		// Check for duplicate BACnet Device Instance ID
		if ch.Protocol == "bacnet-ip" {
			newID, okNew := getDeviceID(dev.Config)
			oldID, okOld := getDeviceID(d.Config)
			if okNew && okOld && newID == oldID {
				return fmt.Errorf("BACnet device with Instance ID %d already exists", newID)
			}
		}
	}

	if (ch.Protocol == "modbus-tcp" || ch.Protocol == "modbus-rtu" || ch.Protocol == "modbus-rtu-over-tcp") && dev.Config != nil {
		if _, ok := dev.Config["auto_points_range"]; ok {
			cm.autoGenerateModbusPointsFromConfig(dev)
		}
	}

	if ch.Protocol == "opc-ua" {
		if dev.Config == nil {
			dev.Config = make(map[string]any)
		}
		dev.Config = model.MergeOpcUaDeviceConfig(ch.Config, dev.Config)
	}

	// DL/T645 Auto-create points
	if ch.Protocol == "dlt645" && len(dev.Points) == 0 {
		// Try to get device address from config
		addrStr := ""
		if addr, ok := dev.Config["station_address"]; ok {
			addrStr = fmt.Sprintf("%v", addr)
		} else if addr, ok := dev.Config["address"]; ok {
			// Fallback if user used "address"
			addrStr = fmt.Sprintf("%v", addr)
		}

		if addrStr != "" {
			// Define default points
			defaultPoints := []model.Point{
				{
					Name:      "A 相电压",
					ID:        "a_phase_voltage",
					Address:   fmt.Sprintf("%s#02-01-01-00", addrStr),
					DataType:  "uint16",
					ReadWrite: "R",
					Scale:     0.1,
					Unit:      "V",
				},
				{
					Name:      "A 相电流",
					ID:        "a_phase_current",
					Address:   fmt.Sprintf("%s#02-02-01-00", addrStr),
					DataType:  "uint32",
					ReadWrite: "R",
					Scale:     0.001,
					Unit:      "A",
				},
				{
					Name:      "瞬时 A 相有功功率",
					ID:        "instant_a_active_power",
					Address:   fmt.Sprintf("%s#02-03-01-00", addrStr),
					DataType:  "uint32",
					ReadWrite: "R",
					Scale:     0.0001,
					Unit:      "kW",
				},
			}

			// Validate and append
			for _, p := range defaultPoints {
				p.DeviceID = dev.ID
				if err := cm.validateDLT645Point(&p); err == nil {
					dev.Points = append(dev.Points, p)
				} else {
					zap.L().Warn("Failed to validate default DLT645 point", zap.String("point", p.Name), zap.Error(err))
				}
			}
		}
	}

	// 格式化配置（修正科学计数法等问题）
	sanitizeDeviceConfig(dev.Config)

	// 初始化运行时
	dev.StopChan = make(chan struct{})

	// 添加到列表
	ch.Devices = append(ch.Devices, *dev)

	// 注册到状态管理器
	cm.stateManager.RegisterNode(dev.ID, dev.Name)
	cm.tagRegistry.RegisterFromDevice(ch.ID, &ch.Devices[len(ch.Devices)-1])

	// 如果通道已启用且驱动已就绪，注册到ScanEngine
	if _, ok := cm.drivers[channelID]; ok && ch.Enable && dev.Enable {
		newDev := &ch.Devices[len(ch.Devices)-1]
		if err := cm.registerDeviceToScanEngine(ch, newDev); err != nil {
			zap.L().Error("Failed to register device to ScanEngine", zap.String("device", dev.Name), zap.Error(err))
		} else {
			zap.L().Info("Device started via ScanEngine", zap.String("device", dev.Name))
		}
	}

	cm.notifyTopologyChange()
	return cm.saveChannels()
}

// BatchAddModbusSlavesResult 批量添加 Modbus 从站结果。
type BatchAddModbusSlavesResult struct {
	Created []model.Device
	Skipped []int // slave_id
	Errors  []string
}

// BatchAddModbusSlaves 批量添加 Modbus 从站（单次持久化，跳过已存在设备）。
func (cm *ChannelManager) BatchAddModbusSlaves(channelID string, slaveStart, slaveEnd, regStart, regEnd int, interval model.Duration, enable bool, datatype, readwrite string, regType model.RegisterType, fc byte) (*BatchAddModbusSlavesResult, error) {
	if slaveEnd < slaveStart {
		slaveStart, slaveEnd = slaveEnd, slaveStart
	}
	if regEnd < regStart {
		regStart, regEnd = regEnd, regStart
	}

	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return nil, fmt.Errorf("channel not found")
	}
	if ch.Protocol != "modbus-tcp" && ch.Protocol != "modbus-rtu" && ch.Protocol != "modbus-rtu-over-tcp" {
		return nil, fmt.Errorf("channel protocol %s is not modbus", ch.Protocol)
	}

	existingID := make(map[string]struct{}, len(ch.Devices))
	for _, d := range ch.Devices {
		existingID[d.ID] = struct{}{}
	}

	result := &BatchAddModbusSlavesResult{
		Created: make([]model.Device, 0),
		Skipped: make([]int, 0),
		Errors:  make([]string, 0),
	}

	if datatype == "" {
		datatype = "int16"
	}
	if readwrite == "" {
		readwrite = "R"
	}
	if fc == 0 {
		fc = regType.FunctionCode()
	}

	for slave := slaveStart; slave <= slaveEnd; slave++ {
		devID := fmt.Sprintf("modbus-slave-%d", slave)
		if _, exists := existingID[devID]; exists {
			result.Skipped = append(result.Skipped, slave)
			continue
		}

		dev := model.Device{
			ID:       devID,
			Name:     fmt.Sprintf("Modbus 从站 %d", slave),
			Enable:   enable,
			Interval: interval,
			Config: map[string]any{
				"slave_id":                  slave,
				"auto_points_range":         fmt.Sprintf("%d-%d", regStart, regEnd),
				"auto_points_datatype":      datatype,
				"auto_points_readwrite":     readwrite,
				"auto_points_register_type": regType.ShortString(),
				"auto_points_function_code": int(fc),
			},
		}
		if err := model.EnsureDeviceID(&dev); err != nil {
			result.Errors = append(result.Errors, fmt.Sprintf("slave %d: %v", slave, err))
			continue
		}

		cm.autoGenerateModbusPointsFromConfig(&dev)
		sanitizeDeviceConfig(dev.Config)
		dev.StopChan = make(chan struct{})

		ch.Devices = append(ch.Devices, dev)
		existingID[devID] = struct{}{}
		newDev := &ch.Devices[len(ch.Devices)-1]
		cm.stateManager.RegisterNode(dev.ID, dev.Name)
		cm.tagRegistry.RegisterFromDevice(ch.ID, newDev)

		if _, ok := cm.drivers[channelID]; ok && ch.Enable && dev.Enable {
			if err := cm.registerDeviceToScanEngine(ch, newDev); err != nil {
				zap.L().Error("Failed to register device to ScanEngine",
					zap.String("device", dev.Name), zap.Error(err))
				result.Errors = append(result.Errors, fmt.Sprintf("slave %d register: %v", slave, err))
			}
		}

		result.Created = append(result.Created, dev)
	}

	shouldActivate := len(result.Created) > 0 && ch.Enable

	if len(result.Created) == 0 && len(result.Skipped) == 0 && len(result.Errors) > 0 {
		return result, fmt.Errorf("%s", result.Errors[0])
	}

	if err := cm.saveChannels(); err != nil {
		return result, err
	}

	if shouldActivate {
		cm.scanEngineAdapter.Start()
		cm.tryConnectChannel(channelID)
	}

	cm.notifyTopologyChange()
	return result, nil
}

// AddPoint 添加点位到设备
func (cm *ChannelManager) AddPoint(channelID, deviceID string, point *model.Point) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return fmt.Errorf("channel not found")
	}

	idx := -1
	for i, d := range ch.Devices {
		if d.ID == deviceID {
			idx = i
			break
		}
	}
	if idx == -1 {
		return fmt.Errorf("device not found")
	}

	if err := model.EnsurePointID(point); err != nil {
		return err
	}

	dev := &ch.Devices[idx]

	// Check if point ID already exists
	for _, p := range dev.Points {
		if p.ID == point.ID {
			return fmt.Errorf("point %s already exists", point.ID)
		}
	}

	// Validate point based on protocol
	if err := cm.validatePoint(ch, point); err != nil {
		return err
	}

	// Add point
	dev.Points = append(dev.Points, *point)

	return cm.restartDeviceLocked(ch, idx)
}

// AddPoints 批量添加点位到设备（单次重启）
func (cm *ChannelManager) AddPoints(channelID, deviceID string, points []model.Point) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return fmt.Errorf("channel not found")
	}

	idx := -1
	for i, d := range ch.Devices {
		if d.ID == deviceID {
			idx = i
			break
		}
	}
	if idx == -1 {
		return fmt.Errorf("device not found")
	}

	dev := &ch.Devices[idx]

	// 预检查：ID 冲突 & 校验
	for i := range points {
		if err := model.EnsurePointID(&points[i]); err != nil {
			return err
		}

		// ID 冲突检测
		for _, existing := range dev.Points {
			if existing.ID == points[i].ID {
				return fmt.Errorf("point %s already exists", points[i].ID)
			}
		}

		// 协议级校验
		if err := cm.validatePoint(ch, &points[i]); err != nil {
			return err
		}
	}

	// 追加到设备点位列表
	dev.Points = append(dev.Points, points...)

	return cm.restartDeviceLocked(ch, idx)
}

// pointUpdateRequiresDeviceRestart 判断点位变更是否影响南向采集任务（需重启设备）。
// 仅元数据变更（如读写权限、名称、单位）时返回 false，此时只重建北向 OPC UA 服务。
func pointUpdateRequiresDeviceRestart(before, after model.Point) bool {
	if before.Address != after.Address ||
		before.DataType != after.DataType ||
		before.RegisterType != after.RegisterType ||
		before.FunctionCode != after.FunctionCode ||
		before.Format != after.Format ||
		before.WordOrder != after.WordOrder ||
		before.ReadFormula != after.ReadFormula ||
		before.WriteFormula != after.WriteFormula ||
		before.Scale != after.Scale ||
		before.Offset != after.Offset ||
		before.ScanClass != after.ScanClass ||
		before.ReportMode != after.ReportMode ||
		before.Group != after.Group {
		return true
	}
	return false
}

// UpdatePoint 更新设备点位。返回值 deviceRestarted 表示是否重启了南向采集设备；
// 北向 OPC UA 地址空间会在保存后异步重建（仅重启 OPC UA 服务，不重启网关主进程）。
func (cm *ChannelManager) UpdatePoint(channelID, deviceID string, point *model.Point) (deviceRestarted bool, err error) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return false, fmt.Errorf("channel not found")
	}

	idx := -1
	for i, d := range ch.Devices {
		if d.ID == deviceID {
			idx = i
			break
		}
	}
	if idx == -1 {
		return false, fmt.Errorf("device not found")
	}

	dev := &ch.Devices[idx]

	if err := cm.validatePoint(ch, point); err != nil {
		return false, err
	}

	pointIdx := -1
	for i, p := range dev.Points {
		if p.ID == point.ID {
			pointIdx = i
			break
		}
	}
	if pointIdx == -1 {
		return false, fmt.Errorf("point not found")
	}

	before := dev.Points[pointIdx]
	dev.Points[pointIdx] = *point

	if pointUpdateRequiresDeviceRestart(before, *point) {
		if err := cm.restartDeviceLocked(ch, idx); err != nil {
			return true, err
		}
		return true, nil
	}

	if err := cm.saveChannels(); err != nil {
		return false, err
	}
	zap.L().Info("Point metadata updated, syncing northbound OPC UA only",
		zap.String("channel", channelID),
		zap.String("device", deviceID),
		zap.String("point", point.ID),
	)
	cm.notifyTopologyChange()
	return false, nil
}

// RemovePoint 删除设备点位
func (cm *ChannelManager) RemovePoint(channelID, deviceID, pointID string) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return fmt.Errorf("channel not found")
	}

	idx := -1
	for i, d := range ch.Devices {
		if d.ID == deviceID {
			idx = i
			break
		}
	}
	if idx == -1 {
		return fmt.Errorf("device not found")
	}

	dev := &ch.Devices[idx]

	// Find and remove point
	pointIdx := -1
	for i, p := range dev.Points {
		if p.ID == pointID {
			pointIdx = i
			break
		}
	}
	if pointIdx == -1 {
		return fmt.Errorf("point not found")
	}

	dev.Points = append(dev.Points[:pointIdx], dev.Points[pointIdx+1:]...)

	return cm.restartDeviceLocked(ch, idx)
}

// RemovePoints 批量删除设备点位
func (cm *ChannelManager) RemovePoints(channelID, deviceID string, pointIDs []string) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return fmt.Errorf("channel not found")
	}

	idx := -1
	for i, d := range ch.Devices {
		if d.ID == deviceID {
			idx = i
			break
		}
	}
	if idx == -1 {
		return fmt.Errorf("device not found")
	}

	dev := &ch.Devices[idx]

	// Find and remove points
	newPoints := make([]model.Point, 0, len(dev.Points))
	idMap := make(map[string]bool)
	for _, id := range pointIDs {
		idMap[id] = true
	}

	removedCount := 0
	for _, p := range dev.Points {
		if !idMap[p.ID] {
			newPoints = append(newPoints, p)
		} else {
			removedCount++
		}
	}

	if removedCount == 0 {
		return fmt.Errorf("no points found to remove")
	}

	dev.Points = newPoints

	return cm.restartDeviceLocked(ch, idx)
}

// restartDeviceLocked 重启设备（需在持有锁的情况下调用）
func (cm *ChannelManager) restartDeviceLocked(ch *model.Channel, deviceIdx int) error {
	dev := &ch.Devices[deviceIdx]

	// 通过ScanEngine重新注册设备
	if _, ok := cm.drivers[ch.ID]; ok && ch.Enable && dev.Enable {
		cm.scanEngineAdapter.UnregisterDevice(dev.ID)
		if err := cm.registerDeviceToScanEngine(ch, dev); err != nil {
			zap.L().Error("Failed to restart device via ScanEngine", zap.String("device", dev.Name), zap.Error(err))
		} else {
			zap.L().Info("Device restarted via ScanEngine with updated points", zap.String("device", dev.Name))
		}
	}

	if err := cm.saveChannels(); err != nil {
		return err
	}
	cm.notifyTopologyChange()
	return nil
}

// UpdateDevice 更新通道下的设备
func (cm *ChannelManager) UpdateDevice(channelID string, dev *model.Device) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return fmt.Errorf("channel not found")
	}

	// 查找设备索引
	idx := -1
	for i, d := range ch.Devices {
		if d.ID == dev.ID {
			idx = i
			break
		}
	}
	if idx == -1 {
		return fmt.Errorf("device not found")
	}

	// 停止旧设备
	oldDev := &ch.Devices[idx]
	select {
	case oldDev.StopChan <- struct{}{}:
	default:
	}

	// 格式化配置
	sanitizeDeviceConfig(dev.Config)

	// 初始化新设备运行时
	dev.StopChan = make(chan struct{})

	// 替换
	ch.Devices[idx] = *dev

	// 如果启用，通过ScanEngine重新注册
	if _, ok := cm.drivers[channelID]; ok && ch.Enable && dev.Enable {
		newDev := &ch.Devices[idx]
		cm.scanEngineAdapter.UnregisterDevice(oldDev.ID)
		if err := cm.registerDeviceToScanEngine(ch, newDev); err != nil {
			zap.L().Error("Failed to register device to ScanEngine", zap.String("device", dev.Name), zap.Error(err))
		} else {
			zap.L().Info("Device restarted via ScanEngine", zap.String("device", dev.Name))
		}
	}

	cm.notifyTopologyChange()
	return cm.saveChannels()
}

// RemoveDevice 删除设备
func (cm *ChannelManager) RemoveDevice(channelID, deviceID string) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return fmt.Errorf("channel not found")
	}

	idx := -1
	for i, d := range ch.Devices {
		if d.ID == deviceID {
			idx = i
			break
		}
	}
	if idx == -1 {
		return fmt.Errorf("device not found")
	}

	// 停止设备
	oldDev := &ch.Devices[idx]
	cm.scanEngineAdapter.UnregisterDevice(oldDev.ID)
	select {
	case oldDev.StopChan <- struct{}{}:
	default:
	}

	// 从切片移除
	ch.Devices = append(ch.Devices[:idx], ch.Devices[idx+1:]...)

	cm.notifyTopologyChange()
	return cm.saveChannels()
}

// RemoveDevices 批量删除设备
func (cm *ChannelManager) RemoveDevices(channelID string, deviceIDs []string) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return fmt.Errorf("channel not found")
	}

	toRemove := make(map[string]bool)
	for _, id := range deviceIDs {
		toRemove[id] = true
	}

	newDevices := make([]model.Device, 0)
	for _, d := range ch.Devices {
		if toRemove[d.ID] {
			cm.scanEngineAdapter.UnregisterDevice(d.ID)
			// 停止
			select {
			case d.StopChan <- struct{}{}:
			default:
			}
		} else {
			newDevices = append(newDevices, d)
		}
	}
	ch.Devices = newDevices

	return cm.saveChannels()
}

// saveChannels 辅助方法：保存所有通道配置
func (cm *ChannelManager) saveChannels() error {
	if cm.saveFunc != nil {
		channels := make([]model.Channel, 0, len(cm.channels))
		for _, c := range cm.channels {
			channels = append(channels, *c)
		}
		// Debug: log format/word_order for points being saved to help troubleshoot persistence issues
		for _, c := range channels {
			for _, d := range c.Devices {
				for _, p := range d.Points {
					zap.L().Debug("Saving point config",
						zap.String("channel", c.ID),
						zap.String("device", d.ID),
						zap.String("point", p.ID),
						zap.String("format", p.Format),
						zap.String("word_order", p.WordOrder),
					)
				}
			}
		}
		if err := cm.saveFunc(channels); err != nil {
			zap.L().Warn("Failed to save config", zap.Error(err))
			return err
		}
	}
	return nil
}

// getDeviceID Helper to extract device_id from config
func getDeviceID(config map[string]any) (int, bool) {
	if v, ok := config["device_id"]; ok {
		if val, ok := v.(int); ok {
			return val, true
		} else if val, ok := v.(float64); ok {
			return int(val), true
		}
	}
	return 0, false
}

// buildDriverDeviceConfig 构建传给驱动的设备配置（OPC UA 自动继承通道 Endpoint 等参数）。
func buildDriverDeviceConfig(ch *model.Channel, deviceConfig map[string]any, extra map[string]any) map[string]any {
	base := make(map[string]any)
	for k, v := range deviceConfig {
		base[k] = v
	}
	if ch != nil && ch.Protocol == "opc-ua" {
		base = model.MergeOpcUaDeviceConfig(ch.Config, base)
	}
	for k, v := range extra {
		base[k] = v
	}
	return base
}

// normalizeModbusChannelConfig 规范化 Modbus TCP 通道连接 URL（补全 tcp:// scheme）。
func normalizeModbusChannelConfig(config map[string]any) {
	if config == nil {
		return
	}
	url, ok := config["url"].(string)
	if !ok || url == "" {
		return
	}
	url = strings.TrimSpace(url)
	if strings.Contains(url, "://") {
		config["url"] = url
		return
	}
	config["url"] = "tcp://" + url
}

// sanitizeDeviceConfig 修正配置中的数值类型（如去除科学计数法）
func sanitizeDeviceConfig(config map[string]any) {
	if config == nil {
		return
	}
	// 处理 device_id (防止 float64 科学计数法保存)
	if val, ok := config["device_id"]; ok {
		switch v := val.(type) {
		case float64:
			config["device_id"] = int(v)
		case float32:
			config["device_id"] = int(v)
		}
	}
	// 处理 network_number
	if val, ok := config["network_number"]; ok {
		switch v := val.(type) {
		case float64:
			config["network_number"] = int(v)
		case float32:
			config["network_number"] = int(v)
		}
	}
}

func (cm *ChannelManager) autoGenerateModbusPointsFromConfig(dev *model.Device) {
	opts, ok := modbusGenOptionsFromDevice(dev)
	if !ok {
		return
	}
	dev.Points = GenerateModbusRegisterPoints(dev.Points, opts, true)
}

// GenerateDeviceRegisterPoints 为设备批量生成 Modbus 寄存器点位并持久化。
// mode: merge（保留同 ID 现有点）| replace（仅保留新区间点位）。
func (cm *ChannelManager) GenerateDeviceRegisterPoints(channelID, deviceID string, opts ModbusRegisterGenOptions, mode string) (*model.Device, error) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	ch, ok := cm.channels[channelID]
	if !ok {
		return nil, fmt.Errorf("channel not found")
	}
	if ch.Protocol != "modbus-tcp" && ch.Protocol != "modbus-rtu" && ch.Protocol != "modbus-rtu-over-tcp" {
		return nil, fmt.Errorf("channel protocol %s is not modbus", ch.Protocol)
	}

	idx := -1
	for i, d := range ch.Devices {
		if d.ID == deviceID {
			idx = i
			break
		}
	}
	if idx < 0 {
		return nil, fmt.Errorf("device not found")
	}

	dev := &ch.Devices[idx]
	opts.DeviceID = dev.ID
	merge := mode != "replace"
	dev.Points = GenerateModbusRegisterPoints(dev.Points, opts, merge)

	if dev.Config == nil {
		dev.Config = make(map[string]any)
	}
	dev.Config["auto_points_range"] = fmt.Sprintf("%d-%d", opts.Start, opts.End)
	dev.Config["auto_points_datatype"] = opts.DataType
	dev.Config["auto_points_readwrite"] = opts.ReadWrite
	dev.Config["auto_points_register_type"] = opts.RegisterType.ShortString()
	dev.Config["auto_points_function_code"] = int(opts.FunctionCode)

	if err := cm.restartDeviceLocked(ch, idx); err != nil {
		return nil, err
	}
	out := ch.Devices[idx]
	return &out, nil
}
