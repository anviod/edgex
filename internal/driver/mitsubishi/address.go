package mitsubishi

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// MCAddress parsed Mitsubishi device address.
type MCAddress struct {
	DeviceCode byte
	DeviceName string
	IsBit      bool
	Offset     int
	BitOffset  int // set when reading a bit within a word device (e.g. D20.2)
	StringLen  int
	StringHigh bool // true = high byte first (.H), false = low byte first (.L)
}

var (
	mcSimpleRE = regexp.MustCompile(`^([A-Z]+)(\d+)$`)
	mcBitRE    = regexp.MustCompile(`^([A-Z]+)(\d+)\.(\d+)$`)
	mcStringRE = regexp.MustCompile(`^([A-Z]+)(\d+)\.(\d+)([HL])$`)
)

// ParseAddress parses Mitsubishi MC address strings.
// Examples: D100, M0, X0, Y10, D20.2, D100.16L
func ParseAddress(address string) (*MCAddress, error) {
	address = strings.ToUpper(strings.TrimSpace(address))
	if address == "" {
		return nil, fmt.Errorf("address is empty")
	}

	if m := mcStringRE.FindStringSubmatch(address); m != nil {
		num, _ := strconv.Atoi(m[2])
		strLen, _ := strconv.Atoi(m[3])
		addr, err := deviceAddress(m[1], num)
		if err != nil {
			return nil, err
		}
		addr.StringLen = strLen
		addr.StringHigh = m[4] == "H"
		return addr, nil
	}

	if m := mcBitRE.FindStringSubmatch(address); m != nil {
		num, _ := strconv.Atoi(m[2])
		bit, _ := strconv.Atoi(m[3])
		addr, err := deviceAddress(m[1], num)
		if err != nil {
			return nil, err
		}
		if addr.IsBit {
			return nil, fmt.Errorf("bit notation not supported for %s devices", addr.DeviceName)
		}
		if bit < 0 || bit > 15 {
			return nil, fmt.Errorf("bit offset out of range: %d", bit)
		}
		addr.BitOffset = bit
		return addr, nil
	}

	if m := mcSimpleRE.FindStringSubmatch(address); m != nil {
		num, _ := strconv.Atoi(m[2])
		return deviceAddress(m[1], num)
	}

	return nil, fmt.Errorf("invalid mitsubishi address: %s", address)
}

func deviceAddress(area string, num int) (*MCAddress, error) {
	base := func(code byte, name string, isBit bool) *MCAddress {
		return &MCAddress{DeviceCode: code, DeviceName: name, IsBit: isBit, Offset: num, BitOffset: -1}
	}
	switch area {
	case "X":
		return base(0x9C, "X", true), nil
	case "Y":
		return base(0x9D, "Y", true), nil
	case "M":
		return base(0x90, "M", true), nil
	case "L":
		return base(0x92, "L", true), nil
	case "F":
		return base(0x93, "F", true), nil
	case "V":
		return base(0x94, "V", true), nil
	case "B":
		return base(0xA0, "B", true), nil
	case "SB":
		return base(0xA1, "SB", true), nil
	case "SM":
		return base(0x91, "SM", true), nil
	case "D":
		return base(0xA8, "D", false), nil
	case "W":
		return base(0xB4, "W", false), nil
	case "SW":
		return base(0xB5, "SW", false), nil
	case "R":
		return base(0xAF, "R", false), nil
	case "ZR":
		return base(0xB0, "ZR", false), nil
	case "SD":
		return base(0xA9, "SD", false), nil
	case "DX":
		return base(0xA2, "DX", false), nil
	case "DY":
		return base(0xA3, "DY", false), nil
	case "Z":
		return base(0xCC, "Z", false), nil
	case "TS":
		return base(0xC1, "TS", true), nil
	case "TC":
		return base(0xC0, "TC", true), nil
	case "SS":
		return base(0xC7, "SS", true), nil
	case "SC":
		return base(0xC6, "SC", true), nil
	case "CS":
		return base(0xC3, "CS", true), nil
	case "CC":
		return base(0xC4, "CC", true), nil
	case "TN":
		return base(0xC2, "TN", false), nil
	case "CN":
		return base(0xC5, "CN", false), nil
	case "SN":
		return base(0xC8, "SN", false), nil
	case "S":
		return base(0x98, "S", true), nil
	default:
		return nil, fmt.Errorf("unsupported device area: %s", area)
	}
}

func (a *MCAddress) readIsBit() bool {
	if a.BitOffset >= 0 && !a.IsBit {
		return false
	}
	return a.IsBit
}

func (a *MCAddress) readOffset() int {
	if a.BitOffset >= 0 && !a.IsBit {
		return a.Offset
	}
	return a.Offset
}

func (a *MCAddress) groupKey() string {
	return fmt.Sprintf("%02X:%t", a.DeviceCode, a.readIsBit())
}
