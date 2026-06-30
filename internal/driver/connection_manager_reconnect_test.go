package driver

import (
	"context"
	"sync/atomic"
	"testing"
	"time"
)

func TestEnsureConnected_Success(t *testing.T) {
	cm := NewConnectionManager("test")
	defer cm.Close()

	called := false
	err := cm.EnsureConnected(context.Background(), func(ctx context.Context) error {
		called = true
		return nil
	})
	if err != nil {
		t.Fatalf("EnsureConnected returned error: %v", err)
	}
	if !called {
		t.Fatal("connect func was not called")
	}
	if cm.GetState() != StateConnected {
		t.Fatalf("expected connected state, got %v", cm.GetState())
	}
}

func TestCanRetry_ConnectingAfterFailureWaits(t *testing.T) {
	cm := NewConnectionManager("test")
	defer cm.Close()

	cm.SetState(StateConnecting)
	cm.RecordFailure()

	_, wait := cm.CanRetry()
	if wait <= 0 {
		t.Fatalf("expected backoff after failure in connecting state, got %v", wait)
	}
}

func TestScheduleReconnect_SingleFlight(t *testing.T) {
	cm := NewConnectionManager("test")
	defer cm.Close()

	var running atomic.Int32
	block := make(chan struct{})

	connect := func(ctx context.Context) error {
		running.Add(1)
		<-block
		return ctx.Err()
	}

	cm.ScheduleReconnect(context.Background(), time.Second, connect)
	cm.ScheduleReconnect(context.Background(), time.Second, connect)

	deadline := time.After(200 * time.Millisecond)
	for running.Load() == 0 {
		select {
		case <-deadline:
			t.Fatal("reconnect did not start")
		default:
			time.Sleep(5 * time.Millisecond)
		}
	}

	if running.Load() != 1 {
		t.Fatalf("expected one reconnect goroutine, got %d", running.Load())
	}

	close(block)
	time.Sleep(20 * time.Millisecond)
}
