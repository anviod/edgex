package bacnet

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/null"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/units"
	"industrial-edge-gateway/internal/driver/bacnet/datalink"
	"industrial-edge-gateway/internal/model"
	"log"
	"net"
	"strconv"
	"sync"
	"time"
)

func init() {
	driver.RegisterDriver("bacnet-ip", func() driver.Driver {
		return NewBACnetDriver()
	})
}

type BACnetDriver struct {
	config    model.DriverConfig
	client    Client
	scheduler *PointScheduler
	mu        sync.Mutex

	// Factory for creating clients (injectable for testing)
	clientFactory func(cb *ClientBuilder) (Client, error)

	// Interface settings
	interfaceIP   string
	interfacePort int
	subnetCIDR    int

	// Target settings
	targetDeviceID int
	targetDevice   btypes.Device

	connected bool
}

func NewBACnetDriver() driver.Driver {
	return &BACnetDriver{
		interfacePort: 47808,     // Default BACnet port
		interfaceIP:   "0.0.0.0", // Default IP
		subnetCIDR:    24,        // Default CIDR
		connected:     false,
		clientFactory: NewClient,
	}
}

func (d *BACnetDriver) Init(config model.DriverConfig) error {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.config = config

	// Parse Interface Config
	if v, ok := config.Config["interface_ip"]; ok {
		d.interfaceIP = fmt.Sprintf("%v", v)
	} else if v, ok := config.Config["ip"]; ok {
		d.interfaceIP = fmt.Sprintf("%v", v)
	}

	if v, ok := config.Config["interface_port"]; ok {
		if val, ok := v.(int); ok {
			d.interfacePort = val
		} else if val, ok := v.(float64); ok {
			d.interfacePort = int(val)
		}
	} else if v, ok := config.Config["port"]; ok {
		if val, ok := v.(int); ok {
			d.interfacePort = val
		} else if val, ok := v.(float64); ok {
			d.interfacePort = int(val)
		}
	}

	if v, ok := config.Config["subnet_cidr"]; ok {
		if val, ok := v.(int); ok {
			d.subnetCIDR = val
		} else if val, ok := v.(float64); ok {
			d.subnetCIDR = int(val)
		}
	}

	// Parse Target Config
	// Note: device_id might be provided in Init config or SetDeviceConfig
	if v, ok := config.Config["device_id"]; ok {
		if val, ok := v.(int); ok {
			d.targetDeviceID = val
		} else if val, ok := v.(float64); ok {
			d.targetDeviceID = int(val)
		}
	}

	return nil
}

func (d *BACnetDriver) Connect(ctx context.Context) error {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.connected && d.client != nil && d.client.IsRunning() {
		return nil
	}

	// Create Client
	cb := &ClientBuilder{
		Ip:         d.interfaceIP,
		Port:       d.interfacePort,
		SubnetCIDR: d.subnetCIDR,
	}
	// If interfaceIP is not set, we might default to 0.0.0.0 or let NewClient handle it
	if d.interfaceIP == "" {
		// Try to find a sensible default or just use 0.0.0.0 equivalent?
		// NewClient implementation logic:
		// if iface != "" -> NewUDPDataLink(iface, port)
		// else -> NewUDPDataLinkFromIP(ip, sub, port)
		// We should probably set Ip to "0.0.0.0" if not specified, but NewUDPDataLinkFromIP needs valid IP.
		// For now, let's assume config provides IP or we try to bind broadly.
		// If Ip is empty, NewClient might fail or we should handle it.
		// Let's assume user provides config for now, or we default to a local IP.
	}

	client, err := d.clientFactory(cb)
	if err != nil {
		return fmt.Errorf("failed to create BACnet client: %v", err)
	}
	d.client = client

	// Start Client
	go d.client.ClientRun()

	// Wait a bit for client to start?
	time.Sleep(100 * time.Millisecond)

	// Discover Target Device
	if d.targetDeviceID > 0 {
		if err := d.discoverDevice(d.targetDeviceID, "", 0); err != nil {
			d.client.Close()
			d.client = nil
			return err
		}
	}

	d.connected = true
	return nil
}

