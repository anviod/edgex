package bacnet

import (
	"context"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/model"
	"log"
	"math"
	"net"
	"strconv"
	"strings"
	"sync"
	"time"
)

func init() {
	driver.RegisterDriver("bacnet-ip", func() driver.Driver {
		return NewBACnetDriver()
	})
}

type BACnetDriver struct {
	config         model.DriverConfig
	conn           *net.UDPConn
	invokeID       uint8
	mu             sync.Mutex
	targetIP       string
	targetPort     int
	targetDNET     uint16
	targetDADR     []byte
	targetDeviceID int

	// Route Cache
	routeCache map[int]RouteInfo
	cacheMu    sync.RWMutex
}

type RouteInfo struct {
	IP   string
	Port int
	DNET uint16
	DADR []byte
}

func NewBACnetDriver() driver.Driver {
	return &BACnetDriver{
		targetIP:   "127.0.0.1",
		targetPort: 47808,
		routeCache: make(map[int]RouteInfo),
	}
}

func (d *BACnetDriver) resolveDevice(ctx context.Context, deviceID int) (*RouteInfo, error) {
	if d.conn == nil {
		return nil, fmt.Errorf("driver not connected")
	}

	// Send Who-Is
	if err := d.sendWhoIs(deviceID, deviceID); err != nil {
		return nil, err
	}

	// Wait for I-Am
	deadline := time.Now().Add(2 * time.Second)
	d.conn.SetReadDeadline(deadline)
	buffer := make([]byte, 1500)

	for {
		// Check context cancellation
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
		}

		n, srcAddr, err := d.conn.ReadFromUDP(buffer)
		if err != nil {
			return nil, err
		}

		// Parse I-Am
		// BVLC (4) + NPDU (2+) + APDU (I-Am)
		if n < 10 || buffer[0] != 0x81 {
			continue
		}

		offset := 4
		npduCtrl := buffer[offset+1]
		offset += 2

		var snet uint16
		var sadr []byte

		if (npduCtrl & 0x08) != 0 { // SNET/SADR present
			snet = binary.BigEndian.Uint16(buffer[offset : offset+2])
			slen := int(buffer[offset+2])
			offset += 3
			if offset+slen > n {
				continue
			}
			sadr = make([]byte, slen)
			copy(sadr, buffer[offset:offset+slen])
			offset += slen
		}

		// APDU
		if offset >= n {
			continue
		}
		apduType := buffer[offset]
		// Unconfirmed Request (0x10)
		if (apduType & 0xF0) != 0x10 {
			continue
		}

		service := buffer[offset+1]
		if service != 0x08 { // I-Am
			continue
		}

		// Payload: DeviceID (App Tag 12)
		p := offset + 2
		val, _, err := d.parseApplicationTag(buffer[p:])
		if err != nil {
			continue
		}

		// Check if it matches our deviceID
		objID, ok := val.(map[string]any)
		if !ok {
			continue
		}

		inst := objID["instance"].(uint32)
		if int(inst) == deviceID {
			// Found it!
			srcIP := srcAddr.IP.String()
			srcPort := srcAddr.Port

			route := RouteInfo{
				IP:   srcIP,
				Port: srcPort,
				DNET: snet,
				DADR: sadr,
			}

			d.cacheMu.Lock()
			d.routeCache[deviceID] = route
			d.cacheMu.Unlock()

			log.Printf("BACnet: Resolved Device %d -> %s:%d (DNET:%d DADR:%x)", deviceID, srcIP, srcPort, snet, sadr)
			return &route, nil
		}
	}
}

func (d *BACnetDriver) sendWhoIs(low, high int) error {
	// BVLC Broadcast
	packet := []byte{0x81, 0x0B, 0, 0}

	// NPDU
	// Ver 1, Control 0x20 (Dest Present), DNET 0xFFFF (Global Broadcast), DLEN 0, Hop 0xFF
	packet = append(packet, 0x01, 0x20, 0xFF, 0xFF, 0x00, 0xFF)

	// APDU: Unconfirmed Request (0x10), Service Who-Is (0x08)
	packet = append(packet, 0x10, 0x08)

	// Device Range Low (Context 0)
	packet = appendContextTagUnsigned(packet, 0, uint32(low))
	// Device Range High (Context 1)
	packet = appendContextTagUnsigned(packet, 1, uint32(high))

	// Update BVLC Length
	binary.BigEndian.PutUint16(packet[2:4], uint16(len(packet)))

	// Send to Broadcast
	bcast, err := net.ResolveUDPAddr("udp", "255.255.255.255:47808")
	if err == nil {
		d.conn.WriteToUDP(packet, bcast)
	}

	// Also send to target IP if unicast (DIRECTED_WHO_IS logic)
	d.mu.Lock()
	targetIP := d.targetIP
	targetPort := d.targetPort
	d.mu.Unlock()

	if targetIP != "127.0.0.1" && targetIP != "0.0.0.0" {
		addr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", targetIP, targetPort))
		if err == nil {
			d.conn.WriteToUDP(packet, addr)
		}
	}

	return nil
}

