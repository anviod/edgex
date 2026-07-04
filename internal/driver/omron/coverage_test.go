package omron

import (
	"context"
	"testing"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_DriverBeforeInit(t *testing.T) {
	d := NewOmronFinsDriver().(*OmronFinsDriver)

	assert.Equal(t, driver.HealthStatusBad, d.Health())
	assert.NoError(t, d.SetSlaveID(1))
	assert.NoError(t, d.SetDeviceConfig(map[string]any{"ip": "10.0.0.1"}))

	connSec, recon, local, _, lastDisc := d.GetConnectionMetrics()
	assert.Equal(t, int64(0), connSec)
	assert.Equal(t, int64(0), recon)
	assert.Empty(t, local)
	assert.True(t, lastDisc.IsZero())

	m := d.GetMetrics()
	assert.Equal(t, "Omron FINS", m.Protocol)

	ctx := context.Background()
	_, err := d.ReadPoints(ctx, nil)
	require.Error(t, err)
	err = d.WritePoint(ctx, model.Point{Address: "D0"}, int16(1))
	require.Error(t, err)
}

func TestCoverage_ConfigHelpers(t *testing.T) {
	assert.Equal(t, "192.168.1.20:9600", remoteAddrFromConfig(map[string]any{
		"ip": "192.168.1.20", "port": 9600,
	}))

	v := configInt(map[string]any{"x": float64(42)}, "x")
	assert.Equal(t, 42, v)

	b := configByte(map[string]any{"n": 255}, "n")
	assert.Equal(t, byte(255), b)

	cfg := toFinsLibConfig(map[string]any{
		"src_node_addr": 2, "dst_node_addr": 1,
		"max_retries": 5, "retry_interval": 100,
	})
	assert.Equal(t, 2, cfg["srcNodeAddr"])
	assert.Equal(t, 5, cfg["maxRetries"])
}

func TestCoverage_UDPBackendInit(t *testing.T) {
	d := NewOmronFinsDriver()
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "udp",
		Config:    map[string]any{"mode": "UDP", "port": 9600},
	}))

	err := d.Connect(context.Background())
	require.Error(t, err) // no IP
}
