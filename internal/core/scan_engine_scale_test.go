package core

import (
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
)

func TestScanEngine_EventDrivenDispatch(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{
		TickInterval: 50 * time.Millisecond,
		WorkerCount:  4,
		MaxQueueSize: 1000,
	})
	task := se.AddTask("dev-1", "modbus-tcp", 20*time.Millisecond, 5, []string{"p1"}, nil)
	se.RegisterDriver("dev-1", &mockStressDriver{})
	se.Run()

	deadline := time.Now().Add(500 * time.Millisecond)
	for time.Now().Before(deadline) {
		if task.ConsecutiveSuccess > 0 {
			break
		}
		time.Sleep(10 * time.Millisecond)
	}
	se.Stop()

	if task.ConsecutiveSuccess == 0 {
		t.Fatal("expected at least one successful execution via event-driven dispatch")
	}
}

func TestScanEngine_ScanClassTasks(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{TickInterval: 10 * time.Millisecond, WorkerCount: 2, MaxQueueSize: 100})
	points := []model.Point{
		{ID: "fast1", ScanClass: model.ScanClassFast},
		{ID: "slow1", ScanClass: model.ScanClassSlow},
	}
	params := map[string]any{"points": points, "degradeOnFailure": false}
	se.AddTaskWithScanClass("dev-1", "modbus-tcp", model.ScanClassFast, 100*time.Millisecond, 5, []string{"fast1"}, params)
	se.AddTaskWithScanClass("dev-1", "modbus-tcp", model.ScanClassSlow, 10*time.Second, 5, []string{"slow1"}, params)

	tasks := se.GetTasksByDeviceKey("dev-1")
	if len(tasks) != 2 {
		t.Fatalf("expected 2 scan class tasks, got %d", len(tasks))
	}
}

func TestScanEngine_TenThousandTagsBenchmark(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping 10k tag benchmark in short mode")
	}

	const devices = 100
	const pointsPerDevice = 100

	se := NewScanEngine(ScanEngineConfig{
		TickInterval:      10 * time.Millisecond,
		WorkerCount:       32,
		MaxQueueSize:      50000,
		AntiStarvationSec: 300,
		GoroutineLimit:    512,
		ConnectionLimit:   200,
	})
	se.RegisterProtocol("modbus-tcp", ProtocolTypeParallel)

	start := time.Now()
	for i := 0; i < devices; i++ {
		deviceKey := "scale_dev_" + string(rune('A'+i%26)) + "_" + string(rune('0'+i/26%10))
		pointIDs := make([]string, pointsPerDevice)
		for j := 0; j < pointsPerDevice; j++ {
			pointIDs[j] = "p" + string(rune('0'+j%10))
		}
		se.AddTask(deviceKey, "modbus-tcp", 200*time.Millisecond, 3, pointIDs, nil)
		se.RegisterDriver(deviceKey, &mockStressDriver{})
	}
	registerDuration := time.Since(start)

	se.Run()
	time.Sleep(3 * time.Second)

	if se.GetMetrics() != nil {
		t.Logf("scan engine metrics: %+v", se.GetMetrics().Snapshot())
	}
	se.Stop()

	t.Logf("10k Tag scale test: devices=%d points=%d register=%v tasks=%d",
		devices, devices*pointsPerDevice, registerDuration, len(se.GetTasks()))
}
