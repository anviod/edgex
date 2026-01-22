package main

import (
	"encoding/binary"
	"fmt"
	"log"
	"math"
	"net"
	"time"
)

func main() {
	log.Println("Starting BACnet Write Verification for AnalogValue:1 (Setpoint.1)...")

	// Target Address
	targetIP := "127.0.0.1"
	targetPort := 47808

	conn, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
	if err != nil {
		log.Fatalf("Failed to bind UDP: %v", err)
	}
	defer conn.Close()

	// 1. Send Unicast Who-Is to ensure connectivity (optional, but good practice)
	whoIs := []byte{0x81, 0x0a, 0x00, 0x08, 0x01, 0x00, 0x10, 0x08}
	addr, _ := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", targetIP, targetPort))
	conn.WriteToUDP(whoIs, addr)

	// Quick read to clear potential I-Am
	conn.SetReadDeadline(time.Now().Add(500 * time.Millisecond))
	buf := make([]byte, 1024)
	conn.ReadFromUDP(buf) // Ignore error/result

	// 2. Write 50.0 to AnalogValue:1 (Present_Value)
	log.Println("Attempting to write 50.0 to AnalogValue:1...")
	valToWrite := float32(50.0)

	// Construct WriteProperty Packet
	// Header: BVLC(4) + NPDU(2) + APDU(4) = 10 bytes
	packet := make([]byte, 0)
	packet = append(packet, 0x81, 0x0a, 0, 0) // BVLC: Unicast
	packet = append(packet, 0x01, 0x04)       // NPDU: Expect Reply

	invokeID := uint8(1)
	packet = append(packet, 0x00, 0x05, invokeID, 0x0f) // APDU: Confirmed, MaxSeg, InvokeID, WriteProperty(15)

	// Tag 0: ObjectIdentifier (AnalogValue, 1)
	// AnalogValue = 2.
	// ID = (2 << 22) | 1 = 8388609
	objID := (uint32(2) << 22) | 1
	packet = append(packet, 0x0c) // Context Tag 0, Len 4
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, objID)
	packet = append(packet, b...)

	// Tag 1: PropertyIdentifier (Present_Value = 85)
	packet = append(packet, 0x19, 85) // Context Tag 1, Len 1, Val 85

	// Tag 3: PropertyValue (Opening)
	packet = append(packet, 0x3e) // Context Tag 3, Opening (Class 1, Tag 3, Val 6 -> 110) -> 0x3E ?
	// Tag 3 (011). Class 1. Type 6 (Opening).
	// (3<<4) | (1<<3) | 6 = 0x30 | 8 | 6 = 0x3E. Correct.

	// Value: Application Tag 4 (Real)
	// Tag 4 (0100). Class 0. Len 4.
	// 0x44
	packet = append(packet, 0x44)
	binary.BigEndian.PutUint32(b, math.Float32bits(valToWrite))
	packet = append(packet, b...)

	// Tag 3: PropertyValue (Closing)
	packet = append(packet, 0x3f) // (3<<4)|(1<<3)|7 = 0x3F. Correct.

	// Tag 4: Priority (16)
	packet = append(packet, 0x49, 16)

	// Update Length
	binary.BigEndian.PutUint16(packet[2:4], uint16(len(packet)))

	// Send
	if _, err := conn.WriteToUDP(packet, addr); err != nil {
		log.Fatalf("Write failed: %v", err)
	}

	// Wait for SimpleACK
	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	n, _, err := conn.ReadFromUDP(buf)
	if err != nil {
		log.Printf("Read error (expected SimpleACK): %v", err)
		log.Println("Ensure YABE is running and listening on port 47808.")
	} else {
		// SimpleACK: APDU Type = 2 (0010....) -> 0x20
		// BVLC(4) + NPDU(2) = 6 bytes offset
		if n > 6 && (buf[6]&0xF0) == 0x20 {
			log.Println("SUCCESS: Received SimpleACK from device.")
		} else {
			log.Printf("Received unexpected response: %x", buf[:n])
		}
	}

	// 3. Read back to verify
	log.Println("Reading back AnalogValue:1...")
	// ReadProperty Packet
	packet = make([]byte, 0)
	packet = append(packet, 0x81, 0x0a, 0, 0) // BVLC
	packet = append(packet, 0x01, 0x04)       // NPDU
	invokeID++
	packet = append(packet, 0x00, 0x05, invokeID, 0x0c) // APDU: ReadProperty(12)

	// Tag 0: ObjID
	packet = append(packet, 0x0c)
	binary.BigEndian.PutUint32(b, objID)
	packet = append(packet, b...)

	// Tag 1: PropID
	packet = append(packet, 0x19, 85)

	// Length
	binary.BigEndian.PutUint16(packet[2:4], uint16(len(packet)))

	conn.WriteToUDP(packet, addr)

	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	n, _, err = conn.ReadFromUDP(buf)
	if err != nil {
		log.Printf("Read back failed: %v", err)
	} else {
		// Parse ComplexACK
		// APDU Type = 3 (0011....) -> 0x30
		if n > 6 && (buf[6]&0xF0) == 0x30 {
			// Skip headers and find Application Tag
			// This is a rough parser for verification
			// Payload starts after APDU header (usually 3-4 bytes for ComplexACK)
			// ComplexACK: Type(1), InvokeID(1), ServiceChoice(1) -> Offset 6+3=9
			// Tag 0 (ObjID) -> 5 bytes
			// Tag 1 (PropID) -> 2 bytes
			// Tag 3 (Opening) -> 1 byte
			// Value...

			// Let's just look for the Real tag 0x44
			found := false
			for i := 9; i < n-4; i++ {
				if buf[i] == 0x44 {
					bits := binary.BigEndian.Uint32(buf[i+1 : i+5])
					val := math.Float32frombits(bits)
					log.Printf("SUCCESS: Read value: %f", val)
					found = true
					break
				}
			}
			if !found {
				log.Println("Could not find Real value in response.")
				log.Printf("Response hex: %x", buf[:n])
			}
		} else {
			log.Printf("Unexpected read response: %x", buf[:n])
		}
	}
}
