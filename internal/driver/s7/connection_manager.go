package s7

import (
	"math"
	"math/rand"
	"sync"
	"time"

	"go.uber.org/zap"
)

// ConnState 连接状态
type ConnState int

const (
	StateDisconnected ConnState = iota
	StateConnecting
	StateConnected
	StateRetrying
	StateDead
)

func (s ConnState) String() string {
	switch s {
	case StateDisconnected:
		return "Disconnected"
	case StateConnecting:
		return "Connecting"
	case StateConnected:
		return "Connected"
	case StateRetrying:
		return "Retrying"
	case StateDead:
		return "Dead"
	default:
		return "Unknown"
	}
}

// ConnectionManager 连接管理器，实现状态机和重连策略
type ConnectionManager struct {
	mu               sync.Mutex
	state            ConnState
	retryCount       int
	maxRetries       int
	lastRetryTime    time.Time
	lastSuccessTime  time.Time
	coolDownUntil    time.Time
	coolDownDuration time.Duration
	coolDownAttempts int
	coolDownBase     time.Duration

	baseDelay     time.Duration
	maxDelay      time.Duration
	backoffFactor float64

	plcType     string
	maxFailCount int

	// 每日清零
	dailyResetTimer   *time.Timer
	dailyResetEnabled bool
}

// NewConnectionManager 创建连接管理器
func NewConnectionManager(plcType string) *ConnectionManager {
	cm := &ConnectionManager{
		state:            StateDisconnected,
		baseDelay:        100 * time.Millisecond,
		maxDelay:         30 * time.Second,
		backoffFactor:    2.0,
		coolDownBase:     1 * time.Minute,
		coolDownDuration: 1 * time.Minute,
		plcType:          plcType,
		dailyResetEnabled: true,
	}

	if plcType == "s7-200smart" {
		cm.maxRetries = 8
		cm.maxFailCount = 3
	} else {
		cm.maxRetries = 64
		cm.maxFailCount = 5
	}

	cm.startDailyReset()

	return cm
}

// startDailyReset 启动每日清零定时器
func (cm *ConnectionManager) startDailyReset() {
	if !cm.dailyResetEnabled {
		return
	}

	now := time.Now()
	nextMidnight := now.Truncate(24 * time.Hour).Add(24 * time.Hour)
	duration := nextMidnight.Sub(now)

	cm.dailyResetTimer = time.AfterFunc(duration, func() {
		cm.ResetDaily()
		cm.startDailyReset()
	})
}

// ResetDaily 每日清零
func (cm *ConnectionManager) ResetDaily() {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	cm.retryCount = 0
	cm.coolDownAttempts = 0
	cm.coolDownDuration = 1 * time.Minute

	zap.L().Info("[S7] Daily reset of connection manager",
		zap.String("plcType", cm.plcType),
	)
}

// SetState 设置状态
func (cm *ConnectionManager) SetState(state ConnState) {
	cm.mu.Lock()
	oldState := cm.state
	cm.state = state
	cm.mu.Unlock()

	if oldState != state {
		zap.L().Info("[S7] Connection state changed",
			zap.String("from", oldState.String()),
			zap.String("to", state.String()),
			zap.String("plcType", cm.plcType),
		)
	}
}

// GetState 获取当前状态
func (cm *ConnectionManager) GetState() ConnState {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	return cm.state
}

// RecordSuccess 记录成功，重置重试计数
func (cm *ConnectionManager) RecordSuccess() {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	cm.retryCount = 0
	cm.lastSuccessTime = time.Now()
	cm.coolDownAttempts = 0
	cm.coolDownDuration = 1 * time.Minute

	if cm.state != StateConnected {
		cm.state = StateConnected
		zap.L().Info("[S7] Connection recovered",
			zap.String("plcType", cm.plcType),
		)
	}
}

// RecordFailure 记录失败，计算退避时间
func (cm *ConnectionManager) RecordFailure() (shouldRetry bool, backoff time.Duration) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	cm.retryCount++
	cm.lastRetryTime = time.Now()

	if cm.state == StateConnected {
		cm.state = StateRetrying
	}

	if cm.retryCount >= cm.maxRetries {
		cm.state = StateDead
		cm.enterCoolDown()
		return false, 0
	}

	backoff = cm.calculateBackoff(cm.retryCount)
	return true, backoff
}

