package core

import "sync/atomic"

// ScanEngineMetrics 调度引擎可观测指标（对标 Kepware Diagnostics）。
type ScanEngineMetrics struct {
	TasksExecuted       atomic.Uint64
	TasksSucceeded      atomic.Uint64
	TasksFailed         atomic.Uint64
	StarvationRescues   atomic.Uint64
	TaskOverdueTotal    atomic.Uint64
	TotalScanLagMicros  atomic.Uint64
	ScanLagSamples      atomic.Uint64
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
	}
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
		"tasks_executed":        m.TasksExecuted.Load(),
		"tasks_succeeded":       m.TasksSucceeded.Load(),
		"tasks_failed":          m.TasksFailed.Load(),
		"starvation_rescue_total": m.StarvationRescues.Load(),
		"task_overdue_total":    m.TaskOverdueTotal.Load(),
		"scan_lag_avg_ms":       avgLagMs,
		"scan_lag_samples":      samples,
	}
}
