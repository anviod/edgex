package core

import (
	"testing"
	"time"
)

func TestRescheduleTask_DriftCorrection(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{
		TickInterval: 10 * time.Millisecond,
		JitterBound:  0,
	})

	interval := 100 * time.Millisecond
	base := time.Date(2026, 7, 2, 10, 0, 0, 0, time.UTC)
	task := &ScanTask{
		ID:              "task_drift",
		Interval:        interval,
		LastScheduledAt: base,
		NextRun:         base,
		DeadlineAt:      base.Add(50 * time.Millisecond),
	}

	completedAt := base.Add(350 * time.Millisecond)
	se.rescheduleTask(task, completedAt)

	task.mu.Lock()
	defer task.mu.Unlock()

	wantNext := base.Add(4 * interval)
	if !task.LastScheduledAt.Equal(wantNext) {
		t.Fatalf("LastScheduledAt = %v, want %v", task.LastScheduledAt, wantNext)
	}
	if task.NextRun.Before(wantNext) {
		t.Fatalf("NextRun = %v, before base schedule %v", task.NextRun, wantNext)
	}
	if task.NextRun.Sub(wantNext) > se.config.JitterBound {
		t.Fatalf("NextRun jitter %v exceeds bound %v", task.NextRun.Sub(wantNext), se.config.JitterBound)
	}

	snap := se.GetMetrics().Snapshot()
	if snap["scan_miss_deadline_total"].(uint64) == 0 {
		t.Fatalf("expected scan_miss_deadline_total > 0, got snapshot=%v", snap)
	}
	if snap["scan_drift_samples"].(uint64) == 0 {
		t.Fatalf("expected scan_drift_samples > 0, got snapshot=%v", snap)
	}
}

func TestRescheduleTask_JitterWithinSLA(t *testing.T) {
	jitterBound := 50 * time.Millisecond
	se := NewScanEngine(ScanEngineConfig{
		TickInterval: 10 * time.Millisecond,
		JitterBound:  jitterBound,
	})

	base := time.Date(2026, 7, 2, 10, 0, 0, 0, time.UTC)
	task := &ScanTask{
		ID:              "task_jitter",
		Interval:        time.Second,
		LastScheduledAt: base,
		NextRun:         base,
	}

	se.rescheduleTask(task, base.Add(10*time.Millisecond))

	task.mu.RLock()
	defer task.mu.RUnlock()

	jitter := task.NextRun.Sub(task.LastScheduledAt)
	if jitter < 0 || jitter > jitterBound {
		t.Fatalf("jitter = %v, want within [0, %v]", jitter, jitterBound)
	}
	if task.DeadlineAt.Sub(task.NextRun) != jitterBound {
		t.Fatalf("deadline gap = %v, want %v", task.DeadlineAt.Sub(task.NextRun), jitterBound)
	}
}

func TestRescheduleTask_NoDriftWhenOnTime(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{JitterBound: 0})

	interval := 200 * time.Millisecond
	base := time.Date(2026, 7, 2, 10, 0, 0, 0, time.UTC)
	task := &ScanTask{
		ID:              "task_on_time",
		Interval:        interval,
		LastScheduledAt: base,
		NextRun:         base,
	}

	se.rescheduleTask(task, base.Add(20*time.Millisecond))

	task.mu.RLock()
	defer task.mu.RUnlock()

	want := base.Add(interval)
	if !task.LastScheduledAt.Equal(want) {
		t.Fatalf("LastScheduledAt = %v, want %v", task.LastScheduledAt, want)
	}
}

func TestTaskDeterministicJitter_Stable(t *testing.T) {
	bound := 50 * time.Millisecond
	a := taskDeterministicJitter("device-1", bound)
	b := taskDeterministicJitter("device-1", bound)
	if a != b {
		t.Fatalf("jitter not stable: %v vs %v", a, b)
	}
	if a < 0 || a > bound {
		t.Fatalf("jitter %v outside bound %v", a, bound)
	}
}

func TestScanEngineConfig_DefaultJitterBound(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{})
	if se.config.JitterBound != 50*time.Millisecond {
		t.Fatalf("default JitterBound = %v, want 50ms", se.config.JitterBound)
	}
}

func TestAddTask_AutoPhaseOffsetStaggered(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{JitterBound: 0})
	interval := time.Second

	taskA := se.AddTask("device-alpha", "modbus-tcp", interval, 5, []string{"p1"}, nil)
	taskB := se.AddTask("device-beta", "modbus-tcp", interval, 5, []string{"p1"}, nil)

	if taskA.PhaseOffset == taskB.PhaseOffset && taskA.PhaseOffset == 0 {
		t.Fatal("expected distinct non-zero phase offsets for different device keys")
	}
	if taskA.PhaseOffset < 0 || taskA.PhaseOffset >= interval {
		t.Fatalf("taskA phase offset %v out of [0, %v)", taskA.PhaseOffset, interval)
	}
	if taskB.PhaseOffset < 0 || taskB.PhaseOffset >= interval {
		t.Fatalf("taskB phase offset %v out of [0, %v)", taskB.PhaseOffset, interval)
	}
}
