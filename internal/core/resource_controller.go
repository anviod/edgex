package core

import (
	"sync"
	"sync/atomic"
	"time"

	"go.uber.org/zap"
)

type ResourceLimits struct {
	GoroutineLimit  int
	FDLimit         int
	ConnectionLimit int
	QueueLimit      int
}

type ResourceController struct {
	limits          ResourceLimits
	goroutineCount  int32
	connectionCount int32
	stopCh          chan struct{}
}

func NewResourceController(limits ResourceLimits) *ResourceController {
	return &ResourceController{
		limits: limits,
		stopCh: make(chan struct{}),
	}
}

func (rc *ResourceController) CanExecute() bool {
	if atomic.LoadInt32(&rc.goroutineCount) >= int32(rc.limits.GoroutineLimit) {
		return false
	}

	if atomic.LoadInt32(&rc.connectionCount) >= int32(rc.limits.ConnectionLimit) {
		return false
	}

	return true
}

func (rc *ResourceController) Acquire() {
	atomic.AddInt32(&rc.goroutineCount, 1)
}

func (rc *ResourceController) Release() {
	atomic.AddInt32(&rc.goroutineCount, -1)
}

func (rc *ResourceController) AcquireConnection() bool {
	count := atomic.AddInt32(&rc.connectionCount, 1)
	if count > int32(rc.limits.ConnectionLimit) {
		atomic.AddInt32(&rc.connectionCount, -1)
		return false
	}
	return true
}

func (rc *ResourceController) ReleaseConnection() {
	atomic.AddInt32(&rc.connectionCount, -1)
}

func (rc *ResourceController) Monitor(wg *sync.WaitGroup) {
	defer wg.Done()

	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			goroutines := atomic.LoadInt32(&rc.goroutineCount)
			connections := atomic.LoadInt32(&rc.connectionCount)

			if goroutines > int32(rc.limits.GoroutineLimit)*9/10 {
				zap.L().Warn("[Resource] goroutine接近上限",
					zap.Int32("current", goroutines),
					zap.Int("limit", rc.limits.GoroutineLimit),
				)
			}

			if connections > int32(rc.limits.ConnectionLimit)*9/10 {
				zap.L().Warn("[Resource] 连接数接近上限",
					zap.Int32("current", connections),
					zap.Int("limit", rc.limits.ConnectionLimit),
				)
			}
		case <-rc.stopCh:
			return
		}
	}
}

func (rc *ResourceController) Stop() {
	close(rc.stopCh)
}

func (rc *ResourceController) GetGoroutineCount() int32 {
	return atomic.LoadInt32(&rc.goroutineCount)
}

func (rc *ResourceController) GetConnectionCount() int32 {
	return atomic.LoadInt32(&rc.connectionCount)
}