func appendContextTagUnsigned(buf []byte, tagNum uint8, val uint32) []byte {
	var b []byte
	if val <= 0xFF {
		b = []byte{byte(val)}
	} else if val <= 0xFFFF {
		b = make([]byte, 2)
		binary.BigEndian.PutUint16(b, uint16(val))
	} else if val <= 0xFFFFFF {
		b = make([]byte, 3)
		b[0] = byte(val >> 16)
		b[1] = byte(val >> 8)
		b[2] = byte(val)
	} else {
		b = make([]byte, 4)
		binary.BigEndian.PutUint32(b, val)
	}

	l := len(b)
	tag := (tagNum << 4) | 0x08
	if l < 5 {
		tag |= byte(l)
		buf = append(buf, tag)
	} else {
		tag |= 0x05
		buf = append(buf, tag, byte(l))
	}
	buf = append(buf, b...)
	return buf
}

func (d *BACnetDriver) SetDeviceConfig(config map[string]any) error {
	d.mu.Lock()
	defer d.mu.Unlock()

	// 1. Reset to defaults
	d.targetIP = "127.0.0.1"
	d.targetPort = 47808
	d.targetDNET = 0
	d.targetDADR = nil
	d.targetDeviceID = 0

	// 2. Apply Channel Config defaults
	if d.config.Config != nil {
		if ip, ok := d.config.Config["ip"].(string); ok && ip != "" {
			d.targetIP = ip
		}
		if port, ok := d.config.Config["port"].(float64); ok {
			d.targetPort = int(port)
		} else if port, ok := d.config.Config["port"].(int); ok {
			d.targetPort = port
		}
	}

	// 3. Apply Device Config overrides
	if ip, ok := config["ip"].(string); ok && ip != "" {
		d.targetIP = ip
	}
	if port, ok := config["port"].(float64); ok {
		d.targetPort = int(port)
	} else if port, ok := config["port"].(int); ok {
		d.targetPort = port
	}

	if dnet, ok := config["network_number"].(float64); ok {
		d.targetDNET = uint16(dnet)
	} else if dnet, ok := config["network_number"].(int); ok {
		d.targetDNET = uint16(dnet)
	}

	if dadrStr, ok := config["mac_address"].(string); ok && dadrStr != "" {
		// Expect hex string e.g. "01" or "01:02"
		dadrStr = strings.ReplaceAll(dadrStr, ":", "")
		if b, err := hex.DecodeString(dadrStr); err == nil {
			d.targetDADR = b
		}
	}

	if devID, ok := config["device_id"].(float64); ok {
		d.targetDeviceID = int(devID)
	} else if devID, ok := config["device_id"].(int); ok {
		d.targetDeviceID = devID
	}

	return nil
}

func (d *BACnetDriver) Init(cfg model.DriverConfig) error {
	d.config = cfg
	return nil
}

func (d *BACnetDriver) Connect(ctx context.Context) error {
	// Extract config parameters
	// Handle config extraction manually as model.DriverConfig has no Parameters field
	// Assuming d.config.Config holds the parameters

	ip := "0.0.0.0"
	if v, ok := d.config.Config["ip"].(string); ok && v != "" {
		ip = v
	}

	// Local bind port (usually 0 for random, or 47808 if we want to be a server too)
	// For a client, 0 is fine.
	localPort := 0

	addr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", ip, localPort))
	if err != nil {
		return err
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		return err
	}
	d.conn = conn

	log.Printf("BACnet Driver connected on %s", conn.LocalAddr().String())
	return nil
}

func (d *BACnetDriver) Disconnect() error {
	if d.conn != nil {
		d.conn.Close()
		d.conn = nil
	}
	return nil
}

func (d *BACnetDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	if d.conn == nil {
		return nil, fmt.Errorf("driver not connected")
	}

	results := make(map[string]model.Value)

	d.mu.Lock()
	ip := d.targetIP
	port := d.targetPort
	dnet := d.targetDNET
	dadr := d.targetDADR
	devID := d.targetDeviceID
	d.mu.Unlock()

	// 自动路由发现：如果配置了 DeviceID 但没有路由信息，尝试解析
	if devID > 0 && dnet == 0 && len(dadr) == 0 {
		d.cacheMu.RLock()
		route, ok := d.routeCache[devID]
		d.cacheMu.RUnlock()

		if ok {
			ip = route.IP
			port = route.Port
			dnet = route.DNET
			dadr = route.DADR
		} else {
			// 缓存未命中，尝试发现
			log.Printf("BACnet: Resolving address for Device %d...", devID)
			if r, err := d.resolveDevice(ctx, devID); err == nil {
				ip = r.IP
				port = r.Port
				dnet = r.DNET
				dadr = r.DADR
			} else {
				log.Printf("BACnet: Failed to resolve device %d: %v", devID, err)
			}
		}
	}

	log.Printf("BACnet ReadPoints: Device %d Target %s:%d (DNET:%d DADR:%x) Points: %d", devID, ip, port, dnet, dadr, len(points))

	for _, p := range points {
		parts := strings.Split(p.Address, ":")
		if len(parts) != 2 {
			continue
		}

		objTypeStr := parts[0]
		instanceStr := parts[1]
		instance, err := strconv.Atoi(instanceStr)
		if err != nil {
			log.Printf("Invalid instance for point %s: %v", p.Name, err)
			continue
		}

		var objType uint16
		switch objTypeStr {
		case "AnalogInput":
			objType = 0
		case "AnalogOutput":
			objType = 1
		case "AnalogValue":
			objType = 2
		case "BinaryInput":
			objType = 3
		case "BinaryOutput":
			objType = 4
		case "BinaryValue":
			objType = 5
		case "MultiStateInput":
			objType = 13
		case "MultiStateOutput":
			objType = 14
		case "MultiStateValue":
			objType = 19
		default:
			log.Printf("Unknown object type: %s", objTypeStr)
			continue
		}

		// Read Present_Value (85)
		val, err := d.readProperty(ctx, ip, port, dnet, dadr, objType, uint32(instance), 85)
		quality := "Good"
		if err != nil {
			quality = "Bad"
			log.Printf("BACnet Read Error %s (%s): %v", p.Name, p.Address, err)
			// Continue to next point even if error
			// Or should we return error? Usually partial success is better for SCADA.
			val = 0.0 // Default
		}

		results[p.ID] = model.Value{
			PointID: p.ID,
			Value:   val,
			Quality: quality,
			TS:      time.Now(),
		}
	}
	return results, nil
}

