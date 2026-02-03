package core

import (
	"fmt"
	"industrial-edge-gateway/internal/model"
	"industrial-edge-gateway/internal/storage"
	"os"
	"testing"
	"time"
)

func TestBblotPersistence(t *testing.T) {
	// 1. Setup Storage
	tmpFile := "test_bblot.db"
	os.Remove(tmpFile)
	defer os.Remove(tmpFile)

	store, err := storage.NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	// 2. Setup EdgeComputeManager
	pipeline := NewDataPipeline(10)
	ecm := NewEdgeComputeManager(pipeline, store, func(rules []model.EdgeRule) error {
		return nil
	})

	pipeline.Start()
	ecm.Start()
	defer ecm.Stop()

	// 3. Define Rule
	ruleID := "rule-bblot-1"
	rule := model.EdgeRule{
		ID:          ruleID,
		Name:        "TestBblot",
		Type:        "threshold",
		Enable:      true,
		TriggerMode: "always",
		Sources: []model.RuleSource{
			{PointID: "p1"},
		},
		Condition: "value > 10",
	}

	ecm.LoadRules([]model.EdgeRule{rule})

	// 4. Trigger Rule
	// Send p1 = 15 (Trigger)
	pipeline.Push(model.Value{
		PointID: "p1",
		Value:   15,
		TS:      time.Now(),
	})

	time.Sleep(200 * time.Millisecond) // Wait for processing and async save

	// 5. Verify bblot record
	minuteKey := time.Now().Format("2006-01-02 15:04")
	expectedKey := fmt.Sprintf("%s_%s", ruleID, minuteKey)

	found := false
	store.LoadAll("bblot", func(k, v []byte) error {
		if string(k) == expectedKey {
			found = true
			t.Logf("Found bblot record: %s", string(k))
			// We could deserialize v to model.RuleMinuteSnapshot to check details if needed
		}
		return nil
	})

	if !found {
		t.Errorf("Expected bblot record for key %s not found", expectedKey)
	}
}
