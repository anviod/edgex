package encoding

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func (e *Encoder) readPropertyHeader(tagPos uint8, data *btypes.PropertyData) (uint8, error) {
	// Validate data first
	if err := isValidObjectType(data.Object.ID.Type); err != nil {
		return 0, err
	}
	if err := isValidPropertyType(uint32(data.Object.Properties[0].Type)); err != nil {
		return 0, err
	}

	// Tag - Object Type and Instance
	e.contextObjectID(tagPos, data.Object.ID.Type, data.Object.ID.Instance)
	tagPos++

	// Get first property
	prop := data.Object.Properties[0]
	e.contextEnumerated(tagPos, uint32(prop.Type))
	tagPos++

	// Optional Tag - Array Index
	if prop.ArrayIndex != ArrayAll {
		e.contextUnsigned(tagPos, prop.ArrayIndex)
	}
	tagPos++
	return tagPos, nil
}

// ReadProperty is a service request to read a property that is passed.
func (e *Encoder) ReadProperty(invokeID uint8, data btypes.PropertyData) error {
	// PDU Type
	a := btypes.APDU{
		DataType:         btypes.ConfirmedServiceRequest,
		Service:          btypes.ServiceConfirmedReadProperty,
		MaxSegs:          0,
		MaxApdu:          MaxAPDU,
		InvokeId:         invokeID,
		SegmentedMessage: false,
	}
	e.APDU(a)
	e.readPropertyHeader(initialTagPos, &data)
	return e.Error()
}

// ReadPropertyAck is the response made to a ReadProperty service request.
func (e *Encoder) ReadPropertyAck(invokeID uint8, data btypes.PropertyData) error {
	if len(data.Object.Properties) != 1 {
		return fmt.Errorf("Property length length must be 1 not %d", len(data.Object.Properties))
	}
	// PDU Type
	a := btypes.APDU{
		DataType: btypes.ComplexAck,
		Service:  btypes.ServiceConfirmedReadProperty,
		MaxSegs:  0,
		MaxApdu:  MaxAPDU,
		InvokeId: invokeID,
	}
	e.APDU(a)

	tagID, err := e.readPropertyHeader(initialTagPos, &data)
	if err != nil {
		return err
	}

	e.openingTag(tagID)
	tagID++
	prop := data.Object.Properties[0]
	e.AppData(prop.Data, false)
	e.closingTag(tagID)
	return e.Error()
}

func (d *Decoder) ReadProperty(data *btypes.PropertyData) error {
	// Must have at least 7 bytes
	if d.buff.Len() < 7 {
		return fmt.Errorf("Missing parameters")
	}

	// Tag 0: Object ID
	tag, meta := d.tagNumber()

	var expectedTag uint8
	if tag != expectedTag {
		return &ErrorIncorrectTag{expectedTag, tag}
	}
	expectedTag++

	var objectType btypes.ObjectType
	var instance btypes.ObjectInstance
	if !meta.isContextSpecific() {
		return fmt.Errorf("Tag %d should be context specific. %x", tag, meta)
	}
	objectType, instance = d.objectId()
	data.Object.ID.Type = objectType
	data.Object.ID.Instance = instance

	// Tag 1: Property ID
	tag, meta = d.tagNumber()
	if tag != expectedTag {
		return &ErrorIncorrectTag{expectedTag, tag}
	}
	expectedTag++

	lenValue := d.value(meta)

	var prop btypes.Property
	prop.Type = btypes.PropertyType(d.enumerated(int(lenValue)))

	if d.len() != 0 {
		tag, meta = d.tagNumber()
	}

	// Check to see if we still have bytes to read.
	if d.buff.Len() != 0 || tag >= 2 {
		// If we do then that means we are reading the optional argument,
		// arra length

		// Tag 2: Array Length (OPTIONAL)
		var lenValue uint32
		lenValue = d.value(meta)

		var openTag uint8
		// I tried to not use magic numbers but it doesn't look like it can be avoided
		// If the attag we receive is a tag of 2 then set the value
		if tag == 2 {
			prop.ArrayIndex = d.unsigned(int(lenValue))
			if d.len() > 0 {
				openTag, meta = d.tagNumber()
			}
		} else {
			openTag = tag
			prop.ArrayIndex = ArrayAll
		}

		if openTag == 3 {
			var err error
			// We subtract one to ignore the closing tag.
			datalist := make([]interface{}, 0)

			// There is a closing tag of size 1 byte that we ignore which is why we are
			// looping until the length is greater than 1
			for i := 0; d.buff.Len() > 1; i++ {
				data, err := d.AppData()
				if err != nil {
					d.err = err
					return err
				}
				datalist = append(datalist, data)
			}
			prop.Data = datalist

			// If we only have one value in the list, lets just return that value
			if len(datalist) == 1 {
				prop.Data = datalist[0]
			}
			if err != nil {
				d.err = err
				return err
			}
		}
	} else {
		prop.ArrayIndex = ArrayAll
	}

	// We now assemble all the values that we have read above
	data.Object.ID.Instance = instance
	data.Object.ID.Type = objectType
	data.Object.Properties = []btypes.Property{prop}

	return d.Error()
}
