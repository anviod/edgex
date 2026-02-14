package core

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

// BlockingMockDriver simulates a driver that blocks on specific slave IDs
type BlockingMockDriver struct {
	mu           sync.Mutex
	currentSlave uint8
	readCounts   map[uint8]int
}

func (m *BlockingMockDriver) Init(cfg model.DriverConfig) error {
	m.readCounts = make(map[uint8]int)
	return nil
}
func (m *BlockingMockDriver) Connect(ctx context.Context) error { return nil }
func (m *BlockingMockDriver) Disconnect() error                 { return nil }

func (m *BlockingMockDriver) SetSlaveID(slaveID uint8) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.currentSlave = slaveID
	return nil
}

func (m *BlockingMockDriver) SetDeviceConfig(config map[string]any) error { return nil }

func (m *BlockingMockDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	m.mu.Lock()
	slave := m.currentSlave
	if m.readCounts == nil {
		m.readCounts = make(map[uint8]int)
	}
	m.readCounts[slave]++
	m.mu.Unlock()

	if slave == 3 {
		// Block for 2 seconds (simulating timeout)
		// Or until context is cancelled
		select {
		case <-time.After(2 * time.Second):
			// If context is still valid, return deadline exceeded explicitly
			// But if context was cancelled (due to timeout), ctx.Done() would fire
		case <-ctx.Done():
			return nil, ctx.Err()
		}
		// Return error after timeout
		return nil, context.DeadlineExceeded
	}

	// Normal device: return immediately
	time.Sleep(10 * time.Millisecond) // Slight delay
	if len(points) > 0 {
		return map[string]model.Value{
			points[0].ID: {Value: 1},
		}, nil
	}
	return nil, nil
}

func (m *BlockingMockDriver) WritePoint(ctx context.Context, point model.Point, value any) error {
	return nil
}
func (m *BlockingMockDriver) Health() driver.HealthStatus { return driver.HealthStatusGood }

func TestDeviceIsolation_Blocking(t *testing.T) {
	// Register driver
	mock := &BlockingMockDriver{
		readCounts: make(map[uint8]int),
	}
	driver.RegisterDriver("mock-blocking", func() driver.Driver { return mock })

	cm := NewChannelManager(NewDataPipeline(100), nil)
	go cm.pipeline.Start()

	// 3 Devices. Dev 3 is blocking.
	// Interval 500ms.
	// Run for 5.5 seconds.
	// Expected: Dev 1 and 2 should have ~10 reads. Dev 3 should have ~2-3 reads (due to blocking).

	ch := &model.Channel{
		ID:       "ch-blocking",
		Name:     "Blocking Channel",
		Protocol: "mock-blocking",
		Enable:   true,
		Devices: []model.Device{
			{ID: "dev1", Name: "Dev1", Enable: true, Interval: 500, Config: map[string]any{"slave_id": 1}, Points: []model.Point{{ID: "p1", Address: "1"}}},
			{ID: "dev2", Name: "Dev2", Enable: true, Interval: 500, Config: map[string]any{"slave_id": 2}, Points: []model.Point{{ID: "p2", Address: "1"}}},
			{ID: "dev3", Name: "Dev3", Enable: true, Interval: 500, Config: map[string]any{"slave_id": 3}, Points: []model.Point{{ID: "p3", Address: "1"}}},
		},
	}

	cm.AddChannel(ch)
	cm.StartChannel(ch.ID)

	time.Sleep(5500 * time.Millisecond)

	cm.StopChannel(ch.ID)

	mock.mu.Lock()
	defer mock.mu.Unlock()

	fmt.Printf("Read Counts: Dev1=%d, Dev2=%d, Dev3=%d\n", mock.readCounts[1], mock.readCounts[2], mock.readCounts[3])

	// Verification logic
	// Dev1 and Dev2 should have substantial reads.
	// Ideal: 11 reads.
	// With blocking:
	// - Before fix: ~3 reads.
	// - After fix: > 7 reads.

	assert.Greater(t, mock.readCounts[1], 5, "Dev1 should have > 5 reads despite Dev3 blocking")
	assert.Greater(t, mock.readCounts[2], 5, "Dev2 should have > 5 reads despite Dev3 blocking")

	// Dev3 should have some reads (attempts)
	assert.Greater(t, mock.readCounts[3], 0, "Dev3 should have attempted reads")
}
