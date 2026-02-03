package modbus

import (
	"context"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"time"
)

func init() {
	driver.RegisterDriver("modbus-tcp", NewModbusDriver)
	driver.RegisterDriver("modbus-rtu", NewModbusDriver)
	driver.RegisterDriver("modbus-rtu-over-tcp", NewModbusDriver)
}

// ModbusDriver implements driver.Driver interface
type ModbusDriver struct {
	config    model.DriverConfig
	transport *ModbusTransport
	scheduler *PointScheduler
	state     *DeviceStateMachine

	// Kept for direct access if needed, though mostly delegating
	slaveID uint8
}

func NewModbusDriver() driver.Driver {
	return &ModbusDriver{
		state: NewDeviceStateMachine(),
	}
}

func (d *ModbusDriver) Init(config model.DriverConfig) error {
	d.config = config

	// Parse configuration
	d.slaveID = 1
	if v, ok := config.Config["slave_id"]; ok {
		switch val := v.(type) {
		case int:
			d.slaveID = uint8(val)
		case float64:
			d.slaveID = uint8(val)
		}
	}

	startAddress := 0
	if v, ok := config.Config["startAddress"]; ok {
		if f, ok := v.(float64); ok {
			startAddress = int(f)
		} else if i, ok := v.(int); ok {
			startAddress = i
		}
	}

	byteOrder4 := "ABCD"
	if v, ok := config.Config["byteOrder"]; ok {
		byteOrder4 = v.(string)
	}

	batchSize := 50
	if v, ok := config.Config["batchSize"]; ok {
		if f, ok := v.(float64); ok {
			batchSize = int(f)
		} else if i, ok := v.(int); ok {
			batchSize = i
		}
	}

	instructionInterval := time.Duration(0)
	if v, ok := config.Config["instructionInterval"]; ok {
		if f, ok := v.(float64); ok {
			instructionInterval = time.Duration(f) * time.Millisecond
		} else if i, ok := v.(int); ok {
			instructionInterval = time.Duration(i) * time.Millisecond
		}
	}

	// Initialize components
	d.transport = NewModbusTransport(config)

	decoder := NewPointDecoder(byteOrder4, startAddress)

	// Max packet size for Modbus TCP/RTU is typically around 250 bytes (120 registers)
	// We use 120 registers (240 bytes) as safe limit
	d.scheduler = NewPointScheduler(d.transport, decoder, 120, uint16(batchSize), instructionInterval)

	return nil
}

func (d *ModbusDriver) Connect(ctx context.Context) error {
	err := d.transport.Connect(ctx)
	if err != nil {
		d.state.OnFailure()
		return err
	}
	d.state.OnSuccess()
	return nil
}

func (d *ModbusDriver) Disconnect() error {
	return d.transport.Disconnect()
}

func (d *ModbusDriver) Health() driver.HealthStatus {
	if d.transport.IsConnected() && d.state.GetState() == StateOnline {
		return driver.HealthStatusGood
	}
	if !d.transport.IsConnected() {
		return driver.HealthStatusBad
	}
	// Maybe degraded? For now return Bad if not online
	return driver.HealthStatusBad
}

func (d *ModbusDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	if !d.transport.IsConnected() {
		// Try to reconnect
		if err := d.Connect(ctx); err != nil {
			return nil, err
		}
	}

	results, err := d.scheduler.Read(ctx, points)
	if err != nil {
		d.state.OnFailure()
		return results, err
	}
	d.state.OnSuccess()
	return results, nil
}

// WritePoint writes a single point
func (d *ModbusDriver) WritePoint(ctx context.Context, point model.Point, value any) error {
	if !d.transport.IsConnected() {
		if err := d.Connect(ctx); err != nil {
			return err
		}
	}

	err := d.scheduler.Write(ctx, point, value)
	if err != nil {
		d.state.OnFailure()
		return err
	}
	d.state.OnSuccess()
	return nil
}

// SetSlaveID sets the unit ID for subsequent requests
// This is used for devices that support dynamic slave ID switching or when managing multiple slaves over one connection
func (d *ModbusDriver) SetSlaveID(slaveID uint8) error {
	d.slaveID = slaveID
	d.transport.SetUnitID(slaveID)
	log.Printf("ModbusDriver SetSlaveID: changed to %d", slaveID)
	return nil
}

// SetDeviceConfig updates connection parameters dynamically
// This is required by the Driver interface but Modbus might not use it heavily if URL is fixed
func (d *ModbusDriver) SetDeviceConfig(config map[string]any) error {
	// Not implemented for Modbus yet, as config is usually set at Init
	return nil
}

// ReadPointsWithSlaveID reads points from a specific slave ID
// It sets the slave ID, reads points, and keeps the slave ID set for subsequent calls until changed
func (d *ModbusDriver) ReadPointsWithSlaveID(ctx context.Context, slaveID uint8, points []model.Point) (map[string]model.Value, error) {
	d.SetSlaveID(slaveID)
	return d.ReadPoints(ctx, points)
}