func (d *BACnetDriver) discoverDevice(deviceID int, ip string, port int) error {
	log.Printf("[INFO] Discovering BACnet device %d (Target IP: %s, Port: %d)...", deviceID, ip, port)

	// WhoIs
	whois := &WhoIsOpts{
		Low:  deviceID,
		High: deviceID,
	}

	if ip != "" {
		if port == 0 {
			port = 47808
		}
		// Parse IP
		parsedIP := net.ParseIP(ip)
		if parsedIP != nil {
			addr := datalink.IPPortToAddress(parsedIP, port)
			whois.Destination = addr
			log.Printf("[INFO] Using Unicast WhoIs to %s:%d", ip, port)
		}
	}

	// We might need a loop or retry here
	devices, err := d.client.WhoIs(whois)
	if err != nil {
		log.Printf("[ERROR] WhoIs failed for device %d: %v", deviceID, err)
		return fmt.Errorf("WhoIs failed: %v", err)
	}

	if len(devices) == 0 {
		log.Printf("[DEBUG] No devices found for ID %d, retrying with Broadcast...", deviceID)
		// Switch to Broadcast if Unicast failed
		whois.Destination = nil
		time.Sleep(1 * time.Second)
		devices, err = d.client.WhoIs(whois)
		if err != nil || len(devices) == 0 {
			log.Printf("[WARN] Device %d not found on network after retry", deviceID)

			// Fallback: If discovery fails but we have explicit IP/Port, use it.
			if ip != "" && port != 0 {
				log.Printf("[WARN] Using configured address %s:%d as fallback.", ip, port)
				parsedIP := net.ParseIP(ip)
				if parsedIP != nil {
					addr := datalink.IPPortToAddress(parsedIP, port)
					fakeDevice := btypes.Device{
						Addr: *addr,
						ID: btypes.ObjectID{
							Type:     btypes.DeviceType,
							Instance: btypes.ObjectInstance(deviceID),
						},
						DeviceID:     deviceID,
						MaxApdu:      1476,
						Segmentation: btypes.Enumerated(3),
					}
					devices = []btypes.Device{fakeDevice}
				} else {
					return fmt.Errorf("device %d not found on network and invalid IP", deviceID)
				}
			} else {
				return fmt.Errorf("device %d not found on network", deviceID)
			}
		}
	}

	d.targetDevice = devices[0]
	log.Printf("[INFO] Found BACnet device %d at %v", deviceID, d.targetDevice.Addr)

	// Fix: If configured port is different from discovered port (e.g. ephemeral), override it.
	if port != 0 && len(d.targetDevice.Addr.Mac) == 6 {
		discPort := int(d.targetDevice.Addr.Mac[4])<<8 | int(d.targetDevice.Addr.Mac[5])
		if discPort != port {
			log.Printf("[WARN] Discovered device port %d differs from configured port %d. Overriding to %d to ensure connectivity.", discPort, port, port)
			d.targetDevice.Addr.Mac[4] = uint8(port >> 8)
			d.targetDevice.Addr.Mac[5] = uint8(port & 0xFF)
			log.Printf("[INFO] Updated target device address to: %v", d.targetDevice.Addr)
		}
	}

	// Initialize Scheduler
	d.scheduler = NewPointScheduler(d.client, d.targetDevice, 20, 10*time.Millisecond, 10*time.Second)
	return nil
}

func (d *BACnetDriver) Disconnect() error {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.client != nil {
		d.client.Close()
	}
	d.connected = false
	return nil
}

func (d *BACnetDriver) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	if d.scheduler == nil {
		return nil, fmt.Errorf("scheduler not initialized (device not connected or not found)")
	}
	return d.scheduler.Read(ctx, points)
}

