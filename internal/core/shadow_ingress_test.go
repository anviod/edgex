package core

import (
	"testing"
	"time"

	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/storage"
)

func TestShadowIngress_Ingest(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	si := NewShadowIngress(sc, 10, 100*time.Millisecond)

	val := model.Value{
		ChannelID: "channel-1",
		DeviceID:  "device-1",
		PointID:   "point-1",
		Value:     42.5,
		Quality:   "good",
		TS:        time.Now(),
	}

	err = si.Ingest(val)
	if err != nil {
		t.Fatalf("Ingest failed: %v", err)
	}

	metrics := si.GetMetrics()
	if metrics.TotalMessages != 1 {
		t.Errorf("Expected 1 message, got %d", metrics.TotalMessages)
	}

	if metrics.TotalPoints != 1 {
		t.Errorf("Expected 1 point, got %d", metrics.TotalPoints)
	}
}

func TestShadowIngress_IngestBatch(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	si := NewShadowIngress(sc, 10, 100*time.Millisecond)

	values := []model.Value{
		{
			ChannelID: "channel-1",
			DeviceID:  "device-1",
			PointID:   "point-1",
			Value:     10.0,
			Quality:   "good",
			TS:        time.Now(),
		},
		{
			ChannelID: "channel-1",
			DeviceID:  "device-1",
			PointID:   "point-2",
			Value:     20.0,
			Quality:   "good",
			TS:        time.Now(),
		},
	}

	err = si.IngestBatch(values)
	if err != nil {
		t.Fatalf("IngestBatch failed: %v", err)
	}

	metrics := si.GetMetrics()
	if metrics.TotalMessages != 1 {
		t.Errorf("Expected 1 message, got %d", metrics.TotalMessages)
	}

	if metrics.TotalPoints != 2 {
		t.Errorf("Expected 2 points, got %d", metrics.TotalPoints)
	}
}

func TestShadowIngress_AutoFlush(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	si := NewShadowIngress(sc, 3, 1*time.Second)
	si.Start()
	defer si.Stop()

	for i := 0; i < 5; i++ {
		val := model.Value{
			ChannelID: "channel-1",
			DeviceID:  "device-1",
			PointID:   "point-1",
			Value:     float64(i),
			Quality:   "good",
			TS:        time.Now(),
		}
		si.Ingest(val)
	}

	time.Sleep(200 * time.Millisecond)

	device, err := sc.GetShadowDevice("shadow-device-1")
	if err != nil {
		t.Fatalf("GetShadowDevice failed: %v", err)
	}

	if len(device.Points) == 0 {
		t.Errorf("Expected points to be flushed to shadow device")
	}
}

func TestShadowIngress_DirectIngest(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	si := NewShadowIngress(sc, 10, 100*time.Millisecond)

	msg := model.ShadowIngressMessage{
		MessageID: "direct-msg-1",
		QoS:       1,
		DeviceID:  "device-1",
		ChannelID: "channel-1",
		Timestamp: time.Now(),
		Points: []model.ShadowIngressPoint{
			{PointID: "point-1", Value: 100.0, Quality: "good"},
			{PointID: "point-2", Value: 200.0, Quality: "good"},
		},
	}

	err = si.IngestDirect(msg)
	if err != nil {
		t.Fatalf("IngestDirect failed: %v", err)
	}

	metrics := si.GetMetrics()
	if metrics.TotalMessages != 1 {
		t.Errorf("Expected 1 message, got %d", metrics.TotalMessages)
	}

	if metrics.TotalPoints != 2 {
		t.Errorf("Expected 2 points, got %d", metrics.TotalPoints)
	}
}

func TestShadowIngress_GetBufferSize(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	si := NewShadowIngress(sc, 100, 10*time.Second)

	for i := 0; i < 10; i++ {
		val := model.Value{
			ChannelID: "channel-1",
			DeviceID:  "device-1",
			PointID:   "point-1",
			Value:     float64(i),
			Quality:   "good",
			TS:        time.Now(),
		}
		si.Ingest(val)
	}

	bufferSize := si.GetBufferSize()
	if bufferSize != 10 {
		t.Errorf("Expected buffer size 10, got %d", bufferSize)
	}
}

func TestShadowIngress_StartStop(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	si := NewShadowIngress(sc, 10, 50*time.Millisecond)

	si.Start()

	for i := 0; i < 5; i++ {
		val := model.Value{
			ChannelID: "channel-1",
			DeviceID:  "device-1",
			PointID:   "point-1",
			Value:     float64(i),
			Quality:   "good",
			TS:        time.Now(),
		}
		si.Ingest(val)
	}

	time.Sleep(100 * time.Millisecond)

	si.Stop()

	device, err := sc.GetShadowDevice("shadow-device-1")
	if err != nil {
		t.Fatalf("GetShadowDevice failed: %v", err)
	}

	if len(device.Points) == 0 {
		t.Errorf("Expected points to be flushed after stop")
	}
}

func TestShadowIngress_Metrics(t *testing.T) {
	tmpDir := testOutputDir(t)

	store, err := storage.NewStorage(tmpDir)
	if err != nil {
		t.Fatalf("Failed to create storage: %v", err)
	}
	defer store.Close()

	sc := NewShadowCore()
	si := NewShadowIngress(sc, 10, 100*time.Millisecond)

	for i := 0; i < 100; i++ {
		val := model.Value{
			ChannelID: "channel-1",
			DeviceID:  "device-1",
			PointID:   "point-1",
			Value:     float64(i),
			Quality:   "good",
			TS:        time.Now(),
		}
		si.Ingest(val)
	}

	metrics := si.GetMetrics()

	if metrics.TotalMessages != 100 {
		t.Errorf("Expected 100 messages, got %d", metrics.TotalMessages)
	}

	if metrics.TotalPoints != 100 {
		t.Errorf("Expected 100 points, got %d", metrics.TotalPoints)
	}

	if metrics.LastProcessTime.IsZero() {
		t.Errorf("Expected non-zero last process time")
	}
}