// calculateBackoff 计算指数退避时间
func (cm *ConnectionManager) calculateBackoff(attempt int) time.Duration {
	backoff := cm.baseDelay * time.Duration(math.Pow(cm.backoffFactor, float64(attempt)))
	if backoff > cm.maxDelay {
		backoff = cm.maxDelay
	}

	jitter := time.Duration(rand.Intn(50)) * time.Millisecond
	return backoff + jitter
}

// enterCoolDown 进入冷却期
func (cm *ConnectionManager) enterCoolDown() {
	cm.coolDownAttempts++

	if cm.coolDownAttempts >= 5 {
		cm.coolDownDuration = 1 * time.Hour
	} else {
		cm.coolDownDuration = cm.coolDownBase * time.Duration(1<<(cm.coolDownAttempts-1))
	}

	cm.coolDownUntil = time.Now().Add(cm.coolDownDuration)

	zap.L().Error("[S7] Entering coolDown state",
		zap.String("plcType", cm.plcType),
		zap.Int("retryCount", cm.retryCount),
		zap.Int("maxRetries", cm.maxRetries),
		zap.Duration("coolDownDuration", cm.coolDownDuration),
		zap.Int("coolDownAttempts", cm.coolDownAttempts),
	)
}

// CanRetry 检查是否可以重试
func (cm *ConnectionManager) CanRetry() (canRetry bool, waitTime time.Duration) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	switch cm.state {
	case StateDisconnected, StateConnecting:
		return true, 0
	case StateConnected:
		return false, 0
	case StateRetrying:
		if cm.retryCount >= cm.maxRetries {
			cm.state = StateDead
			cm.enterCoolDown()
			remaining := cm.coolDownUntil.Sub(time.Now())
			return true, remaining
		}
		backoff := cm.calculateBackoff(cm.retryCount)
		return true, backoff
	case StateDead:
		remaining := cm.coolDownUntil.Sub(time.Now())
		if remaining <= 0 {
			cm.state = StateRetrying
			if cm.retryCount >= cm.maxRetries {
				cm.state = StateDead
				cm.enterCoolDown()
				remaining = cm.coolDownUntil.Sub(time.Now())
				return true, remaining
			}
			backoff := cm.calculateBackoff(cm.retryCount)
			return true, backoff
		}
		return true, remaining
	default:
		return false, 0
	}
}

// AttemptHalfOpen 尝试Half-Open探测
func (cm *ConnectionManager) AttemptHalfOpen(success bool) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if success {
		cm.state = StateConnected
		cm.retryCount = 0
		cm.coolDownAttempts = 0
		cm.coolDownDuration = 1 * time.Minute
		cm.lastSuccessTime = time.Now()

		zap.L().Info("[S7] Half-Open probe succeeded, connection recovered",
			zap.String("plcType", cm.plcType),
			zap.Int("coolDownAttempts", cm.coolDownAttempts),
		)
	} else {
		cm.enterCoolDown()

		zap.L().Warn("[S7] Half-Open probe failed, extending coolDown",
			zap.String("plcType", cm.plcType),
			zap.Int("coolDownAttempts", cm.coolDownAttempts),
			zap.Duration("coolDownDuration", cm.coolDownDuration),
		)
	}
}

// GetStatus 获取状态信息
func (cm *ConnectionManager) GetStatus() (state ConnState, retryCount int, maxRetries int, coolDownRemaining time.Duration, lastSuccess time.Time) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	remaining := cm.coolDownUntil.Sub(time.Now())
	if remaining < 0 {
		remaining = 0
	}

	return cm.state, cm.retryCount, cm.maxRetries, remaining, cm.lastSuccessTime
}

// Close 关闭管理器
func (cm *ConnectionManager) Close() {
	if cm.dailyResetTimer != nil {
		cm.dailyResetTimer.Stop()
	}
}

// SetMaxRetries 设置最大重试次数
func (cm *ConnectionManager) SetMaxRetries(max int) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	cm.maxRetries = max
}

// SetBackoffParams 设置退避参数
func (cm *ConnectionManager) SetBackoffParams(base, max time.Duration, factor float64) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	cm.baseDelay = base
	cm.maxDelay = max
	cm.backoffFactor = factor
}