func (d *BACnetDriver) WritePoint(ctx context.Context, point model.Point, value any) error {
	// Simple implementation for Write
	// TODO: Integrate with scheduler for batch writes if needed

	d.mu.Lock()
	defer d.mu.Unlock()

	if !d.connected {
		return fmt.Errorf("driver not connected")
	}

	if d.scheduler == nil {
		return fmt.Errorf("scheduler not initialized (device not connected or not found)")
	}

	// Determine Priority and Value
	priority := btypes.NPDUPriority(16) // Default
	var writeVal any = value

	// Check if value is a map containing "value" and "priority"
	if valMap, ok := value.(map[string]any); ok {
		// If it's a map, try to extract 'value' and 'priority'
		// Note: This assumes the caller passes a map if they want to set priority
		if v, ok := valMap["value"]; ok {
			writeVal = v
		}
		if p, ok := valMap["priority"]; ok {
			if pInt, ok := p.(int); ok {
				priority = btypes.NPDUPriority(pInt)
			} else if pFloat, ok := p.(float64); ok {
				priority = btypes.NPDUPriority(int(pFloat))
			}
		}
	}

	// Handle Release (NULL)
	if writeVal == nil {
		writeVal = null.Null{}
	} else {
		// Type casting based on Point DataType
		switch point.DataType {
		case "float32":
			if v, ok := writeVal.(float64); ok {
				writeVal = float32(v)
			} else if v, ok := writeVal.(string); ok {
				if f, err := strconv.ParseFloat(v, 32); err == nil {
					writeVal = float32(f)
				}
			}
		case "int16", "int32", "int":
			if v, ok := writeVal.(float64); ok {
				writeVal = int32(v)
			} else if v, ok := writeVal.(int); ok {
				writeVal = int32(v)
			} else if v, ok := writeVal.(string); ok {
				if i, err := strconv.ParseInt(v, 10, 32); err == nil {
					writeVal = int32(i)
				}
			}
		case "uint16", "uint32", "uint":
			if v, ok := writeVal.(float64); ok {
				writeVal = uint32(v)
			} else if v, ok := writeVal.(int); ok {
				writeVal = uint32(v)
			} else if v, ok := writeVal.(string); ok {
				if i, err := strconv.ParseUint(v, 10, 32); err == nil {
					writeVal = uint32(i)
				}
			}
		case "bool", "boolean":
			// bool is usually fine, but handle string/int?
			if v, ok := writeVal.(string); ok {
				writeVal = (v == "true" || v == "1")
			} else if v, ok := writeVal.(float64); ok {
				writeVal = (v != 0)
			}
		case "enum", "enumerated":
			if v, ok := writeVal.(float64); ok {
				writeVal = btypes.Enumerated(v)
			} else if v, ok := writeVal.(int); ok {
				writeVal = btypes.Enumerated(v)
			}
		}
	}

	// Prepare Write Request via Scheduler
	var priorityVal uint8 = 16
	if priority != btypes.NPDUPriority(0) {
		priorityVal = uint8(priority)
	}

	writeReq := PointWriteRequest{
		Point:    point,
		Value:    writeVal,
		Priority: &priorityVal,
	}

	return d.scheduler.Write(ctx, []PointWriteRequest{writeReq})
}

func (d *BACnetDriver) Health() driver.HealthStatus {
	if d.connected && d.client != nil && d.client.IsRunning() {
		return driver.HealthStatusGood
	}
	return driver.HealthStatusBad
}

func (d *BACnetDriver) SetSlaveID(slaveID uint8) error {
	// Not applicable for BACnet IP usually, but could map to something else
	return nil
}

