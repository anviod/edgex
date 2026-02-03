package core

import (
	"industrial-edge-gateway/internal/model"
	"sync"
)

// DataPipeline handles the flow of collected data
type DataPipeline struct {
	mu         sync.Mutex
	pointBuf   map[string][]model.Value
	signalChan chan struct{}
	handlers   []func(model.Value)
}

func NewDataPipeline(bufferSize int) *DataPipeline {
	return &DataPipeline{
		pointBuf:   make(map[string][]model.Value),
		signalChan: make(chan struct{}, 1), // Non-blocking signal with size 1
		handlers:   make([]func(model.Value), 0),
	}
}

func (dp *DataPipeline) AddHandler(h func(model.Value)) {
	dp.handlers = append(dp.handlers, h)
}

func (dp *DataPipeline) Start() {
	go func() {
		for range dp.signalChan {
			dp.drainAndProcess()
		}
	}()
}

func (dp *DataPipeline) Push(val model.Value) {
	// Unique key for the point: ChannelID/DeviceID/PointID
	key := val.ChannelID + "/" + val.DeviceID + "/" + val.PointID

	dp.mu.Lock()
	buf := dp.pointBuf[key]

	// Optimization: Keep only current and last (Max 2 items)
	// If buffer is full (>=2), drop the oldest (index 0) to make room
	if len(buf) >= 2 {
		buf = buf[1:]
	}
	buf = append(buf, val)
	dp.pointBuf[key] = buf
	dp.mu.Unlock()

	// Notify the processor
	select {
	case dp.signalChan <- struct{}{}:
	default:
		// Signal already pending, processor will pick up the new data
	}
}

func (dp *DataPipeline) drainAndProcess() {
	dp.mu.Lock()
	if len(dp.pointBuf) == 0 {
		dp.mu.Unlock()
		return
	}

	// Drain all data from the buffer
	// We copy the map content to a slice to minimize lock holding time
	// Note: Global order is not strictly preserved across different points,
	// but per-point order is preserved.
	var batch []model.Value
	for k, buf := range dp.pointBuf {
		batch = append(batch, buf...)
		delete(dp.pointBuf, k)
	}
	dp.mu.Unlock()

	// Process the batch
	for _, val := range batch {
		dp.process(val)
	}
}

func (dp *DataPipeline) process(val model.Value) {
	// Log (Optional, kept for debugging but can be noisy)
	// fmt.Printf("[Pipeline] Received: %s = %v (Quality: %s)\n", val.PointID, val.Value, val.Quality)

	dp.mu.Lock()
	handlers := make([]func(model.Value), len(dp.handlers))
	copy(handlers, dp.handlers)
	dp.mu.Unlock()

	// Notify all handlers
	for _, h := range handlers {
		h(val)
	}
}
