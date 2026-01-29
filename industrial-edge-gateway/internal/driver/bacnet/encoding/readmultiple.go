package encoding

import (
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func (e *Encoder) ReadMultipleProperty(invokeID uint8, data btypes.MultiplePropertyData) error {
	a := btypes.APDU{
		DataType:         btypes.ConfirmedServiceRequest,
		Service:          btypes.ServiceConfirmedReadPropMultiple,
		MaxSegs:          0,
		MaxApdu:          MaxAPDU,
		InvokeId:         invokeID,
		SegmentedMessage: false,
	}
	e.APDU(a)
	err := e.objects(data.Objects, false)
	if err != nil {
		return err
	}

	return e.Error()
}