func (d *BACnetDriver) SetDeviceConfig(config map[string]any) error {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Update target config
	var newID int
	if v, ok := config["device_id"]; ok {
		if val, ok := v.(int); ok {
			newID = val
		} else if val, ok := v.(float64); ok {
			newID = int(val)
		}
	}

	var ip string
	if v, ok := config["ip"]; ok {
		if val, ok := v.(string); ok {
			ip = val
		}
	}

	var port int
	if v, ok := config["port"]; ok {
		if val, ok := v.(int); ok {
			port = val
		} else if val, ok := v.(float64); ok {
			port = int(val)
		}
	}

	log.Printf("[DEBUG] SetDeviceConfig: newID=%d, ip=%s, port=%d, targetDeviceID=%d, connected=%v, client=%v", newID, ip, port, d.targetDeviceID, d.connected, d.client)

	if newID != 0 {
		// Only discover if ID changed OR scheduler is nil (previous discovery failed)
		if d.targetDeviceID != newID || d.scheduler == nil {
			d.targetDeviceID = newID
			// If connected, trigger discovery immediately
			if d.connected && d.client != nil {
				if err := d.discoverDevice(d.targetDeviceID, ip, port); err != nil {
					log.Printf("[ERROR] Failed to discover updated device %d: %v", d.targetDeviceID, err)
					return err
				}
			}
		}
	}

	return nil
}

