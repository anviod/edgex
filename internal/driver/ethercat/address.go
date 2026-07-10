package ethercat

import (
	"fmt"
	"strconv"
	"strings"
)

// ParsedAddress holds the decoded components of an EtherCAT point address.
//
// PDO address format: POSITION:PDO:OFFSET[.BIT][#ENDIAN]
// SDO address format: POSITION:SDO:0xINDEX:0xSUBINDEX[#ENDIAN]
type ParsedAddress struct {
	Position int    // slave position on bus (1..N)
	IsSDO    bool   // true if SDO (CoE mailbox) access
	PDOType  string // "Tx" (input/read) or "Rx" (output/write), only for PDO
	Offset   int    // byte offset in PDO image, only for PDO
	Bit      int    // bit offset 0-7, -1 if not a bit address
	Index    uint16 // object dictionary index, only for SDO
	SubIndex uint16 // object dictionary sub-index, only for SDO
	Endian   string // "BE" (default) or "LE"
}

// ParseAddress parses an EtherCAT point address string.
//
// Valid formats:
//   - PDO:  "1:Tx:0"       → slave 1 TxPDO offset 0
//   - PDO:  "1:Tx:2.3"     → slave 1 TxPDO offset 2 bit 3
//   - PDO:  "2:Rx:4#LE"    → slave 2 RxPDO offset 4, little-endian
//   - SDO:  "1:SDO:0x6041:0"      → slave 1 SDO 0x6041 sub 0
//   - SDO:  "1:SDO:0x6064:0#BE"   → slave 1 SDO 0x6064 sub 0, big-endian
func ParseAddress(s string) (*ParsedAddress, error) {
	s = strings.TrimSpace(s)
	if s == "" {
		return nil, fmt.Errorf("ethercat: empty address")
	}

	addr := &ParsedAddress{
		Bit:    -1,
		Endian: "BE",
	}

	// extract optional endian suffix
	if idx := strings.Index(s, "#"); idx >= 0 {
		endian := strings.ToUpper(s[idx+1:])
		s = s[:idx]
		if endian == "LE" || endian == "BE" {
			addr.Endian = endian
		} else {
			return nil, fmt.Errorf("ethercat: invalid endian %q, expected BE or LE", endian)
		}
	}

	parts := strings.Split(s, ":")
	if len(parts) < 3 {
		return nil, fmt.Errorf("ethercat: invalid address format %q, expected POSITION:PDO:OFFSET or POSITION:SDO:0xINDEX:0xSUBINDEX", s)
	}

	// parse position
	pos, err := strconv.Atoi(parts[0])
	if err != nil || pos < 1 {
		return nil, fmt.Errorf("ethercat: invalid slave position %q", parts[0])
	}
	addr.Position = pos

	// determine PDO or SDO
	accessType := strings.ToUpper(parts[1])
	switch accessType {
	case "TX", "RX", "0", "1":
		// PDO access
		addr.PDOType = accessType
		if accessType == "0" {
			addr.PDOType = "Tx"
		} else if accessType == "1" {
			addr.PDOType = "Rx"
		}
		// parse offset and optional bit
		offsetStr := parts[2]
		if dotIdx := strings.Index(offsetStr, "."); dotIdx >= 0 {
			bitStr := offsetStr[dotIdx+1:]
			offsetStr = offsetStr[:dotIdx]
			bit, err := strconv.Atoi(bitStr)
			if err != nil || bit < 0 || bit > 7 {
				return nil, fmt.Errorf("ethercat: invalid bit offset %q, expected 0-7", bitStr)
			}
			addr.Bit = bit
		}
		off, err := strconv.Atoi(offsetStr)
		if err != nil || off < 0 {
			return nil, fmt.Errorf("ethercat: invalid PDO offset %q", offsetStr)
		}
		addr.Offset = off

	case "SDO":
		addr.IsSDO = true
		if len(parts) < 4 {
			return nil, fmt.Errorf("ethercat: SDO address requires INDEX:SUBINDEX, got %q", s)
		}
		// parse index (hex)
		indexStr := strings.TrimPrefix(strings.ToLower(parts[2]), "0x")
		index, err := strconv.ParseUint(indexStr, 16, 16)
		if err != nil {
			return nil, fmt.Errorf("ethercat: invalid SDO index %q", parts[2])
		}
		addr.Index = uint16(index)

		// parse sub-index (hex or decimal)
		subStr := strings.TrimPrefix(strings.ToLower(parts[3]), "0x")
		sub, err := strconv.ParseUint(subStr, 16, 16)
		if err != nil {
			return nil, fmt.Errorf("ethercat: invalid SDO sub-index %q", parts[3])
		}
		addr.SubIndex = uint16(sub)

	default:
		return nil, fmt.Errorf("ethercat: unknown access type %q, expected Tx, Rx, or SDO", parts[1])
	}

	return addr, nil
}

// String returns the canonical address string representation.
func (a *ParsedAddress) String() string {
	if a.IsSDO {
		return fmt.Sprintf("%d:SDO:0x%04X:%d#%s", a.Position, a.Index, a.SubIndex, a.Endian)
	}
	s := fmt.Sprintf("%d:%s:%d", a.Position, a.PDOType, a.Offset)
	if a.Bit >= 0 {
		s += fmt.Sprintf(".%d", a.Bit)
	}
	if a.Endian != "BE" {
		s += "#" + a.Endian
	}
	return s
}
