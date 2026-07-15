package core

import (
	"testing"
)

func TestMTUManager(t *testing.T) {
	manager := NewMTUManager()
	deviceID := "test-device"

	// 测试协商MTU
	mtu1 := manager.NegotiateMTU(deviceID, 50000) // 50ms, 应该增加MTU
	if mtu1 <= 512 {
		t.Error("Expected MTU to be greater than 512 for low RTT")
	}

	mtu2 := manager.NegotiateMTU(deviceID, 600000) // 600ms, 应该减少MTU
	if mtu2 >= mtu1 {
		t.Error("Expected MTU to be less than previous MTU for high RTT")
	}

	// 测试获取当前MTU
	currentMTU := manager.GetCurrentMTU(deviceID)
	if currentMTU == 0 {
		t.Error("Expected current MTU to be greater than 0")
	}

	// 测试获取MTU历史记录
	history := manager.GetMTUHistory(deviceID)
	if len(history) == 0 {
		t.Error("Expected MTU history to have records")
	}

	// 测试设置MTU
	manager.SetMTU(deviceID, 1024)
	currentMTU = manager.GetCurrentMTU(deviceID)
	if currentMTU != 1024 {
		t.Errorf("Expected current MTU to be 1024, got %d", currentMTU)
	}

	// 测试清除MTU数据
	manager.ClearMTUData(deviceID)
	currentMTU = manager.GetCurrentMTU(deviceID)
	if currentMTU != 512 {
		t.Errorf("Expected current MTU to be 512 after clearing, got %d", currentMTU)
	}

	history = manager.GetMTUHistory(deviceID)
	if len(history) != 0 {
		t.Errorf("Expected MTU history to be empty after clearing, got %d records", len(history))
	}
}
