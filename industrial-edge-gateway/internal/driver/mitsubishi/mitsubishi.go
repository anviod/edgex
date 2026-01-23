package mitsubishi

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
	driver.RegisterDriver("mitsubishi-slmp", func() driver.Driver {
		return NewMitsubishiDriver()
	})
}

type MitsubishiDriver struct {
	config  model.DriverConfig
	simData map[string]interface{}
}

func NewMitsubishiDriver() driver.Driver {
	return &MitsubishiDriver{
		simData: make(map[string]interface{}),
	}
}

func (d *MitsubishiDriver) Init(cfg model.DriverConfig) error {
	d.config = cfg
	return nil
}

func (d *MitsubishiDriver) Connect(ctx context.Context) error {
	cfg := d.config.Config
	ip, _ := cfg["ip"].(string)

	port := 2000
	if p, ok := cfg["port"].(float64); ok {
		port = int(p)
	} else if p, ok := cfg["port"].(int); ok {
		port = p
	}

	mode, _ := cfg["mode"].(string) // TCP or UDP
	if mode == "" {
		mode = "TCP"
	}

	timeout := 15000
	if t, ok := cfg["timeout"].(float64); ok {
		timeout = int(t)
	} else if t, ok := cfg["timeout"].(int); ok {
		timeout = t
	}

	log.Printf("Mitsubishi SLMP Driver connecting to %s:%d (%s) Timeout=%dms...", ip, port, mode, timeout)

	// Simulate connection delay
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(100 * time.Millisecond):
	}

	log.Printf("Mitsubishi SLMP Driver connected (Simulated)")
	return nil
}

func (d *MitsubishiDriver) Disconnect() error {
	log.Printf("Mitsubishi SLMP Driver disconnected")
	return nil
}

func (d *MitsubishiDriver) Health() driver.HealthStatus {
	return driver.HealthStatusGood
}

func (d *MitsubishiDriver) SetSlaveID(slaveID uint8) error {
	return nil
}

func (d *MitsubishiDriver) SetDeviceConfig(config map[string]any) error {
	return nil
}

func (d *MitsubishiDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	results := make(map[string]model.Value)

	for _, p := range points {
		val, err := d.readPoint(p)
		quality := "Good"
		if err != nil {
			quality = "Bad"
			log.Printf("Error reading point %s: %v", p.Name, err)
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

func (d *MitsubishiDriver) WritePoint(ctx context.Context, point model.Point, value interface{}) error {
	log.Printf("Mitsubishi Write Point: %s = %v", point.Name, value)
	d.simData[point.ID] = value
	return nil
}

// Valid areas map
var validAreas = map[string]bool{
	"X": true, "Y": true, "M": true, "D": true,
	"DX": true, "DY": true, "B": true, "SB": true,
	"SM": true, "L": true, "F": true, "V": true,
	"S": true, "TS": true, "TC": true, "SS": true,
	"STS": true, "SC": true, "CS": true, "CC": true,
	"TN": true, "STN": true, "SN": true, "CN": true,
	"DSH": true, "DSL": true, "SD": true, "W": true,
	"WSH": true, "WSL": true, "SW": true, "R": true,
	"ZR": true, "RSH": true, "ZRSH": true, "RSL": true,
	"ZRSL": true, "Z": true,
}

func (d *MitsubishiDriver) readPoint(p model.Point) (interface{}, error) {
	if val, ok := d.simData[p.ID]; ok {
		return val, nil
	}

	// Parse address to seed random generator for consistent-ish results or just random
	// Format: AREA ADDRESS[.BIT][.LEN[H][L]]
	// Regex to extract AREA and ADDRESS
	re := regexp.MustCompile(`^([A-Z]+)([0-9]+)`)
	matches := re.FindStringSubmatch(strings.ToUpper(p.Address))

	if len(matches) < 3 {
		// Just random if parse fails (though validation should catch this)
		return rand.Intn(100), nil
	}

	// area := matches[1]
	// addr, _ := strconv.Atoi(matches[2])

	switch p.DataType {
	case "BIT", "BOOL":
		return rand.Intn(2) == 1, nil
	case "INT16":
		return int16(rand.Intn(65536) - 32768), nil
	case "UINT16":
		return uint16(rand.Intn(65536)), nil
	case "INT32":
		return int32(rand.Intn(100000)), nil
	case "UINT32":
		return uint32(rand.Intn(100000)), nil
	case "FLOAT":
		return rand.Float32() * 100, nil
	case "DOUBLE":
		return rand.Float64() * 100, nil
	case "STRING":
		return fmt.Sprintf("Mitsu-%d", rand.Intn(100)), nil
	default:
		return rand.Intn(100), nil
	}
}
