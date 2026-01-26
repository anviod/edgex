package dlt645

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"math/rand"
	"strings"
	"time"
)

func init() {
	driver.RegisterDriver("dlt645", func() driver.Driver {
		return NewDLT645Driver()
	})
}

type DLT645Driver struct {
	config model.DriverConfig
}

func NewDLT645Driver() driver.Driver {
	return &DLT645Driver{}
}

func (d *DLT645Driver) Init(cfg model.DriverConfig) error {
	d.config = cfg
	return nil
}

func (d *DLT645Driver) Connect(ctx context.Context) error {
	cfg := d.config.Config
	
	// Check connection type
	connType, _ := cfg["connectionType"].(string)
	if connType == "tcp" {
		log.Printf("DLT645 Driver connecting to TCP %v:%v (Simulated)...",
			cfg["ip"], cfg["port"])
	} else {
		// Default to serial
		log.Printf("DLT645 Driver connecting to Serial %v (Baud=%v, Data=%v, Stop=%v, Parity=%v) (Simulated)...",
			cfg["port"], cfg["baudRate"], cfg["dataBits"], cfg["stopBits"], cfg["parity"])
	}
	return nil
}

func (d *DLT645Driver) Disconnect() error {
	return nil
}

func (d *DLT645Driver) Health() driver.HealthStatus {
	return driver.HealthStatusGood
}

func (d *DLT645Driver) SetSlaveID(slaveID uint8) error {
	return nil
}

func (d *DLT645Driver) SetDeviceConfig(config map[string]any) error {
	return nil
}

func (d *DLT645Driver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	results := make(map[string]model.Value)

	for _, p := range points {
		val, err := d.readPoint(p)
		quality := "Good"
		if err != nil {
			quality = "Bad"
			log.Printf("DLT645 Error reading point %s: %v", p.Name, err)
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

func (d *DLT645Driver) readPoint(p model.Point) (interface{}, error) {
	// Simulate values based on address (Data Marker)
	// Address format expected: DeviceID#DataMarker (e.g., 210220003011#02-01-01-00)
	// But usually Point.Address stores just the marker or the full string.
	// We'll look for the marker at the end.

	// Simulating based on the user provided examples:
	// 02-01-01-00: A Phase Voltage
	// 02-02-01-00: A Phase Current
	// 02-03-01-00: Active Power

	// Basic simulation with jitter
	switch {
	case strings.Contains(p.Address, "02-01-01-00"): // Voltage
		return 220.0 + (rand.Float64() - 0.5), nil
	case strings.Contains(p.Address, "02-02-01-00"): // Current
		return 1.5 + (rand.Float64()*0.1 - 0.05), nil
	case strings.Contains(p.Address, "02-03-01-00"): // Power
		return 330.0 + (rand.Float64()*10.0 - 5.0), nil
	default:
		return rand.Float64() * 100, nil
	}
}

func (d *DLT645Driver) WritePoint(ctx context.Context, p model.Point, value any) error {
	return fmt.Errorf("write not supported for DLT645")
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && s[len(s)-len(substr):] == substr ||
		(len(s) > len(substr) && s[len(s)-len(substr)-1:] == substr) // loose check
}
