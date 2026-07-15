package reconnect

import (
	"sync/atomic"
	"testing"
	"time"
)

func TestSchedulerSingleFlight(t *testing.T) {
	var sched Scheduler

	if !sched.TryStart() {
		t.Fatal("expected first TryStart to succeed")
	}
	if sched.TryStart() {
		t.Fatal("expected concurrent TryStart to be rejected")
	}

	sched.Done()

	if !sched.TryStart() {
		t.Fatal("expected TryStart to succeed after Done")
	}
	sched.Done()
}

func TestSchedulerConcurrentStarts(t *testing.T) {
	var sched Scheduler
	var started atomic.Int32

	start := func() {
		if sched.TryStart() {
			started.Add(1)
			time.Sleep(50 * time.Millisecond)
			sched.Done()
		}
	}

	for i := 0; i < 20; i++ {
		go start()
	}
	time.Sleep(100 * time.Millisecond)

	if started.Load() != 1 {
		t.Fatalf("expected exactly one reconnect loop to start, got %d", started.Load())
	}
}

func TestBackoffPreservesPolicy(t *testing.T) {
	for attempt := 1; attempt <= 10; attempt++ {
		delay := Backoff(attempt)
		if delay < 3*time.Second || delay > 3600*time.Millisecond {
			t.Fatalf("attempt %d: expected ~3s backoff with jitter, got %v", attempt, delay)
		}
	}

	delay := Backoff(11)
	if delay < 60*time.Second || delay > 72*time.Second {
		t.Fatalf("expected ~60s backoff with jitter, got %v", delay)
	}
}

func TestLogThrottle(t *testing.T) {
	var throttle LogThrottle

	if !throttle.ShouldLog(1, time.Second, 10) {
		t.Fatal("expected first attempt to log")
	}
	if throttle.ShouldLog(2, time.Second, 10) {
		t.Fatal("expected second attempt to be throttled")
	}
	if !throttle.ShouldLog(10, time.Second, 10) {
		t.Fatal("expected periodic attempt to log")
	}
}
