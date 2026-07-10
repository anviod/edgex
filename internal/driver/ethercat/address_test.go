package ethercat

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// =============================================================================
// ParseAddress unit tests — table-driven, covers all valid/invalid formats
// =============================================================================

func TestParseAddress_PDOValid(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected *ParsedAddress
	}{
		{
			name:  "TxPDO basic",
			input: "1:Tx:0",
			expected: &ParsedAddress{
				Position: 1, PDOType: "TX", Offset: 0, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "TxPDO with offset",
			input: "1:Tx:16",
			expected: &ParsedAddress{
				Position: 1, PDOType: "TX", Offset: 16, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "RxPDO basic",
			input: "2:Rx:4",
			expected: &ParsedAddress{
				Position: 2, PDOType: "RX", Offset: 4, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "PDO with bit offset",
			input: "1:Tx:2.3",
			expected: &ParsedAddress{
				Position: 1, PDOType: "TX", Offset: 2, Bit: 3, Endian: "BE",
			},
		},
		{
			name:  "PDO with bit 0",
			input: "3:Tx:0.0",
			expected: &ParsedAddress{
				Position: 3, PDOType: "TX", Offset: 0, Bit: 0, Endian: "BE",
			},
		},
		{
			name:  "PDO with bit 7",
			input: "1:Rx:5.7",
			expected: &ParsedAddress{
				Position: 1, PDOType: "RX", Offset: 5, Bit: 7, Endian: "BE",
			},
		},
		{
			name:  "PDO with LE endian",
			input: "1:Tx:4#LE",
			expected: &ParsedAddress{
				Position: 1, PDOType: "TX", Offset: 4, Bit: -1, Endian: "LE",
			},
		},
		{
			name:  "PDO with explicit BE endian",
			input: "2:Rx:8#BE",
			expected: &ParsedAddress{
				Position: 2, PDOType: "RX", Offset: 8, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "PDO with bit and LE endian",
			input: "1:Tx:0.3#LE",
			expected: &ParsedAddress{
				Position: 1, PDOType: "TX", Offset: 0, Bit: 3, Endian: "LE",
			},
		},
		{
			name:  "PDO with numeric type 0 (Tx)",
			input: "1:0:0",
			expected: &ParsedAddress{
				Position: 1, PDOType: "Tx", Offset: 0, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "PDO with numeric type 1 (Rx)",
			input: "2:1:8",
			expected: &ParsedAddress{
				Position: 2, PDOType: "Rx", Offset: 8, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "PDO case insensitive Tx",
			input: "1:tx:0",
			expected: &ParsedAddress{
				Position: 1, PDOType: "TX", Offset: 0, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "PDO case insensitive LE",
			input: "1:Tx:0#le",
			expected: &ParsedAddress{
				Position: 1, PDOType: "TX", Offset: 0, Bit: -1, Endian: "LE",
			},
		},
		{
			name:  "PDO with whitespace",
			input: " 1:Tx:0 ",
			expected: &ParsedAddress{
				Position: 1, PDOType: "TX", Offset: 0, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "PDO large position",
			input: "255:Tx:65535",
			expected: &ParsedAddress{
				Position: 255, PDOType: "TX", Offset: 65535, Bit: -1, Endian: "BE",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr, err := ParseAddress(tt.input)
			require.NoError(t, err)
			assert.Equal(t, tt.expected.Position, addr.Position)
			assert.Equal(t, tt.expected.IsSDO, addr.IsSDO)
			assert.Equal(t, tt.expected.PDOType, addr.PDOType)
			assert.Equal(t, tt.expected.Offset, addr.Offset)
			assert.Equal(t, tt.expected.Bit, addr.Bit)
			assert.Equal(t, tt.expected.Endian, addr.Endian)
		})
	}
}

func TestParseAddress_SDOValid(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected *ParsedAddress
	}{
		{
			name:  "SDO status word",
			input: "1:SDO:0x6041:0",
			expected: &ParsedAddress{
				Position: 1, IsSDO: true, Index: 0x6041, SubIndex: 0, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "SDO position value",
			input: "1:SDO:0x6064:0",
			expected: &ParsedAddress{
				Position: 1, IsSDO: true, Index: 0x6064, SubIndex: 0, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "SDO with subindex",
			input: "1:SDO:0x1018:4",
			expected: &ParsedAddress{
				Position: 1, IsSDO: true, Index: 0x1018, SubIndex: 4, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "SDO with LE endian",
			input: "1:SDO:0x6041:0#LE",
			expected: &ParsedAddress{
				Position: 1, IsSDO: true, Index: 0x6041, SubIndex: 0, Bit: -1, Endian: "LE",
			},
		},
		{
			name:  "SDO case insensitive",
			input: "1:sdo:0x6041:0",
			expected: &ParsedAddress{
				Position: 1, IsSDO: true, Index: 0x6041, SubIndex: 0, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "SDO with decimal subindex",
			input: "2:SDO:0x1000:5",
			expected: &ParsedAddress{
				Position: 2, IsSDO: true, Index: 0x1000, SubIndex: 5, Bit: -1, Endian: "BE",
			},
		},
		{
			name:  "SDO max index",
			input: "1:SDO:0xFFFF:0xFF",
			expected: &ParsedAddress{
				Position: 1, IsSDO: true, Index: 0xFFFF, SubIndex: 0xFF, Bit: -1, Endian: "BE",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr, err := ParseAddress(tt.input)
			require.NoError(t, err)
			assert.Equal(t, tt.expected.Position, addr.Position)
			assert.Equal(t, tt.expected.IsSDO, addr.IsSDO)
			assert.Equal(t, tt.expected.Index, addr.Index)
			assert.Equal(t, tt.expected.SubIndex, addr.SubIndex)
			assert.Equal(t, tt.expected.Endian, addr.Endian)
		})
	}
}

func TestParseAddress_Invalid(t *testing.T) {
	tests := []struct {
		name  string
		input string
		msg   string
	}{
		{"empty", "", "empty address"},
		{"random text", "abc", "invalid address format"},
		{"missing colon", "1Tx0", "invalid address format"},
		{"only position", "1:Tx", "invalid address format"},
		{"invalid endian", "1:Tx:0#XX", "invalid endian"},
		{"invalid position zero", "0:Tx:0", "invalid slave position"},
		{"invalid position negative", "-1:Tx:0", "invalid slave position"},
		{"invalid position text", "abc:Tx:0", "invalid slave position"},
		{"invalid bit offset >7", "1:Tx:0.8", "invalid bit offset"},
		{"invalid bit text", "1:Tx:0.x", "invalid bit offset"},
		{"invalid PDO offset", "1:Tx:abc", "invalid PDO offset"},
		{"invalid PDO offset negative", "1:Tx:-1", "invalid PDO offset"},
		{"unknown access type", "1:ABC:0", "unknown access type"},
		{"SDO missing subindex", "1:SDO:0x6041", "SDO address requires INDEX:SUBINDEX"},
		{"SDO invalid index", "1:SDO:xyz:0", "invalid SDO index"},
		{"SDO invalid subindex", "1:SDO:0x6041:XYZG", "invalid SDO sub-index"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := ParseAddress(tt.input)
			require.Error(t, err)
			assert.Contains(t, err.Error(), tt.msg)
		})
	}
}

// =============================================================================
// ParsedAddress.String() tests — round-trip canonical representation
// =============================================================================

func TestParsedAddress_String(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{"PDO Tx", "1:Tx:0", "1:TX:0"},
		{"PDO Tx with bit", "1:Tx:2.3", "1:TX:2.3"},
		{"PDO Rx with LE", "2:Rx:4#LE", "2:RX:4#LE"},
		{"PDO with BE (no suffix)", "2:Rx:8#BE", "2:RX:8"},
		{"SDO basic", "1:SDO:0x6041:0", "1:SDO:0x6041:0#BE"},
		{"SDO with LE", "1:SDO:0x6064:0#LE", "1:SDO:0x6064:0#LE"},
		{"SDO with subindex", "1:SDO:0x1018:4", "1:SDO:0x1018:4#BE"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr, err := ParseAddress(tt.input)
			require.NoError(t, err)
			assert.Equal(t, tt.expected, addr.String())
		})
	}
}

// =============================================================================
// ParseAddress round-trip: ParseAddress → String → ParseAddress
// =============================================================================

func TestParseAddress_RoundTrip(t *testing.T) {
	inputs := []string{
		"1:Tx:0",
		"1:Tx:2.3",
		"2:Rx:4#LE",
		"1:SDO:0x6041:0",
		"1:SDO:0x6064:0#LE",
		"3:Tx:10.5#LE",
		"255:Rx:0",
	}

	for _, input := range inputs {
		t.Run(input, func(t *testing.T) {
			addr1, err := ParseAddress(input)
			require.NoError(t, err)
			canonical := addr1.String()
			addr2, err := ParseAddress(canonical)
			require.NoError(t, err)
			assert.Equal(t, addr1.Position, addr2.Position)
			assert.Equal(t, addr1.IsSDO, addr2.IsSDO)
			assert.Equal(t, addr1.Offset, addr2.Offset)
			assert.Equal(t, addr1.Bit, addr2.Bit)
			assert.Equal(t, addr1.Endian, addr2.Endian)
			if addr1.IsSDO {
				assert.Equal(t, addr1.Index, addr2.Index)
				assert.Equal(t, addr1.SubIndex, addr2.SubIndex)
			}
		})
	}
}
