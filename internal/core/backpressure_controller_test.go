package core

import (
	"sync"
	"testing"
	"time"
)

func TestTokenBucket_AllowAndRefill(t *testing.T) {
	tb := NewTokenBucket(10, 2)
	if !tb.Allow() {
		t.Fatal("first allow should succeed")
	}
	if !tb.Allow() {
		t.Fatal("second allow should succeed within capacity")
	}
	if tb.Allow() {
		t.Fatal("third allow should fail when bucket empty")
	}

	tb.mu.Lock()
	tb.lastTime = time.Now().Add(-200 * time.Millisecond).UnixNano()
	tb.mu.Unlock()
	if !tb.Allow() {
		t.Fatal("allow should succeed after token refill")
	}
}

func TestBackpressureController_AllowWithReason_DeviceLimit(t *testing.T) {
	bc := NewBackpressureController(100, 1000)

	ok, reason := bc.AllowWithReason(ThrottleContext{
		DeviceKey:   "dev-a",
		Protocol:    "modbus-tcp",
		DeviceLimit: 1,
	})
	if !ok || reason != RejectNone {
		t.Fatalf("first allow = (%v, %q)", ok, reason)
	}

	ok, reason = bc.AllowWithReason(ThrottleContext{
		DeviceKey:   "dev-a",
		Protocol:    "modbus-tcp",
		DeviceLimit: 1,
	})
	if ok || reason != RejectDeviceSemaphore {
		t.Fatalf("second device allow = (%v, %q), want device reject", ok, reason)
	}
	bc.Release("dev-a")

	ok, _ = bc.AllowWithReason(ThrottleContext{
		DeviceKey:   "dev-a",
		Protocol:    "modbus-tcp",
		DeviceLimit: 1,
	})
	if !ok {
		t.Fatal("allow after release should succeed")
	}
	bc.Release("dev-a")
}

func TestBackpressureController_GlobalSemaphoreReject(t *testing.T) {
	bc := NewBackpressureController(1, 1000)
	if !bc.Allow("dev-1", 8) {
		t.Fatal("first global allow should succeed")
	}
	if bc.Allow("dev-2", 8) {
		t.Fatal("second global allow should fail")
	}
	if bc.RejectTotal() == 0 {
		t.Fatal("expected reject counter")
	}
	reasons := bc.RejectByReason()
	if reasons[string(RejectGlobalSemaphore)] == 0 {
		t.Fatal("expected global_semaphore reject metric")
	}
	bc.Release("dev-1")
}

func TestBackpressureController_ProtocolRateReject(t *testing.T) {
	bc := NewBackpressureController(512, 1000)

	allowed := 0
	for i := 0; i < 200; i++ {
		key := "dev-rate-" + string(rune('a'+i%26))
		ok, reason := bc.AllowWithReason(ThrottleContext{
			DeviceKey:   key,
			Protocol:    "modbus-tcp",
			DeviceLimit: 100,
		})
		if ok {
			allowed++
			continue
		}
		if reason == RejectProtocolRate {
			break
		}
		if reason == RejectGlobalSemaphore {
			t.Fatalf("unexpected global reject at iteration %d", i)
		}
	}
	if allowed == 0 {
		t.Fatal("expected at least one protocol allow before rate limit")
	}
}

func TestBackpressureController_ReduceTokenRate(t *testing.T) {
	bc := NewBackpressureController(512, 1000)
	_ = bc.Allow("dev-1", 8)
	bc.Release("dev-1")

	before := bc.TokenRate()
	bc.ReduceTokenRate(0.5)
	after := bc.TokenRate()
	if after >= before {
		t.Fatalf("token rate should decrease: before=%v after=%v", before, after)
	}

	bc.ReduceTokenRate(0)
	bc.ReduceTokenRate(1.5)
	var nilBC *BackpressureController
	nilBC.ReduceTokenRate(0.5)
}

func TestBackpressureController_NilSafeMetrics(t *testing.T) {
	var bc *BackpressureController
	if bc.RejectTotal() != 0 {
		t.Fatal("nil RejectTotal should be 0")
	}
	if len(bc.RejectByReason()) != 0 {
		t.Fatal("nil RejectByReason should be empty")
	}
	bc.LogReject("dev", "modbus-tcp", RejectNone)
	bc.LogReject("dev", "modbus-tcp", RejectGlobalSemaphore)
}

func TestBackpressureController_ConcurrentAllowRelease(t *testing.T) {
	bc := NewBackpressureController(32, 1000)
	var wg sync.WaitGroup
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			key := "dev-" + string(rune('a'+id%10))
			if bc.Allow(key, 4) {
				time.Sleep(time.Millisecond)
				bc.Release(key)
			}
		}(i)
	}
	wg.Wait()
}
