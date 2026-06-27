package knxnetip

import (
	"fmt"
	"strings"
	"time"
)

const defaultDiscoveryMulticast = "224.0.23.12:3671"

type transportConfig struct {
	ip                string
	port              int
	mode              string
	timeout           time.Duration
	maxRetries        int
	heartbeatInterval time.Duration
	localIP           string
	discovery         bool
	discoveryTimeout  time.Duration
	discoveryMulticast string
}

func parseTransportConfig(cfg map[string]any) transportConfig {
	tc := transportConfig{
		port:              defaultPort,
		mode:              "UDP",
		timeout:           3 * time.Second,
		maxRetries:        3,
		heartbeatInterval: 60 * time.Second,
	}

	if v, ok := cfg["ip"].(string); ok && v != "" {
		tc.ip = strings.TrimSpace(v)
	} else if v, ok := cfg["gatewayIP"].(string); ok && v != "" {
		tc.ip = strings.TrimSpace(v)
	} else if v, ok := cfg["discoveryIP"].(string); ok && v != "" {
		tc.ip = strings.TrimSpace(v)
	}

	tc.port = getCfgInt(cfg, "port", tc.port)
	tc.mode = strings.ToUpper(strings.TrimSpace(getCfgString(cfg, "mode", tc.mode)))
	if tc.mode == "" {
		tc.mode = "UDP"
	}

	if v, ok := cfg["timeout"]; ok {
		if d := parseDurationMs(v); d > 0 {
			tc.timeout = d
		}
	}
	if v, ok := cfg["heartbeat_interval"]; ok {
		if d := parseDurationMs(v); d > 0 {
			tc.heartbeatInterval = d
		}
	} else if v, ok := cfg["heartbeatInterval"]; ok {
		if d := parseDurationMs(v); d > 0 {
			tc.heartbeatInterval = d
		}
	}

	tc.maxRetries = getCfgInt(cfg, "max_retries", tc.maxRetries)
	if tc.maxRetries <= 0 {
		tc.maxRetries = getCfgInt(cfg, "maxRetries", tc.maxRetries)
	}

	if v, ok := cfg["local_ip"].(string); ok {
		tc.localIP = strings.TrimSpace(v)
	} else if v, ok := cfg["localIP"].(string); ok {
		tc.localIP = strings.TrimSpace(v)
	}

	if v, ok := cfg["discovery"].(bool); ok {
		tc.discovery = v
	}
	if v, ok := cfg["discovery_timeout"]; ok {
		if d := parseDurationMs(v); d > 0 {
			tc.discoveryTimeout = d
		}
	} else if v, ok := cfg["discoveryTimeout"]; ok {
		if d := parseDurationMs(v); d > 0 {
			tc.discoveryTimeout = d
		}
	}
	if tc.discoveryTimeout == 0 {
		tc.discoveryTimeout = 3 * time.Second
	}

	if v, ok := cfg["discovery_multicast"].(string); ok && strings.TrimSpace(v) != "" {
		tc.discoveryMulticast = strings.TrimSpace(v)
	} else if v, ok := cfg["discoveryMulticast"].(string); ok && strings.TrimSpace(v) != "" {
		tc.discoveryMulticast = strings.TrimSpace(v)
	}
	if tc.discoveryMulticast == "" {
		tc.discoveryMulticast = defaultDiscoveryMulticast
	}

	return tc
}

func (tc transportConfig) remoteAddr() string {
	if tc.ip == "" {
		return ""
	}
	return fmt.Sprintf("%s:%d", tc.ip, tc.port)
}

func (tc transportConfig) isTCP() bool {
	return tc.mode == "TCP"
}

func getCfgString(cfg map[string]any, key, defaultVal string) string {
	if v, ok := cfg[key].(string); ok && v != "" {
		return v
	}
	return defaultVal
}

func parseDurationMs(v any) time.Duration {
	switch val := v.(type) {
	case float64:
		return time.Duration(val) * time.Millisecond
	case int:
		return time.Duration(val) * time.Millisecond
	case int64:
		return time.Duration(val) * time.Millisecond
	case string:
		if d, err := time.ParseDuration(val); err == nil {
			return d
		}
	}
	return 0
}

func getCfgInt(cfg map[string]any, key string, defaultVal int) int {
	if v, ok := cfg[key]; ok {
		switch val := v.(type) {
		case float64:
			return int(val)
		case int:
			return val
		case int64:
			return int(val)
		case string:
			var n int
			if _, err := fmt.Sscanf(val, "%d", &n); err == nil {
				return n
			}
		}
	}
	return defaultVal
}
