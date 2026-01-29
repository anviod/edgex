package btypes

import (
	"fmt"
	"net"
)

type Address struct {
	Net    uint16 // BACnet network number
	Len    uint8
	MacLen uint8   // mac len 0 is a broadcast address
	Mac    []uint8 //note: MAC for IP addresses uses 4 bytes for addr, 2 bytes for port
	Adr    []uint8 // hardware addr (MAC) address of ms-tp devices
	Id     uint16
}

const GlobalBroadcast uint16 = 0xFFFF
const broadcastNetwork uint16 = 0xFFFF

// IsBroadcast returns if the address is a broadcast address
func (a *Address) IsBroadcast() bool {
	//qygeng
	// if a.Net == broadcastNetwork || a.MacLen == 0 {
	// 	return true
	// }
	return a.Net == broadcastNetwork
}

// SetLength if device is of type ms-tp then set address len to 1
func (a *Address) SetLength() {
	if len(a.Adr) > 0 {
		a.Len = 1
	} else {
		//qygeng:fix bug
		a.Len = uint8(len(a.Mac))
	}
}

func (a *Address) SetBroadcast(b bool) {
	if b {
		a.MacLen = 0
	} else {
		a.MacLen = uint8(len(a.Mac))
	}
}

// IsSubBroadcast checks to see if packet is meant to be a network
// specific broadcast
func (a *Address) IsSubBroadcast() bool {
	if a.Net > 0 && a.Len == 0 {
		return true
	}
	return false
}

// IsUnicast checks to see if packet is meant to be a unicast
func (a *Address) IsUnicast() bool {
	return a.MacLen == 6
}

// UDPAddr parses the mac address and returns a proper net.UDPAddr
func (a *Address) UDPAddr() (net.UDPAddr, error) {
	if len(a.Mac) != 6 {
		return net.UDPAddr{}, fmt.Errorf("mac is too short at %d", len(a.Mac))
	}
	port := uint(a.Mac[4])<<8 | uint(a.Mac[5])
	ip := net.IPv4(a.Mac[0], a.Mac[1], a.Mac[2], a.Mac[3])
	return net.UDPAddr{
		IP:   ip,
		Port: int(port),
	}, nil
}
