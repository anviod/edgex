package core

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/anviod/edgex/internal/model"

	"github.com/stretchr/testify/assert"
	"gopkg.in/yaml.v3"
)

// TestDeviceFileSimplification tests that non-Modbus protocols
// have their device configuration files simplified (removing Modbus-specific fields).
func TestDeviceFileSimplification(t *testing.T) {
	// Setup temporary directory for test files
	tempDir, err := os.MkdirTemp("", "device_test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	// Define test cases
	testCases := []struct {
		name          string
		protocol      string
		expectRemoved bool
	}{
		{
			name:          "Modbus TCP - Should Keep Fields",
			protocol:      "modbus-tcp",
			expectRemoved: false,
		},
		{
			name:          "BACnet IP - Should Remove Fields",
			protocol:      "bacnet-ip",
			expectRemoved: true,
		},
		{
			name:          "OPC UA - Should Remove Fields",
			protocol:      "opc-ua",
			expectRemoved: true,
		},
		{
			name:          "Other Protocol - Should Remove Fields",
			protocol:      "mqtt",
			expectRemoved: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Create a dummy device with Modbus-like fields in points
			// Note: The Point struct in model usually has these fields,
			// but we are testing the file output logic which might handle maps or structs.
			// saveDeviceToFile marshals the Device struct.
			// The Device struct has Points []Point.
			// The Point struct has RegisterType and FunctionCode fields.

			// We populate a device with points having these fields set.
			dev := &model.Device{
				ID:   "test-dev-" + tc.protocol,
				Name: "Test Device",
				Points: []model.Point{
					{
						ID:           "p1",
						Name:         "Point 1",
						RegisterType: model.RegHolding, // Modbus specific
						FunctionCode: 3,                // Modbus specific
						DataType:     "float32",
					},
				},
			}

			filePath := filepath.Join(tempDir, dev.ID+".yaml")

			// Call the function under test
			// We need to call saveDeviceToFile. Since it is private in core package,
			// we are writing this test in core package (package core).
			err := saveDeviceToFile(filePath, dev, tc.protocol)
			assert.NoError(t, err)

			// Read the file back
			content, err := os.ReadFile(filePath)
			assert.NoError(t, err)

			// Parse as map to check for existence of keys
			var rawMap map[string]interface{}
			err = yaml.Unmarshal(content, &rawMap)
			assert.NoError(t, err)

			points := rawMap["points"].([]interface{})
			p1 := points[0].(map[string]interface{})

			if tc.expectRemoved {
				assert.NotContains(t, p1, "register_type", "register_type should be removed for %s", tc.protocol)
				assert.NotContains(t, p1, "function_code", "function_code should be removed for %s", tc.protocol)
			} else {
				assert.Contains(t, p1, "register_type", "register_type should be present for %s", tc.protocol)
				assert.Contains(t, p1, "function_code", "function_code should be present for %s", tc.protocol)
			}
		})
	}
}
