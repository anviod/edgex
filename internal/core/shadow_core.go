package core

import (
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/anviod/edgex/internal/model"
)

const VirtualShadowPrefix = "virtual-"

func IsVirtualShadowID(shadowDeviceID string) bool {
	return strings.HasPrefix(shadowDeviceID, VirtualShadowPrefix)
}

func VirtualShadowID(virtualDeviceID string) string {
	return VirtualShadowPrefix + virtualDeviceID
}

type ShadowSubscriber func(deviceID string, points map[string]model.ShadowPoint)

func deepCloneValue(value any) any {
	if value == nil {
		return nil
	}

	switch v := value.(type) {
	case map[string]any:
		result := make(map[string]any, len(v))
		for key, val := range v {
			result[key] = deepCloneValue(val)
		}
		return result
	case map[any]any:
		result := make(map[any]any, len(v))
		for key, val := range v {
			result[key] = deepCloneValue(val)
		}
		return result
	case []any:
		result := make([]any, len(v))
		for i, val := range v {
			result[i] = deepCloneValue(val)
		}
		return result
	default:
		return value
	}
}

func cloneShadowPoints(src map[string]model.ShadowPoint) map[string]model.ShadowPoint {
	if src == nil {
		return nil
	}
	dst := make(map[string]model.ShadowPoint, len(src))
	for k, v := range src {
		cloned := v
		cloned.Value = deepCloneValue(v.Value)
		dst[k] = cloned
	}
	return dst
}

func cloneCommunicationProfile(profile *model.DeviceCommunicationProfile) *model.DeviceCommunicationProfile {
	if profile == nil {
		return nil
	}
	result := *profile
	if profile.ProtocolParams != nil {
		result.ProtocolParams = make(map[string]interface{}, len(profile.ProtocolParams))
		for k, v := range profile.ProtocolParams {
			result.ProtocolParams[k] = deepCloneValue(v)
		}
	}
	if profile.RTTSamples != nil {
		result.RTTSamples = make([]int64, len(profile.RTTSamples))
		copy(result.RTTSamples, profile.RTTSamples)
	}
	return &result
}

func cloneShadowDevice(device *model.ShadowDevice) *model.ShadowDevice {
	if device == nil {
		return nil
	}
	copy := *device
	copy.Points = cloneShadowPoints(device.Points)
	copy.CommunicationProfile = cloneCommunicationProfile(device.CommunicationProfile)
	return &copy
}

// ShadowCore 维护每物理设备唯一的内存态影子设备（全量点位 + 通信画像），不落盘。
type ShadowCore struct {
	mu sync.RWMutex

	realShadows    map[string]*model.ShadowDevice
	virtualShadows map[string]*model.VirtualDevice

	subscribers []ShadowSubscriber
	subMu       sync.RWMutex

	versionCounter uint64

	optimizer *ShadowDeviceOptimizer
}

func NewShadowCore() *ShadowCore {
	return &ShadowCore{
		realShadows:    make(map[string]*model.ShadowDevice),
		virtualShadows: make(map[string]*model.VirtualDevice),
		subscribers:    make([]ShadowSubscriber, 0),
		optimizer:      NewShadowDeviceOptimizer(),
	}
}

func (sc *ShadowCore) Start() {
	log.Println("[ShadowCore] Started (memory-only)")
}

func (sc *ShadowCore) Stop() {
	log.Println("[ShadowCore] Stopped")
}

func (sc *ShadowCore) WriteShadowDevice(msg model.ShadowIngressMessage) (*model.ShadowWriteResponse, error) {
	sc.mu.Lock()
	defer sc.mu.Unlock()

	shadowDeviceID := fmt.Sprintf("shadow-%s", msg.DeviceID)

	device, exists := sc.realShadows[shadowDeviceID]
	if !exists {
		device = &model.ShadowDevice{
			ShadowDeviceID:   shadowDeviceID,
			PhysicalDeviceID: msg.DeviceID,
			ChannelID:        msg.ChannelID,
			Version:          0,
			Points:           make(map[string]model.ShadowPoint),
		}
		sc.realShadows[shadowDeviceID] = device
	}

	sc.versionCounter++
	device.Version = sc.versionCounter
	device.UpdatedAt = time.Now()
	now := device.UpdatedAt

	changed := make(map[string]model.ShadowPoint, len(msg.Points))
	for _, point := range msg.Points {
		collectedAt := point.CollectedAt
		if collectedAt.IsZero() {
			collectedAt = msg.Timestamp
		}
		if collectedAt.IsZero() {
			collectedAt = now
		}
		shadowPoint := model.ShadowPoint{
			Value:          point.Value,
			Unit:           point.Unit,
			Quality:        point.Quality,
			Degraded:       point.Degraded,
			SamplePeriodMs: point.SamplePeriodMs,
			Timestamp:      collectedAt,
			CollectedAt:    collectedAt,
			UpdatedAt:      now,
			Version:        device.Version,
		}
		device.Points[point.PointID] = shadowPoint
		changed[point.PointID] = shadowPoint
	}

	sc.optimizer.UpdateShadowDeviceProfile(device)

	go sc.notifySubscribers(shadowDeviceID, cloneShadowPoints(changed))

	return &model.ShadowWriteResponse{
		Success:   true,
		Version:   device.Version,
		Timestamp: device.UpdatedAt,
	}, nil
}

