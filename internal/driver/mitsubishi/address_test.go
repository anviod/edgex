package mitsubishi

import (
	"testing"
)

func TestParseAddress(t *testing.T) {
	cases := []struct {
		addr     string
		device   string
		offset   int
		bitOff   int
		strLen   int
		wantFail bool
	}{
		{"D100", "D", 100, -1, 0, false},
		{"M0", "M", 0, -1, 0, false},
		{"X10", "X", 10, -1, 0, false},
		{"D20.2", "D", 20, 2, 0, false},
		{"D100.16L", "D", 100, -1, 16, false},
		{"", "", 0, -1, 0, true},
		{"INVALID", "", 0, -1, 0, true},
	}

	for _, tc := range cases {
		addr, err := ParseAddress(tc.addr)
		if tc.wantFail {
			if err == nil {
				t.Errorf("expected error for %q", tc.addr)
			}
			continue
		}
		if err != nil {
			t.Fatalf("parse %q: %v", tc.addr, err)
		}
		if addr.DeviceName != tc.device {
			t.Errorf("parse %q device = %s, want %s", tc.addr, addr.DeviceName, tc.device)
		}
		if addr.Offset != tc.offset {
			t.Errorf("parse %q offset = %d, want %d", tc.addr, addr.Offset, tc.offset)
		}
		if addr.BitOffset != tc.bitOff {
			t.Errorf("parse %q bitOffset = %d, want %d", tc.addr, addr.BitOffset, tc.bitOff)
		}
		if addr.StringLen != tc.strLen {
			t.Errorf("parse %q stringLen = %d, want %d", tc.addr, addr.StringLen, tc.strLen)
		}
	}
}

func TestBuildReadFrame(t *testing.T) {
	addr, err := ParseAddress("D100")
	if err != nil {
		t.Fatal(err)
	}
	frame := buildReadFrame(frameConfig{}, addr, 2, false)
	if len(frame) != 21 {
		t.Fatalf("expected frame length 21, got %d", len(frame))
	}
	if frame[0] != 0x50 || frame[1] != 0x00 {
		t.Fatalf("unexpected subheader: %02X %02X", frame[0], frame[1])
	}
	if frame[18] != 0xA8 {
		t.Fatalf("expected D device code 0xA8, got 0x%02X", frame[18])
	}
}

func TestParseResponse(t *testing.T) {
	resp := []byte{0xD0, 0x00, 0x00, 0xFF, 0xFF, 0x03, 0x00, 0x04, 0x00, 0x00, 0x00, 0x64, 0x00}
	_, data, err := parseResponse(resp)
	if err != nil {
		t.Fatalf("parseResponse: %v", err)
	}
	if len(data) != 2 || data[0] != 0x64 {
		t.Fatalf("unexpected data: %v", data)
	}
}

func TestDecodeValue(t *testing.T) {
	dec := NewMCDecoder()

	addr, _ := ParseAddress("D100")
	val, err := dec.DecodeValue([]byte{0x64, 0x00}, addr, "INT16")
	if err != nil {
		t.Fatal(err)
	}
	if val.(int16) != 100 {
		t.Fatalf("expected 100, got %v", val)
	}

	bitAddr, _ := ParseAddress("D20.2")
	bitVal, err := dec.DecodeValue([]byte{0x04, 0x00}, bitAddr, "BOOL")
	if err != nil {
		t.Fatal(err)
	}
	if bitVal.(bool) != true {
		t.Fatalf("expected true for D20.2, got %v", bitVal)
	}

	mAddr, _ := ParseAddress("M0")
	mVal, err := dec.DecodeValue([]byte{0x10}, mAddr, "BOOL")
	if err != nil {
		t.Fatal(err)
	}
	if mVal.(bool) != true {
		t.Fatalf("expected true for M0, got %v", mVal)
	}
}
