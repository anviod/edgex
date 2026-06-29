package bacnet

import (
	"math/rand"
	"time"

	"go.uber.org/zap"
)

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

// handleReadFailure is retained for unit tests covering backoff/isolation math.
// ScanEngine owns runtime backoff; this is not invoked from ReadPoints.
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
			zap.L().Warn("Device Isolated", zap.Int("id", deviceID), zap.Duration("backoff", totalBackoff))

			devCtx.CacheMu.Lock()
			for k, v := range devCtx.LastValues {
				v.Quality = "Bad"
				devCtx.LastValues[k] = v
			}
			devCtx.CacheMu.Unlock()
		}
	}
	if err != nil {
		zap.L().Warn("BACnet read failed", zap.Int("device_id", deviceID), zap.Error(err))
	} else {
		zap.L().Warn("BACnet read returned no results", zap.Int("device_id", deviceID))
	}
}