// UpdateDeviceRTT 更新设备的RTT数据
func (sc *ShadowCore) UpdateDeviceRTT(deviceID string, rtt int64) {
	sc.optimizer.UpdateDeviceRTT(deviceID, rtt)
	shadowDeviceID := fmt.Sprintf("shadow-%s", deviceID)
	sc.mu.RLock()
	device, exists := sc.realShadows[shadowDeviceID]
	sc.mu.RUnlock()

	if exists {
		sc.mu.Lock()
		sc.optimizer.UpdateShadowDeviceProfile(device)
		sc.mu.Unlock()
	}
}

// GetDeviceOptimization 返回设备 RTT/MTU/Gap 通信画像（微秒 RTT）。
func (sc *ShadowCore) GetDeviceOptimization(deviceID string) map[string]interface{} {
	if sc == nil || sc.optimizer == nil {
		return nil
	}
	return sc.optimizer.GetDeviceOptimization(deviceID)
}

func (sc *ShadowCore) WriteShadowPoint(req model.ShadowWriteRequest) (*model.ShadowWriteResponse, error) {
	sc.mu.Lock()
	defer sc.mu.Unlock()

	device, exists := sc.realShadows[req.ShadowDeviceID]
	if !exists {
		return nil, fmt.Errorf("shadow device not found: %s", req.ShadowDeviceID)
	}

	sc.versionCounter++
	device.Version = sc.versionCounter
	device.UpdatedAt = time.Now()

	shadowPoint := model.ShadowPoint{
		Value:       req.Value,
		Timestamp:   req.Timestamp,
		CollectedAt: req.Timestamp,
		UpdatedAt:   device.UpdatedAt,
		Version:     device.Version,
		Quality:     "good",
	}
	device.Points[req.PointID] = shadowPoint

	go sc.notifySubscribers(req.ShadowDeviceID, cloneShadowPoints(device.Points))

	return &model.ShadowWriteResponse{
		Success:   true,
		Version:   device.Version,
		Timestamp: device.UpdatedAt,
	}, nil
}

func (sc *ShadowCore) GetShadowDevice(deviceID string) (*model.ShadowDevice, error) {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	device, exists := sc.realShadows[deviceID]
	if !exists {
		return nil, fmt.Errorf("shadow device not found: %s", deviceID)
	}

	return cloneShadowDevice(device), nil
}

func (sc *ShadowCore) GetAllShadowDevices() []*model.ShadowDevice {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	result := make([]*model.ShadowDevice, 0, len(sc.realShadows))
	for _, device := range sc.realShadows {
		result = append(result, cloneShadowDevice(device))
	}
	return result
}

func (sc *ShadowCore) GetShadowPoint(deviceID, pointID string) (*model.ShadowPoint, error) {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	device, exists := sc.realShadows[deviceID]
	if !exists {
		return nil, fmt.Errorf("shadow device not found: %s", deviceID)
	}

	point, exists := device.Points[pointID]
	if !exists {
		return nil, fmt.Errorf("point not found: %s", pointID)
	}

	copy := point
	return &copy, nil
}

func (sc *ShadowCore) CompareAndSwap(deviceID string, expectedVersion uint64, updates map[string]any) (*model.ShadowWriteResponse, error) {
	sc.mu.Lock()
	defer sc.mu.Unlock()

	device, exists := sc.realShadows[deviceID]
	if !exists {
		return nil, fmt.Errorf("shadow device not found: %s", deviceID)
	}

	if device.Version != expectedVersion {
		return &model.ShadowWriteResponse{
			Success: false,
			Version: device.Version,
			Error:   "version mismatch",
		}, nil
	}

	sc.versionCounter++
	device.Version = sc.versionCounter
	device.UpdatedAt = time.Now()

	for pointID, value := range updates {
		if point, exists := device.Points[pointID]; exists {
			point.Value = value
			point.Version = device.Version
			point.UpdatedAt = device.UpdatedAt
			point.Timestamp = device.UpdatedAt
			point.CollectedAt = device.UpdatedAt
			device.Points[pointID] = point
		}
	}

	go sc.notifySubscribers(deviceID, cloneShadowPoints(device.Points))

	return &model.ShadowWriteResponse{
		Success:   true,
		Version:   device.Version,
		Timestamp: device.UpdatedAt,
	}, nil
}

func (sc *ShadowCore) Subscribe(sub ShadowSubscriber) {
	sc.subMu.Lock()
	defer sc.subMu.Unlock()
	sc.subscribers = append(sc.subscribers, sub)
}

func (sc *ShadowCore) notifySubscribers(deviceID string, points map[string]model.ShadowPoint) {
	sc.subMu.RLock()
	subscribers := make([]ShadowSubscriber, len(sc.subscribers))
	copy(subscribers, sc.subscribers)
	sc.subMu.RUnlock()

	for _, sub := range subscribers {
		go sub(deviceID, points)
	}
}

