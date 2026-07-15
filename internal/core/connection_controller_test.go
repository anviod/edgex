package core

import (
	"errors"
	"testing"
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
	stateBefore := cc.GetState()

	shouldRetry, backoff := cc.RecordConnectionFailure()

	if shouldRetry {
		t.Error("观测层不应授权重试")
	}
	if backoff != 0 {
		t.Errorf("观测层不应返回退避，实际%v", backoff)
	}
	if cc.GetState() != stateBefore {
		t.Errorf("RecordConnectionFailure 不应改变连接态，期望 %s，实际 %s", stateBefore, cc.GetState())
	}
	_, _, _, _, _, _, connectionFailCount := cc.GetStatus()
	if connectionFailCount != 1 {
		t.Errorf("connectionFailCount 应为 1，实际 %d", connectionFailCount)
	}
}

func TestConnectionController_IsConnectionFailure(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")

	testCases := []struct {
		err      error
		expected bool
		desc     string
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
		err      error
		expected bool
		desc     string
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

func TestConnectionController_HealthScore(t *testing.T) {
	cc := NewConnectionController("modbus", "device1", "modbus-tcp")
	if cc.HealthScore() != 1.0 {
		t.Fatalf("初始 HealthScore 应为 1.0，实际 %v", cc.HealthScore())
	}

	cc.RecordReadFailure()
	if cc.HealthScore() >= 1.0 {
		t.Fatal("读取失败后 HealthScore 应下降")
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
