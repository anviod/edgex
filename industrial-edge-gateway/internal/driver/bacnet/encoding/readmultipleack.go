package encoding

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func (e *Encoder) ReadMultiplePropertyAck(invokeID uint8, data btypes.MultiplePropertyData) error {
	a := btypes.APDU{
		DataType: btypes.ComplexAck,
		Service:  btypes.ServiceConfirmedReadPropMultiple,
		InvokeId: invokeID,
	}
	e.APDU(a)
	err := e.objectsWithData(data.Objects)
	if err != nil {
		return err
	}

	return e.Error()
}

func (e *Encoder) objectsWithData(objects []btypes.Object) error {
	var tag uint8
	for _, obj := range objects {
		tag = 0
		e.contextObjectID(tag, obj.ID.Type, obj.ID.Instance)
		// Tag 1 - Opening Tag
		tag = 1
		e.openingTag(tag)

		e.propertiesWithData(obj.Properties)

		// Tag 1 - Closing Tag
		e.closingTag(tag)
	}
	return nil
}

func (e *Encoder) propertiesWithData(properties []btypes.Property) error {
	var tag uint8
	for _, prop := range properties {
		// Tag 2 - Property ID
		tag = 2
		e.contextEnumerated(tag, uint32(prop.Type))

		// Tag 3 (OPTIONAL) - Array Length
		tag++
		if prop.ArrayIndex != ArrayAll {
			e.contextUnsigned(tag, prop.ArrayIndex)
		}

		// Tag 4 Opening Tag
		tag++
		openedTag := tag
		e.openingTag(openedTag)
		e.write(prop.Data)
		e.closingTag(openedTag)

		e.write(prop.Data)
	}
	return e.Error()
}

func (d *Decoder) ReadMultiplePropertyAck(data *btypes.MultiplePropertyData) error {
	err := d.objectsWithData(&data.Objects)
	if err != nil {
		d.err = err
	}
	return d.Error()
}

func (d *Decoder) bacError(errorClass, errorCode *uint32) error {
	data, err := d.AppData()
	if err != nil {
		return err
	}
	switch val := data.(type) {
	case uint32:
		*errorClass = val
	default:
		return fmt.Errorf("receive bacnet error of unknown type")
	}

	data, err = d.AppData()
	if err != nil {
		return err
	}
	switch val := data.(type) {
	case uint32:
		*errorCode = val
	default:
		return fmt.Errorf("receive bacnet error of unknown type")
	}
	return nil
}

func (d *Decoder) objectsWithData(objects *[]btypes.Object) error {
	obj := btypes.Object{}
	for d.Error() == nil && d.len() > 0 {
		obj.Properties = []btypes.Property{}

		// Tag 0 - Object ID
		tag, meta, length := d.tagNumberAndValue()
		if tag != 0 {
			return &ErrorIncorrectTag{Expected: 0, Given: tag}
		} else if !meta.isContextSpecific() {
			return &ErrorWrongTagType{ContextTag}
		}
		obj.ID.Type, obj.ID.Instance = d.objectId()

		// Tag 1 - Opening Tag
		tag, meta = d.tagNumber()
		if tag != 1 {
			return &ErrorIncorrectTag{Expected: 1, Given: tag}
		} else if !meta.isOpening() {
			return &ErrorWrongTagType{OpeningTag}
		}

		// Tag 2 - Property Tag
		tag, meta, length = d.tagNumberAndValue()
		if tag != 2 {
			return &ErrorIncorrectTag{Expected: 2, Given: tag}
		}

		for d.len() > 0 && tag == 2 && !meta.isClosing() {
			if !meta.isContextSpecific() {
				return &ErrorWrongTagType{ContextTag}
			}

			prop := btypes.Property{}
			prop.Type = btypes.PropertyType(d.enumerated(int(length)))

			// Tag 3 - (Optional) Array Length
			tag, meta = d.tagNumber()
			if tag == 2 {
				continue
			} else if tag == 3 {
				if !meta.isContextSpecific() {
					return &ErrorWrongTagType{ContextTag}
				}
				length = d.value(meta)
				prop.ArrayIndex = d.unsigned(int(length))
				// Move to the next tag
				tag, meta = d.tagNumber()
			} else {
				prop.ArrayIndex = ArrayAll
			}

			// Tag 4 - Opening Tag
			if tag == 4 && meta.isOpening() {
				var array []interface{}
				tag, meta = d.tagNumber()
				if d.err != nil {
					return d.err
				}
				for {
					if meta.isContextSpecific() {
						if meta.isClosing() {
							_ = d.UnreadByte()
						} else if meta.isOpening() {
							if /*prop.Type == btypes.PROP_EVENT_TIME_STAMPS &&*/ tag == btypes.TimeStampDatetime {
								dt := &btypes.DataTime{}
								for {
									tag, meta, length = d.tagNumberAndValue()
									if meta.isClosing() && tag == btypes.TimeStampDatetime {
										break
									} else if tag == tagDate {
										d.date(&dt.Date, int(length))
									} else if tag == tagTime {
										d.time(&dt.Time, int(length))
									} else if length > 0 {
										d.Skip(length)
									}
								}
								array = append(array, dt)
							}
						} else {
							// TODO how to parse it in Context???
							*objects = append(*objects, obj)
							//return nil

							lenValue := d.value(meta)
							tag = tagTypeInContext(prop.Type, tag)
							if tag == maxTag {
								//skip unknown type
								if lenValue > 0 {
									if _, err := d.Read(make([]byte, lenValue)); err != nil {
										return err
									}
								}
							} else {
								data, err := d.AppDataOfTag(tag, int(lenValue))
								if err != nil {
									return err
								}
								array = append(array, data)
							}
						}
					} else {
						data, err := d.AppDataOfTag(tag, int(d.value(meta)))
						if err != nil {
							return err
						}
						array = append(array, data)
					}
					tag, meta = d.tagNumber()
					if meta.isClosing() && tag == 4 { //tag 4
						//
						break
					} /*else {
						_ = d.UnreadByte()
					}*/
				}
				if len(array) == 1 {
					prop.Data = array[0]
				} else {
					prop.Data = array
				}
				obj.Properties = append(obj.Properties, prop)

				tag, meta, length = d.tagNumberAndValue()
			} else if tag == 5 && meta.isOpening() {
				//Tag 5 error
				var class, code uint32
				err := d.bacError(&class, &code)
				if err != nil {
					return err
				}
				tag, meta = d.tagNumber()
				if tag == 5 && meta.isClosing() {
					//
				}
				return fmt.Errorf("class %d code %d", class, code)
			} else {
				return &ErrorIncorrectTag{Expected: 4, Given: tag}
			}
		}

		*objects = append(*objects, obj)
	}
	return d.Error()
}
