package core

import (
	"sync"
	"time"
)

const (
	pointDegradeThreshold = 3
	pointProbeBase        = 5 * time.Second
	pointProbeMax         = 5 * time.Minute
)

type pointDegradeState struct {
	failCount     int
	probeExponent int
	nextProbe     time.Time
	degraded      bool
}

// PointDegradationManager 点位级降级：连续失败跳过常规采集，指数探测恢复。
type PointDegradationManager struct {
	mu     sync.RWMutex
	states map[string]*pointDegradeState // key: deviceID/pointID
}

func NewPointDegradationManager() *PointDegradationManager {
	return &PointDegradationManager{
		states: make(map[string]*pointDegradeState),
	}
}

func pointDegradeKey(deviceID, pointID string) string {
	return deviceID + "/" + pointID
}

// FilterForRead 返回应参与本次读取的点位 ID；降级且未到探测时间的点位被跳过。
func (m *PointDegradationManager) FilterForRead(deviceID string, pointIDs []string) (active []string, skipped []string) {
	if m == nil {
		return pointIDs, nil
	}
	now := time.Now()
	m.mu.RLock()
	defer m.mu.RUnlock()
	for _, pid := range pointIDs {
		key := pointDegradeKey(deviceID, pid)
		st, ok := m.states[key]
		if !ok || !st.degraded {
			active = append(active, pid)
			continue
		}
		if !now.Before(st.nextProbe) {
			active = append(active, pid)
			continue
		}
		skipped = append(skipped, pid)
	}
	return active, skipped
}

// RecordResults 根据读结果更新点位状态。
func (m *PointDegradationManager) RecordResults(deviceID string, results map[string]string) {
	if m == nil {
		return
	}
	m.mu.Lock()
	defer m.mu.Unlock()
	for pointID, quality := range results {
		key := pointDegradeKey(deviceID, pointID)
		st, ok := m.states[key]
		if !ok {
			st = &pointDegradeState{}
			m.states[key] = st
		}
		if quality == "Good" {
			st.failCount = 0
			st.degraded = false
			st.probeExponent = 0
			st.nextProbe = time.Time{}
			continue
		}
		st.failCount++
		if st.failCount >= pointDegradeThreshold {
			st.degraded = true
			if st.probeExponent < 8 {
				st.probeExponent++
			}
			delay := pointProbeBase << st.probeExponent
			if delay > pointProbeMax {
				delay = pointProbeMax
			}
			st.nextProbe = time.Now().Add(delay)
		}
	}
}

// IsDegraded 查询点位是否处于降级状态。
func (m *PointDegradationManager) IsDegraded(deviceID, pointID string) bool {
	if m == nil {
		return false
	}
	m.mu.RLock()
	defer m.mu.RUnlock()
	st, ok := m.states[pointDegradeKey(deviceID, pointID)]
	return ok && st.degraded
}

// SnapshotDevice 返回设备下各点位的降级快照。
func (m *PointDegradationManager) SnapshotDevice(deviceID string, pointIDs []string) map[string]any {
	out := make(map[string]any, len(pointIDs))
	if m == nil {
		return out
	}
	m.mu.RLock()
	defer m.mu.RUnlock()
	for _, pid := range pointIDs {
		key := pointDegradeKey(deviceID, pid)
		st, ok := m.states[key]
		if !ok {
			continue
		}
		out[pid] = map[string]any{
			"degraded":       st.degraded,
			"fail_count":     st.failCount,
			"probe_exponent": st.probeExponent,
			"next_probe":     st.nextProbe,
		}
	}
	return out
}
