package modbus

import (
	"encoding/binary"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"math"
	"strconv"
)

// Decoder 接口定义
type Decoder interface {
	Decode(point model.Point, raw []byte) (any, string, error)
	Encode(point model.Point, value any) ([]uint16, error)
	ParseAddress(addr string) (string, uint16, error)
	GetRegisterCount(dataType string) uint16
}

// PointDecoder 实现 Decoder 接口
type PointDecoder struct {
	byteOrder4   string
	startAddress int
}

func NewPointDecoder(byteOrder4 string, startAddress int) *PointDecoder {
	if byteOrder4 == "" {
		byteOrder4 = "ABCD"
	}
	return &PointDecoder{
		byteOrder4:   byteOrder4,
		startAddress: startAddress,
	}
}

// ParseAddress 解析点位地址，返回寄存器类型和偏移量
func (d *PointDecoder) ParseAddress(addr string) (string, uint16, error) {
	addrInt, err := strconv.Atoi(addr)
	if err != nil {
		return "", 0, fmt.Errorf("invalid address format: %s", addr)
	}

	var regType string
	var offset uint16

	baseHR := 40000 + d.startAddress
	baseIR := 30000 + d.startAddress
	baseDI := 10000 + d.startAddress
	baseCoil := d.startAddress

	if addrInt >= baseHR && addrInt <= baseHR+9999 {
		regType = "HOLDING_REGISTER"
		offset = uint16(addrInt - baseHR)
	} else if addrInt >= baseIR && addrInt <= baseIR+9999 {
		regType = "INPUT_REGISTER"
		offset = uint16(addrInt - baseIR)
	} else if addrInt >= baseDI && addrInt <= baseDI+9999 {
		regType = "DISCRETE_INPUT"
		offset = uint16(addrInt - baseDI)
	} else if addrInt >= baseCoil && addrInt <= baseCoil+9999 {
		regType = "COIL"
		offset = uint16(addrInt - baseCoil)
	} else {
		// Fallback
		regType = "HOLDING_REGISTER"
		if addrInt < d.startAddress {
			offset = 0
		} else {
			offset = uint16(addrInt - d.startAddress)
		}
	}

	return regType, offset, nil
}

// GetRegisterCount 根据数据类型获取占用的寄存器数
func (d *PointDecoder) GetRegisterCount(dataType string) uint16 {
	switch dataType {
	case "float32", "int32", "uint32":
		return 2
	case "int64", "uint64", "float64":
		return 4
	default:
		return 1
	}
}

// Decode 解码原始字节数据
func (d *PointDecoder) Decode(point model.Point, raw []byte) (any, string, error) {
	val, err := d.decodeRaw(point, raw)
	if err != nil {
		return nil, "Bad", err
	}

	// 应用缩放和偏移
	val = d.applyScaleOffset(point, val)

	// TODO: 可以添加范围检查以确定 Quality
	return val, "Good", nil
}

func (d *PointDecoder) decodeRaw(point model.Point, b []byte) (any, error) {
	if len(b) < 2 {
		return nil, fmt.Errorf("not enough bytes")
	}

	switch point.DataType {
	case "int16":
		return int16(binary.BigEndian.Uint16(b)), nil
	case "uint16":
		return binary.BigEndian.Uint16(b), nil
	case "float32":
		if len(b) < 4 {
			return nil, fmt.Errorf("not enough bytes for float32")
		}
		orderedBytes := d.applyByteOrder(b)
		bits := binary.BigEndian.Uint32(orderedBytes)
		return math.Float32frombits(bits), nil
	case "int32":
		if len(b) < 4 {
			return nil, fmt.Errorf("not enough bytes for int32")
		}
		orderedBytes := d.applyByteOrder(b)
		return int32(binary.BigEndian.Uint32(orderedBytes)), nil
	case "uint32":
		if len(b) < 4 {
			return nil, fmt.Errorf("not enough bytes for uint32")
		}
		orderedBytes := d.applyByteOrder(b)
		return binary.BigEndian.Uint32(orderedBytes), nil
	default:
		return binary.BigEndian.Uint16(b), nil
	}
}

func (d *PointDecoder) applyScaleOffset(point model.Point, val any) any {
	if point.Scale == 0 && point.Offset == 0 {
		return val
	}

	scale := point.Scale
	if scale == 0 {
		scale = 1.0
	}

	var fVal float64
	switch v := val.(type) {
	case float64:
		fVal = v
	case float32:
		fVal = float64(v)
	case int16:
		fVal = float64(v)
	case uint16:
		fVal = float64(v)
	case int32:
		fVal = float64(v)
	case uint32:
		fVal = float64(v)
	default:
		return val
	}

	return fVal*scale + point.Offset
}

