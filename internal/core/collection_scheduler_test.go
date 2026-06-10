package core

import (
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
)

func TestCollectionScheduler(t *testing.T) {
	deviceAdapterManager := NewDeviceAdapterManager()
	protocolRegistry := NewProtocolAdapterRegistry()
	scheduler := NewCollectionScheduler(deviceAdapterManager, protocolRegistry)

	// 测试调度设备采集
	channels := []model.Channel{
		{
			ID:       "channel-1",
			Name:     "Test Channel",
			Protocol: "modbus-tcp",
			Enable:   true,
			Devices: []model.Device{
				{
					ID:       "device-1",
					Name:     "Device 1",
					Enable:   true,
					Interval: model.Duration(10 * time.Second),
				},
				{
					ID:       "device-2",
					Name:     "Device 2",
					Enable:   true,
					Interval: model.Duration(5 * time.Second),
				},
			},
		},
	}

	devices := scheduler.ScheduleDevices(channels)
	if len(devices) != 2 {
		t.Errorf("Expected 2 devices, got %d", len(devices))
	}

	// 测试优化批量读取
	deviceID := "test-device"
	points := []model.Point{
		{ID: "point-1", Address: "1"},
		{ID: "point-2", Address: "2"},
		{ID: "point-3", Address: "10"},
		{ID: "point-4", Address: "11"},
	}

	batches := scheduler.OptimizeBatchRead(deviceID, points)
	if len(batches) == 0 {
		t.Error("Expected batches to be non-empty")
	}

	// 测试计算最优采集间隔
	interval := scheduler.CalculateOptimalInterval(deviceID)
	if interval == 0 {
		t.Error("Expected optimal interval to be greater than 0")
	}
	if interval < 1*time.Second || interval > 60*time.Second {
		t.Errorf("Expected optimal interval to be between 1s and 60s, got %v", interval)
	}
}
