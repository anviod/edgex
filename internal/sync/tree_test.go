package sync

import (
	"sort"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestBuildNodeSnapshot_Empty(t *testing.T) {
	snapshot := BuildNodeSnapshot("test-node", nil)
	assert.NotNil(t, snapshot)
	assert.Equal(t, "test-node", snapshot.NodeID)
	assert.Empty(t, snapshot.Channels)
	assert.Empty(t, snapshot.Files)
}

func TestCompareSnapshots_Same(t *testing.T) {
	now := time.Now()
	snapshot1 := &NodeSnapshot{
		NodeID:     "node1",
		CapturedAt: now,
		Files: []ConfigFile{
			{Path: "test.yaml", Hash: "abc123"},
		},
	}
	snapshot2 := &NodeSnapshot{
		NodeID:     "node2",
		CapturedAt: now,
		Files: []ConfigFile{
			{Path: "test.yaml", Hash: "abc123"},
		},
	}

	result := CompareSnapshots(snapshot1, snapshot2)
	assert.NotNil(t, result)
	assert.Equal(t, 1, result.Summary.Same)
	assert.Equal(t, 0, result.Summary.Different)
}

func TestCompareSnapshots_Different(t *testing.T) {
	now := time.Now()
	snapshot1 := &NodeSnapshot{
		NodeID:     "node1",
		CapturedAt: now,
		Files: []ConfigFile{
			{Path: "test.yaml", Hash: "abc123"},
		},
	}
	snapshot2 := &NodeSnapshot{
		NodeID:     "node2",
		CapturedAt: now,
		Files: []ConfigFile{
			{Path: "test.yaml", Hash: "def456"},
		},
	}

	result := CompareSnapshots(snapshot1, snapshot2)
	assert.NotNil(t, result)
	assert.Equal(t, 0, result.Summary.Same)
	assert.Equal(t, 1, result.Summary.Different)
}

func TestCompareSnapshots_OnlySource(t *testing.T) {
	now := time.Now()
	snapshot1 := &NodeSnapshot{
		NodeID:     "node1",
		CapturedAt: now,
		Files: []ConfigFile{
			{Path: "unique.yaml", Hash: "abc123"},
		},
	}
	snapshot2 := &NodeSnapshot{
		NodeID:     "node2",
		CapturedAt: now,
		Files:      []ConfigFile{},
	}

	result := CompareSnapshots(snapshot1, snapshot2)
	assert.NotNil(t, result)
	assert.Equal(t, 1, result.Summary.OnlySource)
}

func TestCompareSnapshots_OnlyTarget(t *testing.T) {
	now := time.Now()
	snapshot1 := &NodeSnapshot{
		NodeID:     "node1",
		CapturedAt: now,
		Files:      []ConfigFile{},
	}
	snapshot2 := &NodeSnapshot{
		NodeID:     "node2",
		CapturedAt: now,
		Files: []ConfigFile{
			{Path: "unique.yaml", Hash: "abc123"},
		},
	}

	result := CompareSnapshots(snapshot1, snapshot2)
	assert.NotNil(t, result)
	assert.Equal(t, 1, result.Summary.OnlyTarget)
}

func TestConfigFile_Hash(t *testing.T) {
	content := map[string]interface{}{
		"key1": "value1",
		"key2": 123,
	}

	file1 := newConfigFile("test.yaml", "test", content)
	file2 := newConfigFile("test.yaml", "test", content)

	assert.Equal(t, file1.Hash, file2.Hash)

	content2 := map[string]interface{}{
		"key1": "value2",
		"key2": 123,
	}
	file3 := newConfigFile("test.yaml", "test", content2)
	assert.NotEqual(t, file1.Hash, file3.Hash)
}

func TestNormalizeValue_SortKeys(t *testing.T) {
	input := map[string]interface{}{
		"z": 1,
		"a": 2,
		"m": 3,
	}

	normalized := normalizeValue(input)
	result, ok := normalized.(map[string]interface{})
	assert.True(t, ok)

	keys := make([]string, 0, len(result))
	for k := range result {
		keys = append(keys, k)
	}

	sort.Strings(keys)
	assert.Equal(t, []string{"a", "m", "z"}, keys)
}