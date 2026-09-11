package ethernetip

import (
	"fmt"
	"sync/atomic"
	"testing"
	"time"

	driver "github.com/anviod/edgeCore/internal/driver"
	go_ethernet_ip "github.com/anviod/ethernet-ip"
)

// TestENIPTransport_ScheduleReconnectDoesNotHoldLockWhileDialing guards
// the deterministic self-deadlock fixed in scheduleReconnect.
//
// Before the fix the reconnect closure did:
//
//	t.mu.Lock(); defer t.mu.Unlock()
//	...
//	return t.connectOnce(ctx)   // connectOnce takes t.mu at its install step
//
// sync.Mutex is not reentrant: as soon as the dial succeeded and
// connectOnce reached its `t.mu.Lock()` install step, the goroutine
// deadlocked holding t.mu forever — freezing Read/Write/Disconnect and
// only recoverable by restarting the process.
//
// Invariant under test: the reconnect dial path must run with t.mu FREE.
// We observe it from inside the (injected) dial factory: if TryLock fails
// there, the lock was held across the dial — the bug.
func TestENIPTransport_ScheduleReconnectDoesNotHoldLockWhileDialing(t *testing.T) {
	tr := &ENIPTransport{
		ip:           "127.0.0.1",
		port:         44818,
		timeout:      100 * time.Millisecond,
		maxRetries:   2,
		maxFailCount: 5,
		collectCycle: time.Second,
	}

	var lockHeldDuringDial atomic.Bool
	var dialCalls atomic.Int32

	tr.tcpFactory = func(string, *go_ethernet_ip.Config) (*go_ethernet_ip.EIPTCP, error) {
		dialCalls.Add(1)
		if !tr.mu.TryLock() {
			lockHeldDuringDial.Store(true)
		} else {
			tr.mu.Unlock()
		}
		return nil, fmt.Errorf("dial refused (test)")
	}

	tr.connMgr = driver.NewConnectionManager("ethernetip")
	tr.connMgr.SetMaxRetries(tr.maxRetries)
	tr.lastActivityTime.Store(time.Time{})

	tr.scheduleReconnect()

	// Wait until the reconnect goroutine has performed at least one dial.
	deadline := time.Now().Add(5 * time.Second)
	for dialCalls.Load() == 0 {
		if time.Now().After(deadline) {
			t.Fatalf("reconnect never reached the dial stage")
		}
		time.Sleep(10 * time.Millisecond)
	}

	// Give the scheduler a moment to run any further attempts.
	time.Sleep(100 * time.Millisecond)

	if lockHeldDuringDial.Load() {
		t.Fatalf("transport mutex was held across the reconnect dial — scheduleReconnect would self-deadlock on a successful dial (regression of the ENIP fix)")
	}

	// Must still be lockable (no goroutine stuck holding it).
	if !tr.mu.TryLock() {
		t.Fatalf("transport mutex stuck locked after reconnect attempts")
	}
	tr.mu.Unlock()
}

// TestENIPTransport_ResetConnectionIsIdempotent verifies resetConnection
// can run repeatedly without panicking and always leaves the transport
// in a disconnected, lockable state.
func TestENIPTransport_ResetConnectionIsIdempotent(t *testing.T) {
	tr := &ENIPTransport{
		ip:      "127.0.0.1",
		port:    44818,
		timeout: time.Second,
	}
	tr.tcpFactory = func(string, *go_ethernet_ip.Config) (*go_ethernet_ip.EIPTCP, error) {
		return nil, fmt.Errorf("no device")
	}
	tr.connMgr = driver.NewConnectionManager("ethernetip")
	tr.lastActivityTime.Store(time.Time{})

	for i := 0; i < 3; i++ {
		tr.resetConnection()
	}

	if tr.connected.Load() {
		t.Fatalf("connected must be false after resetConnection")
	}
	if tr.tcp != nil {
		t.Fatalf("tcp must be nil after resetConnection")
	}
	if !tr.mu.TryLock() {
		t.Fatalf("t.mu must be free after resetConnection returned")
	}
	tr.mu.Unlock()
}
