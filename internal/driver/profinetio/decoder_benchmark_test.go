package profinetio

import "testing"

func BenchmarkDecodeValue(b *testing.B) {
	decoder := NewProfinetDecoder()
	data := []byte{0x01, 0x02, 0x03, 0x04}
	addr := &ParsedAddress{Endian: EndianBig}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = decoder.DecodeValue(data, "uint32", addr)
	}
}

func BenchmarkEncodeValue(b *testing.B) {
	decoder := NewProfinetDecoder()
	addr := &ParsedAddress{Endian: EndianBig}
	val := int32(12345)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = decoder.EncodeValue(val, "int32", addr)
	}
}
