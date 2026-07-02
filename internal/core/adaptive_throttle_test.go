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

func TestAdaptiveThrottle_CappedAtEight(t *testing.T) {
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
