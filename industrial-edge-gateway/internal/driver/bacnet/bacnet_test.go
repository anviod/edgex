package bacnet

import (
	"context"
	"fmt"
	"testing"
	"time"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/model"
)

// MockClient implements Client interface for testing
type MockClient struct {
	// Mock responses
	WhoIsResp             []btypes.Device
	WhoIsErr              error
	ReadMultiPropertyResp btypes.MultiplePropertyData
	ReadMultiPropertyErr  error
	// Optional dynamic handler
	ReadMultiPropertyHandler func(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error)

	WritePropertyErr error
	ReadPropertyResp btypes.PropertyData
	ReadPropertyErr  error

	// Call recording
	WhoIsCalled             bool
	ReadMultiPropertyCalled bool
	WritePropertyCalled     bool
	LastWriteProp           btypes.PropertyData
}

func (m *MockClient) Close() error    { return nil }
func (m *MockClient) IsRunning() bool { return true }
func (m *MockClient) ClientRun()      {}
func (m *MockClient) WhoIs(wh *WhoIsOpts) ([]btypes.Device, error) {
	m.WhoIsCalled = true
	return m.WhoIsResp, m.WhoIsErr
}
func (m *MockClient) WhatIsNetworkNumber() []*btypes.Address           { return nil }
func (m *MockClient) IAm(dest btypes.Address, iam btypes.IAm) error    { return nil }
func (m *MockClient) WhoIsRouterToNetwork() (resp *[]btypes.Address)   { return nil }
func (m *MockClient) Objects(dev btypes.Device) (btypes.Device, error) { return dev, nil }
func (m *MockClient) ReadProperty(dest btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
	return m.ReadPropertyResp, m.ReadPropertyErr
}
func (m *MockClient) ReadMultiProperty(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	m.ReadMultiPropertyCalled = true
	if m.ReadMultiPropertyHandler != nil {
		return m.ReadMultiPropertyHandler(dev, rp)
	}
	return m.ReadMultiPropertyResp, m.ReadMultiPropertyErr
}
func (m *MockClient) WriteProperty(dest btypes.Device, wp btypes.PropertyData) error {
	m.WritePropertyCalled = true
	m.LastWriteProp = wp
	return m.WritePropertyErr
}
func (m *MockClient) WriteMultiProperty(dev btypes.Device, wp btypes.MultiplePropertyData) error {
	return nil
}

func TestBACnetDriver_Connect(t *testing.T) {
	mockClient := &MockClient{
		WhoIsResp: []btypes.Device{
			{
				DeviceID: 1234,
				Addr:     btypes.Address{Mac: []byte{192, 168, 1, 10, 0xBA, 0xC0}},
			},
		},
	}

	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.interfaceIP = "127.0.0.1"

	// Inject mock client factory
	d.clientFactory = func(cb *ClientBuilder) (Client, error) {
		return mockClient, nil
	}

	err := d.Connect(context.Background())
	if err != nil {
		t.Fatalf("Connect failed: %v", err)
	}

	if !d.connected {
		t.Error("Driver should be connected")
	}
	if !mockClient.WhoIsCalled {
		t.Error("WhoIs should be called during Connect")
	}
	d.mu.Lock()
	ctx, ok := d.deviceContexts[1234]
	d.mu.Unlock()
	if !ok || ctx.Scheduler == nil {
		t.Error("Scheduler should be initialized for device 1234")
	}
}

func TestBACnetDriver_ReadPoints(t *testing.T) {
	// Setup Mock
	mockClient := &MockClient{}

	// Setup Response for ReadMultiProperty
	// Requesting AI:1 and BI:2
	respData := btypes.MultiplePropertyData{
		Objects: []btypes.Object{
			{
				ID: btypes.ObjectID{Type: btypes.AnalogInput, Instance: 1},
				Properties: []btypes.Property{
					{Type: btypes.PropPresentValue, Data: float32(25.5)},
				},
			},
			{
				ID: btypes.ObjectID{Type: btypes.BinaryInput, Instance: 2},
				Properties: []btypes.Property{
					{Type: btypes.PropPresentValue, Data: btypes.Enumerated(1)}, // Active
				},
			},
		},
	}
	mockClient.ReadMultiPropertyResp = respData

	// Driver Setup
	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.client = mockClient
	dev := btypes.Device{DeviceID: 1234}
	d.connected = true
	d.deviceContexts = map[int]*DeviceContext{
		1234: {
			Device:    dev,
			Config:    DeviceConfig{DeviceID: 1234},
			Scheduler: NewPointScheduler(mockClient, dev, 20, 10*time.Millisecond, 10*time.Second),
		},
	}

	// Points to read
	points := []model.Point{
		{ID: "Temp", Name: "Temp", Address: "analog-input:1"},
		{ID: "FanStatus", Name: "FanStatus", Address: "binary-input:2"},
	}

	// Execute
	results, err := d.ReadPoints(context.Background(), points)
	if err != nil {
		t.Fatalf("ReadPoints failed: %v", err)
	}

	// Verify
	if !mockClient.ReadMultiPropertyCalled {
		t.Error("Expected ReadMultiProperty to be called")
	}

	if val, ok := results["Temp"]; !ok || val.Value != float32(25.5) {
		t.Errorf("Expected Temp to be 25.5, got %v", val.Value)
	}

	if val, ok := results["FanStatus"]; !ok {
		t.Errorf("Expected FanStatus to be present")
	} else {
		// Verify Enum type handling
		v, ok := val.Value.(btypes.Enumerated)
		if !ok {
			t.Errorf("Expected FanStatus to be btypes.Enumerated, got %T", val.Value)
		} else if v != 1 {
			t.Errorf("Expected FanStatus to be 1, got %v", v)
		}
	}
}

