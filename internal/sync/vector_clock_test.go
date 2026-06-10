package sync

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestVectorClock_New(t *testing.T) {
	vc := NewVectorClock()
	assert.NotNil(t, vc)
	assert.Empty(t, vc)
	assert.True(t, vc.IsEmpty())
}

func TestVectorClock_Increment(t *testing.T) {
	vc := NewVectorClock()
	vc.Increment("nodeA")
	assert.Equal(t, uint64(1), vc.Get("nodeA"))
	assert.True(t, !vc.IsEmpty())

	vc.Increment("nodeA")
	assert.Equal(t, uint64(2), vc.Get("nodeA"))

	vc.Increment("nodeB")
	assert.Equal(t, uint64(1), vc.Get("nodeB"))
}

func TestVectorClock_Compare(t *testing.T) {
	vc1 := NewVectorClock()
	vc1.Increment("nodeA")
	vc1.Increment("nodeA")
	vc1.Increment("nodeB")

	vc2 := NewVectorClock()
	vc2.Increment("nodeA")
	vc2.Increment("nodeB")
	vc2.Increment("nodeB")

	assert.Equal(t, 0, vc1.Compare(vc2))

	vc3 := NewVectorClock()
	vc3.Increment("nodeA")
	assert.Equal(t, 1, vc1.Compare(vc3))
	assert.Equal(t, -1, vc3.Compare(vc1))

	vc4 := NewVectorClock()
	vc4.Increment("nodeA")
	vc4.Increment("nodeA")
	vc4.Increment("nodeB")
	assert.Equal(t, 0, vc1.Compare(vc4))
}

func TestVectorClock_Merge(t *testing.T) {
	vc1 := NewVectorClock()
	vc1.Increment("nodeA")
	vc1.Increment("nodeB")

	vc2 := NewVectorClock()
	vc2.Increment("nodeA")
	vc2.Increment("nodeA")
	vc2.Increment("nodeC")

	vc1.Merge(vc2)

	assert.Equal(t, uint64(2), vc1.Get("nodeA"))
	assert.Equal(t, uint64(1), vc1.Get("nodeB"))
	assert.Equal(t, uint64(1), vc1.Get("nodeC"))
}

func TestVectorClock_Clone(t *testing.T) {
	vc1 := NewVectorClock()
	vc1.Increment("nodeA")
	vc1.Increment("nodeB")

	vc2 := vc1.Clone()

	assert.Equal(t, vc1.Get("nodeA"), vc2.Get("nodeA"))
	assert.Equal(t, vc1.Get("nodeB"), vc2.Get("nodeB"))

	vc2.Increment("nodeA")
	assert.NotEqual(t, vc1.Get("nodeA"), vc2.Get("nodeA"))
}

func TestVectorClock_String(t *testing.T) {
	vc := NewVectorClock()
	vc.Increment("nodeB")
	vc.Increment("nodeA")

	str := vc.String()
	assert.Contains(t, str, "nodeA")
	assert.Contains(t, str, "nodeB")
	assert.Contains(t, str, "1")
}

func TestVectorClock_JSON(t *testing.T) {
	vc := NewVectorClock()
	vc.Increment("nodeA")
	vc.Increment("nodeB")
	vc.Increment("nodeB")

	data, err := vc.MarshalJSON()
	assert.NoError(t, err)
	assert.NotEmpty(t, data)

	var vc2 VectorClock
	err = vc2.UnmarshalJSON(data)
	assert.NoError(t, err)
	assert.Equal(t, uint64(1), vc2.Get("nodeA"))
	assert.Equal(t, uint64(2), vc2.Get("nodeB"))
}

func TestVectorClock_NilSafety(t *testing.T) {
	var nilVC VectorClock

	// Test nil operations are safe
	assert.True(t, nilVC.IsEmpty())
	assert.Equal(t, uint64(0), nilVC.Get("nodeA"))
	nilVC.Increment("nodeA") // Should not panic
	assert.Equal(t, "VectorClock{}", nilVC.String())

	// Test Compare with nil
	vc1 := NewVectorClock()
	assert.Equal(t, 1, vc1.Compare(nilVC))
	assert.Equal(t, -1, nilVC.Compare(vc1))
	assert.Equal(t, 0, nilVC.Compare(nilVC))

	// Test Merge with nil
	vc2 := NewVectorClock()
	vc2.Increment("nodeA")
	nilVC.Merge(vc2) // Should not panic
	assert.True(t, nilVC.IsEmpty())

	// Test Clone nil
	cloned := nilVC.Clone()
	assert.True(t, cloned.IsEmpty())
	assert.NotNil(t, cloned)

	// Test Marshal nil
	data, err := nilVC.MarshalJSON()
	assert.NoError(t, err)
	assert.NotEmpty(t, data)
}

func TestVectorClock_CompareEdgeCases(t *testing.T) {
	// Empty clock compare
	vc1 := NewVectorClock()
	vc2 := NewVectorClock()
	assert.Equal(t, 0, vc1.Compare(vc2))

	// One is strictly ahead
	vc1.Increment("nodeA")
	assert.Equal(t, 1, vc1.Compare(vc2))
	assert.Equal(t, -1, vc2.Compare(vc1))

	// Concurrent (neither ahead)
	vc2.Increment("nodeB")
	assert.Equal(t, 0, vc1.Compare(vc2))
	assert.Equal(t, 0, vc2.Compare(vc1))
}
