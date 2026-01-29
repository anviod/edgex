package encoding

import "industrial-edge-gateway/internal/driver/bacnet/btypes"

// WriteMultiProperty encodes a writes property request
func (e *Encoder) WriteMultiProperty(invokeID uint8, data btypes.MultiplePropertyData) error {
	a := btypes.APDU{
		DataType: btypes.ConfirmedServiceRequest,
		Service:  btypes.ServiceConfirmedWritePropMultiple,
		MaxSegs:  0,
		MaxApdu:  MaxAPDU,
		InvokeId: invokeID,
	}
	e.APDU(a)

	err := e.objects(data.Objects, true)
	if err != nil {
		return err
	}

	return e.Error()
}
