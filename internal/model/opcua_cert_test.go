package model

import "testing"

func TestMergeOPCUAConfigPreservesSecrets(t *testing.T) {
	existing := OPCUAConfig{
		ServerCertPEM:   "-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----\n",
		ServerKeyPEM:    "-----BEGIN PRIVATE KEY-----\nkey\n-----END PRIVATE KEY-----\n",
		TrustedCertsPEM: []string{"trusted-a"},
		Name:            "old",
	}
	incoming := OPCUAConfig{
		ID:   "1",
		Name: "new",
	}

	out := MergeOPCUAConfig(existing, incoming)
	if out.ServerCertPEM != existing.ServerCertPEM {
		t.Fatalf("expected cert preserved")
	}
	if out.ServerKeyPEM != existing.ServerKeyPEM {
		t.Fatalf("expected key preserved")
	}
	if len(out.TrustedCertsPEM) != 1 || out.TrustedCertsPEM[0] != "trusted-a" {
		t.Fatalf("expected trusted certs preserved, got %#v", out.TrustedCertsPEM)
	}
	if out.Name != "new" {
		t.Fatalf("expected name updated")
	}
}

func TestSanitizeOPCUAForClient(t *testing.T) {
	cfg := OPCUAConfig{
		ServerCertPEM: "cert",
		ServerKeyPEM:  "secret-key",
	}
	out := SanitizeOPCUAForClient(cfg)
	if out.ServerKeyPEM != "" {
		t.Fatalf("private key must be stripped")
	}
	if !out.HasServerCert || !out.HasServerKey {
		t.Fatalf("expected has flags set")
	}
}
