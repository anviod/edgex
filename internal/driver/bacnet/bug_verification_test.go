package bacnet

import (
	"context"
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/model"
)

// RealWorldMockClient simulates the specific environment described in the bug report
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
			return rp, context.DeadlineExceeded
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
			return btypes.MultiplePropertyData{}, context.DeadlineExceeded
		}
		time.Sleep(delay)
	}

	if err != nil {
		return btypes.MultiplePropertyData{}, err
	}

	return m.SmartMockClient.ReadMultiProperty(dev, rp)
}

func (m *RealWorldMockClient) WhoIs(wh *WhoIsOpts) ([]btypes.Device, error) {
	// Simulate WhoIs delay for offline devices if needed, but usually WhoIs returns what is found.
	// For offline device, it just won't be in the list.
	// But if we are simulating a timeout during discovery (which happens if we wait for responses),
	// the driver's discovery logic handles the wait (1s).
	// Here we just return available devices.
	var found []btypes.Device
	m.mu.Lock()
	defer m.mu.Unlock()

	// If checking for a specific range, return match.
	for id, dev := range m.Devices {
		if (wh.Low == -1 || id >= wh.Low) && (wh.High == -1 || id <= wh.High) {
			// Check if this device is "Offline" in our mock (simulated by Error or simply not returning it in WhoIs)
			// If it has a timeout error set, we might simulate it not responding to WhoIs.
			if _, isErr := m.Errors[id]; isErr {
				continue
			}
			found = append(found, dev)
		}
	}
	return found, nil
}

