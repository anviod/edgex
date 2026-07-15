package ethercat

import (
	"encoding/binary"
	"math"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// =============================================================================
// ByteSize tests
// =============================================================================

func TestByteSize(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		expected int
	}{
		{"bit", "bit", 1},
		{"bool", "bool", 1},
		{"int8", "int8", 1},
		{"uint8", "uint8", 1},
		{"int16", "int16", 2},
		{"uint16", "uint16", 2},
		{"int32", "int32", 4},
		{"uint32", "uint32", 4},
		{"float", "float", 4},
		{"float32", "float32", 4},
		{"int64", "int64", 8},
		{"uint64", "uint64", 8},
		{"double", "double", 8},
		{"float64", "float64", 8},
		{"unknown", "struct", 0},
		{"empty", "", 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, d.ByteSize(tt.dataType))
		})
	}
}

// =============================================================================
// DecodeValue tests — all data types, both endian modes
// =============================================================================

func TestDecodeValue_IntTypes(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		data     []byte
		endian   string
		expected any
	}{
		{"int8 positive", "int8", []byte{0x7F}, "BE", int8(127)},
		{"int8 negative", "int8", []byte{0xFF}, "BE", int8(-1)},
		{"uint8", "uint8", []byte{0xFF}, "BE", uint8(255)},
		{"int16 BE positive", "int16", []byte{0x12, 0x34}, "BE", int16(0x1234)},
		{"int16 BE negative", "int16", []byte{0xFF, 0xFF}, "BE", int16(-1)},
		{"int16 LE", "int16", []byte{0x34, 0x12}, "LE", int16(0x1234)},
		{"uint16 BE", "uint16", []byte{0xFF, 0xFF}, "BE", uint16(65535)},
		{"uint16 LE", "uint16", []byte{0xFF, 0xFF}, "LE", uint16(65535)},
		{"int32 BE", "int32", []byte{0x12, 0x34, 0x56, 0x78}, "BE", int32(0x12345678)},
		{"int32 LE", "int32", []byte{0x78, 0x56, 0x34, 0x12}, "LE", int32(0x12345678)},
		{"uint32 BE", "uint32", []byte{0xFF, 0xFF, 0xFF, 0xFF}, "BE", uint32(0xFFFFFFFF)},
		{"int64 BE", "int64", makeBE64(0x123456789ABCDEF0), "BE", int64(0x123456789ABCDEF0)},
		{"int64 LE", "int64", makeLE64(0x123456789ABCDEF0), "LE", int64(0x123456789ABCDEF0)},
		{"uint64 BE", "uint64", makeBE64(0xFFFFFFFFFFFFFFFF), "BE", uint64(0xFFFFFFFFFFFFFFFF)},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr := &ParsedAddress{Endian: tt.endian, Bit: -1}
			val, err := d.DecodeValue(tt.data, tt.dataType, addr)
			require.NoError(t, err)
			assert.Equal(t, tt.expected, val)
		})
	}
}

func TestDecodeValue_FloatTypes(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		endian   string
		value    float64
	}{
		{"float32 BE 3.14", "float", "BE", 3.14},
		{"float32 LE 3.14", "float", "LE", 3.14},
		{"float32 BE -1.0", "float32", "BE", -1.0},
		{"float64 BE 3.141592653589793", "float64", "BE", 3.141592653589793},
		{"double LE 3.141592653589793", "double", "LE", 3.141592653589793},
		{"float64 BE zero", "float64", "BE", 0.0},
		{"float32 BE max", "float", "BE", math.MaxFloat32},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var data []byte
			if tt.dataType == "float64" || tt.dataType == "double" {
				data = make([]byte, 8)
				if tt.endian == "BE" {
					binary.BigEndian.PutUint64(data, math.Float64bits(tt.value))
				} else {
					binary.LittleEndian.PutUint64(data, math.Float64bits(tt.value))
				}
			} else {
				data = make([]byte, 4)
				if tt.endian == "BE" {
					binary.BigEndian.PutUint32(data, math.Float32bits(float32(tt.value)))
				} else {
					binary.LittleEndian.PutUint32(data, math.Float32bits(float32(tt.value)))
				}
			}

			addr := &ParsedAddress{Endian: tt.endian, Bit: -1}
			val, err := d.DecodeValue(data, tt.dataType, addr)
			require.NoError(t, err)
			if tt.dataType == "float64" || tt.dataType == "double" {
				assert.InDelta(t, tt.value, val.(float64), 1e-10)
			} else {
				assert.InDelta(t, tt.value, float64(val.(float32)), 1e-6)
			}
		})
	}
}

