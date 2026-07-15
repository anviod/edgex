package model

import (
	"encoding/json"
	"testing"
)

func TestHTTPConfig_UnmarshalJSON_WithDeviceStrategy(t *testing.T) {
	payload := `{
		"id": "http_test",
		"name": "Test",
		"url": "http://localhost:8080",
		"method": "POST",
		"auth_type": "None",
		"data_endpoint": "/api/data",
		"device_event_endpoint": "/api/events",
		"cache": {"enable": true, "max_count": 1000, "flush_interval": "1m"},
		"devices": {"dev1": {"enable": true, "strategy": "periodic", "interval": "10s"}},
		"virtual_devices": {"vdev1": {"enable": true, "strategy": "change"}}
	}`
	var cfg HTTPConfig
	if err := json.Unmarshal([]byte(payload), &cfg); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	if !cfg.Devices["dev1"].Enable {
		t.Fatalf("expected dev1 enabled")
	}
	if cfg.Devices["dev1"].Strategy != "periodic" {
		t.Fatalf("expected periodic strategy, got %q", cfg.Devices["dev1"].Strategy)
	}
}
