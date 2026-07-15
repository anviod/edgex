package driver

import (
	"sync"
	"time"
)

// Global reconnect rate limiter — sole Owner for MaxGlobalReconnectRate.
// core.ConnectionController must NOT maintain a parallel counter (ScanEngine §5.3 / v5.2).
var (
	globalReconnectMu       sync.Mutex
	globalReconnectCount    int
	globalReconnectLastTime time.Time
	// MaxGlobalReconnectRate caps reconnect attempts across all ConnectionManagers
	// in a sliding 1-second window (token bucket style).
	MaxGlobalReconnectRate = 10
)

func tryAcquireGlobalReconnectSlot() bool {
	globalReconnectMu.Lock()
	defer globalReconnectMu.Unlock()

	now := time.Now()
	if now.Sub(globalReconnectLastTime) > time.Second {
		globalReconnectCount = 0
		globalReconnectLastTime = now
	}

	if globalReconnectCount >= MaxGlobalReconnectRate {
		return false
	}

	globalReconnectCount++
	return true
}
