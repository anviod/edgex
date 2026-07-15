package ethercat

import (
	"encoding/binary"
	"math"
	"testing"
)

// =============================================================================
// Benchmark: ParseAddress — PDO and SDO address parsing
// =============================================================================

func BenchmarkParseAddress_PDO(b *testing.B) {
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		_, _ = ParseAddress("1:Tx:16.3#LE")
	}
}

func BenchmarkParseAddress_SDO(b *testing.B) {
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		_, _ = ParseAddress("1:SDO:0x6041:0#BE")
	}
}

func BenchmarkParseAddress_Simple(b *testing.B) {
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		_, _ = ParseAddress("1:Tx:0")
	}
}

func BenchmarkParsedAddress_String(b *testing.B) {
	addr := &ParsedAddress{Position: 1, PDOType: "TX", Offset: 16, Bit: 3, Endian: "LE"}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = addr.String()
	}
}

// =============================================================================
// Benchmark: DecodeValue — all data types
// =============================================================================

func BenchmarkDecodeValue_Int16(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	data := []byte{0x12, 0x34}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.DecodeValue(data, "int16", addr)
	}
}

func BenchmarkDecodeValue_Int32(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	data := []byte{0x12, 0x34, 0x56, 0x78}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.DecodeValue(data, "int32", addr)
	}
}

func BenchmarkDecodeValue_Float32(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	data := make([]byte, 4)
	binary.BigEndian.PutUint32(data, math.Float32bits(3.14))
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.DecodeValue(data, "float", addr)
	}
}

func BenchmarkDecodeValue_Float64(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	data := make([]byte, 8)
	binary.BigEndian.PutUint64(data, math.Float64bits(3.141592653589793))
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.DecodeValue(data, "float64", addr)
	}
}

func BenchmarkDecodeValue_Bit(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: 3}
	data := []byte{0x08}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.DecodeValue(data, "bool", addr)
	}
}

func BenchmarkDecodeValue_LE(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "LE", Bit: -1}
	data := []byte{0x78, 0x56, 0x34, 0x12}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.DecodeValue(data, "int32", addr)
	}
}

// =============================================================================
// Benchmark: EncodeValue — all data types
// =============================================================================

func BenchmarkEncodeValue_Int16(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.EncodeValue(int16(0x1234), "int16", addr)
	}
}

func BenchmarkEncodeValue_Int32(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.EncodeValue(int32(0x12345678), "int32", addr)
	}
}

func BenchmarkEncodeValue_Float32(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.EncodeValue(float32(3.14), "float", addr)
	}
}

func BenchmarkEncodeValue_Float64(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.EncodeValue(float64(3.141592653589793), "float64", addr)
	}
}

func BenchmarkEncodeValue_Bool(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.EncodeValue(true, "bool", addr)
	}
}

func BenchmarkEncodeValue_LE(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "LE", Bit: -1}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = d.EncodeValue(int32(0x12345678), "int32", addr)
	}
}

// =============================================================================
// Benchmark: Encode → Decode round-trip
// =============================================================================

func BenchmarkEncodeDecode_RoundTrip(b *testing.B) {
	d := NewEtherCATDecoder()
	addr := &ParsedAddress{Endian: "BE", Bit: -1}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		encoded, _ := d.EncodeValue(int32(0x12345678), "int32", addr)
		_, _ = d.DecodeValue(encoded, "int32", addr)
	}
}

// =============================================================================
// Benchmark: ByteSize
// =============================================================================

func BenchmarkByteSize(b *testing.B) {
	d := NewEtherCATDecoder()
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = d.ByteSize("int32")
	}
}

// =============================================================================
// Benchmark: config parsing
// =============================================================================

func BenchmarkParseChannelConfig(b *testing.B) {
	cfg := map[string]any{
		"local_interface": "eth0",
		"cycle_time_us":   1000,
		"timeout":         3000,
		"max_retries":     3,
	}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = parseChannelConfig(cfg)
	}
}

func BenchmarkParseDeviceConfig(b *testing.B) {
	cfg := map[string]any{
		"position":     1,
		"vendor_id":    "0x00000002",
		"product_code": "0x07D43052",
		"tx_pdo_size":  16,
		"rx_pdo_size":  8,
	}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = parseDeviceConfig(cfg)
	}
}

// =============================================================================
// Benchmark: firstInt / firstString / firstBool helpers
// =============================================================================

func BenchmarkFirstString(b *testing.B) {
	cfg := map[string]any{"local_interface": "eth0"}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = firstString(cfg, "local_interface", "localInterface")
	}
}

func BenchmarkFirstInt(b *testing.B) {
	cfg := map[string]any{"timeout": 3000}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = firstInt(cfg, "timeout")
	}
}

func BenchmarkFirstBool(b *testing.B) {
	cfg := map[string]any{"simulation": true}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = firstBool(cfg, "simulation")
	}
}

// =============================================================================
// Benchmark: Transport snapshot read (PDO hot path)
// =============================================================================

func BenchmarkTransportSnapshotRead(b *testing.B) {
	transport := newSimulationTransport()
	defer transport.Disconnect()

	sim := transport.master.(*simulatorMaster)
	buf := make([]byte, 4)
	binary.BigEndian.PutUint32(buf, 0x12345678)
	sim.setTxPDO(1, 0, buf)
	transport.refreshTxSnapshots()

	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = transport.getTxPDOSnapshot(1, 0, 4)
	}
}

func BenchmarkTransportRxBufferWrite(b *testing.B) {
	transport := newSimulationTransport()
	defer transport.Disconnect()

	data := []byte{0xDE, 0xAD, 0xBE, 0xEF}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = transport.setRxPDOBuffer(1, 0, data)
	}
}
