package core

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	drv "github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
)

type stubChannelDriver struct {
	health drv.HealthStatus
}

func (s *stubChannelDriver) Init(_ model.DriverConfig) error { return nil }
func (s *stubChannelDriver) Connect(_ context.Context) error   { return nil }
func (s *stubChannelDriver) Disconnect() error                 { return nil }
func (s *stubChannelDriver) ReadPoints(_ context.Context, _ []model.Point) (map[string]model.Value, error) {
	return nil, nil
}
func (s *stubChannelDriver) WritePoint(_ context.Context, _ model.Point, _ any) error { return nil }
func (s *stubChannelDriver) Health() drv.HealthStatus                                   { return s.health }
func (s *stubChannelDriver) SetSlaveID(_ uint8) error                                   { return nil }
func (s *stubChannelDriver) SetDeviceConfig(_ map[string]any) error                     { return nil }
func (s *stubChannelDriver) GetConnectionMetrics() (int64, int64, string, string, time.Time) {
	return 0, 0, "", "", time.Time{}
}

func newTestChannelManager() *ChannelManager {
	cm := NewChannelManager(NewDataPipeline(64), nil)
	cm.channels["ch-1"] = &model.Channel{
		ID:       "ch-1",
		Name:     "modbus",
		Protocol: "modbus-tcp",
		Enable:   true,
		Devices: []model.Device{
			{ID: "dev-1", Name: "slave-1", Enable: true},
			{ID: "dev-2", Name: "slave-2", Enable: true},
		},
	}
	cm.drivers["ch-1"] = &stubChannelDriver{health: drv.HealthStatusGood}
	cm.driverMus["ch-1"] = &sync.Mutex{}
	cm.stateManager.RegisterNode("dev-1", "slave-1")
	cm.stateManager.RegisterNode("dev-2", "slave-2")
	return cm
}

func TestResolveEffectiveDeviceState_ChannelOffline(t *testing.T) {
	ch := &model.Channel{Enable: true}
	dev := &model.Device{Enable: true}
	driver := &stubChannelDriver{health: drv.HealthStatusBad}

	got := resolveEffectiveDeviceState(ch, driver, dev, int(NodeStateOnline))
	if got != int(NodeStateOffline) {
		t.Fatalf("expected offline when channel link is down, got %d", got)
	}
}

func TestResolveEffectiveDeviceState_ChannelOnline(t *testing.T) {
	ch := &model.Channel{Enable: true}
	dev := &model.Device{Enable: true}
	driver := &stubChannelDriver{health: drv.HealthStatusGood}

	got := resolveEffectiveDeviceState(ch, driver, dev, int(NodeStateUnstable))
	if got != int(NodeStateUnstable) {
		t.Fatalf("expected unstable when channel link is up, got %d", got)
	}
}

func TestMarkChannelDevicesOffline(t *testing.T) {
	cm := newTestChannelManager()

	cm.stateManager.GetNode("dev-1").Runtime.State = NodeStateOnline
	cm.stateManager.GetNode("dev-2").Runtime.State = NodeStateUnstable

	cm.markChannelDevicesOffline("ch-1")

	for _, id := range []string{"dev-1", "dev-2"} {
		node := cm.stateManager.GetNode(id)
		if node.Runtime.State != NodeStateOffline {
			t.Fatalf("device %s expected offline, got %d", id, node.Runtime.State)
		}
	}
}

func TestFinalizeScanCollect_ChannelLinkErrorMarksAllOffline(t *testing.T) {
	cm := newTestChannelManager()

	cm.stateManager.GetNode("dev-1").Runtime.State = NodeStateOnline
	cm.stateManager.GetNode("dev-2").Runtime.State = NodeStateOnline

	cm.finalizeScanCollect("dev-1", &ExecuteResult{
		Success: false,
		Error:   errors.New("Modbus connection failed, entering coolDown: dial tcp 127.0.0.1:502: connect: connection refused"),
	})

	for _, id := range []string{"dev-1", "dev-2"} {
		node := cm.stateManager.GetNode(id)
		if node.Runtime.State != NodeStateOffline {
			t.Fatalf("device %s expected offline after channel link error, got %d", id, node.Runtime.State)
		}
	}
}

func TestGetChannelDevices_OverridesStateWhenChannelOffline(t *testing.T) {
	cm := newTestChannelManager()
	cm.drivers["ch-1"] = &stubChannelDriver{health: drv.HealthStatusBad}
	cm.stateManager.GetNode("dev-1").Runtime.State = NodeStateOnline

	devices := cm.GetChannelDevices("ch-1")
	if len(devices) != 2 {
		t.Fatalf("expected 2 devices, got %d", len(devices))
	}
	if devices[0].State != int(NodeStateOffline) {
		t.Fatalf("expected offline in API response, got %d", devices[0].State)
	}
}
