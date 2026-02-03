package encoding

import (
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/ndpu"
)

//https://github.com/bacnet-stack/bacnet-stack/blob/master/src/bacnet/npdu.c#L391

// NPDU encodes the network layer control message
func (e *Encoder) NPDU(n *btypes.NPDU) {
	e.write(n.Version)

	// Prepare metadata into the second byte
	meta := NPDUMetadata(0)
	meta.SetNetworkLayerMessage(n.IsNetworkLayerMessage)
	meta.SetExpectingReply(n.ExpectingReply)
	meta.SetPriority(n.Priority)

	// Check to see if we have a net address. If so set destination true
	if n.Destination != nil {
		if n.Destination.Net != 0 {
			meta.SetDestination(true)
		}
	}

	// Repeat for source
	if n.Source != nil {
		if n.Source.Net != 0 {
			meta.SetSource(true)
		}
	}
	e.write(meta)
	if meta.HasDestination() {
		n.Destination.SetLength()
		e.write(n.Destination.Net)

		// Address
		e.write(n.Destination.Len)

		//qygeng:fix bug
		if n.Destination.Len == uint8(len(n.Destination.Adr)) {
			e.write(n.Destination.Adr)
		} else if n.Destination.Len == uint8(len(n.Destination.Mac)) {
			e.write(n.Destination.Mac[:4])
			e.write(n.Destination.Id)
		}
	}

	if meta.HasSource() {
		e.write(n.Source.Net)

		// Address
		e.write(n.Source.Len)
		e.write(n.Source.Adr)
	}

	// Hop count is after source
	if meta.HasDestination() {
		e.write(n.HopCount)
	}

	if meta.IsNetworkLayerMessage() {
		e.write(n.NetworkLayerMessageType)

		// If the network value is above 0x80, then it should have a vendor id
		if n.NetworkLayerMessageType >= 0x80 {
			e.write(n.VendorId)
		}
	}
}

func (d *Decoder) Address(a *btypes.Address) {
	d.decode(&a.Net) //decode the network address
	d.decode(&a.Len)
	// Make space for address
	a.Adr = make([]uint8, a.Len) //decode the device hardware mac addr
	d.decode(a.Adr)

}

type RouterToNetworkList struct {
	Source []btypes.Address
}

// NPDU encodes the network layer control message
func (d *Decoder) NPDU(n *btypes.NPDU) (addr []btypes.Address, err error) {
	d.decode(&n.Version)

	// Prepare metadata into the second byte
	meta := NPDUMetadata(0)
	d.decode(&meta)
	n.ExpectingReply = meta.ExpectingReply()
	n.IsNetworkLayerMessage = meta.IsNetworkLayerMessage()
	n.Priority = meta.Priority()

	if meta.HasDestination() {
		n.Destination = &btypes.Address{}
		d.Address(n.Destination)
	}

	if meta.HasSource() {
		n.Source = &btypes.Address{}
		d.Address(n.Source)
	}

	if meta.HasDestination() {
		d.decode(&n.HopCount)
	} else {
		n.HopCount = 0
	}

	if meta.IsNetworkLayerMessage() {
		d.decode(&n.NetworkLayerMessageType)
		if n.NetworkLayerMessageType > 0x80 {
			d.decode(&n.VendorId)
		}
		if n.NetworkLayerMessageType == ndpu.NetworkIs { //used for decoding a bacnet network number on a What-Is-Network-Number 0x12
			n.Source = &btypes.Address{}
			d.decode(&n.Source.Net)
		}
		if n.NetworkLayerMessageType == ndpu.IamRouterToNetwork { //used for decoding a bacnet network number on a What-Is-Network-Number 0x12
			n.Source = &btypes.Address{}
			var nets []btypes.Address
			d.decode(&n.Source.Net) //decode the first network
			nets = append(nets, *n.Source)
			size := d.len()
			for i := d.len(); i <= size; i++ {
				d.decode(&n.Source.Net)
				for _, adr := range nets {
					if adr.Net != n.Source.Net { //make sure that a network is only added once
						nets = append(nets, *n.Source)
					}
				}
			}
			addr = nets
		}
	}
	return addr, d.Error()
}

// NPDUMetadata includes additional metadata about npdu message
type NPDUMetadata byte

const maskNetworkLayerMessage = 1 << 7
const maskDestination = 1 << 5
const maskSource = 1 << 3
const maskExpectingReply = 1 << 2

// General setter for the info bits using the mask
func (meta *NPDUMetadata) setInfoMask(b bool, mask byte) {
	*meta = NPDUMetadata(setInfoMask(byte(*meta), b, mask))
}

// CheckMask uses mask to check bit position
func (meta *NPDUMetadata) checkMask(mask byte) bool {
	return (*meta & NPDUMetadata(mask)) > 0

}

// IsNetworkLayerMessage returns true if it is a network layer message
func (n *NPDUMetadata) IsNetworkLayerMessage() bool {
	return n.checkMask(maskNetworkLayerMessage)
}

func (n *NPDUMetadata) SetNetworkLayerMessage(b bool) {
	n.setInfoMask(b, maskNetworkLayerMessage)
}

// Priority returns priority
func (n *NPDUMetadata) Priority() btypes.NPDUPriority {
	// Encoded in bit 0 and 1
	return btypes.NPDUPriority(byte(*n) & 3)
}

// SetPriority for NPDU
func (n *NPDUMetadata) SetPriority(p btypes.NPDUPriority) {
	// Clear the first two bits
	//*n &= (0xF - 3)
	*n |= NPDUMetadata(p)
}

func (n *NPDUMetadata) HasDestination() bool {
	return n.checkMask(maskDestination)
}

func (n *NPDUMetadata) SetDestination(b bool) {
	n.setInfoMask(b, maskDestination)
}

func (n *NPDUMetadata) HasSource() bool {
	return n.checkMask(maskSource)
}

func (n *NPDUMetadata) SetSource(b bool) {
	n.setInfoMask(b, maskSource)
}

func (n *NPDUMetadata) ExpectingReply() bool {
	return n.checkMask(maskExpectingReply)
}

func (n *NPDUMetadata) SetExpectingReply(b bool) {
	n.setInfoMask(b, maskExpectingReply)
}