// Scan performs a device discovery (WhoIs) and optionally reads device details
func (d *BACnetDriver) Scan(ctx context.Context, params map[string]any) (any, error) {
	d.mu.Lock()
	defer d.mu.Unlock()

	var scanClient Client
	var err error
	var useTempClient bool

	var scanBroadcastDest *btypes.Address

	// Check if a specific interface is requested for scanning
	if v, ok := params["interface_ip"]; ok {
		if ifaceIP, ok := v.(string); ok && ifaceIP != "" {
			log.Printf("[INFO] Scan requested on specific interface: %s", ifaceIP)
			cb := &ClientBuilder{
				Ip:         ifaceIP,
				Port:       d.interfacePort,
				SubnetCIDR: d.subnetCIDR,
			}
			scanClient, err = d.clientFactory(cb)
			if err != nil {
				return nil, fmt.Errorf("failed to create client for scan on %s: %v", ifaceIP, err)
			}
			go scanClient.ClientRun()
			time.Sleep(100 * time.Millisecond) // Wait for bind
			useTempClient = true

			// Calculate broadcast address for this interface
			ip := net.ParseIP(ifaceIP)
			if ip != nil {
				mask := net.CIDRMask(d.subnetCIDR, 32)
				ipv4 := ip.To4()
				if ipv4 != nil {
					broadcast := make(net.IP, len(ipv4))
					for i := range ipv4 {
						broadcast[i] = ipv4[i] | ^mask[i]
					}
					port := d.interfacePort
					if port == 0 {
						port = 47808
					}
					scanBroadcastDest = datalink.IPPortToAddress(broadcast, port)
					log.Printf("[INFO] Calculated broadcast address: %s:%d", broadcast.String(), port)
				}
			}
		}
	}

	// Use existing client if no specific interface requested or creation failed
	if scanClient == nil {
		// Ensure default client is ready
		if d.client == nil {
			cb := &ClientBuilder{
				Ip:         d.interfaceIP,
				Port:       d.interfacePort,
				SubnetCIDR: d.subnetCIDR,
			}
			client, err := d.clientFactory(cb)
			if err != nil {
				return nil, fmt.Errorf("failed to create client for scan: %v", err)
			}
			d.client = client
			go d.client.ClientRun()
			time.Sleep(100 * time.Millisecond) // Wait for bind
		}
		scanClient = d.client
	}

	if useTempClient {
		defer scanClient.Close()
	}

	// Check if we are scanning for objects of a specific device
	if v, ok := params["device_id"]; ok {
		// If using a temp client, we can't easily use d.scanDeviceObjects because it might rely on d.client or d.targetDevice caching logic
		// But scanDeviceObjects uses d.client.
		// We should probably refactor scanDeviceObjects to accept a client, OR just handle device_id scan with the main client mostly.
		// Typically device_id scan (Object List) happens AFTER device is added/connected, so it uses the main driver connection.
		// If the user wants to scan objects of a device *before* adding it, they might provide interface_ip?
		// For now, let's assume object scan uses the main client or we'd need deeper refactoring.
		// If useTempClient is true, we should probably warn or handle it.
		// But looking at the UI, "Scan" button on DeviceList is for *Device Discovery*.
		// "Scan" on PointList is for *Object Discovery*.
		// The user request "Scan: add interactive selection of local network card" likely refers to Device Discovery.

		var devID int
		if val, ok := v.(int); ok {
			devID = val
		} else if val, ok := v.(float64); ok {
			devID = int(val)
		}
		// TODO: Pass scanClient to scanDeviceObjects if we want to support object scan on specific interface
		// For now, fall back to main logic which uses d.client
		if useTempClient {
			log.Printf("[WARN] Object scan with specific interface not fully supported yet, using main driver client")
		}
		return d.scanDeviceObjects(devID)
	}

	low := 0
	high := 4194303 // Max Device ID
	if v, ok := params["low_limit"]; ok {
		if val, ok := v.(int); ok {
			low = val
		} else if val, ok := v.(float64); ok {
			low = int(val)
		}
	}
	if v, ok := params["high_limit"]; ok {
		if val, ok := v.(int); ok {
			high = val
		} else if val, ok := v.(float64); ok {
			high = int(val)
		}
	}

	log.Printf("[INFO] Scanning BACnet network (Device IDs %d-%d) on Interface %s:%d...", low, high, d.interfaceIP, d.interfacePort)
	if useTempClient {
		log.Printf("[INFO] Using temporary client on interface %s", params["interface_ip"])
	}

	whois := &WhoIsOpts{
		Low:         low,
		High:        high,
		Destination: scanBroadcastDest,
	}

	devices, err := scanClient.WhoIs(whois)
	if err != nil {
		return nil, fmt.Errorf("scan failed: %v", err)
	}
	log.Printf("[INFO] Scan found %d devices", len(devices))

	// Helper to read property using the correct client
	readProp := func(dev btypes.Device, propID btypes.PropertyType) string {
		pd := btypes.PropertyData{
			Object: btypes.Object{
				ID: btypes.ObjectID{
					Type:     btypes.DeviceType,
					Instance: btypes.ObjectInstance(dev.DeviceID),
				},
				Properties: []btypes.Property{
					{
						Type:       propID,
						ArrayIndex: btypes.ArrayAll,
					},
				},
			},
		}
		resp, err := scanClient.ReadProperty(dev, pd)
		if err == nil && len(resp.Object.Properties) > 0 {
			if val, ok := resp.Object.Properties[0].Data.(string); ok {
				return val
			}
			return fmt.Sprintf("%v", resp.Object.Properties[0].Data)
		}
		return ""
	}

	type ScanResult struct {
		DeviceID     int    `json:"device_id"`
		IP           string `json:"ip"`
		Port         int    `json:"port"`
		Network      uint16 `json:"network_number"`
		VendorID     uint32 `json:"vendor_id"`
		VendorName   string `json:"vendor_name"`
		ModelName    string `json:"model_name"`
		ObjectName   string `json:"object_name"`
		MaxAPDU      uint32 `json:"max_apdu"`
		Segmentation uint32 `json:"segmentation"`
		Status       string `json:"status"`
	}

	results := make([]ScanResult, 0, len(devices))
	for _, dev := range devices {
		// Enrich with details
		vendorName := readProp(dev, btypes.PropVendorName)
		modelName := readProp(dev, btypes.PropModelName)
		objectName := readProp(dev, btypes.PropObjectName)

		res := ScanResult{
			DeviceID:     dev.DeviceID,
			IP:           dev.Ip,
			Port:         dev.Port,
			Network:      uint16(dev.NetworkNumber),
			VendorID:     dev.Vendor,
			VendorName:   vendorName,
			ModelName:    modelName,
			ObjectName:   objectName,
			MaxAPDU:      dev.MaxApdu,
			Segmentation: uint32(dev.Segmentation),
			Status:       "online",
		}
		results = append(results, res)
	}

	return results, nil
}

