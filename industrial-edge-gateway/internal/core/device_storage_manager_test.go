package core

import (
	"industrial-edge-gateway/internal/model"
	"industrial-edge-gateway/internal/storage"
	"os"
	"testing"
	"time"
)

func TestDeviceStorageManager_Interval(t *testing.T) {
	// Setup temporary DB
	tmpFile := "test_device_storage.db"
	os.Remove(tmpFile)
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	// Setup Pipeline
	pipeline := NewDataPipeline(10)
	pipeline.Start()

	// Setup Manager
	dsm := NewDeviceStorageManager(store, pipeline)

	// Configure Device: Interval 1 second (mocking minute as second for test? No, logic uses Minute)
	// We need to mock time or wait. Waiting 1 minute is too long.
	// We can cheat by using a very short interval if we can, but logic multiplies by Minute.
	// dsm.UpdateDeviceConfig uses: time.Duration(cfg.Interval) * time.Minute
	// So minimum is 1 Minute.

	// Alternative: Test "Realtime" which is immediate.
	// Or modify dsm to allow custom duration unit for testing?
	// Or just test saveSnapshot directly?

	// Let's test Realtime first as it's easier.
	deviceID := "dev1"
	dsm.UpdateDeviceConfig(deviceID, model.DeviceStorage{
		Enable:     true,
		Strategy:   "realtime",
		MaxRecords: 5,
	})

	// Push values
	pipeline.Push(model.Value{DeviceID: deviceID, PointID: "p1", Value: 100})
	time.Sleep(10 * time.Millisecond)
	pipeline.Push(model.Value{DeviceID: deviceID, PointID: "p2", Value: 200})

	// Wait for async save
	time.Sleep(500 * time.Millisecond)

	// Verify history
	history, err := dsm.GetHistory(deviceID, 10)
	if err != nil {
		t.Fatalf("Failed to get history: %v", err)
	}
	t.Logf("History records: %d", len(history))

	// We pushed 2 values. "Realtime" saves on every update.
	// So we should have 2 records?
	// Record 1: {p1: 100} (p2 unknown yet)
	// Record 2: {p1: 100, p2: 200}

	if len(history) < 2 {
		t.Errorf("Expected at least 2 records, got %d", len(history))
	}

	// LoadLatest returns latest first (records[0] is newest)
	lastRec := history[0]
	data := lastRec["data"].(map[string]interface{})
	if data["p1"].(float64) != 100 || data["p2"].(float64) != 200 {
		t.Errorf("Last record data mismatch: %v", data)
	}
}

func TestDeviceStorageManager_Prune(t *testing.T) {
	// Setup temporary DB
	tmpFile := "test_device_storage_prune.db"
	os.Remove(tmpFile)
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	pipeline := NewDataPipeline(10)
	pipeline.Start()
	dsm := NewDeviceStorageManager(store, pipeline)

	deviceID := "dev_prune"
	maxRecords := 3
	dsm.UpdateDeviceConfig(deviceID, model.DeviceStorage{
		Enable:     true,
		Strategy:   "realtime",
		MaxRecords: maxRecords,
	})

	// Push 5 values
	for i := 0; i < 5; i++ {
		pipeline.Push(model.Value{DeviceID: deviceID, PointID: "p1", Value: i})
		time.Sleep(10 * time.Millisecond) // Ensure timestamps differ
	}

	// Wait for async processing
	time.Sleep(500 * time.Millisecond)

	// Verify count
	history, err := dsm.GetHistory(deviceID, 100)
	if err != nil {
		t.Fatalf("Failed to get history: %v", err)
	}
	t.Logf("Prune History records: %d", len(history))

	if len(history) != maxRecords {
		t.Errorf("Expected %d records, got %d", maxRecords, len(history))
	}

	if len(history) == 0 {
		t.Fatal("History is empty")
	}

	// Verify we have the latest (2, 3, 4)
	// records[0] is newest (4)
	lastRec := history[0]
	data := lastRec["data"].(map[string]interface{})
	if val, ok := data["p1"].(float64); !ok || int(val) != 4 {
		t.Errorf("Expected newest value 4, got %v", data["p1"])
	}
}

