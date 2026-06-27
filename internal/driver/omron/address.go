package omron

import (
	"fmt"
	"regexp"
	"strings"
)

var omronAddressRE = regexp.MustCompile(`^(?i)(CIO|A|W|H|D|P|F|EM\d*)(\d+)(\.\d+)?([HL]|\.\d+[HL]?)?$`)

// ParseOmronAddress validates Omron FINS address format.
// Address Format: AREA ADDRESS[.BIT][.LEN[H][L]]
func ParseOmronAddress(address string) error {
	address = strings.ToUpper(strings.TrimSpace(address))
	if !omronAddressRE.MatchString(address) {
		return fmt.Errorf("invalid omron fins address format")
	}
	return nil
}
