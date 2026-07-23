package bacnet

import (
	"fmt"
	"sync"

	bacnetlib "github.com/anviod/bacnet"
	"github.com/anviod/bacnet/btypes"
	"time"
)

// Type aliases for convenience in tests.
type Client = bacnetlib.Client
type WhoIsOpts = bacnetlib.WhoIsOpts
type ClientBuilder = bacnetlib.ClientBuilder

// SmartMockClient is a mock implementing bacnetlib.Client.
// It stores devices and property values in maps for deterministic testing.
// Embedding structs (e.g. CoverageMockClient, IsolationMockClient) can
// override specific methods while delegating the rest to SmartMockClient.
type SmartMockClient struct {
	Devices map[int]btypes.Device
	Values  map[string]interface{} // key format: "deviceID:objectType:objectInstance"

	// Override hooks — set by embedding types or tests to customise behaviour.
	ObjectsFunc func(dev btypes.Device) (btypes.Device, error)
}

// IsRunning returns true (client message loop is considered running).
func (m *SmartMockClient) IsRunning() bool { return true }

// ClientRun is a no-op for the mock.
func (m *SmartMockClient) ClientRun() {}

// WhoIs returns devices from the Devices map that fall within the requested range.
func (m *SmartMockClient) WhoIs(wh *WhoIsOpts) ([]btypes.Device, error) {
	if wh == nil || m.Devices == nil {
		return nil, nil
	}
	var found []btypes.Device
	for id, dev := range m.Devices {
		if wh.Low != 0 || wh.High != 0 {
			if id >= wh.Low && id <= wh.High {
				found = append(found, dev)
			}
		} else {
			found = append(found, dev)
		}
	}
	return found, nil
}

// ReadProperty returns the first matching property value from Values.
func (m *SmartMockClient) ReadProperty(dest btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
	if m.Values == nil {
		return rp, nil
	}
	for i := range rp.Object.Properties {
		key := fmt.Sprintf("%d:%d:%d", dest.DeviceID, rp.Object.ID.Type, rp.Object.ID.Instance)
		if v, ok := m.Values[key]; ok {
			rp.Object.Properties[i].Data = v
		}
	}
	return rp, nil
}

// ReadPropertyWithTimeout delegates to ReadProperty.
func (m *SmartMockClient) ReadPropertyWithTimeout(dest btypes.Device, rp btypes.PropertyData, timeout time.Duration) (btypes.PropertyData, error) {
	return m.ReadProperty(dest, rp)
}

// ReadMultiProperty fills property data from the Values map.
func (m *SmartMockClient) ReadMultiProperty(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	if m.Values == nil {
		return rp, nil
	}
	for i, obj := range rp.Objects {
		for j := range obj.Properties {
			key := fmt.Sprintf("%d:%d:%d", dev.DeviceID, obj.ID.Type, obj.ID.Instance)
			if v, ok := m.Values[key]; ok {
				rp.Objects[i].Properties[j].Data = v
			}
		}
	}
	return rp, nil
}

// ReadMultiPropertyWithTimeout delegates to ReadMultiProperty.
func (m *SmartMockClient) ReadMultiPropertyWithTimeout(dev btypes.Device, rp btypes.MultiplePropertyData, timeout time.Duration) (btypes.MultiplePropertyData, error) {
	return m.ReadMultiProperty(dev, rp)
}

// WriteProperty is a no-op mock.
func (m *SmartMockClient) WriteProperty(dest btypes.Device, wp btypes.PropertyData) error {
	return nil
}

// WriteMultiProperty is a no-op mock.
func (m *SmartMockClient) WriteMultiProperty(dev btypes.Device, wp btypes.MultiplePropertyData) error {
	return nil
}

// Objects returns the device with objects populated, or calls ObjectsFunc if set.
func (m *SmartMockClient) Objects(dev btypes.Device) (btypes.Device, error) {
	if m.ObjectsFunc != nil {
		return m.ObjectsFunc(dev)
	}
	return dev, nil
}

// WhatIsNetworkNumber returns nil.
func (m *SmartMockClient) WhatIsNetworkNumber() []*btypes.Address {
	return nil
}

