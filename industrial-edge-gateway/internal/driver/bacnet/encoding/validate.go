package encoding

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func isValidObjectType(idType btypes.ObjectType) error {
	if idType > MaxObject {
		return fmt.Errorf("Object btypes is %d which must be less then %d", idType, MaxObject)
	}
	return nil
}

func isValidPropertyType(propType uint32) error {
	if propType > MaxPropertyID {
		return fmt.Errorf("Object btypes is %d which must be less then %d", propType, MaxPropertyID)
	}
	return nil
}
