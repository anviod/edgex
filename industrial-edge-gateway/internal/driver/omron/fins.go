package omron

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"math/rand"
	"regexp"
	"strings"
	"time"
)

func init() {
	driver.RegisterDriver("omron-fins", func() driver.Driver {
		return NewOmronFinsDriver()
	})
}

type OmronFinsDriver struct {
	config  model.DriverConfig
	simData map[string]interface{} // Simulate data storage
}

func NewOmronFinsDriver() driver.Driver {
	return &OmronFinsDriver{
		simData: make(map[string]interface{}),
	}
}

func (d *OmronFinsDriver) Init(cfg model.DriverConfig) error {
	d.config = cfg
	return nil
}

func (d *OmronFinsDriver) Connect(ctx context.Context) error {
	cfg := d.config.Config
	ip, _ := cfg["ip"].(string)
	port := 9600
	if p, ok := cfg["port"].(float64); ok {
		port = int(p)
	} else if p, ok := cfg["port"].(int); ok {
		port = p
	}

	modelStr, _ := cfg["model"].(string)

	mode, _ := cfg["mode"].(string)
	if mode == "" {
		mode = "TCP"
	}

	log.Printf("Omron FINS Driver connecting to %s:%d (%s) (Model: %s)...", ip, port, mode, modelStr)
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(100 * time.Millisecond):
	}
	log.Printf("Omron FINS Driver connected (Simulated)")
	return nil
}

func (d *OmronFinsDriver) Disconnect() error {
	log.Println("Omron FINS Driver disconnected")
	return nil
}

func (d *OmronFinsDriver) Health() driver.HealthStatus {
	return driver.HealthStatusGood
}

func (d *OmronFinsDriver) SetSlaveID(slaveID uint8) error {
	// Not strictly used in FINS IP usually, but might map to Unit No.
	return nil
}

func (d *OmronFinsDriver) SetDeviceConfig(config map[string]any) error {
	// Handle device specific config if needed
	return nil
}

func (d *OmronFinsDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	results := make(map[string]model.Value)
	for _, p := range points {
		val, err := d.readPoint(p)
		quality := "Good"
		if err != nil {
			quality = "Bad"
			log.Printf("Error reading point %s: %v", p.Name, err)
			// For simulation, maybe return a default or just log
		}
		// If val is nil (error), we might still want to return something or skip
		if val != nil {
			results[p.Name] = model.Value{
				Value:   val,
				TS:      time.Now(),
				Quality: quality,
			}
		}
	}
	return results, nil
}

func (d *OmronFinsDriver) readPoint(p model.Point) (interface{}, error) {
	// If we wrote a value, return it
	if val, ok := d.simData[p.ID]; ok {
		return val, nil
	}

	// Generate random simulated data based on type
	switch p.DataType {
	case "BOOL", "BIT":
		return rand.Intn(2) == 1, nil
	case "INT8":
		return int8(rand.Intn(256) - 128), nil
	case "UINT8":
		return uint8(rand.Intn(256)), nil
	case "INT16":
		return int16(rand.Intn(65536) - 32768), nil
	case "UINT16":
		return uint16(rand.Intn(65536)), nil
	case "INT32":
		return int32(rand.Intn(100000)), nil
	case "UINT32":
		return uint32(rand.Intn(100000)), nil
	case "INT64":
		return int64(rand.Intn(1000000)), nil
	case "UINT64":
		return uint64(rand.Intn(1000000)), nil
	case "FLOAT":
		return rand.Float32() * 100, nil
	case "DOUBLE":
		return rand.Float64() * 100, nil
	case "STRING":
		return fmt.Sprintf("OmronData-%d", rand.Intn(100)), nil
	default:
		return rand.Intn(100), nil
	}
}

func (d *OmronFinsDriver) WritePoint(ctx context.Context, p model.Point, value interface{}) error {
	d.simData[p.ID] = value
	log.Printf("Omron FINS WritePoint: %s = %v", p.Name, value)
	return nil
}

// Helper to validate address format (used by ChannelManager via public helper or just implicitly here)
// Address Format: AREA ADDRESS[.BIT][.LEN[H][L]]
// e.g. D100, CIO1.2, W3.4, H4.15L
func ParseOmronAddress(address string) error {
	address = strings.ToUpper(address)

	// Supported Areas: CIO, A, W, H, D, P, F, EM(digits)
	// Regex breakdown:
	// ^(CIO|A|W|H|D|P|F|EM\d*)  -> Area
	// (\d+)                     -> Address Index
	// (\.\d+)?                  -> Optional Bit (.0 to .15)
	// ([HL]|\.\d+[HL]?)?        -> Optional String Len/Endian (simplified check)

	// Let's use a simpler regex for validation
	// Matches: D100, D100.1, EM10.100, CIO0.0
	re := regexp.MustCompile(`^(CIO|A|W|H|D|P|F|EM\d*)(\d+)(\.\d+)?([HL]|\.\d+[HL]?)?$`)

	if !re.MatchString(address) {
		return fmt.Errorf("invalid omron fins address format")
	}
	return nil
}
