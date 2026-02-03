package bacnet

import (
	"context"
	"fmt"
	"log"
	"time"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/encoding"
)

const maxReattempt = 2

// ReadMultiProperty uses the given device and read property request to read
// from a device. Along with being able to read multiple properties from a
// device, it can also read these properties from multiple objects. This is a
// good feature to read all present values of every object in the device. This
// is a batch operation compared to a ReadProperty and should be used in place
// when reading more than two objects/properties.
func (c *client) ReadMultiProperty(device btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	var out btypes.MultiplePropertyData

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	id, err := c.tsm.ID(ctx)
	if err != nil {
		return out, fmt.Errorf("unable to get transaction id: %v", err)
	}
	defer c.tsm.Put(id)
	device.Addr.SetLength()
	err = device.CheckADPU()
	if err != nil {
		return btypes.MultiplePropertyData{}, err
	}

	npdu := &btypes.NPDU{
		Version:               btypes.ProtocolVersion,
		Destination:           &device.Addr,
		Source:                c.dataLink.GetMyAddress(),
		IsNetworkLayerMessage: false,
		ExpectingReply:        true,
		Priority:              btypes.Normal,
		HopCount:              btypes.DefaultHopCount,
	}

	enc := encoding.NewEncoder()
	enc.NPDU(npdu)
	err = enc.ReadMultipleProperty(uint8(id), rp)
	if enc.Error() != nil || err != nil {
		return out, fmt.Errorf("encoding read multiple property failed: %v", err)
	}

	pack := enc.Bytes()
	if device.MaxApdu < uint32(len(pack)) {
		return out, fmt.Errorf("read multiple property is too large (max: %d given: %d)", device.MaxApdu, len(pack))
	}
	// the value filled doesn't matter. it just needs to be non nil
	err = fmt.Errorf("go")

	for count := 0; err != nil && count < maxReattempt; count++ {
		out, err = c.sendReadMultipleProperty(id, device, npdu, pack)
		if err == nil {
			return out, nil
		}
	}
	return out, fmt.Errorf("failed %d tries: %v", maxReattempt, err)
}

func (c *client) sendReadMultipleProperty(id int, dev btypes.Device, npdu *btypes.NPDU, request []byte) (btypes.MultiplePropertyData, error) {
	var out btypes.MultiplePropertyData
	_, err := c.Send(dev.Addr, npdu, request, nil)
	if err != nil {
		return out, err
	}

	raw, err := c.tsm.Receive(id, time.Duration(10)*time.Second)
	if err != nil {
		return out, fmt.Errorf("unable to receive id %d: %v", id, err)
	}

	var b []byte
	switch v := raw.(type) {
	case error:
		return out, v
	case []byte:
		b = v
	default:
		return out, fmt.Errorf("received unknown datatype %T", raw)
	}

	dec := encoding.NewDecoder(b)

	var apdu btypes.APDU
	if err = dec.APDU(&apdu); err != nil {
		return out, err
	}
	if apdu.Error.Class != 0 || apdu.Error.Code != 0 {
		err = fmt.Errorf("received error, class: %d, code: %d", apdu.Error.Class, apdu.Error.Code)
		return out, err
	}
	err = dec.ReadMultiplePropertyAck(&out)
	if err != nil {
		log.Printf("[DEBUG] WEIRD PACKET: %v: %v", err, b)
		return out, err
	}
	return out, err
}
