package profinetio

import (
	"context"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDriverMetricsAndLifecycle(t *testing.T) {
	d := NewProfinetIODriver().(*ProfinetIODriver)
	require.NoError(t, d.SetSlaveID(1))
	require.NoError(t, d.SetDeviceConfig(map[string]any{"ip": "192.168.1.30"}))

	m := d.GetMetrics()
	assert.Equal(t, "Profinet IO", m.Protocol)
	assert.Less(t, m.QualityScore, 85)

	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "cov",
		Config:    map[string]any{"simulation": true},
	}))
	require.NoError(t, d.Connect(context.Background()))
	defer d.Disconnect()

	assert.Equal(t, driver.HealthStatusGood, d.Health())

	d.scheduler.totalRequests = 10
	d.scheduler.successCount = 8
	m = d.GetMetrics()
	assert.InDelta(t, 0.8, m.SuccessRate, 0.01)

	total, success, failure := d.scheduler.GetStats()
	assert.Equal(t, int64(10), total)
	assert.Equal(t, int64(8), success)
	assert.Equal(t, int64(0), failure)
	_ = failure
	_ = success
}

func TestSimulationReadWriteAllTypes(t *testing.T) {
	d := NewProfinetIODriver()
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "sim-types",
		Config:    map[string]any{"simulation": true},
	}))
	require.NoError(t, d.Connect(context.Background()))
	defer d.Disconnect()
	require.NoError(t, d.SetDeviceConfig(map[string]any{"ip": "192.168.1.40"}))

	ctx := context.Background()
	points := []model.Point{
		{ID: "i16", Address: "1:1:0", DataType: "int16"},
		{ID: "u16", Address: "1:1:2", DataType: "uint16"},
		{ID: "i32", Address: "1:1:4", DataType: "int32"},
		{ID: "f32", Address: "1:1:8", DataType: "float"},
		{ID: "bit", Address: "1:2:0.1", DataType: "bit"},
	}

	for _, pt := range points {
		require.NoError(t, d.WritePoint(ctx, pt, sampleValue(pt.DataType)))
	}

	results, err := d.ReadPoints(ctx, points)
	require.NoError(t, err)
	for _, pt := range points {
		assert.Equal(t, "Good", results[pt.ID].Quality, pt.ID)
	}
}

func sampleValue(dataType string) any {
	switch dataType {
	case "int16":
		return int16(-100)
	case "uint16":
		return uint16(65000)
	case "int32":
		return int32(123456)
	case "float":
		return float32(2.5)
	case "bit":
		return true
	default:
		return int16(0)
	}
}

func TestConfigParsingCoverage(t *testing.T) {
	ch := parseChannelConfig(map[string]any{
		"simulation":       true,
		"timeout":          1500,
		"local_interface":  "eth0",
		"maxRetries":       5,
	})
	assert.True(t, ch.simulation)
	assert.Equal(t, 1500*time.Millisecond, ch.timeout)
	assert.Equal(t, 5, ch.maxRetries)

	dev := parseDeviceConfig(map[string]any{"ip": "192.168.1.50", "slot": 3})
	assert.Equal(t, "192.168.1.50", dev.ip)
}

func TestTransportSimulationConnect(t *testing.T) {
	tr := NewProfinetTransport(channelConfig{simulation: true, timeout: time.Second})
	require.NoError(t, tr.Connect(context.Background()))
	assert.True(t, tr.IsConnected())

	sec, _, local, remote, _ := tr.GetConnectionMetrics()
	assert.GreaterOrEqual(t, sec, int64(0))
	assert.NotEmpty(t, local)

	data, err := tr.ReadIO(context.Background(), 1, 1, 0, 4)
	require.NoError(t, err)
	assert.Len(t, data, 4)

	require.NoError(t, tr.WriteIO(context.Background(), 1, 1, 0, []byte{1, 2, 3, 4}))
	require.NoError(t, tr.Disconnect())
}

func TestDecoderErrorPaths(t *testing.T) {
	dec := NewProfinetDecoder()
	_, err := dec.DecodeValue([]byte{0x01}, "int32", &ParsedAddress{Endian: EndianBig})
	require.Error(t, err)

	_, err = dec.EncodeValue("x", "int16", &ParsedAddress{})
	require.Error(t, err)
}

func TestDriverNotConnectedErrors(t *testing.T) {
	d := NewProfinetIODriver()
	require.NoError(t, d.Init(model.DriverConfig{Config: map[string]any{"simulation": true}}))
	ctx := context.Background()
	_, err := d.ReadPoints(ctx, []model.Point{{ID: "p1", Address: "1:1:0"}})
	require.Error(t, err)
}
