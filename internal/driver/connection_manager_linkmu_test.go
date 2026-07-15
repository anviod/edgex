package driver

import (
	"context"
	"sync"
	"testing"
	"time"
)

func TestConnectionManager_LinkMutexHeldDuringConnect(t *testing.T) {
	cm := NewConnectionManager("link-mu")
	defer cm.Close()

	var linkMu sync.Mutex
	cm.SetLinkMutex(&linkMu)

	entered := make(chan struct{})
	release := make(chan struct{})

	errCh := make(chan error, 1)
	go func() {
		errCh <- cm.EnsureConnected(context.Background(), func(ctx context.Context) error {
			close(entered)
			select {
			case <-release:
			case <-ctx.Done():
				return ctx.Err()
			}
			return nil
		})
	}()

	select {
	case <-entered:
	case <-time.After(2 * time.Second):
		t.Fatal("connect did not start")
	}

	if linkMu.TryLock() {
		linkMu.Unlock()
		close(release)
		t.Fatal("linkMu should be held while connectOnce runs")
	}

	close(release)
	select {
	case err := <-errCh:
		if err != nil {
			t.Fatalf("EnsureConnected: %v", err)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("EnsureConnected timed out")
	}
}
