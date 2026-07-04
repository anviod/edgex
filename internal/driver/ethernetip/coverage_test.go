package ethernetip

import (
	"context"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_DriverLifecycle(t *testing.T) {
	d := NewEtherNetIPDriver().(*EtherNetIPDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "cov",
		Config:    map[string]any{"ip": "192.168.1.10", "port": 44818, "timeout": 1000},
	}))

	assert.Equal(t, driver.HealthStatusBad, d.Health())
	assert.NoError(t, d.SetSlaveID(1))
	assert.NoError(t, d.SetDeviceConfig(nil))

	m := d.GetMetrics()
	assert.Equal(t, "EtherNet/IP", m.Protocol)
	assert.Less(t, m.QualityScore, 85)

	_, _, _, remote, _ := d.GetConnectionMetrics()
	assert.Contains(t, remote, "192.168.1.10")

	ctx := context.Background()
	_, err := d.ReadPoints(ctx, []model.Point{{ID: "p1", Address: "MyTag"}})
	require.Error(t, err)
	err = d.WritePoint(ctx, model.Point{Address: "MyTag"}, int16(1))
	require.Error(t, err)

	require.NoError(t, d.Disconnect())
}

func TestCoverage_DecoderParseAndCodec(t *testing.T) {
	dec := NewENIPDecoder()

	cases := []struct {
		addr string
	}{
		{"MyTag"},
		{"MyArray[5]"},
		{"Program:Main.MyTag"},
		{"Program:Main.MyArray[3]"},
		{"Nested.Sub.Tag"},
	}
	for _, tc := range cases {
		tag, err := dec.ParseAddress(tc.addr)
		require.NoError(t, err, tc.addr)
		assert.NotEmpty(t, tag.Name)
	}

	// Encode / decode round-trip
	types := []struct {
		dt    string
		val   any
		check func(t *testing.T, got any)
	}{
		{"BOOL", true, func(t *testing.T, got any) { assert.True(t, got.(bool)) }},
		{"INT16", int16(1234), func(t *testing.T, got any) { assert.Equal(t, int16(1234), got.(int16)) }},
		{"DINT", int32(-999), func(t *testing.T, got any) { assert.Equal(t, int32(-999), got.(int32)) }},
		{"REAL", float32(2.5), func(t *testing.T, got any) { assert.InDelta(t, 2.5, got.(float32), 0.01) }},
	}
	for _, tc := range types {
		raw, err := dec.EncodeValue(tc.val, tc.dt)
		require.NoError(t, err, tc.dt)
		got, err := dec.DecodeValue(raw, tc.dt)
		require.NoError(t, err, tc.dt)
		tc.check(t, got)
	}

	_, encErr := dec.EncodeValue("bad", "INT16")
	require.Error(t, encErr)
}

func TestCoverage_TransportConfigAndMetrics(t *testing.T) {
	tr := NewENIPTransport(map[string]any{
		"ip":              "10.0.0.5",
		"port":            44818,
		"slot":            1,
		"timeout":         1500,
		"max_retries":     3,
		"max_fail_count":  2,
		"collect_cycle":   5000,
		"connection_type": "logix",
	})
	defer tr.connMgr.Close()

	assert.Equal(t, "10.0.0.5", tr.ip)
	assert.Equal(t, 1, tr.slot)
	assert.Equal(t, "logix", tr.connectionType)

	tr.RecordFailure(assert.AnError)
	tr.RecordSuccess()
	assert.False(t, tr.NeedProbeCheck())
	tr.lastActivityTime.Store(time.Now().Add(-20 * time.Second))
	assert.True(t, tr.NeedProbeCheck())

	connSec, recon, local, remote, _ := tr.GetConnectionMetrics()
	assert.Equal(t, int64(0), connSec)
	assert.Equal(t, int64(0), recon)
	assert.Empty(t, local)
	assert.Contains(t, remote, "10.0.0.5")
}

func TestCoverage_SchedulerHelpers(t *testing.T) {
	s := &ENIPScheduler{}
	assert.Equal(t, "MyTag", s.resolveLogixTagName("Program:Main.MyTag"))
	assert.Equal(t, "DintTag", s.resolveLogixTagName("Controller:Tag.DintTag"))

	id, ok := s.getLogixClass2AttrID("DintTag")
	assert.True(t, ok)
	assert.Equal(t, 4, id)

	_, ok = s.getLogixClass2AttrID("UnknownTag")
	assert.False(t, ok)
}

func TestCoverage_QualityScore(t *testing.T) {
	d := NewEtherNetIPDriver().(*EtherNetIPDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		Config: map[string]any{"ip": "127.0.0.1"},
	}))

	d.scheduler.totalRequests = 10
	d.scheduler.successCount = 9
	d.transport.connected.Store(true)
	m := d.GetMetrics()
	assert.Greater(t, m.QualityScore, 70)
	assert.InDelta(t, 0.9, m.SuccessRate, 0.01)
}