// applyByteOrder applies the configured 4-byte byte order
func (d *PointDecoder) applyByteOrder(b []byte) []byte {
	if len(b) != 4 {
		return b
	}
	newB := make([]byte, 4)
	switch d.byteOrder4 {
	case "ABCD":
		copy(newB, b)
	case "CDAB":
		newB[0], newB[1], newB[2], newB[3] = b[2], b[3], b[0], b[1]
	case "BADC":
		newB[0], newB[1], newB[2], newB[3] = b[1], b[0], b[3], b[2]
	case "DCBA":
		newB[0], newB[1], newB[2], newB[3] = b[3], b[2], b[1], b[0]
	default:
		copy(newB, b)
	}
	return newB
}

// Encode 将值编码为寄存器数组（用于写入）
func (d *PointDecoder) Encode(point model.Point, value any) ([]uint16, error) {
	// 反算 Scale/Offset
	rawValue := d.reverseScaleOffset(point, value)
	return d.encodeRaw(point, rawValue)
}

func (d *PointDecoder) reverseScaleOffset(point model.Point, value any) any {
	if point.Scale == 0 && point.Offset == 0 {
		return value
	}

	// value - Offset / Scale
	var fVal float64
	switch v := value.(type) {
	case float64:
		fVal = v
	case float32:
		fVal = float64(v)
	case int:
		fVal = float64(v)
	case int64:
		fVal = float64(v)
	case int32:
		fVal = float64(v)
	case uint32:
		fVal = float64(v)
	case int16:
		fVal = float64(v)
	case uint16:
		fVal = float64(v)
	case string:
		fVal, _ = strconv.ParseFloat(v, 64)
	default:
		// 简单处理，如果类型不对可能后续会报错
		return value
	}

	if point.Scale != 0 {
		return (fVal - point.Offset) / point.Scale
	}
	return fVal - point.Offset
}

func (d *PointDecoder) encodeRaw(point model.Point, value any) ([]uint16, error) {
	switch point.DataType {
	case "int16", "uint16":
		var intVal uint16
		switch v := value.(type) {
		case float64:
			intVal = uint16(v)
		case int:
			intVal = uint16(v)
		case int64:
			intVal = uint16(v)
		case int32:
			intVal = uint16(v)
		case uint32:
			intVal = uint16(v)
		case int16:
			intVal = uint16(v)
		case uint16:
			intVal = v
		case string:
			i, _ := strconv.Atoi(v)
			intVal = uint16(i)
		default:
			return nil, fmt.Errorf("unsupported value type: %T", value)
		}
		return []uint16{intVal}, nil

	case "float32":
		var fVal float32
		switch v := value.(type) {
		case float64:
			fVal = float32(v)
		case float32:
			fVal = v
		case int:
			fVal = float32(v)
		case int32:
			fVal = float32(v)
		case uint32:
			fVal = float32(v)
		case int64:
			fVal = float32(v)
		case string:
			f, _ := strconv.ParseFloat(v, 32)
			fVal = float32(f)
		default:
			return nil, fmt.Errorf("unsupported value type for float32: %T", value)
		}

		bits := math.Float32bits(fVal)
		bytes := make([]byte, 4)
		binary.BigEndian.PutUint32(bytes, bits)
		orderedBytes := d.applyByteOrder(bytes)

		reg1 := binary.BigEndian.Uint16(orderedBytes[0:2])
		reg2 := binary.BigEndian.Uint16(orderedBytes[2:4])
		return []uint16{reg1, reg2}, nil

	case "int32", "uint32":
		var uVal uint32
		switch v := value.(type) {
		case float64:
			uVal = uint32(v)
		case int:
			uVal = uint32(v)
		case int64:
			uVal = uint32(v)
		case int32:
			uVal = uint32(v)
		case uint32:
			uVal = v
		case string:
			i, _ := strconv.ParseInt(v, 10, 64)
			uVal = uint32(i)
		default:
			return nil, fmt.Errorf("unsupported value type for int32/uint32: %T", value)
		}

		bytes := make([]byte, 4)
		binary.BigEndian.PutUint32(bytes, uVal)
		orderedBytes := d.applyByteOrder(bytes)

		reg1 := binary.BigEndian.Uint16(orderedBytes[0:2])
		reg2 := binary.BigEndian.Uint16(orderedBytes[2:4])
		return []uint16{reg1, reg2}, nil
	}

	return nil, fmt.Errorf("encode not supported for type: %s", point.DataType)
}
