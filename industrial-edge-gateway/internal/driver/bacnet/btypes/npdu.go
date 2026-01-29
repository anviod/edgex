package btypes

import "industrial-edge-gateway/internal/driver/bacnet/btypes/ndpu"

type NPDUPriority byte

const ProtocolVersion uint8 = 1
const DefaultHopCount uint8 = 255

const (
	LifeSafety        NPDUPriority = 3
	CriticalEquipment NPDUPriority = 2
	Urgent            NPDUPriority = 1
	Normal            NPDUPriority = 0
)

type NPDU struct {
	Version uint8

	// Destination (optional)
	Destination *Address

	// Source (optional)
	Source *Address

	VendorId uint16

	IsNetworkLayerMessage   bool
	NetworkLayerMessageType ndpu.NetworkMessageType
	ExpectingReply          bool
	Priority                NPDUPriority
	HopCount                uint8
}
