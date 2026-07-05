package btypes

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_AddressMethods(t *testing.T) {
	bcast := Address{Net: GlobalBroadcast}
	assert.True(t, bcast.IsBroadcast())

	sub := Address{Net: 5, Len: 0}
	assert.True(t, sub.IsSubBroadcast())

	unicast := Address{MacLen: 6, Mac: []byte{192, 168, 1, 1, 0xBA, 0xC0}}
	assert.True(t, unicast.IsUnicast())

	a := Address{Mac: []byte{10, 0, 0, 5, 0x12, 0x34}}
	a.SetLength()
	assert.Equal(t, uint8(6), a.Len)

	a.SetBroadcast(true)
	assert.Equal(t, uint8(0), a.MacLen)
	a.SetBroadcast(false)

	addr, err := a.UDPAddr()
	require.NoError(t, err)
	assert.Equal(t, 4660, addr.Port)
	assert.Equal(t, "10.0.0.5", addr.IP.String())

	_, err = (&Address{Mac: []byte{1, 2}}).UDPAddr()
	require.Error(t, err)
}

func TestCoverage_BitString(t *testing.T) {
	bs := NewBitString(4)
	bs.SetBit(0, true)
	bs.SetBit(3, true)
	assert.True(t, bs.Bit(0))
	assert.True(t, bs.Bit(3))
	assert.False(t, bs.Bit(1))
	assert.Equal(t, uint8(4), bs.GetBitUsed())
	assert.Equal(t, uint8(1), bs.BytesUsed())

	vals := bs.GetValue()
	require.Len(t, vals, 4)
	assert.Contains(t, bs.String(), "true")

	bs.SetBitsUsed(1, 0)
	bs.SetByte(0, 0xFF)
	assert.Greater(t, bs.BitsCapacity(), uint8(0))
}

func TestCoverage_ObjectMapJSON(t *testing.T) {
	om := ObjectMap{
		AnalogValue: {
			1: {ID: ObjectID{Type: AnalogValue, Instance: 1}, Name: "AV1"},
		},
	}
	assert.Equal(t, 1, om.Len())

	raw, err := json.Marshal(om)
	require.NoError(t, err)

	var decoded ObjectMap = make(ObjectMap)
	require.NoError(t, json.Unmarshal(raw, &decoded))
	assert.Equal(t, "AV1", decoded[AnalogValue][1].Name)
}

func TestCoverage_ObjectIDString(t *testing.T) {
	id := ObjectID{Type: AnalogValue, Instance: 42}
	assert.Contains(t, id.String(), "42")
}

func TestCoverage_DeviceNewAndCheckAPDU(t *testing.T) {
	dev, err := NewDevice(&Device{
		Ip: "192.168.1.5", DeviceID: 100, MaxApdu: MaxAPDU480,
	})
	require.NoError(t, err)
	require.NotNil(t, dev)
	assert.NoError(t, dev.CheckADPU())
	// empty device has nil Objects map; ObjectSlice returns nil slice
	assert.Empty(t, dev.ObjectSlice())
}

func TestCoverage_PropertyHelpers(t *testing.T) {
	keys := Keys()
	assert.NotEmpty(t, keys)

	prop, err := Get("object-name")
	require.NoError(t, err)
	assert.Equal(t, PropObjectName, prop)

	assert.True(t, IsDeviceProperty(PropObjectList))
	assert.False(t, IsDeviceProperty(PropPresentValue))
	assert.Contains(t, String(PropPresentValue), "Present Value")
}

func TestCoverage_APDUConfirmed(t *testing.T) {
	apdu := APDU{DataType: 0x04}
	assert.True(t, apdu.IsConfirmedServiceRequest())
}
