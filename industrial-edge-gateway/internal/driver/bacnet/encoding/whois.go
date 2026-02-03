package encoding

import (
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func (e *Encoder) WhoIs(low, high int32) error {
	apdu := btypes.APDU{
		DataType:           btypes.UnconfirmedServiceRequest,
		UnconfirmedService: btypes.ServiceUnconfirmedWhoIs,
	}
	e.write(apdu.DataType)
	e.write(apdu.UnconfirmedService)

	// The range is optional. A scan for all objects is done when either low/high
	// are negative or when we are scanning above the max instance
	if low >= 0 && high >= 0 && low < btypes.MaxInstance && high <
		btypes.MaxInstance {
		// Tag 0
		e.contextUnsigned(0, uint32(low))

		// Tag 1
		e.contextUnsigned(1, uint32(high))
	}
	return e.Error()
}

func (d *Decoder) WhoIs(low, high *int32) error {
	// APDU read in a higher level
	if d.len() == 0 {
		*low = btypes.WhoIsAll
		*high = btypes.WhoIsAll
		return nil
	}
	// Tag 0 - Low Value
	var expectedTag uint8
	tag, _, value := d.tagNumberAndValue()
	if tag != expectedTag {
		return &ErrorIncorrectTag{Expected: expectedTag, Given: tag}
	}
	l := d.unsigned(int(value))
	*low = int32(l)

	// Tag 1 - High Value
	expectedTag = 1
	tag, _, value = d.tagNumberAndValue()
	if tag != expectedTag {
		return &ErrorIncorrectTag{Expected: expectedTag, Given: tag}
	}
	h := d.unsigned(int(value))
	*high = int32(h)

	return d.Error()
}
