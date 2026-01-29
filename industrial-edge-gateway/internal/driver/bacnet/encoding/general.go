package encoding

// valueLength caclulates how large the necessary value needs to be to fit in the appropriate
// packet length
func valueLength(value uint32) int {
	/* length of enumerated is variable, as per 20.2.11 */
	if value < 0x100 {
		return size8
	} else if value < 0x10000 {
		return size16
	} else if value < 0x1000000 {
		return size24
	}
	return size32
}

/* from clause 20.2.1.3.2 Constructed Data */
/* true if the tag is an opening tag */
func isOpeningTag(x uint8) bool {
	return ((x & 0x07) == 6)
}

/* from clause 20.2.1.3.2 Constructed Data */
/* true if the tag is a closing tag */
func isClosingTag(x uint8) bool {
	return ((x & 0x07) == 7)
}

type tagMeta uint8

const tagMask tagMeta = 7
const openingMask tagMeta = 6
const closingMask tagMeta = 7

const extendValueBits tagMeta = 5

const contextSpecificBit = 0x08

func (t *tagMeta) setClosing() {
	t.setContextSpecific()
	*t = *t | tagMeta(closingMask)
}

func (t *tagMeta) isClosing() bool {
	return ((*t & closingMask) == closingMask)
}

func (t *tagMeta) setOpening() {
	t.setContextSpecific()
	*t = *t | tagMeta(openingMask)
}

func (t *tagMeta) isOpening() bool {
	return ((*t & openingMask) == openingMask)
}

func (t *tagMeta) Clear() {
	*t = 0
}

func (t *tagMeta) setContextSpecific() {
	*t = *t | contextSpecificBit
}

func (t *tagMeta) isContextSpecific() bool {
	return ((*t & contextSpecificBit) > 0)
}

func (t *tagMeta) isExtendedValue() bool {
	return (*t & tagMask) == extendValueBits
}
func (t *tagMeta) isExtendedTagNumber() bool {
	return ((*t & 0xF0) == 0xF0)
}

// setInfoMask takes an input in, and make a bit either 0, or 1 depending on the
// input boolean and mask
func setInfoMask(in byte, b bool, mask byte) byte {
	if b {
		return in | mask
	} else {
		var m byte = 0xFF
		m = m - mask
		return in & m
	}
}

/*
	from clause 20.1.2.4 max-segments-accepted and clause 20.1.2.5 max-APDU-length-accepted

returns the encoded octet
*/
func (e *Encoder) maxSegsMaxApdu(maxSegs uint, maxApdu uint) {
	x := encodeMaxSegsMaxApdu(maxSegs, maxApdu)
	e.write(x)
}

func encodeMaxSegsMaxApdu(maxSegs uint, maxApdu uint) uint8 {
	var octet uint8

	// 6 is chosen since 2^6 is 64 at which point we hit special cases
	var i uint
	for i = 0; i < 6; i++ {
		if maxSegs < 1<<(i+1) {
			octet = uint8(i << 4)
			break
		}
	}

	if maxSegs == 64 {
		octet = 0x60
	} else if maxSegs > 64 {
		octet = 0x70
	}

	/* max_apdu must be 50 octets minimum */
	if maxApdu <= 50 {
		octet |= 0x00
	} else if maxApdu <= 128 {
		octet |= 0x01
		/*fits in a LonTalk frame */
	} else if maxApdu <= 206 {
		octet |= 0x02
		/*fits in an ARCNET or MS/TP frame */
	} else if maxApdu <= 480 {
		octet |= 0x03
	} else if maxApdu <= 1024 {
		octet |= 0x04
		/* fits in an ISO 8802-3 frame */
	} else if maxApdu <= 1476 {
		octet |= 0x05
	}
	return octet
}

func (d *Decoder) maxSegsMaxApdu() (maxSegs uint, maxApdu uint) {
	var b uint8
	d.decode(&b)
	return decodeMaxSegs(b), decodeMaxApdu(b)
}

func decodeMaxApdu(a uint8) uint {
	switch s := a & 0x0F; s {
	case 0:
		return 50
	case 1:
		return 128
	case 2:
		return 206
	case 3:
		return 480
	case 4:
		return 1024
	case 5:
		return 1476
	default:
		return 0
	}
}

func decodeMaxSegs(a uint8) uint {
	a = a >> 4
	// Special case
	if a >= 0x07 {
		return 65
	}
	return 1 << (a)
}

func byteReverseBits(c byte) byte {
	c = (c&0xaa)>>1 | (c&0x55)<<1
	c = (c&0xcc)>>2 | (c&0x33)<<2
	c = (c&0xf0)>>4 | (c&0x0f)<<4
	return c
}
