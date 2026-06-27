package mitsubishi

import (
	"fmt"
	"strings"
	"time"
)

type driverConfig struct {
	ip          string
	port        int
	networkNo   int
	pcNo        int
	stationNo   int
	frameType   string // "3E" or "4E" (4E falls back to 3E for now)
	timeout     time.Duration
	maxRetries  int
	batchReadMax int
}

func parseDriverConfig(cfg map[string]any) (driverConfig, error) {
	if cfg == nil {
		cfg = map[string]any{}
	}

	ip, _ := cfg["ip"].(string)
	ip = strings.TrimSpace(ip)

	dc := driverConfig{
		ip:           ip,
		port:         getCfgInt(cfg, "port", 5000),
		networkNo:    getCfgInt(cfg, "network_no", 0),
		pcNo:         getCfgInt(cfg, "pc_no", 0xFF),
		stationNo:    getCfgInt(cfg, "station_no", 0),
		frameType:    strings.ToUpper(strings.TrimSpace(getCfgString(cfg, "frame_type", "3E"))),
		timeout:      time.Duration(getCfgInt(cfg, "timeout", 3000)) * time.Millisecond,
		maxRetries:   getCfgInt(cfg, "max_retries", 2),
		batchReadMax: getCfgInt(cfg, "batch_read_max", 64),
	}

	if dc.batchReadMax < 1 {
		dc.batchReadMax = 1
	}
	if dc.batchReadMax > 960 {
		dc.batchReadMax = 960
	}

	return dc, nil
}

func getCfgInt(cfg map[string]any, key string, defaultVal int) int {
	v, ok := cfg[key]
	if !ok {
		return defaultVal
	}
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
	return defaultVal
}

func getCfgString(cfg map[string]any, key, defaultVal string) string {
	v, ok := cfg[key]
	if !ok {
		return defaultVal
	}
	if s, ok := v.(string); ok {
		return s
	}
	return defaultVal
}

func remoteAddrFromConfig(cfg map[string]any) string {
	if cfg == nil {
		return ""
	}
	ip, _ := cfg["ip"].(string)
	if ip == "" {
		return ""
	}
	port := getCfgInt(cfg, "port", 5000)
	return fmt.Sprintf("%s:%d", ip, port)
}
