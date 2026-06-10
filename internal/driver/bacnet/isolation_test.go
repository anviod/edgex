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

// IsolationMockClient simulates devices with configurable latency/errors
type IsolationMockClient struct {
	SmartMockClient
	Delays      map[int]time.Duration
	Errors      map[int]error
	CallCounter map[int]int
	mu          sync.Mutex
}

func (m *IsolationMockClient) ReadMultiProperty(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
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

func (m *IsolationMockClient) ReadProperty(dest btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
	return m.ReadPropertyWithTimeout(dest, rp, 10*time.Second)
}

func (m *IsolationMockClient) ReadPropertyWithTimeout(dest btypes.Device, rp btypes.PropertyData, timeout time.Duration) (btypes.PropertyData, error) {
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

func (m *IsolationMockClient) ReadMultiPropertyWithTimeout(dev btypes.Device, rp btypes.MultiplePropertyData, timeout time.Duration) (btypes.MultiplePropertyData, error) {
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

// Override WhoIs to return our devices
func (m *IsolationMockClient) WhoIs(wh *WhoIsOpts) ([]btypes.Device, error) {
	return m.SmartMockClient.WhoIs(wh)
}

func TestDeviceIsolation(t *testing.T) {
	// 1. Setup Mock
	mock := &IsolationMockClient{
		SmartMockClient: SmartMockClient{
			Devices: map[int]btypes.Device{
				1001:    {DeviceID: 1001, Ip: "192.168.1.10", Port: 47808, Addr: btypes.Address{Mac: []byte{192, 168, 1, 10, 0xBA, 0xC0}}},
				2228319: {DeviceID: 2228319, Ip: "192.168.3.112", Port: 57611, Addr: btypes.Address{Mac: []byte{192, 168, 3, 112, 0xE1, 0x0B}}}, // The problematic device
			},
			Values: map[string]interface{}{
				"1001:0:1":    float32(100.0), // AI:1
				"2228319:0:1": float32(319.0), // AI:1
			},
		},
		Delays:      make(map[int]time.Duration),
		Errors:      make(map[int]error),
		CallCounter: make(map[int]int),
	}

	// 2. Init Driver
	d := NewBACnetDriver().(*BACnetDriver)
	d.clientFactory = func(cb *ClientBuilder) (Client, error) {
		return mock, nil
	}
	d.Init(model.DriverConfig{Config: map[string]any{"ip": "0.0.0.0"}})
	d.Connect(context.Background())
	defer d.Disconnect()

	// 3. Configure Devices
	d.SetDeviceConfig(map[string]any{"instance_id": 1001, "ip": "192.168.1.10", "_internal_device_id": "dev-1001"})
	d.SetDeviceConfig(map[string]any{"instance_id": 2228319, "ip": "192.168.3.112", "_internal_device_id": "dev-bad"})

	// Wait for discovery
	time.Sleep(100 * time.Millisecond)

	// 4. Test Normal Operation (Success First to Populate Cache)
	ctx := context.Background()
	pointsGood := []model.Point{{ID: "P1", DeviceID: "dev-1001", Address: "0:1", DataType: "float32"}}
	pointsBad := []model.Point{{ID: "P2", DeviceID: "dev-bad", Address: "0:1", DataType: "float32"}}

	// Pre-populate cache for Bad Device (it was good initially)
	// We loop to ensure cache is populated
	for i := 0; i < 5; i++ {
		res, err := d.ReadPoints(ctx, pointsBad)
		if err == nil && len(res) > 0 {
			if _, ok := res["P2"]; ok {
				break
			}
		}
		time.Sleep(100 * time.Millisecond)
	}

	// Double check
	res, err := d.ReadPoints(ctx, pointsBad)
	if err != nil {
		t.Fatalf("Initial read for bad device failed: %v", err)
	}
	if _, ok := res["P2"]; !ok {
		t.Fatalf("Initial read missing P2")
	}

	_, err = d.ReadPoints(ctx, pointsGood)
	if err != nil {
		t.Fatalf("Setup failed: device 1001 should be good, got %v", err)
	}

	// 5. Simulate Fault on 2228319 (Timeout)
	mock.mu.Lock()
	mock.Errors[2228319] = fmt.Errorf("timeout")
	mock.Delays[2228319] = 100 * time.Millisecond // Simulate delay
	mock.mu.Unlock()

	// 6. Trigger Failures to Isolate
	// We need 3 failures to trigger isolation.
	// The background poller runs every 10s.
	// But we can trigger poll manually by adding a new point or just waiting.
	// To make test faster, we can call `d.pollDevice` via reflection OR expose it?
	// Or we can just use `StartPolling` but it's already started.

	// Let's use the `newPoints` trigger logic in `ReadPoints`.
	// If we read a NEW point, it triggers `go d.pollDevice`.
	// We can use a dummy point that we know will fail or succeed (doesn't matter, we just want to trigger poll).
	// But we need to make sure we don't mess up the cache for P2.

	timeout := time.After(15 * time.Second)
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	isolated := false
	dummyID := 0
	for !isolated {
		select {
		case <-timeout:
			t.Fatalf("Device failed to Isolate within timeout")
		case <-ticker.C:
			// Trigger poll by adding a new point
			dummyID++
			d.ReadPoints(ctx, []model.Point{{
				ID:       fmt.Sprintf("dummy-%d", dummyID),
				DeviceID: "dev-bad",
				Address:  "0:99",
				DataType: "float32",
			}})

			d.mu.Lock()
			if ctx, ok := d.deviceContexts[2228319]; ok {
				if ctx.State == DeviceStateIsolated {
					isolated = true
				}
			}
			d.mu.Unlock()
		}
	}

	t.Log("Device Isolated successfully")

	// 7. Verify Isolation (Fast Fail + Cache)
	// Next call should fail FAST (without calling mock) but return Cached Value
	mock.mu.Lock()
	preCallCount := mock.CallCounter[2228319]
	mock.mu.Unlock()

	start := time.Now()
	results, err := d.ReadPoints(ctx, pointsBad)
	dur := time.Since(start)

	mock.mu.Lock()
	postCallCount := mock.CallCounter[2228319]
	mock.mu.Unlock()

	if err != nil {
		t.Errorf("Expected cached result, got error: %v", err)
	} else {
		// Wait for cache consistency
		var val model.Value
		var ok bool

		// Ensure initial results are checked
		if v, found := results["P2"]; found {
			val = v
			ok = true
		} else {
			// Poll with longer duration
			for i := 0; i < 10; i++ {
				results, _ = d.ReadPoints(ctx, pointsBad)
				if v, found := results["P2"]; found {
					val = v
					ok = found
					break
				}
				time.Sleep(100 * time.Millisecond)
			}
		}

		if ok {
			// Quality should be Bad
			if val.Quality != "Bad" {
				// The requirement is "Offline-Cached value".
				// It means we return the last known Good value, but MARK it as Bad/Cached to indicate it might be stale.
				// However, our implementation sets Quality="Bad".
				// Let's check `ReadPoints` implementation again.
				// if len(devCtx.LastValues) > 0 { ... v.Quality = "Bad" ... }
				// So it should be Bad.

				// Why did we get "Good"?
				// Because `ReadPoints` returns a COPY of cached value.
				// In `ReadPoints`:
				/*
					if devCtx.State == DeviceStateIsolated {
						if len(devCtx.LastValues) > 0 {
							cachedResults := make(...)
							for k, v := range devCtx.LastValues {
								// copy
								newV := v
								newV.Quality = "Bad" // Modify copy
								cachedResults[k] = newV
							}
							return cachedResults, nil
						}
					}
				*/
				// Wait, did I implement that logic?
				// Let's check `bacnet.go`.

				t.Errorf("Expected Quality 'Bad' for cached value, got %s", val.Quality)
			}
			t.Logf("Got cached result: %v (Quality: %s)", val.Value, val.Quality)
		} else {
			// It might be empty if cache was cleared or never populated correctly
			// Check internal state
			d.mu.Lock()
			if devCtx, ok := d.deviceContexts[2228319]; ok {
				devCtx.CacheMu.RLock()
				cachedVal, cached := devCtx.LastValues["P2"]
				devCtx.CacheMu.RUnlock()

				if cached {
					t.Logf("Debug: Cache actually has P2: %v", cachedVal)
				} else {
					t.Log("Debug: Cache missing P2")
				}
			}
			d.mu.Unlock()

			t.Error("Cached result missing P2")
		}
	}

	// Check if it was fast (should be near instantaneous)
	if dur > 50*time.Millisecond {
		t.Errorf("Isolation failed: Duration %v is too long", dur)
	}

	// Check if mock was called (should NOT be called if isolated)
	if postCallCount != preCallCount {
		t.Errorf("Isolation failed: Mock client was called %d times", postCallCount-preCallCount)
	} else {
		t.Log("✅ Device successfully isolated (no network calls) and returned cache")
	}

	// 8. Verify Normal Device is unaffected
	start = time.Now()
	_, err = d.ReadPoints(ctx, pointsGood)
	if err != nil {
		t.Errorf("Normal device failed during isolation of bad device: %v", err)
	}
	if time.Since(start) > 50*time.Millisecond {
		t.Errorf("Normal device too slow: %v", time.Since(start))
	}
}