func TestDecodeValue_BitTypes(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		data     []byte
		bit      int
		expected any
	}{
		{"bit 0 set", "bit", []byte{0x01}, 0, true},
		{"bit 0 clear", "bool", []byte{0xFE}, 0, false},
		{"bit 3 set", "bool", []byte{0x08}, 3, true},
		{"bit 7 set", "bit", []byte{0x80}, 7, true},
		{"bit 5 clear", "bool", []byte{0xDF}, 5, false},
		{"bit default (0)", "bit", []byte{0x01}, -1, true},
		{"bit over 7 clamped", "bit", []byte{0x80}, 10, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr := &ParsedAddress{Bit: tt.bit, Endian: "BE"}
			val, err := d.DecodeValue(tt.data, tt.dataType, addr)
			require.NoError(t, err)
			assert.Equal(t, tt.expected, val)
		})
	}
}

func TestDecodeValue_UnknownType(t *testing.T) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	val, err := d.DecodeValue([]byte{0xAB, 0xCD}, "unknown", addr)
	require.NoError(t, err)
	assert.Equal(t, "abcd", val)
}

func TestDecodeValue_Errors(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		data     []byte
		endian   string
	}{
		{"empty data", "int16", []byte{}, "BE"},
		{"int16 too short", "int16", []byte{0x01}, "BE"},
		{"int32 too short", "int32", []byte{0x01, 0x02}, "BE"},
		{"int64 too short", "int64", []byte{0x01, 0x02, 0x03}, "BE"},
		{"float too short", "float", []byte{0x01, 0x02}, "BE"},
		{"double too short", "float64", []byte{0x01, 0x02, 0x03}, "BE"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr := &ParsedAddress{Endian: tt.endian, Bit: -1}
			_, err := d.DecodeValue(tt.data, tt.dataType, addr)
			require.Error(t, err)
		})
	}
}

// =============================================================================
// EncodeValue tests
// =============================================================================

func TestEncodeValue_AllTypes(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		value    any
		endian   string
		expected []byte
	}{
		{"int8", "int8", int8(-1), "BE", []byte{0xFF}},
		{"uint8", "uint8", uint8(255), "BE", []byte{0xFF}},
		{"int16 BE", "int16", int16(0x1234), "BE", []byte{0x12, 0x34}},
		{"int16 LE", "int16", int16(0x1234), "LE", []byte{0x34, 0x12}},
		{"uint16 BE", "uint16", uint16(65535), "BE", []byte{0xFF, 0xFF}},
		{"int32 BE", "int32", int32(0x12345678), "BE", []byte{0x12, 0x34, 0x56, 0x78}},
		{"int32 LE", "int32", int32(0x12345678), "LE", []byte{0x78, 0x56, 0x34, 0x12}},
		{"uint32 BE", "uint32", uint32(0xDEADBEEF), "BE", []byte{0xDE, 0xAD, 0xBE, 0xEF}},
		{"int64 BE", "int64", int64(0x123456789ABCDEF0), "BE", makeBE64(0x123456789ABCDEF0)},
		{"uint64 BE", "uint64", uint64(0xFFFFFFFFFFFFFFFF), "BE", makeBE64(0xFFFFFFFFFFFFFFFF)},
		{"float32 BE", "float", float32(3.14), "BE", float32BE(3.14)},
		{"float32 LE", "float", float32(3.14), "LE", float32LE(3.14)},
		{"float64 BE", "float64", float64(3.141592653589793), "BE", float64BE(3.141592653589793)},
		{"bool true", "bool", true, "BE", []byte{0x01}},
		{"bool false", "bool", false, "BE", []byte{0x00}},
		{"bit true", "bit", true, "BE", []byte{0x01}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr := &ParsedAddress{Endian: tt.endian, Bit: -1}
			data, err := d.EncodeValue(tt.value, tt.dataType, addr)
			require.NoError(t, err)
			assert.Equal(t, tt.expected, data)
		})
	}
}

func TestEncodeValue_JSONCompat(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		value    any
		expected []byte
	}{
		{"float64 as int16", "int16", float64(42), []byte{0x00, 0x2A}},
		{"float64 as uint32", "uint32", float64(65535), []byte{0x00, 0x00, 0xFF, 0xFF}},
		{"int as float32", "float", int(0), []byte{0x00, 0x00, 0x00, 0x00}},
		{"string bool true", "bool", "true", []byte{0x01}},
		{"string bool false", "bool", "FALSE", []byte{0x00}},
		{"int bool", "bool", 1, []byte{0x01}},
		{"float64 bool", "bool", float64(0), []byte{0x00}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr := &ParsedAddress{Endian: "BE", Bit: -1}
			data, err := d.EncodeValue(tt.value, tt.dataType, addr)
			require.NoError(t, err)
			assert.Equal(t, tt.expected, data)
		})
	}
}

func TestEncodeValue_Errors(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		value    any
	}{
		{"unknown type", "unknown", 0},
		{"invalid bool type", "bool", struct{}{}},
		{"invalid int type", "int16", "not a number"},
		{"invalid float type", "float", "not a float"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr := &ParsedAddress{Endian: "BE", Bit: -1}
			_, err := d.EncodeValue(tt.value, tt.dataType, addr)
			require.Error(t, err)
		})
	}
}

// =============================================================================
// Encode → Decode round-trip (bidirectional validation)
// =============================================================================

