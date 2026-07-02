package core

import (
	"runtime"
	"sync"
	"sync/atomic"
	"time"
)

const (
	gcMonitorInterval      = 5 * time.Second
	gcPauseThresholdMs       = 10.0
	gcBackpressureRateFactor = 0.5
)

type GCMonitorMetrics struct {
	PauseMaxMs        atomic.Uint64
	AllocRateBytesSec atomic.Uint64
}

type GCMonitor struct {
	stopCh   chan struct{}
	stopOnce sync.Once
	metrics  GCMonitorMetrics

	onHighPause func(pauseMaxMs float64)
}

func NewGCMonitor(onHighPause func(pauseMaxMs float64)) *GCMonitor {
	return &GCMonitor{
		stopCh:      make(chan struct{}),
		onHighPause: onHighPause,
	}
}

func (m *GCMonitor) Metrics() *GCMonitorMetrics {
	return &m.metrics
}

func (m *GCMonitor) Start() {
	go m.loop()
}

func (m *GCMonitor) Stop() {
	m.stopOnce.Do(func() {
		close(m.stopCh)
	})
}

func (m *GCMonitor) loop() {
	ticker := time.NewTicker(gcMonitorInterval)
	defer ticker.Stop()

	var lastTotalAlloc uint64
	var lastSampleAt time.Time

	for {
		select {
		case <-m.stopCh:
			return
		case now := <-ticker.C:
			var ms runtime.MemStats
			runtime.ReadMemStats(&ms)

			if !lastSampleAt.IsZero() {
				elapsed := now.Sub(lastSampleAt).Seconds()
				if elapsed > 0 {
					allocRate := float64(ms.TotalAlloc-lastTotalAlloc) / elapsed
					m.metrics.AllocRateBytesSec.Store(uint64(allocRate))
				}
			}
			lastTotalAlloc = ms.TotalAlloc
			lastSampleAt = now

			if ms.NumGC > 0 {
				idx := (ms.NumGC + 255) % 256
				pauseMs := float64(ms.PauseNs[idx]) / float64(time.Millisecond)
				m.metrics.PauseMaxMs.Store(uint64(pauseMs * 1000))

				if pauseMs >= gcPauseThresholdMs && m.onHighPause != nil {
					m.onHighPause(pauseMs)
				}
			}
		}
	}
}

func (m *GCMonitorMetrics) Snapshot() map[string]any {
	return map[string]any{
		"gc_pause_max_ms":        float64(m.PauseMaxMs.Load()) / 1000.0,
		"alloc_rate_bytes_sec": m.AllocRateBytesSec.Load(),
	}
}
