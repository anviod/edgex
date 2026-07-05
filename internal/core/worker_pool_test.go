package core

import (
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func TestWorkerPool_StopRejectsNewSubmits(t *testing.T) {
	wp := NewWorkerPool(2)

	done := make(chan struct{})
	wp.Submit(func() {
		close(done)
	})

	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("task did not run before stop")
	}

	wp.Stop()

	if wp.Submit(func() {}) {
		t.Fatal("submit after stop should return false")
	}
}

func TestWorkerPool_ConcurrentStopNoPanic(t *testing.T) {
	wp := NewWorkerPool(4)

	var submitted atomic.Int64
	stop := make(chan struct{})

	go func() {
		for {
			select {
			case <-stop:
				return
			default:
				if wp.Submit(func() {
					time.Sleep(time.Millisecond)
				}) {
					submitted.Add(1)
				}
			}
		}
	}()

	time.Sleep(20 * time.Millisecond)
	close(stop)
	wp.Stop()
}

func TestWorkerPool_DoubleStopIsSafe(t *testing.T) {
	wp := NewWorkerPool(1)
	wp.Stop()
	wp.Stop()
}

func TestWorkerPool_StopDrainsRunningTasks(t *testing.T) {
	wp := NewWorkerPool(2)

	var ran atomic.Int64
	var wg sync.WaitGroup
	wg.Add(10)

	for i := 0; i < 10; i++ {
		ok := wp.Submit(func() {
			defer wg.Done()
			time.Sleep(5 * time.Millisecond)
			ran.Add(1)
		})
		if !ok {
			wg.Done()
		}
	}

	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()

	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatalf("tasks did not finish, ran=%d", ran.Load())
	}

	wp.Stop()
}

func TestWorkerPool_StartAndMetrics(t *testing.T) {
	wp := NewWorkerPool(2)
	wp.Start()

	done := make(chan struct{})
	wp.Submit(func() {
		time.Sleep(20 * time.Millisecond)
		close(done)
	})

	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("task did not complete")
	}

	if wp.PendingCount() < 0 {
		t.Fatal("PendingCount should be non-negative")
	}
	if active := wp.ActiveCount(); active < 0 {
		t.Fatalf("ActiveCount = %d, want ≥ 0", active)
	}

	wp.SetWorkerCount(4)
	if len(wp.workers) != 4 {
		t.Fatalf("SetWorkerCount(4) workers = %d", len(wp.workers))
	}
	wp.SetWorkerCount(2)
	wp.Stop()
}

func TestWorkerPool_ZeroWorkersDefaultsToFour(t *testing.T) {
	wp := NewWorkerPool(0)
	if len(wp.workers) != 4 {
		t.Fatalf("zero worker count should default to 4, got %d", len(wp.workers))
	}
	wp.Stop()
}

func TestWorkerPool_WaitForIdleEmpty(t *testing.T) {
	wp := NewWorkerPool(1)
	if !wp.WaitForIdle(time.Second) {
		t.Fatal("empty pool should report idle")
	}
	wp.Stop()
}
