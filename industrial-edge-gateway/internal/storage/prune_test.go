package storage

import (
	"fmt"
	"os"
	"testing"
)

func TestPruneOldest(t *testing.T) {
	tmpFile := "test_prune.db"
	os.Remove(tmpFile)
	defer os.Remove(tmpFile)

	s, err := NewStorage(tmpFile)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer s.Close()

	bucket := "test_bucket"
	
	// Insert 5 items
	for i := 0; i < 5; i++ {
		key := fmt.Sprintf("key_%d", i)
		if err := s.SaveData(bucket, key, map[string]int{"val": i}); err != nil {
			t.Fatalf("Failed to save %d: %v", i, err)
		}
	}

	// Prune to 3
	if err := s.PruneOldest(bucket, 3); err != nil {
		t.Fatalf("Prune failed: %v", err)
	}

	// Verify count
	var records []map[string]int
	s.LoadLatest(bucket, 100, func(k, v []byte) error {
		records = append(records, map[string]int{})
		return nil
	})

	if len(records) != 3 {
		t.Errorf("Expected 3 records, got %d", len(records))
	}
}
