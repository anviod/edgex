package core

import (
	"testing"
	"time"
)

func TestAdaptiveThrottle_PerDeviceRTTThrottle(t *testing.T) {
	at := NewAdaptiveThrottle(nil)

	at.UpdateDeviceRTT("slow-dev", 50)
	at.UpdateDeviceRTT("slow-dev", 200)

	factor := at.DeviceFactor("slow-dev")
	if factor < deviceRTTMinFactor {
		t.Fatalf("device factor = %v, want >= %v", factor, deviceRTTMinFactor)
	}
	if factor > deviceRTTMaxFactor {
		t.Fatalf("device factor = %v, want <= %v", factor, deviceRTTMaxFactor)
	}

	task := &ScanTask{
		DeviceKey:    "slow-dev",
		BaseInterval: 100 * time.Millisecond,
		Interval:     100 * time.Millisecond,
	}
	if !at.ApplyInterval(task) {
		t.Fatal("expected per-device RTT throttle to adjust interval")
	}

	task.mu.RLock()
	defer task.mu.RUnlock()
	if task.Interval <= task.BaseInterval {
		t.Fatalf("interval = %v, want > base %v", task.Interval, task.BaseInterval)
	}
}

func TestAdaptiveThrottle_HealthyDeviceNoRTTThrottle(t *testing.T) {
	at := NewAdaptiveThrottle(nil)
	at.UpdateDeviceRTT("fast-dev", 40)
	at.UpdateDeviceRTT("fast-dev", 45)

	if factor := at.DeviceFactor("fast-dev"); factor != 1.0 {
		t.Fatalf("healthy device factor = %v, want 1.0", factor)
	}
}
