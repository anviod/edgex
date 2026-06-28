package core

import (
	"sort"
	"sync"
	"sync/atomic"
)

const scanLagSampleCap = 2048

// ScanEngineMetrics 调度引擎可观测指标（对标 Kepware Diagnostics）。
type ScanEngineMetrics struct {
	TasksExecuted      atomic.Uint64
	TasksSucceeded     atomic.Uint64
	TasksFailed        atomic.Uint64
	StarvationRescues  atomic.Uint64
	TaskOverdueTotal   atomic.Uint64
	TotalScanLagMicros atomic.Uint64
	ScanLagSamples     atomic.Uint64
	MaxScanLagMicros   atomic.Uint64

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

func (m *ScanEngineMetrics) Snapshot() map[string]any {
	if m == nil {
		return map[string]any{}
	}
	samples := m.ScanLagSamples.Load()
	avgLagMs := float64(0)
	if samples > 0 {
		avgLagMs = float64(m.TotalScanLagMicros.Load()) / float64(samples) / 1000.0
	}
	return map[string]any{
		"tasks_executed":          m.TasksExecuted.Load(),
		"tasks_succeeded":         m.TasksSucceeded.Load(),
		"tasks_failed":            m.TasksFailed.Load(),
		"starvation_rescue_total": m.StarvationRescues.Load(),
		"task_overdue_total":      m.TaskOverdueTotal.Load(),
		"scan_lag_avg_ms":         avgLagMs,
		"scan_lag_p95_ms":         m.scanLagP95Ms(),
		"scan_lag_max_ms":         float64(m.MaxScanLagMicros.Load()) / 1000.0,
		"scan_lag_samples":        samples,
	}
}
