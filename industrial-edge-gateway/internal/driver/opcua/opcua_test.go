package opcua

import (
	"testing"
)

func TestCastValue(t *testing.T) {
	tests := []struct {
		name     string
		input    any
		dataType string
		want     any
		wantErr  bool
	}{
		// Integer conversions
		{"Float64 to Int16", float64(123), "int16", int16(123), false},
		{"Float64 to UInt16", float64(123), "uint16", uint16(123), false},
		{"Float64 to Int32", float64(123), "int32", int32(123), false},
		{"String to Int16", "123", "int16", int16(123), false},

		// Byte/SByte conversions
		{"Float64 to Byte", float64(255), "byte", uint8(255), false},
		{"Float64 to SByte", float64(127), "sbyte", int8(127), false},
		{"String to Byte", "255", "byte", uint8(255), false},
		{"String to SByte", "-128", "sbyte", int8(-128), false},

		// Float conversions
		{"Float64 to Float32", float64(123.45), "float32", float32(123.45), false},
		{"String to Float32", "123.45", "float32", float32(123.45), false},

		// Boolean conversions
		{"Bool to Bool", true, "bool", true, false},
		{"String to Bool", "true", "bool", true, false},
		{"Int to Bool (1)", 1, "bool", true, false},
		{"Int to Bool (0)", 0, "bool", false, false},

		// Errors
		{"Invalid String to Int", "abc", "int16", nil, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := castValue(tt.input, tt.dataType)
			if (err != nil) != tt.wantErr {
				t.Errorf("castValue() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("castValue() = %v (%T), want %v (%T)", got, got, tt.want, tt.want)
			}
		})
	}
}
