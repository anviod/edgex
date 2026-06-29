package model

import (
	"strings"
	"testing"
)

func TestIsEndpointLikeDeviceID(t *testing.T) {
	tests := []struct {
		id   string
		want bool
	}{
		{"opc.tcp://localhost:4840", true},
		{"opc.tcp://host:53530/OPCUA/SimulationServer", true},
		{"http://example.com", true},
		{"bacnet-123", false},
		{"u3rellnz1jgz0ljg", false},
		{"", false},
	}
	for _, tt := range tests {
		if got := IsEndpointLikeDeviceID(tt.id); got != tt.want {
			t.Fatalf("IsEndpointLikeDeviceID(%q) = %v, want %v", tt.id, got, tt.want)
		}
	}
}

func TestNormalizeOpcUaDeviceID_ReplacesEndpointLikeID(t *testing.T) {
	dev := &Device{
		ID:   "opc.tcp://LAPTOP:53530/OPCUA/SimulationServer",
		Name: "Simulation Server",
		Config: map[string]any{
			"endpoint": "opc.tcp://LAPTOP:53530/OPCUA/SimulationServer",
		},
	}
	NormalizeOpcUaDeviceID(dev)
	if dev.ID == "" {
		t.Fatal("expected generated ID")
	}
	if IsEndpointLikeDeviceID(dev.ID) {
		t.Fatalf("generated ID must not look like endpoint: %q", dev.ID)
	}
	if len(dev.ID) != 16 {
		t.Fatalf("expected 16-char ID, got %q", dev.ID)
	}
}

func TestNormalizeOpcUaDeviceID_PreservesExplicitID(t *testing.T) {
	dev := &Device{
		ID:   "my-opcua-device",
		Name: "Sensor",
		Config: map[string]any{
			"endpoint": "opc.tcp://localhost:4840",
		},
	}
	NormalizeOpcUaDeviceID(dev)
	if dev.ID != "my-opcua-device" {
		t.Fatalf("expected ID preserved, got %q", dev.ID)
	}
}

func TestNormalizeOpcUaDeviceID_GeneratesWhenEmpty(t *testing.T) {
	dev := &Device{Name: "OPC UA Server"}
	NormalizeOpcUaDeviceID(dev)
	if strings.TrimSpace(dev.ID) == "" {
		t.Fatal("expected generated ID for empty device ID")
	}
}

func TestGenerateShortID_LengthAndCharset(t *testing.T) {
	id := GenerateShortID(16)
	if len(id) != 16 {
		t.Fatalf("expected length 16, got %d", len(id))
	}
	for _, ch := range id {
		if !strings.ContainsRune(shortIDAlphabet, ch) {
			t.Fatalf("unexpected character %q in %q", ch, id)
		}
	}
}
