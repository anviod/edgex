package core

import (
	"testing"
	"time"
)

func TestSoakMonitor_ReleaseGateAllPass(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{
		TickInterval: 10 * time.Millisecond,
		WorkerCount:  2,
		MaxQueueSize: 100,
	})
	se.Run()
	t.Cleanup(se.Stop)

	cm := &ChannelManager{scanEngineAdapter: NewScanEngineAdapter(se)}
	sm := NewSoakMonitor(cm)
	sm.recordSample()

	snap := sm.Snapshot()
	gate, ok := snap["release_gate"].(map[string]any)
	if !ok {
		t.Fatal("missing release_gate")
	}
	if gate["all_passed"] != true {
		t.Fatalf("expected all_passed true, got %v", gate["all_passed"])
	}
	items, ok := gate["items"].([]soakReleaseGateItem)
	if !ok {
		t.Fatal("missing gate items")
	}
	if len(items) != 6 {
		t.Fatalf("expected 6 gate items, got %d", len(items))
	}
}

func TestSoakMonitor_BacklogGatePassesAtTaskBaseline(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{MaxQueueSize: 100})
	cm := &ChannelManager{scanEngineAdapter: NewScanEngineAdapter(se)}
	sm := NewSoakMonitor(cm)

	instant := soakInstantMetrics{
		Running:          true,
		TaskCount:        12,
		TotalBacklog:     12,
		ScanClassLate:    0,
		SerialQueueDepth: 0,
	}
	gates := sm.buildReleaseGateItems(instant)
	for _, g := range gates {
		if g.ID != "backlog_stable" {
			continue
		}
		if !g.Passed {
			t.Fatalf("expected backlog gate to pass at task baseline, detail=%q", g.Detail)
		}
		return
	}
	t.Fatal("backlog gate not found")
}

func TestSoakMonitor_BacklogGateFailsAboveThreshold(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{MaxQueueSize: 100})
	cm := &ChannelManager{scanEngineAdapter: NewScanEngineAdapter(se)}
	sm := NewSoakMonitor(cm)

	sm.mu.Lock()
	sm.maxExcessBacklog = 15
	sm.mu.Unlock()

	instant := soakInstantMetrics{
		Running:      true,
		TaskCount:    12,
		TotalBacklog: 27, // excess 15 > threshold 10
	}
	gates := sm.buildReleaseGateItems(instant)
	for _, g := range gates {
		if g.ID != "backlog_stable" {
			continue
		}
		if g.Passed {
			t.Fatal("expected backlog gate to fail when excess backlog exceeds threshold")
		}
		return
	}
	t.Fatal("backlog gate not found")
}

func TestSoakMonitor_BacklogGateFailsOnCurrentExcess(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{MaxQueueSize: 100})
	cm := &ChannelManager{scanEngineAdapter: NewScanEngineAdapter(se)}
	sm := NewSoakMonitor(cm)

	instant := soakInstantMetrics{
		Running:          true,
		TaskCount:        5,
		TotalBacklog:     20, // excess 15 > threshold 10
		SerialQueueDepth: 8,
	}
	gates := sm.buildReleaseGateItems(instant)
	for _, g := range gates {
		if g.ID != "backlog_stable" {
			continue
		}
		if g.Passed {
			t.Fatal("expected backlog gate to fail on current excess backlog")
		}
		if g.Value != 15 {
			t.Fatalf("expected gate value 15, got %v", g.Value)
		}
		return
	}
	t.Fatal("backlog gate not found")
}

func TestSoakExcessBacklog(t *testing.T) {
	if got := soakExcessBacklog(12, 12); got != 0 {
		t.Fatalf("got %d, want 0", got)
	}
	if got := soakExcessBacklog(8, 12); got != 0 {
		t.Fatalf("got %d, want 0 for negative excess", got)
	}
	if got := soakExcessBacklog(22, 12); got != 10 {
		t.Fatalf("got %d, want 10", got)
	}
}

func TestSoakMonitor_PointSuccessGate(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{MaxQueueSize: 100})
	cm := &ChannelManager{scanEngineAdapter: NewScanEngineAdapter(se)}
	sm := NewSoakMonitor(cm)

	sm.mu.Lock()
	sm.minPointSuccessRate = 0.985
	sm.minPointSuccessLabel = "modbus-tcp"
	sm.mu.Unlock()

	instant := soakInstantMetrics{Running: true}
	gates := sm.buildReleaseGateItems(instant)
	for _, g := range gates {
		if g.ID != "point_success_rate" {
			continue
		}
		if g.Passed {
			t.Fatal("expected point success gate to fail at 98.5%")
		}
		if !g.Warning {
			t.Fatal("expected warning flag on failing point success gate")
		}
		return
	}
	t.Fatal("point success gate not found")
}

func TestFormatSoakInterval(t *testing.T) {
	if got := formatSoakInterval(5 * time.Second); got != "5s" {
		t.Fatalf("got %q, want 5s", got)
	}
	if got := formatSoakInterval(100 * time.Millisecond); got != "100ms" {
		t.Fatalf("got %q, want 100ms", got)
	}
}

func TestCountOpenCircuits(t *testing.T) {
	cb := NewDriverCircuitBreaker()
	key := "dev-1"
	for i := 0; i < circuitBreakerConsecutiveTimeoutThreshold; i++ {
		cb.Record(key, false, true)
	}
	if cb.State(key) != CircuitOpen {
		t.Fatal("expected circuit to open after consecutive timeouts")
	}
	if countOpenCircuits(cb) != 1 {
		t.Fatalf("expected 1 open circuit, got %d", countOpenCircuits(cb))
	}
}

func TestSoakMonitor_StartStop(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{MaxQueueSize: 100})
	cm := &ChannelManager{scanEngineAdapter: NewScanEngineAdapter(se)}
	sm := NewSoakMonitor(cm)

	sm.Start()
	sm.Start() // idempotent
	time.Sleep(20 * time.Millisecond)
	sm.Stop()
	sm.Stop() // idempotent
}

func TestSoakMonitor_NilChannelManager(t *testing.T) {
	sm := NewSoakMonitor(nil)
	sm.recordSample()
	snap := sm.Snapshot()
	if snap["session"] == nil {
		t.Fatal("expected session block in snapshot")
	}
}

func TestSoakMonitor_TrendSamplesTrimmed(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{MaxQueueSize: 100})
	cm := &ChannelManager{scanEngineAdapter: NewScanEngineAdapter(se)}
	sm := NewSoakMonitor(cm)

	sm.mu.Lock()
	for i := 0; i < SoakMaxTrendSamples+5; i++ {
		sm.samples = append(sm.samples, soakTrendSample{TotalBacklog: i})
	}
	sm.mu.Unlock()
	sm.recordSample()

	sm.mu.RLock()
	defer sm.mu.RUnlock()
	if len(sm.samples) > SoakMaxTrendSamples {
		t.Fatalf("samples len %d exceeds cap %d", len(sm.samples), SoakMaxTrendSamples)
	}
}
