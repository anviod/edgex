package nils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCoverage_NilsHelpers(t *testing.T) {
	s := NewString("hello")
	assert.Equal(t, "hello", StringIsNil(s))
	assert.Equal(t, "", StringIsNil(nil))
	assert.False(t, StringNilCheck(s))
	assert.True(t, StringNilCheck(nil))

	f := NewFloat64(3.14)
	assert.InDelta(t, 3.14, Float64IsNil(f), 0.001)
	assert.Equal(t, float64(0), Float64IsNil(nil))

	i := NewInt(99)
	assert.Equal(t, 99, IntIsNil(i))
	assert.True(t, IntNilCheck(nil))

	bt := NewTrue()
	bf := NewFalse()
	assert.True(t, BoolIsNil(bt))
	assert.False(t, BoolIsNil(bf))
	assert.False(t, BoolIsNil(nil))
	assert.True(t, BoolNilCheck(nil))

	u16 := NewUint16(42)
	assert.Equal(t, uint16(42), Unit16IsNil(u16))
	u32 := NewUint32(1000)
	assert.Equal(t, uint32(1000), Unit32IsNil(u32))
	assert.True(t, Unit32NilCheck(nil))

	f32 := NewFloat32(1.5)
	assert.InDelta(t, 1.5, Float32IsNil(f32), 0.001)

	u := uint(7)
	assert.Equal(t, uint(7), UnitIsNil(&u))
	assert.True(t, FloatIsNilCheck(nil))
}
