package modbus

import (
	"context"
	"encoding/binary"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"math"
	"strconv"
	"time"

	"github.com/simonvetter/modbus"
)

func init() {
	driver.RegisterDriver("modbus-tcp", NewModbusDriver)
	driver.RegisterDriver("modbus-rtu", NewModbusDriver)
	driver.RegisterDriver("modbus-rtu-over-tcp", NewModbusDriver)
}

// ModbusDriver implements the Driver interface using simonvetter/modbus
type ModbusDriver struct {
	config         model.DriverConfig
	client         *modbus.ModbusClient
	connected      bool
	maxPacketSize  uint16 // 最大一次读取的寄存器数量（默认 125，Modbus TCP 限制）
	groupThreshold uint16 // 点位地址分组间隔阈值，超过此值则分组（默认 50）
}

// PointGroup 表示一组连续的点位及其地址信息
type PointGroup struct {
	RegType     string        // 寄存器类型
	StartOffset uint16        // 起始地址
	Count       uint16        // 数量
	Points      []model.Point // 该组中的所有点位
}

// AddressInfo 用于存储点位的地址信息
type AddressInfo struct {
	Point         model.Point
	RegType       string
	Offset        uint16
	RegisterCount uint16 // 该点位占用的寄存器数
}

func NewModbusDriver() driver.Driver {
	return &ModbusDriver{
		maxPacketSize:  125, // Modbus TCP 标准限制
		groupThreshold: 50,  // 地址间隔超过50则分组
	}
}

func (d *ModbusDriver) Init(cfg model.DriverConfig) error {
	d.config = cfg

	// 从配置中读取最大封包大小（可选）
	if maxPacketSize, ok := cfg.Config["max_packet_size"]; ok {
		switch v := maxPacketSize.(type) {
		case float64:
			d.maxPacketSize = uint16(v)
		case int:
			d.maxPacketSize = uint16(v)
		case uint16:
			d.maxPacketSize = v
		}
	}

	// 从配置中读取分组阈值（可选）
	if groupThreshold, ok := cfg.Config["group_threshold"]; ok {
		switch v := groupThreshold.(type) {
		case float64:
			d.groupThreshold = uint16(v)
		case int:
			d.groupThreshold = uint16(v)
		case uint16:
			d.groupThreshold = v
		}
	}

	// 验证参数有效性
	if d.maxPacketSize == 0 {
		d.maxPacketSize = 125
	}
	if d.groupThreshold == 0 {
		d.groupThreshold = 50
	}

	return nil
}

