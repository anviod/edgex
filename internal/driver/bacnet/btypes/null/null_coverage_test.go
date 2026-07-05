package null

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCoverage_NullString(t *testing.T) {
	n := Null{}
	assert.Equal(t, "<null>", n.String())
}
