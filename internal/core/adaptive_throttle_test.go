package core

import (
	"testing"
	"time"
)

func TestAdaptiveThrottle_QueuePressureSlowdown(t *testing.T) {
	at := NewAdaptiveThrottle(nil)

	factor := at.Refresh(900, 1000, 0, 0)
	if factor < 2.0 {
		t.Fatalf("expected queue pressure factor >= 2.0, got %v", factor)
	}

	effective := at.EffectiveInterval(100 * time.Millisecond)
	if effective < 200*time.Millisecond {
		t.Fatalf("effective interval = %v, want >= 200ms", effective)
	}
}

func TestAdaptiveThrottle_RTTDrivenInterval(t *testing.T) {
	at := NewAdaptiveThrottle(nil)

	factor := at.Refresh(0, 1000, 0, 350)
	if factor < 3.0 {
		t.Fatalf("expected RTT-driven factor >= 3.0, got %v", factor)
	}

	effective := at.EffectiveInterval(time.Second)
	if effective < 3*time.Second {
		t.Fatalf("effective interval = %v, want >= 3s", effective)
	}
}

func TestAdaptiveThrottle_CappedAtFour(t *testing.T) {
	at := NewAdaptiveThrottle(nil)

	factor := at.Refresh(1000, 1000, 0.8, 1000)
	if factor != adaptiveThrottleMaxFactor {
		t.Fatalf("factor = %v, want cap %v", factor, adaptiveThrottleMaxFactor)
	}
}

func TestAdaptiveThrottle_ApplyIntervalRecordsMetric(t *testing.T) {
	metrics := &ScanEngineMetrics{}
	at := NewAdaptiveThrottle(metrics)
	at.Refresh(800, 1000, 0.2, 250)

	task := &ScanTask{
		BaseInterval: 100 * time.Millisecond,
		Interval:     100 * time.Millisecond,
	}

	if !at.ApplyInterval(task) {
		t.Fatal("expected interval adjustment")
	}

	task.mu.RLock()
	defer task.mu.RUnlock()
	if task.Interval <= task.BaseInterval {
		t.Fatalf("interval = %v, want > base %v", task.Interval, task.BaseInterval)
	}

	snap := metrics.Snapshot()
	if snap["scan_interval_adjusted_total"].(uint64) == 0 {
		t.Fatalf("expected scan_interval_adjusted_total > 0, got %v", snap)
	}
	if snap["adaptive_slowdown_factor"].(float64) <= 1.0 {
		t.Fatalf("expected adaptive_slowdown_factor > 1, got %v", snap)
	}
}

func TestAdaptiveThrottle_FailRateSlowdown(t *testing.T) {
	at := NewAdaptiveThrottle(nil)

	factor := at.Refresh(100, 1000, 0.25, 50)
	if factor < 1.5 {
		t.Fatalf("expected fail-rate slowdown >= 1.5, got %v", factor)
	}
}

func TestAdaptiveThrottle_DeviceRTTSpike(t *testing.T) {
	at := NewAdaptiveThrottle(nil)
	at.UpdateDeviceRTT("dev-slow", 100)
	at.UpdateDeviceRTT("dev-slow", 500)

	factor := at.DeviceFactor("dev-slow")
	if factor < deviceRTTMinFactor {
		t.Fatalf("device factor = %v, want >= %v", factor, deviceRTTMinFactor)
	}

	eff := at.effectiveIntervalForDevice("dev-slow", 100*time.Millisecond)
	if eff <= 100*time.Millisecond {
		t.Fatalf("effective interval = %v, want > base", eff)
	}
}

func TestAdaptiveThrottle_ApplyIntervalNoChange(t *testing.T) {
	at := NewAdaptiveThrottle(nil)
	task := &ScanTask{
		DeviceKey:    "dev-flat",
		BaseInterval: time.Second,
		Interval:     time.Second,
	}
	if at.ApplyInterval(task) {
		t.Fatal("ApplyInterval should not change when factor is 1")
	}
}

func TestAdaptiveThrottle_ApplyIntervalLocked(t *testing.T) {
	metrics := &ScanEngineMetrics{}
	at := NewAdaptiveThrottle(metrics)
	at.Refresh(900, 1000, 0, 0)

	task := &ScanTask{
		DeviceKey:    "dev-lock",
		BaseInterval: 100 * time.Millisecond,
		Interval:     100 * time.Millisecond,
	}
	task.mu.Lock()
	changed := at.applyIntervalLocked(task)
	task.mu.Unlock()
	if !changed {
		t.Fatal("applyIntervalLocked should adjust interval under pressure")
	}
}

func TestAdaptiveThrottle_NilSafeApplyInterval(t *testing.T) {
	var at *AdaptiveThrottle
	if at.ApplyInterval(&ScanTask{BaseInterval: time.Second, Interval: time.Second}) {
		t.Fatal("nil ApplyInterval should return false")
	}
	at.UpdateDeviceRTT("dev", 100)
}

func TestAdaptiveThrottle_QueuePressureTiers(t *testing.T) {
	at := NewAdaptiveThrottle(nil)

	cases := []struct {
		depth, limit int
		minFactor    float64
	}{
		{300, 1000, 1.4},
		{600, 1000, 1.9},
		{800, 1000, 2.4},
	}
	for _, tc := range cases {
		f := at.Refresh(tc.depth, tc.limit, 0, 0)
		if f < tc.minFactor {
			t.Fatalf("depth %d: factor %v < %v", tc.depth, f, tc.minFactor)
		}
	}
}
