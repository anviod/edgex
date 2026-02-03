package main

import (
	"encoding/binary"
	"fmt"
	"log"
	"net"
	"time"
)

func main() {
	log.Println("Starting BACnet Scan Verification...")

	// 1. Send Who-Is
	conn, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
	if err != nil {
		log.Fatalf("Failed to bind UDP: %v", err)
	}
	defer conn.Close()

	// Broadcast Who-Is
	packet := []byte{0x81, 0x0b, 0x00, 0x08, 0x01, 0x00, 0x10, 0x08}
	broadcastAddr := &net.UDPAddr{IP: net.IPv4bcast, Port: 47808}
	conn.WriteToUDP(packet, broadcastAddr)

	// Unicast Who-Is to local
	unicastPacket := []byte{0x81, 0x0a, 0x00, 0x08, 0x01, 0x00, 0x10, 0x08}
	localAddr := &net.UDPAddr{IP: net.IP{127, 0, 0, 1}, Port: 47808}
	conn.WriteToUDP(unicastPacket, localAddr)

	// Unicast Who-Is to Target Simulator
	targetAddr := &net.UDPAddr{IP: net.IP{192, 168, 3, 106}, Port: 47808}
	conn.WriteToUDP(unicastPacket, targetAddr)

	log.Println("Sent Who-Is, waiting for I-Am...")

	// 2. Wait for I-Am
	conn.SetReadDeadline(time.Now().Add(5 * time.Second))
	buf := make([]byte, 1500)

	foundDevices := make(map[uint32]string) // instance->ip:port

	for {
		n, addr, err := conn.ReadFromUDP(buf)
		if err != nil {
			break
		}

		log.Printf("Received packet from %s: %x", addr.String(), buf[:n])

		// Parse I-Am
		// Minimal check: BVLC=0x81, APDU=0x10 (Unconfirmed), Service=0x00 (I-Am)
		if n < 10 || buf[0] != 0x81 {
			continue
		}

		// Skip BVLC(4) + NPDU
		offset := 4
		npduCtrl := buf[offset+1]
		offset += 2
		if (npduCtrl & 0x80) != 0 {
			continue
		} // Net msg
		if (npduCtrl & 0x20) != 0 {
			offset += 3 + int(buf[offset+2])
		} // DNET
		if (npduCtrl & 0x08) != 0 {
			offset += 3 + int(buf[offset+2])
		} // SNET

		if offset+2 >= n {
			continue
		}
		if (buf[offset] & 0xF0) != 0x10 {
			continue
		} // Unconfirmed
		if buf[offset+1] != 0x00 {
			continue
		} // I-Am

		// Decode Device ID (Application Tag 12)
		payload := buf[offset+2:]
		if len(payload) < 5 || payload[0] != 0xC4 {
			continue
		}

		bits := binary.BigEndian.Uint32(payload[1:5])
		instance := bits & 0x003FFFFF

		log.Printf("Found Device: Instance %d at %s", instance, addr.String())
		foundDevices[instance] = addr.String()
	}

	if len(foundDevices) == 0 {
		log.Println("No devices found via Who-Is.")
		log.Println("Attempting direct probe with Wildcard Device Instance (4194303)...")

		// Probe 127.0.0.1 with Device:4194303
		probeAndScan(conn, "127.0.0.1", 47808)
		// Probe 192.168.3.106
		probeAndScan(conn, "192.168.3.106", 47808)
		return
	}

	// 3. Scan Objects for each device
	for instance, addrStr := range foundDevices {
		log.Printf("Scanning objects for device %d (%s)...", instance, addrStr)
		host, portStr, err := net.SplitHostPort(addrStr)
		if err != nil {
			log.Printf("Invalid address %s: %v", addrStr, err)
			continue
		}
		port := 47808
		fmt.Sscanf(portStr, "%d", &port)
		scanDeviceObjects(conn, host, port, instance)
	}
}