func (d *BACnetDriver) getInvokeID() uint8 {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.invokeID++
	return d.invokeID
}

func (d *BACnetDriver) readProperty(ctx context.Context, ip string, port int, dnet uint16, dadr []byte, objType uint16, instance uint32, propID uint32) (any, error) {
	if d.conn == nil {
		return nil, fmt.Errorf("driver not connected")
	}
	return d.readPropertyWithConn(d.conn, ip, port, dnet, dadr, objType, instance, propID)
}

func (d *BACnetDriver) readPropertyWithConn(conn *net.UDPConn, ip string, port int, dnet uint16, dadr []byte, objType uint16, instance uint32, propID uint32) (any, error) {
	invokeID := d.getInvokeID()
	objectID := (uint32(objType) << 22) | instance

	// Construct ReadProperty APDU
	// We need to build NPDU dynamically based on DNET

	packet := make([]byte, 0, 50)

	// BVLC: 0x81 (BACnet/IP), 0x0a (Unicast), Length TBD
	packet = append(packet, 0x81, 0x0a, 0, 0)

	// NPDU
	packet = append(packet, 0x01) // Ver

	npduCtrl := byte(0x04) // Expecting Reply
	if dnet > 0 {
		npduCtrl |= 0x20 // Dest Present
	}
	packet = append(packet, npduCtrl)

	if dnet > 0 {
		// DNET
		b := make([]byte, 2)
		binary.BigEndian.PutUint16(b, dnet)
		packet = append(packet, b...)

		// DLEN & DADR
		packet = append(packet, byte(len(dadr)))
		if len(dadr) > 0 {
			packet = append(packet, dadr...)
		}

		// Hop Count
		packet = append(packet, 0xFF)
	}

	// APDU: 0x00 (Confirmed Request), 0x05 (MaxSegs/Size), InvokeID, 0x0c (ReadProperty)
	packet = append(packet, 0x00, 0x05, invokeID, 0x0c)

	// Tag 0: ObjectIdentifier (Context Tag 0, Length 4) -> 0x0C
	packet = append(packet, 0x0c)
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, objectID)
	packet = append(packet, b...)

	// Tag 1: PropertyIdentifier (Context Tag 1, Length 1) -> 0x19
	packet = append(packet, 0x19, uint8(propID))

	// Update BVLC Length
	l := len(packet)
	binary.BigEndian.PutUint16(packet[2:4], uint16(l))

	addr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", ip, port))
	if err != nil {
		return nil, err
	}

	if _, err := conn.WriteToUDP(packet, addr); err != nil {
		return nil, err
	}

	// Read response
	// We need to filter for correct InvokeID and Source IP
	// Simple implementation: Read loop with timeout

	buffer := make([]byte, 1500)
	deadline := time.Now().Add(2 * time.Second)
	conn.SetReadDeadline(deadline)

	for {
		n, srcAddr, err := conn.ReadFromUDP(buffer)
		if err != nil {
			return nil, err
		}

		if !strings.HasPrefix(srcAddr.String(), ip) {
			// Might be response from different device if multiple requests pending
			// But for now we do sequential requests per point in loop
			// Check invoke ID
			// log.Printf("Ignored packet from %s (expected %s)", srcAddr.String(), ip)
		}

		if n < 10 {
			continue
		}

		// Check BVLC 0x81
		if buffer[0] != 0x81 {
			continue
		}

		// Skip BVLC(4) + NPDU(2 usually)
		offset := 4
		npduCtrl := buffer[offset+1]
		offset += 2
		if (npduCtrl & 0x20) != 0 {
			offset += 3 + int(buffer[offset+2])
		} // DNET
		if (npduCtrl & 0x08) != 0 {
			offset += 3 + int(buffer[offset+2])
		} // SNET

		if offset >= n {
			log.Printf("BACnet Read Malformed NPDU offset=%d n=%d", offset, n)
			continue
		}

		// APDU Type: 0x30 (ComplexACK)
		apduType := buffer[offset]
		if (apduType & 0xF0) == 0x50 { // Reject
			log.Printf("BACnet Reject: %x", apduType)
			return nil, fmt.Errorf("BACnet Reject")
		}
		if (apduType & 0xF0) == 0x10 { // Error
			log.Printf("BACnet Error APDU: %x", apduType)
			return nil, fmt.Errorf("BACnet Error")
		}
		if (apduType & 0xF0) != 0x30 {
			// log.Printf("BACnet Ignored APDU Type: %x", apduType)
			continue
		}

		resInvokeID := buffer[offset+1]
		if resInvokeID != invokeID {
			// log.Printf("BACnet InvokeID mismatch: got %d expected %d", resInvokeID, invokeID)
			continue
		}

		service := buffer[offset+2]
		if service != 0x0c { // ReadProperty ACK
			continue
		}

		// Parse payload (Tag 3: Value)
		// Format: Tag 0 (ObjID), Tag 1 (PropID), Tag 3 (Value)
		// We need to scan tags.
		p := offset + 3

		// Helper to skip context tags
		for p < n {
			tag := buffer[p]
			tagNum := tag >> 4
			// isConstructed := (tag & 0x08) != 0 // Unused
			// lenValue := tag & 0x07

			if tagNum == 3 {
				// Found Value Tag (Context 3)
				// It should be constructed (Opening Tag 0x3E)
				if tag != 0x3E {
					return nil, fmt.Errorf("expected opening tag 3, got %x", tag)
				}
				p++

				// Parse list of values until Closing Tag 3 (0x3F)
				var values []any
				for p < n {
					if buffer[p] == 0x3F {
						p++
						break
					}
					val, readLen, err := d.parseApplicationTag(buffer[p:])
					if err != nil {
						return nil, err
					}
					values = append(values, val)
					p += readLen
				}

				// If we requested a single value but got a list of 1, return the item?
				// Standard ReadProperty returns the value. If it's a list (like ObjectList), it returns a list.
				// If it's a scalar (Present_Value), it returns a scalar (which is a list of 1 in our logic if we treat everything as list inside Tag 3).
				// Wait, simple scalar values are just one Application Tag inside Tag 3.

				if len(values) == 1 {
					return values[0], nil
				}
				return values, nil

			} else {
				// Skip this tag
				// Simplified skipping logic
				p++ // Skip tag byte
				// We need to know length to skip
				// This part of code was fragile in previous version.
				// Let's improve it or just hope we hit Tag 3.
				// Actually, Response is usually Tag 0, Tag 1, Tag 3.
				// Tag 0 (ObjID) is 5 bytes (Tag 0x0C + 4 bytes).
				// Tag 1 (PropID) is 2 bytes (Tag 0x19 + 1 byte).
				// So if we start at offset+3 (after ServiceACK), we are at Tag 0.

				// Let's parse strictly.
				// We are at buffer[offset+3].
				// It should be Tag 0 (0x0C).
			}
		}

		return nil, fmt.Errorf("value tag not found")
	}
}

