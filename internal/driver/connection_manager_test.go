package driver

import (
	"context"
	"errors"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func TestConnState_String(t *testing.T) {
	tests := []struct {
		state ConnState
		want  string
	}{
		{StateDisconnected, "Disconnected"},
		{StateConnecting, "Connecting"},
		{StateConnected, "Connected"},
		{StateRetrying, "Retrying"},
		{StateDead, "Dead"},
		{ConnState(99), "Unknown"},
	}
	for _, tt := range tests {
		if got := tt.state.String(); got != tt.want {
			t.Errorf("ConnState(%d).String() = %q, want %q", tt.state, got, tt.want)
		}
	}
}

func TestConnectionManager_LifecycleAndStatus(t *testing.T) {
	cm := NewConnectionManager("test-lifecycle")
	defer cm.Close()

	cm.SetBackoffParams(50*time.Millisecond, 5*time.Second, 2.0)
	cm.SetMaxRetries(5)
	cm.SetMaxFailCount(3)

	if state := cm.GetState(); state != StateDisconnected {
		t.Fatalf("initial state = %v, want Disconnected", state)
	}

	cm.SetState(StateConnecting)
	cm.RecordSuccess()

	state, retry, maxRetries, coolDown, lastSuccess := cm.GetStatus()
	if state != StateConnected {
		t.Fatalf("state = %v, want Connected", state)
	}
	if retry != 0 {
		t.Fatalf("retry = %d, want 0", retry)
	}
	if maxRetries != 5 {
		t.Fatalf("maxRetries = %d, want 5", maxRetries)
	}
	if coolDown != 0 {
		t.Fatalf("coolDown = %v, want 0", coolDown)
	}
	if lastSuccess.IsZero() {
		t.Fatal("lastSuccess should be set after RecordSuccess")
	}
}

func TestConnectionManager_RecordFailureBackoffAndDead(t *testing.T) {
	cm := NewConnectionManager("test-backoff")
	defer cm.Close()

	cm.SetBackoffParams(100*time.Millisecond, time.Second, 2.0)
	cm.SetMaxRetries(3)
	cm.RecordSuccess()

	var backoffs []time.Duration
	for i := 0; i < 2; i++ {
		shouldRetry, backoff := cm.RecordFailure()
		if !shouldRetry {
			t.Fatalf("attempt %d: expected shouldRetry=true", i+1)
		}
		if backoff <= 0 {
			t.Fatalf("attempt %d: expected positive backoff, got %v", i+1, backoff)
		}
		backoffs = append(backoffs, backoff)
		if cm.GetState() != StateRetrying {
			t.Fatalf("attempt %d: state = %v, want Retrying", i+1, cm.GetState())
		}
	}
	// Exponential base (200ms, 400ms) plus 1–50ms jitter; compare ranges, not raw values (see s7/connection_manager_test.go).
	wantMin := []time.Duration{200 * time.Millisecond, 400 * time.Millisecond}
	wantMax := []time.Duration{250 * time.Millisecond, 450 * time.Millisecond}
	for i, b := range backoffs {
		if b < wantMin[i] || b > wantMax[i] {
			t.Fatalf("attempt %d: backoff %v outside [%v, %v]", i+1, b, wantMin[i], wantMax[i])
		}
	}

	shouldRetry, backoff := cm.RecordFailure()
	if shouldRetry {
		t.Fatal("expected shouldRetry=false at max retries")
	}
	if backoff != 0 {
		t.Fatalf("expected zero backoff on dead, got %v", backoff)
	}
	if cm.GetState() != StateDead {
		t.Fatalf("state = %v, want Dead", cm.GetState())
	}

	_, _, _, coolDown, _ := cm.GetStatus()
	if coolDown <= 0 {
		t.Fatalf("expected positive coolDown remaining, got %v", coolDown)
	}
}

func TestConnectionManager_CanRetryAllStates(t *testing.T) {
	t.Run("Disconnected", func(t *testing.T) {
		cm := NewConnectionManager("disconnected")
		defer cm.Close()
		can, wait := cm.CanRetry()
		if !can || wait != 0 {
			t.Fatalf("CanRetry() = (%v, %v), want (true, 0)", can, wait)
		}
	})

	t.Run("Connected", func(t *testing.T) {
		cm := NewConnectionManager("connected")
		defer cm.Close()
		cm.RecordSuccess()
		can, wait := cm.CanRetry()
		if can || wait != 0 {
			t.Fatalf("CanRetry() = (%v, %v), want (false, 0)", can, wait)
		}
	})

	t.Run("ConnectingAfterFailure", func(t *testing.T) {
		cm := NewConnectionManager("connecting")
		defer cm.Close()
		cm.SetState(StateConnecting)
		cm.RecordFailure()
		can, wait := cm.CanRetry()
		if !can || wait <= 0 {
			t.Fatalf("CanRetry() = (%v, %v), want retry with backoff", can, wait)
		}
	})

	t.Run("Retrying", func(t *testing.T) {
		cm := NewConnectionManager("retrying")
		defer cm.Close()
		cm.SetBackoffParams(5*time.Millisecond, time.Second, 2.0)
		cm.SetMaxRetries(10)
		cm.RecordSuccess()
		cm.RecordFailure()
		can, wait := cm.CanRetry()
		if !can || wait <= 0 {
			t.Fatalf("CanRetry() = (%v, %v), want retry with backoff", can, wait)
		}
	})

	t.Run("DeadDuringCoolDown", func(t *testing.T) {
		cm := NewConnectionManager("dead-cooldown")
		defer cm.Close()
		cm.SetMaxRetries(1)
		cm.RecordSuccess()
		cm.RecordFailure()
		if cm.GetState() != StateDead {
			t.Fatalf("state = %v, want Dead", cm.GetState())
		}
		can, wait := cm.CanRetry()
		if !can || wait <= 0 {
			t.Fatalf("CanRetry() during coolDown = (%v, %v)", can, wait)
		}
	})

	t.Run("DeadAfterCoolDownExpires", func(t *testing.T) {
		cm := NewConnectionManager("dead-expired")
		defer cm.Close()
		cm.mu.Lock()
		cm.state = StateDead
		cm.retryCount = 1
		cm.maxRetries = 5
		cm.coolDownUntil = time.Now().Add(-time.Second)
		cm.mu.Unlock()

		can, wait := cm.CanRetry()
		if !can {
			t.Fatal("expected canRetry=true after coolDown expires")
		}
		if wait <= 0 {
			t.Fatalf("expected positive backoff after coolDown, got %v", wait)
		}
		if cm.GetState() != StateRetrying {
			t.Fatalf("state = %v, want Retrying after coolDown", cm.GetState())
		}
	})
}

func TestConnectionManager_AttemptHalfOpen(t *testing.T) {
	cm := NewConnectionManager("half-open")
	defer cm.Close()
	cm.SetMaxRetries(1)
	cm.RecordSuccess()
	cm.RecordFailure()
	if cm.GetState() != StateDead {
		t.Fatalf("state = %v, want Dead", cm.GetState())
	}

	cm.AttemptHalfOpen(false)
	if cm.GetState() != StateDead {
		t.Fatalf("failed probe: state = %v, want Dead", cm.GetState())
	}
	_, _, _, coolDown1, _ := cm.GetStatus()
	if coolDown1 <= 0 {
		t.Fatal("expected coolDown after failed half-open probe")
	}

	cm.AttemptHalfOpen(true)
	if cm.GetState() != StateConnected {
		t.Fatalf("successful probe: state = %v, want Connected", cm.GetState())
	}
	_, retry, _, _, _ := cm.GetStatus()
	if retry != 0 {
		t.Fatalf("retry = %d, want 0 after successful probe", retry)
	}
}

func TestConnectionManager_ResetDaily(t *testing.T) {
	cm := NewConnectionManager("daily-reset")
	defer cm.Close()

	cm.SetMaxRetries(10)
	cm.RecordSuccess()
	for i := 0; i < 5; i++ {
		cm.RecordFailure()
	}
	_, retryBefore, _, _, _ := cm.GetStatus()
	if retryBefore != 5 {
		t.Fatalf("retry before reset = %d, want 5", retryBefore)
	}

	cm.ResetDaily()

	_, retryAfter, _, coolDown, _ := cm.GetStatus()
	if retryAfter != 0 {
		t.Fatalf("retry after reset = %d, want 0", retryAfter)
	}
	if coolDown != 0 {
		t.Fatalf("coolDown after reset = %v, want 0", coolDown)
	}
}

func TestConnectionManager_CoolDownProgression(t *testing.T) {
	cm := NewConnectionManager("cooldown-progression")
	defer cm.Close()
	cm.SetMaxRetries(1)

	cm.RecordSuccess()
	cm.RecordFailure()
	if cm.GetState() != StateDead {
		t.Fatal("expected Dead after max retries")
	}

	for i := 0; i < 5; i++ {
		cm.AttemptHalfOpen(false)
	}
	if cm.GetState() != StateDead {
		t.Fatalf("state = %v, want Dead after repeated failed probes", cm.GetState())
	}
}

func TestConnectionManager_GlobalReconnectRateLimit(t *testing.T) {
	savedMax := MaxGlobalReconnectRate
	MaxGlobalReconnectRate = 2
	defer func() { MaxGlobalReconnectRate = savedMax }()

	globalReconnectMu.Lock()
	globalReconnectCount = 0
	globalReconnectLastTime = time.Now()
	globalReconnectMu.Unlock()

	cm := NewConnectionManager("rate-limit")
	defer cm.Close()

	for i := 0; i < 2; i++ {
		can, wait := cm.CanRetry()
		if !can {
			t.Fatalf("attempt %d: expected canRetry=true", i+1)
		}
		if wait != 0 {
			t.Fatalf("attempt %d: expected wait=0, got %v", i+1, wait)
		}
	}

	can, wait := cm.CanRetry()
	if !can || wait != time.Second {
		t.Fatalf("rate limited CanRetry() = (%v, %v), want (true, 1s)", can, wait)
	}
}

func TestEnsureConnected_FailureAndContextCancel(t *testing.T) {
	t.Run("MaxRetriesEntersCoolDown", func(t *testing.T) {
		cm := NewConnectionManager("ensure-fail")
		defer cm.Close()
		cm.SetMaxRetries(2)
		cm.SetBackoffParams(time.Millisecond, time.Millisecond, 1.0)

		connectErr := errors.New("dial failed")
		err := cm.EnsureConnected(context.Background(), func(ctx context.Context) error {
			return connectErr
		})
		if err == nil {
			t.Fatal("expected error after exhausting retries")
		}
		if cm.GetState() != StateDead {
			t.Fatalf("state = %v, want Dead", cm.GetState())
		}
	})

	t.Run("ContextCanceledDuringWait", func(t *testing.T) {
		cm := NewConnectionManager("ensure-cancel")
		defer cm.Close()
		cm.SetMaxRetries(10)
		cm.SetBackoffParams(500*time.Millisecond, time.Second, 2.0)
		cm.SetState(StateDead)
		cm.mu.Lock()
		cm.coolDownUntil = time.Now().Add(time.Minute)
		cm.mu.Unlock()

		ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)
		defer cancel()

		err := cm.EnsureConnected(ctx, func(ctx context.Context) error {
			return nil
		})
		if !errors.Is(err, context.DeadlineExceeded) {
			t.Fatalf("expected context.DeadlineExceeded, got %v", err)
		}
	})
}

