package core

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/storage"
)

const (
	WALBucket           = "shadow_wal"
	ShadowDeviceBucket  = "shadow_devices"
	VirtualDeviceBucket = "virtual_devices"
)

type ShadowSubscriber func(deviceID string, points map[string]model.ShadowPoint)

type ShadowCore struct {
	mu sync.RWMutex

	realShadows    map[string]*model.ShadowDevice
	virtualShadows map[string]*model.VirtualDevice

	walOffset uint64
	walStore  *storage.Storage

	subscribers []ShadowSubscriber
	subMu       sync.RWMutex

	versionCounter uint64

	optimizer *ShadowDeviceOptimizer

	stopChan chan struct{}
	wg       sync.WaitGroup
}

func NewShadowCore(store *storage.Storage) *ShadowCore {
	sc := &ShadowCore{
		realShadows:    make(map[string]*model.ShadowDevice),
		virtualShadows: make(map[string]*model.VirtualDevice),
		walStore:       store,
		subscribers:    make([]ShadowSubscriber, 0),
		optimizer:      NewShadowDeviceOptimizer(),
		stopChan:       make(chan struct{}),
	}

	sc.recoverFromWAL()

	return sc
}

func (sc *ShadowCore) Start() {
	sc.wg.Add(1)
	go sc.walCompactionLoop()
	log.Println("[ShadowCore] Started")
}

func (sc *ShadowCore) Stop() {
	close(sc.stopChan)
	sc.wg.Wait()
	log.Println("[ShadowCore] Stopped")
}

func (sc *ShadowCore) recoverFromWAL() {
	if sc.walStore == nil {
		return
	}

	startTime := time.Now()

	var records []model.WALRecord
	sc.walStore.LoadAll(WALBucket, func(k, v []byte) error {
		var record model.WALRecord
		if err := json.Unmarshal(v, &record); err == nil {
			records = append(records, record)
		}
		return nil
	})

	for _, record := range records {
		sc.applyWALRecord(record)
		if record.Offset >= sc.walOffset {
			sc.walOffset = record.Offset + 1
		}
	}

	elapsed := time.Since(startTime)
	log.Printf("[ShadowCore] Recovered %d WAL records in %v", len(records), elapsed)
}

func (sc *ShadowCore) applyWALRecord(record model.WALRecord) {
	switch record.EventType {
	case "shadow-write":
		var device model.ShadowDevice
		if err := json.Unmarshal(record.Payload, &device); err == nil {
			sc.realShadows[device.ShadowDeviceID] = &device
		}
	case "virtual-update":
		var device model.VirtualDevice
		if err := json.Unmarshal(record.Payload, &device); err == nil {
			sc.virtualShadows[device.VirtualDeviceID] = &device
		}
	}
}

func (sc *ShadowCore) walCompactionLoop() {
	defer sc.wg.Done()

	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-sc.stopChan:
			return
		case <-ticker.C:
			sc.compactWAL()
		}
	}
}

func (sc *ShadowCore) compactWAL() {
	if sc.walStore == nil {
		return
	}

	sc.mu.RLock()
	snapshot := make(map[string]*model.ShadowDevice)
	for k, v := range sc.realShadows {
		copy := *v
		snapshot[k] = &copy
	}
	sc.mu.RUnlock()

	for _, device := range snapshot {
		payload, err := json.Marshal(device)
		if err != nil {
			continue
		}

		hash := fmt.Sprintf("%x", sha256.Sum256(payload))[:16]
		record := model.WALRecord{
			Offset:         sc.walOffset,
			EventType:      "shadow-write",
			ShadowDeviceID: device.ShadowDeviceID,
			Version:        device.Version,
			PayloadHash:    hash,
			CreatedAt:      time.Now(),
			Payload:        payload,
		}

		key := fmt.Sprintf("%d", record.Offset)
		sc.walStore.SaveData(WALBucket, key, record)

		sc.mu.Lock()
		sc.walOffset++
		sc.mu.Unlock()
	}
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

	for _, point := range msg.Points {
		shadowPoint := model.ShadowPoint{
			Value:          point.Value,
			Unit:           point.Unit,
			Quality:        point.Quality,
			SamplePeriodMs: point.SamplePeriodMs,
			Timestamp:      msg.Timestamp,
			Version:        device.Version,
		}
		device.Points[point.PointID] = shadowPoint
	}

	// 更新通信画像
	sc.optimizer.UpdateShadowDeviceProfile(device)

	if err := sc.appendWAL("shadow-write", device); err != nil {
		log.Printf("[ShadowCore] WAL append failed: %v", err)
	}

	go sc.notifySubscribers(shadowDeviceID, device.Points)

	return &model.ShadowWriteResponse{
		Success:   true,
		Version:   device.Version,
		Timestamp: device.UpdatedAt,
	}, nil
}

