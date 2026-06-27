package core

import (
	"sync"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/storage"
)

func TestVirtualShadowEngine_CreateVirtualDevice(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "ch1.device1.temp + ch1.device2.temp",
	}

	err = vse.CreateVirtualDevice("virtual-1", "ch1", formulaPoints)
	if err != nil {
		t.Fatalf("CreateVirtualDevice failed: %v", err)
	}

	device, err := vse.GetVirtualDevice("virtual-1")
	if err != nil {
		t.Fatalf("GetVirtualDevice failed: %v", err)
	}

	if device.VirtualDeviceID != "virtual-1" {
		t.Errorf("Expected virtual-1, got %s", device.VirtualDeviceID)
	}

	if len(device.FormulaPoints) != 1 {
		t.Errorf("Expected 1 formula point, got %d", len(device.FormulaPoints))
	}

	if len(device.Dependencies) < 2 {
		t.Errorf("Expected at least 2 dependencies, got %d: %v", len(device.Dependencies), device.Dependencies)
	}
}

func TestVirtualShadowEngine_DependencyExtraction(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"sum":   "ch1.dev1.temp + ch1.dev2.humidity",
		"avg":   "(ch1.dev1.temp + ch1.dev2.temp) / 2",
		"mixed": "ch1.dev1.pressure * 2 + ch1.dev2.flow",
	}

	err = vse.CreateVirtualDevice("virtual-2", "ch1", formulaPoints)
	if err != nil {
		t.Fatalf("CreateVirtualDevice failed: %v", err)
	}

	device, _ := vse.GetVirtualDevice("virtual-2")

	expectedDeps := []string{
		"ch1.dev1.temp",
		"ch1.dev2.humidity",
		"ch1.dev2.temp",
		"ch1.dev1.pressure",
		"ch1.dev2.flow",
	}

	if len(device.Dependencies) < 4 {
		t.Errorf("Expected at least 4 dependencies, got %d: %v", len(device.Dependencies), device.Dependencies)
	}

	for _, expected := range expectedDeps {
		found := false
		for _, dep := range device.Dependencies {
			if dep == expected {
				found = true
				break
			}
		}
		if !found {
			t.Logf("Warning: expected dependency %s not found in %v", expected, device.Dependencies)
		}
	}
}

func TestVirtualShadowEngine_MapModeHyphenatedDevice(t *testing.T) {
	sc := NewShadowCore()
	vse := NewVirtualShadowEngine(sc)

	ref := "mzp8f02lusxvk0da.modbus-slave-1.hr_0"
	formulaPoints := map[string]string{
		"hr_0": ref,
	}

	if err := vse.CreateVirtualDevice("v1", "mzp8f02lusxvk0da", formulaPoints); err != nil {
		t.Fatalf("CreateVirtualDevice failed: %v", err)
	}

	device, err := vse.GetVirtualDevice("v1")
	if err != nil {
		t.Fatalf("GetVirtualDevice failed: %v", err)
	}
	if len(device.Dependencies) != 1 || device.Dependencies[0] != ref {
		t.Fatalf("expected dependency %q, got %v", ref, device.Dependencies)
	}

	sc.WriteShadowDevice(model.ShadowIngressMessage{
		DeviceID:  "modbus-slave-1",
		ChannelID: "mzp8f02lusxvk0da",
		Timestamp: time.Now(),
		Points: []model.ShadowIngressPoint{
			{PointID: "hr_0", Value: 42.0, Quality: "good"},
		},
	})

	vse.RecomputeDevice("v1")

	device, _ = vse.GetVirtualDevice("v1")
	pt, ok := device.Points["hr_0"]
	if !ok {
		t.Fatal("expected mapped point hr_0")
	}
	if pt.Value != float64(42) {
		t.Errorf("expected value 42, got %v", pt.Value)
	}
}

func TestVirtualShadowEngine_DeleteVirtualDevice(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "device1.temp + device2.temp",
	}

	vse.CreateVirtualDevice("virtual-1", "ch1", formulaPoints)

	err = vse.DeleteVirtualDevice("virtual-1")
	if err != nil {
		t.Fatalf("DeleteVirtualDevice failed: %v", err)
	}

	_, err = vse.GetVirtualDevice("virtual-1")
	if err == nil {
		t.Errorf("Expected error after deletion, got nil")
	}
}

func TestVirtualShadowEngine_UpdateFormula(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "device1.temp + device2.temp",
	}

	vse.CreateVirtualDevice("virtual-1", "ch1", formulaPoints)

	err = vse.UpdateFormula("virtual-1", "total", "device1.temp * 2")
	if err != nil {
		t.Fatalf("UpdateFormula failed: %v", err)
	}

	device, _ := vse.GetVirtualDevice("virtual-1")

	if device.FormulaPoints["total"] != "device1.temp * 2" {
		t.Errorf("Formula not updated correctly")
	}
}

