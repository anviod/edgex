package modbus

import (
	"math"
	"time"
)

type RTTModel struct {
	Samples map[int][]time.Duration
}

func NewRTTModel() *RTTModel {
	return &RTTModel{
		Samples: make(map[int][]time.Duration),
	}
}

func (m *RTTModel) Record(size int, rtt time.Duration) {
	m.Samples[size] = append(m.Samples[size], rtt)
}

func (m *RTTModel) BestBatchSize() int {
	if len(m.Samples) == 0 {
		return 40
	}

	bestSize := 1
	bestCost := math.MaxFloat64

	for size, samples := range m.Samples {
		if len(samples) == 0 {
			continue
		}
		avg := averageDuration(samples)
		cost := float64(avg.Milliseconds()) / float64(size)

		if cost < bestCost {
			bestCost = cost
			bestSize = size
		}
	}

	return bestSize
}

func averageDuration(durations []time.Duration) time.Duration {
	if len(durations) == 0 {
		return 0
	}

	total := time.Duration(0)
	for _, d := range durations {
		total += d
	}

	return total / time.Duration(len(durations))
}
