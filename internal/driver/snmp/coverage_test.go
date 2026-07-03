package snmp

import (
	"context"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"github.com/gosnmp/gosnmp"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDriverLifecycleCoverage(t *testing.T) {
	d := NewSNMPDriver().(*SNMPDriver)
	require.NoError(t, d.SetSlaveID(1))
	require.NoError(t, d.SetDeviceConfig(map[string]any{
		"ip": "127.0.0.1", "community": "private",
	}))

	assert.Equal(t, driver.HealthStatusBad, d.Health())

	_, _, _, remote, _ := d.GetConnectionMetrics()
	assert.Contains(t, remote, "127.0.0.1")

	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "cov",
		Config:    map[string]any{"ip": "127.0.0.1", "port": 161, "community": "public"},
	}))

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	err := d.Connect(ctx)
	require.Error(t, err) // no real agent

	_, err = d.ReadPoints(ctx, []model.Point{{ID: "p1", Address: "public|1.3.6.1.2.1.1.1.0"}})
	require.Error(t, err)
}

func TestScanObjectsWithWalkHook(t *testing.T) {
	d := NewSNMPDriver().(*SNMPDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "scan",
		Config:    map[string]any{"ip": "127.0.0.1", "community": "public"},
	}))

	d.transport.connected.Store(true)
	d.transport.client = &gosnmp.GoSNMP{}
	d.transport.walkHook = func(rootOID, community string, walkFn func(pdu gosnmp.SnmpPDU) error) error {
		assert.Equal(t, "1.3.6.1.2.1", rootOID)
		assert.Equal(t, "public", community)
		return walkFn(gosnmp.SnmpPDU{Name: "1.3.6.1.2.1.1.1.0", Type: gosnmp.OctetString, Value: []byte("test")})
	}

	entries, err := d.ScanObjects(context.Background(), map[string]any{"rootOID": "1.3.6.1.2.1"})
	require.NoError(t, err)
	require.NotNil(t, entries)
}

func TestBuildClientV3Coverage(t *testing.T) {
	t.Run("valid authPriv", func(t *testing.T) {
		tr := NewSNMPTransport(map[string]any{
			"version":          "v3",
			"securityName":     "admin",
			"authProtocol":     "SHA",
			"authPassphrase":   "authpass123",
			"privProtocol":     "AES",
			"privPassphrase":   "privpass123",
			"securityLevel":    "authPriv",
			"ip":               "127.0.0.1",
		})
		client, err := tr.buildClient()
		require.NoError(t, err)
		assert.Equal(t, gosnmp.Version3, client.Version)
	})

	t.Run("invalid v3 config", func(t *testing.T) {
		tr := NewSNMPTransport(map[string]any{
			"version":      "v3",
			"securityName": "admin",
			"authProtocol": "INVALID",
			"ip":           "127.0.0.1",
		})
		_, err := tr.buildClient()
		require.Error(t, err)
	})
}

func TestDecoderEncodeCoverage(t *testing.T) {
	dec := NewSNMPDecoder()
	val, asn, err := dec.EncodeValue(int32(42), "INT32")
	require.NoError(t, err)
	assert.Equal(t, gosnmp.Integer, asn)
	assert.Equal(t, 42, val)

	_, _, err = dec.EncodeValue("bad", "INT32")
	require.Error(t, err)

	val, quality := dec.DecodePDU(gosnmp.SnmpPDU{Type: gosnmp.Integer, Value: 7}, "INT32")
	assert.Equal(t, "Good", quality)
	assert.Equal(t, int32(7), val)

	val, quality = dec.DecodePDU(gosnmp.SnmpPDU{Type: gosnmp.IPAddress, Value: []byte{192, 168, 1, 1}}, "IP")
	assert.Equal(t, "Good", quality)
	assert.NotNil(t, val)
}

func TestTransportGetBulkAndNextHooks(t *testing.T) {
	tr := NewSNMPTransport(map[string]any{"ip": "127.0.0.1"})
	tr.connected.Store(true)
	tr.client = &gosnmp.GoSNMP{}

	tr.getHook = func(oids []string, community string) ([]gosnmp.SnmpPDU, error) {
		return []gosnmp.SnmpPDU{{Name: oids[0], Type: gosnmp.Integer, Value: 1}}, nil
	}
	pdus, err := tr.Get([]string{"1.3.6.1.2.1.1.1.0"}, "public")
	require.NoError(t, err)
	require.Len(t, pdus, 1)

	tr.getHook = nil
	_, err = tr.GetBulk("1.3.6.1.2.1", "public", 10)
	require.Error(t, err)
}

func TestParseDeviceConfigCoverage(t *testing.T) {
	cfg := parseDeviceConfig(map[string]any{
		"ip":        "10.0.0.5",
		"port":      162,
		"timeout":   3000,
		"retries":   2,
		"version":   "v2c",
		"community": "public",
		"maxBulkSize": 25,
	})
	assert.Equal(t, "10.0.0.5", cfg.TargetIP)
	assert.Equal(t, 25, cfg.MaxBulkSize)
	assert.False(t, cfg.isV3())
}
