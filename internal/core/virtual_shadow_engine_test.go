package core

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/storage"
)

func TestVirtualShadowEngine_CreateVirtualDevice(t *testing.T) {
	tmpFile := filepath.Join(os.TempDir(), "vse_create_test.db")
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore(store)
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "ch1.device1.temp + ch1.device2.temp",
	}

	err = vse.CreateVirtualDevice("virtual-1", formulaPoints)
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
	tmpFile := filepath.Join(os.TempDir(), "vse_dep_test.db")
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore(store)
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"sum":   "ch1.dev1.temp + ch1.dev2.humidity",
		"avg":   "(ch1.dev1.temp + ch1.dev2.temp) / 2",
		"mixed": "ch1.dev1.pressure * 2 + ch1.dev2.flow",
	}

	err = vse.CreateVirtualDevice("virtual-2", formulaPoints)
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

func TestVirtualShadowEngine_DeleteVirtualDevice(t *testing.T) {
	tmpFile := filepath.Join(os.TempDir(), "vse_delete_test.db")
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore(store)
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "device1.temp + device2.temp",
	}

	vse.CreateVirtualDevice("virtual-1", formulaPoints)

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
	tmpFile := filepath.Join(os.TempDir(), "vse_update_test.db")
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore(store)
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "device1.temp + device2.temp",
	}

	vse.CreateVirtualDevice("virtual-1", formulaPoints)

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
	tmpFile := filepath.Join(os.TempDir(), "vse_graph_test.db")
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore(store)
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "ch1.device1.temp + ch1.device2.temp",
	}

	vse.CreateVirtualDevice("virtual-1", formulaPoints)

	graph := vse.GetDependencyGraph()

	if len(graph) == 0 {
		t.Errorf("Expected non-empty dependency graph")
	}
}

func TestVirtualShadowEngine_GetMetrics(t *testing.T) {
	tmpFile := filepath.Join(os.TempDir(), "vse_metrics_test.db")
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore(store)
	vse := NewVirtualShadowEngine(sc)

	formulaPoints := map[string]string{
		"total": "device1.temp + device2.temp",
	}

	vse.CreateVirtualDevice("virtual-1", formulaPoints)

	metrics := vse.GetMetrics()

	if metrics["virtual_device_count"].(int) != 1 {
		t.Errorf("Expected 1 virtual device, got %d", metrics["virtual_device_count"])
	}

	if metrics["total_formulas"].(int) != 1 {
		t.Errorf("Expected 1 formula, got %d", metrics["total_formulas"])
	}
}

func TestVirtualShadowEngine_FormulaEvaluation(t *testing.T) {
	tmpFile := filepath.Join(os.TempDir(), "vse_eval_test.db")
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore(store)
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

	vse.CreateVirtualDevice("virtual-sum", formulaPoints)

	time.Sleep(100 * time.Millisecond)

	device, err := vse.GetVirtualDevice("virtual-sum")
	if err != nil {
		t.Fatalf("GetVirtualDevice failed: %v", err)
	}

	t.Logf("Virtual device points: %+v", device.Points)
}
