package driver

import (
	"context"
	"industrial-edge-gateway/internal/model"
)

// HealthStatus represents the health of the driver connection
type HealthStatus int

const (
	HealthStatusUnknown HealthStatus = iota
	HealthStatusGood
	HealthStatusBad
)

// Driver is the unified interface for all protocol drivers
type Driver interface {
	Init(cfg model.DriverConfig) error
	Connect(ctx context.Context) error
	Disconnect() error
	ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error)
	WritePoint(ctx context.Context, point model.Point, value any) error
	Health() HealthStatus
	// SetSlaveID sets the slave/unit ID for protocols that support multiple slaves (optional)
	SetSlaveID(slaveID uint8) error
	// SetDeviceConfig sets device specific configuration (optional, for protocols needing per-device connection info like BACnet IP)
	SetDeviceConfig(config map[string]any) error
}

// Scanner is an optional interface for drivers that support discovery
type Scanner interface {
	Scan(ctx context.Context, params map[string]any) (any, error)
}

// ObjectScanner is an optional interface for drivers that support object/point discovery on a device
type ObjectScanner interface {
	ScanObjects(ctx context.Context, config map[string]any) (any, error)
}

// Factory function type for creating drivers
type Factory func() Driver

var drivers = make(map[string]Factory)

// RegisterDriver registers a driver factory for a given protocol name
func RegisterDriver(name string, factory Factory) {
	drivers[name] = factory
}

// GetDriver creates a new driver instance for the given protocol
func GetDriver(name string) (Driver, bool) {
	factory, ok := drivers[name]
	if !ok {
		return nil, false
	}
	return factory(), true
}
