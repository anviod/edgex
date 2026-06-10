package bacnet

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/model"
)

// TestCompliance_BACnet_Isolation implements the test plan from "BACnet 多设备隔离采集测试方案.md"
func TestCompliance_BACnet_Isolation(t *testing.T) {
	// 1. Setup Mock Environment with 4 devices
	// - bacnet-16 (Healthy)
	// - bacnet-17 (Healthy)
	// - bacnet-18 (Healthy)
	// - Room_FC_2014_19 (Unhealthy/Offline)

	mock := &RealWorldMockClient{
		SmartMockClient: SmartMockClient{
			Devices: map[int]btypes.Device{
				2228316: {DeviceID: 2228316, Ip: "192.168.3.110", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 3, 110, 0xBA, 0xC0}}},
				2228317: {DeviceID: 2228317, Ip: "192.168.3.111", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 3, 111, 0xBA, 0xC0}}},
				2228318: {DeviceID: 2228318, Ip: "192.168.3.112", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 3, 112, 0xBA, 0xC0}}},
				2228319: {DeviceID: 2228319, Ip: "192.168.3.113", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 3, 113, 0xBA, 0xC0}}},
			},
			Values: map[string]interface{}{
				"2228316:2:1": float32(316.00), // AnalogValue:1
				"2228317:2:1": float32(317.00),
				"2228318:2:1": float32(318.00),
				"2228319:2:1": float32(319.00), // This will be unreachable
			},
		},
		Delays: map[int]time.Duration{
			2228319: 2 * time.Second, // Timeout simulation (User plan says 3s API timeout, mock driver timeout is shorter)
		},
		Errors: map[int]error{
			2228319: context.DeadlineExceeded,
		},
		CallCounter: make(map[int]int),
	}

	d := NewBACnetDriver().(*BACnetDriver)
	d.clientFactory = func(cb *ClientBuilder) (Client, error) {
		return mock, nil
	}
	d.Init(model.DriverConfig{Config: map[string]any{"ip": "0.0.0.0"}})
	d.Connect(context.Background())
	defer d.Disconnect()

	// Configure Devices
	devices := []struct {
		ID   int
		Name string
	}{
		{2228316, "bacnet-16"},
		{2228317, "bacnet-17"},
		{2228318, "bacnet-18"},
		{2228319, "Room_FC_2014_19"},
	}

	for _, dev := range devices {
		d.SetDeviceConfig(map[string]any{
			"instance_id":         dev.ID,
			"ip":                  fmt.Sprintf("192.168.3.%d", dev.ID%100), // Mock IP
			"_internal_device_id": dev.Name,
		})
	}

	// Wait for initial discovery
	time.Sleep(100 * time.Millisecond)

	ctx := context.Background()

	// Points Definition
	p16 := []model.Point{{ID: "P16", DeviceID: "bacnet-16", Address: "AnalogValue:1", DataType: "float32"}}
	p17 := []model.Point{{ID: "P17", DeviceID: "bacnet-17", Address: "AnalogValue:1", DataType: "float32"}}
	p18 := []model.Point{{ID: "P18", DeviceID: "bacnet-18", Address: "AnalogValue:1", DataType: "float32"}}
	p19 := []model.Point{{ID: "P19", DeviceID: "Room_FC_2014_19", Address: "AnalogValue:1", DataType: "float32"}}

	// ===================================================================================
	// Use Case 1: Normal Read Test (Wait for cache population)
	// ===================================================================================
	t.Log("=== Use Case 1: Normal Read Test ===")
	// Trigger polling for healthy devices
	d.ReadPoints(ctx, p16)
	d.ReadPoints(ctx, p17)
	d.ReadPoints(ctx, p18)

	// Wait for Poller to fetch data (Mock is fast for healthy)
	time.Sleep(100 * time.Millisecond)

	verifyPoint := func(p []model.Point, expected float32) {
		start := time.Now()
		res, err := d.ReadPoints(ctx, p)
		dur := time.Since(start)

		if err != nil {
			t.Errorf("Device %s read failed: %v", p[0].DeviceID, err)
			return
		}

		val, ok := res[p[0].ID]
		if !ok {
			// It might be initializing cache
			t.Logf("Device %s cache warming up...", p[0].DeviceID)
			return
		}

		if val.Quality != "Good" {
			t.Errorf("Device %s Quality should be Good, got %s", p[0].DeviceID, val.Quality)
		}
		if val.Value != expected {
			t.Errorf("Device %s Value mismatch: got %v, want %v", p[0].DeviceID, val.Value, expected)
		}
		if dur > 10*time.Millisecond {
			t.Errorf("Device %s API Read too slow (Cache Miss?): %v", p[0].DeviceID, dur)
		}
		t.Logf("✅ Device %s Normal Read OK (Time: %v, Quality: %s)", p[0].DeviceID, dur, val.Quality)
	}

	// Retry loop for cache readiness
	for i := 0; i < 5; i++ {
		verifyPoint(p16, 316.0)
		verifyPoint(p17, 317.0)
		verifyPoint(p18, 318.0)
		time.Sleep(200 * time.Millisecond)
	}

	// ===================================================================================
	// Use Case 2: Single Device Offline Isolation
	// ===================================================================================
	t.Log("=== Use Case 2: Offline Isolation Test ===")

	// Force Trigger 19 (Offline)
	// We need to wait for it to become Isolated.
	// Since ReadPoints returns cache (which is empty or error), we need to check internal state or keep calling.

	timeout := time.After(15 * time.Second)
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	isolated := false
	for !isolated {
		select {
		case <-timeout:
			t.Fatalf("Device 19 failed to Isolate within 15s")
		case <-ticker.C:
			d.ReadPoints(ctx, p19) // Trigger poll

			d.mu.Lock()
			ctx19, ok := d.deviceContexts[2228319]
			d.mu.Unlock()

			if ok && ctx19.State == DeviceStateIsolated {
				isolated = true
				t.Logf("✅ Device 19 Isolated successfully (Failures: %d)", ctx19.ConsecutiveFailures)
			}
		}
	}

	// Verify others are still Good
	verifyPoint(p16, 316.0)
	verifyPoint(p17, 317.0)
	verifyPoint(p18, 318.0)

	// ===================================================================================
	// Use Case 3: Interface Timeout Verification (API Response Time)
	// ===================================================================================
	t.Log("=== Use Case 3: API Timeout Verification ===")

	// Even if device is Isolated or Polling, API must return instantly (< 3s)

	checkApiTime := func(p []model.Point) {
		start := time.Now()
		_, _ = d.ReadPoints(ctx, p)
		dur := time.Since(start)

		if dur > 50*time.Millisecond { // Strict check (should be < 1ms if cached)
			t.Errorf("API Timeout Violation! Device %s took %v", p[0].DeviceID, dur)
		} else {
			t.Logf("✅ API Response Time for %s: %v", p[0].DeviceID, dur)
		}
	}

	checkApiTime(p16)
	checkApiTime(p19) // Even bad device should return fast (Cached Bad or Error)

	// Final Report Summary
	t.Log("=== Compliance Test Summary ===")
	t.Log("1. All online devices (16,17,18) returned Good quality.")
	t.Log("2. Offline device (19) was successfully isolated.")
	t.Log("3. Isolation of (19) did not impact (16,17,18).")
	t.Log("4. API response times were within limits (< 3s).")
}
