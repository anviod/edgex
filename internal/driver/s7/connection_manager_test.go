package s7

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestNewConnectionManager(t *testing.T) {
	tests := []struct {
		name         string
		plcType      string
		expectedMaxRetries int
		expectedMaxFailCount int
	}{
		{"S7-200Smart", "s7-200smart", 8, 3},
		{"S7-1200", "s7-1200", 64, 5},
		{"S7-1500", "s7-1500", 64, 5},
		{"Unknown", "", 64, 5},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cm := NewConnectionManager(tt.plcType)
			defer cm.Close()

			assert.Equal(t, StateDisconnected, cm.GetState())
			state, retryCount, maxRetries, _, _ := cm.GetStatus()
			assert.Equal(t, StateDisconnected, state)
			assert.Equal(t, 0, retryCount)
			assert.Equal(t, tt.expectedMaxRetries, maxRetries)

			cm.mu.Lock()
			assert.Equal(t, tt.expectedMaxFailCount, cm.maxFailCount)
			assert.Equal(t, 100*time.Millisecond, cm.baseDelay)
			assert.Equal(t, 30*time.Second, cm.maxDelay)
			assert.Equal(t, 2.0, cm.backoffFactor)
			assert.Equal(t, 1*time.Minute, cm.coolDownDuration)
			cm.mu.Unlock()
		})
	}
}

func TestStateTransitions(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	assert.Equal(t, StateDisconnected, cm.GetState())

	cm.SetState(StateConnecting)
	assert.Equal(t, StateConnecting, cm.GetState())

	cm.RecordSuccess()
	assert.Equal(t, StateConnected, cm.GetState())

	shouldRetry, _ := cm.RecordFailure()
	assert.True(t, shouldRetry)
	assert.Equal(t, StateRetrying, cm.GetState())

	cm.RecordSuccess()
	assert.Equal(t, StateConnected, cm.GetState())
	assert.Equal(t, 0, cm.retryCount)
}

func TestRecordFailure_EntersDead(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(2)

	cm.RecordSuccess()
	assert.Equal(t, StateConnected, cm.GetState())

	shouldRetry, _ := cm.RecordFailure()
	assert.True(t, shouldRetry)
	assert.Equal(t, StateRetrying, cm.GetState())

	shouldRetry, _ = cm.RecordFailure()
	assert.False(t, shouldRetry)
	assert.Equal(t, StateDead, cm.GetState())

	state, retryCount, maxRetries, coolDownRemaining, _ := cm.GetStatus()
	assert.Equal(t, StateDead, state)
	assert.Equal(t, 2, retryCount)
	assert.Equal(t, 2, maxRetries)
	assert.True(t, coolDownRemaining > 0)
}

func TestCanRetry(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(3)

	canRetry, wait := cm.CanRetry()
	assert.True(t, canRetry)
	assert.Equal(t, 0*time.Millisecond, wait)

	cm.SetState(StateConnecting)
	canRetry, wait = cm.CanRetry()
	assert.True(t, canRetry)
	assert.Equal(t, 0*time.Millisecond, wait)

	cm.RecordSuccess()
	canRetry, wait = cm.CanRetry()
	assert.False(t, canRetry)
	assert.Equal(t, 0*time.Millisecond, wait)

	cm.RecordFailure()
	canRetry, wait = cm.CanRetry()
	assert.True(t, canRetry)
	assert.True(t, wait > 0)

	cm.RecordFailure()
	cm.RecordFailure()

	canRetry, wait = cm.CanRetry()
	assert.True(t, canRetry)
	assert.True(t, wait > 0)
	assert.Equal(t, StateDead, cm.GetState())
}

func TestAttemptHalfOpen(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(1)
	cm.RecordSuccess()
	cm.RecordFailure()

	assert.Equal(t, StateDead, cm.GetState())

	cm.AttemptHalfOpen(true)
	assert.Equal(t, StateConnected, cm.GetState())
	assert.Equal(t, 0, cm.retryCount)
	assert.Equal(t, 0, cm.coolDownAttempts)
	assert.Equal(t, 1*time.Minute, cm.coolDownDuration)

	cm.RecordFailure()
	assert.Equal(t, StateDead, cm.GetState())

	cm.AttemptHalfOpen(false)
	assert.Equal(t, StateDead, cm.GetState())
	assert.Equal(t, 2, cm.coolDownAttempts)
}

