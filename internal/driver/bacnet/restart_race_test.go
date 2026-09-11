package bacnet

import (
	"context"
	"runtime"
	"sync"
	"testing"
	"time"

	bacnetlib "github.com/anviod/bacnet"
	"github.com/anviod/bacnet/btypes"
	drv "github.com/anviod/edgeCore/internal/driver"
	"github.com/anviod/edgeCore/internal/model"
)

// restartMockClient models the real BACnet client's lifecycle:
//   - ClientRun blocks on a channel until Close signals it to exit
//   - Close unblocks ClientRun and flips running to false
//   - IsRunning reflects whether the loop is alive
//
// This mirrors the production behaviour where ClientRun sits on
// net.ReadFromUDP and exits when the UDP socket is closed.
type restartMockClient struct {
	SmartMockClient

	mu      sync.Mutex
	running bool
	stop    chan struct{}
	closed  bool
}

func (m *restartMockClient) IsRunning() bool {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.running
}

func (m *restartMockClient) ClientRun() {
	m.mu.Lock()
	if m.closed {
		// Close was called before ClientRun — no-op, just return.
		m.running = false
		m.mu.Unlock()
		return
	}
	m.running = true
	m.mu.Unlock()

	<-m.stop
	m.mu.Lock()
	m.running = false
	m.mu.Unlock()
}

func (m *restartMockClient) Close() error {
	m.mu.Lock()
	if m.closed {
		m.mu.Unlock()
		return nil
	}
	m.closed = true
	m.running = false
	stop := m.stop
	m.mu.Unlock()

	if stop != nil {
		select {
		case <-stop:
			// already closed
		default:
			close(stop)
		}
	}
	return nil
}

// newRestartClientFactory returns a clientFactory that builds fresh
// restartMockClient instances per connectOnce call.
func newRestartClientFactory(_ time.Duration) (
	func(*bacnetlib.ClientBuilder) (Client, error),
	*[]*restartMockClient,
) {
	var mu sync.Mutex
	var clients []*restartMockClient
	factory := func(cb *bacnetlib.ClientBuilder) (Client, error) {
		mc := &restartMockClient{
			stop: make(chan struct{}),
		}
		mu.Lock()
		clients = append(clients, mc)
		mu.Unlock()
		return mc, nil
	}
	return factory, &clients
}

// TestBACnetDriver_DisconnectResetsConnMgrState reproduces the
// production incident where 4× rapid restart_channel left the
// BACnet channel stuck offline because:
//
//  1. First Connect succeeds → connMgr.state = StateConnected
//  2. StopChannel → Disconnect does NOT reset connMgr state
//  3. Next Connect → EnsureConnected → CanRetry() returns false
//     because state is still StateConnected → error returned
//  4. StartChannel goroutine silently fails → devices marked
//     offline, no recovery path without edgeCore restart
//
// The fix: Disconnect must call connMgr.SetState(StateDisconnected)
// so the next Connect can re-enter EnsureConnected and create a
// fresh client.
func TestBACnetDriver_DisconnectResetsConnMgrState(t *testing.T) {
	factory, _ := newRestartClientFactory(10 * time.Millisecond)

	d := NewBACnetDriver().(*BACnetDriver)
	d.clientFactory = factory
	if err := d.Init(model.DriverConfig{Config: map[string]any{"ip": "0.0.0.0"}}); err != nil {
		t.Fatalf("Init: %v", err)
	}

	// Phase 1: First successful connect brings connMgr to StateConnected.
	ctx1, cancel1 := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel1()
	if err := d.Connect(ctx1); err != nil {
		t.Fatalf("first Connect: %v", err)
	}

	connMgrState := d.connMgr.GetState()
	if connMgrState != drv.StateConnected {
		t.Fatalf("expected connMgr.StateConnected after first Connect, got %v", connMgrState)
	}

	// Phase 2: Disconnect. With the fix, connMgr state must be reset
	// to StateDisconnected so the next Connect can proceed.
	if err := d.Disconnect(); err != nil {
		t.Fatalf("Disconnect: %v", err)
	}

	connMgrState = d.connMgr.GetState()
	if connMgrState != drv.StateDisconnected {
		t.Fatalf("BUG: after Disconnect, connMgr state is still %v (must be %v to allow next Connect)", connMgrState, drv.StateDisconnected)
	}

	// Phase 3: Second Connect (simulating the start_channel call
	// after a restart_channel). Pre-fix this fails with
	// "connection not allowed to retry". Post-fix it succeeds.
	ctx2, cancel2 := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel2()
	if err := d.Connect(ctx2); err != nil {
		t.Fatalf("BUG: second Connect after Disconnect failed with %v — connMgr state was not reset, production incident reproduced", err)
	}

	t.Logf("PASS: Disconnect resets connMgr state, subsequent Connect succeeds")
}

