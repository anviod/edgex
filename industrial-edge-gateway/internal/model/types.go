package model

import (
	"encoding/json"
	"errors"
	"time"
)

type Duration time.Duration

func (d Duration) MarshalText() ([]byte, error) {
	return []byte(time.Duration(d).String()), nil
}

func (d *Duration) UnmarshalText(text []byte) error {
	val, err := time.ParseDuration(string(text))
	if err != nil {
		return err
	}
	*d = Duration(val)
	return nil
}

func (d Duration) MarshalJSON() ([]byte, error) {
	return json.Marshal(time.Duration(d).String())
}

func (d *Duration) UnmarshalJSON(b []byte) error {
	var v interface{}
	if err := json.Unmarshal(b, &v); err != nil {
		return err
	}
	switch value := v.(type) {
	case float64:
		*d = Duration(time.Duration(value))
	case string:
		tmp, err := time.ParseDuration(value)
		if err != nil {
			return err
		}
		*d = Duration(tmp)
	default:
		return errors.New("invalid duration")
	}
	return nil
}

// Point represents a data point configuration (Tag/Variable)
type Point struct {
	ID         string           `json:"id" yaml:"id"`
	Name       string           `json:"name" yaml:"name"`
	Address    string           `json:"address" yaml:"address"`   // Modbus address / PLC register
	DataType   string           `json:"datatype" yaml:"datatype"` // int16, float32, bool, bit.0
	Scale      float64          `json:"scale" yaml:"scale"`
	Offset     float64          `json:"offset" yaml:"offset"`
	Unit       string           `json:"unit" yaml:"unit"`
	ReadWrite  string           `json:"readwrite" yaml:"readwrite"` // R / RW
	Group      string           `json:"group" yaml:"group"`
	ReportMode string           `json:"report_mode" yaml:"report_mode"` // cycle / cov / event
	Threshold  *ThresholdConfig `json:"threshold" yaml:"threshold"`
}

// ThresholdConfig defines alarm thresholds for a point
type ThresholdConfig struct {
	High float64 `json:"high" yaml:"high"`
	Low  float64 `json:"low" yaml:"low"`
}

// Value represents the standardized output of a collected point
type Value struct {
	ChannelID string    `json:"channel_id"`
	DeviceID  string    `json:"device_id"`
	PointID   string    `json:"point_id"`
	Value     any       `json:"value"`
	Quality   string    `json:"quality"`
	TS        time.Time `json:"timestamp"`
}

// PointData represents point configuration and current value for frontend display
type PointData struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Address   string    `json:"address"`
	DataType  string    `json:"datatype"`
	Value     any       `json:"value"`
	Quality   string    `json:"quality"`
	Timestamp time.Time `json:"timestamp"`
	Unit      string    `json:"unit,omitempty"`
	ReadWrite string    `json:"readwrite"` // R / RW
}

// Device represents a device configuration (within a channel)
type Device struct {
	ID       string         `json:"id" yaml:"id"`
	Name     string         `json:"name" yaml:"name"`
	Enable   bool           `json:"enable" yaml:"enable"`
	Interval Duration       `json:"interval" yaml:"interval"`
	Config   map[string]any `json:"config" yaml:"config"` // 设备特定配置（如 slave_id）
	Points   []Point        `json:"points" yaml:"points"` // 该设备的点位列表
	StopChan chan struct{}  `json:"-" yaml:"-"`
	// Runtime state fields
	NodeRuntime *struct {
		FailCount     int
		SuccessCount  int
		LastFailTime  time.Time
		NextRetryTime time.Time
		State         int // NodeState enum
	} `json:"-" yaml:"-"`
}

// Channel represents a collection channel (采集通道)
// 一个通道对应一个采集驱动 (如 Modbus TCP, S7, Modbus RTU 等)
type Channel struct {
	ID       string         `json:"id" yaml:"id"`
	Name     string         `json:"name" yaml:"name"`
	Protocol string         `json:"protocol" yaml:"protocol"` // modbus-tcp, modbus-rtu, s7, opc-ua, etc.
	Enable   bool           `json:"enable" yaml:"enable"`
	Config   map[string]any `json:"config" yaml:"config"`   // 协议特定配置 (IP, Port, etc.)
	Devices  []Device       `json:"devices" yaml:"devices"` // 该通道下的设备列表
	StopChan chan struct{}  `json:"-" yaml:"-"`
	// Runtime fields
	NodeRuntime *struct {
		FailCount     int
		SuccessCount  int
		LastFailTime  time.Time
		NextRetryTime time.Time
		State         int
	} `json:"-" yaml:"-"`
}

// DriverConfig holds configuration for initializing a driver
type DriverConfig struct {
	ChannelID string
	Config    map[string]any
}

// NorthboundConfig defines configuration for northbound data reporting
type NorthboundConfig struct {
	MQTT   MQTTConfig     `json:"mqtt" yaml:"mqtt"`
	OPCUA  OPCUAConfig    `json:"opcua" yaml:"opcua"`
	Status map[string]int `json:"status,omitempty" yaml:"-"`
}

type MQTTConfig struct {
	Enable   bool                           `json:"enable" yaml:"enable"`
	Broker   string                         `json:"broker" yaml:"broker"`
	ClientID string                         `json:"client_id" yaml:"client_id"`
	Topic    string                         `json:"topic" yaml:"topic"`
	Username string                         `json:"username" yaml:"username"`
	Password string                         `json:"password" yaml:"password"`
	Devices  map[string]DevicePublishConfig `json:"devices" yaml:"devices"`
}

type DevicePublishConfig struct {
	Enable   bool     `json:"enable" yaml:"enable"`
	Strategy string   `json:"strategy" yaml:"strategy"` // "periodic" or "cov"
	Interval Duration `json:"interval" yaml:"interval"` // 0 means use collection interval
}

type OPCUAConfig struct {
	Enable   bool            `json:"enable" yaml:"enable"`
	Port     int             `json:"port" yaml:"port"`
	Endpoint string          `json:"endpoint" yaml:"endpoint"`
	Devices  map[string]bool `json:"devices" yaml:"devices"` // Key: DeviceID, Value: Enable
}