func (d *BACnetDriver) parseApplicationTag(data []byte) (any, int, error) {
	if len(data) == 0 {
		return nil, 0, fmt.Errorf("empty data")
	}

	tag := data[0]
	tagNum := tag >> 4
	tagLen := int(tag & 0x07)
	offset := 1

	if tagLen == 5 {
		if offset >= len(data) {
			return nil, 0, fmt.Errorf("truncated")
		}
		tagLen = int(data[offset])
		offset++
	}

	if offset+tagLen > len(data) {
		return nil, 0, fmt.Errorf("truncated data")
	}

	valueBytes := data[offset : offset+tagLen]
	totalLen := offset + tagLen

	switch tagNum {
	case 0: // Null
		return nil, totalLen, nil
	case 1: // Boolean
		return tagLen > 0, totalLen, nil // Simplified
	case 2: // Unsigned
		var u uint64
		for _, b := range valueBytes {
			u = (u << 8) | uint64(b)
		}
		return float64(u), totalLen, nil
	case 3: // Signed
		var i int64
		for _, b := range valueBytes {
			i = (i << 8) | int64(b)
		}
		return float64(i), totalLen, nil
	case 4: // Real
		if len(valueBytes) == 4 {
			bits := binary.BigEndian.Uint32(valueBytes)
			return float64(math.Float32frombits(bits)), totalLen, nil
		}
	case 5: // Double
		if len(valueBytes) == 8 {
			bits := binary.BigEndian.Uint64(valueBytes)
			return math.Float64frombits(bits), totalLen, nil
		}
	case 7: // Character String
		// First byte is encoding (0=UTF-8/ASCII)
		if len(valueBytes) > 1 {
			return string(valueBytes[1:]), totalLen, nil
		}
		return "", totalLen, nil
	case 9: // Enumerated
		var u uint64
		for _, b := range valueBytes {
			u = (u << 8) | uint64(b)
		}
		return float64(u), totalLen, nil
	case 12: // BACnetObjectIdentifier
		if len(valueBytes) == 4 {
			bits := binary.BigEndian.Uint32(valueBytes)
			instance := bits & 0x003FFFFF
			objType := bits >> 22
			return map[string]any{
				"type":     objType,
				"instance": instance,
			}, totalLen, nil
		}
	}

	// Default: return raw bytes or skip
	return nil, totalLen, nil
}

