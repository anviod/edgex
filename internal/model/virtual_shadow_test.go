package model

import "testing"

func TestBuildVirtualShadowFormulas(t *testing.T) {
	formulas, err := BuildVirtualShadowFormulas([]VirtualShadowPointDef{
		{PointID: "t1", Mode: "map", SourceRef: "ch1.dev1.temp"},
		{PointID: "sum", Mode: "formula", Formula: "ch1.dev1.temp + ch1.dev2.temp"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if formulas["t1"] != "ch1.dev1.temp" {
		t.Fatalf("map formula: %v", formulas["t1"])
	}
	if formulas["sum"] != "ch1.dev1.temp + ch1.dev2.temp" {
		t.Fatalf("calc formula: %v", formulas["sum"])
	}
}

func TestMatchSearchQuery(t *testing.T) {
	if !MatchSearchQuery("modbus slave 1 pump", "pump") {
		t.Fatal("substring match")
	}
	if !MatchSearchQuery("modbus-slave-1", "ms1") {
		t.Fatal("fuzzy match")
	}
	if MatchSearchQuery("device-a", "xyz") {
		t.Fatal("should not match")
	}
	if !MatchSearchQuery("Room FC 2014", "room 2014") {
		t.Fatal("multi token match")
	}
}

func TestInferVirtualShadowChannel(t *testing.T) {
	ch := InferVirtualShadowChannel([]VirtualShadowPointDef{
		{PointID: "p1", Mode: "map", SourceRef: "ch1.dev1.temp"},
	})
	if ch != "ch1" {
		t.Fatalf("expected ch1, got %q", ch)
	}
}

func TestNormalizeVirtualShadowDevice(t *testing.T) {
	cfg := VirtualShadowDeviceConfig{
		ID: "virtual-a",
		Points: []VirtualShadowPointDef{
			{PointID: "p1", Mode: "map", SourceRef: "ch1.d1.p1"},
		},
	}
	if err := NormalizeVirtualShadowDevice(&cfg); err != nil {
		t.Fatal(err)
	}
	if cfg.Name != "virtual-a" {
		t.Fatalf("name default: %s", cfg.Name)
	}
}
