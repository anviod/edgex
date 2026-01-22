package core

import (
	"context"
	"fmt"
	drv "industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"sync"
	"time"
)

// ChannelManager 管理所有采集通道及其下的设备
type ChannelManager struct {
	channels     map[string]*model.Channel // channel.id -> channel
	drivers      map[string]drv.Driver     // channel.id -> driver
	driverMus    map[string]*sync.Mutex    // channel.id -> mutex for driver access
	pipeline     *DataPipeline
	stateManager *CommunicationManageTemplate
	mu           sync.RWMutex
	ctx          context.Context
	cancel       context.CancelFunc
	saveFunc     func([]model.Channel) error
}

func NewChannelManager(pipeline *DataPipeline, saveFunc func([]model.Channel) error) *ChannelManager {
	ctx, cancel := context.WithCancel(context.Background())
	return &ChannelManager{
		channels:     make(map[string]*model.Channel),
		drivers:      make(map[string]drv.Driver),
		driverMus:    make(map[string]*sync.Mutex),
		pipeline:     pipeline,
		stateManager: NewCommunicationManageTemplate(),
		ctx:          ctx,
		cancel:       cancel,
		saveFunc:     saveFunc,
	}
}

// AddChannel 添加一个采集通道
func (cm *ChannelManager) AddChannel(ch *model.Channel) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if _, exists := cm.channels[ch.ID]; exists {
		return fmt.Errorf("channel %s already exists", ch.ID)
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
	cm.drivers[ch.ID] = d
	cm.driverMus[ch.ID] = &sync.Mutex{}
	cm.stateManager.RegisterNode(ch.ID, ch.Name)

	// Persist
	if cm.saveFunc != nil {
		channels := make([]model.Channel, 0, len(cm.channels))
		for _, c := range cm.channels {
			channels = append(channels, *c)
		}
		// Since map iteration order is random, this might reshuffle channels in config.
		// For now it's acceptable, or we can maintain order if needed.
		if err := cm.saveFunc(channels); err != nil {
			log.Printf("Warning: Failed to save config after adding channel: %v", err)
		}
	}

	log.Printf("Channel %s added (Protocol: %s, Devices: %d)", ch.Name, ch.Protocol, len(ch.Devices))
	return nil
}

// UpdateChannel 更新采集通道
func (cm *ChannelManager) UpdateChannel(ch *model.Channel) error {
	// 1. Stop existing channel
	if err := cm.StopChannel(ch.ID); err != nil {
		// Ignore error if channel was not running or found (but we should check existence)
		log.Printf("Warning: stopping channel %s before update: %v", ch.ID, err)
	}

	cm.mu.Lock()
	defer cm.mu.Unlock()

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
	cm.drivers[ch.ID] = d
	if _, ok := cm.driverMus[ch.ID]; !ok {
		cm.driverMus[ch.ID] = &sync.Mutex{}
	}

	// 4. Persist
	if cm.saveFunc != nil {
		channels := make([]model.Channel, 0, len(cm.channels))
		for _, c := range cm.channels {
			channels = append(channels, *c)
		}
		if err := cm.saveFunc(channels); err != nil {
			log.Printf("Warning: Failed to save config after updating channel: %v", err)
		}
	}

	log.Printf("Channel %s updated", ch.Name)
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
			log.Printf("Warning: Failed to save config after removing channel: %v", err)
		}
	}

	log.Printf("Channel %s removed", channelID)
	return nil
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
		return fmt.Errorf("channel is disabled")
	}

	// 连接驱动
	err := d.Connect(cm.ctx)
	if err != nil {
		log.Printf("Failed to connect driver for channel %s: %v", ch.Name, err)
		return err
	}
	log.Printf("Driver connected for channel %s", ch.Name)

	// 为该通道下的每个设备启动采集循环
	for _, device := range ch.Devices {
		if !device.Enable {
			log.Printf("Device %s in channel %s is disabled, skipping", device.Name, ch.Name)
			continue
		}

		// 复制设备以避免循环变量问题
		dev := device
		dev.StopChan = make(chan struct{})

		// 在 goroutine 中启动设备采集循环
		go cm.deviceLoop(&dev, d, ch)
	}

	log.Printf("Channel %s started with %d devices", ch.Name, len(ch.Devices))
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

	// 通知所有设备停止
	for _, device := range ch.Devices {
		select {
		case device.StopChan <- struct{}{}:
			log.Printf("Device %s stopping...", device.Name)
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
		channels = append(channels, *ch)
	}
	return channels
}

// GetChannel 获取指定通道
func (cm *ChannelManager) GetChannel(channelID string) *model.Channel {
	cm.mu.RLock()
	defer cm.mu.RUnlock()
	return cm.channels[channelID]
}

// GetChannelDevices 获取指定通道的所有设备
func (cm *ChannelManager) GetChannelDevices(channelID string) []model.Device {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	if ch, ok := cm.channels[channelID]; ok {
		return ch.Devices
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
				return &ch.Devices[i]
			}
		}
	}
	return nil
}

