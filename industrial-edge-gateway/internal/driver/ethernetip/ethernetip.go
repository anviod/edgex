package ethernetip

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"math/rand"
	"time"
)

func init() {
	driver.RegisterDriver("ethernet-ip", func() driver.Driver {
		return NewEtherNetIPDriver()
	})
}

type EtherNetIPDriver struct {
	config  model.DriverConfig
	simData map[string]interface{}
}

func NewEtherNetIPDriver() driver.Driver {
	return &EtherNetIPDriver{
		simData: make(map[string]interface{}),
	}
}

func (d *EtherNetIPDriver) Init(cfg model.DriverConfig) error {
	d.config = cfg
	return nil
}

func (d *EtherNetIPDriver) Connect(ctx context.Context) error {
	cfg := d.config.Config
	ip, _ := cfg["ip"].(string)
	port := 44818
	if p, ok := cfg["port"].(float64); ok {
		port = int(p)
	} else if p, ok := cfg["port"].(int); ok {
		port = p
	}
	slot := 0
	if s, ok := cfg["slot"].(float64); ok {
		slot = int(s)
	} else if s, ok := cfg["slot"].(int); ok {
		slot = s
	}

	log.Printf("EtherNet/IP Driver connecting to %s:%d (Slot=%d)...", ip, port, slot)

	// Simulate connection delay
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(100 * time.Millisecond):
	}

	log.Printf("EtherNet/IP Driver connected (Simulated)")
	return nil
}

func (d *EtherNetIPDriver) Disconnect() error {
	log.Printf("EtherNet/IP Driver disconnected")
	return nil
}

func (d *EtherNetIPDriver) Health() driver.HealthStatus {
	return driver.HealthStatusGood
}

func (d *EtherNetIPDriver) SetSlaveID(slaveID uint8) error {
	return nil
}

func (d *EtherNetIPDriver) SetDeviceConfig(config map[string]any) error {
	return nil
}

func (d *EtherNetIPDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	results := make(map[string]model.Value)

	for _, p := range points {
		val, err := d.readPoint(p)
		quality := "Good"
		if err != nil {
			quality = "Bad"
			log.Printf("Error reading point %s: %v", p.Name, err)
			// Don't continue, record the bad value
		}

		results[p.ID] = model.Value{
			PointID: p.ID,
			Value:   val,
			Quality: quality,
			TS:      time.Now(),
		}
	}
	return results, nil
}

func (d *EtherNetIPDriver) WritePoint(ctx context.Context, point model.Point, value interface{}) error {
	log.Printf("EtherNet/IP Write Point: %s = %v", point.Name, value)
	// Update sim data
	d.simData[point.ID] = value
	return nil
}

func (d *EtherNetIPDriver) readPoint(p model.Point) (interface{}, error) {
	// Check if we have a simulated value stored
	if val, ok := d.simData[p.ID]; ok {
		return val, nil
	}

	// Simulate data generation based on type
	// "INT8", "UINT8", "INT16", "UINT16", "INT32", "UINT32", "INT64", "UINT64",
	// "FLOAT", "DOUBLE", "BOOL", "BIT", "STRING", "WORD", "DWORD", "LWORD"

	switch p.DataType {
	case "BOOL", "BIT":
		return rand.Intn(2) == 1, nil
	case "INT8":
		return int8(rand.Intn(256) - 128), nil
	case "UINT8":
		return uint8(rand.Intn(256)), nil
	case "INT16", "WORD": // WORD is usually UINT16 but can be treated as raw bits
		return int16(rand.Intn(65536) - 32768), nil
	case "UINT16":
		return uint16(rand.Intn(65536)), nil
	case "INT32", "DWORD":
		return int32(rand.Intn(100000)), nil
	case "UINT32":
		return uint32(rand.Intn(100000)), nil
	case "INT64", "LWORD":
		return int64(rand.Intn(1000000)), nil
	case "UINT64":
		return uint64(rand.Intn(1000000)), nil
	case "FLOAT":
		return rand.Float32() * 100, nil
	case "DOUBLE":
		return rand.Float64() * 100, nil
	case "STRING":
		return fmt.Sprintf("SimData-%d", rand.Intn(100)), nil
	default:
		// Default random number for unknown types
		return rand.Intn(100), nil
	}
}