func TestConnectionManager_ConcurrentAccess(t *testing.T) {
	cm := NewConnectionManager("concurrent")
	defer cm.Close()

	var wg sync.WaitGroup
	var ops atomic.Int32

	for i := 0; i < 30; i++ {
		wg.Add(3)
		go func() {
			defer wg.Done()
			cm.RecordSuccess()
			ops.Add(1)
		}()
		go func() {
			defer wg.Done()
			cm.RecordFailure()
			ops.Add(1)
		}()
		go func() {
			defer wg.Done()
			cm.CanRetry()
			cm.GetStatus()
			ops.Add(1)
		}()
	}
	wg.Wait()

	if ops.Load() != 90 {
		t.Fatalf("expected 90 ops, got %d", ops.Load())
	}
}

func TestRegisterDriver_GetDriver(t *testing.T) {
	const name = "test-driver-coverage-only"
	RegisterDriver(name, func() Driver { return nil })

	d, ok := GetDriver(name)
	if !ok || d != nil {
		t.Fatalf("GetDriver(%q) = (%v, %v), want (nil, true)", name, d, ok)
	}

	_, ok = GetDriver("nonexistent-driver-name-xyz")
	if ok {
		t.Fatal("GetDriver for unknown name should return ok=false")
	}
}

func TestConnectionManager_BackgroundLoop(t *testing.T) {
	cm := NewConnectionManager("bg-test")
	ran := make(chan struct{}, 1)

	cm.StartBackgroundLoop(func(ctx context.Context) {
		select {
		case ran <- struct{}{}:
		default:
		}
		<-ctx.Done()
	})

	select {
	case <-ran:
	case <-time.After(time.Second):
		t.Fatal("background loop did not start")
	}

	cm.StopBackgroundLoop()

	cm.StartBackgroundLoop(func(ctx context.Context) {
		<-ctx.Done()
	})
	cm.StopBackgroundLoop()
}
