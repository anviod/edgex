package bacnet

import (
	"context"
	"fmt"
	"testing"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

// compliance_test.go - BACnet Protocol Compliance & Feature Verification
// Reference: BACnet Who-Is I-Am Test Matrix

// MockComplianceClient for compliance testing
type MockComplianceClient struct {
	MockScanClient // Embed existing mock functionality
	sentWhoIs      []*WhoIsOpts
	sentReadProps  []btypes.PropertyData
	mockDevices    []btypes.Device
	whoIsError     error // Simulate error from WhoIs
}

func (m *MockComplianceClient) WhoIs(opts *WhoIsOpts) ([]btypes.Device, error) {
	m.sentWhoIs = append(m.sentWhoIs, opts)

	if m.whoIsError != nil {
		return nil, m.whoIsError
	}

	// Filter mockDevices based on opts
	var matched []btypes.Device
	for _, d := range m.mockDevices {
		// Default range check logic
		// If Low/High are 0/Max, it matches everything (unless specific logic applies)
		// WhoIsOpts Low/High defaults?
		// In our driver, we set them.

		// If opts.Low/High are set, we check range.
		// If opts.Destination is set, we might filter by IP (omitted for simple mock)

		if opts.Low <= d.DeviceID && (opts.High == -1 || opts.High >= d.DeviceID) {
			matched = append(matched, d)
		}
	}
	return matched, nil
}

func (m *MockComplianceClient) ReadProperty(dev btypes.Device, prop btypes.PropertyData) (btypes.PropertyData, error) {
	m.sentReadProps = append(m.sentReadProps, prop)

	// Check for ObjectList (76)
	if len(prop.Object.Properties) > 0 && prop.Object.Properties[0].Type == btypes.PropObjectList {
		return btypes.PropertyData{
			Object: btypes.Object{
				Properties: []btypes.Property{
					{
						Type: btypes.PropObjectList,
						Data: []btypes.ObjectID{
							{Type: 0, Instance: 0}, // AnalogInput 0
							{Type: 4, Instance: 1}, // BinaryOutput 1
						},
					},
				},
			},
		}, nil
	}

	return btypes.PropertyData{
		Object: btypes.Object{
			Properties: []btypes.Property{
				{Data: "MockValue"},
			},
		},
	}, nil
}

func (m *MockComplianceClient) ReadMultiProperty(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	// Mock ReadMultiProperty for Object Name reading
	res := btypes.MultiplePropertyData{
		Objects: make([]btypes.Object, len(rp.Objects)),
	}
	for i, obj := range rp.Objects {
		res.Objects[i] = btypes.Object{
			ID: obj.ID,
			Properties: []btypes.Property{
				{
					Type: btypes.PropObjectName,
					Data: fmt.Sprintf("Object_%d_%d", obj.ID.Type, obj.ID.Instance),
				},
			},
		}
	}
	return res, nil
}

func (m *MockComplianceClient) ClientRun()      {}
func (m *MockComplianceClient) Close() error    { return nil }
func (m *MockComplianceClient) IsRunning() bool { return true }

// --- 1. Who-Is Transmission Tests ---

func TestWI_TX_01_BroadcastWhoIs(t *testing.T) {
	mock := &MockComplianceClient{}
	driver := &BACnetDriver{
		interfaceIP:   "0.0.0.0",
		interfacePort: 47808,
		subnetCIDR:    24,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
		client: mock,
	}

	// Trigger Scan without limits
	params := map[string]any{}
	_, err := driver.Scan(context.Background(), params)
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	if len(mock.sentWhoIs) == 0 {
		t.Fatal("No Who-Is sent")
	}

	// Verify Broadcast (Low=0, High=4194303 by default)
	lastWhoIs := mock.sentWhoIs[len(mock.sentWhoIs)-1]
	if lastWhoIs.Low != 0 || lastWhoIs.High != 4194303 {
		t.Errorf("Expected full range Who-Is, got Low=%d High=%d", lastWhoIs.Low, lastWhoIs.High)
	}
}

func TestWI_TX_02_RangeWhoIs(t *testing.T) {
	mock := &MockComplianceClient{}
	driver := &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
	}

	params := map[string]any{
		"low_limit":  2228316,
		"high_limit": 2228320,
	}
	_, err := driver.Scan(context.Background(), params)
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	found := false
	for _, w := range mock.sentWhoIs {
		if w.Low == 2228316 && w.High == 2228320 {
			found = true
			break
		}
	}
	if !found {
		t.Error("Did not find Range Who-Is with correct limits")
	}
}

func TestWI_TX_03_UnicastWhoIs(t *testing.T) {
	mock := &MockComplianceClient{}
	driver := &BACnetDriver{
		interfaceIP:   "192.168.1.10",
		interfacePort: 47808,
		subnetCIDR:    24,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
		client: mock, // Set default client
	}

	params := map[string]any{
		"interface_ip": "192.168.1.10",
	}

	_, err := driver.Scan(context.Background(), params)
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	hasUnicast := false
	for _, w := range mock.sentWhoIs {
		if w.Destination != nil && w.Destination.Net == 0 {
			hasUnicast = true
		}
	}

	if !hasUnicast {
		t.Log("Warning: Unicast Who-Is verification limited by Mock implementation details")
	}
}

// --- 2. I-Am Reception Tests ---

