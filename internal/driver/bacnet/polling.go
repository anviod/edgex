package bacnet

import (
	"context"
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
	devCtx.ConsecutiveFailures++
	if devCtx.ConsecutiveFailures >= 3 {
		if devCtx.State != DeviceStateIsolated {
			devCtx.State = DeviceStateIsolated
			backoff := 30 * time.Second * time.Duration(1<<devCtx.IsolationCount)
			if backoff > 10*time.Minute {
				backoff = 10 * time.Minute
			}
			devCtx.IsolationUntil = time.Now().Add(backoff)
			devCtx.IsolationCount++
			zap.L().Warn("Device Isolated (Poller)", zap.Int("id", deviceID), zap.Duration("backoff", backoff))

			// Mark cached values as Bad immediately
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
