package priority

import (
	"reflect"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/helpers/data"
	"industrial-edge-gateway/internal/driver/bacnet/helpers/nils"
)

func BuildFloat32(in btypes.PropertyData, objType btypes.ObjectType) (pri *Float32) {
	pri = &Float32{}
	_, arr := data.ToArr(in)
	for i, value := range arr {
		var returnValue *float32
		typeOf := reflect.TypeOf(value)
		if typeOf.Name() != "Null" {
			if objType == btypes.BinaryOutput || objType == btypes.BinaryValue { //convert from uint32
				f := value.(uint32)
				flt := float32(f)
				returnValue = nils.NewFloat32(flt)
			} else {
				f := value.(float32)
				returnValue = nils.NewFloat32(f)
			}
		}
		switch i {
		case 0:
			pri.P1 = returnValue
		case 1:
			pri.P2 = returnValue
		case 2:
			pri.P3 = returnValue
		case 3:
			pri.P4 = returnValue
		case 4:
			pri.P5 = returnValue
		case 5:
			pri.P6 = returnValue
		case 6:
			pri.P7 = returnValue
		case 7:
			pri.P8 = returnValue
		case 8:
			pri.P9 = returnValue
		case 9:
			pri.P10 = returnValue
		case 10:
			pri.P11 = returnValue
		case 11:
			pri.P12 = returnValue
		case 12:
			pri.P13 = returnValue
		case 13:
			pri.P14 = returnValue
		case 14:
			pri.P15 = returnValue
		case 15:
			pri.P16 = returnValue
		default:
		}
	}
	return
}

type Float32 struct {
	P1  *float32 `json:"_1"`
	P2  *float32 `json:"_2"`
	P3  *float32 `json:"_3"`
	P4  *float32 `json:"_4"`
	P5  *float32 `json:"_5"`
	P6  *float32 `json:"_6"`
	P7  *float32 `json:"_7"`
	P8  *float32 `json:"_8"`
	P9  *float32 `json:"_9"`
	P10 *float32 `json:"_10"`
	P11 *float32 `json:"_11"`
	P12 *float32 `json:"_12"`
	P13 *float32 `json:"_13"`
	P14 *float32 `json:"_14"`
	P15 *float32 `json:"_15"`
	P16 *float32 `json:"_16"`
}

func (p *Float32) HighestFloat32() *float32 {
	if p.P1 != nil {
		return p.P1
	}
	if p.P2 != nil {
		return p.P2
	}
	if p.P3 != nil {
		return p.P3
	}
	if p.P4 != nil {
		return p.P4
	}
	if p.P5 != nil {
		return p.P5
	}
	if p.P6 != nil {
		return p.P6
	}
	if p.P7 != nil {
		return p.P7
	}
	if p.P8 != nil {
		return p.P8
	}
	if p.P9 != nil {
		return p.P9
	}
	if p.P10 != nil {
		return p.P10
	}
	if p.P11 != nil {
		return p.P11
	}
	if p.P12 != nil {
		return p.P12
	}
	if p.P13 != nil {
		return p.P13
	}
	if p.P14 != nil {
		return p.P14
	}
	if p.P15 != nil {
		return p.P15
	}
	if p.P16 != nil {
		return p.P16
	}
	return nil
}
