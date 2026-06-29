package modbus

import (
	"testing"

	"github.com/anviod/edgex/internal/core"
)

func TestPlanTransportReconnect_StaleConnectedAllowsReconnect(t *testing.T) {
	cc := core.NewConnectionController("modbus", "ch-1", "modbus-tcp")
	cc.RecordConnectionSuccess()

	canRetry, wait := planTransportReconnect(cc)
	if !canRetry {
		t.Fatal("expected reconnect when transport is down but controller is Connected")
	}
	if wait != 0 {
		t.Fatalf("expected no wait for stale connected state, got %v", wait)
	}
}

func TestPlanTransportReconnect_DeadUsesCooldown(t *testing.T) {
	cc := core.NewConnectionController("modbus", "ch-1", "modbus-tcp")
	cc.SetMaxRetries(1)
	cc.RecordConnectionFailure()

	canRetry, wait := planTransportReconnect(cc)
	if !canRetry {
		t.Fatal("expected cooldown-gated retry while dead")
	}
	if wait <= 0 {
		t.Fatal("expected positive cooldown wait while controller is dead")
	}
}
