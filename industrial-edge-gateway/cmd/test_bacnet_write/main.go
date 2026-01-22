package main

import (
	"encoding/binary"
	"fmt"
	"math"
	"net"
	"time"
)

func main() {
	// 1. Send Who-Is
	fmt.Println("Sending Who-Is...")
	targetIP, err := scanDevice()
	if err != nil {
		fmt.Printf("Scan failed: %v. Assuming 127.0.0.1\n", err)
		targetIP = "127.0.0.1"
	} else {
		fmt.Printf("Found device at %s\n", targetIP)
	}

	ip := targetIP
	port := 47808
	instance := uint32(1)
	objType := uint16(2) // AnalogValue
	value := 50.0        // Test value

	// 2. Write
	fmt.Printf("Attempting to write %v to AnalogValue:%d at %s:%d...\n", value, instance, ip, port)
	err = writeProperty(ip, port, objType, instance, 85, value, 16)
	if err != nil {
		fmt.Printf("Error with priority: %v\n", err)
		// Try without priority
		fmt.Println("Retrying without priority...")
		err = writeProperty(ip, port, objType, instance, 85, value, 0)
		if err != nil {
			fmt.Printf("Error without priority: %v\n", err)
		} else {
			fmt.Println("Success! WriteProperty accepted (no priority).")
		}
	} else {
		fmt.Println("Success! WriteProperty accepted (with priority).")
	}
}

func scanDevice() (string, error) {
	conn, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
	if err != nil {
		return "", err
	}
	defer conn.Close()

	packet := []byte{0x81, 0x0b, 0x00, 0x08, 0x01, 0x00, 0x10, 0x08}
	broadcastAddr := &net.UDPAddr{IP: net.IPv4bcast, Port: 47808}

	if _, err := conn.WriteToUDP(packet, broadcastAddr); err != nil {
		// Try local broadcast
		broadcastAddr.IP = net.IP{127, 0, 0, 1} // Actually this is unicast to localhost
		// True broadcast on Windows is tricky without finding interface.
		// Let's try 127.0.0.1 if global fails?
		// Actually WriteToUDP to 255.255.255.255 usually works if route exists.
		return "", err
	}

	// Try sending to localhost specifically too, just in case
	conn.WriteToUDP(packet, &net.UDPAddr{IP: net.IP{127, 0, 0, 1}, Port: 47808})

	buffer := make([]byte, 1500)
	conn.SetReadDeadline(time.Now().Add(2 * time.Second))

	for {
		n, addr, err := conn.ReadFromUDP(buffer)
		if err != nil {
			return "", err
		}
		if n > 0 {
			return addr.IP.String(), nil
		}
	}
}

func writeProperty(ip string, port int, objType uint16, instance uint32, propID uint32, value any, priority uint8) error {
	invokeID := uint8(2)
	objectID := (uint32(objType) << 22) | instance

	// Encode Value (Real)
	fVal := value.(float64)
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, math.Float32bits(float32(fVal)))
	valBytes := append([]byte{0x44}, b...) // App Tag 4 (Real)

	// Construct Packet
	packet := make([]byte, 0, 50)
	packet = append(packet, 0x81, 0x0a, 0, 0)           // BVLC
	packet = append(packet, 0x01, 0x04)                 // NPDU
	packet = append(packet, 0x00, 0x05, invokeID, 0x0f) // APDU (WriteProperty)

	// Tag 0: ObjID
	packet = append(packet, 0x0c)
	b = make([]byte, 4)
	binary.BigEndian.PutUint32(b, objectID)
	packet = append(packet, b...)

	// Tag 1: PropID
	packet = append(packet, 0x19, uint8(propID))

	// Tag 3: Value (Opening)
	packet = append(packet, 0x3e)
	packet = append(packet, valBytes...)
	// Tag 3: Value (Closing)
	packet = append(packet, 0x3f)

	// Tag 4: Priority
	if priority > 0 {
		packet = append(packet, 0x49, priority)
	}

	// Update Length
	l := len(packet)
	binary.BigEndian.PutUint16(packet[2:4], uint16(l))

	// Send
	addr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", ip, port))
	if err != nil {
		return err
	}

	conn, err := net.DialUDP("udp", nil, addr)
	if err != nil {
		return err
	}
	defer conn.Close()

	if _, err := conn.Write(packet); err != nil {
		return err
	}

	// Read ACK
	buffer := make([]byte, 100)
	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	n, _, err := conn.ReadFromUDP(buffer)
	if err != nil {
		return err
	}

	// Check APDU Type = 0x20 (SimpleACK)
	// Offset: BVLC(4) + NPDU(2) + APDU(1)
	if n > 6 && (buffer[6]&0xF0) == 0x20 {
		return nil
	}

	if n > 6 && (buffer[6]&0xF0) == 0x50 {
		return fmt.Errorf("BACnet Reject: Reason %d", buffer[8])
	}
	if n > 6 && (buffer[6]&0xF0) == 0x10 {
		return fmt.Errorf("BACnet Error: Class %d Code %d", buffer[8], buffer[9])
	}

	return fmt.Errorf("unknown response: %x", buffer[:n])
}