func TestBACnetDriver_WritePoint(t *testing.T) {
	mockClient := &MockClient{}
	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.client = mockClient
	dev := btypes.Device{DeviceID: 1234}
	d.connected = true
	// Initialize Scheduler
	d.deviceContexts = map[int]*DeviceContext{
		1234: {
			Device:    dev,
			Config:    DeviceConfig{DeviceID: 1234},
			Scheduler: NewPointScheduler(mockClient, dev, 20, 10*time.Millisecond, 10*time.Second),
		},
	}

	point := model.Point{Name: "SetPoint", Address: "analog-value:5"}
	err := d.WritePoint(context.Background(), point, 22.5)
	if err != nil {
		t.Fatalf("WritePoint failed: %v", err)
	}

	if !mockClient.WritePropertyCalled {
		t.Error("Expected WriteProperty to be called")
	}

	wp := mockClient.LastWriteProp
	if wp.Object.ID.Type != btypes.AnalogValue || wp.Object.ID.Instance != 5 {
		t.Errorf("Wrong object ID: %v", wp.Object.ID)
	}
	if len(wp.Object.Properties) == 0 {
		t.Fatalf("No properties in write request")
	}
	if wp.Object.Properties[0].Data != 22.5 {
		t.Errorf("Wrong value written: %v", wp.Object.Properties[0].Data)
	}
	// Check default priority
	if wp.Object.Properties[0].Priority != btypes.NPDUPriority(16) {
		t.Errorf("Expected default priority 16, got %v", wp.Object.Properties[0].Priority)
	}
}

func TestBACnetDriver_ReadPoints_Cooldown(t *testing.T) {
	// Test that failed points enter cooldown
	mockClient := &MockClient{}
	mockClient.ReadMultiPropertyErr = fmt.Errorf("timeout")

	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.client = mockClient
	dev := btypes.Device{DeviceID: 1234}
	d.connected = true
	// Short cooldown for testing
	d.deviceContexts = map[int]*DeviceContext{
		1234: {
			Device:    dev,
			Config:    DeviceConfig{DeviceID: 1234},
			Scheduler: NewPointScheduler(mockClient, dev, 20, 50*time.Millisecond, 50*time.Millisecond),
		},
	}

	points := []model.Point{{ID: "P1", Name: "P1", Address: "analog-input:1"}}

	// 1st Read - Fails
	d.ReadPoints(context.Background(), points)

	// 2nd Read - Fails
	d.ReadPoints(context.Background(), points)

	// 3rd Read - Should be skipped due to cooldown (state.FailCount >= 3 from scheduler default)
	// We need 3 failures to trigger cooldown in current implementation
	d.ReadPoints(context.Background(), points)

	// Now check if it skips
	mockClient.ReadMultiPropertyErr = nil
	mockClient.ReadMultiPropertyCalled = false

	d.ReadPoints(context.Background(), points)

	if mockClient.ReadMultiPropertyCalled {
		t.Error("Expected request to be skipped due to cooldown")
	}

	// Wait for cooldown
	time.Sleep(60 * time.Millisecond)

	// Next Read - Should be called again
	mockClient.ReadMultiPropertyCalled = false
	d.ReadPoints(context.Background(), points)

	if !mockClient.ReadMultiPropertyCalled {
		t.Error("Expected request to be resumed after cooldown")
	}
}

