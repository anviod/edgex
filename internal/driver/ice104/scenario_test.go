package ice104

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestScenario_InvalidAddressReadPoints(t *testing.T) {
	transport := NewICE104Transport(map[string]any{"ip": "127.0.0.1", "port": 2404})
	transport.connected.Store(true)

	scheduler := NewICE104Scheduler(transport, NewICE104Decoder(), map[string]any{"t1": 1})
	results, err := scheduler.ReadPoints(context.Background(), []model.Point{
		{ID: "bad", Address: "not-a-number", Group: "M_SP_NA_1", DataType: "BOOL", ReportMode: "event"},
	})
	require.NoError(t, err)
	assert.Equal(t, "Bad", results["bad"].Quality)
}

func TestScenario_CacheMissTimeout(t *testing.T) {
	transport := NewICE104Transport(map[string]any{"t1": 0})
	transport.connected.Store(true)

	scheduler := NewICE104Scheduler(transport, NewICE104Decoder(), map[string]any{"t1": 0})
	ctx, cancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
	defer cancel()

	results, err := scheduler.ReadPoints(ctx, []model.Point{
		{ID: "p1", Address: "999", Group: "M_SP_NA_1", DataType: "BOOL", ReportMode: "event"},
	})
	require.NoError(t, err)
	assert.Equal(t, "Bad", results["p1"].Quality)
}

func TestScenario_ReconnectCountOnConnect(t *testing.T) {
	transport := NewICE104Transport(map[string]any{"ip": "127.0.0.1", "port": 2404})
	transport.reconnectCount.Store(0)
	transport.connected.Store(true)
	transport.connectTime = time.Now()
	transport.reconnectCount.Add(1)

	_, reconCount, _, _, _ := transport.GetConnectionMetrics()
	assert.Equal(t, int64(1), reconCount)

	require.NoError(t, transport.Disconnect())
	assert.False(t, transport.IsConnected())
	_, _, _, _, lastDisc := transport.GetConnectionMetrics()
	assert.False(t, lastDisc.IsZero())
}

func TestScenario_ConcurrentCacheAccess(t *testing.T) {
	transport := NewICE104Transport(nil)
	transport.connected.Store(true)
	decoder := NewICE104Decoder()
	key := decoder.PointKey(typeM_SP_NA_1, 50)

	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(2)
		go func(v bool) {
			defer wg.Done()
			transport.cacheMu.Lock()
			transport.cache[key] = cachedPoint{TypeID: typeM_SP_NA_1, IOA: 50, Value: v, Quality: "Good", TS: time.Now()}
			transport.cacheMu.Unlock()
		}(i%2 == 0)
		go func() {
			defer wg.Done()
			_, _ = transport.GetCached(key)
		}()
	}
	wg.Wait()

	cp, ok := transport.GetCached(key)
	assert.True(t, ok)
	assert.NotNil(t, cp.Value)
}