func TestVirtualShadowEngine_GetDependencyGraph(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "ch1.device1.temp + ch1.device2.temp",
	}

	vse.CreateVirtualDevice("virtual-1", "ch1", formulaPoints)

	graph := vse.GetDependencyGraph()

	if len(graph) == 0 {
		t.Errorf("Expected non-empty dependency graph")
	}
}

func TestVirtualShadowEngine_GetMetrics(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "device1.temp + device2.temp",
	}

	vse.CreateVirtualDevice("virtual-1", "ch1", formulaPoints)

	metrics := vse.GetMetrics()

	if metrics["virtual_device_count"].(int) != 1 {
		t.Errorf("Expected 1 virtual device, got %d", metrics["virtual_device_count"])
	}

	if metrics["total_formulas"].(int) != 1 {
		t.Errorf("Expected 1 formula, got %d", metrics["total_formulas"])
	}
}

func TestVirtualShadowEngine_FormulaEvaluation(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	vse := NewVirtualShadowEngine(sc)

	msg := model.ShadowIngressMessage{
		MessageID: "test-msg-1",
		DeviceID:  "dev1",
		ChannelID: "ch1",
		Timestamp: time.Now(),
		Points: []model.ShadowIngressPoint{
			{PointID: "temp", Value: 25.0, Quality: "good"},
		},
	}

	sc.WriteShadowDevice(msg)

	msg2 := model.ShadowIngressMessage{
		MessageID: "test-msg-2",
		DeviceID:  "dev2",
		ChannelID: "ch1",
		Timestamp: time.Now(),
		Points: []model.ShadowIngressPoint{
			{PointID: "temp", Value: 30.0, Quality: "good"},
		},
	}

	sc.WriteShadowDevice(msg2)

	formulaPoints := map[string]string{
		"sum": "ch1.dev1.temp + ch1.dev2.temp",
	}

	vse.CreateVirtualDevice("virtual-sum", "ch1", formulaPoints)

	time.Sleep(100 * time.Millisecond)

	device, err := vse.GetVirtualDevice("virtual-sum")
	if err != nil {
		t.Fatalf("GetVirtualDevice failed: %v", err)
	}

	t.Logf("Virtual device points: %+v", device.Points)

	sumPt, ok := device.Points["sum"]
	if !ok {
		t.Fatal("expected sum point")
	}
	if sumPt.Value != float64(55) {
		t.Errorf("expected sum 55, got %v", sumPt.Value)
	}
}

func TestVirtualShadowEngine_PipelineFanOut(t *testing.T) {
	sc := NewShadowCore()
	pipeline := NewDataPipeline(20)
	pipeline.Start()

	var mu sync.Mutex
	var received []model.Value
	pipeline.AddHandler(func(v model.Value) {
		mu.Lock()
		received = append(received, v)
		mu.Unlock()
	})

	NewShadowBridge(pipeline).Attach(sc)
	vse := NewVirtualShadowEngine(sc)

	sc.WriteShadowDevice(model.ShadowIngressMessage{
		DeviceID:  "dev1",
		ChannelID: "ch1",
		Timestamp: time.Now(),
		Points:    []model.ShadowIngressPoint{{PointID: "temp", Value: 25.0, Quality: "good"}},
	})
	sc.WriteShadowDevice(model.ShadowIngressMessage{
		DeviceID:  "dev2",
		ChannelID: "ch1",
		Timestamp: time.Now(),
		Points:    []model.ShadowIngressPoint{{PointID: "temp", Value: 30.0, Quality: "good"}},
	})

	err := vse.CreateVirtualDevice("virtual-sum", "ch1", map[string]string{
		"sum": "ch1.dev1.temp + ch1.dev2.temp",
	})
	if err != nil {
		t.Fatalf("CreateVirtualDevice: %v", err)
	}

	deadline := time.Now().Add(2 * time.Second)
	var virtualSum *model.Value
	for time.Now().Before(deadline) {
		mu.Lock()
		for i := range received {
			if received[i].DeviceID == "virtual-sum" && received[i].PointID == "sum" {
				copy := received[i]
				virtualSum = &copy
				break
			}
		}
		mu.Unlock()
		if virtualSum != nil {
			break
		}
		time.Sleep(10 * time.Millisecond)
	}

	mu.Lock()
	defer mu.Unlock()
	if virtualSum == nil {
		t.Fatalf("pipeline did not receive virtual point, got %d values", len(received))
	}
	if virtualSum.ChannelID != "ch1" {
		t.Errorf("expected channel ch1, got %s", virtualSum.ChannelID)
	}
	if virtualSum.Value != float64(55) {
		t.Errorf("expected sum 55, got %v", virtualSum.Value)
	}

	vd, err := sc.GetVirtualShadowDevice("virtual-sum")
	if err != nil {
		t.Fatalf("GetVirtualShadowDevice: %v", err)
	}
	if len(vd.Points) == 0 {
		t.Error("expected virtual shadow in ShadowCore")
	}
}
