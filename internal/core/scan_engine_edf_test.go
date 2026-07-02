package core

import (
	"container/heap"
	"testing"
	"time"
)

func TestPopReadyTaskEDF_PrefersEarliestDeadline(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{JitterBound: 0})
	now := time.Date(2026, 7, 3, 12, 0, 0, 0, time.UTC)

	early := &ScanTask{
		ID:         "early-deadline",
		NextRun:    now,
		DeadlineAt: now.Add(10 * time.Millisecond),
		Priority:   5,
		Status:     ScanTaskStatusIdle,
	}
	late := &ScanTask{
		ID:         "late-deadline",
		NextRun:    now,
		DeadlineAt: now.Add(50 * time.Millisecond),
		Priority:   8,
		Status:     ScanTaskStatusIdle,
	}

	se.mu.Lock()
	heap.Push(se.priorityQueue, late)
	heap.Push(se.priorityQueue, early)
	se.mu.Unlock()

	got := se.popReadyTaskEDF(now)
	if got == nil || got.ID != early.ID {
		t.Fatalf("popReadyTaskEDF = %v, want early-deadline", got)
	}
}

func TestPopReadyTaskEDF_SkipsNotReady(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{JitterBound: 0})
	now := time.Date(2026, 7, 3, 12, 0, 0, 0, time.UTC)

	future := &ScanTask{
		ID:         "future",
		NextRun:    now.Add(time.Second),
		DeadlineAt: now.Add(2 * time.Second),
		Priority:   5,
		Status:     ScanTaskStatusIdle,
	}
	se.mu.Lock()
	heap.Push(se.priorityQueue, future)
	se.mu.Unlock()

	if got := se.popReadyTaskEDF(now); got != nil {
		t.Fatalf("expected nil for not-ready task, got %v", got.ID)
	}
}

func TestEnforceHardJitterClamp_ForcesDispatchAndRecordsMiss(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{JitterBound: 20 * time.Millisecond})
	now := time.Date(2026, 7, 3, 12, 0, 0, 0, time.UTC)

	task := &ScanTask{
		ID:         "overdue",
		NextRun:    now.Add(-100 * time.Millisecond),
		DeadlineAt: now.Add(-30 * time.Millisecond),
		Priority:   3,
		Status:     ScanTaskStatusIdle,
	}
	se.mu.Lock()
	heap.Push(se.priorityQueue, task)
	se.mu.Unlock()

	se.enforceHardJitterClamp(now)

	task.mu.RLock()
	defer task.mu.RUnlock()
	if !task.NextRun.Equal(now) {
		t.Fatalf("NextRun = %v, want forced to %v", task.NextRun, now)
	}
	if task.Priority <= 3 {
		t.Fatalf("expected priority boost on miss, got %d", task.Priority)
	}

	snap := se.GetMetrics().Snapshot()
	if snap["scan_miss_deadline_total"].(uint64) == 0 {
		t.Fatalf("expected scan_miss_deadline_total > 0")
	}
}

func TestRescheduleTask_BoostsPriorityOnMiss(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{JitterBound: 10 * time.Millisecond})
	base := time.Date(2026, 7, 3, 12, 0, 0, 0, time.UTC)
	task := &ScanTask{
		ID:              "miss-boost",
		Interval:        100 * time.Millisecond,
		LastScheduledAt: base,
		NextRun:         base,
		DeadlineAt:      base.Add(10 * time.Millisecond),
		Priority:        4,
	}

	se.rescheduleTask(task, base.Add(250*time.Millisecond))

	task.mu.RLock()
	defer task.mu.RUnlock()
	if task.Priority <= 4 {
		t.Fatalf("expected priority boost after miss, got %d", task.Priority)
	}
}

func TestPriorityQueue_EDFTieBreak(t *testing.T) {
	now := time.Date(2026, 7, 3, 12, 0, 0, 0, time.UTC)
	pq := PriorityQueue{
		&ScanTask{ID: "b", NextRun: now, DeadlineAt: now.Add(50 * time.Millisecond), Priority: 3},
		&ScanTask{ID: "a", NextRun: now, DeadlineAt: now.Add(10 * time.Millisecond), Priority: 1},
	}
	heap.Init(&pq)
	if pq[0].ID != "a" {
		t.Fatalf("heap root = %s, want earliest deadline task a", pq[0].ID)
	}
}

func TestBoostPriorityOnMiss_CapsAtPriorityLevels(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{PriorityLevels: 10})
	task := &ScanTask{Priority: 9}
	se.boostPriorityOnMiss(task)
	if task.Priority != 10 {
		t.Fatalf("priority = %d, want capped at 10", task.Priority)
	}
}
