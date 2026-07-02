package core

import (
	"sync"
	"sync/atomic"
	"time"

	"golang.org/x/sync/semaphore"
)

type TokenBucket struct {
	mu        sync.Mutex
	tokens    float64
	rate      float64
	capacity  float64
	lastTime  int64
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

type BackpressureController struct {
	globalSemaphore     *semaphore.Weighted
	perDeviceSemaphores sync.Map
	tokenBucket         *TokenBucket
	rejectTotal         atomic.Uint64
}

func NewBackpressureController(globalLimit int, rate float64) *BackpressureController {
	return &BackpressureController{
		globalSemaphore: semaphore.NewWeighted(int64(globalLimit)),
		tokenBucket:     NewTokenBucket(rate, rate*2),
	}
}

func (bc *BackpressureController) Allow(deviceKey string, deviceLimit int) bool {
	if !bc.tokenBucket.Allow() {
		bc.rejectTotal.Add(1)
		return false
	}

	if !bc.globalSemaphore.TryAcquire(1) {
		bc.rejectTotal.Add(1)
		return false
	}

	sem, _ := bc.perDeviceSemaphores.LoadOrStore(deviceKey, semaphore.NewWeighted(int64(deviceLimit)))
	if !sem.(*semaphore.Weighted).TryAcquire(1) {
		bc.globalSemaphore.Release(1)
		bc.rejectTotal.Add(1)
		return false
	}

	return true
}

func (bc *BackpressureController) Release(deviceKey string) {
	if sem, ok := bc.perDeviceSemaphores.Load(deviceKey); ok {
		sem.(*semaphore.Weighted).Release(1)
	}
	bc.globalSemaphore.Release(1)
}

func (bc *BackpressureController) ReduceTokenRate(factor float64) {
	if bc == nil || bc.tokenBucket == nil || factor <= 0 || factor >= 1 {
		return
	}
	bc.tokenBucket.mu.Lock()
	defer bc.tokenBucket.mu.Unlock()
	bc.tokenBucket.rate *= factor
	if bc.tokenBucket.rate < 1 {
		bc.tokenBucket.rate = 1
	}
}

func (bc *BackpressureController) TokenRate() float64 {
	if bc == nil || bc.tokenBucket == nil {
		return 0
	}
	bc.tokenBucket.mu.Lock()
	defer bc.tokenBucket.mu.Unlock()
	return bc.tokenBucket.rate
}

func (bc *BackpressureController) RejectTotal() uint64 {
	if bc == nil {
		return 0
	}
	return bc.rejectTotal.Load()
}