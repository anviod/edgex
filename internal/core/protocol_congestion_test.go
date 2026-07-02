package core

import "testing"

func TestProtocolCongestionGroup(t *testing.T) {
	cases := map[string]string{
		"modbus-tcp":        "modbus",
		"modbus-rtu":        "modbus",
		"opc-ua":            "opcua",
		"opcua":             "opcua",
		"s7":                "s7",
		"s7-1500":           "s7",
		"bacnet-ip":         "default",
	}
	for protocol, want := range cases {
		if got := protocolCongestionGroup(protocol); got != want {
			t.Fatalf("protocolCongestionGroup(%q) = %q, want %q", protocol, got, want)
		}
	}
}

func TestProtocolCongestionController_IndependentBuckets(t *testing.T) {
	pc := NewProtocolCongestionController()

	if !pc.Allow("modbus-tcp") {
		t.Fatal("expected modbus bucket to allow first request")
	}
	if !pc.Allow("opc-ua") {
		t.Fatal("expected opcua bucket to allow first request")
	}
	if !pc.Allow("s7") {
		t.Fatal("expected s7 bucket to allow first request")
	}
}

func TestProtocolCongestionController_NilSafe(t *testing.T) {
	var pc *ProtocolCongestionController
	if !pc.Allow("modbus-tcp") {
		t.Fatal("nil controller should allow")
	}
}
