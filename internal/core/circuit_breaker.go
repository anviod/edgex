package core

import (
	"sync"
	"sync/atomic"
	"time"
)

const (
	circuitBreakerConsecutiveTimeoutThreshold = 5
	circuitBreakerOpenDuration                = 30 * time.Second
	circuitBreakerFailureRateWindow           = 60 * time.Second
	circuitBreakerFailureRateThreshold        = 0.40
	circuitBreakerMinFailureRateSamples       = 10
)

type CircuitState int

const (
	CircuitClosed CircuitState = iota
	CircuitOpen
	CircuitHalfOpen
)

func (s CircuitState) String() string {
	switch s {
	case CircuitClosed:
		return "Closed"
	case CircuitOpen:
		return "Open"
	case CircuitHalfOpen:
		return "HalfOpen"
	default:
		return "Unknown"
	}
}

type circuitOutcome struct {
	at      time.Time
	success bool
	timeout bool
}

type circuitEntry struct {
	state               CircuitState
	consecutiveTimeouts int
	openedAt            time.Time
	halfOpenProbe       bool
	outcomes            []circuitOutcome
}

type DriverCircuitBreaker struct {
	mu          sync.Mutex
	entries     map[string]*circuitEntry
	rejectTotal atomic.Uint64
	openTotal   atomic.Uint64

	onEvent CircuitBreakerEventHandler
}

// CircuitBreakerEventHandler receives Open/Reject events for channel Event Log wiring.
type CircuitBreakerEventHandler func(deviceKey, eventType, message string)

type circuitBreakerEvent struct {
	fn              CircuitBreakerEventHandler
	deviceKey       string
	eventType       string
	message         string
}

func (e circuitBreakerEvent) emit() {
	if e.fn != nil {
		e.fn(e.deviceKey, e.eventType, e.message)
	}
}

func NewDriverCircuitBreaker() *DriverCircuitBreaker {
	return &DriverCircuitBreaker{
		entries: make(map[string]*circuitEntry),
	}
}

func (cb *DriverCircuitBreaker) SetEventHandler(fn CircuitBreakerEventHandler) {
	if cb == nil {
		return
	}
	cb.mu.Lock()
	cb.onEvent = fn
	cb.mu.Unlock()
}

func (cb *DriverCircuitBreaker) entry(key string) *circuitEntry {
	e, ok := cb.entries[key]
	if !ok {
		e = &circuitEntry{state: CircuitClosed}
		cb.entries[key] = e
	}
	return e
}

func (cb *DriverCircuitBreaker) Allow(key string) bool {
	if cb == nil || key == "" {
		return true
	}

	cb.mu.Lock()
	allowed, event := cb.allowLocked(key)
	cb.mu.Unlock()
	event.emit()
	return allowed
}

func (cb *DriverCircuitBreaker) allowLocked(key string) (bool, circuitBreakerEvent) {
	e := cb.entry(key)
	now := time.Now()

	switch e.state {
	case CircuitClosed:
		return true, circuitBreakerEvent{}
	case CircuitOpen:
		if now.Sub(e.openedAt) >= circuitBreakerOpenDuration {
			e.state = CircuitHalfOpen
			e.halfOpenProbe = false
			return true, circuitBreakerEvent{}
		}
		cb.rejectTotal.Add(1)
		return false, circuitBreakerEvent{
			fn:        cb.onEvent,
			deviceKey: key,
			eventType: "circuit_breaker_reject",
			message:   "circuit breaker open, request rejected",
		}
	case CircuitHalfOpen:
		if e.halfOpenProbe {
			cb.rejectTotal.Add(1)
			return false, circuitBreakerEvent{
				fn:        cb.onEvent,
				deviceKey: key,
				eventType: "circuit_breaker_reject",
				message:   "circuit breaker half-open probe in progress",
			}
		}
		e.halfOpenProbe = true
		return true, circuitBreakerEvent{}
	default:
		return true, circuitBreakerEvent{}
	}
}

func (cb *DriverCircuitBreaker) Record(key string, success bool, timeout bool) {
	if cb == nil || key == "" {
		return
	}

	cb.mu.Lock()
	event := cb.recordLocked(key, success, timeout)
	cb.mu.Unlock()
	event.emit()
}

