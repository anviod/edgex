package omron

import (
	"fmt"
	"strings"
)

func toFinsLibConfig(cfg map[string]any) map[string]interface{} {
	out := make(map[string]interface{}, len(cfg)+4)
	for k, v := range cfg {
		out[k] = v
	}

	if ip, ok := cfg["plcIP"].(string); ok && ip != "" {
		out["plcIP"] = ip
	} else if ip, ok := cfg["ip"].(string); ok && ip != "" {
		out["plcIP"] = ip
	}

	if port, ok := cfg["plcPort"]; ok {
		out["plcPort"] = port
	} else if port, ok := cfg["port"]; ok {
		out["plcPort"] = port
	}

	if timeout, ok := cfg["timeout"]; ok {
		out["timeout"] = timeout
	}
	if v, ok := cfg["maxFrameLength"]; ok {
		out["maxFrameLength"] = v
	}
	if v, ok := cfg["heartbeatInterval"]; ok {
		out["heartbeatInterval"] = v
	} else if v, ok := cfg["heartbeat_interval"]; ok {
		out["heartbeatInterval"] = v
	}
	if v, ok := cfg["maxRetries"]; ok {
		out["maxRetries"] = v
	} else if v, ok := cfg["max_retries"]; ok {
		out["maxRetries"] = v
	}
	if v, ok := cfg["retryInterval"]; ok {
		out["retryInterval"] = v
	} else if v, ok := cfg["retry_interval"]; ok {
		out["retryInterval"] = v
	}
	if v, ok := cfg["minInterval"]; ok {
		out["minInterval"] = v
	} else if v, ok := cfg["min_interval"]; ok {
		out["minInterval"] = v
	}

	mapAddrKey(out, cfg, "srcNetworkAddr", "src_network_addr")
	mapAddrKey(out, cfg, "srcNodeAddr", "src_node_addr")
	mapAddrKey(out, cfg, "srcUnitAddr", "src_unit_addr")
	mapAddrKey(out, cfg, "dstNetworkAddr", "dst_network_addr")
	mapAddrKey(out, cfg, "dstNodeAddr", "dst_node_addr")
	mapAddrKey(out, cfg, "dstUnitAddr", "dst_unit_addr")

	return out
}

func mapAddrKey(out, cfg map[string]any, primary, alt string) {
	if v, ok := cfg[primary]; ok {
		out[primary] = v
		return
	}
	if v, ok := cfg[alt]; ok {
		out[primary] = v
	}
}

func transportMode(cfg map[string]any) string {
	mode, _ := cfg["mode"].(string)
	if mode == "" {
		mode, _ = cfg["protocol_mode"].(string)
	}
	mode = strings.ToUpper(strings.TrimSpace(mode))
	if mode == "" {
		return "TCP"
	}
	return mode
}

func remoteAddrFromConfig(cfg map[string]any) string {
	ip := ""
	if v, ok := cfg["plcIP"].(string); ok && v != "" {
		ip = v
	} else if v, ok := cfg["ip"].(string); ok && v != "" {
		ip = v
	}
	if ip == "" {
		return ""
	}

	port := 9600
	if p, ok := cfg["plcPort"].(float64); ok {
		port = int(p)
	} else if p, ok := cfg["plcPort"].(int); ok {
		port = p
	} else if p, ok := cfg["port"].(float64); ok {
		port = int(p)
	} else if p, ok := cfg["port"].(int); ok {
		port = p
	}
	return fmt.Sprintf("%s:%d", ip, port)
}

func configInt(cfg map[string]any, keys ...string) int {
	for _, key := range keys {
		switch v := cfg[key].(type) {
		case float64:
			return int(v)
		case int:
			return v
		case int64:
			return int(v)
		}
	}
	return 0
}

func configByte(cfg map[string]any, keys ...string) byte {
	v := configInt(cfg, keys...)
	if v < 0 {
		return 0
	}
	if v > 255 {
		return 255
	}
	return byte(v)
}
