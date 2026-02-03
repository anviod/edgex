package modbus

import (
	"sync"
	"time"
)

type DeviceState string

const (
	StateOnline     DeviceState = "ONLINE"
	StateDegraded   DeviceState = "DEGRADED"
	StateOffline    DeviceState = "OFFLINE"
	StateRecovering DeviceState = "RECOVERING"
)

type DeviceStateMachine struct {
	state            DeviceState
	failCount        int
	lastSuccess      time.Time
	degradeThreshold int
	recoverThreshold int
	mu               sync.Mutex
}

func NewDeviceStateMachine() *DeviceStateMachine {
	return &DeviceStateMachine{
		state:            StateOnline,
		degradeThreshold: 3,
		recoverThreshold: 1, // Recover immediately on success, or maybe require multiple?
	}
}

func (sm *DeviceStateMachine) OnFailure() {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	sm.failCount++
	if sm.failCount >= sm.degradeThreshold*2 {
		sm.state = StateOffline
	} else if sm.failCount >= sm.degradeThreshold {
		sm.state = StateDegraded
	}
}

func (sm *DeviceStateMachine) OnSuccess() {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	sm.failCount = 0
	sm.lastSuccess = time.Now()
	
	if sm.state == StateOffline || sm.state == StateDegraded {
		sm.state = StateRecovering
		// In next cycle it might become Online if stable
		// For simplicity, let's switch to Online immediately or have a recovering phase
		sm.state = StateOnline 
	} else {
		sm.state = StateOnline
	}
}

func (sm *DeviceStateMachine) GetState() DeviceState {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	return sm.state
}
