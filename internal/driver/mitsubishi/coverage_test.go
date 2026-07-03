package mitsubishi

import (
	"context"
	"encoding/binary"
	"math"
	"net"
	"strconv"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDecoderCoverage(t *testing.T) {
	dec := NewMCDecoder()
	addr, err := ParseAddress("D100.3")
	require.NoError(t, err)

	bl, isBit := dec.ReadSize("INT16", addr)
	assert.Equal(t, 2, bl)
	assert.False(t, isBit)

	bl, isBit = dec.ReadSize("BOOL", &MCAddress{IsBit: true})
	assert.True(t, isBit)

	v, err := dec.DecodeValue([]byte{0x34, 0x12}, &MCAddress{}, "INT16")
	require.NoError(t, err)
	assert.Equal(t, int16(0x1234), v)

	v, err = dec.DecodeValue([]byte{0x10}, &MCAddress{IsBit: true}, "BOOL")
	require.NoError(t, err)
	assert.True(t, v.(bool))

	word := binary.LittleEndian.Uint16([]byte{0x08, 0x00})
	_ = word
	v, err = dec.DecodeValue([]byte{0x08, 0x00}, &MCAddress{BitOffset: 3}, "BOOL")
	require.NoError(t, err)
	assert.True(t, v.(bool))

	v, err = dec.DecodeValue(binary.LittleEndian.AppendUint32(nil, math.Float32bits(1.5)), &MCAddress{}, "FLOAT")
	require.NoError(t, err)
	assert.InDelta(t, 1.5, v.(float32), 0.001)

	v, err = dec.DecodeValue([]byte{'H', 0, 'i', 0}, &MCAddress{StringLen: 4}, "STRING")
	require.NoError(t, err)
	assert.Equal(t, "Hi", v)

	payload, isBitWrite, err := dec.EncodeValue(&MCAddress{IsBit: true}, "BOOL", true)
	require.NoError(t, err)
	assert.True(t, isBitWrite)
	assert.Equal(t, byte(0x10), payload[0])

	payload, _, err = dec.EncodeValue(&MCAddress{}, "INT32", int32(1000))
	require.NoError(t, err)
	assert.Equal(t, uint32(1000), binary.LittleEndian.Uint32(payload))

	_, _, err = dec.EncodeValue(&MCAddress{BitOffset: 1}, "BOOL", true)
	require.Error(t, err)
}

func TestDriverMetricsAndLifecycle(t *testing.T) {
	d := NewMitsubishiDriver().(*MitsubishiDriver)
	require.NoError(t, d.SetSlaveID(1))
	require.NoError(t, d.SetDeviceConfig(nil))

	m := d.GetMetrics()
	assert.Equal(t, "Mitsubishi MC", m.Protocol)
	assert.Less(t, m.QualityScore, 85)

	_, _, _, remote, _ := d.GetConnectionMetrics()
	assert.Contains(t, remote, "")

	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "cov",
		Config:    map[string]any{"ip": "10.0.0.2", "port": 5000},
	}))

	d.scheduler.totalRequests = 4
	d.scheduler.successCount = 2
	m = d.GetMetrics()
	assert.InDelta(t, 0.5, m.SuccessRate, 0.01)

	ctx := context.Background()
	_, err := d.ReadPoints(ctx, nil)
	require.Error(t, err)
	err = d.WritePoint(ctx, model.Point{Address: "D0"}, int16(1))
	require.Error(t, err)
}

func TestMockPLCErrorAndWritePaths(t *testing.T) {
	mock := NewMockPLC()
	addr, err := mock.Start()
	require.NoError(t, err)
	defer mock.Close()

	host, portStr, _ := net.SplitHostPort(addr)
	port, _ := strconv.Atoi(portStr)

	d := NewMitsubishiDriver()
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "mock-err",
		Config:    map[string]any{"ip": host, "port": port, "timeout": 2000},
	}))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	require.NoError(t, d.Connect(ctx))
	defer d.Disconnect()

	assert.Equal(t, driver.HealthStatusGood, d.Health())

	// Unknown device code still reads zeros
	results, err := d.ReadPoints(ctx, []model.Point{
		{ID: "p1", Address: "W0", DataType: "INT16"},
	})
	require.NoError(t, err)
	assert.Equal(t, "Good", results["p1"].Quality)

	mock.SetWord("D", 50, 999)
	results, err = d.ReadPoints(ctx, []model.Point{
		{ID: "p2", Address: "D50", DataType: "UINT16"},
	})
	require.NoError(t, err)
	assert.Equal(t, uint16(999), results["p2"].Value)

	require.NoError(t, d.WritePoint(ctx, model.Point{Address: "M5", DataType: "BOOL"}, true))
	results, err = d.ReadPoints(ctx, []model.Point{{ID: "m5", Address: "M5", DataType: "BOOL"}})
	require.NoError(t, err)
	assert.True(t, results["m5"].Value.(bool))
}

func TestConfigParsingCoverage(t *testing.T) {
	cfg, err := parseDriverConfig(map[string]any{
		"ip":             "192.168.0.10",
		"port":           5007,
		"frame":          "3E",
		"timeout":        1500,
		"batchReadMax":   32,
		"maxRetries":     5,
		"networkNo":      0,
		"stationNo":      255,
	})
	require.NoError(t, err)
	assert.Equal(t, "192.168.0.10", cfg.ip)
	assert.Equal(t, 32, cfg.batchReadMax)
}

func TestToHelpersCoverage(t *testing.T) {
	b, err := toBool("on")
	require.NoError(t, err)
	assert.True(t, b)

	_, err = toBool("nope")
	require.Error(t, err)

	u, err := toUint64(uint16(42))
	require.NoError(t, err)
	assert.Equal(t, uint64(42), u)

	_, err = toUint64(-1)
	require.Error(t, err)

	f, err := toFloat64(float32(3.5))
	require.NoError(t, err)
	assert.InDelta(t, 3.5, f, 0.001)
}

func TestMockPLCBuildResponseInvalid(t *testing.T) {
	mock := NewMockPLC()
	assert.Nil(t, mock.buildResponse([]byte{0x00}))
	assert.Nil(t, mock.buildResponse([]byte{0x50}))

	req := make([]byte, 21)
	req[0] = 0x50
	binary.LittleEndian.PutUint16(req[11:13], 0x9999)
	resp := mock.buildResponse(req)
	require.NotNil(t, resp)
	assert.Equal(t, byte(0xD4), resp[0])
}
