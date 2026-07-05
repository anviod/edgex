package priority

import (
	"testing"

	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/driver/bacnet/helpers/nils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_BuildFloat32(t *testing.T) {
	in := btypes.PropertyData{
		Object: btypes.Object{
			Properties: []btypes.Property{{
				Data: []interface{}{float32(1.0), float32(2.0), float32(3.0)},
			}},
		},
	}
	pri := BuildFloat32(in, btypes.AnalogValue)
	require.NotNil(t, pri)
	require.NotNil(t, pri.P1)
	assert.InDelta(t, 1.0, *pri.P1, 0.001)
	require.NotNil(t, pri.P3)
	assert.InDelta(t, 3.0, *pri.P3, 0.001)

	binIn := btypes.PropertyData{
		Object: btypes.Object{
			Properties: []btypes.Property{{
				Data: []interface{}{uint32(1), uint32(0)},
			}},
		},
	}
	binPri := BuildFloat32(binIn, btypes.BinaryOutput)
	require.NotNil(t, binPri.P1)
	assert.InDelta(t, 1.0, *binPri.P1, 0.001)
}

func TestCoverage_HighestFloat32(t *testing.T) {
	pri := &Float32{P3: nils.NewFloat32(3.0), P5: nils.NewFloat32(5.0)}
	assert.InDelta(t, 3.0, *pri.HighestFloat32(), 0.001)
	assert.Nil(t, (&Float32{}).HighestFloat32())
}