func (d *ModbusDriver) Connect(ctx context.Context) error {
	// 1. Build URL based on config
	// "tcp://127.0.0.1:502" or "rtu:///dev/ttyUSB0"
	url, ok := d.config.Config["url"].(string)
	if !ok || url == "" {
		// Try to construct RTU URL from components if port is provided
		if port, okPort := d.config.Config["port"].(string); okPort && port != "" {
			baudRate := 9600
			if v, ok := d.config.Config["baudRate"]; ok {
				if f, ok := v.(float64); ok {
					baudRate = int(f)
				} else if i, ok := v.(int); ok {
					baudRate = i
				}
			}

			dataBits := 8
			if v, ok := d.config.Config["dataBits"]; ok {
				if f, ok := v.(float64); ok {
					dataBits = int(f)
				} else if i, ok := v.(int); ok {
					dataBits = i
				}
			}

			stopBits := 1
			if v, ok := d.config.Config["stopBits"]; ok {
				if f, ok := v.(float64); ok {
					stopBits = int(f)
				} else if i, ok := v.(int); ok {
					stopBits = i
				}
			}

			parity := "N"
			if v, ok := d.config.Config["parity"].(string); ok {
				parity = v
			}

			// Construct RTU URL: rtu:///dev/ttyS1?baudrate=9600&data_bits=8&parity=N&stop_bits=1
			url = fmt.Sprintf("rtu://%s?baudrate=%d&data_bits=%d&parity=%s&stop_bits=%d",
				port, baudRate, dataBits, parity, stopBits)
		} else {
			// Fallback for compatibility if old config style used
			addr, _ := d.config.Config["address"].(string)
			if addr != "" {
				url = "tcp://" + addr
			} else {
				return fmt.Errorf("modbus url or port not configured")
			}
		}
	}

	// Configurable timeout
	timeout := 2 * time.Second
	if tVal, ok := d.config.Config["timeout"]; ok {
		if f, ok := tVal.(float64); ok {
			timeout = time.Duration(f) * time.Millisecond
		} else if i, ok := tVal.(int); ok {
			timeout = time.Duration(i) * time.Millisecond
		} else if s, ok := tVal.(string); ok {
			if d, err := time.ParseDuration(s); err == nil {
				timeout = d
			}
		}
	}

	// 2. Create client
	var err error
	d.client, err = modbus.NewClient(&modbus.ClientConfiguration{
		URL:     url,
		Timeout: timeout,
	})
	if err != nil {
		return err
	}

	// 3. Open connection
	err = d.client.Open()
	if err != nil {
		return err
	}

	// 4. Set Unit ID (Slave ID)
	if slaveID, ok := d.config.Config["slave_id"]; ok {
		// Handle different types (json numbers are often float64)
		var sid uint8
		switch v := slaveID.(type) {
		case int:
			sid = uint8(v)
		case float64:
			sid = uint8(v)
		case uint8:
			sid = v
		default:
			sid = 1
		}
		d.client.SetUnitId(sid)
	}

	d.connected = true
	log.Printf("ModbusDriver connected to %s (MaxPacketSize: %d, GroupThreshold: %d)",
		url, d.maxPacketSize, d.groupThreshold)
	return nil
}

// parseAddress 解析点位地址，返回寄存器类型和偏移量
func (d *ModbusDriver) parseAddress(addr string) (string, uint16, error) {
	addrInt, err := strconv.Atoi(addr)
	if err != nil {
		return "", 0, fmt.Errorf("invalid address format: %s", addr)
	}

	var regType string
	var offset uint16

	if addrInt >= 40001 && addrInt <= 49999 {
		regType = "HOLDING_REGISTER"
		offset = uint16(addrInt - 40001)
	} else if addrInt >= 30001 && addrInt <= 39999 {
		regType = "INPUT_REGISTER"
		offset = uint16(addrInt - 30001)
	} else if addrInt >= 10001 && addrInt <= 19999 {
		regType = "DISCRETE_INPUT"
		offset = uint16(addrInt - 10001)
	} else if addrInt >= 1 && addrInt <= 9999 {
		regType = "COIL"
		offset = uint16(addrInt - 1)
	} else {
		// Fallback: assume Holding Register with direct offset
		regType = "HOLDING_REGISTER"
		offset = uint16(addrInt)
	}

	return regType, offset, nil
}

// getRegisterCount 根据数据类型获取占用的寄存器数
func (d *ModbusDriver) getRegisterCount(dataType string) uint16 {
	switch dataType {
	case "float32", "int32", "uint32":
		return 2
	default:
		return 1
	}
}

