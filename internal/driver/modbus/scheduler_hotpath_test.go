package modbus

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
)

func TestPointScheduler_markPointFailed_IllegalAddress(t *testing.T) {
	s := NewPointScheduler(newMockModbusTransport(), NewPointDecoder("ABCD", 0, 0), 256, 8, 0)
	s.pointStates["pt-1"] = &PointRuntime{State: "OK"}

	s.markPointFailed("pt-1", errors.New("modbus exception 2: illegal data address"))
	rt := s.pointStates["pt-1"]
	if rt.State != "SKIPPED" {
		t.Fatalf("state = %q, want SKIPPED", rt.State)
	}
	if rt.CooldownUntil.Before(time.Now().Add(23 * time.Hour)) {
		t.Fatal("expected long cooldown for illegal address")
	}
}

func TestPointScheduler_markPointFailed_RepeatedFailures(t *testing.T) {
	s := NewPointScheduler(newMockModbusTransport(), NewPointDecoder("ABCD", 0, 0), 256, 8, 0)
	s.pointStates["pt-2"] = &PointRuntime{State: "OK", FailCount: 2}

	s.markPointFailed("pt-2", errors.New("timeout"))
	rt := s.pointStates["pt-2"]
	if rt.FailCount != 3 {
		t.Fatalf("fail count = %d, want 3", rt.FailCount)
	}
	if rt.State != "SKIPPED" {
		t.Fatalf("state = %q, want SKIPPED after 3 failures", rt.State)
	}
}

func TestPointScheduler_readGroup_HoldingRegisters(t *testing.T) {
	tr := newMockModbusTransport()
	_ = tr.Connect(context.Background())
	tr.registers[0] = 0x1234
	tr.registers[1] = 0x5678

	s := NewPointScheduler(tr, NewPointDecoder("ABCD", 0, 0), 256, 8, 0)
	group := PointGroup{
		RegType:     model.RegHolding,
		StartOffset: 0,
		Count:       2,
		Points: []model.Point{
			{ID: "hr-0", Address: "40001", DataType: "uint16", RegisterType: model.RegHolding},
			{ID: "hr-1", Address: "40002", DataType: "uint16", RegisterType: model.RegHolding},
		},
	}

	out, err := s.readGroup(context.Background(), group)
	if err != nil {
		t.Fatalf("readGroup: %v", err)
	}
	if len(out) != 2 {
		t.Fatalf("results = %+v", out)
	}
}

func TestPointScheduler_readGroup_Coil(t *testing.T) {
	tr := newMockModbusTransport()
	_ = tr.Connect(context.Background())
	tr.coil[5] = true

	s := NewPointScheduler(tr, NewPointDecoder("ABCD", 0, 0), 256, 8, 0)
	group := PointGroup{
		RegType:     model.RegCoil,
		StartOffset: 5,
		Count:       1,
		Points:      []model.Point{{ID: "coil-5", Address: "00006", DataType: "bool", RegisterType: model.RegCoil}},
	}

	out, err := s.readGroup(context.Background(), group)
	if err != nil {
		t.Fatalf("readGroup coil: %v", err)
	}
	if out["coil-5"] != true {
		t.Fatalf("coil value = %v", out["coil-5"])
	}
}
