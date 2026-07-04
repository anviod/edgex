package core

import (
	"fmt"
	"sort"
	"sync"
	"sync/atomic"
)

const scanLagSampleCap = 2048

// SLA 告警阈值（运维对齐用，可通过 diagnostics API 的 sla_warnings 查看）。
const (
	SLAScanLagP95MsThreshold       = 100.0
	SLAScanDriftAvgMsThreshold     = 50.0
	SLAScanMissDeadlineMax         = 0
	SLACircuitBreakerRejectMax     = 0
)

// ScanEngineMetrics 调度引擎可观测指标（对标 Kepware Diagnostics）。
type ScanEngineMetrics struct {
	TasksExecuted          atomic.Uint64
	TasksSucceeded         atomic.Uint64
	TasksFailed            atomic.Uint64
	StarvationRescues      atomic.Uint64
	TaskOverdueTotal       atomic.Uint64
	ScanMissDeadlineTotal  atomic.Uint64
	ScanDriftMicrosTotal   atomic.Uint64
	ScanDriftSamples       atomic.Uint64
	TotalScanLagMicros     atomic.Uint64
	ScanLagSamples         atomic.Uint64
	MaxScanLagMicros       atomic.Uint64
	IntervalAdjustedTotal  atomic.Uint64

	adaptiveFactorMu sync.RWMutex
	adaptiveFactor   float64

	lagMu      sync.Mutex
	lagSamples []int64
}

func (m *ScanEngineMetrics) RecordExecute(success bool, lagMicros int64) {
	if m == nil {
		return
	}
	m.TasksExecuted.Add(1)
	if success {
		m.TasksSucceeded.Add(1)
	} else {
		m.TasksFailed.Add(1)
	}
	if lagMicros > 0 {
		m.TotalScanLagMicros.Add(uint64(lagMicros))
		m.ScanLagSamples.Add(1)
		for {
			prev := m.MaxScanLagMicros.Load()
			if uint64(lagMicros) <= prev {
				break
			}
			if m.MaxScanLagMicros.CompareAndSwap(prev, uint64(lagMicros)) {
				break
			}
		}
		m.recordLagSample(lagMicros)
	}
}

func (m *ScanEngineMetrics) recordLagSample(lagMicros int64) {
	m.lagMu.Lock()
	defer m.lagMu.Unlock()
	if len(m.lagSamples) >= scanLagSampleCap {
		copy(m.lagSamples, m.lagSamples[1:])
		m.lagSamples[len(m.lagSamples)-1] = lagMicros
		return
	}
	m.lagSamples = append(m.lagSamples, lagMicros)
}

func (m *ScanEngineMetrics) RecordStarvationRescue() {
	if m != nil {
		m.StarvationRescues.Add(1)
	}
}

func (m *ScanEngineMetrics) RecordOverdue() {
	if m != nil {
		m.TaskOverdueTotal.Add(1)
	}
}

func (m *ScanEngineMetrics) RecordMissDeadline() {
	if m != nil {
		m.ScanMissDeadlineTotal.Add(1)
	}
}

func (m *ScanEngineMetrics) RecordDrift(driftMicros int64) {
	if m == nil || driftMicros <= 0 {
		return
	}
	m.ScanDriftMicrosTotal.Add(uint64(driftMicros))
	m.ScanDriftSamples.Add(1)
}

func (m *ScanEngineMetrics) SetAdaptiveSlowdownFactor(factor float64) {
	if m == nil {
		return
	}
	m.adaptiveFactorMu.Lock()
	m.adaptiveFactor = factor
	m.adaptiveFactorMu.Unlock()
}

func (m *ScanEngineMetrics) AdaptiveSlowdownFactor() float64 {
	if m == nil {
		return 1.0
	}
	m.adaptiveFactorMu.RLock()
	defer m.adaptiveFactorMu.RUnlock()
	if m.adaptiveFactor <= 0 {
		return 1.0
	}
	return m.adaptiveFactor
}

func (m *ScanEngineMetrics) RecordIntervalAdjusted() {
	if m != nil {
		m.IntervalAdjustedTotal.Add(1)
	}
}

func (m *ScanEngineMetrics) GlobalFailRate() float64 {
	if m == nil {
		return 0
	}
	executed := m.TasksExecuted.Load()
	if executed == 0 {
		return 0
	}
	return float64(m.TasksFailed.Load()) / float64(executed)
}

func (m *ScanEngineMetrics) AvgLagMs() float64 {
	if m == nil {
		return 0
	}
	samples := m.ScanLagSamples.Load()
	if samples == 0 {
		return 0
	}
	return float64(m.TotalScanLagMicros.Load()) / float64(samples) / 1000.0
}

func (m *ScanEngineMetrics) scanLagP95Ms() float64 {
	m.lagMu.Lock()
	samples := append([]int64(nil), m.lagSamples...)
	m.lagMu.Unlock()
	if len(samples) == 0 {
		return 0
	}
	sort.Slice(samples, func(i, j int) bool { return samples[i] < samples[j] })
	idx := (len(samples)*95 + 99) / 100
	if idx >= len(samples) {
		idx = len(samples) - 1
	}
	return float64(samples[idx]) / 1000.0
}