func (d *BACnetDriver) WritePoint(ctx context.Context, point model.Point, value any) error {
	d.mu.Lock()
	ip := d.targetIP
	port := d.targetPort
	dnet := d.targetDNET
	dadr := d.targetDADR
	devID := d.targetDeviceID
	d.mu.Unlock()

	// 自动路由发现
	if devID > 0 && dnet == 0 && len(dadr) == 0 {
		d.cacheMu.RLock()
		route, ok := d.routeCache[devID]
		d.cacheMu.RUnlock()

		if ok {
			ip = route.IP
			port = route.Port
			dnet = route.DNET
			dadr = route.DADR
		} else {
			// 缓存未命中，尝试发现
			log.Printf("BACnet: Resolving address for Device %d...", devID)
			if r, err := d.resolveDevice(ctx, devID); err == nil {
				ip = r.IP
				port = r.Port
				dnet = r.DNET
				dadr = r.DADR
			} else {
				log.Printf("BACnet: Failed to resolve device %d: %v", devID, err)
			}
		}
	}

	log.Printf("BACnet WritePoint: %s -> %v (Target: %s:%d DNET:%d Device:%d)", point.Address, value, ip, port, dnet, devID)

	parts := strings.Split(point.Address, ":")
	if len(parts) != 2 {
		return fmt.Errorf("invalid address format: %s", point.Address)
	}

	objTypeStr := parts[0]
	instance, err := strconv.Atoi(parts[1])
	if err != nil {
		return fmt.Errorf("invalid instance ID: %s", parts[1])
	}

	var objType uint16
	// Normalize and match object types (support various formats)
	switch strings.ToUpper(strings.ReplaceAll(objTypeStr, "_", "")) {
	case "ANALOGINPUT", "OBJECTANALOGINPUT":
		objType = 0
	case "ANALOGOUTPUT", "OBJECTANALOGOUTPUT":
		objType = 1
	case "ANALOGVALUE", "OBJECTANALOGVALUE":
		objType = 2
	case "BINARYINPUT", "OBJECTBINARYINPUT":
		objType = 3
	case "BINARYOUTPUT", "OBJECTBINARYOUTPUT":
		objType = 4
	case "BINARYVALUE", "OBJECTBINARYVALUE":
		objType = 5
	case "MULTISTATEINPUT", "OBJECTMULTISTATEINPUT":
		objType = 13
	case "MULTISTATEOUTPUT", "OBJECTMULTISTATEOUTPUT":
		objType = 14
	case "MULTISTATEVALUE", "OBJECTMULTISTATEVALUE":
		objType = 19
	default:
		return fmt.Errorf("unknown object type: %s", objTypeStr)
	}

	// Priority 16
	err = d.writeProperty(ctx, ip, port, dnet, dadr, objType, uint32(instance), 85, value, 16)
	if err != nil {
		log.Printf("BACnet Write Failed: %v", err)
		return err
	}
	log.Printf("BACnet Write Success")
	return nil
}