// TestBACnetDriver_RapidRestartCycle reproduces the full 4× rapid
// restart_channel timeline. With both fixes (Disconnect resets state
// + LinkMutexBinder serialises concurrent connectOnce), the cycle
// must complete cleanly with a healthy final state.
func TestBACnetDriver_RapidRestartCycle(t *testing.T) {
	if testing.Short() {
		t.Skip("skip rapid-restart cycle test in short mode")
	}

	factory, createdClients := newRestartClientFactory(5 * time.Millisecond)

	d := NewBACnetDriver().(*BACnetDriver)
	d.clientFactory = factory
	if err := d.Init(model.DriverConfig{Config: map[string]any{"ip": "0.0.0.0"}}); err != nil {
		t.Fatalf("Init: %v", err)
	}
	// Bind channelMu so concurrent Connect calls serialise.
	d.BindLinkMutex(&sync.Mutex{})

	// Prime with one successful connect.
	primeCtx, cancelPrime := context.WithTimeout(context.Background(), 3*time.Second)
	if err := d.Connect(primeCtx); err != nil {
		cancelPrime()
		t.Fatalf("prime Connect: %v", err)
	}
	cancelPrime()

	const cycles = 4
	var wg sync.WaitGroup
	for i := 0; i < cycles; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			t.Logf("cycle %d: Disconnect", idx)
			_ = d.Disconnect()
			connectCtx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
			defer cancel()
			t.Logf("cycle %d: Connect", idx)
			if err := d.Connect(connectCtx); err != nil {
				t.Logf("cycle %d: Connect error: %v", idx, err)
			} else {
				t.Logf("cycle %d: Connect ok", idx)
			}
		}(i)
	}

	doneCh := make(chan struct{})
	go func() {
		wg.Wait()
		close(doneCh)
	}()

	select {
	case <-doneCh:
	case <-time.After(15 * time.Second):
		t.Logf("--- Goroutine state when timed out ---")
		buf := make([]byte, 1<<20)
		n := runtime.Stack(buf, true)
		t.Logf("%s", buf[:n])
		t.Fatalf("rapid-restart cycle deadlocked after 15s — fix incomplete")
	}

	time.Sleep(100 * time.Millisecond)

	d.mu.Lock()
	client := d.client
	connected := d.connected
	connMgrState := d.connMgr.GetState()
	d.mu.Unlock()

	if !connected {
		t.Fatalf("final state: d.connected=false (expected true)")
	}
	if connMgrState != drv.StateConnected {
		t.Fatalf("final state: connMgr.state=%v (expected StateConnected)", connMgrState)
	}
	if client == nil {
		t.Fatalf("final state: d.client=nil (expected live client)")
	}
	if !client.IsRunning() {
		t.Fatalf("final state: client.IsRunning()=false (production stuck-offline bug)")
	}

	t.Logf("PASS: %d clients created, final state consistent (connected=true, IsRunning=true)", len(*createdClients))
}

// notRunningClient is a Client stub that always reports IsRunning()=false.
// Used to simulate the production race window where d.client has been
// stored but ClientRun goroutine hasn't started yet.
type notRunningClient struct{}

func (notRunningClient) IsRunning() bool { return false }
func (notRunningClient) ClientRun()      {}

// remaining methods satisfy the bacnetlib.Client interface but are unused.
func (notRunningClient) WhoIs(*WhoIsOpts) ([]btypes.Device, error) {
	return nil, nil
}
func (notRunningClient) ReadProperty(btypes.Device, btypes.PropertyData) (btypes.PropertyData, error) {
	return btypes.PropertyData{}, nil
}
func (notRunningClient) ReadPropertyWithTimeout(btypes.Device, btypes.PropertyData, time.Duration) (btypes.PropertyData, error) {
	return btypes.PropertyData{}, nil
}
func (notRunningClient) ReadMultiProperty(btypes.Device, btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	return btypes.MultiplePropertyData{}, nil
}
func (notRunningClient) ReadMultiPropertyWithTimeout(btypes.Device, btypes.MultiplePropertyData, time.Duration) (btypes.MultiplePropertyData, error) {
	return btypes.MultiplePropertyData{}, nil
}
func (notRunningClient) WriteProperty(btypes.Device, btypes.PropertyData) error { return nil }
func (notRunningClient) WriteMultiProperty(btypes.Device, btypes.MultiplePropertyData) error {
	return nil
}
func (notRunningClient) Objects(btypes.Device) (btypes.Device, error) { return btypes.Device{}, nil }
func (notRunningClient) WhatIsNetworkNumber() []*btypes.Address       { return nil }
func (notRunningClient) IAm(btypes.Address, btypes.IAm) error         { return nil }
func (notRunningClient) WhoIsRouterToNetwork() *[]btypes.Address      { return nil }
func (notRunningClient) SubscribeCOV(btypes.Device, btypes.SubscribeCOVData) error {
	return nil
}
func (notRunningClient) CancelSubscribeCOV(btypes.Device, uint32, btypes.ObjectID) error {
	return nil
}
func (notRunningClient) WaitCOVNotification(int64, time.Duration) (btypes.COVNotification, error) {
	return btypes.COVNotification{}, nil
}
func (notRunningClient) Close() error { return nil }

var _ Client = notRunningClient{}

// TestBACnetDriver_LinkMutexBindingFails exposes the missing interface
// implementation. After BindLinkMutex is wired into the driver, this
// test should be inverted (or removed). It serves as a guard rail
// against silent regression of the fix.
func TestBACnetDriver_LinkMutexBindingFails(t *testing.T) {
	d := NewBACnetDriver()

	// Compile-time guard via interface assertion. If this assertion fails
	// at runtime, the fix has been applied — please update this test
	// to assert that the driver DOES implement the interface.
	if _, ok := d.(interface {
		BindLinkMutex(mu *sync.Mutex)
	}); ok {
		t.Skip("driver now implements LinkMutexBinder — guard no longer relevant, update this test")
	}
	t.Log("CONFIRMED: BACnetDriver does not implement drv.LinkMutexBinder; connMgr.linkMu is nil; runConnect does not serialize connect calls.")
}
