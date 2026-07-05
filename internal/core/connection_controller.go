// ConnectionController is a read-only observability module for connection health.
// It classifies errors, records read/connection metrics, and exposes health signals.
//
// Reconnect/dial MUST NOT be triggered through ConnectionController. All reconnect
// behavior goes exclusively through driver.ConnectionManager (EnsureConnected /
// ScheduleReconnect).
package core

import (
	"sync"
	"time"

	"go.uber.org/zap"
)

type ConnectionController struct {
	mu                  sync.Mutex
	state               ConnState
	retryCount          int
	maxRetries          int
	lastRetryTime       time.Time
	lastSuccessTime     time.Time
	coolDownUntil       time.Time
	maxFailCount        int
	driverName          string
	deviceID            string
	protocol            string
	readFailCount       int
	connectionFailCount int
	lastReadTime        time.Time
	lastConnectionTime  time.Time
}

type ConnState int

const (
	ConnStateDisconnected ConnState = iota
	ConnStateConnecting
	ConnStateConnected
	ConnStateRetrying
	ConnStateDead
	ConnStateHealthy
	ConnStateDegraded
)

func (s ConnState) String() string {
	switch s {
	case ConnStateDisconnected:
		return "Disconnected"
	case ConnStateConnecting:
		return "Connecting"
	case ConnStateConnected:
		return "Connected"
	case ConnStateRetrying:
		return "Retrying"
	case ConnStateDead:
		return "Dead"
	case ConnStateHealthy:
		return "Healthy"
	case ConnStateDegraded:
		return "Degraded"
	default:
		return "Unknown"
	}
}

func NewConnectionController(driverName, deviceID, protocol string) *ConnectionController {
	return &ConnectionController{
		state:        ConnStateDisconnected,
		maxRetries:   64,
		maxFailCount: 5,
		driverName:   driverName,
		deviceID:     deviceID,
		protocol:     protocol,
	}
}

func (cc *ConnectionController) SetState(state ConnState) {
	cc.mu.Lock()
	oldState := cc.state
	cc.state = state
	cc.mu.Unlock()

	if oldState != state {
		zap.L().Info("[ConnController] 连接状态变更",
			zap.String("driver", cc.driverName),
			zap.String("deviceID", cc.deviceID),
			zap.String("from", oldState.String()),
			zap.String("to", state.String()),
		)
	}
}

func (cc *ConnectionController) GetState() ConnState {
	cc.mu.Lock()
	defer cc.mu.Unlock()
	return cc.state
}

func (cc *ConnectionController) RecordReadSuccess() {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	cc.readFailCount = 0
	cc.lastReadTime = time.Now()

	if cc.state == ConnStateDegraded {
		cc.state = ConnStateHealthy
		zap.L().Info("[ConnController] 读取恢复，连接状态恢复正常",
			zap.String("driver", cc.driverName),
			zap.String("deviceID", cc.deviceID),
		)
	}
}

func (cc *ConnectionController) RecordReadFailure() {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	cc.readFailCount++
	cc.lastReadTime = time.Now()

	if cc.readFailCount >= cc.maxFailCount && cc.state == ConnStateHealthy {
		cc.state = ConnStateDegraded
		zap.L().Warn("[ConnController] 读取失败次数过多，进入降级状态",
			zap.String("driver", cc.driverName),
			zap.String("deviceID", cc.deviceID),
			zap.Int("readFailCount", cc.readFailCount),
		)
	}
}

func (cc *ConnectionController) RecordConnectionSuccess() {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	cc.retryCount = 0
	cc.connectionFailCount = 0
	cc.lastSuccessTime = time.Now()
	cc.lastConnectionTime = time.Now()

	if cc.state != ConnStateConnected && cc.state != ConnStateHealthy {
		cc.state = ConnStateConnected
		zap.L().Info("[ConnController] 连接恢复",
			zap.String("driver", cc.driverName),
			zap.String("deviceID", cc.deviceID),
		)
	}
}

