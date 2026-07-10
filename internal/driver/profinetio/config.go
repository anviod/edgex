package profinetio

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

type channelConfig struct {
	localInterface    string
	timeout           time.Duration
	maxRetries        int
	heartbeatInterval time.Duration
	simulation        bool
}

type deviceConfig struct {
	deviceName   string
	ip           string
	port         int
	api          string
	slot         int
	subslot      int
	ident        string
	subIdent     string
	properties   string
	inputLength  int
	outputLength int
}

func parseChannelConfig(cfg map[string]any) channelConfig {
	tc := channelConfig{
		timeout:           3 * time.Second,
		maxRetries:        3,
		heartbeatInterval: 30 * time.Second,
	}
	if cfg == nil {
		return tc
	}
	if v, ok := cfg["local_interface"].(string); ok {
		tc.localInterface = strings.TrimSpace(v)
	}
	if v, ok := cfg["localInterface"].(string); ok && tc.localInterface == "" {
		tc.localInterface = strings.TrimSpace(v)
	}
	if v, ok := cfg["timeout"]; ok {
		tc.timeout = parseDurationMs(v, tc.timeout)
	}
	if v, ok := cfg["max_retries"]; ok {
		tc.maxRetries = parseInt(v, tc.maxRetries)
	}
	if v, ok := cfg["heartbeat_interval"]; ok {
		tc.heartbeatInterval = parseDurationMs(v, tc.heartbeatInterval)
	}
	if v, ok := cfg["simulation"].(bool); ok {
		tc.simulation = v
	}
	return tc
}

func parseDeviceConfig(cfg map[string]any) deviceConfig {
	dc := deviceConfig{port: 34964}
	if cfg == nil {
		return dc
	}
	dc.deviceName = firstString(cfg, "device_name", "deviceName", "name")
	dc.ip = firstString(cfg, "ip", "device_ip", "deviceIp")
	dc.port = parseInt(firstAny(cfg, "port", "device_port", "devicePort"), 34964)
	dc.api = firstString(cfg, "api", "api_list", "apiList")
	dc.slot = parseInt(firstAny(cfg, "slot", "slot_number", "slotNumber"), 0)
	dc.subslot = parseInt(firstAny(cfg, "subslot", "sub_slot", "subSlot"), 1)
	dc.ident = firstString(cfg, "ident", "identifier")
	dc.subIdent = firstString(cfg, "sub_ident", "subIdent", "sub_identifier")
	dc.properties = firstString(cfg, "properties", "property")
	dc.inputLength = parseInt(firstAny(cfg, "input_length", "inputLength"), 0)
	dc.outputLength = parseInt(firstAny(cfg, "output_length", "outputLength"), 0)
	return dc
}

func (d deviceConfig) remoteAddr() string {
	if d.ip == "" {
		return ""
	}
	return fmt.Sprintf("%s:%d", d.ip, d.port)
}

func firstString(cfg map[string]any, keys ...string) string {
	for _, key := range keys {
		if v, ok := cfg[key].(string); ok {
			return strings.TrimSpace(v)
		}
	}
	return ""
}

func firstAny(cfg map[string]any, keys ...string) any {
	for _, key := range keys {
		if v, ok := cfg[key]; ok {
			return v
		}
	}
	return nil
}

func parseInt(v any, defaultVal int) int {
	switch val := v.(type) {
	case int:
		return val
	case int64:
		return int(val)
	case float64:
		return int(val)
	case string:
		if val == "" {
			return defaultVal
		}
		if n, err := strconv.Atoi(val); err == nil {
			return n
		}
	}
	return defaultVal
}

func parseDurationMs(v any, defaultVal time.Duration) time.Duration {
	switch val := v.(type) {
	case float64:
		if val <= 0 {
			return defaultVal
		}
		return time.Duration(val) * time.Millisecond
	case int:
		if val <= 0 {
			return defaultVal
		}
		return time.Duration(val) * time.Millisecond
	case int64:
		if val <= 0 {
			return defaultVal
		}
		return time.Duration(val) * time.Millisecond
	default:
		return defaultVal
	}
}
