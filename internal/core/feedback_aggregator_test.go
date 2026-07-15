package core

import (
	"testing"
	"time"
)

func TestFeedbackAggregator_FlushWindow(t *testing.T) {
	flushed := make(chan AggregatedStats, 1)
	fa := NewFeedbackAggregator(50*time.Millisecond, func(_ string, stats AggregatedStats) {
		select {
		case flushed <- stats:
		default:
		}
	})
	fa.Start()
	defer fa.Stop()

	fa.Submit(FeedbackEvent{DeviceKey: "dev-1", Success: false, Err: ErrTimeout})
	fa.Submit(FeedbackEvent{DeviceKey: "dev-1", Success: true})

	select {
	case stats := <-flushed:
		if stats.FailCount != 1 || stats.SuccessCount != 1 {
			t.Fatalf("stats = %+v, want 1 fail 1 success", stats)
		}
	case <-time.After(500 * time.Millisecond):
		t.Fatal("aggregator did not flush within window")
	}
}

func TestFeedbackAggregator_NilSafe(t *testing.T) {
	var fa *FeedbackAggregator
	fa.Submit(FeedbackEvent{DeviceKey: "x"})
	if fa.Window() != 0 {
		t.Fatal("nil aggregator window should be 0")
	}
}
