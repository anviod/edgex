package datalink

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_NewUDPDataLinkFromIP(t *testing.T) {
	dl, err := NewUDPDataLinkFromIP("127.0.0.1", 8, DefaultPort)
	if err != nil {
		t.Skipf("UDP datalink unavailable in this environment: %v", err)
	}
	require.NotNil(t, dl)
	addr := dl.GetMyAddress()
	require.NotNil(t, addr)
	assert.NotEmpty(t, addr.Mac)
	assert.NotNil(t, dl.GetBroadcastAddress())
	require.NoError(t, dl.Close())
}

func TestCoverage_NewUDPDataLinkFromCIDR(t *testing.T) {
	dl, err := NewUDPDataLinkFromCIDR("127.0.0.1/8", DefaultPort)
	if err != nil {
		t.Skipf("UDP datalink unavailable: %v", err)
	}
	require.NotNil(t, dl)
	require.NoError(t, dl.Close())
}

func TestCoverage_NewUDPDataLinkInvalidInterface(t *testing.T) {
	_, err := NewUDPDataLink("invalid-nic-xyz", DefaultPort)
	require.Error(t, err)
}
