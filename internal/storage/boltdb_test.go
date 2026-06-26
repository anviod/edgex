package storage

import (
	"testing"

	"go.etcd.io/bbolt"
)

func TestIsConfigBucket(t *testing.T) {
	testCases := []struct {
		name     string
		bucket   string
		expected bool
	}{
		{"ConfigVersion is config", "ConfigVersion", true},
		{"Channels is config", "Channels", true},
		{"Devices is config", "Devices", true},
		{"Northbound is config", "Northbound", true},
		{"EdgeRules is config", "EdgeRules", true},
		{"System is config", "System", true},
		{"Users is config", "Users", true},
		{"Server is config", "Server", true},
		{"DataCache is not config", "DataCache", false},
		{"WindowData is not config", "WindowData", false},
		{"NorthboundCache is not config", "NorthboundCache", false},
		{"RuleState is not config", "RuleState", false},
		{"values is not config", "values", false},
		{"device_history_xxx is not config", "device_history_device1", false},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := IsConfigBucket(tc.bucket)
			if result != tc.expected {
				t.Errorf("IsConfigBucket(%q) = %v, want %v", tc.bucket, result, tc.expected)
			}
		})
	}
}

func TestClassifyBucket(t *testing.T) {
	testCases := []struct {
		name          string
		bucket        string
		expectedCat   string
		expectedClear bool
	}{
		{"ConfigVersion", "ConfigVersion", "config", false},
		{"Channels", "Channels", "config", false},
		{"Devices", "Devices", "config", false},
		{"Northbound", "Northbound", "config", false},
		{"EdgeRules", "EdgeRules", "config", false},
		{"System", "System", "config", false},
		{"Users", "Users", "config", false},
		{"Server", "Server", "config", false},
		{"DataCache", "DataCache", "cache", true},
		{"WindowData", "WindowData", "cache", true},
		{"NorthboundCache", "NorthboundCache", "cache", true},
		{"RuleState", "RuleState", "cache", true},
		{"WAL", "WAL", "cache", true},
		{"values", "values", "runtime", true},
		{"device_history_device1", "device_history_device1", "history", true},
		{"device_history_abc", "device_history_abc", "history", true},
		{"unknown", "unknown", "unknown", false},
		{"custom", "custom", "unknown", false},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			cat, clearable := classifyBucket(tc.bucket)
			if cat != tc.expectedCat {
				t.Errorf("classifyBucket(%q).category = %q, want %q", tc.bucket, cat, tc.expectedCat)
			}
			if clearable != tc.expectedClear {
				t.Errorf("classifyBucket(%q).clearable = %v, want %v", tc.bucket, clearable, tc.expectedClear)
			}
		})
	}
}

func TestClearBucket_Functionality(t *testing.T) {
	tmpDir := testOutputDir(t)

	s, err := NewStorage(tmpDir)
	if err != nil {
		t.Fatal(err)
	}
	defer s.Close()

	err = s.GetDB().Update(func(tx *bbolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte("DataCache"))
		if err != nil {
			return err
		}
		if err := b.Put([]byte("key1"), []byte("value1")); err != nil {
			return err
		}
		if err := b.Put([]byte("key2"), []byte("value2")); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}

	if err := s.ClearBucket("DataCache"); err != nil {
		t.Errorf("ClearBucket(DataCache) should succeed: %v", err)
	}

	var count int
	err = s.GetDB().View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("DataCache"))
		if b != nil {
			b.ForEach(func(k, v []byte) error {
				count++
				return nil
			})
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if count != 0 {
		t.Errorf("DataCache should be empty, got %d records", count)
	}

	if err := s.ClearBucket("NonExistent"); err == nil {
		t.Error("ClearBucket(NonExistent) should fail")
	}
}