func (sc *ShadowCore) CheckConsistency(deviceID string, t time.Time) (*model.ConsistencyCheckResult, error) {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	device, exists := sc.realShadows[deviceID]
	if !exists {
		return nil, fmt.Errorf("shadow device not found: %s", deviceID)
	}

	result := &model.ConsistencyCheckResult{
		Pass:       true,
		DiffPoints: make([]model.ShadowDiffPoint, 0),
	}

	for pointID, point := range device.Points {
		if point.Timestamp.Before(t) {
			continue
		}

		if point.Quality != "good" {
			result.Pass = false
			result.DiffPoints = append(result.DiffPoints, model.ShadowDiffPoint{
				PointID:  pointID,
				Field:    "quality",
				Expected: "good",
				Actual:   point.Quality,
			})
		}
	}

	if !result.Pass {
		result.DiffSource = "quality_check"
		result.RepairSuggest = "re-collect data from source"
	}

	return result, nil
}

func (sc *ShadowCore) GetMetrics() map[string]interface{} {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	return map[string]interface{}{
		"real_shadow_count":    len(sc.realShadows),
		"virtual_shadow_count": len(sc.virtualShadows),
		"version_counter":      sc.versionCounter,
	}
}

func (sc *ShadowCore) DeleteShadowDevice(deviceID string) error {
	sc.mu.Lock()
	defer sc.mu.Unlock()

	if _, exists := sc.realShadows[deviceID]; !exists {
		return fmt.Errorf("shadow device not found: %s", deviceID)
	}

	delete(sc.realShadows, deviceID)

	return nil
}

// WriteVirtualShadowDevice 将虚拟影子计算结果写入 ShadowCore 并通知订阅者（Pipeline / UI）。
func (sc *ShadowCore) WriteVirtualShadowDevice(channelID, virtualDeviceID string, points map[string]model.ShadowPoint) {
	if len(points) == 0 {
		return
	}

	sc.mu.Lock()
	vd, exists := sc.virtualShadows[virtualDeviceID]
	if !exists {
		vd = &model.VirtualDevice{
			VirtualDeviceID: virtualDeviceID,
			ChannelID:       channelID,
			Points:          make(map[string]model.ShadowPoint),
		}
		sc.virtualShadows[virtualDeviceID] = vd
	}
	if channelID != "" {
		vd.ChannelID = channelID
	}

	sc.versionCounter++
	now := time.Now()
	vd.Version = sc.versionCounter
	vd.UpdatedAt = now

	for pid, pt := range points {
		pt.Version = sc.versionCounter
		if pt.UpdatedAt.IsZero() {
			pt.UpdatedAt = now
		}
		if pt.Timestamp.IsZero() {
			pt.Timestamp = now
			pt.CollectedAt = now
		}
		if pt.Quality == "" {
			pt.Quality = "good"
		}
		vd.Points[pid] = pt
	}
	sc.mu.Unlock()

	go sc.notifySubscribers(VirtualShadowID(virtualDeviceID), cloneShadowPoints(points))
}

// ResolvePublishTarget 解析订阅通知中的 channel / device，供 ShadowBridge 与 WebSocket 使用。
func (sc *ShadowCore) ResolvePublishTarget(shadowDeviceID string) (channelID, deviceID string, err error) {
	if IsVirtualShadowID(shadowDeviceID) {
		virtualID := strings.TrimPrefix(shadowDeviceID, VirtualShadowPrefix)
		sc.mu.RLock()
		vd, ok := sc.virtualShadows[virtualID]
		sc.mu.RUnlock()
		if !ok {
			return "", "", fmt.Errorf("virtual shadow not found: %s", virtualID)
		}
		return vd.ChannelID, virtualID, nil
	}

	device, err := sc.GetShadowDevice(shadowDeviceID)
	if err != nil {
		return "", "", err
	}
	return device.ChannelID, device.PhysicalDeviceID, nil
}

// GetVirtualShadowPoint 读取虚拟影子设备单个点位。
func (sc *ShadowCore) GetVirtualShadowPoint(virtualDeviceID, pointID string) (*model.ShadowPoint, error) {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	vd, exists := sc.virtualShadows[virtualDeviceID]
	if !exists {
		return nil, fmt.Errorf("virtual shadow device not found: %s", virtualDeviceID)
	}

	point, exists := vd.Points[pointID]
	if !exists {
		return nil, fmt.Errorf("point not found: %s", pointID)
	}

	copy := point
	return &copy, nil
}

// GetVirtualShadowDevice 返回虚拟影子设备快照。
func (sc *ShadowCore) GetVirtualShadowDevice(virtualDeviceID string) (*model.VirtualDevice, error) {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	vd, exists := sc.virtualShadows[virtualDeviceID]
	if !exists {
		return nil, fmt.Errorf("virtual shadow device not found: %s", virtualDeviceID)
	}

	copy := *vd
	copy.Points = cloneShadowPoints(vd.Points)
	return &copy, nil
}
