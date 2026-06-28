package core

import (
	"fmt"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/storage"
)

func TestBblotPersistence(t *testing.T) {
	// 1. Setup Storage
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
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

	minuteKey := time.Now().Format("2006-01-02 15:04")
	expectedKey := fmt.Sprintf("%s_%s", ruleID, minuteKey)

	// 4. Trigger Rule
	pipeline.Push(model.Value{
		PointID: "p1",
		Value:   15,
		TS:      time.Now(),
	})

	deadline := time.Now().Add(3 * time.Second)
	found := false
	for time.Now().Before(deadline) {
		store.LoadAll("bblot", func(k, v []byte) error {
			if string(k) == expectedKey {
				found = true
				t.Logf("Found bblot record: %s", string(k))
			}
			return nil
		})
		if found {
			break
		}
		time.Sleep(50 * time.Millisecond)
	}

	if !found {
		t.Errorf("Expected bblot record for key %s not found", expectedKey)
	}
}
