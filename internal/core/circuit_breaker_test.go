package core

import (
	"testing"
	"time"
)

func TestDriverCircuitBreaker_ConsecutiveTimeoutsOpen(t *testing.T) {
	cb := NewDriverCircuitBreaker()
	key := "dev-1"

	for i := 0; i < circuitBreakerConsecutiveTimeoutThreshold-1; i++ {
		cb.Record(key, false, true)
		if cb.State(key) != CircuitClosed {
			t.Fatalf("iteration %d: state = %v, want Closed", i, cb.State(key))
		}
	}

	cb.Record(key, false, true)
	if cb.State(key) != CircuitOpen {
		t.Fatalf("state = %v, want Open after %d timeouts", cb.State(key), circuitBreakerConsecutiveTimeoutThreshold)
	}
	if cb.Allow(key) {
		t.Fatal("open circuit should reject requests")
	}
}

func TestDriverCircuitBreaker_HalfOpenRecovery(t *testing.T) {
	cb := NewDriverCircuitBreaker()
	key := "dev-2"

	for i := 0; i < circuitBreakerConsecutiveTimeoutThreshold; i++ {
		cb.Record(key, false, true)
	}

	entry := cb.entry(key)
	entry.openedAt = time.Now().Add(-circuitBreakerOpenDuration)

	if !cb.Allow(key) {
		t.Fatal("expected half-open probe to be allowed")
	}
	if cb.State(key) != CircuitHalfOpen {
		t.Fatalf("state = %v, want HalfOpen", cb.State(key))
	}

	cb.Record(key, true, false)
	if cb.State(key) != CircuitClosed {
		t.Fatalf("state = %v, want Closed after successful probe", cb.State(key))
	}
}

func TestDriverCircuitBreaker_FailureRateOpens(t *testing.T) {
	cb := NewDriverCircuitBreaker()
	key := "dev-3"
	now := time.Now()

	entry := cb.entry(key)
	for i := 0; i < 5; i++ {
		entry.outcomes = append(entry.outcomes, circuitOutcome{at: now, success: true})
	}
	for i := 0; i < 5; i++ {
		entry.outcomes = append(entry.outcomes, circuitOutcome{at: now, success: false})
	}

	cb.Record(key, false, false)
	if cb.State(key) != CircuitOpen {
		t.Fatalf("state = %v, want Open when failure rate exceeds threshold", cb.State(key))
	}
}

func TestExecutionLayer_CircuitBreakerRejectedResult(t *testing.T) {
	el := NewExecutionLayer()
	task := &ScanTask{
		DeviceKey: "dev-1",
		PointIDs:  []string{"p1", "p2"},
	}

	cb := el.GetCircuitBreaker()
	cb.Record("dev-1", false, true)
	cb.Record("dev-1", false, true)
	cb.Record("dev-1", false, true)
	cb.Record("dev-1", false, true)
	cb.Record("dev-1", false, true)

	result := el.Execute(task)
	if result.Success {
		t.Fatal("expected circuit-open execute to fail")
	}
	if result.Error != ErrCircuitOpen {
		t.Fatalf("error = %v, want ErrCircuitOpen", result.Error)
	}
	for _, id := range []string{"p1", "p2"} {
		v, ok := result.Values[id]
		if !ok {
			t.Fatalf("missing value for %s", id)
		}
		if v.Quality != "Bad" {
			t.Fatalf("point %s quality = %q, want Bad", id, v.Quality)
		}
	}
}
