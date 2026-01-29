package encoding

import (
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

// WriteProperty encodes a write request
func (e *Encoder) WriteProperty(invokeID uint8, data btypes.PropertyData) error {
	a := btypes.APDU{
		DataType: btypes.ConfirmedServiceRequest,
		Service:  btypes.ServiceConfirmedWriteProperty,
		MaxSegs:  0,
		MaxApdu:  MaxAPDU,
		InvokeId: invokeID,
	}
	e.APDU(a)

	tagID, err := e.readPropertyHeader(0, &data)
	if err != nil {
		return err
	}

	prop := data.Object.Properties[0]

	if data.Object.ID.Type == 1 {

	}

	// Tag 3 - the value (unlike other values, this is just a raw byte array)
	e.openingTag(tagID)
	e.AppData(prop.Data, pointTypeBOBV(data))
	e.closingTag(tagID)
	tagID++
	// Tag 4 - Optional priority tag
	// Priority set
	if prop.Priority != btypes.Normal {
		e.contextUnsigned(tagID, uint32(prop.Priority))
	}
	return e.Error()
}

// pointTypeBOBV if point type is bv or bo then we need to set the data type to enum
func pointTypeBOBV(data btypes.PropertyData) (isBool bool) {
	pointType := data.Object.ID.Type
	property := 0
	if len(data.Object.Properties) > 0 {
		property = int(data.Object.Properties[0].Type)
	}
	if (pointType == btypes.TypeBinaryValue || pointType == btypes.TypeBinaryOutput) && property == 85 {
		return true
	}
	return
}