// groupPoints 将点位按寄存器类型和地址连续性进行分组，以优化批量读取
func (d *ModbusDriver) groupPoints(points []model.Point) ([]PointGroup, error) {
	if len(points) == 0 {
		return []PointGroup{}, nil
	}

	// 第一步：解析所有点位的地址信息
	addressInfos := make([]AddressInfo, len(points))
	for i, p := range points {
		regType, offset, err := d.parseAddress(p.Address)
		if err != nil {
			return nil, err
		}
		addressInfos[i] = AddressInfo{
			Point:         p,
			RegType:       regType,
			Offset:        offset,
			RegisterCount: d.getRegisterCount(p.DataType),
		}
	}

	// 第二步：按寄存器类型和地址分组
	// 使用 map 存储每个寄存器类型的点位
	typeGroups := make(map[string][]AddressInfo)
	for _, info := range addressInfos {
		typeGroups[info.RegType] = append(typeGroups[info.RegType], info)
	}

	// 第三步：对每个寄存器类型的点位按地址排序和分组
	var groups []PointGroup

	for regType, infos := range typeGroups {
		// 跳过 COIL 和 DISCRETE_INPUT，因为它们不能批量优化（返回不同的数据格式）
		if regType == "COIL" || regType == "DISCRETE_INPUT" {
			for _, info := range infos {
				groups = append(groups, PointGroup{
					RegType:     regType,
					StartOffset: info.Offset,
					Count:       info.RegisterCount,
					Points:      []model.Point{info.Point},
				})
			}
			continue
		}

		// 按地址排序
		sortAddressInfos(infos)

		// 按地址连续性和最大数据量分组
		currentGroup := PointGroup{
			RegType:     regType,
			StartOffset: infos[0].Offset,
			Points:      []model.Point{infos[0].Point},
			Count:       infos[0].RegisterCount,
		}

		for i := 1; i < len(infos); i++ {
			info := infos[i]
			currentEndOffset := currentGroup.StartOffset + currentGroup.Count

			// 检查是否应该合并到当前组
			// 条件：1) 地址连续或接近 2) 不超过最大数据量
			gap := info.Offset - currentEndOffset
			wouldExceedMax := (currentGroup.Count + info.RegisterCount) > d.maxPacketSize

			if gap <= d.groupThreshold && !wouldExceedMax {
				// 合并到当前组
				currentGroup.Count = info.Offset - currentGroup.StartOffset + info.RegisterCount
				currentGroup.Points = append(currentGroup.Points, info.Point)
			} else {
				// 开始新组
				groups = append(groups, currentGroup)
				currentGroup = PointGroup{
					RegType:     regType,
					StartOffset: info.Offset,
					Points:      []model.Point{info.Point},
					Count:       info.RegisterCount,
				}
			}
		}

		// 添加最后一组
		groups = append(groups, currentGroup)
	}

	return groups, nil
}

// sortAddressInfos 按地址排序地址信息
func sortAddressInfos(infos []AddressInfo) {
	// 简单的冒泡排序（实际可用 sort.Slice）
	for i := 0; i < len(infos); i++ {
		for j := i + 1; j < len(infos); j++ {
			if infos[j].Offset < infos[i].Offset {
				infos[i], infos[j] = infos[j], infos[i]
			}
		}
	}
}

func (d *ModbusDriver) Disconnect() error {
	if d.client != nil {
		d.client.Close()
	}
	d.connected = false
	return nil
}

func (d *ModbusDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	if !d.connected || d.client == nil {
		return nil, fmt.Errorf("driver not connected")
	}

	result := make(map[string]model.Value)
	now := time.Now()

	// 1. 将点位分组以优化批量读取
	groups, err := d.groupPoints(points)
	if err != nil {
		return nil, err
	}

	log.Printf("Optimized reading %d points into %d groups", len(points), len(groups))

	// 2. 按组批量读取数据
	for _, group := range groups {
		groupData, err := d.readPointGroup(group)
		if err != nil {
			log.Printf("Error reading group starting at offset %d: %v", group.StartOffset, err)
			// 即使组读取失败，也继续处理其他组，但标记数据为 Bad
			for _, point := range group.Points {
				result[point.ID] = model.Value{
					PointID: point.ID,
					Value:   nil,
					Quality: "Bad",
					TS:      now,
				}
			}
			continue
		}

		// 3. 将批量读取的数据分配给各个点位
		for pointID, value := range groupData {
			result[pointID] = model.Value{
				PointID: pointID,
				Value:   value,
				Quality: "Good",
				TS:      now,
			}
		}
	}

	return result, nil
}

