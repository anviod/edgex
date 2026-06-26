package core

import (
	"sync"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/storage"
)

// TestShadowPipelineIntegration 验证 Shadow → Pipeline → 单值/批量 handler 四路扇出。
func TestShadowPipelineIntegration(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	pipeline := NewDataPipeline(100)

	var mu sync.Mutex
	var singleReceived []model.Value
	var batchReceived []model.Value

	pipeline.AddHandler(func(v model.Value) {
		mu.Lock()
		singleReceived = append(singleReceived, v)
		mu.Unlock()
	})
	pipeline.AddBatchHandler(func(batch []model.Value) {
		mu.Lock()
		batchReceived = append(batchReceived, batch...)
		mu.Unlock()
	})
	pipeline.Start()

	NewShadowBridge(pipeline).Attach(sc)

	collectedAt := time.Now().UTC().Truncate(time.Millisecond)
	msg := model.ShadowIngressMessage{
		DeviceID:  "dev-int",
		ChannelID: "ch-int",
		Timestamp: collectedAt,
		Points: []model.ShadowIngressPoint{
			{PointID: "t1", Value: 1, Quality: "Good", CollectedAt: collectedAt},
			{PointID: "t2", Value: 2, Quality: "Good", CollectedAt: collectedAt},
		},
	}
	if _, err := sc.WriteShadowDevice(msg); err != nil {
		t.Fatalf("WriteShadowDevice: %v", err)
	}

	deadline := time.Now().Add(2 * time.Second)
	for {
		mu.Lock()
		n := len(singleReceived)
		mu.Unlock()
		if n >= 2 || time.Now().After(deadline) {
			break
		}
		time.Sleep(10 * time.Millisecond)
	}

	mu.Lock()
	defer mu.Unlock()
	if len(singleReceived) < 2 {
		t.Fatalf("single handlers got %d values, want >=2", len(singleReceived))
	}
	if len(batchReceived) < 2 {
		t.Fatalf("batch handlers got %d values, want >=2", len(batchReceived))
	}

	for _, v := range singleReceived {
		if v.ChannelID != "ch-int" || v.DeviceID != "dev-int" {
			t.Errorf("unexpected routing: %+v", v)
		}
	}
}

func TestScanEngineMetrics_RecordExecute(t *testing.T) {
	m := &ScanEngineMetrics{}
	m.RecordExecute(true, 50_000)
	m.RecordStarvationRescue()
	snap := m.Snapshot()
	if snap["tasks_succeeded"].(uint64) != 1 {
		t.Fatalf("expected 1 success, got %v", snap["tasks_succeeded"])
	}
	if snap["starvation_rescue_total"].(uint64) != 1 {
		t.Fatalf("expected 1 rescue, got %v", snap["starvation_rescue_total"])
	}
}
