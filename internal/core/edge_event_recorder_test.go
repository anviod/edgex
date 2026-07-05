package core

import (
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
)

func TestEdgeEventRecorder_CompleteLifecycle(t *testing.T) {
	em := newTestEdgeComputeManager(t)

	rule := model.EdgeRule{
		ID: "evt-rule", Name: "Event Rule", Type: "threshold", Enable: true,
		Sources:   []model.RuleSource{{Alias: "t1", ChannelID: "ch1", DeviceID: "dev1", PointID: "p1"}},
		Condition: "t1 > 0",
		Actions:   []model.RuleAction{{Type: "log"}},
		State:     &model.StateConfig{Duration: "0s", Count: 1},
	}
	em.LoadRules([]model.EdgeRule{rule})

	em.handleValue(model.Value{
		ChannelID: "ch1", DeviceID: "dev1", PointID: "p1", Value: 1.0, TS: time.Now(),
	})

	deadline := time.Now().Add(2 * time.Second)
	for time.Now().Before(deadline) {
		events := em.GetEvents("", 10)
		if len(events) > 0 && events[0].Status == "completed" {
			evt := events[0]
			if len(evt.Phases) == 0 {
				t.Fatal("expected trigger phase in event")
			}
			if evt.Phases[0].Phase != "trigger" {
				t.Fatalf("expected trigger phase, got %q", evt.Phases[0].Phase)
			}
			if !evt.Triggered {
				t.Fatal("expected triggered event")
			}
			states := em.GetRuleStates()
			state := states["evt-rule"]
			if state == nil || state.SuccessCount != 1 {
				t.Fatalf("expected success_count=1, got state=%v", state)
			}
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("expected completed event record")
}

func TestEdgeEventRecorder_NoEventOnIdleEvaluate(t *testing.T) {
	em := newTestEdgeComputeManager(t)

	rule := model.EdgeRule{
		ID: "evt-idle", Name: "Idle Rule", Type: "threshold", Enable: true,
		Sources:   []model.RuleSource{{Alias: "t1", ChannelID: "ch1", DeviceID: "dev1", PointID: "p1"}},
		Condition: "t1 > 100",
	}
	em.LoadRules([]model.EdgeRule{rule})

	em.handleValue(model.Value{
		ChannelID: "ch1", DeviceID: "dev1", PointID: "p1", Value: 1.0, TS: time.Now(),
	})

	time.Sleep(100 * time.Millisecond)
	if events := em.GetEvents("", 10); len(events) > 0 {
		t.Fatalf("expected no events for non-triggered evaluate, got %d", len(events))
	}
}

func TestEdgeEventRecorder_FailureOnEvalError(t *testing.T) {
	em := newTestEdgeComputeManager(t)

	rule := model.EdgeRule{
		ID: "evt-bad", Name: "Bad Rule", Type: "threshold", Enable: true,
		Sources:   []model.RuleSource{{Alias: "t1", ChannelID: "ch1", DeviceID: "dev1", PointID: "p1"}},
		Condition: "t1 >>> 0",
	}
	em.LoadRules([]model.EdgeRule{rule})

	em.handleValue(model.Value{
		ChannelID: "ch1", DeviceID: "dev1", PointID: "p1", Value: 1.0, TS: time.Now(),
	})

	time.Sleep(100 * time.Millisecond)
	failures := em.GetFailures("", 10)
	if len(failures) == 0 {
		t.Fatal("expected evaluation failure record")
	}
	if failures[0].Phase != "evaluate" {
		t.Fatalf("expected evaluate phase failure, got %q", failures[0].Phase)
	}
}
