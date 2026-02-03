package encoding

import (
	"encoding/binary"
	"fmt"
	"unicode/utf16"
)

type stringType uint8

// Supported String btypes
const (
	//https://github.com/stargieg/bacnet-stack/blob/master/include/bacenum.h#L1261
	stringUTF8    stringType = 0 //same as ANSI_X34
	characterUCS2 stringType = 4 //johnson controllers use this
)

func (e *Encoder) string(s string) {
	e.write(stringUTF8)
	e.write([]byte(s))
}

func decodeUCS2(s string) (string, error) {
	b := []byte(s)
	if len(b)%2 != 0 {
		return "", fmt.Errorf("invalid UCS-2 data length")
	}

	u16s := make([]uint16, len(b)/2)
	for i := 0; i < len(u16s); i++ {
		u16s[i] = binary.BigEndian.Uint16(b[i*2 : i*2+2])
	}

	return string(utf16.Decode(u16s)), nil
}

func (d *Decoder) string(s *string, len int) error {
	var t stringType
	d.decode(&t)
	switch t {
	case stringUTF8:
	case characterUCS2:
	default:
		return fmt.Errorf("unsupported string format %d", t)
	}
	b := make([]byte, len)
	d.decode(b)

	if t == characterUCS2 {
		out, err := decodeUCS2(string(b))
		if err != nil {
			return fmt.Errorf("unable to decode string format characterUCS2%d", t)
		}
		*s = out
	} else {
		*s = string(b)
	}

	return d.Error()

}

func (e *Encoder) octetstring(b []byte) {
	e.write([]byte(b))
}
func (d *Decoder) octetstring(b *[]byte, len int) {
	*b = make([]byte, len)
	d.decode(b)
}