// ResetWindow clears cumulative counters and lag samples for steady-state measurement windows (benchmarks/soak).
func (m *ScanEngineMetrics) ResetWindow() {
	if m == nil {
		return
	}
	m.TasksExecuted.Store(0)
	m.TasksSucceeded.Store(0)
	m.TasksFailed.Store(0)
	m.StarvationRescues.Store(0)
	m.TaskOverdueTotal.Store(0)
	m.ScanMissDeadlineTotal.Store(0)
	m.ScanDriftMicrosTotal.Store(0)
	m.ScanDriftSamples.Store(0)
	m.TotalScanLagMicros.Store(0)
	m.ScanLagSamples.Store(0)
	m.MaxScanLagMicros.Store(0)
	m.IntervalAdjustedTotal.Store(0)
	m.lagMu.Lock()
	m.lagSamples = m.lagSamples[:0]
	m.lagMu.Unlock()
}

func (m *ScanEngineMetrics) Snapshot() map[string]any {
	if m == nil {
		return map[string]any{}
	}
	samples := m.ScanLagSamples.Load()
	avgLagMs := float64(0)
	if samples > 0 {
		avgLagMs = float64(m.TotalScanLagMicros.Load()) / float64(samples) / 1000.0
	}
	driftSamples := m.ScanDriftSamples.Load()
	avgDriftMs := float64(0)
	if driftSamples > 0 {
		avgDriftMs = float64(m.ScanDriftMicrosTotal.Load()) / float64(driftSamples) / 1000.0
	}
	return map[string]any{
		"tasks_executed":               m.TasksExecuted.Load(),
		"tasks_succeeded":              m.TasksSucceeded.Load(),
		"tasks_failed":                 m.TasksFailed.Load(),
		"starvation_rescue_total":      m.StarvationRescues.Load(),
		"task_overdue_total":           m.TaskOverdueTotal.Load(),
		"scan_miss_deadline_total":     m.ScanMissDeadlineTotal.Load(),
		"scan_drift_avg_ms":            avgDriftMs,
		"scan_drift_samples":           driftSamples,
		"scan_lag_avg_ms":              avgLagMs,
		"scan_lag_p95_ms":              m.scanLagP95Ms(),
		"scan_lag_max_ms":              float64(m.MaxScanLagMicros.Load()) / 1000.0,
		"scan_lag_samples":             samples,
		"adaptive_slowdown_factor":     m.AdaptiveSlowdownFactor(),
		"scan_interval_adjusted_total": m.IntervalAdjustedTotal.Load(),
	}
}

func (m *ScanEngineMetrics) SLAWarnings(cb *DriverCircuitBreaker) []map[string]any {
	if m == nil {
		return nil
	}
	snap := m.Snapshot()
	var warnings []map[string]any

	if p95, ok := snap["scan_lag_p95_ms"].(float64); ok && p95 > SLAScanLagP95MsThreshold {
		warnings = append(warnings, map[string]any{
			"code":      "scan_lag_p95_exceeded",
			"metric":    "scan_lag_p95_ms",
			"value":     p95,
			"threshold": SLAScanLagP95MsThreshold,
			"message":   fmt.Sprintf("scan lag P95 %.2fms exceeds %.0fms", p95, SLAScanLagP95MsThreshold),
		})
	}
	if drift, ok := snap["scan_drift_avg_ms"].(float64); ok && drift > SLAScanDriftAvgMsThreshold {
		warnings = append(warnings, map[string]any{
			"code":      "scan_drift_avg_exceeded",
			"metric":    "scan_drift_avg_ms",
			"value":     drift,
			"threshold": SLAScanDriftAvgMsThreshold,
			"message":   fmt.Sprintf("scan drift avg %.2fms exceeds %.0fms", drift, SLAScanDriftAvgMsThreshold),
		})
	}
	if missed := m.ScanMissDeadlineTotal.Load(); missed > SLAScanMissDeadlineMax {
		warnings = append(warnings, map[string]any{
			"code":      "scan_miss_deadline_exceeded",
			"metric":    "scan_miss_deadline_total",
			"value":     missed,
			"threshold": SLAScanMissDeadlineMax,
			"message":   fmt.Sprintf("scan miss deadline total %d exceeds %d", missed, SLAScanMissDeadlineMax),
		})
	}
	if cb != nil {
		if rejects := cb.RejectTotal(); rejects > SLACircuitBreakerRejectMax {
			warnings = append(warnings, map[string]any{
				"code":      "circuit_breaker_rejects",
				"metric":    "circuit_breaker_reject_total",
				"value":     rejects,
				"threshold": SLACircuitBreakerRejectMax,
				"message":   fmt.Sprintf("circuit breaker rejected %d requests", rejects),
			})
		}
	}
	return warnings
}
