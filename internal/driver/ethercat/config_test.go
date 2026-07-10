package ethercat

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// =============================================================================
// defaultChannelConfig tests
// =============================================================================

func TestDefaultChannelConfig(t *testing.T) {
	c := defaultChannelConfig()
	assert.Equal(t, 1*time.Millisecond, c.cycleTime)
	assert.Equal(t, 3*time.Second, c.timeout)
	assert.Equal(t, 3, c.maxRetries)
	assert.False(t, c.simulation)
	assert.Empty(t, c.localInterface)
}

// =============================================================================
// parseChannelConfig tests
// =============================================================================

func TestParseChannelConfig_Valid(t *testing.T) {
	tests := []struct {
		name     string
		cfg      map[string]any
		expected channelConfig
	}{
		{
			name: "full config snake_case",
			cfg: map[string]any{
				"local_interface": "eth0",
				"cycle_time_us":   500,
				"timeout":         5000,
				"max_retries":     5,
				"simulation":      false,
			},
			expected: channelConfig{
				localInterface: "eth0",
				cycleTime:      500 * time.Microsecond,
				timeout:        5 * time.Second,
				maxRetries:     5,
				simulation:     false,
			},
		},
		{
			name: "full config camelCase",
			cfg: map[string]any{
				"localInterface": "eth1",
				"cycleTimeUs":    2000,
				"timeout":        2000,
				"maxRetries":     2,
				"simulation":     true,
			},
			expected: channelConfig{
				localInterface: "eth1",
				cycleTime:      2 * time.Millisecond,
				timeout:        2 * time.Second,
				maxRetries:     2,
				simulation:     true,
			},
		},
		{
			name: "simulation mode no interface",
			cfg: map[string]any{
				"simulation": true,
			},
			expected: channelConfig{
				cycleTime:  1 * time.Millisecond,
				timeout:    3 * time.Second,
				maxRetries: 3,
				simulation: true,
			},
		},
		{
			name: "partial config with defaults",
			cfg: map[string]any{
				"local_interface": "eth0",
			},
			expected: channelConfig{
				localInterface: "eth0",
				cycleTime:      1 * time.Millisecond,
				timeout:        3 * time.Second,
				maxRetries:     3,
			},
		},
		{
			name: "json number types (float64)",
			cfg: map[string]any{
				"local_interface": "eth0",
				"cycle_time_us":   float64(1000),
				"timeout":         float64(3000),
				"max_retries":     float64(3),
			},
			expected: channelConfig{
				localInterface: "eth0",
				cycleTime:      1 * time.Millisecond,
				timeout:        3 * time.Second,
				maxRetries:     3,
			},
		},
		{
			name: "string number values",
			cfg: map[string]any{
				"local_interface": "eth0",
				"cycle_time_us":   "1000",
				"timeout":         "3000",
				"max_retries":     "5",
			},
			expected: channelConfig{
				localInterface: "eth0",
				cycleTime:      1 * time.Millisecond,
				timeout:        3 * time.Second,
				maxRetries:     5,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c, err := parseChannelConfig(tt.cfg)
			require.NoError(t, err)
			assert.Equal(t, tt.expected.localInterface, c.localInterface)
			assert.Equal(t, tt.expected.cycleTime, c.cycleTime)
			assert.Equal(t, tt.expected.timeout, c.timeout)
			assert.Equal(t, tt.expected.maxRetries, c.maxRetries)
			assert.Equal(t, tt.expected.simulation, c.simulation)
		})
	}
}

func TestParseChannelConfig_Errors(t *testing.T) {
	_, err := parseChannelConfig(map[string]any{})
	require.Error(t, err)
	assert.Contains(t, err.Error(), "local_interface is required")
}

// =============================================================================
// defaultDeviceConfig tests
// =============================================================================

func TestDefaultDeviceConfig(t *testing.T) {
	c := defaultDeviceConfig()
	assert.Equal(t, "pdo", c.runMode)
	assert.Equal(t, 0, c.position)
}

// =============================================================================
// parseDeviceConfig tests
// =============================================================================

