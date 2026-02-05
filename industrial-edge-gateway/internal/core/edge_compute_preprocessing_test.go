package core

import (
	"testing"
)

func TestPreprocessExpression_1BasedIndexing(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"v.1", "bitget(v, 0)"},
		{"v.4", "bitget(v, 3)"},
		{"v.bit.1", "bitget(v, 0)"},
		{"data.16", "bitget(data, 15)"},
		{"v.0", "bitget(v, 0)"}, // Fallback logic check
		{"v + v.2", "v + bitget(v, 1)"},
	}

	for _, tt := range tests {
		got := preprocessExpression(tt.input)
		if got != tt.expected {
			t.Errorf("preprocessExpression(%q) = %q; want %q", tt.input, got, tt.expected)
		}
	}
}
