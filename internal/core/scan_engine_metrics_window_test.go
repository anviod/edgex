package core

import "testing"

func TestScanEngineMetrics_WindowedDriftAndMiss(t *testing.T) {
	m := &ScanEngineMetrics{}
	m.RecordDrift(60_000)
	m.RecordMissDeadline()

	snap := m.Snapshot()
	if snap["scan_drift_avg_ms_window"].(float64) != 60.0 {
		t.Fatalf("window drift avg = %v, want 60", snap["scan_drift_avg_ms_window"])
	}
	if snap["scan_miss_deadline_window"].(uint64) != 1 {
		t.Fatalf("window miss = %v, want 1", snap["scan_miss_deadline_window"])
	}
	if snap["scan_drift_avg_ms"].(float64) != 60.0 {
		t.Fatalf("cumulative drift avg = %v, want 60", snap["scan_drift_avg_ms"])
	}
	if snap["scan_miss_deadline_total"].(uint64) != 1 {
		t.Fatalf("cumulative miss = %v, want 1", snap["scan_miss_deadline_total"])
	}

	warnings := m.SLAWarnings(nil)
	foundDrift := false
	foundMiss := false
	for _, w := range warnings {
		switch w["metric"] {
		case "scan_drift_avg_ms_window":
			foundDrift = true
		case "scan_miss_deadline_window":
			foundMiss = true
		}
	}
	if !foundDrift {
		t.Fatalf("expected windowed drift warning, got %+v", warnings)
	}
	if !foundMiss {
		t.Fatalf("expected windowed miss warning, got %+v", warnings)
	}
}

func TestScanEngineMetrics_ChannelScopedMetrics(t *testing.T) {
	m := &ScanEngineMetrics{}
	m.RecordDriftForChannel("ch-a", 60_000)
	m.RecordDriftForChannel("ch-b", 10_000)
	m.RecordExecuteForChannel("ch-a", true, 150_000)

	chASnap := m.ChannelSnapshot("ch-a")
	chBSnap := m.ChannelSnapshot("ch-b")
	if chASnap["scan_drift_avg_ms_window"].(float64) != 60.0 {
		t.Fatalf("ch-a drift window = %v", chASnap["scan_drift_avg_ms_window"])
	}
	if chBSnap["scan_drift_avg_ms_window"].(float64) != 10.0 {
		t.Fatalf("ch-b drift window = %v", chBSnap["scan_drift_avg_ms_window"])
	}

	globalSnap := m.Snapshot()
	if globalSnap["scan_drift_avg_ms_window"].(float64) != 35.0 {
		t.Fatalf("global drift window avg = %v, want 35", globalSnap["scan_drift_avg_ms_window"])
	}

	wA := m.ChannelSLAWarnings("ch-a", nil, nil)
	wB := m.ChannelSLAWarnings("ch-b", nil, nil)
	if len(wA) == 0 {
		t.Fatal("expected ch-a SLA warnings")
	}
	if len(wB) != 0 {
		t.Fatalf("expected no ch-b SLA warnings, got %+v", wB)
	}
}

func TestScanEngineMetrics_ChannelSLAWarningsCircuitOpen(t *testing.T) {
	m := &ScanEngineMetrics{}
	cb := NewDriverCircuitBreaker()
	key := "dev-1"
	for i := 0; i < circuitBreakerConsecutiveTimeoutThreshold; i++ {
		cb.Record(key, false, true)
	}
	if cb.State(key) != CircuitOpen {
		t.Fatal("expected circuit open")
	}

	warnings := m.ChannelSLAWarnings("ch-1", cb, []string{key})
	foundOpen := false
	for _, w := range warnings {
		if w["code"] == "circuit_breaker_open" {
			foundOpen = true
		}
	}
	if !foundOpen {
		t.Fatalf("expected circuit_breaker_open warning, got %+v", warnings)
	}
}

func TestScanEngineMetrics_ResetWindowClearsWindows(t *testing.T) {
	m := &ScanEngineMetrics{}
	m.RecordDrift(60_000)
	m.RecordMissDeadline()
	m.RecordDriftForChannel("ch-1", 60_000)
	m.ResetWindow()

	snap := m.Snapshot()
	if snap["scan_drift_avg_ms_window"].(float64) != 0 {
		t.Fatalf("drift window after reset = %v", snap["scan_drift_avg_ms_window"])
	}
	if snap["scan_miss_deadline_window"].(uint64) != 0 {
		t.Fatalf("miss window after reset = %v", snap["scan_miss_deadline_window"])
	}
	if len(m.SLAWarnings(nil)) != 0 {
		t.Fatal("expected no SLA warnings after reset")
	}
	chSnap := m.ChannelSnapshot("ch-1")
	if chSnap["scan_drift_avg_ms_window"].(float64) != 0 {
		t.Fatalf("channel drift window after reset = %v", chSnap["scan_drift_avg_ms_window"])
	}
}
