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
