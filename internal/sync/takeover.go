package sync

import (
	"sync"
	"time"

	"github.com/libp2p/go-libp2p/core/peer"
)

// TakeoverStage records the flow stage for one device takeover attempt.
type TakeoverStage string

const (
	TakeoverStageHello      TakeoverStage = "hello"
	TakeoverStageTakeover   TakeoverStage = "takeover"
	TakeoverStageFullConfig TakeoverStage = "full_config"
	TakeoverStageCompleted  TakeoverStage = "completed"
	TakeoverStageFailed     TakeoverStage = "failed"
)

// TakeoverManager manages device takeover
type TakeoverManager struct {
	locks   map[string]*TakeoverLock
	records map[string][]*TakeoverEvent
	mu      sync.RWMutex
}

// NewTakeoverManager creates a new TakeoverManager
func NewTakeoverManager() *TakeoverManager {
	return &TakeoverManager{
		locks:   make(map[string]*TakeoverLock),
		records: make(map[string][]*TakeoverEvent),
	}
}

// TakeoverEvent describes a takeover state transition.
type TakeoverEvent struct {
	ID         string        `json:"id"`
	DeviceKey  string        `json:"device_key"`
	SourcePeer string        `json:"source_peer"`
	TargetPeer string        `json:"target_peer"`
	Stage      TakeoverStage `json:"stage"`
	Status     string        `json:"status"`
	Message    string        `json:"message,omitempty"`
	Timestamp  time.Time     `json:"timestamp"`
}

// TryLock tries to acquire a takeover lock
func (t *TakeoverManager) TryLock(deviceKey string, owner peer.ID, ttl time.Duration) bool {
	t.mu.Lock()
	defer t.mu.Unlock()

	now := time.Now()

	if lock, exists := t.locks[deviceKey]; exists {
		if lock.ExpiresAt.After(now) && lock.Owner != owner {
			return false
		}
	}

	t.locks[deviceKey] = &TakeoverLock{
		DeviceKey: deviceKey,
		Owner:     owner,
		TTL:       ttl,
		ExpiresAt: now.Add(ttl),
	}

	return true
}

// ReleaseLock releases a takeover lock
func (t *TakeoverManager) ReleaseLock(deviceKey string) {
	t.mu.Lock()
	defer t.mu.Unlock()

	delete(t.locks, deviceKey)
}

// GetLockStatus gets the lock status
func (t *TakeoverManager) GetLockStatus(deviceKey string) (*TakeoverLock, bool) {
	t.mu.RLock()
	defer t.mu.RUnlock()

	lock, ok := t.locks[deviceKey]
	if !ok {
		return nil, false
	}

	if time.Now().After(lock.ExpiresAt) {
		return nil, false
	}

	return lock, true
}

// CleanupExpiredLocks cleans up expired locks
func (t *TakeoverManager) CleanupExpiredLocks() {
	t.mu.Lock()
	defer t.mu.Unlock()

	now := time.Now()
	for key, lock := range t.locks {
		if now.After(lock.ExpiresAt) {
			delete(t.locks, key)
		}
	}
}

// RecordEvent stores a takeover lifecycle entry.
func (t *TakeoverManager) RecordEvent(event *TakeoverEvent) {
	if event == nil {
		return
	}

	t.mu.Lock()
	defer t.mu.Unlock()

	if event.Timestamp.IsZero() {
		event.Timestamp = time.Now()
	}
	t.records[event.DeviceKey] = append([]*TakeoverEvent{event}, t.records[event.DeviceKey]...)
}

// GetEvents returns takeover events for a given device or all events when deviceKey is empty.
func (t *TakeoverManager) GetEvents(deviceKey string) []*TakeoverEvent {
	t.mu.RLock()
	defer t.mu.RUnlock()

	if deviceKey != "" {
		events := make([]*TakeoverEvent, len(t.records[deviceKey]))
		copy(events, t.records[deviceKey])
		return events
	}

	all := make([]*TakeoverEvent, 0)
	for _, events := range t.records {
		all = append(all, events...)
	}
	return all
}
