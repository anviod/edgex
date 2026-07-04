package core

import (
	"sync"
	"time"

	"go.uber.org/zap"
)

var (
	globalReconnectMu     sync.Mutex
	globalReconnectCount  int
	globalReconnectLastTime time.Time
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

func calculateBackOffInterval(failCount int) time.Duration {
	switch {
	case failCount <= 2:
		return 5 * time.Second
	case failCount <= 5:
		return 15 * time.Second
	case failCount <= 10:
		return 30 * time.Second
	case failCount <= 15:
		return 60 * time.Second
	default:
		return 120 * time.Second
	}
}

type ConnectionController struct {
	mu                  sync.Mutex
	state               ConnState
	retryCount          int
	maxRetries          int
	lastRetryTime       time.Time
	lastSuccessTime     time.Time
	coolDownUntil       time.Time
	coolDownDuration    time.Duration
	coolDownAttempts    int
	coolDownBase        time.Duration
	baseDelay           time.Duration
	maxDelay            time.Duration
	backoffFactor       float64
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
	cc := &ConnectionController{
		state:            ConnStateDisconnected,
		baseDelay:        100 * time.Millisecond,
		maxDelay:         30 * time.Second,
		backoffFactor:    2.0,
		coolDownBase:     1 * time.Minute,
		coolDownDuration: 1 * time.Minute,
		maxRetries:       64,
		maxFailCount:     5,
		driverName:       driverName,
		deviceID:         deviceID,
		protocol:         protocol,
	}

	return cc
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
	cc.coolDownAttempts = 0
	cc.coolDownDuration = 1 * time.Minute

	if cc.state != ConnStateConnected && cc.state != ConnStateHealthy {
		cc.state = ConnStateConnected
		zap.L().Info("[ConnController] 连接恢复",
			zap.String("driver", cc.driverName),
			zap.String("deviceID", cc.deviceID),
		)
	}
}

func (cc *ConnectionController) RecordConnectionFailure() (shouldRetry bool, backoff time.Duration) {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	cc.connectionFailCount++
	cc.retryCount++
	cc.lastRetryTime = time.Now()

	if cc.state == ConnStateConnected || cc.state == ConnStateHealthy || cc.state == ConnStateDegraded {
		cc.state = ConnStateRetrying
	}

	if cc.retryCount >= cc.maxRetries {
		cc.state = ConnStateDead
		cc.enterCoolDown()
		return false, 0
	}

	if !tryAcquireGlobalReconnectSlot() {
		zap.L().Warn("[ConnController] 全局重连限流，推迟重连",
			zap.String("driver", cc.driverName),
			zap.String("deviceID", cc.deviceID),
		)
		return true, 1 * time.Second
	}

	backoff = cc.calculateBackoff(cc.retryCount)
	return true, backoff
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

func (cc *ConnectionController) calculateBackoff(attempt int) time.Duration {
	backoff := cc.baseDelay * time.Duration(float64(1) * pow(cc.backoffFactor, float64(attempt)))
	if backoff > cc.maxDelay {
		backoff = cc.maxDelay
	}

	return backoff
}

func pow(base, exp float64) float64 {
	result := 1.0
	for i := 0; i < int(exp); i++ {
		result *= base
	}
	return result
}

func (cc *ConnectionController) enterCoolDown() {
	cc.coolDownAttempts++

	if cc.coolDownAttempts >= 5 {
		cc.coolDownDuration = 1 * time.Hour
	} else {
		cc.coolDownDuration = cc.coolDownBase * time.Duration(1<<(cc.coolDownAttempts-1))
	}

	cc.coolDownUntil = time.Now().Add(cc.coolDownDuration)

	zap.L().Error("[ConnController] 进入冷却期",
		zap.String("driver", cc.driverName),
		zap.String("deviceID", cc.deviceID),
		zap.Int("retryCount", cc.retryCount),
		zap.Int("maxRetries", cc.maxRetries),
		zap.Duration("coolDownDuration", cc.coolDownDuration),
		zap.Int("coolDownAttempts", cc.coolDownAttempts),
	)
}

func (cc *ConnectionController) CanRetry() (canRetry bool, waitTime time.Duration) {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	switch cc.state {
	case ConnStateDisconnected:
		if !tryAcquireGlobalReconnectSlot() {
			return true, 1 * time.Second
		}
		return true, 0
	case ConnStateConnecting:
		if cc.retryCount > 0 {
			if !tryAcquireGlobalReconnectSlot() {
				return true, 1 * time.Second
			}
			return true, cc.calculateBackoff(cc.retryCount)
		}
		if !tryAcquireGlobalReconnectSlot() {
			return true, 1 * time.Second
		}
		return true, 0
	case ConnStateConnected, ConnStateHealthy:
		return false, 0
	case ConnStateDegraded:
		if !tryAcquireGlobalReconnectSlot() {
			return true, 1 * time.Second
		}
		backoff := cc.calculateBackoff(cc.readFailCount)
		return true, backoff
	case ConnStateRetrying:
		if cc.retryCount >= cc.maxRetries {
			cc.state = ConnStateDead
			cc.enterCoolDown()
			remaining := cc.coolDownUntil.Sub(time.Now())
			return true, remaining
		}
		if !tryAcquireGlobalReconnectSlot() {
			return true, 1 * time.Second
		}
		backoff := cc.calculateBackoff(cc.retryCount)
		return true, backoff
	case ConnStateDead:
		remaining := cc.coolDownUntil.Sub(time.Now())
		if remaining <= 0 {
			cc.state = ConnStateRetrying
			if cc.retryCount >= cc.maxRetries {
				cc.state = ConnStateDead
				cc.enterCoolDown()
				remaining = cc.coolDownUntil.Sub(time.Now())
				return true, remaining
			}
			if !tryAcquireGlobalReconnectSlot() {
				return true, 1 * time.Second
			}
			backoff := cc.calculateBackoff(cc.retryCount)
			return true, backoff
		}
		return true, remaining
	default:
		return false, 0
	}
}

func (cc *ConnectionController) AttemptHalfOpen(success bool) {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	if success {
		cc.state = ConnStateConnected
		cc.retryCount = 0
		cc.coolDownAttempts = 0
		cc.coolDownDuration = 1 * time.Minute
		cc.lastSuccessTime = time.Now()

		zap.L().Info("[ConnController] Half-Open探测成功",
			zap.String("driver", cc.driverName),
			zap.String("deviceID", cc.deviceID),
			zap.Int("coolDownAttempts", cc.coolDownAttempts),
		)
	} else {
		cc.enterCoolDown()

		zap.L().Warn("[ConnController] Half-Open探测失败",
			zap.String("driver", cc.driverName),
			zap.String("deviceID", cc.deviceID),
			zap.Int("coolDownAttempts", cc.coolDownAttempts),
			zap.Duration("coolDownDuration", cc.coolDownDuration),
		)
	}
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

func (cc *ConnectionController) SetBackoffParams(base, max time.Duration, factor float64) {
	cc.mu.Lock()
	defer cc.mu.Unlock()
	cc.baseDelay = base
	cc.maxDelay = max
	cc.backoffFactor = factor
}

func (cc *ConnectionController) Reset() {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	cc.retryCount = 0
	cc.readFailCount = 0
	cc.connectionFailCount = 0
	cc.coolDownAttempts = 0
	cc.coolDownDuration = 1 * time.Minute
	cc.state = ConnStateDisconnected

	zap.L().Info("[ConnController] 连接控制器已重置",
		zap.String("driver", cc.driverName),
		zap.String("deviceID", cc.deviceID),
	)
}