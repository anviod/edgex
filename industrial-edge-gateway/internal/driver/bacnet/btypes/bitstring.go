package btypes

import "encoding/json"

const MaxBitStringBytes = 15

type BitString struct {
	BitUsed uint8  `json:"bit_used"`
	Value   []byte `json:"value"`
}

func NewBitString(bufferSize int) *BitString {
	if bufferSize > MaxBitStringBytes {
		bufferSize = MaxBitStringBytes
	}
	return &BitString{
		BitUsed: 0,
		Value:   make([]byte, bufferSize),
	}
}

func (bs *BitString) GetValue() []bool {
	value := make([]bool, bs.BitUsed)
	for i := uint8(0); i < bs.BitUsed; i++ {
		if bs.Bit(i) {
			value[i] = true
		} else {
			value[i] = false
		}
	}
	return value
}

func (bs *BitString) String() string {
	bin, _ := json.Marshal(bs.GetValue())
	return string(bin)
}

func (bs *BitString) SetBit(bitNumber uint8, value bool) {
	byteNumber := bitNumber / 8
	var bitMask uint8 = 1
	if byteNumber < MaxBitStringBytes {
		/* set max bits used */
		if bs.BitUsed < (bitNumber + 1) {
			bs.BitUsed = bitNumber + 1
		}
		bitMask = bitMask << (bitNumber - (byteNumber * 8))
		if value {
			bs.Value[byteNumber] |= bitMask
		} else {
			bs.Value[byteNumber] &= ^bitMask
		}
	}
}

func (bs *BitString) Bit(bitNumber uint8) bool {
	byteNumber := bitNumber / 8
	bitMask := uint8(1)
	if bitNumber < (MaxBitStringBytes * 8) {
		bitMask = bitMask << (bitNumber - (byteNumber * 8))
		return (bs.Value[byteNumber] & bitMask) != 0
	}
	return false
}

func (bs *BitString) GetBitUsed() uint8 {
	return bs.BitUsed
}

func (bs *BitString) BytesUsed() uint8 {
	if bs != nil && bs.BitUsed > 0 {
		return (bs.BitUsed-1)/8 + 1
	}
	return 0
}

func (bs *BitString) Byte(index uint8) byte {
	if bs != nil && index < MaxBitStringBytes {
		return bs.Value[index]
	}
	return 0
}

func (bs *BitString) SetByte(index uint8, value byte) bool {
	if bs != nil && index < MaxBitStringBytes {
		bs.Value[index] = value
		return true
	}
	return false
}

func (bs *BitString) SetBitsUsed(byteUsed uint8, bitsUnused uint8) bool {
	if bs != nil {
		bs.BitUsed = byteUsed*8 - bitsUnused
		return true
	}
	return false
}

func (bs *BitString) BitsCapacity() uint8 {
	if bs != nil {
		return uint8(len(bs.Value) * 8)
	}
	return 0
}
