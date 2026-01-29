package encoding

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/bacerr"
)

func (e *Encoder) APDU(a btypes.APDU) error {
	meta := APDUMetadata(0)
	meta.setDataType(a.DataType)
	meta.setMoreFollows(a.MoreFollows)
	meta.setSegmentedMessage(a.SegmentedMessage)
	meta.setSegmentedAccepted(a.SegmentedResponseAccepted)
	e.write(meta)

	switch a.DataType {
	case btypes.ComplexAck:
		e.apduComplexAck(a)
	case btypes.UnconfirmedServiceRequest:
		e.apduUnconfirmed(a)
	case btypes.ConfirmedServiceRequest:
		e.apduConfirmed(a)
	case btypes.SegmentAck:
		return fmt.Errorf("decoded Segmented")
	case btypes.Error:
		return fmt.Errorf("decoded Error")
	case btypes.Reject:
		return fmt.Errorf("decoded Rejected")
	case btypes.Abort:
		return fmt.Errorf("decoded Aborted")
	default:
		return fmt.Errorf("unknown PDU type: %d", meta.DataType())
	}
	return nil
}

func (e *Encoder) apduConfirmed(a btypes.APDU) {
	e.maxSegsMaxApdu(a.MaxSegs, a.MaxApdu)
	e.write(a.InvokeId)
	if a.SegmentedMessage {
		e.write(a.Sequence)
		e.write(a.WindowNumber)
	}
	e.write(a.Service)
}

func (e *Encoder) apduUnconfirmed(a btypes.APDU) {
	e.write(a.UnconfirmedService)
}

func (e *Encoder) apduComplexAck(a btypes.APDU) {
	e.write(a.InvokeId)
	e.write(a.Service)
}

func (d *Decoder) APDU(a *btypes.APDU) error {
	var meta APDUMetadata
	d.decode(&meta)
	a.SegmentedMessage = meta.isSegmentedMessage()
	a.SegmentedResponseAccepted = meta.segmentedResponseAccepted()
	a.MoreFollows = meta.moreFollows()
	a.DataType = meta.DataType()

	switch a.DataType {
	case btypes.ComplexAck:
		return d.apduComplexAck(a)
	case btypes.SimpleAck:
		return d.apduSimpleAck(a)
	case btypes.UnconfirmedServiceRequest:
		return d.apduUnconfirmed(a)
	case btypes.ConfirmedServiceRequest:
		return d.apduConfirmed(a)
	case btypes.SegmentAck:
		return fmt.Errorf("Segmented")
	case btypes.Error:
		return d.apduError(a)
	case btypes.Reject:
		return fmt.Errorf("Rejected")
	case btypes.Abort:
		return fmt.Errorf("Aborted")
	default:
		return fmt.Errorf("Unknown PDU type:%d", a.DataType)
	}
}

//func (d *Decoder) apduError(a *btypes.APDU) error {
//	d.decode(&a.InvokeId)
//	d.decode(&a.Service)
//
//	_, meta := d.tagNumber()
//	if meta.isOpening() {
//		_, _, value := d.tagNumberAndValue()
//		a.Error.Class = d.unsigned(int(value))
//		_, _, value = d.tagNumberAndValue()
//		a.Error.Code = d.unsigned(int(value))
//		_, meta = d.tagNumber()
//		if !meta.isClosing() {
//			return &ErrorWrongTagType{ClosingTag}
//		}
//	} else {
//		_, _, value := d.tagNumberAndValue()
//		a.Error.Class = d.unsigned(int(value))
//		_, _, value = d.tagNumberAndValue()
//		a.Error.Code = d.unsigned(int(value))
//	}
//	return nil
//}

func (d *Decoder) apduError(a *btypes.APDU) error {
	d.decode(&a.InvokeId)
	d.decode(&a.Service)

	_, meta := d.tagNumber()
	if meta.isOpening() {
		_, _, value := d.tagNumberAndValue()
		a.Error.Class = bacerr.ErrorClass(d.unsigned(int(value)))
		_, _, value = d.tagNumberAndValue()
		a.Error.Code = bacerr.ErrorCode(d.unsigned(int(value)))
		_, meta = d.tagNumber()
		if !meta.isClosing() {
			return &ErrorWrongTagType{ClosingTag}
		}
	} else {
		_, m, _ := d.tagNumberAndValue()
		a.Error.Class = bacerr.ErrorClass(m)
		_, m, _ = d.tagNumberAndValue()
		a.Error.Code = bacerr.ErrorCode(m)
		//TODO was like this but didnt work need to test more (changed to but as above)
		//t, m, value := d.tagNumberAndValue()
		//a.Error.Class = d.unsigned(int(value))
		//t, m, value := d.tagNumberAndValue()
		//a.Error.Code = d.unsigned(int(value))

	}
	return nil
}

func (d *Decoder) apduComplexAck(a *btypes.APDU) error {
	d.decode(&a.InvokeId)
	d.decode(&a.Service)
	return d.Error()
}

func (d *Decoder) apduSimpleAck(a *btypes.APDU) error {
	d.decode(&a.InvokeId)
	d.decode(&a.Service)
	return d.Error()
}

func (d *Decoder) apduUnconfirmed(a *btypes.APDU) error {
	d.decode(&a.UnconfirmedService)
	a.RawData = make([]byte, d.len())
	d.decode(a.RawData)
	return d.Error()
}
func (d *Decoder) apduConfirmed(a *btypes.APDU) error {
	a.MaxSegs, a.MaxApdu = d.maxSegsMaxApdu()

	d.decode(&a.InvokeId)
	if a.SegmentedMessage {
		d.decode(&a.Sequence)
		d.decode(&a.WindowNumber)
	}

	d.decode(&a.Service)
	if d.len() > 0 {
		a.RawData = make([]byte, d.len())
		d.decode(&a.RawData)
	}

	return d.Error()
}

type APDUMetadata byte

const (
	apduMaskSegmented         = 1 << 3
	apduMaskMoreFollows       = 1 << 2
	apduMaskSegmentedAccepted = 1 << 1
	// Bit 0 is reserved
)

func (meta *APDUMetadata) setInfoMask(b bool, mask byte) {
	*meta = APDUMetadata(setInfoMask(byte(*meta), b, mask))
}

// CheckMask uses mask to check bit position
func (meta *APDUMetadata) checkMask(mask byte) bool {
	return (*meta & APDUMetadata(mask)) > 0
}

func (meta *APDUMetadata) isSegmentedMessage() bool {
	return meta.checkMask(apduMaskSegmented)
}

func (meta *APDUMetadata) moreFollows() bool {
	return meta.checkMask(apduMaskMoreFollows)
}

func (meta *APDUMetadata) segmentedResponseAccepted() bool {
	return meta.checkMask(apduMaskSegmentedAccepted)
}

func (meta *APDUMetadata) setSegmentedMessage(b bool) {
	meta.setInfoMask(b, apduMaskSegmented)
}

func (meta *APDUMetadata) setMoreFollows(b bool) {
	meta.setInfoMask(b, apduMaskMoreFollows)
}

func (meta *APDUMetadata) setSegmentedAccepted(b bool) {
	meta.setInfoMask(b, apduMaskSegmentedAccepted)
}

func (meta *APDUMetadata) setDataType(t btypes.PDUType) {
	// clean the first 4 bits
	*meta = (*meta & APDUMetadata(0xF0)) | APDUMetadata(t)
}
func (meta *APDUMetadata) DataType() btypes.PDUType {
	// clean the first 4 bits
	return btypes.PDUType(0xF0) & btypes.PDUType(*meta)
}
