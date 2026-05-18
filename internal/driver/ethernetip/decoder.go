package ethernetip

import (
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
)

type ENIPTag struct {
	Name       string
	ArrayIndex int
	Path       []string
}

type ENIPDecoder struct {
}

func NewENIPDecoder() *ENIPDecoder {
	return &ENIPDecoder{}
}

var (
	reSimpleTag = regexp.MustCompile(`^([a-zA-Z_][a-zA-Z0-9_]*)$`)
	reArrayTag  = regexp.MustCompile(`^([a-zA-Z_][a-zA-Z0-9_]*)\[(\d+)\]$`)
)

func (d *ENIPDecoder) ParseAddress(addr string) (*ENIPTag, error) {
	addr = strings.TrimSpace(addr)

	if m := reArrayTag.FindStringSubmatch(addr); m != nil {
		tagName := m[1]
		index, err := strconv.Atoi(m[2])
		if err != nil {
			return nil, fmt.Errorf("invalid array index: %s", m[2])
		}
		return &ENIPTag{
			Name:       tagName,
			ArrayIndex: index,
			Path:       []string{tagName},
		}, nil
	}

	if m := reSimpleTag.FindStringSubmatch(addr); m != nil {
		return &ENIPTag{
			Name: m[1],
			Path: []string{m[1]},
		}, nil
	}

	parts := strings.Split(addr, ".")
	if len(parts) == 0 {
		return nil, fmt.Errorf("invalid ENIP tag address: %s", addr)
	}

	tag := &ENIPTag{
		Name: parts[0],
		Path: parts,
	}

	if arrayPart := strings.Split(parts[0], "["); len(arrayPart) == 2 {
		tag.Name = arrayPart[0]
		tag.ArrayIndex, _ = strconv.Atoi(strings.Trim(arrayPart[1], "]"))
	}

	return tag, nil
}

func (d *ENIPDecoder) ReadSizeForTag(tag *ENIPTag, dataType string) int {
	switch strings.ToUpper(dataType) {
	case "BOOL", "BIT":
		return 1
	case "SINT", "UINT8":
		return 1
	case "INT", "UINT16", "WORD":
		return 2
	case "DINT", "UINT32", "DWORD", "REAL":
		return 4
	case "LINT", "UINT64", "LWORD", "LREAL":
		return 8
	case "STRING":
		return 88
	default:
		return 4
	}
}

func (d *ENIPDecoder) DecodeValue(data []byte, dataType string) (interface{}, error) {
	if len(data) == 0 {
		return nil, fmt.Errorf("empty data buffer")
	}

	switch strings.ToUpper(dataType) {
	case "BOOL", "BIT":
		if len(data) < 1 {
			return nil, fmt.Errorf("buffer too short for BOOL")
		}
		return data[0] != 0, nil

	case "SINT", "INT8":
		if len(data) < 1 {
			return nil, fmt.Errorf("buffer too short for SINT")
		}
		return int8(data[0]), nil

	case "UINT8", "USINT":
		if len(data) < 1 {
			return nil, fmt.Errorf("buffer too short for USINT")
		}
		return data[0], nil

	case "INT", "INT16":
		if len(data) < 2 {
			return nil, fmt.Errorf("buffer too short for INT")
		}
		val := int16(data[0]) | int16(data[1])<<8
		return val, nil

	case "UINT", "UINT16", "WORD":
		if len(data) < 2 {
			return nil, fmt.Errorf("buffer too short for UINT")
		}
		val := uint16(data[0]) | uint16(data[1])<<8
		return val, nil

	case "DINT", "INT32":
		if len(data) < 4 {
			return nil, fmt.Errorf("buffer too short for DINT")
		}
		val := int32(data[0]) | int32(data[1])<<8 | int32(data[2])<<16 | int32(data[3])<<24
		return val, nil

	case "UINT32", "UDINT", "DWORD":
		if len(data) < 4 {
			return nil, fmt.Errorf("buffer too short for UINT32")
		}
		val := uint32(data[0]) | uint32(data[1])<<8 | uint32(data[2])<<16 | uint32(data[3])<<24
		return val, nil

	case "REAL", "FLOAT", "FLOAT32":
		if len(data) < 4 {
			return nil, fmt.Errorf("buffer too short for REAL")
		}
		bits := uint32(data[0]) | uint32(data[1])<<8 | uint32(data[2])<<16 | uint32(data[3])<<24
		val := math.Float32frombits(bits)
		return val, nil

	case "LINT", "INT64":
		if len(data) < 8 {
			return nil, fmt.Errorf("buffer too short for LINT")
		}
		val := int64(data[0]) | int64(data[1])<<8 | int64(data[2])<<16 | int64(data[3])<<24 |
			int64(data[4])<<32 | int64(data[5])<<40 | int64(data[6])<<48 | int64(data[7])<<56
		return val, nil

	case "ULINT", "UINT64", "LWORD":
		if len(data) < 8 {
			return nil, fmt.Errorf("buffer too short for ULINT")
		}
		val := uint64(data[0]) | uint64(data[1])<<8 | uint64(data[2])<<16 | uint64(data[3])<<24 |
			uint64(data[4])<<32 | uint64(data[5])<<40 | uint64(data[6])<<48 | uint64(data[7])<<56
		return val, nil

	case "LREAL", "FLOAT64", "DOUBLE":
		if len(data) < 8 {
			return nil, fmt.Errorf("buffer too short for LREAL")
		}
		bits := uint64(data[0]) | uint64(data[1])<<8 | uint64(data[2])<<16 | uint64(data[3])<<24 |
			uint64(data[4])<<32 | uint64(data[5])<<40 | uint64(data[6])<<48 | uint64(data[7])<<56
		val := math.Float64frombits(bits)
		return val, nil

	case "STRING":
		if len(data) < 2 {
			return string(data), nil
		}
		strLen := int(data[1])
		if strLen+2 > len(data) {
			strLen = len(data) - 2
		}
		return string(data[2 : 2+strLen]), nil

	default:
		if len(data) >= 4 {
			val := int32(data[0]) | int32(data[1])<<8 | int32(data[2])<<16 | int32(data[3])<<24
			return val, nil
		}
		return nil, fmt.Errorf("unsupported data type: %s", dataType)
	}
}

