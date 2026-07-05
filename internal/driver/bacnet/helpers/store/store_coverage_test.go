package store

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_StoreHandler(t *testing.T) {
	h := Init()
	require.NotNil(t, h)

	h.Set("key1", "value1", time.Minute)
	h.Set("key2", 42, 0)

	v, ok := h.Get("key1")
	require.True(t, ok)
	assert.Equal(t, "value1", v)

	v, ok = h.Get("key2")
	require.True(t, ok)
	assert.Equal(t, 42, v)

	_, ok = h.Get("missing")
	assert.False(t, ok)

	h.Set("key1", "updated", time.Second)
	v, ok = h.Get("key1")
	require.True(t, ok)
	assert.Equal(t, "updated", v)
}
