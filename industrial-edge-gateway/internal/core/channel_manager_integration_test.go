package core

import (
	"context"
	"errors"
	"testing"
	"time"

	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
)

// MockDriver definition for integration tests
type MockDriver struct {
	ConnectCalled    bool
	ReadPointsCalled bool
	ReadPointsErr    error
	ReturnQuality    string // "Good" or "Bad"
}

func (m *MockDriver) Init(cfg model.DriverConfig) error { return nil }
func (m *MockDriver) Connect(ctx context.Context) error {
	m.ConnectCalled = true
	return nil
}
func (m *MockDriver) Disconnect() error { return nil }
func (m *MockDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	m.ReadPointsCalled = true
	if m.ReadPointsErr != nil {
		return nil, m.ReadPointsErr
	}
	// Return dummy values
	res := make(map[string]model.Value)
	quality := "Good"
	if m.ReturnQuality != "" {
		quality = m.ReturnQuality
	}

	for _, p := range points {
		res[p.ID] = model.Value{
			PointID: p.ID,
			Value:   123.45,
			Quality: quality,
		}
	}
	return res, nil
}
func (m *MockDriver) WritePoint(ctx context.Context, point model.Point, value any) error { return nil }
func (m *MockDriver) Health() driver.HealthStatus                                        { return driver.HealthStatusGood }
func (m *MockDriver) SetSlaveID(slaveID uint8) error                                     { return nil }
func (m *MockDriver) SetDeviceConfig(config map[string]any) error                        { return nil }

func TestStartChannel_Disabled(t *testing.T) {
	// Setup
	mock := &MockDriver{}
	driver.RegisterDriver("mock-disabled", func() driver.Driver { return mock })

	cm := NewChannelManager(NewDataPipeline(10), nil)

	ch := &model.Channel{
		ID:       "ch-disabled",
		Name:     "Disabled Channel",
		Protocol: "mock-disabled",
		Enable:   false,
		Devices:  []model.Device{},
	}

	// Act
	err := cm.AddChannel(ch)
	if err != nil {
		t.Fatalf("AddChannel failed: %v", err)
	}

	err = cm.StartChannel("ch-disabled")

	// Assert
	if err != nil {
		t.Errorf("StartChannel should return nil for disabled channel, got: %v", err)
	}
	if mock.ConnectCalled {
		t.Error("Connect should NOT be called for disabled channel")
	}
}

func TestDeviceStatus_Integration(t *testing.T) {
	// Setup
	mock := &MockDriver{}
	driver.RegisterDriver("mock-status", func() driver.Driver { return mock })

	cm := NewChannelManager(NewDataPipeline(10), nil)
	// Start pipeline to avoid blocking
	go cm.pipeline.Start()

	devID := "dev-1"
	ch := &model.Channel{
		ID:       "ch-status",
		Name:     "Status Channel",
		Protocol: "mock-status",
		Enable:   true,
		Devices: []model.Device{
			{
				ID:       devID,
				Name:     "Device 1",
				Enable:   true,
				Interval: model.Duration(100 * time.Millisecond), // 100ms
				Points: []model.Point{
					{ID: "p1", Name: "Point 1", Address: "1", DataType: "float"},
				},
			},
		},
	}

	// Act 1: Success Case
	err := cm.AddChannel(ch)
	if err != nil {
		t.Fatalf("AddChannel failed: %v", err)
	}
	err = cm.StartChannel("ch-status")
	if err != nil {
		t.Fatalf("StartChannel failed: %v", err)
	}

	// Wait for collection (enough for at least one cycle)
	time.Sleep(200 * time.Millisecond)

	// Assert Success
	node := cm.stateManager.GetNode(devID)
	if node == nil {
		t.Fatal("Node not found in state manager")
	}

	// Wait a bit more if count is 0 (first tick might be delayed slightly)
	if node.Runtime.SuccessCount == 0 {
		time.Sleep(200 * time.Millisecond)
	}

	if node.Runtime.SuccessCount == 0 {
		t.Error("SuccessCount should be > 0")
	}
	if node.Runtime.State != NodeStateOnline {
		t.Errorf("Node state should be Online (0), got %v", node.Runtime.State)
	}

	// Act 2: Fail Case
	mock.ReadPointsErr = errors.New("read error")
	// Wait for failure accumulation (needs to be >= 3 to change state to Unstable, but we just check FailCount first)
	time.Sleep(500 * time.Millisecond)

	// Assert Failure
	if node.Runtime.FailCount == 0 {
		t.Error("FailCount should be > 0 after errors")
	}

	// If it fails enough times (3), it should become Unstable or Quarantine
	if node.Runtime.FailCount >= 3 {
		// Verify state is Unstable (1), Offline (2), or Quarantine (3)
		if node.Runtime.State != NodeStateUnstable && node.Runtime.State != NodeStateOffline && node.Runtime.State != NodeStateQuarantine {
			t.Errorf("Node state should be Unstable (1), Offline (2) or Quarantine (3) after >=3 failures, got %v", node.Runtime.State)
		}
	}

	// Verify GetChannelDevices returns state
	devices := cm.GetChannelDevices("ch-status")
	if len(devices) != 1 {
		t.Fatalf("Expected 1 device, got %d", len(devices))
	}
	if devices[0].State != int(node.Runtime.State) {
		t.Errorf("Device state in API mismatch. Expected %d, got %d", node.Runtime.State, devices[0].State)
	}

	// Clean up
	cm.Shutdown()
}

