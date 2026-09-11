package core

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/anviod/edgeCore/internal/driver"
	"github.com/anviod/edgeCore/internal/model"
)

// watchdogDriver is a Driver that also implements driver.ReconnectScheduler
// and reports a configurable health status, so the channel health watchdog
// can be exercised deterministically.
type watchdogDriver struct {
	health     driver.HealthStatus
	mu         sync.Mutex
	reconnects int
}

func (w *watchdogDriver) Init(_ model.DriverConfig) error { return nil }
func (w *watchdogDriver) Connect(_ context.Context) error { return nil }
func (w *watchdogDriver) Disconnect() error               { return nil }
func (w *watchdogDriver) ReadPoints(_ context.Context, _ []model.Point) (map[string]model.Value, error) {
	return nil, nil
}
func (w *watchdogDriver) WritePoint(_ context.Context, _ model.Point, _ any) error { return nil }
func (w *watchdogDriver) Health() driver.HealthStatus                              { return w.health }
func (w *watchdogDriver) SetSlaveID(_ uint8) error                                 { return nil }
func (w *watchdogDriver) SetDeviceConfig(_ map[string]any) error                   { return nil }
func (w *watchdogDriver) GetConnectionMetrics() (int64, int64, string, string, time.Time) {
	return 0, 0, "", "", time.Time{}
}
func (w *watchdogDriver) ScheduleReconnect(_ context.Context, _ time.Duration) {
	w.mu.Lock()
	w.reconnects++
	w.mu.Unlock()
}
func (w *watchdogDriver) reconnectCount() int {
	w.mu.Lock()
	defer w.mu.Unlock()
	return w.reconnects
}

// TestChannelHealthWatchdog_TriggersReconnectWithCooldown verifies the
// channel-level recovery loop: a channel whose link is down gets exactly one
// reconnect attempt, and the per-channel cooldown suppresses repeats.
func TestChannelHealthWatchdog_TriggersReconnectWithCooldown(t *testing.T) {
	cm := NewChannelManager(nil, nil)
	defer cm.Shutdown()

	bad := &watchdogDriver{health: driver.HealthStatusBad}
	cm.mu.Lock()
	cm.channels["ch-bad"] = &model.Channel{ID: "ch-bad", Name: "bad", Enable: true}
	cm.drivers["ch-bad"] = bad
	cm.driverMus["ch-bad"] = &sync.Mutex{}
	cm.mu.Unlock()

	attempts := map[string]time.Time{}
	cm.checkChannelHealth(attempts)
	cm.checkChannelHealth(attempts) // must be suppressed by the cooldown

	if got := bad.reconnectCount(); got != 1 {
		t.Fatalf("reconnect attempts = %d, want 1 (cooldown must suppress repeats)", got)
	}
}

// TestChannelHealthWatchdog_IgnoresHealthyAndUnsupportedDrivers verifies the
// watchdog never acts on a healthy link, and never touches drivers that do not
// implement ReconnectScheduler (avoiding unserialized Connect calls).
func TestChannelHealthWatchdog_IgnoresHealthyAndUnsupportedDrivers(t *testing.T) {
	cm := NewChannelManager(nil, nil)
	defer cm.Shutdown()

	good := &watchdogDriver{health: driver.HealthStatusGood}
	noSched := &plainDriver{health: driver.HealthStatusBad}
	disabled := &watchdogDriver{health: driver.HealthStatusBad}

	cm.mu.Lock()
	cm.channels["ch-good"] = &model.Channel{ID: "ch-good", Name: "good", Enable: true}
	cm.drivers["ch-good"] = good
	cm.driverMus["ch-good"] = &sync.Mutex{}

	cm.channels["ch-nosched"] = &model.Channel{ID: "ch-nosched", Name: "nosched", Enable: true}
	cm.drivers["ch-nosched"] = noSched
	cm.driverMus["ch-nosched"] = &sync.Mutex{}

	cm.channels["ch-disabled"] = &model.Channel{ID: "ch-disabled", Name: "disabled", Enable: false}
	cm.drivers["ch-disabled"] = disabled
	cm.driverMus["ch-disabled"] = &sync.Mutex{}
	cm.mu.Unlock()

	attempts := map[string]time.Time{}
	cm.checkChannelHealth(attempts)
	cm.checkChannelHealth(attempts)

	if got := good.reconnectCount(); got != 0 {
		t.Fatalf("healthy channel must not trigger reconnect, got %d", got)
	}
	if got := disabled.reconnectCount(); got != 0 {
		t.Fatalf("disabled channel must not trigger reconnect, got %d", got)
	}
}

// plainDriver implements Driver only (no ReconnectScheduler).
type plainDriver struct {
	health driver.HealthStatus
	mu     sync.Mutex
	conns  int
}

func (p *plainDriver) Init(_ model.DriverConfig) error { return nil }
func (p *plainDriver) Connect(_ context.Context) error {
	p.mu.Lock()
	p.conns++
	p.mu.Unlock()
	return nil
}
func (p *plainDriver) Disconnect() error { return nil }
func (p *plainDriver) ReadPoints(_ context.Context, _ []model.Point) (map[string]model.Value, error) {
	return nil, nil
}
func (p *plainDriver) WritePoint(_ context.Context, _ model.Point, _ any) error { return nil }
func (p *plainDriver) Health() driver.HealthStatus                              { return p.health }
func (p *plainDriver) SetSlaveID(_ uint8) error                                 { return nil }
func (p *plainDriver) SetDeviceConfig(_ map[string]any) error                   { return nil }
func (p *plainDriver) GetConnectionMetrics() (int64, int64, string, string, time.Time) {
	return 0, 0, "", "", time.Time{}
}

var _ driver.Driver = (*watchdogDriver)(nil)
var _ driver.Driver = (*plainDriver)(nil)
var _ driver.ReconnectScheduler = (*watchdogDriver)(nil)
