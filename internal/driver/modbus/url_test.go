package modbus

import "testing"

func TestNormalizeModbusURL(t *testing.T) {
	tests := []struct {
		in, want string
	}{
		{"127.0.0.1:502", "tcp://127.0.0.1:502"},
		{"tcp://127.0.0.1:502", "tcp://127.0.0.1:502"},
		{" 192.168.1.10:8502 ", "tcp://192.168.1.10:8502"},
		{"rtuovertcp://10.0.0.1:502", "rtuovertcp://10.0.0.1:502"},
		{"", ""},
	}
	for _, tt := range tests {
		got := normalizeModbusURL(tt.in)
		if got != tt.want {
			t.Errorf("normalizeModbusURL(%q) = %q, want %q", tt.in, got, tt.want)
		}
	}
}
