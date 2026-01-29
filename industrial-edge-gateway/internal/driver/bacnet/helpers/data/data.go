package data

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func ToBitString(d btypes.PropertyData) (ok bool, out *btypes.BitString) {
	out, ok = d.Object.Properties[0].Data.(*btypes.BitString)

	if !ok {
		fmt.Println("unable to get object list")
		return ok, out
	}
	return
}

func ToArr(d btypes.PropertyData) (ok bool, out []interface{}) {
	out, ok = d.Object.Properties[0].Data.([]interface{})
	if !ok {
		fmt.Println("unable to get object list")
		return ok, out
	}
	return
}

func ToInt(d btypes.PropertyData) (ok bool, out int) {
	if len(d.Object.Properties) == 0 {
		fmt.Println("No value returned")
		return ok, out
	}
	out, ok = d.Object.Properties[0].Data.(int)
	return ok, out
}

func ToFloat32(d btypes.PropertyData) (ok bool, out float32) {
	if len(d.Object.Properties) == 0 {
		fmt.Println("No value returned")
		return ok, out
	}
	out, ok = d.Object.Properties[0].Data.(float32)
	return ok, out
}

func ToFloat64(d btypes.PropertyData) (ok bool, out float64) {
	if len(d.Object.Properties) == 0 {
		fmt.Println("No value returned")
		return ok, out
	}
	out, ok = d.Object.Properties[0].Data.(float64)
	return ok, out
}

func ToBool(d btypes.PropertyData) (ok bool, out bool) {
	if len(d.Object.Properties) == 0 {
		fmt.Println("No value returned")
		return ok, out
	}
	out, ok = d.Object.Properties[0].Data.(bool)
	return ok, out
}

func ToStr(d btypes.PropertyData) (ok bool, out string) {
	if len(d.Object.Properties) == 0 {
		fmt.Println("No value returned")
		return ok, out
	}
	out, ok = d.Object.Properties[0].Data.(string)
	return ok, out
}

func ToUint32(d btypes.PropertyData) (ok bool, out uint32) {
	if len(d.Object.Properties) == 0 {
		fmt.Println("No value returned")
		return ok, out
	}
	out, ok = d.Object.Properties[0].Data.(uint32)
	return ok, out
}
