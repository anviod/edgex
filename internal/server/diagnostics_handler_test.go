package server

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func diagnosticsGET(t *testing.T, srv *Server, path string) *http.Response {
	t.Helper()
	token := GenerateTestToken()
	req := httptest.NewRequest(http.MethodGet, path, nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := srv.app.Test(req, -1)
	require.NoError(t, err)
	return resp
}

func TestGetScanEngineDiagnostics(t *testing.T) {
	srv := newChannelTestServer(t)

	resp := diagnosticsGET(t, srv, "/api/diagnostics/scan-engine")
	defer resp.Body.Close()
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var body map[string]any
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&body))
	_, hasWarnings := body["sla_warnings"]
	assert.True(t, hasWarnings, "response should include sla_warnings key")
}

func TestGetSoakMonitor(t *testing.T) {
	srv := newChannelTestServer(t)

	resp := diagnosticsGET(t, srv, "/api/diagnostics/soak")
	defer resp.Body.Close()
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var body map[string]any
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&body))
	runtime, ok := body["runtime"].(map[string]any)
	require.True(t, ok, "soak response should include runtime block")
	assert.NotEmpty(t, runtime["start_time"])
}

func TestGetDeviceDiagnostics(t *testing.T) {
	srv := newChannelTestServer(t)

	t.Run("missing device id route param", func(t *testing.T) {
		resp := diagnosticsGET(t, srv, "/api/devices//diagnostics")
		defer resp.Body.Close()
		assert.NotEqual(t, http.StatusOK, resp.StatusCode)
	})

	t.Run("unknown device returns diagnostics shell", func(t *testing.T) {
		resp := diagnosticsGET(t, srv, "/api/devices/unknown-device/diagnostics")
		defer resp.Body.Close()
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		var body map[string]any
		require.NoError(t, json.NewDecoder(resp.Body).Decode(&body))
		assert.Equal(t, "unknown-device", body["device_id"])
	})
}

func TestGetChannelEventLog(t *testing.T) {
	srv := newChannelTestServer(t)

	t.Run("channel not found", func(t *testing.T) {
		resp := diagnosticsGET(t, srv, "/api/channels/nonexistent/diagnostics/events")
		defer resp.Body.Close()
		assert.Equal(t, http.StatusNotFound, resp.StatusCode)
	})

	t.Run("existing channel returns events array", func(t *testing.T) {
		addResp := postChannel(t, srv, map[string]any{
			"id":       "ch-diag-events",
			"name":     "Diag Events Channel",
			"protocol": "modbus-tcp",
			"config":   map[string]any{"url": "tcp://127.0.0.1:502"},
		})
		addResp.Body.Close()
		require.Equal(t, http.StatusOK, addResp.StatusCode)

		resp := diagnosticsGET(t, srv, "/api/channels/ch-diag-events/diagnostics/events")
		defer resp.Body.Close()
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		var body map[string]any
		require.NoError(t, json.NewDecoder(resp.Body).Decode(&body))
		assert.Equal(t, "ch-diag-events", body["channel_id"])
		assert.Contains(t, body, "events")
	})
}
