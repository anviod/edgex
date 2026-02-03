package ip2bytes

import (
	"bytes"
	"encoding/binary"
	"errors"
	"log"
	"math/big"
	"net"
)

func ip4toInt(ip4Address net.IP) int64 {
	IPv4Int := big.NewInt(0)
	IPv4Int.SetBytes(ip4Address.To4())
	return IPv4Int.Int64()
}

func pack32BinaryIP4(ip4Address string) []byte {
	ipv4Decimal := ip4toInt(net.ParseIP(ip4Address))
	buf := new(bytes.Buffer)
	err := binary.Write(buf, binary.BigEndian, uint32(ipv4Decimal))
	if err != nil {
		log.Printf("[ERROR] helpers.mac.Pack32BinaryIP4() unable to write to buffer: %v", err)
	}
	return buf.Bytes()
}

/*
New ip in byte format
- ip with no subnet
- port
- returns uint8[192 168 15 10 186 192]
*/
func New(ip string, port uint16) ([]uint8, error) {
	buf := new(bytes.Buffer)
	err := binary.Write(buf, binary.BigEndian, port)
	if err != nil {
		return nil, errors.New("helpers.mac.BuildMac() unable to write to binary")
	}
	return append(pack32BinaryIP4(ip), buf.Bytes()...), nil
}
