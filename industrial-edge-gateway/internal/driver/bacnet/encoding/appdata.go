package encoding

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/null"
)

const (
	tagNull            uint8 = 0
	tagBool            uint8 = 1
	tagUint            uint8 = 2
	tagInt             uint8 = 3
	tagReal            uint8 = 4
	tagDouble          uint8 = 5
	tagOctetString     uint8 = 6
	tagCharacterString uint8 = 7
	tagBitString       uint8 = 8
	tagEnumerated      uint8 = 9
	tagDate            uint8 = 10
	tagTime            uint8 = 11
	tagObjectID        uint8 = 12
	tagReserve1        uint8 = 13
	tagReserve2        uint8 = 14
	tagReserve3        uint8 = 15
	maxTag             uint8 = 16
)

// Other values omitted here can have variable length
const (
	realLen     uint32 = 4
	doubleLen   uint32 = 8
	dateLen     uint32 = 4
	timeLen     uint32 = 4
	objectIDLen uint32 = 4
)

// All app layer is non-context specific
const appLayerContext = false

func (e *Encoder) boolean(x bool) {
	// Boolean information is stored into the length field
	var length uint32
	if x {
		length = 1
	} else {
		length = 0
	}
	e.tag(tagInfo{ID: tagBool, Context: appLayerContext, Value: length})
}

func (e *Encoder) real(x float32) {
	e.write(x)
}

func (d *Decoder) real(x *float32) {
	d.decode(x)
}

func (e *Encoder) double(x float64) {
	e.write(x)
}

func (d *Decoder) double(x *float64) {
	d.decode(x)
}

func (e *Encoder) AppData(i interface{}, typeBVBO bool) error {
	//if null used for sending null on point write to prop 87
	switch i.(type) {
	case null.Null:
		e.tag(tagInfo{ID: tagNull, Context: appLayerContext})
		return nil
	}
	//if point type is a BO or BV then set the type to type enum (data type 9)
	if typeBVBO {
		var val uint32
		var valid bool

		switch v := i.(type) {
		case uint32:
			val = v
			valid = true
		case float32:
			val = uint32(v)
			valid = true
		case float64:
			val = uint32(v)
			valid = true
		case bool:
			if v {
				val = 1
			} else {
				val = 0
			}
			valid = true
		case int:
			val = uint32(v)
			valid = true
		}

		if valid {
			length := valueLength(val)
			e.tag(tagInfo{ID: tagEnumerated, Context: appLayerContext, Value: uint32(length)})
			e.enumerated(val)
			return nil
		} else {
			err := fmt.Errorf("error in type convertion for boolean output or boolean value %T", i)
			// Set global error
			e.err = err
			return err
		}
	}
	switch val := i.(type) {
	case float32:
		e.tag(tagInfo{ID: tagReal, Context: appLayerContext, Value: realLen})
		e.real(val)
	case float64:
		e.tag(tagInfo{ID: tagDouble, Context: appLayerContext, Value: realLen})
		e.double(val)
	case bool:
		e.boolean(val)
	case string:
		// Add 1 to length to account for the encoding byte
		e.tag(tagInfo{ID: tagCharacterString, Context: appLayerContext, Value: uint32(len(val) + 1)})
		e.string(val)
	case uint32:
		length := valueLength(val)
		e.tag(tagInfo{ID: tagUint, Context: appLayerContext, Value: uint32(length)})
		e.unsigned(val)
	case int32:
		v := uint32(val)
		length := valueLength(v)
		e.tag(tagInfo{ID: tagInt, Context: appLayerContext, Value: uint32(length)})
		e.unsigned(v)
	// Enumerated is pretty much a wrapper for a uint32 with an enumerated associated with it.
	case btypes.Enumerated:
		v := uint32(val)
		length := valueLength(v)
		e.tag(tagInfo{ID: tagEnumerated, Context: appLayerContext, Value: uint32(length)})
		e.enumerated(v)
	case btypes.ObjectID:
		e.tag(tagInfo{ID: tagObjectID, Context: appLayerContext, Value: objectIDLen})
		e.objectId(val.Type, val.Instance)
	case null.Null:
		e.tag(tagInfo{ID: tagNull, Context: appLayerContext})
	default:
		err := fmt.Errorf("Unknown type %T", i)
		// Set global error
		e.err = err
		return err
	}
	return nil
}

func (d *Decoder) AppDataOfTag(tag uint8, len int) (interface{}, error) {
	switch tag {
	case tagNull:
		return null.Null{}, nil
	case tagBool:
		// Originally this was in C so non 0 values are considered
		// true
		return len > 0, d.Error()
	case tagUint:
		return d.unsigned(len), d.Error()
	case tagInt:
		return d.signed(len), d.Error()
	case tagReal:
		var x float32
		d.real(&x)
		return x, d.Error()
	case tagDouble:
		var x float64
		d.double(&x)
		return x, d.Error()
	case tagOctetString:
		var b []byte
		d.octetstring(&b, len)
		return b, d.Error()

	case tagCharacterString:
		var s string
		// Subtract 1 to length to account for the encoding byte
		err := d.string(&s, len-1)
		return s, err
	case tagBitString:
		return d.bitString(len), d.Error()
	case tagEnumerated:
		return d.enumerated(len), d.Error()
	case tagDate:
		var date btypes.Date
		d.date(&date, len)
		return date, d.Error()
	case tagTime:
		var t btypes.Time
		d.time(&t, len)
		return t, d.Error()
	case tagObjectID:
		objType, objInstance := d.objectId()
		return btypes.ObjectID{
			Type:     btypes.ObjectType(objType),
			Instance: objInstance,
		}, d.Error()
	default:
		return nil, fmt.Errorf("Unsupported tag: %d", tag)
	}
}
func (d *Decoder) AppData() (interface{}, error) {
	tag, _, lenvalue := d.tagNumberAndValue()
	return d.AppDataOfTag(tag, int(lenvalue))
}
