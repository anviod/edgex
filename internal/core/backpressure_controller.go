package core

import (
	"sync"
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
}

func NewBackpressureController(globalLimit int, rate float64) *BackpressureController {
	return &BackpressureController{
		globalSemaphore: semaphore.NewWeighted(int64(globalLimit)),
		tokenBucket:     NewTokenBucket(rate, rate*2),
	}
}

func (bc *BackpressureController) Allow(deviceKey string, deviceLimit int) bool {
	if !bc.tokenBucket.Allow() {
		return false
	}

	if !bc.globalSemaphore.TryAcquire(1) {
		return false
	}

	sem, _ := bc.perDeviceSemaphores.LoadOrStore(deviceKey, semaphore.NewWeighted(int64(deviceLimit)))
	if !sem.(*semaphore.Weighted).TryAcquire(1) {
		bc.globalSemaphore.Release(1)
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