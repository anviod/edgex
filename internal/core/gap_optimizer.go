package core

import (
	"sync"
)

// GapOptimizer Gap优化器
type GapOptimizer struct {
	gapData map[string]int
	mu      sync.RWMutex
}

// NewGapOptimizer 创建Gap优化器
func NewGapOptimizer() *GapOptimizer {
	return &GapOptimizer{
		gapData: make(map[string]int),
	}
}

// OptimizeGap 优化Gap
func (g *GapOptimizer) OptimizeGap(deviceID string, mtu int, rtt int64) int {
	g.mu.Lock()
	defer g.mu.Unlock()

	// 基础Gap值，根据MTU计算
	baseGap := mtu / 2
	if baseGap < 16 {
		baseGap = 16
	} else if baseGap > 256 {
		baseGap = 256
	}

	// 根据RTT调整Gap
	var adjustedGap int
	if rtt < 100000 { // RTT < 100ms，使用较大的Gap
		adjustedGap = baseGap * 2
	} else if rtt > 500000 { // RTT > 500ms，使用较小的Gap
		adjustedGap = baseGap / 2
	} else {
		adjustedGap = baseGap
	}

	// 确保Gap在合理范围内
	if adjustedGap < 8 {
		adjustedGap = 8
	} else if adjustedGap > 512 {
		adjustedGap = 512
	}

	g.gapData[deviceID] = adjustedGap
	return adjustedGap
}

// GetCurrentGap 获取当前Gap
func (g *GapOptimizer) GetCurrentGap(deviceID string) int {
	g.mu.RLock()
	defer g.mu.RUnlock()

	if gap, exists := g.gapData[deviceID]; exists {
		return gap
	}
	return 64 // 默认Gap
}

// SetGap 设置Gap
func (g *GapOptimizer) SetGap(deviceID string, gap int) {
	g.mu.Lock()
	defer g.mu.Unlock()

	// 确保Gap在合理范围内
	if gap < 8 {
		gap = 8
	} else if gap > 512 {
		gap = 512
	}

	g.gapData[deviceID] = gap
}

// ClearGapData 清除设备的Gap数据
func (g *GapOptimizer) ClearGapData(deviceID string) {
	g.mu.Lock()
	defer g.mu.Unlock()

	delete(g.gapData, deviceID)
}