type ObjectResult struct {
	Type         string `json:"type"`
	Instance     int    `json:"instance"`
	Name         string `json:"name,omitempty"`
	Description  string `json:"description,omitempty"`
	Units        string `json:"units,omitempty"`
	PresentValue any    `json:"present_value,omitempty"`
	StatusFlags  string `json:"status_flags,omitempty"`
	Reliability  string `json:"reliability,omitempty"`
}

func (d *BACnetDriver) readDevicePropStr(dev btypes.Device, propID btypes.PropertyType) string {
	pd := btypes.PropertyData{
		Object: btypes.Object{
			ID: btypes.ObjectID{
				Type:     btypes.DeviceType,
				Instance: btypes.ObjectInstance(dev.DeviceID),
			},
			Properties: []btypes.Property{
				{
					Type:       propID,
					ArrayIndex: btypes.ArrayAll,
				},
			},
		},
	}
	resp, err := d.client.ReadProperty(dev, pd)
	if err == nil && len(resp.Object.Properties) > 0 {
		if val, ok := resp.Object.Properties[0].Data.(string); ok {
			return val
		}
		return fmt.Sprintf("%v", resp.Object.Properties[0].Data)
	}
	return ""
}

func (d *BACnetDriver) scanDeviceObjects(devID int) (any, error) {
	var dev btypes.Device

	// Optimization: If we are already connected to this device, use the cached address
	d.mu.Lock() // Ensure thread safety for reading targetDevice
	isTarget := (d.targetDeviceID == devID && d.connected && d.client != nil)
	cachedDev := d.targetDevice
	d.mu.Unlock() // Unlock before potentially long operations

	if isTarget {
		log.Printf("[INFO] scanDeviceObjects: Using cached address for device %d: %v", devID, cachedDev.Addr)
		dev = cachedDev
	} else {
		// 1. Find the device via WhoIs
		log.Printf("[INFO] scanDeviceObjects: Discovering device %d...", devID)
		whois := &WhoIsOpts{
			Low:  devID,
			High: devID,
		}
		// Try twice to be sure
		devices, err := d.client.WhoIs(whois)
		if err != nil || len(devices) == 0 {
			time.Sleep(500 * time.Millisecond)
			devices, err = d.client.WhoIs(whois)
		}

		if err != nil || len(devices) == 0 {
			return nil, fmt.Errorf("device %d not found (timeout or unreachable)", devID)
		}
		dev = devices[0]
		log.Printf("[INFO] scanDeviceObjects: Found device %d at %v", devID, dev.Addr)
	}

	// 2. Read ObjectList
	log.Printf("[INFO] Reading ObjectList for device %d...", devID)
	// ObjectList is an array of ObjectIDs.
	// We might need to read it index by index if it's too large, but let's try reading all.
	// ArrayAll means read the whole array.
	pd := btypes.PropertyData{
		Object: btypes.Object{
			ID: btypes.ObjectID{
				Type:     btypes.DeviceType,
				Instance: btypes.ObjectInstance(devID),
			},
			Properties: []btypes.Property{
				{
					Type:       btypes.PropObjectList,
					ArrayIndex: btypes.ArrayAll,
				},
			},
		},
	}

	resp, err := d.client.ReadProperty(dev, pd)
	if err != nil {
		log.Printf("[ERROR] Failed to read ObjectList (ArrayAll) for device %d: %v. Device might not support large reads.", devID, err)
		return nil, fmt.Errorf("failed to read object list: %v", err)
	}

	if len(resp.Object.Properties) == 0 {
		return []any{}, nil
	}

	data := resp.Object.Properties[0].Data

	// Data should be []btypes.ObjectID
	// But it might be parsed differently depending on decoding.
	// Let's assume it's []btypes.ObjectID

	var results []ObjectResult

	if list, ok := data.([]btypes.ObjectID); ok {
		// Optimization: Batch read Object Names
		// Split list into chunks to avoid APDU overflow
		chunkSize := 5 // Reduced for more properties

		for i := 0; i < len(list); i += chunkSize {
			end := i + chunkSize
			if end > len(list) {
				end = len(list)
			}
			chunk := list[i:end]

			// Build RPM request
			mpd := btypes.MultiplePropertyData{
				Objects: make([]btypes.Object, len(chunk)),
			}

			for j, oid := range chunk {
				mpd.Objects[j] = btypes.Object{
					ID: oid,
					Properties: []btypes.Property{
						{Type: btypes.PropObjectName, ArrayIndex: btypes.ArrayAll},
						{Type: btypes.PropDescription, ArrayIndex: btypes.ArrayAll},
						{Type: btypes.PropUnits, ArrayIndex: btypes.ArrayAll},
						{Type: btypes.PropPresentValue, ArrayIndex: btypes.ArrayAll},
						{Type: btypes.PropStatusFlags, ArrayIndex: btypes.ArrayAll},
						{Type: btypes.PropReliability, ArrayIndex: btypes.ArrayAll},
					},
				}
			}

			// Send Request
			resp, err := d.client.ReadMultiProperty(dev, mpd)

			// Map response for easy lookup
			respMap := make(map[string]*btypes.Object)
			if err == nil {
				for i := range resp.Objects {
					obj := &resp.Objects[i]
					key := fmt.Sprintf("%d:%d", obj.ID.Type, obj.ID.Instance)
					respMap[key] = obj
				}
			} else {
				log.Printf("[WARN] Failed to read batch properties for chunk %d: %v", i, err)
			}

			// Add to results
			for _, oid := range chunk {
				res := ObjectResult{
					Type:     oid.Type.String(),
					Instance: int(oid.Instance),
				}

				key := fmt.Sprintf("%d:%d", oid.Type, oid.Instance)
				if obj, found := respMap[key]; found {
					for _, prop := range obj.Properties {
						switch prop.Type {
						case btypes.PropObjectName:
							if v, ok := prop.Data.(string); ok {
								res.Name = v
							}
						case btypes.PropDescription:
							if v, ok := prop.Data.(string); ok {
								res.Description = v
							}
						case btypes.PropUnits:
							if v, ok := prop.Data.(btypes.Enumerated); ok {
								res.Units = units.Unit(v).String()
							} else if v, ok := prop.Data.(uint); ok {
								res.Units = units.Unit(v).String()
							} else if v, ok := prop.Data.(float64); ok {
								res.Units = units.Unit(v).String()
							} else if v, ok := prop.Data.(int); ok {
								res.Units = units.Unit(v).String()
							} else {
								res.Units = fmt.Sprintf("%v", prop.Data)
							}
						case btypes.PropPresentValue:
							res.PresentValue = prop.Data
						case btypes.PropStatusFlags:
							if v, ok := prop.Data.(btypes.BitString); ok {
								res.StatusFlags = v.String()
							} else if v, ok := prop.Data.(string); ok {
								res.StatusFlags = v
							} else {
								res.StatusFlags = fmt.Sprintf("%v", prop.Data)
							}
						case btypes.PropReliability:
							res.Reliability = fmt.Sprintf("%v", prop.Data)
						}
					}
				}
				results = append(results, res)
			}
		}
	} else {
		// Fallback or log error
		log.Printf("[WARN] ObjectList data is not []ObjectID: %T", data)
	}

	return results, nil
}