func (d *BACnetDriver) writeProperty(ctx context.Context, ip string, port int, dnet uint16, dadr []byte, objType uint16, instance uint32, propID uint32, value any, priority uint8) error {
	invokeID := d.getInvokeID()
	objectID := (uint32(objType) << 22) | instance

	// We need to determine the encoding based on objType
	// Analog -> Real
	// Binary -> Enumerated
	// MultiState -> Unsigned

	valBytes := []byte{}

	switch objType {
	case 0, 1, 2: // Analog
		fVal := 0.0
		switch v := value.(type) {
		case float64:
			fVal = v
		case float32:
			fVal = float64(v)
		case int:
			fVal = float64(v)
		case string:
			fVal, _ = strconv.ParseFloat(v, 64)
		}
		// App Tag 4 (Real)
		b := make([]byte, 4)
		binary.BigEndian.PutUint32(b, math.Float32bits(float32(fVal)))
		valBytes = append([]byte{0x44}, b...)
	case 3, 4, 5: // Binary
		iVal := 0
		switch v := value.(type) {
		case float64:
			iVal = int(v)
		case int:
			iVal = v
		case string:
			iVal, _ = strconv.Atoi(v)
		case bool:
			if v {
				iVal = 1
			} else {
				iVal = 0
			}
		}
		// App Tag 9 (Enumerated)
		// Assuming 0/1
		valBytes = append([]byte{0x91, uint8(iVal)}, []byte{}...)
	case 13, 14, 19: // MultiState
		iVal := 1
		switch v := value.(type) {
		case float64:
			iVal = int(v)
		case int:
			iVal = v
		case string:
			iVal, _ = strconv.Atoi(v)
		}
		// App Tag 2 (Unsigned)
		valBytes = append([]byte{0x21, uint8(iVal)}, []byte{}...)
	}

	// Calculate packet size
	// Header(17) + Tag3_Open(1) + ValBytes + Tag3_Close(1) + Tag4(2)
	// Base header: BVLC(4) + NPDU(2) + APDU(4) + Tag0(5) + Tag1(2) = 17

	packet := make([]byte, 0, 50)
	packet = append(packet, 0x81, 0x0a, 0, 0) // BVLC

	// NPDU
	packet = append(packet, 0x01) // Ver

	npduCtrl := byte(0x04) // Expecting Reply
	if dnet > 0 {
		npduCtrl |= 0x20 // Dest Present
	}
	packet = append(packet, npduCtrl)

	if dnet > 0 {
		// DNET
		b := make([]byte, 2)
		binary.BigEndian.PutUint16(b, dnet)
		packet = append(packet, b...)

		// DLEN & DADR
		packet = append(packet, byte(len(dadr)))
		if len(dadr) > 0 {
			packet = append(packet, dadr...)
		}

		// Hop Count
		packet = append(packet, 0xFF)
	}

	packet = append(packet, 0x00, 0x05, invokeID, 0x0f) // APDU (WriteProperty)

	// Tag 0: ObjID
	packet = append(packet, 0x0c)
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, objectID)
	packet = append(packet, b...)

	// Tag 1: PropID
	packet = append(packet, 0x19, uint8(propID))

	// Tag 3: Value (Opening)
	packet = append(packet, 0x3e)
	packet = append(packet, valBytes...)
	// Tag 3: Value (Closing)
	packet = append(packet, 0x3f)

	// Tag 4: Priority (Optional but good)
	// Context Tag 4, Unsigned. 0x4? -> Tag Number 4.
	// Tag byte: 4<<4 | 1 = 0x41 (Len 1)
	packet = append(packet, 0x49, priority)

	// Update Length
	l := len(packet)
	binary.BigEndian.PutUint16(packet[2:4], uint16(l))

	addr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", ip, port))
	if err != nil {
		return err
	}

	if _, err := d.conn.WriteToUDP(packet, addr); err != nil {
		return err
	}

	// Wait for SimpleACK (0x20)
	buffer := make([]byte, 100)
	d.conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	n, _, err := d.conn.ReadFromUDP(buffer)
	if err != nil {
		return err
	}

	// Check APDU Type = 0x20 (SimpleACK)
	// Offset: BVLC(4) + NPDU(...) + APDU(1)
	offset := 4
	npduCtrl = buffer[offset+1]
	offset += 2
	if (npduCtrl & 0x20) != 0 {
		offset += 3 + int(buffer[offset+2])
	} // DNET
	if (npduCtrl & 0x08) != 0 {
		offset += 3 + int(buffer[offset+2])
	} // SNET

	if n > offset && (buffer[offset]&0xF0) == 0x20 {
		return nil
	}

	return fmt.Errorf("write failed or rejected")
}

func (d *BACnetDriver) scanByDeviceID(ctx context.Context, ip string, port int, dnet uint16, dadr []byte, deviceInstance uint32) ([]map[string]any, error) {
	// Use ListenUDP to create an unconnected socket, allowing WriteToUDP to work
	conn, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	name, objects := d.scanDeviceObjects(ctx, conn, ip, port, dnet, dadr, deviceInstance)

	res := map[string]any{
		"device_id": deviceInstance,
		"name":      name,
		"ip":        ip,
		"port":      port,
		"objects":   objects,
	}
	if dnet > 0 {
		res["network_number"] = dnet
	}
	if len(dadr) > 0 {
		res["mac_address"] = hex.EncodeToString(dadr)
	}

	if res["name"] == "" {
		res["name"] = fmt.Sprintf("Device %d", deviceInstance)
	}

	return []map[string]any{res}, nil
}

func toUint32(v any) uint32 {
	switch t := v.(type) {
	case uint32:
		return t
	case int:
		return uint32(t)
	case float64:
		return uint32(t)
	case string:
		i, _ := strconv.Atoi(t)
		return uint32(i)
	default:
		return 0
	}
}

func (d *BACnetDriver) Health() driver.HealthStatus {
	return driver.HealthStatusGood
}

func (d *BACnetDriver) SetSlaveID(slaveID uint8) error {
	return nil
}