func (d *ENIPDecoder) EncodeValue(dataType string, value interface{}) ([]byte, error) {
	switch strings.ToUpper(dataType) {
	case "BOOL", "BIT":
		switch v := value.(type) {
		case bool:
			if v {
				return []byte{1}, nil
			}
			return []byte{0}, nil
		case string:
			if v == "true" || v == "1" {
				return []byte{1}, nil
			}
			return []byte{0}, nil
		default:
			if fmt.Sprintf("%v", value) == "true" {
				return []byte{1}, nil
			}
			return []byte{0}, nil
		}

	case "SINT", "INT8":
		switch v := value.(type) {
		case int8:
			return []byte{byte(v)}, nil
		case int:
			return []byte{byte(v)}, nil
		case int32:
			return []byte{byte(v)}, nil
		}

	case "UINT8", "USINT":
		switch v := value.(type) {
		case uint8:
			return []byte{v}, nil
		case uint:
			return []byte{byte(v)}, nil
		case int:
			return []byte{byte(v)}, nil
		}

	case "INT", "INT16":
		switch v := value.(type) {
		case int16:
			return []byte{byte(v), byte(v >> 8)}, nil
		case int:
			return []byte{byte(v), byte(v >> 8)}, nil
		case int32:
			return []byte{byte(v), byte(v >> 8)}, nil
		}

	case "UINT", "UINT16", "WORD":
		switch v := value.(type) {
		case uint16:
			return []byte{byte(v), byte(v >> 8)}, nil
		case uint:
			return []byte{byte(v), byte(v >> 8)}, nil
		case int:
			return []byte{byte(v), byte(v >> 8)}, nil
		}

	case "DINT", "INT32":
		switch v := value.(type) {
		case int32:
			return []byte{byte(v), byte(v >> 8), byte(v >> 16), byte(v >> 24)}, nil
		case int:
			val := int32(v)
			return []byte{byte(val), byte(val >> 8), byte(val >> 16), byte(val >> 24)}, nil
		case int64:
			val := int32(v)
			return []byte{byte(val), byte(val >> 8), byte(val >> 16), byte(val >> 24)}, nil
		}

	case "UINT32", "UDINT", "DWORD":
		switch v := value.(type) {
		case uint32:
			return []byte{byte(v), byte(v >> 8), byte(v >> 16), byte(v >> 24)}, nil
		case uint:
			val := uint32(v)
			return []byte{byte(val), byte(val >> 8), byte(val >> 16), byte(val >> 24)}, nil
		}

	case "REAL", "FLOAT", "FLOAT32":
		switch v := value.(type) {
		case float32:
			bits := math.Float32bits(v)
			return []byte{byte(bits), byte(bits >> 8), byte(bits >> 16), byte(bits >> 24)}, nil
		case float64:
			bits := math.Float32bits(float32(v))
			return []byte{byte(bits), byte(bits >> 8), byte(bits >> 16), byte(bits >> 24)}, nil
		case int:
			bits := math.Float32bits(float32(v))
			return []byte{byte(bits), byte(bits >> 8), byte(bits >> 16), byte(bits >> 24)}, nil
		}

	case "LINT", "INT64":
		switch v := value.(type) {
		case int64:
			return []byte{
				byte(v), byte(v >> 8), byte(v >> 16), byte(v >> 24),
				byte(v >> 32), byte(v >> 40), byte(v >> 48), byte(v >> 56),
			}, nil
		}

	case "ULINT", "UINT64", "LWORD":
		switch v := value.(type) {
		case uint64:
			return []byte{
				byte(v), byte(v >> 8), byte(v >> 16), byte(v >> 24),
				byte(v >> 32), byte(v >> 40), byte(v >> 48), byte(v >> 56),
			}, nil
		}

	case "LREAL", "FLOAT64", "DOUBLE":
		switch v := value.(type) {
		case float64:
			bits := math.Float64bits(v)
			return []byte{
				byte(bits), byte(bits >> 8), byte(bits >> 16), byte(bits >> 24),
				byte(bits >> 32), byte(bits >> 40), byte(bits >> 48), byte(bits >> 56),
			}, nil
		case float32:
			bits := math.Float64bits(float64(v))
			return []byte{
				byte(bits), byte(bits >> 8), byte(bits >> 16), byte(bits >> 24),
				byte(bits >> 32), byte(bits >> 40), byte(bits >> 48), byte(bits >> 56),
			}, nil
		}

	case "STRING":
		switch v := value.(type) {
		case string:
			strBytes := []byte(v)
			result := make([]byte, 2+len(strBytes))
			result[0] = byte(len(strBytes))
			result[1] = byte(len(strBytes))
			copy(result[2:], strBytes)
			return result, nil
		}
	}

	return nil, fmt.Errorf("unsupported data type for encoding: %s", dataType)
}