// RecordConnectionFailure increments observability counters only.
// It does not authorize reconnect; use driver.ConnectionManager for that.
func (cc *ConnectionController) RecordConnectionFailure() (shouldRetry bool, backoff time.Duration) {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	cc.connectionFailCount++
	cc.retryCount++
	cc.lastRetryTime = time.Now()
	cc.lastConnectionTime = time.Now()

	zap.L().Warn("[ConnController] 连接失败（观测）",
		zap.String("driver", cc.driverName),
		zap.String("deviceID", cc.deviceID),
		zap.Int("connectionFailCount", cc.connectionFailCount),
	)

	return false, 0
}

func (cc *ConnectionController) IsConnectionFailure(err error) bool {
	if err == nil {
		return false
	}

	errMsg := err.Error()
	connectionErrors := []string{"connection refused", "connection reset", "network unreachable",
		"no route to host", "broken pipe", "dial tcp", "connection closed",
		"tls handshake", "cannot assign requested address"}

	for _, ce := range connectionErrors {
		if containsIgnoreCase(errMsg, ce) {
			return true
		}
	}

	return false
}

func (cc *ConnectionController) IsReadFailure(err error) bool {
	if err == nil {
		return false
	}

	errMsg := err.Error()
	readErrors := []string{"illegal data address", "illegal function", "slave device failure",
		"memory parity error", "gateway path unavailable", "gateway target device failed",
		"exception", "timeout", "bad response", "invalid data"}

	for _, re := range readErrors {
		if containsIgnoreCase(errMsg, re) {
			return true
		}
	}

	return false
}

// HealthScore returns a 0–1 health signal derived from read/connection failure counts.
func (cc *ConnectionController) HealthScore() float64 {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	score := 1.0
	if cc.maxFailCount > 0 {
		readPenalty := float64(cc.readFailCount) / float64(cc.maxFailCount)
		if readPenalty > 1 {
			readPenalty = 1
		}
		score -= readPenalty * 0.5
	}
	if cc.maxRetries > 0 {
		connPenalty := float64(cc.connectionFailCount) / float64(cc.maxRetries)
		if connPenalty > 1 {
			connPenalty = 1
		}
		score -= connPenalty * 0.5
	}
	if score < 0 {
		return 0
	}
	return score
}

func containsIgnoreCase(s, substr string) bool {
	if len(s) < len(substr) {
		return false
	}

	for i := 0; i <= len(s)-len(substr); i++ {
		if equalIgnoreCase(s[i:i+len(substr)], substr) {
			return true
		}
	}
	return false
}

func equalIgnoreCase(a, b string) bool {
	if len(a) != len(b) {
		return false
	}

	for i := 0; i < len(a); i++ {
		if toLower(a[i]) != toLower(b[i]) {
			return false
		}
	}
	return true
}

func toLower(c byte) byte {
	if c >= 'A' && c <= 'Z' {
		return c + ('a' - 'A')
	}
	return c
}

func (cc *ConnectionController) GetStatus() (state ConnState, retryCount int, maxRetries int, coolDownRemaining time.Duration, lastSuccess time.Time, readFailCount int, connectionFailCount int) {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	remaining := cc.coolDownUntil.Sub(time.Now())
	if remaining < 0 {
		remaining = 0
	}

	return cc.state, cc.retryCount, cc.maxRetries, remaining, cc.lastSuccessTime, cc.readFailCount, cc.connectionFailCount
}

func (cc *ConnectionController) SetMaxRetries(max int) {
	cc.mu.Lock()
	defer cc.mu.Unlock()
	cc.maxRetries = max
}

func (cc *ConnectionController) SetMaxFailCount(max int) {
	cc.mu.Lock()
	defer cc.mu.Unlock()
	cc.maxFailCount = max
}

func (cc *ConnectionController) Reset() {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	cc.retryCount = 0
	cc.readFailCount = 0
	cc.connectionFailCount = 0
	cc.state = ConnStateDisconnected

	zap.L().Info("[ConnController] 连接控制器已重置",
		zap.String("driver", cc.driverName),
		zap.String("deviceID", cc.deviceID),
	)
}
