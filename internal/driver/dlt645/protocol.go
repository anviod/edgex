package dlt645

const (
	FrameStart    = 0x68
	FrameEnd      = 0x16
	PreambleByte  = 0xFE
	CtrlRead      = 0x11
	CtrlReadResp  = 0x91
	CtrlWrite     = 0x14
	CtrlWriteResp = 0x94
	CtrlErrorMask = 0x40
	AddrLen       = 6
	DataIDLen     = 4
	EncodeOffset  = 0x33
	BroadcastByte = 0xAA
)

// checksum returns the low 8 bits of the sum of frame bytes (from first 0x68 through data).
func checksum(frame []byte) byte {
	var sum byte
	for _, b := range frame {
		sum += b
	}
	return sum
}

// encode033 adds 0x33 to each byte (DL/T 645 data field encoding).
func encode033(data []byte) []byte {
	out := make([]byte, len(data))
	for i, b := range data {
		out[i] = b + EncodeOffset
	}
	return out
}

// decode033 subtracts 0x33 from each byte.
func decode033(data []byte) []byte {
	out := make([]byte, len(data))
	for i, b := range data {
		out[i] = b - EncodeOffset
	}
	return out
}
