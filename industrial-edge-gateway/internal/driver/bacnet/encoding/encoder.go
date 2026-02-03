package encoding

import (
	"bytes"
	"encoding/binary"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

var EncodingEndian binary.ByteOrder = binary.BigEndian

type Encoder struct {
	buff *bytes.Buffer
	err  error
}

func NewEncoder() *Encoder {
	e := Encoder{
		buff: new(bytes.Buffer),
		err:  nil,
	}
	return &e
}

func (e *Encoder) Error() error {
	return e.err
}

func (e *Encoder) Bytes() []byte {
	return e.buff.Bytes()
}

func (e *Encoder) write(p interface{}) {
	if e.err != nil {
		return
	}
	e.err = binary.Write(e.buff, EncodingEndian, p)
}

func (e *Encoder) contextObjectID(tagNum uint8, objectType btypes.ObjectType, instance btypes.ObjectInstance) {
	/* length of object id is 4 octets, as per 20.2.14 */
	e.tag(tagInfo{ID: tagNum, Context: true, Value: 4})
	e.objectId(objectType, instance)
}

// Write opening tag to the system
func (e *Encoder) openingTag(num uint8) {
	var meta tagMeta
	meta.setOpening()
	e.tagNum(meta, num)
}

func (e *Encoder) closingTag(num uint8) {
	var meta tagMeta
	meta.setClosing()
	e.tagNum(meta, num)
}

// tagNum pre-tags
func (e *Encoder) tagNum(meta tagMeta, num uint8) {
	t := uint8(meta)
	if num <= 14 {
		t |= num << 4
		e.write(t)
		// We don't have enough space so make it in a new byte
	} else {
		t |= 0xF0
		e.write(t)
		e.write(num)
	}
}

func (e *Encoder) tag(tg tagInfo) {
	var t uint8
	var meta tagMeta
	if tg.Context {
		meta.setContextSpecific()
	}
	if tg.Opening {
		meta.setOpening()
	}
	if tg.Closing {
		meta.setClosing()
	}

	t = uint8(meta)
	if tg.Value <= 4 {
		t |= uint8(tg.Value)
	} else {
		t |= 5
	}

	// We have enough room to put it with the last value
	if tg.ID <= 14 {
		t |= tg.ID << 4
		e.write(t)

		// We don't have enough space so make it in a new byte
	} else {
		t |= 0xF0
		e.write(t)
		e.write(tg.ID)
	}
	if tg.Value > 4 {
		// Depending on the length, we will either write it as an 8 bit, 32 bit, or 64-bit integer
		if tg.Value <= 253 {
			e.write(uint8(tg.Value))
		} else if tg.Value <= 65535 {
			e.write(flag16bit)
			e.write(uint16(tg.Value))
		} else {
			e.write(flag32bit)
			e.write(tg.Value)
		}
	}
}

/*
	from clause 20.2.14 Encoding of an Object Identifier Value

returns the number of apdu bytes consumed
*/
func (e *Encoder) objectId(objectType btypes.ObjectType, instance btypes.ObjectInstance) {
	var value uint32
	value = ((uint32(objectType) & MaxObject) << InstanceBits) | (uint32(instance) & MaxInstance)
	e.write(value)
}

func (e *Encoder) contextEnumerated(tagNumber uint8, value uint32) {
	e.contextUnsigned(tagNumber, value)
}

func (e *Encoder) contextUnsigned(tagNumber uint8, value uint32) {
	e.tag(tagInfo{ID: tagNumber, Context: true, Value: uint32(valueLength(value))})
	e.unsigned(value)
}

func (e *Encoder) enumerated(value uint32) {
	e.unsigned(value)
}

// weird, huh?
func (e *Encoder) unsigned24(value uint32) {
	e.write(uint8((value & 0xFF0000) >> 16))
	e.write(uint8((value & 0x00FF00) >> 8))
	e.write(uint8(value & 0x0000FF))

}

func (e *Encoder) unsigned(value uint32) {
	if value < 0x100 {
		e.write(uint8(value))
	} else if value < 0x10000 {
		e.write(uint16(value))
	} else if value < 0x1000000 {
		// Really!? 24 bits?
		e.unsigned24(value)
	} else {
		e.write(value)
	}
}

func (e *Encoder) objects(objects []btypes.Object, write bool) error {
	var tag uint8
	for _, obj := range objects {
		tag = 0
		e.contextObjectID(tag, obj.ID.Type, obj.ID.Instance)
		// Tag 1 - Opening Tag
		tag = 1
		e.openingTag(tag)
		e.properties(obj.Properties, write)
		// Tag 1 - Closing Tag
		e.closingTag(tag)
	}
	return nil
}

func (e *Encoder) properties(properties []btypes.Property, write bool) error {
	// for each property
	var tag uint8
	for _, prop := range properties {
		// Tag 0 - Property ID
		tag = 0
		e.contextEnumerated(tag, uint32(prop.Type))

		// Tag 1 (OPTIONAL) - Array Length
		if prop.ArrayIndex != ArrayAll {
			tag = 1
			e.contextUnsigned(tag, prop.ArrayIndex)
		}

		if write {
			// Tag 2 - Opening Tag
			tag = 2
			e.openingTag(tag)
			e.AppData(prop.Data, false)
			// Tag 2 - Closing Tag
			e.closingTag(tag)
			if prop.Priority != btypes.Normal {
				e.contextUnsigned(tag, uint32(prop.Priority))
			}
		}
	}
	return nil
}