func TestBACnetDriver_Recovery(t *testing.T) {
	mockClient := &MockClient{
		WhoIsResp: []btypes.Device{
			{
				DeviceID: 1234,
				Addr:     btypes.Address{Mac: []byte{192, 168, 1, 10, 0xBA, 0xC0}},
			},
		},
	}

	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.clientFactory = func(cb *ClientBuilder) (Client, error) {
		return mockClient, nil
	}

	// Connect
	if err := d.Connect(context.Background()); err != nil {
		t.Fatalf("Connect failed: %v", err)
	}

	// Force LastDiscovery to be old enough to trigger recovery
	d.mu.Lock()
	if ctx, ok := d.deviceContexts[1234]; ok {
		ctx.LastDiscovery = time.Now().Add(-1 * time.Hour)
		t.Logf("Test: Forced LastDiscovery to %v", ctx.LastDiscovery)
	}
	d.mu.Unlock()

	// Reset Mock state
	mockClient.WhoIsCalled = false
	mockClient.ReadMultiPropertyCalled = false

	// Set Read Failure
	mockClient.ReadMultiPropertyErr = fmt.Errorf("timeout")

	// ReadPoints - Should fail and trigger recovery
	points := []model.Point{{ID: "P1", Address: "analog-input:1"}}
	d.ReadPoints(context.Background(), points)

	// Wait for goroutine
	time.Sleep(100 * time.Millisecond)

	// Verify recovery triggered WhoIs
	if !mockClient.WhoIsCalled {
		t.Error("Recovery did not trigger WhoIs")
	}

	// Verify cooldown logic
	mockClient.WhoIsCalled = false
	d.ReadPoints(context.Background(), points) // Should fail again
	time.Sleep(10 * time.Millisecond)

	if mockClient.WhoIsCalled {
		t.Error("Recovery triggered too soon (should be rate limited)")
	}
}

func TestBACnetDriver_Init(t *testing.T) {
	d := NewBACnetDriver().(*BACnetDriver)
	config := model.DriverConfig{
		Config: map[string]any{
			"device_id": 1234,
			"ip":        "192.168.1.100",
			"port":      47808,
		},
	}
	d.Init(config)

	if d.targetDeviceID != 1234 {
		t.Errorf("Expected targetDeviceID 1234, got %d", d.targetDeviceID)
	}
	if d.targetIP != "192.168.1.100" {
		t.Errorf("Expected targetIP 192.168.1.100, got %s", d.targetIP)
	}
	if d.targetPort != 47808 {
		t.Errorf("Expected targetPort 47808, got %d", d.targetPort)
	}
}

func TestBACnetDriver_Recovery_FromInitFailure(t *testing.T) {
	mockClient := &MockClient{
		WhoIsErr: fmt.Errorf("device offline"),
	}

	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.clientFactory = func(cb *ClientBuilder) (Client, error) {
		return mockClient, nil
	}

	// Connect - Should fail discovery but return nil (driver started)
	if err := d.Connect(context.Background()); err != nil {
		t.Fatalf("Connect failed: %v", err)
	}

	// Force LastDiscovery to be old enough to trigger recovery
	d.mu.Lock()
	d.lastDiscovery = time.Now().Add(-1 * time.Hour)
	d.mu.Unlock()

	d.mu.Lock()
	ctx, ok := d.deviceContexts[1234]
	d.mu.Unlock()
	if ok && ctx.Scheduler != nil {
		t.Error("Scheduler should be nil after failed discovery")
	}

	// Reset Mock state
	mockClient.WhoIsCalled = false
	mockClient.WhoIsErr = nil // Allow recovery to succeed
	mockClient.WhoIsResp = []btypes.Device{
		{
			DeviceID: 1234,
			Addr:     btypes.Address{Mac: []byte{192, 168, 1, 10, 0xBA, 0xC0}},
		},
	}

	// ReadPoints - Should fail (scheduler nil) BUT trigger recovery
	points := []model.Point{{ID: "P1", Address: "analog-input:1"}}
	_, err := d.ReadPoints(context.Background(), points)
	if err == nil {
		t.Error("ReadPoints should fail when scheduler is nil")
	}

	// Wait for recovery goroutine
	time.Sleep(100 * time.Millisecond)

	// Verify recovery triggered WhoIs
	if !mockClient.WhoIsCalled {
		t.Error("Recovery did not trigger WhoIs after initial failure")
	}

	// Verify scheduler is now initialized
	d.mu.Lock()
	ctx, ok = d.deviceContexts[1234]
	if !ok || ctx.Scheduler == nil {
		t.Error("Scheduler should be initialized after recovery")
	}
	if !d.connected {
		t.Error("Driver should be connected after recovery")
	}
	d.mu.Unlock()
}