func probeAndScan(conn *net.UDPConn, ip string, port int) {
	invokeID := uint8(2)
	// Device:4194303
	devObjID := (uint32(8) << 22) | 4194303

	packet := make([]byte, 0)
	packet = append(packet, 0x81, 0x0a, 0, 0)
	packet = append(packet, 0x01, 0x04)
	packet = append(packet, 0x00, 0x05, invokeID, 0x0c)
	packet = append(packet, 0x0c)
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, devObjID)
	packet = append(packet, b...)
	packet = append(packet, 0x19, 75) // Prop 75 = Object_Identifier
	binary.BigEndian.PutUint16(packet[2:4], uint16(len(packet)))

	addr, _ := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", ip, port))
	conn.WriteToUDP(packet, addr)

	buf := make([]byte, 1024)
	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	n, _, err := conn.ReadFromUDP(buf)
	if err != nil {
		log.Printf("Probe failed: %v", err)
		return
	}

	// Parse response to get ID
	// Assuming ComplexACK with Tag 12 (ObjectIdentifier) in Tag 3 or direct
	// Actually ReadProperty returns the value directly in Tag 3 usually.
	// But let's look for Tag 12 (0xC4) anywhere in payload

	for i := 6; i < n-4; i++ {
		if buf[i] == 0xC4 {
			bits := binary.BigEndian.Uint32(buf[i+1 : i+5])
			inst := bits & 0x003FFFFF
			log.Printf("Probe Success! Found Device Instance: %d", inst)
			scanDeviceObjects(conn, ip, port, inst)
			return
		}
	}
	log.Printf("Probe response received but ID not found: %x", buf[:n])
}

func scanDeviceObjects(conn *net.UDPConn, ip string, port int, instance uint32) {
	invokeID := uint8(1)

	// Read Object_List (Prop 76) of Device Object (Type 8)
	// Device Object ID
	devObjID := (uint32(8) << 22) | instance

	// ReadProperty Packet
	packet := make([]byte, 0)
	packet = append(packet, 0x81, 0x0a, 0, 0)           // BVLC
	packet = append(packet, 0x01, 0x04)                 // NPDU
	packet = append(packet, 0x00, 0x05, invokeID, 0x0c) // APDU: ReadProperty

	// Tag 0: ObjID
	packet = append(packet, 0x0c)
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, devObjID)
	packet = append(packet, b...)

	// Tag 1: PropID (76 = Object_List)
	packet = append(packet, 0x19, 76)

	// Length
	binary.BigEndian.PutUint16(packet[2:4], uint16(len(packet)))

	addr, _ := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", ip, port))
	conn.WriteToUDP(packet, addr)

	// Read Response
	buf := make([]byte, 2048) // Bigger buffer for object list
	conn.SetReadDeadline(time.Now().Add(3 * time.Second))

	n, _, err := conn.ReadFromUDP(buf)
	if err != nil {
		log.Printf("Error reading Object List: %v", err)
		return
	}

	// Parse ComplexACK
	// Skip headers...
	// Assuming standard header size for now (6 bytes BVLC+NPDU + 3 bytes APDU) = 9
	if n < 10 {
		return
	}

	offset := 6 // BVLC+NPDU
	if (buf[6] & 0xF0) != 0x30 {
		log.Printf("Expected ComplexACK (0x30), got %x", buf[6])
		return
	}

	// Check Service Choice = 0x0C (ReadPropertyACK)
	if buf[offset+2] != 0x0C {
		return
	}

	// Skip Tag 0 (ObjID) and Tag 1 (PropID)
	// Tag 0 is 5 bytes, Tag 1 is 2 bytes. Total 7 bytes.
	p := offset + 3 + 7

	// Tag 3 (Opening) = 0x3E
	if p >= n || buf[p] != 0x3E {
		log.Printf("Expected Opening Tag 3, got %x at %d", buf[p], p)
		return
	}
	p++

	count := 0
	for p < n {
		if buf[p] == 0x3F {
			break
		} // Closing Tag 3

		// Parse ObjectIdentifier (Tag 12 -> 0xC4)
		if buf[p] != 0xC4 {
			// Might be other tags if logic is wrong, but Object List is array of OIDs
			p++
			continue
		}

		if p+5 > n {
			break
		}
		bits := binary.BigEndian.Uint32(buf[p+1 : p+5])
		oidType := bits >> 22
		oidInst := bits & 0x003FFFFF

		fmt.Printf("  - Found Object: Type %d, Instance %d\n", oidType, oidInst)

		// Optional: Read Object_Name for each
		readObjectName(conn, ip, port, oidType, oidInst)

		p += 5
		count++
	}
	log.Printf("Total objects found: %d", count)
}

func readObjectName(conn *net.UDPConn, ip string, port int, objType uint32, instance uint32) {
	// Send ReadProperty for Prop 77 (Object_Name)
	// ... (Simplified: Skipping implementation for brevity in verification script unless needed)
	// Just printing the ID is enough to verify "scan objects" works structurally.
}