func TestDeviceStorageManager_SnapshotMerge(t *testing.T) {
	// Setup temporary DB
	tmpFile := "test_device_storage_merge.db"
	os.Remove(tmpFile)
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	pipeline := NewDataPipeline(10)
	dsm := NewDeviceStorageManager(store, pipeline)

	deviceID := "dev_merge"
	// No auto save (Strategy empty or interval but we won't wait)
	// We will trigger saveSnapshot manually if we could, but it's private.
	// So we use Realtime but control the flow.
	dsm.UpdateDeviceConfig(deviceID, model.DeviceStorage{
		Enable:     true,
		Strategy:   "realtime",
		MaxRecords: 10,
	})

	// 1. Push p1=1
	dsm.handleValue(model.Value{DeviceID: deviceID, PointID: "p1", Value: 1})
	time.Sleep(10 * time.Millisecond)

	// 2. Push p2=2
	dsm.handleValue(model.Value{DeviceID: deviceID, PointID: "p2", Value: 2})
	time.Sleep(10 * time.Millisecond)

	// 3. Push p1=3 (Update p1)
	dsm.handleValue(model.Value{DeviceID: deviceID, PointID: "p1", Value: 3})
	time.Sleep(10 * time.Millisecond)

	history, _ := dsm.GetHistory(deviceID, 10)

	// Record 3 (Newest): {p1:3, p2:2} -> history[0]
	// Record 2: {p1:1, p2:2} -> history[1]
	// Record 1: {p1:1} -> history[2]

	if len(history) != 3 {
		t.Errorf("Expected 3 records, got %d", len(history))
	}

	last := history[0]["data"].(map[string]interface{})
	if last["p1"].(float64) != 3 || last["p2"].(float64) != 2 {
		t.Errorf("Merge logic failed: %v", last)
	}
}

func TestDeviceStorageManager_StrategySwitch(t *testing.T) {
	// Setup temporary DB
	tmpFile := "test_device_storage_switch.db"
	os.Remove(tmpFile)
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	pipeline := NewDataPipeline(10)
	dsm := NewDeviceStorageManager(store, pipeline)

	deviceID := "dev_switch"

	// 1. Start with Realtime
	dsm.UpdateDeviceConfig(deviceID, model.DeviceStorage{
		Enable:     true,
		Strategy:   "realtime",
		MaxRecords: 10,
	})

	dsm.handleValue(model.Value{DeviceID: deviceID, PointID: "p1", Value: 1})
	time.Sleep(100 * time.Millisecond)

	history, _ := dsm.GetHistory(deviceID, 10)
	if len(history) != 1 {
		t.Errorf("Expected 1 record in realtime mode, got %d", len(history))
	}

	// 2. Switch to Interval (1 minute)
	dsm.UpdateDeviceConfig(deviceID, model.DeviceStorage{
		Enable:     true,
		Strategy:   "interval",
		Interval:   1,
		MaxRecords: 10,
	})

	dsm.handleValue(model.Value{DeviceID: deviceID, PointID: "p1", Value: 2})
	time.Sleep(100 * time.Millisecond)

	history, _ = dsm.GetHistory(deviceID, 10)
	if len(history) != 1 {
		t.Errorf("Expected still 1 record after switching to interval (should not save immediately), got %d", len(history))
	}

	// 3. Switch back to Realtime
	dsm.UpdateDeviceConfig(deviceID, model.DeviceStorage{
		Enable:     true,
		Strategy:   "realtime",
		MaxRecords: 10,
	})

	dsm.handleValue(model.Value{DeviceID: deviceID, PointID: "p1", Value: 3})
	time.Sleep(100 * time.Millisecond)

	history, _ = dsm.GetHistory(deviceID, 10)
	if len(history) != 2 {
		t.Errorf("Expected 2 records after switching back to realtime, got %d", len(history))
	}
}

func TestDeviceStorageManager_Interval_Execution(t *testing.T) {
	// Setup temporary DB
	tmpFile := "test_device_storage_interval.db"
	os.Remove(tmpFile)
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	pipeline := NewDataPipeline(10)
	dsm := NewDeviceStorageManager(store, pipeline)

	// Override interval unit to 100ms for testing
	dsm.intervalUnit = 100 * time.Millisecond

	deviceID := "dev_interval"

	// Configure Interval Strategy: 1 unit (100ms)
	dsm.UpdateDeviceConfig(deviceID, model.DeviceStorage{
		Enable:     true,
		Strategy:   "interval",
		Interval:   1, // 1 * 100ms
		MaxRecords: 10,
	})

	// Push value
	dsm.handleValue(model.Value{DeviceID: deviceID, PointID: "p1", Value: 1})

	// Should not save immediately
	time.Sleep(50 * time.Millisecond)
	history, _ := dsm.GetHistory(deviceID, 10)
	if len(history) != 0 {
		t.Errorf("Expected 0 records before interval, got %d", len(history))
	}

	// Wait for interval (100ms) + buffer
	time.Sleep(100 * time.Millisecond)

	history, _ = dsm.GetHistory(deviceID, 10)
	if len(history) != 1 {
		t.Errorf("Expected 1 record after interval, got %d", len(history))
	}

	// Push another value
	dsm.handleValue(model.Value{DeviceID: deviceID, PointID: "p1", Value: 2})

	// Wait another interval
	time.Sleep(150 * time.Millisecond)

	history, _ = dsm.GetHistory(deviceID, 10)
	if len(history) != 2 {
		t.Errorf("Expected 2 records after second interval, got %d", len(history))
	}

	// Cleanup to stop ticker
	dsm.RemoveDevice(deviceID)
}