// Scan implements Scanner interface with real UDP broadcast
func (d *BACnetDriver) Scan(ctx context.Context, params map[string]any) (any, error) {
	// Check for manual device scan
	if params != nil {
		if idVal, ok := params["device_id"]; ok {
			deviceID := toUint32(idVal)
			ip := "127.0.0.1"
			port := 47808

			if ipVal, ok := params["ip"]; ok {
				if s, ok := ipVal.(string); ok && s != "" {
					ip = s
				}
			}
			if portVal, ok := params["port"]; ok {
				if p, ok := portVal.(float64); ok {
					port = int(p)
				} else if p, ok := portVal.(int); ok {
					port = p
				} else if s, ok := portVal.(string); ok {
					if p, err := strconv.Atoi(s); err == nil {
						port = p
					}
				}
			}

			dnet := uint16(0)
			dadr := []byte(nil)
			if dnetVal, ok := params["network_number"]; ok {
				if v, ok := dnetVal.(float64); ok {
					dnet = uint16(v)
				} else if v, ok := dnetVal.(int); ok {
					dnet = uint16(v)
				}
			}
			if dadrVal, ok := params["mac_address"]; ok {
				if s, ok := dadrVal.(string); ok && s != "" {
					s = strings.ReplaceAll(s, ":", "")
					if b, err := hex.DecodeString(s); err == nil {
						dadr = b
					}
				}
			}

			log.Printf("BACnet Targeted Scan: ID=%d, IP=%s:%d DNET=%d", deviceID, ip, port, dnet)
			return d.scanByDeviceID(ctx, ip, port, dnet, dadr, deviceID)
		}
	}

	log.Println("BACnet Scanning (Who-Is)...")

	devices := make([]map[string]any, 0)
	seen := make(map[string]bool)

	// Create UDP connection
	// Listen on random port
	conn, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
	if err != nil {
		log.Printf("Failed to create UDP listener: %v", err)
		return nil, err
	}
	defer conn.Close()

	// Who-Is packet
	// BVLC: 81 0b 00 08 (Broadcast, Len 8)
	// NPDU: 01 00 (Ver 1, Normal)
	// APDU: 10 08 (Unconfirmed, Who-Is)
	packet := []byte{0x81, 0x0b, 0x00, 0x08, 0x01, 0x00, 0x10, 0x08}

	broadcastAddr := &net.UDPAddr{IP: net.IPv4bcast, Port: 47808}

	log.Printf("Sending Who-Is to %s", broadcastAddr.String())
	if _, err := conn.WriteToUDP(packet, broadcastAddr); err != nil {
		log.Printf("Failed to send Who-Is: %v", err)
		// Don't return, try unicast
	}

	// Also send Unicast Who-Is to localhost (127.0.0.1) to support local simulator
	// BVLC: 81 0a 00 08 (Unicast)
	unicastPacket := []byte{0x81, 0x0a, 0x00, 0x08, 0x01, 0x00, 0x10, 0x08}
	localAddr := &net.UDPAddr{IP: net.IP{127, 0, 0, 1}, Port: 47808}
	conn.WriteToUDP(unicastPacket, localAddr)

	// Read loop with timeout
	// Use a shorter timeout for reading multiple responses
	deadline := time.Now().Add(3 * time.Second)
	if d, ok := ctx.Deadline(); ok && d.Before(deadline) {
		deadline = d
	}
	conn.SetReadDeadline(deadline)

	buffer := make([]byte, 1500)

	for {
		n, addr, err := conn.ReadFromUDP(buffer)
		if err != nil {
			// Timeout or error
			break
		}

		if n < 8 || buffer[0] != 0x81 {
			continue
		}

		// Simple parser for I-Am
		// Try to find APDU type 0x10 and Service Choice 0x00 (I-Am)
		// Usually at offset 6 or slightly more depending on NPDU control

		// NPDU Control at index 5
		npduControl := buffer[5]
		offset := 6 // BVLC(4) + NPDU_Ver(1) + NPDU_Ctrl(1)

		if (npduControl & 0x80) != 0 {
			continue
		} // Network Msg

		if (npduControl & 0x20) != 0 { // Dest present
			dlen := int(buffer[offset+2])
			offset += 3 + dlen
		}

		var snet uint16
		var sadr []byte
		if (npduControl & 0x08) != 0 { // Source present
			snet = binary.BigEndian.Uint16(buffer[offset : offset+2])
			slen := int(buffer[offset+2])
			if offset+3+slen <= n {
				sadr = make([]byte, slen)
				copy(sadr, buffer[offset+3:offset+3+slen])
			}
			offset += 3 + slen
		}

		if offset+1 >= n {
			continue
		}

		// Check APDU Type = Unconfirmed (0x10)
		if (buffer[offset] & 0xF0) != 0x10 {
			continue
		}

		// Check Service Choice = I-Am (0x00)
		if buffer[offset+1] != 0x00 {
			continue
		}

		// Payload starts at offset+2
		// Expect Application Tag 12 (ObjectIdentifier) -> 0xC4
		payloadOffset := offset + 2
		if payloadOffset >= n || buffer[payloadOffset] != 0xC4 {
			continue
		}

		if payloadOffset+5 > n {
			continue
		}

		objIdBytes := buffer[payloadOffset+1 : payloadOffset+5]
		objId := binary.BigEndian.Uint32(objIdBytes)

		instance := objId & 0x003FFFFF
		deviceType := (objId >> 22)

		if deviceType != 8 {
			continue
		} // Not a Device object

		key := fmt.Sprintf("%s-%d", addr.IP.String(), instance)
		if !seen[key] {
			seen[key] = true

			log.Printf("Discovered BACnet Device: %d at %s (SNET:%d SADR:%x)", instance, addr.String(), snet, sadr)

			// Deep scan for objects
			name, objects := d.scanDeviceObjects(ctx, conn, addr.IP.String(), addr.Port, snet, sadr, instance)
			if name == "" {
				name = fmt.Sprintf("Device %d", instance)
			}

			devMap := map[string]any{
				"device_id": instance,
				"ip":        addr.IP.String(),
				"port":      addr.Port,
				"name":      name,
				"objects":   objects,
			}
			if snet > 0 {
				devMap["network_number"] = snet
			}
			if len(sadr) > 0 {
				devMap["mac_address"] = hex.EncodeToString(sadr)
			}
			devices = append(devices, devMap)
		}
	}

	// If nothing found via Who-Is, try direct probe
	if len(devices) == 0 {
		log.Printf("No devices found via Who-Is, attempting direct probe to %s:%d...", d.targetIP, d.targetPort)

		// We need a short timeout for probe
		probeConn, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.IPv4zero, Port: 0})
		if err == nil {
			defer probeConn.Close()

			// Device:4194303 (Wildcard)
			// Read Object_Identifier (75)
			val, err := d.readPropertyWithConn(probeConn, d.targetIP, d.targetPort, d.targetDNET, d.targetDADR, 8, 4194303, 75)
			if err == nil {
				if oid, ok := val.(map[string]any); ok {
					if t, ok := oid["type"].(uint32); ok && t == 8 {
						inst := uint32(oid["instance"].(uint32))
						log.Printf("Direct Probe Success! Found Device Instance: %d", inst)

						// Add to devices
						// Deep scan
						name, objects := d.scanDeviceObjects(ctx, probeConn, d.targetIP, d.targetPort, d.targetDNET, d.targetDADR, inst)
						if name == "" {
							name = fmt.Sprintf("Device %d", inst)
						}

						devMap := map[string]any{
							"device_id": inst,
							"ip":        d.targetIP,
							"port":      d.targetPort,
							"name":      name,
							"objects":   objects,
						}
						if d.targetDNET > 0 {
							devMap["network_number"] = d.targetDNET
						}
						if len(d.targetDADR) > 0 {
							devMap["mac_address"] = hex.EncodeToString(d.targetDADR)
						}
						devices = append(devices, devMap)
					}
				}
			} else {
				log.Printf("Direct probe failed: %v", err)
			}
		}
	}

	// If still nothing found, return empty result (user can manually add)
	if len(devices) == 0 {
		log.Println("BACnet Scan completed: No devices found.")
		return devices, nil
	}

	return devices, nil
}