func TestExponentialBackoff(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetBackoffParams(100*time.Millisecond, 1000*time.Millisecond, 2.0)

	backoff1 := cm.calculateBackoff(1)
	assert.True(t, backoff1 >= 200*time.Millisecond && backoff1 <= 250*time.Millisecond)

	backoff2 := cm.calculateBackoff(2)
	assert.True(t, backoff2 >= 400*time.Millisecond && backoff2 <= 450*time.Millisecond)

	backoff3 := cm.calculateBackoff(3)
	assert.True(t, backoff3 >= 800*time.Millisecond && backoff3 <= 850*time.Millisecond)

	backoff4 := cm.calculateBackoff(4)
	assert.True(t, backoff4 >= 1000*time.Millisecond && backoff4 <= 1050*time.Millisecond)

	maxDelay := cm.maxDelay
	assert.Equal(t, 1000*time.Millisecond, maxDelay)
}

func TestCoolDownCycle(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(1)
	cm.RecordSuccess()

	cm.RecordFailure()
	assert.Equal(t, 1*time.Minute, cm.coolDownDuration)
	assert.Equal(t, 1, cm.coolDownAttempts)

	cm.AttemptHalfOpen(false)
	assert.Equal(t, 2*time.Minute, cm.coolDownDuration)
	assert.Equal(t, 2, cm.coolDownAttempts)

	cm.AttemptHalfOpen(false)
	assert.Equal(t, 4*time.Minute, cm.coolDownDuration)
	assert.Equal(t, 3, cm.coolDownAttempts)

	cm.AttemptHalfOpen(false)
	assert.Equal(t, 8*time.Minute, cm.coolDownDuration)
	assert.Equal(t, 4, cm.coolDownAttempts)

	cm.AttemptHalfOpen(false)
	assert.Equal(t, 1*time.Hour, cm.coolDownDuration)
	assert.Equal(t, 5, cm.coolDownAttempts)

	cm.AttemptHalfOpen(false)
	assert.Equal(t, 1*time.Hour, cm.coolDownDuration)
	assert.Equal(t, 6, cm.coolDownAttempts)
}

func TestResetDaily(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(2)
	cm.RecordSuccess()

	cm.RecordFailure()
	cm.RecordFailure()

	assert.Equal(t, 2, cm.retryCount)
	assert.Equal(t, 1, cm.coolDownAttempts)

	cm.ResetDaily()

	assert.Equal(t, 0, cm.retryCount)
	assert.Equal(t, 0, cm.coolDownAttempts)
	assert.Equal(t, 1*time.Minute, cm.coolDownDuration)
}

func TestBackoffEdgeCases(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetBackoffParams(0, 100*time.Millisecond, 2.0)
	backoff := cm.calculateBackoff(1)
	assert.True(t, backoff > 0)

	cm.SetBackoffParams(100*time.Millisecond, 0, 2.0)
	backoff = cm.calculateBackoff(1)
	assert.True(t, backoff > 0)

	cm.SetBackoffParams(100*time.Millisecond, 100*time.Millisecond, 0.5)
	backoff = cm.calculateBackoff(100)
	assert.True(t, backoff <= 150*time.Millisecond)
}

func TestStateEdgeCases(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetState(StateConnected)
	cm.RecordSuccess()
	assert.Equal(t, StateConnected, cm.GetState())

	cm.SetState(StateDead)
	cm.RecordSuccess()
	assert.Equal(t, StateConnected, cm.GetState())

	cm.RecordSuccess()
	cm.RecordFailure()
	assert.Equal(t, StateRetrying, cm.GetState())

	cm.RecordSuccess()
	assert.Equal(t, StateConnected, cm.GetState())
}

func TestMaxRetriesZero(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(0)

	cm.RecordSuccess()
	shouldRetry, _ := cm.RecordFailure()
	assert.False(t, shouldRetry)
	assert.Equal(t, StateDead, cm.GetState())
}

func TestCoolDownRemaining(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(1)
	cm.RecordSuccess()
	cm.RecordFailure()

	state, _, _, coolDownRemaining, _ := cm.GetStatus()
	assert.Equal(t, StateDead, state)
	assert.True(t, coolDownRemaining > 0)
	assert.True(t, coolDownRemaining <= 1*time.Minute)

	cm.coolDownUntil = time.Now().Add(-1 * time.Second)
	_, _, _, coolDownRemaining, _ = cm.GetStatus()
	assert.Equal(t, 0*time.Second, coolDownRemaining)
}

