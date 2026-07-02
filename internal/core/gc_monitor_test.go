package core

import (
	"testing"
	"time"
)

func TestGCMonitorMetrics_Snapshot(t *testing.T) {
	m := NewGCMonitor(nil)
	m.Metrics().PauseMaxMs.Store(15000)
	m.Metrics().AllocRateBytesSec.Store(1024 * 1024)

	snap := m.Metrics().Snapshot()
	if snap["gc_pause_max_ms"].(float64) != 15.0 {
		t.Fatalf("gc_pause_max_ms = %v, want 15", snap["gc_pause_max_ms"])
	}
	if snap["alloc_rate_bytes_sec"].(uint64) != 1024*1024 {
		t.Fatalf("alloc_rate_bytes_sec = %v", snap["alloc_rate_bytes_sec"])
	}
}

func TestGCMonitor_HighPauseReducesBackpressure(t *testing.T) {
	bc := NewBackpressureController(512, 1000)
	initialRate := bc.TokenRate()

	var triggered bool
	monitor := NewGCMonitor(func(pauseMaxMs float64) {
		if pauseMaxMs >= gcPauseThresholdMs {
			bc.ReduceTokenRate(gcBackpressureRateFactor)
			triggered = true
		}
	})

	monitor.onHighPause(gcPauseThresholdMs)
	if !triggered {
		t.Fatal("expected high pause callback")
	}

	if bc.TokenRate() >= initialRate {
		t.Fatalf("token rate = %v, want reduced from %v", bc.TokenRate(), initialRate)
	}
}

func TestGCMonitor_StartStop(t *testing.T) {
	m := NewGCMonitor(nil)
	m.Start()
	time.Sleep(10 * time.Millisecond)
	m.Stop()
	m.Stop()
}
