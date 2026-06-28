package dlt645

import "testing"

func BenchmarkBuildFrame(b *testing.B) {
	addr, _ := EncodeMeterAddress("210220003011")
	di, _ := ParseDataID("02-01-01-00")
	payload := append(di[:], 0x20, 0x02)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = buildFrame(addr, CtrlReadResp, encode033(payload))
	}
}

func BenchmarkDecodeFrame(b *testing.B) {
	addr, _ := EncodeMeterAddress("210220003011")
	di, _ := ParseDataID("02-01-01-00")
	frame := buildFrame(addr, CtrlReadResp, encode033(append(di[:], 0x20, 0x02)))

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = DecodeFrame(frame)
	}
}
