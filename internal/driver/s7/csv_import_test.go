package s7

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestConvertCSVToS7Address(t *testing.T) {
	tests := []struct {
		name     string
		ioAddr   string
		expected string
		wantErr  bool
	}{
		{
			name:     "DB BOOL with bit offset",
			ioAddr:   "Device1.DB1.BOOL.7006.7",
			expected: "DB1.DBX7006.7",
		},
		{
			name:     "DB BOOL at different bit",
			ioAddr:   "Device1.DB1.BOOL.7011.0",
			expected: "DB1.DBX7011.0",
		},
		{
			name:     "DB BOOL at bit 1",
			ioAddr:   "Device1.DB1.BOOL.7011.1",
			expected: "DB1.DBX7011.1",
		},
		{
			name:     "DB REAL",
			ioAddr:   "Device1.DB1.REAL.7500",
			expected: "DB1.DBD7500",
		},
		{
			name:     "DB REAL at offset 7504",
			ioAddr:   "Device1.DB1.REAL.7504",
			expected: "DB1.DBD7504",
		},
		{
			name:     "DB LREAL",
			ioAddr:   "Device1.DB1.LREAL.7500",
			expected: "DB1.DBD7500",
		},
		{
			name:     "Q BOOL",
			ioAddr:   "Device1.Q.BOOL.1.3",
			expected: "Q1.3",
		},
		{
			name:     "I BOOL",
			ioAddr:   "Device1.I.BOOL.0.0",
			expected: "I0.0",
		},
		{
			name:    "DB BOOL without bit offset",
			ioAddr:  "Device1.DB1.BOOL.7006",
			wantErr: true,
		},
		{
			name:    "invalid format",
			ioAddr:  "invalid",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := ConvertCSVToS7Address(tt.ioAddr)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestConvertCSVTypeToS7DataType(t *testing.T) {
	tests := []struct {
		csvType  string
		expected string
	}{
		{"BOOL", "bool"},
		{"REAL", "float32"},
		{"LREAL", "float64"},
		{"DWORD", "uint32"},
		{"WORD", "uint16"},
		{"INT", "int16"},
		{"UINT", "uint16"},
		{"BYTE", "uint8"},
		{"SINT", "int8"},
		{"DINT", "int32"},
		{"STRING", "string"},
		{"UNKNOWN", "float32"}, // 默认
	}

	for _, tt := range tests {
		t.Run(tt.csvType, func(t *testing.T) {
			result := ConvertCSVTypeToS7DataType(tt.csvType)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestCSVToPoints(t *testing.T) {
	csvPoints := []CSVPointConfig{
		{
			TagName:   "CHILLER1_ALARM",
			Type:      "BOOL",
			IOAddress: "Device1.DB1.BOOL.7006.7",
			Unit:      "",
			DataGroup: "0",
			ReadOnly:  true,
		},
		{
			TagName:   "CHILLER_P1_TEMP1",
			Type:      "LREAL",
			IOAddress: "Device1.DB1.REAL.7500",
			Unit:      "°C",
			DataGroup: "0",
			ReadOnly:  false,
		},
	}

	points, err := CSVToPoints(csvPoints)
	require.NoError(t, err)
	assert.Len(t, points, 2)

	// 验证第一个点位
	assert.Equal(t, "CHILLER1_ALARM", points[0].Name)
	assert.Equal(t, "DB1.DBX7006.7", points[0].Address)
	assert.Equal(t, "bool", points[0].DataType)
	assert.Equal(t, "R", points[0].ReadWrite)

	// 验证第二个点位
	assert.Equal(t, "CHILLER_P1_TEMP1", points[1].Name)
	assert.Equal(t, "DB1.DBD7500", points[1].Address)
	assert.Equal(t, "float64", points[1].DataType)
	assert.Equal(t, "RW", points[1].ReadWrite)
	assert.Equal(t, "°C", points[1].Unit)
}

func TestGroupByDataGroup(t *testing.T) {
	csvPoints := []CSVPointConfig{
		{TagName: "A", DataGroup: "0"},
		{TagName: "B", DataGroup: "0"},
		{TagName: "C", DataGroup: "1"},
		{TagName: "D", DataGroup: ""},
	}

	groups := GroupByDataGroup(csvPoints)
	assert.Len(t, groups, 3) // "0", "1", "未分组"

	// 找到各组并验证
	for _, g := range groups {
		switch g.Group {
		case "0":
			assert.Equal(t, 2, g.Count)
		case "1":
			assert.Equal(t, 1, g.Count)
		case "未分组":
			assert.Equal(t, 1, g.Count)
		}
	}
}

func TestConvertDBAddress(t *testing.T) {
	tests := []struct {
		name        string
		dbNum       string
		dataType    string
		byteOffset  string
		bitOffset   string
		expected    string
		expectError bool
	}{
		{
			name:       "BOOL with bit",
			dbNum:      "1",
			dataType:   "BOOL",
			byteOffset: "7006",
			bitOffset:  "7",
			expected:   "DB1.DBX7006.7",
		},
		{
			name:       "REAL",
			dbNum:      "1",
			dataType:   "REAL",
			byteOffset: "7500",
			bitOffset:  "",
			expected:   "DB1.DBD7500",
		},
		{
			name:       "LREAL",
			dbNum:      "1",
			dataType:   "LREAL",
			byteOffset: "7500",
			bitOffset:  "",
			expected:   "DB1.DBD7500",
		},
		{
			name:       "DWORD",
			dbNum:      "1",
			dataType:   "DWORD",
			byteOffset: "100",
			bitOffset:  "",
			expected:   "DB1.DBD100",
		},
		{
			name:       "WORD",
			dbNum:      "1",
			dataType:   "WORD",
			byteOffset: "50",
			bitOffset:  "",
			expected:   "DB1.DBW50",
		},
		{
			name:       "BYTE",
			dbNum:      "1",
			dataType:   "BYTE",
			byteOffset: "10",
			bitOffset:  "",
			expected:   "DB1.DBB10",
		},
		{
			name:        "BOOL without bit",
			dbNum:       "1",
			dataType:    "BOOL",
			byteOffset:  "7006",
			bitOffset:   "",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := convertDBAddress(tt.dbNum, tt.dataType, tt.byteOffset, tt.bitOffset)
			if tt.expectError {
				assert.Error(t, err)
			} else {
				require.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
		})
	}
}

func TestConvertNonDBAddress(t *testing.T) {
	tests := []struct {
		name       string
		area       string
		dataType   string
		byteOffset string
		bitOffset  string
		expected   string
	}{
		{
			name:       "Q BOOL",
			area:       "Q",
			dataType:   "BOOL",
			byteOffset: "1",
			bitOffset:  "3",
			expected:   "Q1.3",
		},
		{
			name:       "I BOOL",
			area:       "I",
			dataType:   "BOOL",
			byteOffset: "0",
			bitOffset:  "0",
			expected:   "I0.0",
		},
		{
			name:       "M REAL",
			area:       "M",
			dataType:   "REAL",
			byteOffset: "100",
			bitOffset:  "",
			expected:   "MD100",
		},
		{
			name:       "Q DWORD",
			area:       "Q",
			dataType:   "DWORD",
			byteOffset: "50",
			bitOffset:  "",
			expected:   "QD50",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := convertNonDBAddress(tt.area, tt.dataType, tt.byteOffset, tt.bitOffset)
			require.NoError(t, err)
			assert.Equal(t, tt.expected, result)
		})
	}
}
