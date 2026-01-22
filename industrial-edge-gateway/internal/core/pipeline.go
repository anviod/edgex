package core

import (
	"fmt"
	"industrial-edge-gateway/internal/model"
	"log"
)

// DataPipeline handles the flow of collected data
type DataPipeline struct {
	dataChan chan model.Value
	handlers []func(model.Value)
}

func NewDataPipeline(bufferSize int) *DataPipeline {
	return &DataPipeline{
		dataChan: make(chan model.Value, bufferSize),
		handlers: make([]func(model.Value), 0),
	}
}

func (dp *DataPipeline) AddHandler(h func(model.Value)) {
	dp.handlers = append(dp.handlers, h)
}

func (dp *DataPipeline) Start() {
	go func() {
		for val := range dp.dataChan {
			dp.process(val)
		}
	}()
}

func (dp *DataPipeline) Push(val model.Value) {
	select {
	case dp.dataChan <- val:
	default:
		log.Printf("Data pipeline buffer full, dropping value for point %s", val.PointID)
	}
}

func (dp *DataPipeline) process(val model.Value) {
	// Log
	fmt.Printf("[Pipeline] Received: %s = %v (Quality: %s)\n", val.PointID, val.Value, val.Quality)

	// Notify all handlers
	for _, h := range dp.handlers {
		h(val)
	}
}
