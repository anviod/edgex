package core

import (
	"context"
	"fmt"
	"log"
	"sync"

	"industrial-edge-gateway/internal/model"
)

// DEPRECATED: DeviceManager is deprecated. Use ChannelManager instead for three-level architecture support.
type DeviceManager struct {
	devices      map[string]*model.Device
	stateManager *CommunicationManageTemplate
	mu           sync.RWMutex
	ctx          context.Context
	cancel       context.CancelFunc
}

func NewDeviceManager() *DeviceManager {
	ctx, cancel := context.WithCancel(context.Background())
	return &DeviceManager{
		devices:      make(map[string]*model.Device),
		stateManager: NewCommunicationManageTemplate(),
		ctx:          ctx,
		cancel:       cancel,
	}
}

// AddDevice is deprecated
func (dm *DeviceManager) AddDevice(dev *model.Device) error {
	dm.mu.Lock()
	defer dm.mu.Unlock()

	if _, exists := dm.devices[dev.ID]; exists {
		return fmt.Errorf("device %s already exists", dev.ID)
	}

	dev.StopChan = make(chan struct{})
	dm.devices[dev.ID] = dev
	dm.stateManager.RegisterNode(dev.ID, dev.Name)

	log.Printf("Device %s added (DEPRECATED)", dev.Name)
	return nil
}

// StartDevice is deprecated
func (dm *DeviceManager) StartDevice(deviceID string) error {
	dm.mu.RLock()
	dev, ok := dm.devices[deviceID]
	dm.mu.RUnlock()

	if !ok {
		return fmt.Errorf("device not found")
	}

	if !dev.Enable {
		return fmt.Errorf("device is disabled")
	}

	log.Printf("Device %s started (DEPRECATED)", dev.Name)
	return nil
}

// StopDevice is deprecated
func (dm *DeviceManager) StopDevice(deviceID string) error {
	dm.mu.RLock()
	dev, ok := dm.devices[deviceID]
	dm.mu.RUnlock()

	if !ok {
		return fmt.Errorf("device not found")
	}

	select {
	case dev.StopChan <- struct{}{}:
		log.Printf("Device %s stopping (DEPRECATED)...", dev.Name)
	default:
	}

	return nil
}

// GetDeviceState is deprecated
func (dm *DeviceManager) GetDeviceState(deviceID string) *NodeRuntimeState {
	node := dm.stateManager.GetNode(deviceID)
	if node == nil {
		return nil
	}
	return node.Runtime
}

// WritePoint is deprecated
func (dm *DeviceManager) WritePoint(deviceID string, pointID string, value any) error {
	return fmt.Errorf("WritePoint is deprecated, use ChannelManager instead")
}

// Shutdown is deprecated
func (dm *DeviceManager) Shutdown() {
	dm.cancel()
}
