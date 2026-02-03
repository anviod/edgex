package encoding

import (
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func (e *Encoder) IAm(id btypes.IAm) error {
	apdu := btypes.APDU{
		DataType:           btypes.UnconfirmedServiceRequest,
		UnconfirmedService: btypes.ServiceUnconfirmedIAm,
	}
	e.write(apdu.DataType)
	e.write(apdu.UnconfirmedService)

	e.AppData(id.ID, false)
	e.AppData(id.MaxApdu, false)
	e.AppData(id.Segmentation, false)
	e.AppData(id.Vendor, false)
	return e.Error()
}

func (d *Decoder) IAm(id *btypes.IAm) error {
	objID, err := d.AppData()
	if err != nil {
		return err
	}
	if i, ok := objID.(btypes.ObjectID); ok {
		id.ID = i
	}
	maxapdu, _ := d.AppData()
	if m, ok := maxapdu.(uint32); ok {
		id.MaxApdu = m
	}
	segmentation, _ := d.AppData()
	if m, ok := segmentation.(uint32); ok {
		id.Segmentation = btypes.Enumerated(m)
	}
	vendor, err := d.AppData()
	if v, ok := vendor.(uint32); ok {
		id.Vendor = v
	}
	return d.Error()
}
