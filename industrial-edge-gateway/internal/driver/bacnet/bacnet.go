package bacnet

import (
	"context"
	"encoding/json"
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

// dependency injection for testing
var getInterfaceIPs = func() ([]string, error) {
	var ips []string
	ifaces, err := net.Interfaces()
	if err != nil {
		return nil, err
	}
	for _, i := range ifaces {
		if i.Flags&net.FlagUp == 0 || i.Flags&net.FlagLoopback != 0 {
			continue
		}
		addrs, _ := i.Addrs()
		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}
			if ip != nil && ip.To4() != nil {
				ips = append(ips, ip.String())
			}
		}
	}
	return ips, nil
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
	targetIP       string
	targetPort     int

	// Multi-device support
	deviceContexts map[int]*DeviceContext
	targetDevice   btypes.Device

	connected     bool
	lastDiscovery time.Time

	// History of discovered objects for each device
	// Map: DeviceID -> Map: ObjectKey(Type:Instance) -> ObjectResult
	historicalObjects map[int]map[string]ObjectResult
}

type DeviceConfig struct {
	DeviceID int
	IP       string
	Port     int
}

type DeviceContext struct {
	Device        btypes.Device
	Scheduler     *PointScheduler
	Config        DeviceConfig
	LastDiscovery time.Time
}