func TestAddPoint_Validation(t *testing.T) {
	// Register mock drivers for protocols
	mock := &MockDriver{}
	driver.RegisterDriver("modbus-tcp", func() driver.Driver { return mock })
	driver.RegisterDriver("bacnet-ip", func() driver.Driver { return mock })

	cm := NewChannelManager(NewDataPipeline(10), nil)

	// Setup Modbus Channel
	modbusCh := &model.Channel{
		ID:       "ch-modbus",
		Protocol: "modbus-tcp",
		Devices:  []model.Device{{ID: "dev-modbus", Enable: true}},
	}
	if err := cm.AddChannel(modbusCh); err != nil {
		t.Fatalf("AddChannel modbus failed: %v", err)
	}

	// Valid Modbus Point
	err := cm.AddPoint("ch-modbus", "dev-modbus", &model.Point{ID: "p1", Address: "40001", DataType: "int16"})
	if err != nil {
		t.Errorf("Expected valid modbus point to succeed, got %v", err)
	}

	// Invalid Modbus Address
	err = cm.AddPoint("ch-modbus", "dev-modbus", &model.Point{ID: "p2", Address: "invalid", DataType: "int16"})
	if err == nil {
		t.Error("Expected invalid modbus address to fail")
	}

	// Setup BACnet Channel
	bacnetCh := &model.Channel{
		ID:       "ch-bacnet",
		Protocol: "bacnet-ip",
		Devices:  []model.Device{{ID: "dev-bacnet", Enable: true}},
	}
	if err := cm.AddChannel(bacnetCh); err != nil {
		t.Fatalf("AddChannel bacnet failed: %v", err)
	}

	// Valid BACnet Point
	err = cm.AddPoint("ch-bacnet", "dev-bacnet", &model.Point{ID: "p3", Address: "AnalogInput:1"})
	if err != nil {
		t.Errorf("Expected valid bacnet point to succeed, got %v", err)
	}

	// Invalid BACnet Address
	err = cm.AddPoint("ch-bacnet", "dev-bacnet", &model.Point{ID: "p4", Address: "Invalid:1"})
	if err == nil {
		t.Error("Expected invalid bacnet address to fail")
	}
}

func TestDeviceStatus_PartialFailure(t *testing.T) {
	// Setup
	mock := &MockDriver{}
	driver.RegisterDriver("mock-partial", func() driver.Driver { return mock })

	cm := NewChannelManager(NewDataPipeline(10), nil)
	go cm.pipeline.Start()

	devID := "dev-partial"
	ch := &model.Channel{
		ID:       "ch-partial",
		Name:     "Partial Channel",
		Protocol: "mock-partial",
		Enable:   true,
		Devices: []model.Device{
			{
				ID:       devID,
				Name:     "Device Partial",
				Enable:   true,
				Interval: model.Duration(100 * time.Millisecond),
				Points: []model.Point{
					{ID: "p1", Name: "Point 1", Address: "1", DataType: "float"},
				},
			},
		},
	}

	err := cm.AddChannel(ch)
	if err != nil {
		t.Fatalf("AddChannel failed: %v", err)
	}
	err = cm.StartChannel("ch-partial")
	if err != nil {
		t.Fatalf("StartChannel failed: %v", err)
	}

	// Wait for initial success
	time.Sleep(200 * time.Millisecond)
	node := cm.stateManager.GetNode(devID)
	if node.Runtime.State != NodeStateOnline {
		t.Fatalf("Node should be Online, got %v", node.Runtime.State)
	}

	// Act: Simulate Bad Quality (No Error)
	mock.ReturnQuality = "Bad"

	// Wait for failure accumulation (needs to be >= 3 to change state to Unstable)
	// Interval is 100ms, 500ms should be enough for 5 retries
	time.Sleep(500 * time.Millisecond)

	// Assert Failure
	if node.Runtime.FailCount == 0 {
		t.Error("FailCount should be > 0 when Quality is Bad")
	}

	if node.Runtime.State == NodeStateOnline {
		t.Errorf("Node state should NOT be Online after failures, got %v", node.Runtime.State)
	}

	// Clean up
	cm.Shutdown()
}
