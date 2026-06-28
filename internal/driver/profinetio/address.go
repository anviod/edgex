package profinetio

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// Endian constants for address suffix #ENDIAN.
const (
	EndianBig    = "BE"
	EndianLittle = "LE"
)

// ParsedAddress represents SLOT:SUB_SLOT:INDEX[.BIT][#ENDIAN].
type ParsedAddress struct {
	Slot    int
	SubSlot int
	Index   int
	Bit     int  // -1 when not a bit address
	Endian  string
	IsBit   bool
}

var reAddress = regexp.MustCompile(`^(\d+):(\d+):(\d+)(?:\.(\d+))?(?:#(BE|LE|be|le))?$`)

// ParseAddress parses Profinet IO point address format.
func ParseAddress(addr string) (*ParsedAddress, error) {
	addr = strings.TrimSpace(addr)
	if addr == "" {
		return nil, fmt.Errorf("profinet-io address cannot be empty")
	}

	m := reAddress.FindStringSubmatch(addr)
	if m == nil {
		return nil, fmt.Errorf("invalid profinet-io address format: expected SLOT:SUB_SLOT:INDEX[.BIT][#ENDIAN], got %q", addr)
	}

	slot, err := strconv.Atoi(m[1])
	if err != nil || slot < 0 {
		return nil, fmt.Errorf("invalid slot: %s", m[1])
	}
	subSlot, err := strconv.Atoi(m[2])
	if err != nil || subSlot < 0 {
		return nil, fmt.Errorf("invalid subslot: %s", m[2])
	}
	index, err := strconv.Atoi(m[3])
	if err != nil || index < 0 {
		return nil, fmt.Errorf("invalid index: %s", m[3])
	}

	pa := &ParsedAddress{
		Slot:    slot,
		SubSlot: subSlot,
		Index:   index,
		Bit:     -1,
		Endian:  EndianBig,
	}
	if m[4] != "" {
		bit, err := strconv.Atoi(m[4])
		if err != nil || bit < 0 || bit > 7 {
			return nil, fmt.Errorf("invalid bit offset: %s", m[4])
		}
		pa.Bit = bit
		pa.IsBit = true
	}
	if m[5] != "" {
		pa.Endian = strings.ToUpper(m[5])
	}
	return pa, nil
}

// ByteSize returns number of bytes required for a data type.
func ByteSize(dataType string) int {
	switch strings.ToLower(strings.TrimSpace(dataType)) {
	case "bit", "bool":
		return 1
	case "int8", "uint8":
		return 1
	case "int16", "uint16":
		return 2
	case "int32", "uint32", "float", "float32":
		return 4
	case "int64", "uint64", "double", "float64":
		return 8
	default:
		return 1
	}
}
