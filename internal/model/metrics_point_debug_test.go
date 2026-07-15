package model

import (
	"strconv"
	"testing"
)

func TestRecordPointDebug_SamplingAndEviction(t *testing.T) {
	pointDebugCounter.Store(0)

	mc := NewMetricsCollector()
	raw := make([]byte, 128)
	for i := range raw {
		raw[i] = byte(i)
	}

	for i := 0; i < pointDebugSampleRate*3; i++ {
		mc.RecordPointDebug("ch-1", "pt-1", raw, i, "Good")
	}

	pm := mc.GetPointMetrics("pt-1")
	if pm.LastUpdateTime.IsZero() {
		t.Fatal("expected at least one sampled point debug record")
	}
	if len(pm.RawValue) != pointDebugMaxRawBytes {
		t.Fatalf("raw len = %d, want %d", len(pm.RawValue), pointDebugMaxRawBytes)
	}

	for i := 0; i < pointMetricsMaxEntries+10; i++ {
		pointDebugCounter.Store(uint64(i * pointDebugSampleRate))
		mc.RecordPointDebug("ch-1", "pt-evict-"+strconv.Itoa(i), raw, i, "Good")
	}

	mc.mu.RLock()
	count := len(mc.pointMetrics)
	mc.mu.RUnlock()
	if count > pointMetricsMaxEntries {
		t.Fatalf("pointMetrics size = %d, want <= %d", count, pointMetricsMaxEntries)
	}
}

func TestRecordPointDebug_NilCollector(t *testing.T) {
	var mc *MetricsCollector
	mc.RecordPointDebug("ch", "pt", nil, nil, "Good")
}
