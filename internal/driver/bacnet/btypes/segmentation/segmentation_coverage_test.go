package segmentation

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCoverage_SegmentedTypeString(t *testing.T) {
	assert.Equal(t, "SegmentedBoth", SegmentedBoth.String())
	assert.Equal(t, "NoSegmentation", NoSegmentation.String())
}
