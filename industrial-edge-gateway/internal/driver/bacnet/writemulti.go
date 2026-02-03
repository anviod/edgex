package bacnet

import (
	"context"
	"fmt"
	"time"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/encoding"
)

func (c *client) WriteMultiProperty(dev btypes.Device, wp btypes.MultiplePropertyData) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	id, err := c.tsm.ID(ctx)
	if err != nil {
		return fmt.Errorf("unable to get an transaction id: %v", err)
	}
	defer c.tsm.Put(id)

	npdu := &btypes.NPDU{
		Version:               btypes.ProtocolVersion,
		Destination:           &dev.Addr,
		Source:                c.dataLink.GetMyAddress(),
		IsNetworkLayerMessage: false,
		ExpectingReply:        true,
		Priority:              btypes.Normal,
		HopCount:              btypes.DefaultHopCount,
	}
	enc := encoding.NewEncoder()
	enc.NPDU(npdu)

	enc.WriteMultiProperty(uint8(id), wp)
	if enc.Error() != nil {
		return enc.Error()
	}

	pack := enc.Bytes()
	if dev.MaxApdu < uint32(len(pack)) {
		return fmt.Errorf("read multiple property is too large (max: %d given: %d)", dev.MaxApdu, len(pack))
	}

	// the value filled doesn't matter. it just needs to be non nil
	err = fmt.Errorf("go")

	for count := 0; err != nil && count < maxReattempt; count++ {
		err = c.sendWriteMultipleProperty(id, dev, npdu, pack)
		if err == nil {
			return nil
		}
	}
	return fmt.Errorf("failed %d tries: %v", maxReattempt, err)
}

func (c *client) sendWriteMultipleProperty(id int, dev btypes.Device, npdu *btypes.NPDU, request []byte) error {
	_, err := c.Send(dev.Addr, npdu, request, nil)
	if err != nil {
		return err
	}

	raw, err := c.tsm.Receive(id, time.Duration(5)*time.Second)
	if err != nil {
		return fmt.Errorf("unable to receive id %d: %v", id, err)
	}

	var b []byte
	switch v := raw.(type) {
	case error:
		return v
	case []byte:
		b = v
	default:
		return fmt.Errorf("received unknown datatype %T", raw)
	}

	dec := encoding.NewDecoder(b)

	var apdu btypes.APDU
	if err = dec.APDU(&apdu); err != nil {
		return err
	}
	if apdu.Error.Class != 0 || apdu.Error.Code != 0 {
		return fmt.Errorf("received error, class: %d, code: %d", apdu.Error.Class, apdu.Error.Code)
	}
	return nil
}