func TestParseDeviceConfig_Valid(t *testing.T) {
	tests := []struct {
		name     string
		cfg      map[string]any
		expected deviceConfig
	}{
		{
			name: "full config",
			cfg: map[string]any{
				"position":     1,
				"alias":        100,
				"vendor_id":    "0x00000002",
				"product_code": "0x07D43052",
				"revision":     "0x00010000",
				"tx_pdo_size":  16,
				"rx_pdo_size":  8,
				"run_mode":     "pdo",
			},
			expected: deviceConfig{
				position:    1,
				alias:       100,
				vendorID:    "0x00000002",
				productCode: "0x07D43052",
				revision:    "0x00010000",
				txPDOSize:   16,
				rxPDOSize:   8,
				runMode:     "pdo",
			},
		},
		{
			name: "minimal config",
			cfg: map[string]any{
				"position": 1,
			},
			expected: deviceConfig{
				position: 1,
				runMode:  "pdo",
			},
		},
		{
			name: "camelCase keys",
			cfg: map[string]any{
				"position":    2,
				"vendorId":    "0x00000002",
				"productCode": "0x00000001",
				"txPdoSize":   32,
				"rxPdoSize":   16,
				"runMode":     "sdo",
			},
			expected: deviceConfig{
				position:    2,
				vendorID:    "0x00000002",
				productCode: "0x00000001",
				txPDOSize:   32,
				rxPDOSize:   16,
				runMode:     "sdo",
			},
		},
		{
			name: "json number types",
			cfg: map[string]any{
				"position":    float64(3),
				"tx_pdo_size": float64(64),
				"rx_pdo_size": float64(32),
			},
			expected: deviceConfig{
				position:  3,
				txPDOSize: 64,
				rxPDOSize: 32,
				runMode:   "pdo",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c, err := parseDeviceConfig(tt.cfg)
			require.NoError(t, err)
			assert.Equal(t, tt.expected.position, c.position)
			assert.Equal(t, tt.expected.alias, c.alias)
			assert.Equal(t, tt.expected.vendorID, c.vendorID)
			assert.Equal(t, tt.expected.productCode, c.productCode)
			assert.Equal(t, tt.expected.txPDOSize, c.txPDOSize)
			assert.Equal(t, tt.expected.rxPDOSize, c.rxPDOSize)
			assert.Equal(t, tt.expected.runMode, c.runMode)
		})
	}
}

func TestParseDeviceConfig_Errors(t *testing.T) {
	tests := []struct {
		name string
		cfg  map[string]any
		msg  string
	}{
		{
			name: "missing position",
			cfg:  map[string]any{},
			msg:  "position is required",
		},
		{
			name: "position zero",
			cfg:  map[string]any{"position": 0},
			msg:  "position is required",
		},
		{
			name: "invalid run_mode",
			cfg:  map[string]any{"position": 1, "run_mode": "invalid"},
			msg:  "run_mode must be",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := parseDeviceConfig(tt.cfg)
			require.Error(t, err)
			assert.Contains(t, err.Error(), tt.msg)
		})
	}
}

// =============================================================================
// Helper functions: firstString, firstInt, firstBool
// =============================================================================

func TestFirstString(t *testing.T) {
	tests := []struct {
		name     string
		cfg      map[string]any
		keys     []string
		expected string
	}{
		{"exact match", map[string]any{"key": "value"}, []string{"key"}, "value"},
		{"fallback key", map[string]any{"key2": "value2"}, []string{"key1", "key2"}, "value2"},
		{"no match", map[string]any{"key": "value"}, []string{"missing"}, ""},
		{"empty string", map[string]any{"key": ""}, []string{"key"}, ""},
		{"not a string", map[string]any{"key": 123}, []string{"key"}, ""},
		{"empty map", map[string]any{}, []string{"key"}, ""},
		{"nil map", nil, []string{"key"}, ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, firstString(tt.cfg, tt.keys...))
		})
	}
}

func TestFirstInt(t *testing.T) {
	tests := []struct {
		name     string
		cfg      map[string]any
		keys     []string
		expected int
	}{
		{"int type", map[string]any{"key": 42}, []string{"key"}, 42},
		{"int64 type", map[string]any{"key": int64(100)}, []string{"key"}, 100},
		{"float64 type", map[string]any{"key": float64(3.14)}, []string{"key"}, 3},
		{"string type", map[string]any{"key": "99"}, []string{"key"}, 99},
		{"zero value", map[string]any{"key": 0}, []string{"key"}, 0},
		{"fallback", map[string]any{"key2": 42}, []string{"key1", "key2"}, 42},
		{"no match", map[string]any{"key": 42}, []string{"missing"}, 0},
		{"invalid string", map[string]any{"key": "abc"}, []string{"key"}, 0},
		{"empty map", map[string]any{}, []string{"key"}, 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, firstInt(tt.cfg, tt.keys...))
		})
	}
}

func TestFirstBool(t *testing.T) {
	tests := []struct {
		name     string
		cfg      map[string]any
		keys     []string
		expected bool
	}{
		{"bool true", map[string]any{"key": true}, []string{"key"}, true},
		{"bool false", map[string]any{"key": false}, []string{"key"}, false},
		{"string true", map[string]any{"key": "true"}, []string{"key"}, true},
		{"string false", map[string]any{"key": "false"}, []string{"key"}, false},
		{"string 1", map[string]any{"key": "1"}, []string{"key"}, true},
		{"string 0", map[string]any{"key": "0"}, []string{"key"}, false},
		{"fallback", map[string]any{"key2": true}, []string{"key1", "key2"}, true},
		{"no match", map[string]any{"key": true}, []string{"missing"}, false},
		{"invalid string", map[string]any{"key": "abc"}, []string{"key"}, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, firstBool(tt.cfg, tt.keys...))
		})
	}
}
