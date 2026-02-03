package opcua

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"math"
	"time"
)

func init() {
	driver.RegisterDriver("opc-ua", NewOpcUaDriver)
}

// OpcUaDriver 实现了基于模拟器的 OPC UA 驱动
type OpcUaDriver struct {
	config    model.DriverConfig
	connected bool
	slaveID   uint8
}

func NewOpcUaDriver() driver.Driver {
	return &OpcUaDriver{}
}

func (d *OpcUaDriver) Init(cfg model.DriverConfig) error {
	d.config = cfg
	return nil
}

func (d *OpcUaDriver) Connect(ctx context.Context) error {
	// 模拟连接过程
	url, _ := d.config.Config["url"].(string)
	log.Printf("OPC UA Driver connecting to %s (Simulated)...", url)
	time.Sleep(500 * time.Millisecond) // 模拟网络延迟
	d.connected = true
	log.Printf("OPC UA Driver connected (Simulated)")
	return nil
}

func (d *OpcUaDriver) Disconnect() error {
	d.connected = false
	log.Printf("OPC UA Driver disconnected (Simulated)")
	return nil
}

func (d *OpcUaDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	if !d.connected {
		return nil, fmt.Errorf("driver not connected")
	}

	result := make(map[string]model.Value)
	now := time.Now()

	for _, p := range points {
		// 模拟生成数据
		val := d.simulateValue(p)

		result[p.ID] = model.Value{
			PointID: p.ID,
			Value:   val,
			Quality: "Good",
			TS:      now,
		}
	}

	return result, nil
}

func (d *OpcUaDriver) simulateValue(p model.Point) any {
	// 基于当前时间生成变化的数据，使曲线看起来自然
	t := float64(time.Now().UnixMilli()) / 1000.0

	// 根据点位ID或名称生成不同的模拟模式
	seed := 0
	for _, c := range p.ID {
		seed += int(c)
	}

	// 基础正弦波
	baseVal := math.Sin(t + float64(seed))

	switch p.DataType {
	case "float32", "float64":
		// 映射到 0-100 范围
		return (baseVal + 1) * 50
	case "int16", "int32", "int64", "uint16", "uint32":
		// 映射到 0-1000 整数
		return int((baseVal + 1) * 500)
	case "bool":
		return baseVal > 0
	case "string":
		if baseVal > 0 {
			return "Running"
		}
		return "Stopped"
	default:
		return 0
	}
}

func (d *OpcUaDriver) WritePoint(ctx context.Context, point model.Point, value any) error {
	if !d.connected {
		return fmt.Errorf("driver not connected")
	}
	log.Printf("[OPC UA Simulator] Write point %s (Address: %s) = %v success", point.ID, point.Address, value)
	return nil
}

func (d *OpcUaDriver) Health() driver.HealthStatus {
	if d.connected {
		return driver.HealthStatusGood
	}
	return driver.HealthStatusBad
}

func (d *OpcUaDriver) SetSlaveID(slaveID uint8) error {
	d.slaveID = slaveID
	return nil
}

func (d *OpcUaDriver) SetDeviceConfig(config map[string]any) error {
	return nil
}