func NewBACnetDriver() driver.Driver {
	return &BACnetDriver{
		interfacePort:     47808,     // Default BACnet port
		interfaceIP:       "0.0.0.0", // Default IP
		subnetCIDR:        24,        // Default CIDR
		connected:         false,
		clientFactory:     NewClient,
		historicalObjects: make(map[int]map[string]ObjectResult),
		deviceContexts:    make(map[int]*DeviceContext),
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

	if v, ok := config.Config["ip"]; ok {
		d.targetIP = fmt.Sprintf("%v", v)
	}
	if v, ok := config.Config["port"]; ok {
		if val, ok := v.(int); ok {
			d.targetPort = val
		} else if val, ok := v.(float64); ok {
			d.targetPort = int(val)
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
		if err := d.discoverDevice(d.targetDeviceID, d.targetIP, d.targetPort); err != nil {
			log.Printf("[WARN] Initial discovery failed for device %d: %v. Driver will start in disconnected state.", d.targetDeviceID, err)
			// Do NOT close client here; we need it for recovery/retry
			// d.client.Close()
			// d.client = nil
			// return err
		} else {
			d.connected = true
		}
	} else {
		// No target device configured yet, but driver is ready
		d.connected = true
	}

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

	d.deviceContexts[deviceID] = &DeviceContext{
		Device: devices[0],
		Config: DeviceConfig{
			DeviceID: deviceID,
			IP:       ip,
			Port:     port,
		},
		LastDiscovery: time.Now(),
	}
	targetDevCtx := d.deviceContexts[deviceID]
	log.Printf("[INFO] Found BACnet device %d at %v", deviceID, targetDevCtx.Device.Addr)

	// Fix: If configured port is different from discovered port (e.g. ephemeral), override it.
	if port != 0 && len(targetDevCtx.Device.Addr.Mac) == 6 {
		discPort := int(targetDevCtx.Device.Addr.Mac[4])<<8 | int(targetDevCtx.Device.Addr.Mac[5])
		if discPort != port {
			log.Printf("[WARN] Discovered device port %d differs from configured port %d. Overriding to %d to ensure connectivity.", discPort, port, port)
			targetDevCtx.Device.Addr.Mac[4] = uint8(port >> 8)
			targetDevCtx.Device.Addr.Mac[5] = uint8(port & 0xFF)
			log.Printf("[INFO] Updated target device address to: %v", targetDevCtx.Device.Addr)
		}
	}

	// Initialize Scheduler
	targetDevCtx.Scheduler = NewPointScheduler(d.client, targetDevCtx.Device, 20, 10*time.Millisecond, 10*time.Second)
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
	d.mu.Lock()
	targetID := d.targetDeviceID
	devCtx, exists := d.deviceContexts[targetID]
	d.mu.Unlock()

	if !exists || devCtx.Scheduler == nil {
		// Trigger recovery if scheduler is missing (device offline or not found)
		d.checkRecovery(targetID)
		return nil, fmt.Errorf("scheduler not initialized for device %d", targetID)
	}
	results, err := devCtx.Scheduler.Read(ctx, points)
	if err != nil {
		// Auto-Correction: If read failed on non-standard port, try standard BACnet port (47808)
		// This handles simulators that respond from ephemeral ports but listen on 47808.
		currentPort := int(devCtx.Device.Addr.Mac[4])<<8 | int(devCtx.Device.Addr.Mac[5])
		if currentPort != 47808 {
			log.Printf("[WARN] ReadPoints failed on port %d for device %d. Trying fallback to 47808...", currentPort, targetID)

			// Create a temporary device copy with port 47808
			tempDevice := devCtx.Device
			tempDevice.Addr.Mac[4] = uint8(47808 >> 8)
			tempDevice.Addr.Mac[5] = uint8(47808 & 0xFF)

			// Try immediate read with this device (bypassing scheduler for quick check)
			// We need a helper for direct read or just try to create a temp scheduler?
			// Let's try to just update the context if we are confident, or test first.
			// Testing first is safer.
			// We can use d.client.ReadProperty to test connectivity.
			// Pick the first point to test.
			if len(points) > 0 {
				// Construct minimal PropertyData
				// Map point address to object type/instance...
				// This is complex to do manually here.
				// Easier strategy: Update the device context speculatively and retry via Scheduler?
				// But Scheduler needs to be recreated.

				log.Printf("[INFO] Speculatively updating device %d to port 47808 and recreating scheduler...", targetID)

				// Update Device Address
				devCtx.Device.Addr.Mac[4] = uint8(47808 >> 8)
				devCtx.Device.Addr.Mac[5] = uint8(47808 & 0xFF)

				// Update Config
				devCtx.Config.Port = 47808

				// Recreate Scheduler
				devCtx.Scheduler = NewPointScheduler(d.client, devCtx.Device, 20, 10*time.Millisecond, 10*time.Second)

				// Retry Read
				log.Printf("[INFO] Retrying ReadPoints with port 47808...")
				var err2 error
				results, err2 = devCtx.Scheduler.Read(ctx, points)
				if err2 == nil {
					log.Printf("[INFO] SUCCESS: Fallback to port 47808 worked for device %d. Configuration updated.", targetID)
					err = nil // Clear error
				} else {
					log.Printf("[WARN] Fallback to port 47808 also failed: %v. Reverting...", err2)
					// Revert (optional, but good practice if we want to be correct)
					// Actually, if both failed, maybe 47808 is better anyway?
					// Or maybe the device is just offline.
					// Let's leave it as 47808 because it's the standard.
					// If it failed, checkRecovery will trigger later.
					err = err2
				}
			}
		}

		if err != nil {
			// Trigger recovery if read still fails
			d.checkRecovery(targetID)
		}
	}
	return results, err
}

func (d *BACnetDriver) checkRecovery(deviceID int) {
	d.mu.Lock()
	log.Printf("[DEBUG] checkRecovery called for device %d", deviceID)
	if d.client == nil {
		log.Printf("[DEBUG] checkRecovery: d.client is nil!")
		d.mu.Unlock()
		return
	}

	var ip string
	var port int
	var lastDiscovery time.Time
	var isContextExists bool

	devCtx, exists := d.deviceContexts[deviceID]
	if exists {
		log.Printf("[DEBUG] checkRecovery: context found for device %d", deviceID)
		lastDiscovery = devCtx.LastDiscovery
		ip = devCtx.Config.IP
		port = devCtx.Config.Port
		isContextExists = true
	} else {
		log.Printf("[DEBUG] checkRecovery: context NOT found for device %d (target: %d)", deviceID, d.targetDeviceID)
		// Fallback: If this is the target device, use driver config
		if deviceID == d.targetDeviceID {
			lastDiscovery = d.lastDiscovery
			ip = d.targetIP
			port = d.targetPort
		} else {
			// Unknown device, cannot recover
			d.mu.Unlock()
			return
		}
	}

	if time.Since(lastDiscovery) < 30*time.Second {
		log.Printf("[DEBUG] checkRecovery skipped for device %d: too soon (last: %v, since: %v)", deviceID, lastDiscovery, time.Since(lastDiscovery))
		d.mu.Unlock()
		return
	}

	// Update timestamp to prevent spamming
	log.Printf("[DEBUG] checkRecovery triggering for device %d", deviceID)
	if isContextExists {
		devCtx.LastDiscovery = time.Now()
		log.Printf("[DEBUG] discoverDevice: Updated LastDiscovery for device %d to %v", deviceID, devCtx.LastDiscovery)
	} else {
		d.lastDiscovery = time.Now()
		log.Printf("[DEBUG] discoverDevice: Updated driver.lastDiscovery to %v", d.lastDiscovery)
	}
	d.mu.Unlock()

	go func() {
		d.mu.Lock()
		defer d.mu.Unlock()

		// Re-check client in case it was closed in between (unlikely)
		if d.client == nil {
			return
		}

		// Refresh config from context to ensure we use the latest settings
		// This prevents race conditions where an external update (e.g. SetDeviceConfig)
		// has changed the target port (e.g. override to 47808) but we are using stale values.
		if ctx, ok := d.deviceContexts[deviceID]; ok {
			ip = ctx.Config.IP
			port = ctx.Config.Port
		}

		log.Printf("[INFO] Auto-recovering BACnet connection for device %d...", deviceID)
		if err := d.discoverDevice(deviceID, ip, port); err != nil {
			log.Printf("[ERROR] Auto-recovery failed: %v", err)
		} else {
			d.connected = true
			log.Printf("[INFO] Auto-recovery successful for device %d", deviceID)
		}
	}()
}

func (d *BACnetDriver) WritePoint(ctx context.Context, point model.Point, value any) error {
	// Simple implementation for Write
	// TODO: Integrate with scheduler for batch writes if needed

	d.mu.Lock()
	defer d.mu.Unlock()

	if !d.connected {
		return fmt.Errorf("driver not connected")
	}

	devCtx, exists := d.deviceContexts[d.targetDeviceID]
	if !exists || devCtx.Scheduler == nil {
		return fmt.Errorf("scheduler not initialized for device %d", d.targetDeviceID)
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

	return devCtx.Scheduler.Write(ctx, []PointWriteRequest{writeReq})
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

	if v, ok := config["ip"]; ok {
		if val, ok := v.(string); ok {
			d.targetIP = val
		}
	}

	if v, ok := config["port"]; ok {
		if val, ok := v.(int); ok {
			d.targetPort = val
		} else if val, ok := v.(float64); ok {
			d.targetPort = int(val)
		}
	}

	log.Printf("[DEBUG] SetDeviceConfig: newID=%d, ip=%s, port=%d, targetDeviceID=%d, connected=%v, client=%v", newID, d.targetIP, d.targetPort, d.targetDeviceID, d.connected, d.client)

	if newID != 0 {
		d.targetDeviceID = newID
		// Only discover if context missing or config changed or scheduler is nil
		ctx, exists := d.deviceContexts[newID]
		needDiscovery := false

		if !exists {
			needDiscovery = true
		} else {
			if d.targetIP != "" && ctx.Config.IP != d.targetIP {
				needDiscovery = true
			}
			if d.targetPort != 0 && ctx.Config.Port != d.targetPort {
				needDiscovery = true
			}
			if ctx.Scheduler == nil {
				needDiscovery = true
			}
		}

		if needDiscovery {
			// If connected, trigger discovery immediately
			if d.connected && d.client != nil {
				if err := d.discoverDevice(d.targetDeviceID, d.targetIP, d.targetPort); err != nil {
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
	log.Printf("[INFO] BACnetDriver.Scan called with params: %v", params)
	d.mu.Lock()
	defaultInterfacePort := d.interfacePort
	defaultSubnetCIDR := d.subnetCIDR
	clientFactory := d.clientFactory
	// Use default client if we are not scanning multiple interfaces and no specific interface is requested
	defaultClient := d.client
	d.mu.Unlock()

	// 1. Check if we are scanning for objects of a specific device (different mode)
	if v, ok := params["device_id"]; ok {
		var devID int
		if val, ok := v.(int); ok {
			devID = val
		} else if val, ok := v.(float64); ok {
			devID = int(val)
		}

		// For object scan, we use the default client or a specific one if requested
		// This part is kept simple to preserve existing behavior
		scanClient := defaultClient
		if v, ok := params["interface_ip"]; ok {
			if ifaceIP, ok := v.(string); ok && ifaceIP != "" {
				cb := &ClientBuilder{
					Ip:         ifaceIP,
					Port:       defaultInterfacePort,
					SubnetCIDR: defaultSubnetCIDR,
				}
				if cli, err := clientFactory(cb); err == nil {
					scanClient = cli
					defer cli.Close()
					go cli.ClientRun()
					time.Sleep(100 * time.Millisecond)
				}
			}
		}
		return d.scanDeviceObjects(scanClient, devID)
	}

	// 2. Device Discovery Mode
	targetIPs := []string{}

	// Check if a specific interface is requested
	if v, ok := params["interface_ip"]; ok {
		if ifaceIP, ok := v.(string); ok && ifaceIP != "" {
			targetIPs = append(targetIPs, ifaceIP)
		}
	}

	// If no specific interface, find all valid IPv4 interfaces
	if len(targetIPs) == 0 {
		if ips, err := getInterfaceIPs(); err != nil {
			log.Printf("[WARN] Failed to list interface IPs for scan: %v", err)
		} else {
			targetIPs = append(targetIPs, ips...)
		}
	}

	// If still no IPs found (e.g. error or no interfaces), use a placeholder to trigger default client usage?
	// Actually, if targetIPs is empty, we might want to use the defaultClient logic.
	// But let's stick to the plan: if targetIPs is empty, we try 0.0.0.0 or just use defaultClient.
	useDefaultClient := len(targetIPs) == 0

	log.Printf("[INFO] Scan targetIPs: %v, useDefaultClient: %v", targetIPs, useDefaultClient)

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

	var foundDevices []btypes.Device
	var mu sync.Mutex
	var wg sync.WaitGroup

	scanOnInterface := func(ifaceIP string, useDefault bool) {
		defer wg.Done()

		var scanClient Client
		var err error
		var broadcastDest *btypes.Address

		// Determine if we should use the default client
		// 1. Explicitly requested (useDefault = true)
		// 2. The interface IP matches the driver's configured interface IP
		// 3. The driver is bound to all interfaces (0.0.0.0) - in this case we use it for everything
		shouldUseDefault := useDefault
		if !shouldUseDefault && defaultClient != nil {
			if d.interfaceIP == "0.0.0.0" || d.interfaceIP == ifaceIP {
				shouldUseDefault = true
			}
		}

		if shouldUseDefault {
			scanClient = defaultClient
			if scanClient == nil {
				return
			}
			log.Printf("[INFO] Scanning on default client (%s)...", d.interfaceIP)

			// If we are reusing the default client but scanning a specific interface (ifaceIP),
			// we should calculate the broadcast address for that interface and use it.
			if ifaceIP != "" && ifaceIP != "0.0.0.0" {
				ip := net.ParseIP(ifaceIP)
				if ip != nil {
					mask := net.CIDRMask(defaultSubnetCIDR, 32)
					ipv4 := ip.To4()
					if ipv4 != nil {
						broadcast := make(net.IP, len(ipv4))
						for i := range ipv4 {
							broadcast[i] = ipv4[i] | ^mask[i]
						}
						// Use standard BACnet port 47808 for broadcast, as most devices listen there.
						// Using defaultInterfacePort (our binding port) is wrong if we are on a non-standard port (e.g. 47809).
						port := 47808
						broadcastDest = datalink.IPPortToAddress(broadcast, port)
						log.Printf("[INFO] Calculated broadcast address for %s using default client: %s:%d", ifaceIP, broadcast.String(), port)
					}
				}
			}

		} else {
			cb := &ClientBuilder{
				Ip:         ifaceIP,
				Port:       defaultInterfacePort,
				SubnetCIDR: defaultSubnetCIDR,
			}
			scanClient, err = clientFactory(cb)
			if err != nil {
				log.Printf("[WARN] Failed to create client for scan on %s: %v", ifaceIP, err)
				return
			}
			defer scanClient.Close()
			go scanClient.ClientRun()
			time.Sleep(100 * time.Millisecond)

			// Calculate broadcast address
			ip := net.ParseIP(ifaceIP)
			if ip != nil {
				mask := net.CIDRMask(defaultSubnetCIDR, 32)
				ipv4 := ip.To4()
				if ipv4 != nil {
					broadcast := make(net.IP, len(ipv4))
					for i := range ipv4 {
						broadcast[i] = ipv4[i] | ^mask[i]
					}
					// Always broadcast to standard BACnet port 47808
					port := 47808
					broadcastDest = datalink.IPPortToAddress(broadcast, port)
					log.Printf("[INFO] Calculated broadcast address for %s: %s:%d", ifaceIP, broadcast.String(), port)
				}
			}
		}

		whois := &WhoIsOpts{
			Low:         low,
			High:        high,
			Destination: broadcastDest,
		}

		devices, err := scanClient.WhoIs(whois)
		if err != nil {
			log.Printf("[WARN] Scan failed on %s: %v", ifaceIP, err)
			return
		}
		log.Printf("[INFO] Scan on %s found %d devices", ifaceIP, len(devices))

		// Also try Unicast to the interface IP itself (port 47808) to find local simulators
		// This is necessary because if we are bound to 47809, we might miss Broadcast I-Am responses
		// from devices on 47808 (unless we listen on 47808).
		// Unicast WhoIs triggers Unicast I-Am, which we CAN receive.

		// Determine the target IP for unicast: use ifaceIP if provided, otherwise d.interfaceIP
		targetUnicastIP := ifaceIP
		if targetUnicastIP == "" && shouldUseDefault {
			d.mu.Lock()
			targetUnicastIP = d.interfaceIP
			d.mu.Unlock()
		}

		if targetUnicastIP != "" && targetUnicastIP != "0.0.0.0" {
			ip := net.ParseIP(targetUnicastIP)
			if ip != nil {
				unicastDest := datalink.IPPortToAddress(ip, 47808)
				unicastWhoIs := &WhoIsOpts{
					Low:         low,
					High:        high,
					Destination: unicastDest,
				}
				log.Printf("[INFO] Also sending Unicast WhoIs to %s:47808", targetUnicastIP)
				if dev2, err := scanClient.WhoIs(unicastWhoIs); err == nil {
					log.Printf("[INFO] Unicast Scan to %s found %d devices", targetUnicastIP, len(dev2))
					devices = append(devices, dev2...)
				} else {
					log.Printf("[WARN] Unicast Scan failed on %s: %v", targetUnicastIP, err)
				}
			}
		}

		mu.Lock()
		foundDevices = append(foundDevices, devices...)
		mu.Unlock()
	}

	if useDefaultClient {
		wg.Add(1)
		go scanOnInterface("", true)
	} else {
		for _, ip := range targetIPs {
			wg.Add(1)
			// Check if this IP matches the driver's bound IP, or if driver is bound to all interfaces
			isDriverIP := ip == d.interfaceIP || d.interfaceIP == "0.0.0.0"
			log.Printf("[DEBUG] Scan loop: ip=%s, d.interfaceIP=%s, isDriverIP=%v", ip, d.interfaceIP, isDriverIP)
			go scanOnInterface(ip, useDefaultClient || isDriverIP)
		}
	}

	wg.Wait()

	// Deduplicate devices by DeviceID
	uniqueDevices := make(map[int]btypes.Device)
	for _, dev := range foundDevices {
		uniqueDevices[dev.DeviceID] = dev
	}

	var ids []btypes.ObjectInstance
	for _, dev := range uniqueDevices {
		ids = append(ids, dev.ID.Instance)
	}
	log.Printf("[INFO] Scan finished. Found %d unique devices: %v", len(uniqueDevices), ids)

	// Enrich details (Vendor, Model, etc.)
	// We can pick any client to read properties, or we should use the one that found it?
	// Ideally, we should use a client that can reach it.
	// For simplicity, we'll try to use a temporary client bound to the device's IP network if possible,
	// OR just use the default client if it's connected.
	// Actually, `Scan` in `bacnet.go` used `scanClient.ReadProperty`.
	// Since we closed the temp clients, we need a way to read properties.
	// We can spin up a client just for reading, or assume the default client can reach them (if routing exists).
	// However, if we found a device on a specific subnet that the default client (0.0.0.0) cannot reach?
	// 0.0.0.0 *should* be able to reach if routing is set up.
	// Let's use the default client for reading properties if available.

	// Re-acquire default client in case it changed (unlikely)
	d.mu.Lock()
	readerClient := d.client
	d.mu.Unlock()

	// If default client is not ready/connected, we might fail to read properties.
	// But `Scan` is often used to configure the system, so we might not have a main client yet?
	// If readerClient is nil, we should create a temporary one.
	if readerClient == nil {
		cb := &ClientBuilder{
			Ip:         d.interfaceIP, // 0.0.0.0 usually
			Port:       defaultInterfacePort,
			SubnetCIDR: defaultSubnetCIDR,
		}
		if cli, err := clientFactory(cb); err == nil {
			readerClient = cli
			defer cli.Close()
			go cli.ClientRun()
			time.Sleep(100 * time.Millisecond)
		}
	}

	// Convert map to slice for parallel processing
	deviceList := make([]btypes.Device, 0, len(uniqueDevices))
	for _, dev := range uniqueDevices {
		deviceList = append(deviceList, dev)
	}

	results := make([]ScanResult, len(deviceList))
	var wgEnrich sync.WaitGroup

	// Helper to read property
	readProp := func(dev btypes.Device, propID btypes.PropertyType) string {
		if readerClient == nil {
			return ""
		}
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
		resp, err := readerClient.ReadProperty(dev, pd)
		if err == nil && len(resp.Object.Properties) > 0 {
			if val, ok := resp.Object.Properties[0].Data.(string); ok {
				return val
			}
			return fmt.Sprintf("%v", resp.Object.Properties[0].Data)
		}
		return ""
	}

	for i, dev := range deviceList {
		wgEnrich.Add(1)
		go func(idx int, device btypes.Device) {
			defer wgEnrich.Done()
			// Enrich with details
			vendorName := readProp(device, btypes.PropVendorName)
			modelName := readProp(device, btypes.PropModelName)
			objectName := readProp(device, btypes.PropObjectName)

			res := ScanResult{
				DeviceID:     device.DeviceID,
				IP:           device.Ip,
				Port:         device.Port,
				Network:      uint16(device.NetworkNumber),
				VendorID:     device.Vendor,
				VendorName:   vendorName,
				ModelName:    modelName,
				ObjectName:   objectName,
				MaxAPDU:      device.MaxApdu,
				Segmentation: uint32(device.Segmentation),
				Status:       "online",
			}
			results[idx] = res
		}(i, dev)
	}

	wgEnrich.Wait()

	// Log the results for debugging
	if data, err := json.Marshal(results); err == nil {
		log.Printf("[INFO] Scan results: %s", string(data))
	}

	return results, nil
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

type ObjectResult struct {
	Type         string `json:"type"`
	Instance     int    `json:"instance"`
	Name         string `json:"name,omitempty"`
	Description  string `json:"description,omitempty"`
	Units        string `json:"units,omitempty"`
	PresentValue any    `json:"present_value,omitempty"`
	StatusFlags  string `json:"status_flags,omitempty"`
	Reliability  string `json:"reliability,omitempty"`
	DiffStatus   string `json:"diff_status"` // new, existing, removed
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

func (d *BACnetDriver) scanDeviceObjects(client Client, devID int) (any, error) {
	var dev btypes.Device

	// Optimization: If we are already connected to this device, use the cached address
	d.mu.Lock() // Ensure thread safety

	// Use passed client or default to d.client
	if client == nil {
		client = d.client
	}

	var cachedDev btypes.Device
	var hasCached bool
	if ctx, ok := d.deviceContexts[devID]; ok {
		cachedDev = ctx.Device
		hasCached = true
	}
	d.mu.Unlock() // Unlock before potentially long operations

	if client == nil {
		return nil, fmt.Errorf("no BACnet client available for object scan")
	}

	if hasCached {
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
		devices, err := client.WhoIs(whois)
		if err != nil || len(devices) == 0 {
			time.Sleep(500 * time.Millisecond)
			devices, err = client.WhoIs(whois)
		}

		// Fallback: Try Unicast to interface IP (for local simulators)
		if (err != nil || len(devices) == 0) && d.interfaceIP != "" && d.interfaceIP != "0.0.0.0" {
			log.Printf("[INFO] scanDeviceObjects: Broadcast WhoIs failed, trying Unicast to %s:47808", d.interfaceIP)
			ip := net.ParseIP(d.interfaceIP)
			if ip != nil {
				unicastDest := datalink.IPPortToAddress(ip, 47808)
				unicastWhoIs := &WhoIsOpts{
					Low:         devID,
					High:        devID,
					Destination: unicastDest,
				}
				if dev2, err2 := client.WhoIs(unicastWhoIs); err2 == nil && len(dev2) > 0 {
					devices = append(devices, dev2...)
					err = nil
				}
			}
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

	resp, err := client.ReadProperty(dev, pd)
	if err != nil {
		log.Printf("[ERROR] Failed to read ObjectList (ArrayAll) for device %d: %v. Device might not support large reads.", devID, err)
		return nil, fmt.Errorf("failed to read object list: %v", err)
	}

	if len(resp.Object.Properties) == 0 {
		log.Printf("[WARN] ObjectList response has no properties")
		return []any{}, nil
	}

	data := resp.Object.Properties[0].Data
	log.Printf("[INFO] ObjectList data type: %T", data)

	// Data should be []btypes.ObjectID
	// But it might be parsed differently depending on decoding.
	// Let's assume it's []btypes.ObjectID

	var results []ObjectResult

	var objectIDs []btypes.ObjectID

	if list, ok := data.([]btypes.ObjectID); ok {
		objectIDs = list
	} else if list, ok := data.([]interface{}); ok {
		for _, item := range list {
			if oid, ok := item.(btypes.ObjectID); ok {
				objectIDs = append(objectIDs, oid)
			}
		}
	} else {
		log.Printf("[WARN] ObjectList data is not []ObjectID: %T", data)
		return []any{}, nil
	}

	// Optimization: Batch read Object Names
	// Split list into chunks to avoid APDU overflow
	chunkSize := 5 // Reduced for more properties

	for i := 0; i < len(objectIDs); i += chunkSize {
		end := i + chunkSize
		if end > len(objectIDs) {
			end = len(objectIDs)
		}
		chunk := objectIDs[i:end]

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
		resp, err := client.ReadMultiProperty(dev, mpd)

		// Map response for easy lookup
		respMap := make(map[string]*btypes.Object)
		if err == nil {
			for i := range resp.Objects {
				obj := &resp.Objects[i]
				key := fmt.Sprintf("%d:%d", obj.ID.Type, obj.ID.Instance)
				respMap[key] = obj
			}
		} else {
			log.Printf("[WARN] Failed to read batch properties for chunk %d: %v. Falling back to individual reads.", i, err)
			// Fallback: Read individually
			for _, oid := range chunk {
				// Create a dummy object to hold results
				obj := &btypes.Object{
					ID:         oid,
					Properties: []btypes.Property{},
				}

				// Define properties we want to read
				propsToRead := []btypes.PropertyType{
					btypes.PropObjectName,
					btypes.PropDescription,
					btypes.PropUnits,
					btypes.PropPresentValue,
					btypes.PropStatusFlags,
					btypes.PropReliability,
				}

				for _, pType := range propsToRead {
					pd := btypes.PropertyData{
						Object: btypes.Object{
							ID: oid,
							Properties: []btypes.Property{
								{Type: pType, ArrayIndex: btypes.ArrayAll},
							},
						},
					}
					// Use ReadProperty (single)
					if resProp, errProp := client.ReadProperty(dev, pd); errProp == nil && len(resProp.Object.Properties) > 0 {
						obj.Properties = append(obj.Properties, resProp.Object.Properties[0])
					}
				}

				key := fmt.Sprintf("%d:%d", oid.Type, oid.Instance)
				respMap[key] = obj
			}
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

	// --- Diff Logic: New / Existing / Removed ---
	d.mu.Lock()
	if d.historicalObjects == nil {
		d.historicalObjects = make(map[int]map[string]ObjectResult)
	}
	history, hasHistory := d.historicalObjects[devID]
	// If no history (first scan), treat as empty map
	if !hasHistory {
		history = make(map[string]ObjectResult)
	}

	currentMap := make(map[string]ObjectResult)
	finalResults := make([]ObjectResult, 0, len(results))

	for i := range results {
		res := results[i]
		// Construct a unique key.
		// Note: res.Type is string representation.
		key := fmt.Sprintf("%s:%d", res.Type, res.Instance)

		// Deduplicate: If we already processed this key in the current scan, skip it.
		if _, exists := currentMap[key]; exists {
			log.Printf("[WARN] Duplicate object detected in scan: %s. Merging/Skipping.", key)
			continue
		}

		if hasHistory {
			if _, exists := history[key]; exists {
				res.DiffStatus = "existing"
			} else {
				res.DiffStatus = "new"
			}
		} else {
			res.DiffStatus = "new"
		}

		currentMap[key] = res
		finalResults = append(finalResults, res)
	}

	// Identify removed objects
	if hasHistory {
		for key, oldObj := range history {
			if _, exists := currentMap[key]; !exists {
				oldObj.DiffStatus = "removed"
				finalResults = append(finalResults, oldObj)
			}
		}
	}

	// Update history with current valid objects
	d.historicalObjects[devID] = currentMap
	d.mu.Unlock()

	return finalResults, nil
}
