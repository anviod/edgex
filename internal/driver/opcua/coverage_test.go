package opcua

import (
	"context"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_ResolveEndpoint(t *testing.T) {
	d := NewOpcUaDriver().(*OpcUaDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "cov",
		Config:    map[string]any{"url": "opc.tcp://127.0.0.1:4840"},
	}))

	ep, err := d.resolveEndpointInConfig(map[string]any{})
	require.NoError(t, err)
	assert.Contains(t, ep, "4840")

	d2 := NewOpcUaDriver().(*OpcUaDriver)
	require.NoError(t, d2.Init(model.DriverConfig{Config: map[string]any{}}))
	_, err = d2.resolveEndpointInConfig(map[string]any{})
	require.Error(t, err)
}

func TestCoverage_BuildClientOptions(t *testing.T) {
	d := NewOpcUaDriver().(*OpcUaDriver)
	opts, err := d.buildClientOptions(map[string]any{})
	require.NoError(t, err)
	assert.NotEmpty(t, opts)
}

func TestCoverage_DriverLifecycle(t *testing.T) {
	d := NewOpcUaDriver().(*OpcUaDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "cov",
		Config:    map[string]any{"url": "opc.tcp://127.0.0.1:4840"},
	}))

	assert.NoError(t, d.SetSlaveID(1))
	require.NoError(t, d.SetDeviceConfig(map[string]any{
		"endpoint": "opc.tcp://127.0.0.1:4840",
	}))

	ctx := context.Background()
	require.NoError(t, d.Connect(ctx))
	defer d.Disconnect()

	health := d.Health()
	assert.NotEqual(t, driver.HealthStatus(-1), health)

	_, _, _, remote, _ := d.GetConnectionMetrics()
	assert.Contains(t, remote, "4840")

	results, err := d.ReadPoints(ctx, nil)
	require.NoError(t, err)
	assert.Nil(t, results)

	m := d.GetMetrics()
	assert.Equal(t, "OPC-UA", m.Protocol)
}

func TestCoverage_RTTAndQualityScore(t *testing.T) {
	d := NewOpcUaDriver().(*OpcUaDriver)
	require.NoError(t, d.Init(model.DriverConfig{Config: map[string]any{"url": "opc.tcp://127.0.0.1:4840"}}))

	d.recordRtt(10 * time.Millisecond)
	d.recordRtt(20 * time.Millisecond)
	avg, min, max := d.rttSnapshot()
	assert.Greater(t, avg, 0.0)
	assert.Greater(t, min, 0.0)
	assert.Greater(t, max, 0.0)

	// calculateQualityScore requires connected activeClient
	d.activeClient = &ClientWrapper{Connected: true, Endpoint: "opc.tcp://127.0.0.1:4840"}
	d.totalRequests = 10
	d.successCount = 9
	d.failureCount = 1
	score := d.calculateQualityScore()
	assert.Greater(t, score, 0)
	assert.LessOrEqual(t, score, 100)

	d.recordReadOutcome(time.Now(), true, "")
	d.recordReadOutcome(time.Now(), false, "timeout")
	d.recordReconnect()
}

func TestCoverage_ScanDefaultEndpoints(t *testing.T) {
	d := NewOpcUaDriver().(*OpcUaDriver)
	require.NoError(t, d.Init(model.DriverConfig{Config: map[string]any{}}))
	result, err := d.Scan(context.Background(), nil)
	require.NoError(t, err)
	endpoints, ok := result.([]map[string]any)
	require.True(t, ok)
	assert.NotEmpty(t, endpoints)
}

func TestCoverage_ClassifyReadError(t *testing.T) {
	assert.Equal(t, "timeout", classifyOpcUaReadError(context.DeadlineExceeded))
	assert.Equal(t, "network", classifyOpcUaReadError(assert.AnError))
}