// readPointGroup 批量读取一个点位组，返回点位ID到值的映射
func (d *ModbusDriver) readPointGroup(group PointGroup) (map[string]any, error) {
	result := make(map[string]any)

	// 对于 COIL 和 DISCRETE_INPUT，各自单独读取
	if group.RegType == "COIL" {
		if len(group.Points) == 1 {
			p := group.Points[0]
			val, err := d.client.ReadCoil(group.StartOffset)
			if err != nil {
				return nil, err
			}
			result[p.ID] = val
		}
		return result, nil
	}

	if group.RegType == "DISCRETE_INPUT" {
		if len(group.Points) == 1 {
			p := group.Points[0]
			val, err := d.client.ReadDiscreteInput(group.StartOffset)
			if err != nil {
				return nil, err
			}
			result[p.ID] = val
		}
		return result, nil
	}

	// 对于 HOLDING_REGISTER 和 INPUT_REGISTER，批量读取
	var bytes []byte
	var err error

	if group.RegType == "HOLDING_REGISTER" {
		bytes, err = d.client.ReadBytes(group.StartOffset, group.Count*2, modbus.HOLDING_REGISTER)
	} else if group.RegType == "INPUT_REGISTER" {
		bytes, err = d.client.ReadBytes(group.StartOffset, group.Count*2, modbus.INPUT_REGISTER)
	}

	if err != nil {
		return nil, err
	}

	// 将读取的字节流分配给各个点位
	for _, point := range group.Points {
		_, offset, _ := d.parseAddress(point.Address)
		regCount := d.getRegisterCount(point.DataType)

		// 计算该点位在读取数据中的位置
		// offset 是相对于寄存器开始的地址
		// group.StartOffset 是组的起始地址
		pointByteOffset := (offset - group.StartOffset) * 2
		pointByteLength := regCount * 2

		if int(pointByteOffset+pointByteLength) > len(bytes) {
			log.Printf("Warning: point %s byte range out of bounds", point.ID)
			continue
		}

		pointBytes := bytes[pointByteOffset : pointByteOffset+pointByteLength]
		val, err := decodeValue(pointBytes, point.DataType)
		if err != nil {
			log.Printf("Error decoding point %s: %v", point.ID, err)
			continue
		}

		// 应用缩放和偏移
		// 注意：如果 Scale 和 Offset 都是 0（未设置），使用原始值
		var finalValue any

		if point.Scale == 0 && point.Offset == 0 {
			// 默认情况：未设置缩放和偏移，直接使用原始值
			finalValue = val
		} else {
			// 应用缩放和偏移：result = value * Scale + Offset
			if scaledVal, ok := val.(float64); ok {
				finalValue = scaledVal*point.Scale + point.Offset
			} else if scaledVal, ok := val.(float32); ok {
				finalValue = float64(scaledVal)*point.Scale + point.Offset
			} else if scaledVal, ok := val.(int16); ok {
				finalValue = float64(scaledVal)*point.Scale + point.Offset
			} else if scaledVal, ok := val.(uint16); ok {
				finalValue = float64(scaledVal)*point.Scale + point.Offset
			} else if scaledVal, ok := val.(int32); ok {
				finalValue = float64(scaledVal)*point.Scale + point.Offset
			} else if scaledVal, ok := val.(uint32); ok {
				finalValue = float64(scaledVal)*point.Scale + point.Offset
			} else {
				finalValue = val
			}
		}

		result[point.ID] = finalValue
	}

	return result, nil
}

