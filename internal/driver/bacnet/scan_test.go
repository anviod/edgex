//go:build integration

package bacnet

import (
	"context"
	"fmt"
	"testing"
	"time"

	bacnetlib "github.com/anviod/bacnet"
	"github.com/anviod/bacnet/btypes"
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
	return m.Devices, nil
}

func (m *MockScanClient) SubscribeCOV(device btypes.Device, data btypes.SubscribeCOVData) error {
	return nil
}

func (m *MockScanClient) CancelSubscribeCOV(device btypes.Device, processID uint32, objectID btypes.ObjectID) error {
	return nil
}

func (m *MockScanClient) ReadProperty(dest btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
	rp.Object.Properties[0].Data = "MockValue"
	return rp, nil
}

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

func (m *MockScanClient) ReadPropertyWithTimeout(dest btypes.Device, rp btypes.PropertyData, timeout time.Duration) (btypes.PropertyData, error) {
	return m.ReadProperty(dest, rp)
}

func (m *MockScanClient) ReadMultiPropertyWithTimeout(dev btypes.Device, rp btypes.MultiplePropertyData, timeout time.Duration) (btypes.MultiplePropertyData, error) {
	return m.ReadMultiProperty(dev, rp)
}

func TestBACnetDriver_Scan_Broadcast(t *testing.T) {
	// 1. Setup driver with a specific interface IP
	d := &BACnetDriver{
		interfaceIP:   "192.168.3.115",
		interfacePort: confirmedListenPort,
		subnetCIDR:    24,
		client: &MockScanClient{
			BoundIP: "192.168.3.115",
		},
	}

	// 2. Mock clientFactory for ephemeral scan client on 47808
	d.clientFactory = func(cb *bacnetlib.ClientBuilder) (Client, error) {
		return &MockScanClient{
			BoundIP: cb.Ip,
			Devices: []btypes.Device{
				{DeviceID: 1234, Ip: "192.168.3.115", Port: 47810},
				{DeviceID: 2228316, Ip: "192.168.3.115", Port: 58494},
				{DeviceID: 2228317, Ip: "192.168.3.115", Port: 64339},
			},
		}, nil
	}

	// 3. Run Scan (no device_id → device discovery mode)
	ctx := context.Background()
	resultAny, err := d.Scan(ctx, map[string]any{})
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	results, ok := resultAny.([]ScanResult)
	if !ok {
		t.Fatalf("Result is not []ScanResult, got %T", resultAny)
	}

	// 4. Verify: 3 devices discovered
	if len(results) != 3 {
		t.Errorf("Expected 3 devices, got %d", len(results))
	}

	deviceMap := make(map[int]ScanResult)
	for _, r := range results {
		deviceMap[r.DeviceID] = r
		if r.Status != "online" {
			t.Errorf("Device %d status expected online, got %s", r.DeviceID, r.Status)
		}
		if r.DiscoveryPhase != "broadcast" {
			t.Errorf("Device %d discovery_phase expected broadcast, got %s", r.DeviceID, r.DiscoveryPhase)
		}
	}

	for _, id := range []int{1234, 2228316, 2228317} {
		if _, ok := deviceMap[id]; !ok {
			t.Errorf("Device %d not found", id)
		}
	}
}

func (m *MockScanClient) WaitCOVNotification(processIDFilter int64, timeout time.Duration) (btypes.COVNotification, error) {
	return btypes.COVNotification{}, fmt.Errorf("not implemented")
}