func (cb *DriverCircuitBreaker) recordLocked(key string, success bool, timeout bool) circuitBreakerEvent {
	e := cb.entry(key)
	now := time.Now()

	e.outcomes = append(e.outcomes, circuitOutcome{
		at:      now,
		success: success,
		timeout: timeout,
	})
	e.trimOutcomes(now)

	if success {
		e.consecutiveTimeouts = 0
		if e.state == CircuitHalfOpen {
			e.state = CircuitClosed
			e.halfOpenProbe = false
		}
		return circuitBreakerEvent{}
	}

	if timeout {
		e.consecutiveTimeouts++
		if e.consecutiveTimeouts >= circuitBreakerConsecutiveTimeoutThreshold {
			return cb.openEntryLocked(key, e, now)
		}
	}

	if e.failureRate(now) > circuitBreakerFailureRateThreshold {
		return cb.openEntryLocked(key, e, now)
	}

	if e.state == CircuitHalfOpen {
		return cb.openEntryLocked(key, e, now)
	}
	return circuitBreakerEvent{}
}

func (cb *DriverCircuitBreaker) openEntryLocked(key string, e *circuitEntry, now time.Time) circuitBreakerEvent {
	newlyOpen := e.state != CircuitOpen
	if newlyOpen {
		cb.openTotal.Add(1)
	}
	e.state = CircuitOpen
	e.openedAt = now
	e.halfOpenProbe = false
	e.consecutiveTimeouts = 0
	if !newlyOpen {
		return circuitBreakerEvent{}
	}
	return circuitBreakerEvent{
		fn:        cb.onEvent,
		deviceKey: key,
		eventType: "circuit_breaker_open",
		message:   "circuit breaker opened due to consecutive failures",
	}
}

func (e *circuitEntry) trimOutcomes(now time.Time) {
	cutoff := now.Add(-circuitBreakerFailureRateWindow)
	idx := 0
	for _, o := range e.outcomes {
		if o.at.After(cutoff) {
			e.outcomes[idx] = o
			idx++
		}
	}
	e.outcomes = e.outcomes[:idx]
}

func (e *circuitEntry) failureRate(now time.Time) float64 {
	e.trimOutcomes(now)
	if len(e.outcomes) < circuitBreakerMinFailureRateSamples {
		return 0
	}
	failures := 0
	for _, o := range e.outcomes {
		if !o.success {
			failures++
		}
	}
	return float64(failures) / float64(len(e.outcomes))
}

func (cb *DriverCircuitBreaker) State(key string) CircuitState {
	if cb == nil || key == "" {
		return CircuitClosed
	}
	cb.mu.Lock()
	defer cb.mu.Unlock()
	return cb.entry(key).state
}

func (cb *DriverCircuitBreaker) Reset(key string) {
	if cb == nil || key == "" {
		return
	}
	cb.mu.Lock()
	defer cb.mu.Unlock()
	delete(cb.entries, key)
}

// SetOpenedAtForTest adjusts the open timestamp (integration tests only).
func (cb *DriverCircuitBreaker) SetOpenedAtForTest(key string, openedAt time.Time) {
	if cb == nil || key == "" {
		return
	}
	cb.mu.Lock()
	defer cb.mu.Unlock()
	e := cb.entry(key)
	e.openedAt = openedAt
}

func (cb *DriverCircuitBreaker) RejectTotal() uint64 {
	if cb == nil {
		return 0
	}
	return cb.rejectTotal.Load()
}

func (cb *DriverCircuitBreaker) OpenTotal() uint64 {
	if cb == nil {
		return 0
	}
	return cb.openTotal.Load()
}

func (cb *DriverCircuitBreaker) DeviceSnapshot(key string) map[string]any {
	if cb == nil || key == "" {
		return map[string]any{}
	}
	cb.mu.Lock()
	defer cb.mu.Unlock()
	e := cb.entry(key)
	return map[string]any{
		"state":                e.state.String(),
		"consecutive_timeouts": e.consecutiveTimeouts,
		"recent_outcomes":      len(e.outcomes),
		"recent_failure_rate":  e.failureRate(time.Now()),
	}
}

func (cb *DriverCircuitBreaker) Snapshot() map[string]any {
	if cb == nil {
		return map[string]any{}
	}
	cb.mu.Lock()
	defer cb.mu.Unlock()
	devices := make(map[string]any, len(cb.entries))
	for key, e := range cb.entries {
		devices[key] = map[string]any{
			"state":                e.state.String(),
			"consecutive_timeouts": e.consecutiveTimeouts,
			"recent_outcomes":      len(e.outcomes),
		}
	}
	return map[string]any{
		"reject_total": cb.rejectTotal.Load(),
		"open_total":   cb.openTotal.Load(),
		"devices":      devices,
	}
}