func decodeValue(b []byte, dataType string) (any, error) {
	if len(b) < 2 {
		return nil, fmt.Errorf("not enough bytes")
	}

	switch dataType {
	case "int16":
		return int16(binary.BigEndian.Uint16(b)), nil
	case "uint16":
		return binary.BigEndian.Uint16(b), nil
	case "float32":
		if len(b) < 4 {
			return nil, fmt.Errorf("not enough bytes for float32")
		}
		bits := binary.BigEndian.Uint32(b)
		return math.Float32frombits(bits), nil
	case "int32":
		if len(b) < 4 {
			return nil, fmt.Errorf("not enough bytes for int32")
		}
		return int32(binary.BigEndian.Uint32(b)), nil
	default:
		// Default to uint16
		return binary.BigEndian.Uint16(b), nil
	}
}

func (d *ModbusDriver) WritePoint(ctx context.Context, point model.Point, value any) error {
	if !d.connected || d.client == nil {
		return fmt.Errorf("driver not connected")
	}

	addr, err := strconv.Atoi(point.Address)
	if err != nil {
		return fmt.Errorf("invalid address format: %s", point.Address)
	}

	var regType string
	var offset uint16

	if addr >= 40001 && addr <= 49999 {
		regType = "HOLDING_REGISTER"
		offset = uint16(addr - 40001)
	} else if addr >= 1 && addr <= 9999 {
		regType = "COIL"
		offset = uint16(addr - 1)
	} else {
		// Fallback
		regType = "HOLDING_REGISTER"
		offset = uint16(addr)
	}

	switch regType {
	case "COIL":
		var boolVal bool
		switch v := value.(type) {
		case bool:
			boolVal = v
		case int:
			boolVal = v != 0
		case float64:
			boolVal = v != 0
		case string:
			boolVal = v == "true" || v == "1"
		default:
			return fmt.Errorf("unsupported value type for coil: %T", value)
		}
		return d.client.WriteCoil(offset, boolVal)

	case "HOLDING_REGISTER":
		// Handle writing different types
		switch point.DataType {
		case "int16", "uint16":
			var intVal uint16
			switch v := value.(type) {
			case float64:
				intVal = uint16(v)
			case int:
				intVal = uint16(v)
			case string:
				i, _ := strconv.Atoi(v)
				intVal = uint16(i)
			default:
				return fmt.Errorf("unsupported value type: %T", value)
			}
			return d.client.WriteRegister(offset, intVal)

		case "float32":
			var fVal float32
			switch v := value.(type) {
			case float64:
				fVal = float32(v)
			case float32:
				fVal = v
			case int:
				fVal = float32(v)
			case string:
				f, _ := strconv.ParseFloat(v, 32)
				fVal = float32(f)
			}
			return d.client.WriteFloat32(offset, fVal)
		}
	}

	return fmt.Errorf("write not supported for this address/type")
}

// SetSlaveID 设置 Modbus 从属设备 ID（Unit ID）
func (d *ModbusDriver) SetSlaveID(slaveID uint8) error {
	if !d.connected || d.client == nil {
		return fmt.Errorf("driver not connected")
	}
	d.client.SetUnitId(slaveID)
	log.Printf("ModbusDriver SetSlaveID: changed to %d", slaveID)
	return nil
}

func (d *ModbusDriver) SetDeviceConfig(config map[string]any) error {
	return nil
}

// ReadPointsWithSlaveID 为指定的 slave_id 读取点位数据
// 这个方法会临时改变 Unit ID，读取数据后不会恢复原来的 Unit ID
func (d *ModbusDriver) ReadPointsWithSlaveID(ctx context.Context, slaveID uint8, points []model.Point) (map[string]model.Value, error) {
	if !d.connected || d.client == nil {
		return nil, fmt.Errorf("driver not connected")
	}

	// 设置要读取的 slave ID
	d.client.SetUnitId(slaveID)
	log.Printf("Switched to slave_id: %d", slaveID)

	// 使用标准的 ReadPoints 方法
	return d.ReadPoints(ctx, points)
}
func (d *ModbusDriver) Health() driver.HealthStatus {
	if d.connected {
		// Maybe do a quick ping read?
		return driver.HealthStatusGood
	}
	return driver.HealthStatusBad
}