func TestBugVerification_Strict(t *testing.T) {
	// Setup Mock Client with devices from the document
	mock := &RealWorldMockClient{
		SmartMockClient: SmartMockClient{
			Devices: map[int]btypes.Device{
				2228316: {DeviceID: 2228316, Ip: "192.168.3.116", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 3, 116, 0xBA, 0xC0}}},
				2228317: {DeviceID: 2228317, Ip: "192.168.3.117", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 3, 117, 0xBA, 0xC0}}},
				2228318: {DeviceID: 2228318, Ip: "192.168.3.118", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 3, 118, 0xBA, 0xC0}}},
				2228319: {DeviceID: 2228319, Ip: "192.168.3.119", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 3, 119, 0xBA, 0xC0}}},
			},
			Values: map[string]interface{}{
				"2228316:2:1": float32(316.00), // AnalogValue:1 (Type 2)
				"2228317:2:1": float32(317.00),
				"2228318:2:1": float32(318.00),
				"2228319:2:1": float32(319.00),
			},
		},
		Delays:      make(map[int]time.Duration),
		Errors:      make(map[int]error),
		CallCounter: make(map[int]int),
	}

	// Init Driver
	d := NewBACnetDriver().(*BACnetDriver)
	d.clientFactory = func(cb *ClientBuilder) (Client, error) {
		return mock, nil
	}
	d.Init(model.DriverConfig{Config: map[string]any{"ip": "0.0.0.0"}})
	d.Connect(context.Background())
	defer d.Disconnect()

	// Configure Devices
	devices := []int{2228316, 2228317, 2228318, 2228319}
	for _, id := range devices {
		d.SetDeviceConfig(map[string]any{
			"instance_id":         id,
			"ip":                  fmt.Sprintf("192.168.3.%d", id%1000),    // Dummy IP logic
			"_internal_device_id": fmt.Sprintf("bacnet-%d", (id%1000)-300), // e.g. bacnet-16
		})
	}
	// Specifically map 2228319 to Room_FC_2014_19 as per doc
	d.SetDeviceConfig(map[string]any{
		"instance_id":         2228319,
		"ip":                  "192.168.3.112", // IP from user input
		"_internal_device_id": "Room_FC_2014_19",
	})

	// Wait for initial discovery
	time.Sleep(200 * time.Millisecond)

	// Simulate 2228319 Offline (Timeout)
	mock.mu.Lock()
	mock.Errors[2228319] = fmt.Errorf("i/o timeout")
	mock.Delays[2228319] = 2000 * time.Millisecond // Simulate 2s timeout (Doc requirement: API < 3s)
	mock.mu.Unlock()

	// Define Points
	p16 := []model.Point{{ID: "P16", DeviceID: "bacnet-16", Address: "AnalogValue:1", DataType: "float32"}}
	p17 := []model.Point{{ID: "P17", DeviceID: "bacnet-17", Address: "AnalogValue:1", DataType: "float32"}}
	p18 := []model.Point{{ID: "P18", DeviceID: "bacnet-18", Address: "AnalogValue:1", DataType: "float32"}}
	p19 := []model.Point{{ID: "P19", DeviceID: "Room_FC_2014_19", Address: "AnalogValue:1", DataType: "float32"}}

	ctx := context.Background()

	// --- Phase 1: Trigger Isolation for 2228319 ---
	t.Log("--- Phase 1: Triggering Isolation for 2228319 ---")
	// We need 3 failures to isolate.
	// Since ReadPoints is now async/cached, we loop until isolated.

	timeout := time.After(15 * time.Second)
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	isolated := false
	for !isolated {
		select {
		case <-timeout:
			t.Fatalf("Device 19 failed to become Isolated within timeout")
		case <-ticker.C:
			// Trigger poll
			d.ReadPoints(ctx, p19)

			d.mu.Lock()
			state := d.deviceContexts[2228319].State
			failures := d.deviceContexts[2228319].ConsecutiveFailures
			d.mu.Unlock()

			if state == DeviceStateIsolated {
				isolated = true
				t.Logf("Device 19 Isolated! Failures: %d", failures)
			}
		}
	}

	// --- Phase 2: Verify Isolation and Concurrent Access ---
	t.Log("--- Phase 2: Verifying Isolation & Concurrent Access ---")

	// Now 2228319 should be isolated.
	// We will try to read 16, 17, 18 AND 19 concurrently.
	// 19 should return fast (cached bad) or error fast.
	// 16, 17, 18 should return fast (correct values).

	var wg sync.WaitGroup
	wg.Add(4)

	errors := make(chan error, 4)

	// Launch 19 (Faulty)
	go func() {
		defer wg.Done()
		start := time.Now()
		res, err := d.ReadPoints(ctx, p19)
		dur := time.Since(start)

		// Expect fast return due to isolation
		if dur > 100*time.Millisecond {
			errors <- fmt.Errorf("Isolated device 19 took too long: %v (Expected < 100ms)", dur)
		}

		// Expect error or Bad Quality cache
		// Since we haven't read successfully before, cache might be empty -> Error "isolated"
		// Or if we implemented empty cache return?
		// Current impl: if cache empty, returns error "isolated until..."
		if err == nil {
			// If success, check quality
			if len(res) > 0 && res["P19"].Quality != "Bad" {
				errors <- fmt.Errorf("Device 19 returned Good quality unexpectedly: %v", res)
			}
		} else {
			t.Logf("Device 19 correctly returned error/isolated: %v", err)
		}
	}()

	// Launch 16, 17, 18 (Healthy)
	checkHealthy := func(p []model.Point, expected float32) {
		defer wg.Done()

		// Retry loop for cache warmup (max 2s)
		for i := 0; i < 20; i++ {
			start := time.Now()
			res, err := d.ReadPoints(ctx, p)
			dur := time.Since(start)

			if err != nil {
				errors <- fmt.Errorf("Device %s failed: %v", p[0].DeviceID, err)
				return
			}

			if val, ok := res[p[0].ID]; ok {
				if val.Value != expected {
					errors <- fmt.Errorf("Device %s wrong value: got %v, want %v", p[0].DeviceID, val.Value, expected)
					return
				}
				// Verify CachedAt
				if val.CachedAt.IsZero() {
					errors <- fmt.Errorf("Device %s CachedAt is zero", p[0].DeviceID)
					return
				}
				t.Logf("Device %s OK: %v (Time: %v, CachedAt: %v)", p[0].DeviceID, val.Value, dur, val.CachedAt.Format(time.TimeOnly))
				return
			}

			// Cache miss, wait a bit
			time.Sleep(100 * time.Millisecond)
		}
		errors <- fmt.Errorf("Device %s timeout waiting for cache", p[0].DeviceID)
	}

	go checkHealthy(p16, 316.0)
	go checkHealthy(p17, 317.0)
	go checkHealthy(p18, 318.0)

	wg.Wait()
	close(errors)

	for err := range errors {
		t.Errorf("Verification Failed: %v", err)
	}

	// Check Isolation State explicitly
	d.mu.Lock()
	ctx19 := d.deviceContexts[2228319]
	d.mu.Unlock()
	if ctx19.State != DeviceStateIsolated {
		t.Errorf("Device 19 state should be Isolated (3), got %d", ctx19.State)
	} else {
		t.Log("✅ Device 19 is correctly marked as Isolated")
	}
}
