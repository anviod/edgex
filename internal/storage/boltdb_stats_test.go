package storage

import (
	"testing"
)

func TestEnsureKnownRuntimeBuckets(t *testing.T) {
	stats := []BucketStats{
		{Name: "DataCache", Database: "runtime", Category: "cache", Clearable: true, RecordCount: 3},
	}
	stats = ensureKnownRuntimeBuckets(stats)

	runtimeNames := make(map[string]struct{})
	for _, st := range stats {
		if st.Database == "runtime" {
			runtimeNames[st.Name] = struct{}{}
		}
	}

	for _, name := range knownRuntimeBucketNames {
		if _, ok := runtimeNames[name]; !ok {
			t.Errorf("missing known runtime bucket %q", name)
		}
	}
}

func TestGetBucketStats_IncludesKnownRuntimeBuckets(t *testing.T) {
	tmpDir := testOutputDir(t)

	s, err := NewStorage(tmpDir)
	if err != nil {
		t.Fatal(err)
	}
	defer s.Close()

	stats, _, err := s.GetBucketStats()
	if err != nil {
		t.Fatal(err)
	}

	runtimeNames := make(map[string]struct{})
	for _, st := range stats {
		if st.Database == "runtime" {
			runtimeNames[st.Name] = struct{}{}
		}
	}

	for _, name := range knownRuntimeBucketNames {
		if _, ok := runtimeNames[name]; !ok {
			t.Errorf("GetBucketStats missing known runtime bucket %q", name)
		}
	}
}
