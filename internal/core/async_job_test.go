package core

import (
	"context"
	"errors"
	"testing"
	"time"
)

func TestAsyncJobManager_SubmitSucceeds(t *testing.T) {
	m := NewAsyncJobManager()
	defer m.Stop()

	job := m.Submit(AsyncJobScanChannel, "ch1", "", func(ctx context.Context) (any, error) {
		return []string{"dev-a"}, nil
	})
	if job == nil || job.ID == "" {
		t.Fatal("expected job snapshot")
	}
	if job.Status != AsyncJobQueued && job.Status != AsyncJobRunning && job.Status != AsyncJobSucceeded {
		t.Fatalf("unexpected initial status %s", job.Status)
	}

	deadline := time.Now().Add(2 * time.Second)
	var got *AsyncJob
	for time.Now().Before(deadline) {
		got, _ = m.Get(job.ID)
		if got != nil && got.Status == AsyncJobSucceeded {
			break
		}
		time.Sleep(20 * time.Millisecond)
	}
	if got == nil || got.Status != AsyncJobSucceeded {
		t.Fatalf("expected succeeded, got %#v", got)
	}
	arr, ok := got.Result.([]string)
	if !ok || len(arr) != 1 || arr[0] != "dev-a" {
		t.Fatalf("unexpected result %#v", got.Result)
	}
}

func TestAsyncJobManager_SubmitFails(t *testing.T) {
	m := NewAsyncJobManager()
	defer m.Stop()

	job := m.Submit(AsyncJobScanDevice, "ch1", "dev1", func(ctx context.Context) (any, error) {
		return nil, errors.New("browse failed")
	})
	deadline := time.Now().Add(2 * time.Second)
	var got *AsyncJob
	for time.Now().Before(deadline) {
		got, _ = m.Get(job.ID)
		if got != nil && got.Status == AsyncJobFailed {
			break
		}
		time.Sleep(20 * time.Millisecond)
	}
	if got == nil || got.Status != AsyncJobFailed || got.Error == "" {
		t.Fatalf("expected failed job, got %#v", got)
	}
}

func TestAsyncJobManager_Cancel(t *testing.T) {
	m := NewAsyncJobManager()
	defer m.Stop()

	started := make(chan struct{})
	job := m.Submit(AsyncJobScanChannel, "ch1", "", func(ctx context.Context) (any, error) {
		close(started)
		<-ctx.Done()
		return nil, ctx.Err()
	})
	<-started
	if err := m.Cancel(job.ID); err != nil {
		t.Fatalf("Cancel: %v", err)
	}
	deadline := time.Now().Add(2 * time.Second)
	for time.Now().Before(deadline) {
		got, _ := m.Get(job.ID)
		if got != nil && (got.Status == AsyncJobCancelled || got.Status == AsyncJobFailed) {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("expected cancelled/failed after Cancel")
}

func TestScanTimeouts(t *testing.T) {
	if got := scanDeviceTimeout("opc-ua"); got != 180*time.Second {
		t.Fatalf("opc-ua timeout = %v", got)
	}
	if got := scanDeviceTimeout("bacnet-ip"); got != 60*time.Second {
		t.Fatalf("bacnet timeout = %v", got)
	}
	if got := scanChannelTimeout("bacnet-ip"); got != 45*time.Second {
		t.Fatalf("channel timeout = %v", got)
	}
}