func TestGetStatus(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	state, retryCount, maxRetries, coolDownRemaining, lastSuccess := cm.GetStatus()
	assert.Equal(t, StateDisconnected, state)
	assert.Equal(t, 0, retryCount)
	assert.Equal(t, 64, maxRetries)
	assert.Equal(t, 0*time.Second, coolDownRemaining)
	assert.True(t, lastSuccess.IsZero())

	cm.RecordSuccess()
	state, retryCount, maxRetries, coolDownRemaining, lastSuccess = cm.GetStatus()
	assert.Equal(t, StateConnected, state)
	assert.Equal(t, 0, retryCount)
	assert.False(t, lastSuccess.IsZero())
}

func TestS7200SmartLimits(t *testing.T) {
	cm := NewConnectionManager("s7-200smart")
	defer cm.Close()

	assert.Equal(t, 8, cm.maxRetries)
	assert.Equal(t, 3, cm.maxFailCount)

	for i := 0; i < 8; i++ {
		if i == 0 {
			cm.RecordSuccess()
		}
		shouldRetry, _ := cm.RecordFailure()
		if i < 7 {
			assert.True(t, shouldRetry)
		} else {
			assert.False(t, shouldRetry)
		}
	}

	assert.Equal(t, StateDead, cm.GetState())
}

func TestConcurrentAccess(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	done := make(chan bool)
	go func() {
		for i := 0; i < 1000; i++ {
			cm.GetState()
			cm.GetStatus()
		}
		done <- true
	}()

	go func() {
		for i := 0; i < 100; i++ {
			cm.RecordSuccess()
			cm.RecordFailure()
		}
		done <- true
	}()

	<-done
	<-done
}

func TestRecordSuccessResetsAll(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(3)
	cm.RecordSuccess()

	cm.RecordFailure()
	cm.RecordFailure()
	cm.RecordFailure()

	assert.Equal(t, 3, cm.retryCount)
	assert.Equal(t, 1, cm.coolDownAttempts)

	cm.RecordSuccess()

	assert.Equal(t, 0, cm.retryCount)
	assert.Equal(t, 0, cm.coolDownAttempts)
	assert.Equal(t, 1*time.Minute, cm.coolDownDuration)
	assert.Equal(t, StateConnected, cm.GetState())
}

func TestCanRetryFromDeadAfterCoolDown(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(2)
	cm.RecordSuccess()
	cm.RecordFailure()
	cm.RecordFailure()

	assert.Equal(t, StateDead, cm.GetState())

	cm.coolDownUntil = time.Now().Add(-1 * time.Second)
	canRetry, wait := cm.CanRetry()
	assert.True(t, canRetry)
	assert.True(t, wait > 0)
	assert.Equal(t, StateDead, cm.GetState())
}

func TestCanRetryFromDead_WithAvailableRetries(t *testing.T) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(5)
	cm.RecordSuccess()
	cm.RecordFailure()

	assert.Equal(t, StateRetrying, cm.GetState())

	cm.SetState(StateDead)
	cm.coolDownUntil = time.Now().Add(-1 * time.Second)

	canRetry, wait := cm.CanRetry()
	assert.True(t, canRetry)
	assert.True(t, wait > 0)
	assert.Equal(t, StateRetrying, cm.GetState())
}

func BenchmarkRecordSuccess(b *testing.B) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		cm.RecordSuccess()
	}
}

func BenchmarkRecordFailure(b *testing.B) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(b.N + 1)
	cm.RecordSuccess()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		cm.RecordFailure()
	}
}

func BenchmarkCanRetry(b *testing.B) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		cm.CanRetry()
	}
}

func BenchmarkCalculateBackoff(b *testing.B) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		cm.calculateBackoff(i % 10)
	}
}

func BenchmarkGetStatus(b *testing.B) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		cm.GetStatus()
	}
}

func BenchmarkConcurrentRecordSuccess(b *testing.B) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			cm.RecordSuccess()
		}
	})
}

func BenchmarkConcurrentRecordFailure(b *testing.B) {
	cm := NewConnectionManager("s7-1200")
	defer cm.Close()

	cm.SetMaxRetries(b.N * 10)
	cm.RecordSuccess()

	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			cm.RecordFailure()
		}
	})
}