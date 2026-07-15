package reconnect

import (
	"math/rand/v2"
	"sync"
	"sync/atomic"
	"time"
)

// Scheduler ensures at most one reconnect loop runs per client.
type Scheduler struct {
	running atomic.Bool
}

// TryStart returns true when the caller should start a reconnect loop.
func (s *Scheduler) TryStart() bool {
	return s.running.CompareAndSwap(false, true)
}

// Done marks the reconnect loop as finished.
func (s *Scheduler) Done() {
	s.running.Store(false)
}

// Backoff returns delay after failure attempt n (1-based).
// Keeps the existing northbound policy: 3s for the first 10 failures, then 60s.
func Backoff(attempt int) time.Duration {
	var base time.Duration
	if attempt <= 10 {
		base = 3 * time.Second
	} else {
		base = 60 * time.Second
	}
	// Up to 20% jitter to avoid synchronized retries across clients.
	jitter := time.Duration(rand.Int64N(int64(base / 5)))
	return base + jitter
}

// LogThrottle suppresses repetitive reconnect log lines.
type LogThrottle struct {
	mu       sync.Mutex
	lastWarn time.Time
}

// ShouldLog reports whether a reconnect log line should emit at WARN/INFO level.
// Logs the first attempt, every logEvery attempts, or when minInterval has elapsed.
func (t *LogThrottle) ShouldLog(attempt int, minInterval time.Duration, logEvery int) bool {
	t.mu.Lock()
	defer t.mu.Unlock()

	now := time.Now()
	if attempt == 1 {
		t.lastWarn = now
		return true
	}
	if logEvery > 0 && attempt%logEvery == 0 {
		t.lastWarn = now
		return true
	}

	if t.lastWarn.IsZero() || now.Sub(t.lastWarn) >= minInterval {
		t.lastWarn = now
		return true
	}
	return false
}
