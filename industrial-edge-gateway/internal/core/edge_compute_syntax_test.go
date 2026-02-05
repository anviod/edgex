package core

import (
	"testing"

	"github.com/expr-lang/expr"
)

// Tests verify the logic in edge_compute_manager.go

func TestSyntaxPreprocessing(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"v.4", "bitget(v, 4)"},
		{"v.bit.4", "bitget(v, 4)"},
		{"my_var.bit.15", "bitget(my_var, 15)"},
		{"v.12 > 0", "bitget(v, 12) > 0"},
		{"t1.0 == 1 && t2.3 == 0", "bitget(t1, 0) == 1 && bitget(t2, 3) == 0"},
		{"val.4", "bitget(val, 4)"},
		{"my_var.15", "bitget(my_var, 15)"},
		{"3.14", "3.14"}, // Should not change float
		{"v.4 + v.5", "bitget(v, 4) + bitget(v, 5)"},
	}

	for _, tt := range tests {
		got := preprocessExpression(tt.input)
		if got != tt.expected {
			t.Errorf("preprocess(%q) = %q, want %q", tt.input, got, tt.expected)
		}
	}
}

func TestBitwiseFunctions(t *testing.T) {
	// Use prepareExprEnv to get the environment with registered functions
	env := map[string]any{
		"v": int64(18), // 10010 (bits 1 and 4 are 1)
	}
	env = prepareExprEnv(env)

	// 18 = 16 + 2 = 10010 binary
	// bit 0: 0
	// bit 1: 1
	// bit 2: 0
	// bit 3: 0
	// bit 4: 1

	evalTests := []struct {
		expr string
		want any
	}{
		{"bitget(v, 0)", int64(0)},
		{"bitget(v, 1)", int64(1)},
		{"bitget(v, 4)", int64(1)},
		{"bitget(v, 5)", int64(0)},
		{"bitset(v, 0, 1)", int64(19)}, // 18 | 1 = 19
		{"bitset(v, 1, 0)", int64(16)}, // 18 &^ 2 = 16
		{"bitset(v, 2, 1)", int64(22)}, // 18 | 4 = 22
		{"bitset(v, 4, 0)", int64(2)},  // 18 &^ 16 = 2
		{"bitset(v, 4, 1)", int64(18)}, // 18 | 16 = 18 (no change)
	}

	for _, tt := range evalTests {
		program, err := expr.Compile(tt.expr, expr.Env(env))
		if err != nil {
			t.Fatalf("Compile(%q) failed: %v", tt.expr, err)
		}
		got, err := expr.Run(program, env)
		if err != nil {
			t.Fatalf("Run(%q) failed: %v", tt.expr, err)
		}
		if got != tt.want {
			t.Errorf("Eval(%q) = %v, want %v", tt.expr, got, tt.want)
		}
	}
}

func TestIntegratedSyntax(t *testing.T) {
	// Test that v.N syntax works end-to-end via the environment functions
	// We manually simulate what evaluateThreshold/Calculation does: Preprocess -> Compile -> Run

	rawExpr := "v.4 == 1"
	processed := preprocessExpression(rawExpr)

	env := map[string]any{
		"v": int64(18),
	}
	env = prepareExprEnv(env)

	program, err := expr.Compile(processed, expr.Env(env))
	if err != nil {
		t.Fatalf("Compile failed: %v", err)
	}

	got, err := expr.Run(program, env)
	if err != nil {
		t.Fatalf("Run failed: %v", err)
	}

	if got != true {
		t.Errorf("Expected true, got %v", got)
	}
}