// GetDevicePoints 获取指定设备的所有点位数据
func (cm *ChannelManager) GetDevicePoints(channelID, deviceID string) ([]model.PointData, error) {
	cm.mu.RLock()
	_, ok := cm.channels[channelID]
	d, okDrv := cm.drivers[channelID]
	mu, okMu := cm.driverMus[channelID]
	cm.mu.RUnlock()

	if !ok || !okDrv {
		return nil, fmt.Errorf("channel not found")
	}

	dev := cm.GetDevice(channelID, deviceID)
	if dev == nil {
		return nil, fmt.Errorf("device not found")
	}

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

	// 读取点位数据
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	results, err := d.ReadPoints(ctx, dev.Points)
	if err != nil {
		return nil, fmt.Errorf("failed to read points: %v", err)
	}

	// 转换为 PointData 格式
	points := make([]model.PointData, 0, len(dev.Points))
	now := time.Now()

	// 构建结果 map 以便快速查找
	resultMap := make(map[string]model.Value)
	for _, result := range results {
		resultMap[result.PointID] = result
	}

	// 按配置顺序返回点位数据
	for _, point := range dev.Points {
		pd := model.PointData{
			ID:        point.ID,
			Name:      point.Name,
			Address:   point.Address,
			DataType:  point.DataType,
			Unit:      point.Unit,
			Timestamp: now,
			Quality:   "Good",
			Value:     0.0,
			ReadWrite: point.ReadWrite,
		}

		// 从结果中获取实际读取的值
		if result, exists := resultMap[point.ID]; exists {
			pd.Value = result.Value
			pd.Quality = result.Quality
			if !result.TS.IsZero() {
				pd.Timestamp = result.TS
			}
		}

		points = append(points, pd)
	}

	return points, nil
}

// deviceLoop 设备采集循环
func (cm *ChannelManager) deviceLoop(dev *model.Device, d drv.Driver, ch *model.Channel) {
	ticker := time.NewTicker(time.Duration(dev.Interval))
	defer ticker.Stop()

	node := cm.stateManager.GetNode(ch.ID)
	if node == nil {
		log.Printf("Channel %s node not found in state manager", ch.Name)
		return
	}

	for {
		select {
		case <-cm.ctx.Done():
			return
		case <-dev.StopChan:
			return
		case <-ticker.C:
			if !cm.stateManager.ShouldCollect(node) {
				log.Printf("Channel %s skipped collection (State: %v, NextRetry: %v)",
					ch.Name, node.Runtime.State, node.Runtime.NextRetryTime)
				continue
			}

			cm.collectDevice(dev, d, ch, node)
		}
	}
}

// collectDevice 从设备采集数据
func (cm *ChannelManager) collectDevice(dev *model.Device, d drv.Driver, ch *model.Channel, node *DeviceNodeTemplate) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 获取驱动互斥锁
	cm.mu.RLock()
	mu, okMu := cm.driverMus[ch.ID]
	cm.mu.RUnlock()

	if okMu {
		mu.Lock()
		defer mu.Unlock()
	}

	// 设置从机 ID
	if slaveID, ok := dev.Config["slave_id"]; ok {
		if slaveIDUint, ok := slaveID.(float64); ok {
			d.SetSlaveID(uint8(slaveIDUint))
		} else if slaveIDInt, ok := slaveID.(int); ok {
			d.SetSlaveID(uint8(slaveIDInt))
		}
	}

	// 设置设备配置 (BACnet 等需要 IP/Port)
	d.SetDeviceConfig(dev.Config)

	// 读取点位数据
	results, err := d.ReadPoints(ctx, dev.Points)
	if err != nil {
		log.Printf("Error reading from device %s in channel %s: %v", dev.Name, ch.Name, err)
		// cm.stateManager.onCollectFail(node) // TODO: 需要创建 DeviceNodeTemplate
		return
	}

	// 发送到管道
	now := time.Now()
	for _, result := range results {
		val := model.Value{
			ChannelID: ch.ID,
			DeviceID:  dev.ID,
			PointID:   result.PointID,
			Value:     result.Value,
			Quality:   result.Quality,
			TS:        now,
		}
		// 推入数据管道，驱动存储与WebSocket广播
		cm.pipeline.Push(val)
	}

	// cm.stateManager.onCollectSuccess(node) // TODO: 需要创建 DeviceNodeTemplate
}

// WritePoint 写入指定通道下设备点位的值
func (cm *ChannelManager) WritePoint(channelID, deviceID, pointID string, value any) error {
	cm.mu.RLock()
	_, ok := cm.channels[channelID]
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
	d.SetDeviceConfig(dev.Config)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return d.WritePoint(ctx, targetPoint, value)
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
	cm.mu.RUnlock()

	if !okDrv {
		return nil, fmt.Errorf("channel driver not found")
	}

	// Cast to Scanner
	scanner, ok := d.(drv.Scanner)
	if !ok {
		return nil, fmt.Errorf("driver does not support scanning")
	}

	if okMu {
		mu.Lock()
		defer mu.Unlock()
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return scanner.Scan(ctx, params)
}
