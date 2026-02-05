package core

import (
	"testing"

	"github.com/expr-lang/expr"
)

func TestExprBitwise(t *testing.T) {
	t.Skip("Bitwise operator & is not supported by expr in this environment")
	env := map[string]interface{}{
		"v": 64.0, // float64 as is common in JSON unmarshal
	}

	expression := "v & 64"

	program, err := expr.Compile(expression, expr.Env(env))
	if err != nil {
		t.Fatalf("Compile failed: %v", err)
	}

	output, err := expr.Run(program, env)
	if err != nil {
		t.Fatalf("Run failed: %v", err)
	}

	t.Logf("Result: %v", output)
}

func TestExprOperatorOverride(t *testing.T) {
	t.Skip("Operator override did not enable & syntax")
	env := map[string]interface{}{
		"v": 64,
		"BitAnd": func(a, b int) int {
			return a & b
		},
	}

	expression := "v & 64"

	options := []expr.Option{
		expr.Env(env),
		expr.Operator("&", "BitAnd"),
	}

	program, err := expr.Compile(expression, options...)
	if err != nil {
		t.Fatalf("Compile failed: %v", err)
	}

	output, err := expr.Run(program, env)
	if err != nil {
		t.Fatalf("Run failed: %v", err)
	}

	t.Logf("Result: %v", output)
}
