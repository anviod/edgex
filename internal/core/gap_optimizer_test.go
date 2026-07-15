package core

import (
	"testing"
)

func TestGapOptimizer(t *testing.T) {
	optimizer := NewGapOptimizer()
	deviceID := "test-device"

	// 测试优化Gap
	gap1 := optimizer.OptimizeGap(deviceID, 1024, 50000) // 50ms, 应该使用较大的Gap
	if gap1 <= 0 {
		t.Error("Expected Gap to be greater than 0")
	}

	gap2 := optimizer.OptimizeGap(deviceID, 512, 600000) // 600ms, 应该使用较小的Gap
	if gap2 <= 0 {
		t.Error("Expected Gap to be greater than 0")
	}

	// 测试获取当前Gap
	currentGap := optimizer.GetCurrentGap(deviceID)
	if currentGap == 0 {
		t.Error("Expected current Gap to be greater than 0")
	}

	// 测试设置Gap
	optimizer.SetGap(deviceID, 128)
	currentGap = optimizer.GetCurrentGap(deviceID)
	if currentGap != 128 {
		t.Errorf("Expected current Gap to be 128, got %d", currentGap)
	}

	// 测试清除Gap数据
	optimizer.ClearGapData(deviceID)
	currentGap = optimizer.GetCurrentGap(deviceID)
	if currentGap != 64 {
		t.Errorf("Expected current Gap to be 64 after clearing, got %d", currentGap)
	}
}
