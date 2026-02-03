package bacnet

import (
	"context"
	"testing"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

// MockScanClient implements Client interface
type MockScanClient struct {
	BoundIP string
	Devices []btypes.Device
}

func (m *MockScanClient) Close() error    { return nil }
func (m *MockScanClient) IsRunning() bool { return true }
func (m *MockScanClient) ClientRun()      {}

func (m *MockScanClient) WhoIs(wh *WhoIsOpts) ([]btypes.Device, error) {
	// Return pre-configured devices
	return m.Devices, nil
}

func (m *MockScanClient) ReadProperty(dest btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
	// Return dummy property data
	rp.Object.Properties[0].Data = "MockValue"
	return rp, nil
}

// Stub other methods
func (m *MockScanClient) WhatIsNetworkNumber() []*btypes.Address           { return nil }
func (m *MockScanClient) IAm(dest btypes.Address, iam btypes.IAm) error    { return nil }
func (m *MockScanClient) WhoIsRouterToNetwork() (resp *[]btypes.Address)   { return nil }
func (m *MockScanClient) Objects(dev btypes.Device) (btypes.Device, error) { return dev, nil }
func (m *MockScanClient) ReadMultiProperty(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	return rp, nil
}
func (m *MockScanClient) WriteProperty(dest btypes.Device, wp btypes.PropertyData) error { return nil }
func (m *MockScanClient) WriteMultiProperty(dev btypes.Device, wp btypes.MultiplePropertyData) error {
	return nil
}

func TestBACnetDriver_Scan_MultiInterface(t *testing.T) {
	// 1. Mock getInterfaceIPs
	originalGetInterfaceIPs := getInterfaceIPs
	defer func() { getInterfaceIPs = originalGetInterfaceIPs }()

	getInterfaceIPs = func() ([]string, error) {
		return []string{"192.168.1.10", "10.0.0.10"}, nil
	}

	// 2. Setup Driver
	d := &BACnetDriver{
		interfacePort: 47808,
		subnetCIDR:    24,
	}

	// 3. Mock clientFactory
	d.clientFactory = func(cb *ClientBuilder) (Client, error) {
		client := &MockScanClient{
			BoundIP: cb.Ip,
		}

		// Configure devices based on bound IP
		if cb.Ip == "192.168.1.10" {
			client.Devices = []btypes.Device{
				{
					DeviceID: 100,
					Ip:       "192.168.1.50",
					Port:     47808,
				},
			}
		} else if cb.Ip == "10.0.0.10" {
			client.Devices = []btypes.Device{
				{
					DeviceID: 200,
					Ip:       "10.0.0.50",
					Port:     47808,
				},
				// Duplicate device (reachable via both?)
				{
					DeviceID: 100, // Should be deduplicated
					Ip:       "192.168.1.50",
					Port:     47808,
				},
			}
		}
		return client, nil
	}

	// Also mock the default client for ReadProperty calls
	d.client = &MockScanClient{
		BoundIP: "0.0.0.0",
	}

	// 4. Run Scan
	ctx := context.Background()
	params := map[string]any{}

	resultAny, err := d.Scan(ctx, params)
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	results, ok := resultAny.([]ScanResult)
	if !ok {
		t.Fatalf("Result is not []ScanResult, got %T", resultAny)
	}

	// 5. Verify Results
	// We expect 2 unique devices: 100 and 200.
	// Device 100 might appear twice in discovery but should be deduplicated.
	if len(results) != 2 {
		t.Errorf("Expected 2 devices, got %d", len(results))
	}

	deviceMap := make(map[int]ScanResult)
	for _, r := range results {
		deviceMap[r.DeviceID] = r
		// Verify Status is online
		if r.Status != "online" {
			t.Errorf("Device %d status expected online, got %s", r.DeviceID, r.Status)
		}
	}

	if _, ok := deviceMap[100]; !ok {
		t.Errorf("Device 100 not found")
	}
	if _, ok := deviceMap[200]; !ok {
		t.Errorf("Device 200 not found")
	}
}
