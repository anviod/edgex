package core

import (
	"testing"
	"time"
)

func TestPointDegradationManager_DegradeAndRecover(t *testing.T) {
	m := NewPointDegradationManager()
	deviceID := "dev-1"
	points := []string{"p1", "p2"}

	active, skipped := m.FilterForRead(deviceID, points)
	if len(active) != 2 || len(skipped) != 0 {
		t.Fatalf("expected all active initially, got active=%d skipped=%d", len(active), len(skipped))
	}

	for i := 0; i < pointDegradeThreshold; i++ {
		m.RecordResults(deviceID, map[string]string{"p1": "Bad"})
	}

	if !m.IsDegraded(deviceID, "p1") {
		t.Fatal("p1 should be degraded")
	}

	active, skipped = m.FilterForRead(deviceID, points)
	if len(active) != 1 || active[0] != "p2" {
		t.Fatalf("expected only p2 active, got %v skipped=%v", active, skipped)
	}

	m.RecordResults(deviceID, map[string]string{"p1": "Good"})
	if m.IsDegraded(deviceID, "p1") {
		t.Fatal("p1 should recover after Good read")
	}
}

func TestPointDegradationManager_ProbeWindow(t *testing.T) {
	m := NewPointDegradationManager()
	deviceID := "dev-1"
	for i := 0; i < pointDegradeThreshold; i++ {
		m.RecordResults(deviceID, map[string]string{"p1": "Bad"})
	}

	m.mu.Lock()
	st := m.states[pointDegradeKey(deviceID, "p1")]
	st.nextProbe = time.Now().Add(1 * time.Hour)
	m.mu.Unlock()

	active, _ := m.FilterForRead(deviceID, []string{"p1"})
	if len(active) != 0 {
		t.Fatal("degraded point should be skipped before probe time")
	}

	m.mu.Lock()
	st.nextProbe = time.Now().Add(-time.Second)
	m.mu.Unlock()

	active, _ = m.FilterForRead(deviceID, []string{"p1"})
	if len(active) != 1 {
		t.Fatal("degraded point should be probed after probe time")
	}
}
