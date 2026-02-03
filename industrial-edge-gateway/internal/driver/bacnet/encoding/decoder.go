package encoding

import (
	"bytes"
	"encoding/binary"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

// Decoder used
type Decoder struct {
	buff *bytes.Buffer
	err  error
}

func (d *Decoder) len() int {
	return d.buff.Len()
}
func NewDecoder(b []byte) *Decoder {
	return &Decoder{
		bytes.NewBuffer(b),
		nil,
	}
}

func (d *Decoder) Error() error {
	return d.err
}

func (d *Decoder) Bytes() []byte {
	return d.buff.Bytes()
}

func (d *Decoder) ReadByte() (byte, error) {
	return d.buff.ReadByte()
}

func (d *Decoder) Read(data []byte) (int, error) {
	return d.buff.Read(data)
}

func (d *Decoder) Skip(n uint32) error {
	_, d.err = d.buff.Read(make([]byte, n))
	return d.err
}

func (d *Decoder) UnreadByte() error {
	return d.buff.UnreadByte()
}

func (d *Decoder) decode(data interface{}) {
	// Only decode if there have been no errors so far
	if d.err != nil {
		return
	}
	d.err = binary.Read(d.buff, EncodingEndian, data)
}

// contexTag decoder

// Returns both a tag and additional metadata stored in this byte. If it is of
// extended type, then that means that the entire first byte is metadata, else
// the firrst 4 bytes store the tag
func (d *Decoder) tagNumber() (tag uint8, meta tagMeta) {
	// Read the first value
	d.decode(&meta)
	if meta.isExtendedTagNumber() {
		d.decode(&tag)
		return tag, meta
	}
	return uint8(meta) >> 4, meta
}

func (d *Decoder) value(meta tagMeta) (value uint32) {
	if meta.isExtendedValue() {
		var val uint8
		d.decode(&val)
		// Tagged as an uint32
		if val == flag32bit {
			var parse uint32
			d.decode(&parse)
			return parse

			// Tagged as a uint16
		} else if val == flag16bit {
			var parse uint16
			d.decode(&parse)
			return uint32(parse)

			// No tag, it must be a uint8
		} else {
			return uint32(val)
		}
	} else if meta.isOpening() || meta.isClosing() {
		return 0
	}
	return uint32(meta & 0x07)
}
func (d *Decoder) tagNumberAndValue() (tag uint8, meta tagMeta, value uint32) {
	tag, meta = d.tagNumber()
	// It must be a non extended/small value
	// Note this is a mask of the last 3 bits
	return tag, meta, d.value(meta)
}

func (d *Decoder) objectId() (objectType btypes.ObjectType, instance btypes.ObjectInstance) {
	var value uint32
	d.decode(&value)
	objectType = btypes.ObjectType((value >> InstanceBits) & MaxObject)
	instance = btypes.ObjectInstance(value & MaxInstance)
	return
}

func (d *Decoder) enumerated(len int) uint32 {
	return d.unsigned(len)
}

func (d *Decoder) unsigned24() uint32 {
	var a, b, c uint8
	d.decode(&a)
	d.decode(&b)
	d.decode(&c)

	var x uint32
	x = uint32((uint32(a) << 16) & 0x00ff0000)
	x |= uint32((uint32(b) << 8) & 0x0000ff00)
	x |= uint32(uint32(c) & 0x000000ff)
	return x
}

func (d *Decoder) unsigned(length int) uint32 {
	switch length {
	case size8: //1
		var val uint8
		d.decode(&val)
		return uint32(val)
	case size16: //2
		var val uint16
		d.decode(&val)
		return uint32(val)
	case size24: //3
		return d.unsigned24()
	case size32: //4
		var val uint32
		d.decode(&val)
		return val
	default:
		return 0
	}
}

func (d *Decoder) signed24() int32 {
	var a, b, c int8
	d.decode(&a)
	d.decode(&b)
	d.decode(&c)

	var x int32
	x = int32((int32(a) << 16) & 0x00ff0000)
	x |= int32((int32(b) << 8) & 0x0000ff00)
	x |= int32(int32(c) & 0x000000ff)
	return x
}

func (d *Decoder) signed(length int) int32 {
	switch length {
	case size8:
		var val int8
		d.decode(&val)
		return int32(val)
	case size16:
		var val int16
		d.decode(&val)
		return int32(val)
	case size24:
		return d.signed24()
	case size32:
		var val int32
		d.decode(&val)
		return val
	default:
		return 0
	}
}

func (d *Decoder) bitString(length int) *btypes.BitString {
	if length <= 0 {
		return nil
	}
	data := make([]uint8, length)
	d.decode(data)
	//refer to  https://github.com/bacnet-stack/bacnet-stack/blob/bacnet-stack-0.9.1/src/bacdcode.c#L672
	bs := btypes.NewBitString(length - 1)
	/* the lower 3 bits of the first byte contains the unused bits in the remain bytes and the remain bytes contain the bit masks*/
	bytesUsed := uint8(length - 1)
	if bytesUsed <= btypes.MaxBitStringBytes {
		for i := uint8(0); i < bytesUsed; i++ {
			//index of data start from 1
			bs.SetByte(i, byteReverseBits(data[i+1]))
		}
		/*the lower 3 bits of the first byte store the number of unused bits , that is, less than 8*/
		bs.SetBitsUsed(bytesUsed, data[0]&0x07)
	}
	return bs
}
