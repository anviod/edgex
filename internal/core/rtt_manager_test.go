package core

import (
	"testing"
)

func TestRTTManager(t *testing.T) {
	manager := NewRTTManager()
	deviceID := "test-device"

	// 测试更新RTT
	manager.UpdateRTT(deviceID, 100000) // 100ms
	manager.UpdateRTT(deviceID, 150000) // 150ms
	manager.UpdateRTT(deviceID, 120000) // 120ms

	// 测试获取EWMA RTT
	ewmaRTT := manager.GetEWMARTT(deviceID)
	if ewmaRTT == 0 {
		t.Error("Expected EWMA RTT to be greater than 0")
	}

	// 测试获取RTT采样数据
	samples := manager.GetRTTSamples(deviceID)
	if len(samples) != 3 {
		t.Errorf("Expected 3 samples, got %d", len(samples))
	}

	// 测试获取平均RTT
	averageRTT := manager.GetAverageRTT(deviceID)
	if averageRTT == 0 {
		t.Error("Expected average RTT to be greater than 0")
	}

	// 测试获取最大RTT
	maxRTT := manager.GetMaxRTT(deviceID)
	if maxRTT != 150000 {
		t.Errorf("Expected max RTT to be 150000, got %d", maxRTT)
	}

	// 测试清除RTT数据
	manager.ClearRTTData(deviceID)
	ewmaRTT = manager.GetEWMARTT(deviceID)
	if ewmaRTT != 0 {
		t.Error("Expected EWMA RTT to be 0 after clearing")
	}

	samples = manager.GetRTTSamples(deviceID)
	if len(samples) != 0 {
		t.Errorf("Expected 0 samples after clearing, got %d", len(samples))
	}
}
