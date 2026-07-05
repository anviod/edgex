package pprint

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCoverage_PprintHelpers(t *testing.T) {
	assert.Contains(t, Log(map[string]int{"a": 1}), "a")
	assert.Contains(t, ToJOSN(map[string]string{"k": "v"}), "k")
	Print(42)
	PrintJOSN(map[string]int{"x": 1})
}
