package core

import (
	"errors"
	"testing"
	"time"
)

func TestConnectionController_New(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	if cc.driverName != "modbus" {
		t.Errorf("driverName不匹配，期望modbus，实际%s", cc.driverName)
	}
	if cc.deviceID != "device1" {
		t.Errorf("deviceID不匹配，期望device1，实际%s", cc.deviceID)
	}
	if cc.protocol != "modbus-tcp" {
		t.Errorf("protocol不匹配，期望modbus-tcp，实际%s", cc.protocol)
	}
	if cc.GetState() != ConnStateDisconnected {
		t.Errorf("初始状态应为Disconnected，实际%s", cc.GetState())
	}
}

func TestConnectionController_RecordConnectionSuccess(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	cc.RecordConnectionSuccess()

	if cc.GetState() != ConnStateConnected {
		t.Errorf("状态应为Connected，实际%s", cc.GetState())
	}
}

func TestConnectionController_RecordConnectionFailure(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	cc.RecordConnectionSuccess()

	shouldRetry, backoff := cc.RecordConnectionFailure()

	if !shouldRetry {
		t.Error("应允许重试")
	}
	if backoff <= 0 {
		t.Errorf("退避时间应大于0，实际%v", backoff)
	}
	if cc.GetState() != ConnStateRetrying {
		t.Errorf("状态应为Retrying，实际%s", cc.GetState())
	}
}

func TestConnectionController_IsConnectionFailure(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	testCases := []struct {
		err        error
		expected   bool
		desc       string
	}{
		{errors.New("connection refused"), true, "连接拒绝"},
		{errors.New("connection reset by peer"), true, "连接重置"},
		{errors.New("network unreachable"), true, "网络不可达"},
		{errors.New("dial tcp 192.168.1.1:502: connect: connection refused"), true, "拨号失败"},
		{errors.New("i/o timeout"), false, "I/O超时"},
		{errors.New("illegal data address"), false, "非法地址"},
		{errors.New("illegal function"), false, "非法功能码"},
		{errors.New("slave device failure"), false, "从站故障"},
		{nil, false, "无错误"},
	}

	for _, tc := range testCases {
		result := cc.IsConnectionFailure(tc.err)
		if result != tc.expected {
			t.Errorf("%s: 期望%v，实际%v，错误信息：%v", tc.desc, tc.expected, result, tc.err)
		}
	}
}

func TestConnectionController_IsReadFailure(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	testCases := []struct {
		err        error
		expected   bool
		desc       string
	}{
		{errors.New("illegal data address"), true, "非法地址"},
		{errors.New("illegal function"), true, "非法功能码"},
		{errors.New("slave device failure"), true, "从站故障"},
		{errors.New("exception 2"), true, "异常码2"},
		{errors.New("timeout"), true, "超时"},
		{errors.New("connection refused"), false, "连接拒绝"},
		{errors.New("connection reset by peer"), false, "连接重置"},
		{nil, false, "无错误"},
	}

	for _, tc := range testCases {
		result := cc.IsReadFailure(tc.err)
		if result != tc.expected {
			t.Errorf("%s: 期望%v，实际%v，错误信息：%v", tc.desc, tc.expected, result, tc.err)
		}
	}
}

func TestConnectionController_RecordReadSuccess(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	cc.SetState(ConnStateDegraded)
	cc.RecordReadSuccess()

	if cc.GetState() != ConnStateHealthy {
		t.Errorf("状态应为Healthy，实际%s", cc.GetState())
	}
}

func TestConnectionController_RecordReadFailure(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	cc.SetState(ConnStateHealthy)

	for i := 0; i < cc.maxFailCount; i++ {
		cc.RecordReadFailure()
	}

	if cc.GetState() != ConnStateDegraded {
		t.Errorf("状态应为Degraded，实际%s", cc.GetState())
	}
}

func TestConnectionController_CanRetry(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	canRetry, waitTime := cc.CanRetry()
	if !canRetry {
		t.Error("Disconnected状态应允许重试")
	}
	if waitTime != 0 {
		t.Errorf("Disconnected状态等待时间应为0，实际%v", waitTime)
	}

	cc.RecordConnectionSuccess()
	canRetry, waitTime = cc.CanRetry()
	if canRetry {
		t.Error("Connected状态不应允许重试")
	}

	cc.RecordConnectionFailure()
	canRetry, waitTime = cc.CanRetry()
	if !canRetry {
		t.Error("Retrying状态应允许重试")
	}
	if waitTime <= 0 {
		t.Errorf("Retrying状态应有退避时间，实际%v", waitTime)
	}
}

func TestConnectionController_GlobalReconnectRateLimit(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	originalRate := MaxGlobalReconnectRate
	MaxGlobalReconnectRate = 2

	defer func() {
		MaxGlobalReconnectRate = originalRate
	}()

	for i := 0; i < 3; i++ {
		cc.RecordConnectionFailure()
	}

	canRetry, waitTime := cc.CanRetry()
	if !canRetry {
		t.Error("应允许重试")
	}
	if waitTime != 1*time.Second {
		t.Errorf("超过全局限流时应等待1秒，实际%v", waitTime)
	}
}

func TestConnectionController_CalculateBackoff(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	backoff1 := cc.calculateBackoff(1)
	backoff2 := cc.calculateBackoff(2)
	backoff3 := cc.calculateBackoff(3)

	if backoff1 >= backoff2 {
		t.Errorf("退避时间应递增，backoff1=%v, backoff2=%v", backoff1, backoff2)
	}
	if backoff2 >= backoff3 {
		t.Errorf("退避时间应递增，backoff2=%v, backoff3=%v", backoff2, backoff3)
	}
}

func TestConnectionController_AttemptHalfOpen(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	cc.SetState(ConnStateDead)
	cc.enterCoolDown()

	cc.AttemptHalfOpen(true)
	if cc.GetState() != ConnStateConnected {
		t.Errorf("Half-Open成功后状态应为Connected，实际%s", cc.GetState())
	}

	cc.SetState(ConnStateDead)
	cc.enterCoolDown()

	cc.AttemptHalfOpen(false)
	if cc.GetState() == ConnStateConnected {
		t.Errorf("Half-Open失败后状态不应为Connected")
	}
}

func TestConnectionController_Reset(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	cc.RecordConnectionSuccess()
	cc.RecordReadFailure()
	cc.RecordConnectionFailure()

	cc.Reset()

	if cc.GetState() != ConnStateDisconnected {
		t.Errorf("重置后状态应为Disconnected，实际%s", cc.GetState())
	}
}