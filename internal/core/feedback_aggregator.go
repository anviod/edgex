package core

import (
	"sync"
	"time"
)

// FeedbackEvent is a single task execution outcome for aggregation.
type FeedbackEvent struct {
	DeviceKey string
	TaskID    string
	Success   bool
	Err       error
	At        time.Time
	LagMicros int64
}

// AggregatedStats summarizes feedback within a flush window.
type AggregatedStats struct {
	SuccessCount int
	FailCount    int
	FailRate     float64
	LastError    error
}

// FeedbackAggregator batches scheduling feedback before updateTaskState (v5.2 sketch).
type FeedbackAggregator struct {
	window  time.Duration
	events  chan FeedbackEvent
	onFlush func(deviceKey string, stats AggregatedStats)

	stopCh chan struct{}
	wg     sync.WaitGroup
}

func NewFeedbackAggregator(window time.Duration, onFlush func(string, AggregatedStats)) *FeedbackAggregator {
	if window <= 0 {
		window = 2 * time.Second
	}
	if onFlush == nil {
		onFlush = func(string, AggregatedStats) {}
	}
	return &FeedbackAggregator{
		window:  window,
		events:  make(chan FeedbackEvent, 256),
		onFlush: onFlush,
		stopCh:  make(chan struct{}),
	}
}

func (fa *FeedbackAggregator) Start() {
	fa.wg.Add(1)
	go fa.run()
}

func (fa *FeedbackAggregator) Stop() {
	close(fa.stopCh)
	fa.wg.Wait()
}

func (fa *FeedbackAggregator) Submit(ev FeedbackEvent) {
	if fa == nil {
		return
	}
	if ev.At.IsZero() {
		ev.At = time.Now()
	}
	select {
	case fa.events <- ev:
	default:
		// Drop on overflow; shadow path remains real-time.
	}
}

func (fa *FeedbackAggregator) Window() time.Duration {
	if fa == nil {
		return 0
	}
	return fa.window
}

func (fa *FeedbackAggregator) run() {
	defer fa.wg.Done()

	ticker := time.NewTicker(fa.window)
	defer ticker.Stop()

	pending := make(map[string]*AggregatedStats)

	flush := func() {
		for deviceKey, stats := range pending {
			total := stats.SuccessCount + stats.FailCount
			if total > 0 {
				stats.FailRate = float64(stats.FailCount) / float64(total)
			}
			fa.onFlush(deviceKey, *stats)
		}
		for k := range pending {
			delete(pending, k)
		}
	}

	for {
		select {
		case <-fa.stopCh:
			flush()
			return
		case ev := <-fa.events:
			stats, ok := pending[ev.DeviceKey]
			if !ok {
				stats = &AggregatedStats{}
				pending[ev.DeviceKey] = stats
			}
			if ev.Success {
				stats.SuccessCount++
			} else {
				stats.FailCount++
				stats.LastError = ev.Err
			}
		case <-ticker.C:
			flush()
		}
	}
}
