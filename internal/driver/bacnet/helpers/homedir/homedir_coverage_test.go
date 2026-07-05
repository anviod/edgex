package homedir

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_HomedirFromEnv(t *testing.T) {
	Reset()
	t.Setenv("HOME", "/tmp/test-home")
	dir, err := Dir()
	require.NoError(t, err)
	assert.Equal(t, "/tmp/test-home", dir)

	path, err := Expand("~/subdir")
	require.NoError(t, err)
	assert.Contains(t, path, "subdir")

	passthrough, err := Expand("/absolute/path")
	require.NoError(t, err)
	assert.Equal(t, "/absolute/path", passthrough)

	_, err = Expand("~useronly")
	require.Error(t, err)

	Reset()
	DisableCache = false
	_ = os.Getenv("HOME")
}
