package bacnet

import (
	"context"
	"math/rand"
	"time"

	"github.com/anviod/edgex/internal/model"

	"go.uber.org/zap"
)

// StartPolling starts the background polling loop for a device
func (d *BACnetDriver) StartPolling(deviceID int) {
	d.mu.Lock()
	defer d.mu.Unlock()

	devCtx, ok := d.deviceContexts[deviceID]
	if !ok {
		return
	}

	if devCtx.StopPolling != nil {
		return
	}
	devCtx.StopPolling = make(chan struct{})

	go func() {
		ticker := time.NewTicker(10 * time.Second) // Configurable? Default 10s
		defer ticker.Stop()
		for {
			select {
			case <-devCtx.StopPolling:
				return
			case <-ticker.C:
				d.pollDevice(deviceID)
			}
		}
	}()
}

func (d *BACnetDriver) pollDevice(deviceID int) {
	d.mu.Lock()
	devCtx, ok := d.deviceContexts[deviceID]
	if !ok || devCtx.Scheduler == nil {
		d.mu.Unlock()
		return
	}

	devCtx.CacheMu.RLock()
	if len(devCtx.SubscribedPoints) == 0 {
		devCtx.CacheMu.RUnlock()
		d.mu.Unlock()
		return
	}
	points := make([]model.Point, 0, len(devCtx.SubscribedPoints))
	for _, p := range devCtx.SubscribedPoints {
		points = append(points, p)
	}
	devCtx.CacheMu.RUnlock()

	// Isolation Check
	if devCtx.State == DeviceStateIsolated {
		// Update cached values quality to Bad
		devCtx.CacheMu.Lock()
		for k, v := range devCtx.LastValues {
			v.Quality = "Bad"
			devCtx.LastValues[k] = v
		}
		devCtx.CacheMu.Unlock()

		if time.Now().After(devCtx.IsolationUntil) {
			go d.checkRecovery(deviceID)
		}
		d.mu.Unlock()
		return
	}
	d.mu.Unlock()

	// Network Read
	results, err := devCtx.Scheduler.Read(context.Background(), points)

	// Update Cache & Status
	d.mu.Lock()
	defer d.mu.Unlock()

	// Re-fetch context
	if devCtx, ok = d.deviceContexts[deviceID]; !ok {
		return
	}

	if len(results) == 0 && len(points) > 0 {
		// Silent failure
		d.handleReadFailure(devCtx, deviceID, nil)
	} else if err != nil {
		d.handleReadFailure(devCtx, deviceID, err)
	} else {
		// Success
		if devCtx.State != DeviceStateOnline {
			zap.L().Info("Device Recovered (Poller)", zap.Int("id", deviceID))
			devCtx.State = DeviceStateOnline
			devCtx.ConsecutiveFailures = 0
			devCtx.IsolationCount = 0
		}

		devCtx.CacheMu.Lock()
		if devCtx.LastValues == nil {
			devCtx.LastValues = make(map[string]model.Value)
		}
		now := time.Now()
		for k, v := range results {
			v.CachedAt = now
			devCtx.LastValues[k] = v
		}
		devCtx.CacheMu.Unlock()
	}
}

func (d *BACnetDriver) handleReadFailure(devCtx *DeviceContext, deviceID int, err error) {
	d.checkDailyReset(devCtx)

	devCtx.ConsecutiveFailures++
	if devCtx.ConsecutiveFailures >= 3 {
		if devCtx.State != DeviceStateIsolated {
			devCtx.State = DeviceStateIsolated
			backoff := d.calculateBackoff(devCtx.IsolationCount)
			jitter := time.Duration(rand.Intn(5000)) * time.Millisecond
			totalBackoff := backoff + jitter
			if totalBackoff > 1*time.Hour {
				totalBackoff = 1 * time.Hour
			}
			devCtx.IsolationUntil = time.Now().Add(totalBackoff)
			devCtx.IsolationCount++
			zap.L().Warn("Device Isolated (Poller)", zap.Int("id", deviceID), zap.Duration("backoff", totalBackoff))

			devCtx.CacheMu.Lock()
			for k, v := range devCtx.LastValues {
				v.Quality = "Bad"
				devCtx.LastValues[k] = v
			}
			devCtx.CacheMu.Unlock()
		}
	}
	if err != nil {
		zap.L().Warn("ReadPoints failed (Poller)", zap.Int("device_id", deviceID), zap.Error(err))
	} else {
		zap.L().Warn("ReadPoints returned no results (Poller)", zap.Int("device_id", deviceID))
	}
}

func (d *BACnetDriver) calculateBackoff(attempts int) time.Duration {
	baseDelay := 1 * time.Minute
	maxDelay := 1 * time.Hour
	if attempts <= 0 {
		return baseDelay
	}
	backoff := baseDelay * time.Duration(1<<(attempts-1))
	if backoff > maxDelay {
		return maxDelay
	}
	return backoff
}

func (d *BACnetDriver) checkDailyReset(devCtx *DeviceContext) {
	now := time.Now()
	if devCtx.lastReset.IsZero() {
		devCtx.lastReset = now
		return
	}
	if now.Sub(devCtx.lastReset) >= 24*time.Hour {
		devCtx.IsolationCount = 0
		devCtx.lastReset = now
		zap.L().Debug("BACnet daily reset triggered", zap.Time("last_reset", devCtx.lastReset))
	}
}
