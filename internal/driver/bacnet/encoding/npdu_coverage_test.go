package encoding

import (
	"testing"

	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/driver/bacnet/btypes/ndpu"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_NPDURoundTrip(t *testing.T) {
	dest := &btypes.Address{Net: 1, Len: 6, Mac: []byte{192, 168, 1, 10, 0xBA, 0xC0}}
	src := &btypes.Address{Net: 0, Len: 6, Mac: []byte{192, 168, 1, 20, 0xBA, 0xC0}}
	npdu := &btypes.NPDU{
		Version:               btypes.ProtocolVersion,
		Destination:           dest,
		Source:                src,
		IsNetworkLayerMessage: false,
		ExpectingReply:        true,
		Priority:              btypes.Normal,
		HopCount:              btypes.DefaultHopCount,
	}

	enc := NewEncoder()
	enc.NPDU(npdu)
	raw := enc.Bytes()
	require.NotEmpty(t, raw)

	dec := NewDecoder(raw)
	var out btypes.NPDU
	dec.NPDU(&out)
	require.NoError(t, dec.Error())
	assert.Equal(t, btypes.ProtocolVersion, out.Version)
	assert.True(t, out.ExpectingReply)
}

func TestCoverage_NPDUNetworkLayerMessage(t *testing.T) {
	npdu := &btypes.NPDU{
		Version:                 btypes.ProtocolVersion,
		IsNetworkLayerMessage:   true,
		NetworkLayerMessageType: ndpu.WhoIsRouterToNetwork,
		ExpectingReply:          false,
		Priority:                btypes.Urgent,
		HopCount:                255,
	}

	enc := NewEncoder()
	enc.NPDU(npdu)
	dec := NewDecoder(enc.Bytes())
	var out btypes.NPDU
	dec.NPDU(&out)
	require.NoError(t, dec.Error())
	assert.True(t, out.IsNetworkLayerMessage)
}

func TestCoverage_AddressDecode(t *testing.T) {
	enc := NewEncoder()
	addr := btypes.Address{Net: 42, Len: 2, Adr: []byte{0x01, 0x02}}
	enc.write(addr.Net)
	enc.write(addr.Len)
	enc.write(addr.Adr)

	dec := NewDecoder(enc.Bytes())
	var out btypes.Address
	dec.Address(&out)
	require.NoError(t, dec.Error())
	assert.Equal(t, uint16(42), out.Net)
	assert.Equal(t, []byte{0x01, 0x02}, out.Adr)
}

func TestCoverage_EncoderBooleanAndWhoIs(t *testing.T) {
	enc := NewEncoder()
	enc.boolean(true)
	enc.boolean(false)
	require.NoError(t, enc.WhoIs(1, 100))
	assert.NotEmpty(t, enc.Bytes())
}

func TestCoverage_ReadMultiplePropertyEncode(t *testing.T) {
	enc := NewEncoder()
	data := btypes.MultiplePropertyData{
		Objects: []btypes.Object{{
			ID: btypes.ObjectID{Type: btypes.AnalogValue, Instance: 1},
			Properties: []btypes.Property{{
				Type: btypes.PropPresentValue,
			}},
		}},
	}
	require.NoError(t, enc.ReadMultipleProperty(1, data))
	assert.NotEmpty(t, enc.Bytes())
}

func TestCoverage_WritePropertyEncode(t *testing.T) {
	enc := NewEncoder()
	wp := btypes.PropertyData{
		Object: btypes.Object{
			ID: btypes.ObjectID{Type: btypes.AnalogValue, Instance: 1},
			Properties: []btypes.Property{{
				Type:     btypes.PropPresentValue,
				Data:     float32(25.5),
				Priority: 8,
			}},
		},
	}
	require.NoError(t, enc.WriteProperty(1, wp))
	assert.NotEmpty(t, enc.Bytes())
}
