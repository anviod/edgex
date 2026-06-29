package modbus

import (
	"time"

	"github.com/anviod/edgex/internal/core"
)

// planTransportReconnect decides whether to reconnect when the shared Modbus
// transport socket is down. The connection controller may still report Connected
// after an internal transport disconnect that was not surfaced as a connection
// failure; treating that as non-retryable would block every device on the channel.
func planTransportReconnect(cc *core.ConnectionController) (canRetry bool, wait time.Duration) {
	if cc == nil {
		return true, 0
	}

	canRetry, wait = cc.CanRetry()
	if canRetry {
		return canRetry, wait
	}

	switch cc.GetState() {
	case core.ConnStateConnected, core.ConnStateHealthy, core.ConnStateDegraded:
		return true, 0
	default:
		return false, 0
	}
}