func (d *BACnetDriver) scanDeviceObjects(ctx context.Context, conn *net.UDPConn, ip string, port int, dnet uint16, dadr []byte, deviceInstance uint32) (string, []map[string]any) {
	// 1. Read Device Name (Prop 77)
	nameVal, err := d.readPropertyWithConn(conn, ip, port, dnet, dadr, 8, deviceInstance, 77)
	deviceName := ""
	if err == nil {
		if s, ok := nameVal.(string); ok {
			deviceName = s
		}
	}

	// 2. Read Object List (Prop 76)
	objListVal, err := d.readPropertyWithConn(conn, ip, port, dnet, dadr, 8, deviceInstance, 76)
	if err != nil {
		log.Printf("Failed to read Object List for device %d: %v", deviceInstance, err)
		return deviceName, nil
	}

	var objects []map[string]any

	// Helper to process object ID
	processObj := func(oid map[string]any) {
		objType := uint16(oid["type"].(uint32))
		objInst := uint32(oid["instance"].(uint32))

		// Skip Device object itself
		if objType == 8 {
			return
		}

		// Map type to string
		typeStr := d.getObjectTypeString(objType)
		if typeStr == "Unknown" {
			return
		}

		// Read Object Name (Prop 77)
		objName := fmt.Sprintf("%s-%d", typeStr, objInst)
		nameVal, err := d.readPropertyWithConn(conn, ip, port, dnet, dadr, objType, objInst, 77)
		if err == nil {
			if s, ok := nameVal.(string); ok {
				objName = s
			}
		}

		objects = append(objects, map[string]any{
			"type":     typeStr,
			"instance": objInst,
			"name":     objName,
			"value":    0, // Placeholder
			"unit":     "",
		})
	}

	// objListVal could be a single map (if 1 item) or slice of maps
	if list, ok := objListVal.([]any); ok {
		for _, item := range list {
			if oid, ok := item.(map[string]any); ok {
				processObj(oid)
			}
		}
	} else if oid, ok := objListVal.(map[string]any); ok {
		processObj(oid)
	}

	return deviceName, objects
}

func (d *BACnetDriver) getObjectTypeString(t uint16) string {
	switch t {
	case 0:
		return "AnalogInput"
	case 1:
		return "AnalogOutput"
	case 2:
		return "AnalogValue"
	case 3:
		return "BinaryInput"
	case 4:
		return "BinaryOutput"
	case 5:
		return "BinaryValue"
	case 13:
		return "MultiStateInput"
	case 14:
		return "MultiStateOutput"
	case 19:
		return "MultiStateValue"
	default:
		return "Unknown"
	}
}