// IAm is a no-op mock.
func (m *SmartMockClient) IAm(dest btypes.Address, iam btypes.IAm) error {
	return nil
}

// WhoIsRouterToNetwork returns nil.
func (m *SmartMockClient) WhoIsRouterToNetwork() (resp *[]btypes.Address) {
	return nil
}

// SubscribeCOV is a no-op mock.
func (m *SmartMockClient) SubscribeCOV(device btypes.Device, data btypes.SubscribeCOVData) error {
	return nil
}

// CancelSubscribeCOV is a no-op mock.
func (m *SmartMockClient) CancelSubscribeCOV(device btypes.Device, processID uint32, objectID btypes.ObjectID) error {
	return nil
}

// WaitCOVNotification returns an error (not implemented for basic mock).
func (m *SmartMockClient) WaitCOVNotification(processIDFilter int64, timeout time.Duration) (btypes.COVNotification, error) {
	return btypes.COVNotification{}, fmt.Errorf("not implemented")
}

// Close is a no-op mock.
func (m *SmartMockClient) Close() error {
	return nil
}

// Ensure SmartMockClient satisfies the Client interface at compile time.
var _ Client = &SmartMockClient{}

// RealWorldMockClient simulates devices with configurable latency/errors.
// Used by compliance_test.go and bug_verification_test.go.
type RealWorldMockClient struct {
	SmartMockClient
	Delays      map[int]time.Duration
	Errors      map[int]error
	CallCounter map[int]int
	mu          sync.Mutex
}

func (m *RealWorldMockClient) ReadMultiProperty(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	m.mu.Lock()
	m.CallCounter[dev.DeviceID]++
	delay := m.Delays[dev.DeviceID]
	err := m.Errors[dev.DeviceID]
	m.mu.Unlock()

	if delay > 0 {
		time.Sleep(delay)
	}
	if err != nil {
		return btypes.MultiplePropertyData{}, err
	}
	return m.SmartMockClient.ReadMultiProperty(dev, rp)
}

func (m *RealWorldMockClient) ReadProperty(dest btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
	return m.ReadPropertyWithTimeout(dest, rp, 10*time.Second)
}

func (m *RealWorldMockClient) ReadPropertyWithTimeout(dest btypes.Device, rp btypes.PropertyData, timeout time.Duration) (btypes.PropertyData, error) {
	m.mu.Lock()
	delay := m.Delays[dest.DeviceID]
	err := m.Errors[dest.DeviceID]
	m.mu.Unlock()

	if delay > 0 {
		if delay > timeout {
			time.Sleep(timeout)
			return rp, fmt.Errorf("receive timed out")
		}
		time.Sleep(delay)
	}
	if err != nil {
		return rp, err
	}
	return m.SmartMockClient.ReadProperty(dest, rp)
}

func (m *RealWorldMockClient) ReadMultiPropertyWithTimeout(dev btypes.Device, rp btypes.MultiplePropertyData, timeout time.Duration) (btypes.MultiplePropertyData, error) {
	m.mu.Lock()
	m.CallCounter[dev.DeviceID]++
	delay := m.Delays[dev.DeviceID]
	err := m.Errors[dev.DeviceID]
	m.mu.Unlock()

	if delay > 0 {
		if delay > timeout {
			time.Sleep(timeout)
			return btypes.MultiplePropertyData{}, fmt.Errorf("receive timed out")
		}
		time.Sleep(delay)
	}
	if err != nil {
		return btypes.MultiplePropertyData{}, err
	}
	return m.SmartMockClient.ReadMultiProperty(dev, rp)
}

func (m *RealWorldMockClient) WhoIs(wh *WhoIsOpts) ([]btypes.Device, error) {
	return m.SmartMockClient.WhoIs(wh)
}

func (m *RealWorldMockClient) SubscribeCOV(device btypes.Device, data btypes.SubscribeCOVData) error {
	return nil
}

func (m *RealWorldMockClient) CancelSubscribeCOV(device btypes.Device, processID uint32, objectID btypes.ObjectID) error {
	return nil
}

func (m *RealWorldMockClient) WaitCOVNotification(processIDFilter int64, timeout time.Duration) (btypes.COVNotification, error) {
	return btypes.COVNotification{}, fmt.Errorf("not implemented")
}
