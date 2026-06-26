package core

import (
	"log"
	"sync"
	"time"

	"github.com/anviod/edgex/internal/model"

	"github.com/google/uuid"
)

type ShadowIngress struct {
	mu sync.RWMutex

	shadowCore *ShadowCore

	messageBuffer   []*model.ShadowIngressMessage
	pendingReliable []*model.ShadowIngressMessage
	bufferMu        sync.Mutex
	bufferSize      int
	flushInterval   time.Duration

	stopChan chan struct{}
	wg       sync.WaitGroup

	metrics ShadowIngressMetrics
}

type ShadowIngressMetrics struct {
	TotalMessages   uint64
	TotalPoints     uint64
	FailedMessages  uint64
	LastProcessTime time.Time
}

func NewShadowIngress(sc *ShadowCore, bufferSize int, flushInterval time.Duration) *ShadowIngress {
	si := &ShadowIngress{
		shadowCore:    sc,
		messageBuffer: make([]*model.ShadowIngressMessage, 0, bufferSize),
		bufferSize:    bufferSize,
		flushInterval: flushInterval,
		stopChan:      make(chan struct{}),
	}

	return si
}

func (si *ShadowIngress) Start() {
	si.replayReliable()
	si.wg.Add(1)
	go si.flushLoop()
	log.Println("[ShadowIngress] Started")
}

func (si *ShadowIngress) Stop() {
	close(si.stopChan)
	si.wg.Wait()
	si.flushBuffer()
	log.Println("[ShadowIngress] Stopped")
}

func (si *ShadowIngress) flushLoop() {
	defer si.wg.Done()

	ticker := time.NewTicker(si.flushInterval)
	defer ticker.Stop()

	for {
		select {
		case <-si.stopChan:
			return
		case <-ticker.C:
			si.flushBuffer()
		}
	}
}

func (si *ShadowIngress) flushBuffer() {
	si.bufferMu.Lock()
	if len(si.messageBuffer) == 0 {
		si.bufferMu.Unlock()
		return
	}

	messages := si.messageBuffer
	si.messageBuffer = make([]*model.ShadowIngressMessage, 0, si.bufferSize)
	si.bufferMu.Unlock()

	for _, msg := range messages {
		if _, err := si.shadowCore.WriteShadowDevice(*msg); err != nil {
			log.Printf("[ShadowIngress] Failed to write shadow device: %v", err)
			si.mu.Lock()
			si.metrics.FailedMessages++
			si.mu.Unlock()
		}
	}
}

func (si *ShadowIngress) Ingest(val model.Value) error {
	qos := 0
	if val.Meta != nil {
		if q, ok := val.Meta["qos"].(int); ok {
			qos = q
		}
	}
	msg := si.valueToMessage(val)
	msg.QoS = qos

	if qos >= 1 {
		if _, err := si.shadowCore.WriteShadowDevice(*msg); err != nil {
			si.bufferReliable(msg)
			return err
		}
		si.mu.Lock()
		si.metrics.TotalMessages++
		si.metrics.TotalPoints++
		si.metrics.LastProcessTime = time.Now()
		si.mu.Unlock()
		return nil
	}

	si.bufferMu.Lock()
	si.messageBuffer = append(si.messageBuffer, msg)
	shouldFlush := len(si.messageBuffer) >= si.bufferSize
	si.bufferMu.Unlock()

	si.mu.Lock()
	si.metrics.TotalMessages++
	si.metrics.TotalPoints++
	si.metrics.LastProcessTime = time.Now()
	si.mu.Unlock()

	if shouldFlush {
		go si.flushBuffer()
	}

	return nil
}

func (si *ShadowIngress) bufferReliable(msg *model.ShadowIngressMessage) {
	si.bufferMu.Lock()
	si.pendingReliable = append(si.pendingReliable, msg)
	si.bufferMu.Unlock()
}

func (si *ShadowIngress) replayReliable() {
	si.bufferMu.Lock()
	pending := si.pendingReliable
	si.pendingReliable = nil
	si.bufferMu.Unlock()

	for _, msg := range pending {
		if _, err := si.shadowCore.WriteShadowDevice(*msg); err != nil {
			si.bufferReliable(msg)
		}
	}
}

func (si *ShadowIngress) IngestBatch(values []model.Value) error {
	if len(values) == 0 {
		return nil
	}

	msg := si.valuesToMessage(values)

	si.bufferMu.Lock()
	si.messageBuffer = append(si.messageBuffer, msg)
	shouldFlush := len(si.messageBuffer) >= si.bufferSize
	si.bufferMu.Unlock()

	si.mu.Lock()
	si.metrics.TotalMessages++
	si.metrics.TotalPoints += uint64(len(values))
	si.metrics.LastProcessTime = time.Now()
	si.mu.Unlock()

	if shouldFlush {
		go si.flushBuffer()
	}

	return nil
}

func (si *ShadowIngress) valueToMessage(val model.Value) *model.ShadowIngressMessage {
	return &model.ShadowIngressMessage{
		MessageID: uuid.New().String(),
		QoS:       0,
		DeviceID:  val.DeviceID,
		ChannelID: val.ChannelID,
		Timestamp: val.TS,
		Points: []model.ShadowIngressPoint{
			{
				PointID:     val.PointID,
				Value:       val.Value,
				Quality:     val.Quality,
				CollectedAt: val.TS,
			},
		},
		Meta: model.ShadowIngressMeta{
			Source: "pipeline",
		},
	}
}

func (si *ShadowIngress) valuesToMessage(values []model.Value) *model.ShadowIngressMessage {
	if len(values) == 0 {
		return nil
	}

	points := make([]model.ShadowIngressPoint, 0, len(values))
	for _, val := range values {
		points = append(points, model.ShadowIngressPoint{
			PointID:     val.PointID,
			Value:       val.Value,
			Quality:     val.Quality,
			CollectedAt: val.TS,
		})
	}

	return &model.ShadowIngressMessage{
		MessageID: uuid.New().String(),
		QoS:       0,
		DeviceID:  values[0].DeviceID,
		ChannelID: values[0].ChannelID,
		Timestamp: time.Now(),
		Points:    points,
		Meta: model.ShadowIngressMeta{
			Source: "pipeline",
		},
	}
}

func (si *ShadowIngress) IngestDirect(msg model.ShadowIngressMessage) error {
	if msg.QoS >= 1 {
		if _, err := si.shadowCore.WriteShadowDevice(msg); err != nil {
			copy := msg
			si.bufferReliable(&copy)
			return err
		}
		si.mu.Lock()
		si.metrics.TotalMessages++
		si.metrics.TotalPoints += uint64(len(msg.Points))
		si.metrics.LastProcessTime = time.Now()
		si.mu.Unlock()
		return nil
	}
	si.bufferMu.Lock()
	si.messageBuffer = append(si.messageBuffer, &msg)
	shouldFlush := len(si.messageBuffer) >= si.bufferSize
	si.bufferMu.Unlock()

	si.mu.Lock()
	si.metrics.TotalMessages++
	si.metrics.TotalPoints += uint64(len(msg.Points))
	si.metrics.LastProcessTime = time.Now()
	si.mu.Unlock()

	if shouldFlush {
		go si.flushBuffer()
	}

	return nil
}

func (si *ShadowIngress) GetMetrics() ShadowIngressMetrics {
	si.mu.RLock()
	defer si.mu.RUnlock()
	return si.metrics
}

func (si *ShadowIngress) GetBufferSize() int {
	si.bufferMu.Lock()
	defer si.bufferMu.Unlock()
	return len(si.messageBuffer)
}
