package model

import "strings"

// MergeOPCUAConfig merges incoming OPC UA config with existing stored secrets/certs.
func MergeOPCUAConfig(existing, incoming OPCUAConfig) OPCUAConfig {
	out := incoming
	if strings.TrimSpace(out.ServerKeyPEM) == "" {
		out.ServerKeyPEM = existing.ServerKeyPEM
	}
	if strings.TrimSpace(out.ServerCertPEM) == "" {
		out.ServerCertPEM = existing.ServerCertPEM
	}
	if len(out.TrustedCertsPEM) == 0 && len(existing.TrustedCertsPEM) > 0 {
		out.TrustedCertsPEM = append([]string(nil), existing.TrustedCertsPEM...)
	}
	return out
}

// SanitizeOPCUAForClient strips sensitive PEM material before API responses.
func SanitizeOPCUAForClient(cfg OPCUAConfig) OPCUAConfig {
	out := cfg
	out.HasServerCert = strings.TrimSpace(out.ServerCertPEM) != ""
	out.HasServerKey = strings.TrimSpace(out.ServerKeyPEM) != ""
	out.ServerKeyPEM = ""
	return out
}

// SanitizeNorthboundForClient redacts secrets from northbound config API responses.
func SanitizeNorthboundForClient(cfg NorthboundConfig) NorthboundConfig {
	out := cfg
	for i := range out.OPCUA {
		out.OPCUA[i] = SanitizeOPCUAForClient(out.OPCUA[i])
	}
	return out
}
