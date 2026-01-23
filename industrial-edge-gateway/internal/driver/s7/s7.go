package s7

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"math/rand"
	"strconv"
	"time"
)

func init() {
	driver.RegisterDriver("s7", func() driver.Driver {
		return NewS7Driver()
	})
}

type S7Driver struct {
	config  model.DriverConfig
	simData map[string]interface{}
}

func NewS7Driver() driver.Driver {
	return &S7Driver{
		simData: make(map[string]interface{}),
	}
}

func (d *S7Driver) Init(cfg model.DriverConfig) error {
	d.config = cfg
	return nil
}

func (d *S7Driver) Connect(ctx context.Context) error {
	cfg := d.config.Config
	log.Printf("S7 Driver connecting to %v:%v (Rack=%v, Slot=%v, Type=%v, Startup=%v) (Simulated)...",
		cfg["ip"], cfg["port"], cfg["rack"], cfg["slot"], cfg["plcType"], cfg["startup"])
	time.Sleep(500 * time.Millisecond)
	log.Printf("S7 Driver connected (Simulated)")
	return nil
}

func (d *S7Driver) Disconnect() error {
	log.Printf("S7 Driver disconnected")
	return nil
}

func (d *S7Driver) Health() driver.HealthStatus {
	return driver.HealthStatusGood
}

func (d *S7Driver) SetSlaveID(slaveID uint8) error {
	// S7 usually doesn't use SlaveID in the same way as Modbus,
	// but might map to Rack/Slot. Ignoring for simulation.
	return nil
}

func (d *S7Driver) SetDeviceConfig(config map[string]any) error {
	return nil
}

func (d *S7Driver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	results := make(map[string]model.Value)

	for _, p := range points {
		val, err := d.readPoint(p)
		quality := "Good"
		if err != nil {
			quality = "Bad"
			log.Printf("Error reading point %s: %v", p.Name, err)
			continue
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

func (d *S7Driver) readPoint(p model.Point) (interface{}, error) {
	// Check if we have a simulated value stored
	if val, ok := d.simData[p.ID]; ok {
		// Add some jitter to numbers to make it look alive
		switch v := val.(type) {
		case float64:
			return v + (rand.Float64() - 0.5), nil
		case float32:
			return v + float32(rand.Float64()-0.5), nil
		case int:
			return v + rand.Intn(3) - 1, nil
		default:
			return val, nil
		}
	}

	// Otherwise generate based on type
	switch p.DataType {
	case "bool":
		return rand.Intn(2) == 1, nil
	case "uint8":
		return uint8(rand.Intn(255)), nil
	case "int8":
		return int8(rand.Intn(255) - 128), nil
	case "uint16":
		return uint16(rand.Intn(65535)), nil
	case "int16":
		return int16(rand.Intn(65535) - 32768), nil
	case "uint32":
		return uint32(rand.Intn(100000)), nil
	case "int32":
		return int32(rand.Intn(100000)), nil
	case "float", "float32":
		return float32(20.0 + rand.Float64()*50.0), nil
	case "double", "float64":
		return 20.0 + rand.Float64()*50.0, nil
	case "string":
		return "Simulated S7 String", nil
	default:
		return 0, fmt.Errorf("unsupported type: %s", p.DataType)
	}
}

func (d *S7Driver) WritePoint(ctx context.Context, p model.Point, value any) error {
	log.Printf("S7 Write: Point=%s Addr=%s Type=%s Value=%v", p.Name, p.Address, p.DataType, value)

	// Convert value based on DataType and store it
	var storedVal interface{}
	var err error

	// Simple conversion helper
	strVal := fmt.Sprintf("%v", value)

	switch p.DataType {
	case "bool":
		storedVal = strVal == "true" || strVal == "1"
	case "float", "float32":
		if v, e := strconv.ParseFloat(strVal, 32); e == nil {
			storedVal = float32(v)
		} else {
			err = e
		}
	case "double", "float64":
		if v, e := strconv.ParseFloat(strVal, 64); e == nil {
			storedVal = v
		} else {
			err = e
		}
	case "int16":
		if v, e := strconv.ParseInt(strVal, 10, 16); e == nil {
			storedVal = int16(v)
		} else {
			err = e
		}
	// Add other types as needed
	default:
		storedVal = value
	}

	if err != nil {
		return fmt.Errorf("failed to convert value for simulation: %v", err)
	}

	d.simData[p.ID] = storedVal
	return nil
}
