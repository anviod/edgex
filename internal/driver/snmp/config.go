package snmp

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

type deviceConfig struct {
	SNMPVersion     string
	TargetIP        string
	TargetPort      int
	LocalPort       int
	Timeout         time.Duration
	Retries         int
	MaxBulkSize     int
	SendInterval    time.Duration
	Community       string
	SecurityName    string
	SecurityLevel   string
	AuthProtocol    string
	AuthPassword    string
	PrivProtocol    string
	PrivPassword    string
	ContextName     string
	ContextEngineID string
}

func parseDeviceConfig(raw map[string]any) deviceConfig {
	cfg := deviceConfig{
		SNMPVersion:  "v2c",
		TargetIP:     "127.0.0.1",
		TargetPort:   161,
		Timeout:      3 * time.Second,
		Retries:      3,
		MaxBulkSize:  10,
		SendInterval: 100 * time.Millisecond,
		Community:    "public",
		SecurityLevel: "authPriv",
		AuthProtocol:  "SHA256",
		PrivProtocol:  "AES128",
	}
	if raw == nil {
		return cfg
	}

	if v := stringFromAny(raw["snmpVersion"]); v != "" {
		cfg.SNMPVersion = strings.ToLower(v)
	}
	if v := firstNonEmpty(stringFromAny(raw["targetIP"]), stringFromAny(raw["ip"])); v != "" {
		cfg.TargetIP = v
	}
	cfg.TargetPort = intFromAny(firstAny(raw["targetPort"], raw["port"]), cfg.TargetPort)
	cfg.LocalPort = intFromAny(raw["localPort"], cfg.LocalPort)
	cfg.Timeout = millisFromAny(raw["timeout"], cfg.Timeout)
	cfg.Retries = intFromAny(raw["retries"], cfg.Retries)
	cfg.MaxBulkSize = intFromAny(raw["maxBulkSize"], cfg.MaxBulkSize)
	cfg.SendInterval = millisFromAny(raw["sendInterval"], cfg.SendInterval)

	if v := stringFromAny(raw["community"]); v != "" {
		cfg.Community = v
	}
	if v := stringFromAny(raw["securityName"]); v != "" {
		cfg.SecurityName = v
	}
	if v := stringFromAny(raw["securityLevel"]); v != "" {
		cfg.SecurityLevel = v
	}
	if v := stringFromAny(raw["authProtocol"]); v != "" {
		cfg.AuthProtocol = v
	}
	if v := stringFromAny(raw["authPassword"]); v != "" {
		cfg.AuthPassword = v
	}
	if v := stringFromAny(raw["privProtocol"]); v != "" {
		cfg.PrivProtocol = v
	}
	if v := stringFromAny(raw["privPassword"]); v != "" {
		cfg.PrivPassword = v
	}
	cfg.ContextName = stringFromAny(raw["contextName"])
	cfg.ContextEngineID = stringFromAny(raw["contextEngineID"])
	return cfg
}

func (c deviceConfig) remoteAddr() string {
	return fmt.Sprintf("%s:%d", c.TargetIP, c.TargetPort)
}

func (c deviceConfig) isV3() bool {
	return strings.EqualFold(c.SNMPVersion, "v3")
}

func intFromAny(v any, fallback int) int {
	switch n := v.(type) {
	case int:
		return n
	case int64:
		return int(n)
	case float64:
		return int(n)
	case string:
		if parsed, err := strconv.Atoi(n); err == nil {
			return parsed
		}
	}
	return fallback
}

func millisFromAny(v any, fallback time.Duration) time.Duration {
	n := intFromAny(v, -1)
	if n < 0 {
		return fallback
	}
	return time.Duration(n) * time.Millisecond
}

func stringFromAny(v any) string {
	switch s := v.(type) {
	case string:
		return strings.TrimSpace(s)
	case fmt.Stringer:
		return strings.TrimSpace(s.String())
	default:
		if v == nil {
			return ""
		}
		return strings.TrimSpace(fmt.Sprint(v))
	}
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if v != "" {
			return v
		}
	}
	return ""
}

func firstAny(values ...any) any {
	for _, v := range values {
		if v != nil {
			return v
		}
	}
	return nil
}