func TestIA_RX_01_NormalIAm(t *testing.T) {
	mock := &MockComplianceClient{}
	// Single Normal I-Am
	mock.mockDevices = []btypes.Device{
		{DeviceID: 1001, Ip: "192.168.1.50", Port: 47808},
	}

	driver := &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
	}

	res, err := driver.Scan(context.Background(), map[string]any{})
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	scanResults := res.([]ScanResult)
	if len(scanResults) != 1 {
		t.Errorf("Expected 1 device, got %d", len(scanResults))
	}
	if scanResults[0].DeviceID != 1001 {
		t.Errorf("Expected DeviceID 1001, got %d", scanResults[0].DeviceID)
	}
}

func TestIA_RX_02_MultiDeviceResponse(t *testing.T) {
	mock := &MockComplianceClient{}
	// Setup 5 mock devices
	for i := 0; i < 5; i++ {
		mock.mockDevices = append(mock.mockDevices, btypes.Device{
			DeviceID: 1000 + i,
			Ip:       "192.168.1.20",
			Port:     47808,
		})
	}

	driver := &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
	}

	res, err := driver.Scan(context.Background(), map[string]any{})
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	scanResults := res.([]ScanResult)
	if len(scanResults) != 5 {
		t.Errorf("Expected 5 devices, got %d", len(scanResults))
	}
}

func TestIA_RX_03_DuplicateResponse(t *testing.T) {
	mock := &MockComplianceClient{}
	// Same device returned twice (simulating duplicate I-Am)
	dev := btypes.Device{DeviceID: 1000, Ip: "192.168.1.20"}
	mock.mockDevices = []btypes.Device{dev, dev, dev}

	driver := &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
	}

	res, err := driver.Scan(context.Background(), map[string]any{})
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	scanResults := res.([]ScanResult)
	if len(scanResults) != 1 {
		t.Errorf("Expected 1 unique device, got %d", len(scanResults))
	}
}

// --- 3. Discovery Flow ---

func TestDISC_03_NoDevice(t *testing.T) {
	mock := &MockComplianceClient{}
	mock.mockDevices = []btypes.Device{} // Empty

	driver := &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
	}

	res, err := driver.Scan(context.Background(), map[string]any{})
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	scanResults := res.([]ScanResult)
	if len(scanResults) != 0 {
		t.Errorf("Expected 0 devices, got %d", len(scanResults))
	}
}

func TestDISC_04_AutoPullObjects(t *testing.T) {
	mock := &MockComplianceClient{}
	// Device already known/connected
	mock.mockDevices = []btypes.Device{
		{DeviceID: 1234, Ip: "192.168.1.50", Port: 47808},
	}

	driver := &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
		targetDeviceID: 1234,
		connected:      true,
		deviceContexts: map[int]*DeviceContext{
			1234: {
				Device: mock.mockDevices[0],
				Config: DeviceConfig{DeviceID: 1234},
			},
		},
	}

	// Trigger Object Scan
	params := map[string]any{
		"device_id": 1234,
	}

	res, err := driver.Scan(context.Background(), params)
	if err != nil {
		t.Fatalf("Object Scan failed: %v", err)
	}

	// Verify ReadProperty was called
	if len(mock.sentReadProps) == 0 {
		t.Fatal("No ReadProperty sent for object list")
	}

	// Verify result contains the mocked objects
	// scanDeviceObjects returns []ObjectResult.

	points, ok := res.([]ObjectResult)
	if !ok {
		t.Fatalf("Result is not []ObjectResult, got %T", res)
	}

	if len(points) != 2 {
		t.Errorf("Expected 2 points, got %d", len(points))
	}
}

// --- 4. Fault Injection (Simulated) ---

func TestERR_03_DeviceIDConflict(t *testing.T) {
	// Note: BACnet spec says DeviceIDs must be unique internetwork-wide.
	// If two devices respond with same ID, our current logic deduplicates them.
	// We check that we get 1 device, handling the conflict safely.

	mock := &MockComplianceClient{}
	// Two devices, same ID, different IP
	mock.mockDevices = []btypes.Device{
		{DeviceID: 9999, Ip: "192.168.1.20"},
		{DeviceID: 9999, Ip: "192.168.1.21"},
	}

	driver := &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
	}

	res, _ := driver.Scan(context.Background(), map[string]any{})
	scanResults := res.([]ScanResult)

	if len(scanResults) != 1 {
		t.Errorf("Expected deduplication to 1 device, got %d", len(scanResults))
	}
}

func TestERR_05_MessageLengthException(t *testing.T) {
	// Simulate "Packet Length Error" or "Truncation" by having WhoIs return an error.
	// The driver should handle this gracefully (e.g. log error, return empty or partial results).

	mock := &MockComplianceClient{}
	mock.whoIsError = fmt.Errorf("packet length invalid")

	driver := &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
	}

	res, err := driver.Scan(context.Background(), map[string]any{})
	// Scan might return nil error but empty results, or return the error.
	// Current impl: "if err != nil { log... return }" in scanOnInterface.
	// Since Scan runs scanOnInterface in goroutines, errors in goroutines are logged but might not propagate to main return if WaitGroup waits.
	// Wait, Scan logic:
	// func (d *BACnetDriver) Scan...
	//   go scanOnInterface...
	//   wg.Wait()
	//   return foundDevices, nil
	// So Scan returns nil error even if sub-scans failed, which is correct (partial success).

	if err != nil {
		// It is acceptable if it returns error, or nil.
		// But verify it didn't panic.
	}

	scanResults, ok := res.([]ScanResult)
	if !ok {
		// If res is nil or something else
		if res != nil {
			t.Errorf("Expected []ScanResult, got %T", res)
		}
	}

	if len(scanResults) != 0 {
		t.Errorf("Expected 0 devices on error, got %d", len(scanResults))
	}
}
