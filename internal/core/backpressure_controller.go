package core

import (
	"sync"
	"sync/atomic"
	"time"

	"go.uber.org/zap"
	"golang.org/x/sync/semaphore"
)

type TokenBucket struct {
	mu       sync.Mutex
	tokens   float64
	rate     float64
	capacity float64
	lastTime int64
}

func NewTokenBucket(rate float64, capacity float64) *TokenBucket {
	return &TokenBucket{
		tokens:   capacity,
		rate:     rate,
		capacity: capacity,
	}
}

func (tb *TokenBucket) Allow() bool {
	tb.mu.Lock()
	defer tb.mu.Unlock()

	now := time.Now().UnixNano()
	elapsed := float64(now-tb.lastTime) / 1e9
	tb.lastTime = now

	tb.tokens += elapsed * tb.rate
	if tb.tokens > tb.capacity {
		tb.tokens = tb.capacity
	}

	if tb.tokens >= 1 {
		tb.tokens--
		return true
	}

	return false
}

type RejectReason string

const (
	RejectNone            RejectReason = ""
	RejectGlobalSemaphore RejectReason = "global_semaphore"
	RejectDeviceSemaphore RejectReason = "device_semaphore"
	RejectProtocolRate    RejectReason = "protocol_rate"
)

type ThrottleContext struct {
	DeviceKey   string
	Protocol    string
	DeviceLimit int
}

type BackpressureController struct {
	globalSemaphore     *semaphore.Weighted
	perDeviceSemaphores sync.Map
	protocolBuckets     sync.Map
	rejectTotal         atomic.Uint64
	rejectByReason      sync.Map // RejectReason -> *atomic.Uint64
}

func NewBackpressureController(globalLimit int, _ float64) *BackpressureController {
	return &BackpressureController{
		globalSemaphore: semaphore.NewWeighted(int64(globalLimit)),
	}
}

func (bc *BackpressureController) protocolBucket(group string) *TokenBucket {
	if raw, ok := bc.protocolBuckets.Load(group); ok {
		return raw.(*TokenBucket)
	}
	rate := protocolCongestionRate(group)
	b := NewTokenBucket(rate, rate*2)
	actual, _ := bc.protocolBuckets.LoadOrStore(group, b)
	return actual.(*TokenBucket)
}

func (bc *BackpressureController) recordReject(reason RejectReason) {
	bc.rejectTotal.Add(1)
	if reason == RejectNone {
		return
	}
	counter, _ := bc.rejectByReason.LoadOrStore(reason, &atomic.Uint64{})
	counter.(*atomic.Uint64).Add(1)
}

func (bc *BackpressureController) AllowWithReason(ctx ThrottleContext) (bool, RejectReason) {
	if !bc.globalSemaphore.TryAcquire(1) {
		bc.recordReject(RejectGlobalSemaphore)
		return false, RejectGlobalSemaphore
	}

	sem, _ := bc.perDeviceSemaphores.LoadOrStore(ctx.DeviceKey, semaphore.NewWeighted(int64(ctx.DeviceLimit)))
	if !sem.(*semaphore.Weighted).TryAcquire(1) {
		bc.globalSemaphore.Release(1)
		bc.recordReject(RejectDeviceSemaphore)
		return false, RejectDeviceSemaphore
	}

	group := protocolCongestionGroup(ctx.Protocol)
	if !bc.protocolBucket(group).Allow() {
		sem.(*semaphore.Weighted).Release(1)
		bc.globalSemaphore.Release(1)
		bc.recordReject(RejectProtocolRate)
		return false, RejectProtocolRate
	}

	return true, RejectNone
}

func (bc *BackpressureController) Allow(deviceKey string, deviceLimit int) bool {
	ok, _ := bc.AllowWithReason(ThrottleContext{
		DeviceKey:   deviceKey,
		Protocol:    "default",
		DeviceLimit: deviceLimit,
	})
	return ok
}

func (bc *BackpressureController) Release(deviceKey string) {
	if sem, ok := bc.perDeviceSemaphores.Load(deviceKey); ok {
		sem.(*semaphore.Weighted).Release(1)
	}
	bc.globalSemaphore.Release(1)
}

func (bc *BackpressureController) ReduceTokenRate(factor float64) {
	if bc == nil || factor <= 0 || factor >= 1 {
		return
	}
	reduce := func(tb *TokenBucket) {
		tb.mu.Lock()
		tb.rate *= factor
		if tb.rate < 1 {
			tb.rate = 1
		}
		tb.mu.Unlock()
	}
	bc.protocolBuckets.Range(func(_, value any) bool {
		reduce(value.(*TokenBucket))
		return true
	})
	reduce(bc.protocolBucket("default"))
}

func (bc *BackpressureController) TokenRate() float64 {
	tb := bc.protocolBucket("default")
	tb.mu.Lock()
	defer tb.mu.Unlock()
	return tb.rate
}

func (bc *BackpressureController) RejectTotal() uint64 {
	if bc == nil {
		return 0
	}
	return bc.rejectTotal.Load()
}

func (bc *BackpressureController) RejectByReason() map[string]uint64 {
	out := map[string]uint64{}
	if bc == nil {
		return out
	}
	bc.rejectByReason.Range(func(key, value any) bool {
		out[string(key.(RejectReason))] = value.(*atomic.Uint64).Load()
		return true
	})
	return out
}

func (bc *BackpressureController) LogReject(deviceKey, protocol string, reason RejectReason) {
	if reason == RejectNone {
		return
	}
	zap.L().Debug("[Throttling] reject",
		zap.String("device", deviceKey),
		zap.String("reason", string(reason)),
		zap.String("protocol", protocol),
	)
}
