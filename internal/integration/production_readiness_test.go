package integration_test

import (
	"encoding/json"
	"math"
	"os"
	"runtime"
	"sort"
	"strconv"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/core"
)

const (
	prodGateMemDriftMaxPct       = 5.0
	prodGateSoakLagP95Ms         = 200.0
	prodGatePLCLagP95Ms          = 200.0
	prodGateFailRateMax          = 0.001
	prodGateSoakFailRateMax      = 0.005
	prodGateScanMissDeadlineMax  = core.SLAScanMissDeadlineMax
)

type productionGate struct {
	Name   string `json:"name"`
	Passed bool   `json:"passed"`
	Detail string `json:"detail,omitempty"`
	Value  any    `json:"value,omitempty"`
	Limit  any    `json:"limit,omitempty"`
}

type productionReadinessSummary struct {
	Test        string           `json:"test"`
	Duration    string           `json:"duration"`
	GatesPassed []string         `json:"gates_passed"`
	GatesFailed []string         `json:"gates_failed"`
	AllPassed   bool             `json:"all_passed"`
	PanicFree   bool             `json:"panic_free"`
	Gates       []productionGate `json:"gates"`
	Metrics     map[string]any   `json:"metrics,omitempty"`
}

func parseDurationEnv(keys ...string) (time.Duration, bool) {
	for _, key := range keys {
		raw := os.Getenv(key)
		if raw == "" {
			continue
		}
		if d, err := time.ParseDuration(raw); err == nil && d > 0 {
			return d, true
		}
		if secs, err := strconv.Atoi(raw); err == nil && secs > 0 {
			return time.Duration(secs) * time.Second, true
		}
	}
	return 0, false
}

type runtimeMemSnapshot struct {
	HeapInuseMB float64
}

func memoryDriftPct(start, end runtimeMemSnapshot) float64 {
	if start.HeapInuseMB <= 0 {
		return 0
	}
	return (end.HeapInuseMB - start.HeapInuseMB) / start.HeapInuseMB * 100
}

const (
	memSnapshotSamples = 7
	memSnapshotDelay   = 40 * time.Millisecond
)

// captureMemSnapshot returns a median HeapInuse reading after repeated GC cycles.
// Single-shot ReadMemStats after one GC is flaky on cold heaps (first CI run).
func captureMemSnapshot() runtimeMemSnapshot {
	samples := make([]float64, memSnapshotSamples)
	for i := range samples {
		runtime.GC()
		time.Sleep(memSnapshotDelay)
		var ms runtime.MemStats
		runtime.ReadMemStats(&ms)
		samples[i] = float64(ms.HeapInuse) / (1024 * 1024)
	}
	sort.Float64s(samples)
	return runtimeMemSnapshot{HeapInuseMB: samples[len(samples)/2]}
}

// captureStableMemSnapshot takes two median readings and keeps the higher one so
// a transient post-GC dip does not deflate the baseline and inflate drift %.
func captureStableMemSnapshot() runtimeMemSnapshot {
	first := captureMemSnapshot()
	settleHeapForMeasurement()
	second := captureMemSnapshot()
	if second.HeapInuseMB > first.HeapInuseMB {
		return second
	}
	return first
}

// settleHeapForMeasurement encourages the runtime to drain short-lived soak garbage
// before baseline/end snapshots so ramp-up noise does not dominate drift.
func settleHeapForMeasurement() {
	for i := 0; i < 5; i++ {
		runtime.GC()
		time.Sleep(memSnapshotDelay)
	}
}

func memoryDriftPctLogged(t *testing.T, start, end runtimeMemSnapshot) float64 {
	t.Helper()
	drift := memoryDriftPct(start, end)
	if drift != 0 || start.HeapInuseMB > 0 {
		t.Logf("memory_drift: start=%.3fMB end=%.3fMB drift=%.2f%%", start.HeapInuseMB, end.HeapInuseMB, drift)
	}
	if math.IsNaN(drift) || math.IsInf(drift, 0) {
		return 0
	}
	return drift
}

func buildProductionReadinessSummary(testName string, duration time.Duration, gates []productionGate, metrics map[string]any) productionReadinessSummary {
	summary := productionReadinessSummary{
		Test:      testName,
		Duration:  duration.String(),
		PanicFree: true,
		Gates:     gates,
		Metrics:   metrics,
	}
	for _, g := range gates {
		if g.Passed {
			summary.GatesPassed = append(summary.GatesPassed, g.Name)
		} else {
			summary.GatesFailed = append(summary.GatesFailed, g.Name)
		}
	}
	summary.AllPassed = len(summary.GatesFailed) == 0
	return summary
}

func logProductionReadinessSummary(t *testing.T, summary productionReadinessSummary) {
	t.Helper()
	payload, err := json.MarshalIndent(summary, "", "  ")
	if err != nil {
		t.Fatalf("marshal production readiness summary: %v", err)
	}
	t.Logf("production_readiness_summary:\n%s", string(payload))
}

func assertProductionGates(t *testing.T, summary productionReadinessSummary) {
	t.Helper()
	logProductionReadinessSummary(t, summary)
	if !summary.AllPassed {
		t.Fatalf("production readiness gates failed: %v", summary.GatesFailed)
	}
}
