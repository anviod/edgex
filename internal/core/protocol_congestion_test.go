package core

import "testing"

func TestProtocolCongestionGroup(t *testing.T) {
	cases := map[string]string{
		"modbus-tcp": "modbus",
		"modbus-rtu": "modbus",
		"opc-ua":     "opcua",
		"opcua":      "opcua",
		"s7":         "s7",
		"s7-1500":    "s7",
		"bacnet-ip":  "default",
	}
	for protocol, want := range cases {
		if got := protocolCongestionGroup(protocol); got != want {
			t.Fatalf("protocolCongestionGroup(%q) = %q, want %q", protocol, got, want)
		}
	}
}

func TestBackpressureController_UnifiedAllowOrder(t *testing.T) {
	bc := NewBackpressureController(512, 1000)

	ok, reason := bc.AllowWithReason(ThrottleContext{
		DeviceKey:   "dev-1",
		Protocol:    "modbus-tcp",
		DeviceLimit: 8,
	})
	if !ok || reason != RejectNone {
		t.Fatalf("first allow = (%v, %q), want (true, \"\")", ok, reason)
	}
	bc.Release("dev-1")

	ok, reason = bc.AllowWithReason(ThrottleContext{
		DeviceKey:   "dev-2",
		Protocol:    "opc-ua",
		DeviceLimit: 8,
	})
	if !ok || reason != RejectNone {
		t.Fatalf("opc-ua allow = (%v, %q)", ok, reason)
	}
	bc.Release("dev-2")
}

func TestBackpressureController_RejectByReason(t *testing.T) {
	bc := NewBackpressureController(1, 1000)

	if !bc.Allow("dev-1", 1) {
		t.Fatal("first request should be allowed")
	}
	if bc.Allow("dev-2", 1) {
		t.Fatal("second request should be rejected by global limit")
	}

	reasons := bc.RejectByReason()
	if reasons[string(RejectGlobalSemaphore)] == 0 {
		t.Fatal("expected global_semaphore reject metric")
	}
}

func TestProtocolCongestionController_NilSafe(t *testing.T) {
	var pc *ProtocolCongestionController
	if !pc.Allow("modbus-tcp") {
		t.Fatal("nil controller should allow")
	}
}

func TestProtocolCongestionRate(t *testing.T) {
	cases := map[string]float64{
		"modbus":  protocolCongestionModbusRate,
		"opcua":   protocolCongestionOpcuaRate,
		"s7":      protocolCongestionS7Rate,
		"default": protocolCongestionDefaultRate,
		"unknown": protocolCongestionDefaultRate,
	}
	for group, want := range cases {
		if got := protocolCongestionRate(group); got != want {
			t.Fatalf("protocolCongestionRate(%q) = %v, want %v", group, got, want)
		}
	}
}

func TestProtocolCongestionController_Allow(t *testing.T) {
	pc := NewProtocolCongestionController()
	protocols := []string{"modbus-tcp", "opc-ua", "s7", "bacnet-ip"}
	for _, p := range protocols {
		if !pc.Allow(p) {
			t.Fatalf("Allow(%q) should succeed on fresh bucket", p)
		}
	}
	if pc.RejectTotal() != 0 {
		t.Fatalf("RejectTotal = %d, want 0", pc.RejectTotal())
	}
}