func TestEncodeDecode_RoundTrip(t *testing.T) {
	d := NewEtherCATDecoder()

	tests := []struct {
		name     string
		dataType string
		value    any
		endian   string
	}{
		{"int8", "int8", int8(42), "BE"},
		{"uint8", "uint8", uint8(200), "BE"},
		{"int16 BE", "int16", int16(-32768), "BE"},
		{"int16 LE", "int16", int16(32767), "LE"},
		{"uint16 BE", "uint16", uint16(65535), "BE"},
		{"int32 BE", "int32", int32(-2147483648), "BE"},
		{"int32 LE", "int32", int32(2147483647), "LE"},
		{"uint32 BE", "uint32", uint32(4294967295), "BE"},
		{"int64 BE", "int64", int64(-9223372036854775808), "BE"},
		{"uint64 BE", "uint64", uint64(18446744073709551615), "BE"},
		{"float32 BE", "float", float32(3.14), "BE"},
		{"float32 LE", "float", float32(-2.718), "LE"},
		{"float64 BE", "float64", float64(1.618033988749895), "BE"},
		{"float64 LE", "double", float64(-1.0), "LE"},
		{"bool true", "bool", true, "BE"},
		{"bool false", "bool", false, "LE"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr := &ParsedAddress{Endian: tt.endian, Bit: -1}
			encoded, err := d.EncodeValue(tt.value, tt.dataType, addr)
			require.NoError(t, err)
			decoded, err := d.DecodeValue(encoded, tt.dataType, addr)
			require.NoError(t, err)
			assert.Equal(t, tt.value, decoded)
		})
	}
}

// =============================================================================
// Type conversion helpers
// =============================================================================

func TestToBool(t *testing.T) {
	tests := []struct {
		name     string
		input    any
		expected bool
		wantErr  bool
	}{
		{"bool true", true, true, false},
		{"bool false", false, false, false},
		{"float64 1", float64(1), true, false},
		{"float64 0", float64(0), false, false},
		{"int 1", int(1), true, false},
		{"int 0", int(0), false, false},
		{"string true", "true", true, false},
		{"string false", "false", false, false},
		{"string 1", "1", true, false},
		{"string 0", "0", false, false},
		{"invalid", struct{}{}, false, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			val, err := toBool(tt.input)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.expected, val)
		})
	}
}

func TestToInt64(t *testing.T) {
	tests := []struct {
		name     string
		input    any
		expected int64
		wantErr  bool
	}{
		{"int", int(42), 42, false},
		{"int8", int8(-128), -128, false},
		{"int16", int16(32767), 32767, false},
		{"int32", int32(-2147483648), -2147483648, false},
		{"int64", int64(9223372036854775807), 9223372036854775807, false},
		{"float64", float64(3.14), 3, false},
		{"uint8", uint8(255), 255, false},
		{"uint16", uint16(65535), 65535, false},
		{"invalid", "not int", 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			val, err := toInt64(tt.input)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.expected, val)
		})
	}
}

func TestToUint64(t *testing.T) {
	tests := []struct {
		name     string
		input    any
		expected uint64
		wantErr  bool
	}{
		{"uint8", uint8(255), 255, false},
		{"uint16", uint16(65535), 65535, false},
		{"uint32", uint32(4294967295), 4294967295, false},
		{"uint64", uint64(18446744073709551615), 18446744073709551615, false},
		{"int", int(42), 42, false},
		{"float64", float64(3.14), 3, false},
		{"invalid", "not uint", 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			val, err := toUint64(tt.input)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.expected, val)
		})
	}
}

func TestToFloat64(t *testing.T) {
	tests := []struct {
		name     string
		input    any
		expected float64
		wantErr  bool
	}{
		{"float64", float64(3.14), 3.14, false},
		{"float32", float32(2.718), 2.7179999351501465, false},
		{"int", int(42), 42.0, false},
		{"int8", int8(-128), -128.0, false},
		{"uint8", uint8(255), 255.0, false},
		{"int64", int64(123456789), 123456789.0, false},
		{"uint64", uint64(999999999), 999999999.0, false},
		{"invalid", "not float", 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			val, err := toFloat64(tt.input)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.InDelta(t, tt.expected, val, 1e-10)
		})
	}
}

// =============================================================================
// Helper functions for constructing test data
// =============================================================================

func makeBE64(v uint64) []byte {
	b := make([]byte, 8)
	binary.BigEndian.PutUint64(b, v)
	return b
}

func makeLE64(v uint64) []byte {
	b := make([]byte, 8)
	binary.LittleEndian.PutUint64(b, v)
	return b
}

func float32BE(v float32) []byte {
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, math.Float32bits(v))
	return b
}

func float32LE(v float32) []byte {
	b := make([]byte, 4)
	binary.LittleEndian.PutUint32(b, math.Float32bits(v))
	return b
}

func float64BE(v float64) []byte {
	b := make([]byte, 8)
	binary.BigEndian.PutUint64(b, math.Float64bits(v))
	return b
}