// UpdateDeviceRTT 更新设备的RTT数据
func (sc *ShadowCore) UpdateDeviceRTT(deviceID string, rtt int64) {
	sc.optimizer.UpdateDeviceRTT(deviceID, rtt)

	// 更新影子设备的通信画像
	shadowDeviceID := fmt.Sprintf("shadow-%s", deviceID)
	sc.mu.RLock()
	device, exists := sc.realShadows[shadowDeviceID]
	sc.mu.RUnlock()

	if exists {
		sc.mu.Lock()
		sc.optimizer.UpdateShadowDeviceProfile(device)
		if err := sc.appendWAL("shadow-write", device); err != nil {
			log.Printf("[ShadowCore] WAL append failed: %v", err)
		}
		sc.mu.Unlock()
	}
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
		Value:     req.Value,
		Timestamp: req.Timestamp,
		Version:   device.Version,
		Quality:   "good",
	}
	device.Points[req.PointID] = shadowPoint

	if err := sc.appendWAL("shadow-write", device); err != nil {
		log.Printf("[ShadowCore] WAL append failed: %v", err)
	}

	go sc.notifySubscribers(req.ShadowDeviceID, device.Points)

	return &model.ShadowWriteResponse{
		Success:   true,
		Version:   device.Version,
		Timestamp: device.UpdatedAt,
	}, nil
}

func (sc *ShadowCore) appendWAL(eventType string, payload interface{}) error {
	if sc.walStore == nil {
		return nil
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	hash := fmt.Sprintf("%x", sha256.Sum256(data))[:16]

	var deviceID string
	var version uint64

	switch v := payload.(type) {
	case *model.ShadowDevice:
		deviceID = v.ShadowDeviceID
		version = v.Version
	case *model.VirtualDevice:
		deviceID = v.VirtualDeviceID
		version = v.Version
	}

	record := model.WALRecord{
		Offset:         sc.walOffset,
		EventType:      eventType,
		ShadowDeviceID: deviceID,
		Version:        version,
		PayloadHash:    hash,
		CreatedAt:      time.Now(),
		Payload:        data,
	}

	key := fmt.Sprintf("%d", record.Offset)
	if err := sc.walStore.SaveData(WALBucket, key, record); err != nil {
		return err
	}

	sc.walOffset++
	return nil
}

func (sc *ShadowCore) GetShadowDevice(deviceID string) (*model.ShadowDevice, error) {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	device, exists := sc.realShadows[deviceID]
	if !exists {
		return nil, fmt.Errorf("shadow device not found: %s", deviceID)
	}

	copy := *device
	return &copy, nil
}

func (sc *ShadowCore) GetAllShadowDevices() []*model.ShadowDevice {
	sc.mu.RLock()
	defer sc.mu.RUnlock()

	result := make([]*model.ShadowDevice, 0, len(sc.realShadows))
	for _, device := range sc.realShadows {
		copy := *device
		result = append(result, &copy)
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
			point.Timestamp = time.Now()
			device.Points[pointID] = point
		}
	}

	if err := sc.appendWAL("shadow-write", device); err != nil {
		log.Printf("[ShadowCore] WAL append failed: %v", err)
	}

	go sc.notifySubscribers(deviceID, device.Points)

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
		"wal_offset":           sc.walOffset,
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
