package bacnet

import (
	"net"
	"strconv"
	"time"

	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/driver/bacnet/datalink"

	"go.uber.org/zap"
)

const defaultBACnetPort = 47808

// whoIsDiscoverDevice locates a BACnet device when its UDP port may have changed
// after reboot. Who-Is is sent to the standard port first, then optional hints,
// then broadcast.
func (d *BACnetDriver) whoIsDiscoverDevice(client Client, deviceID int, ip string, portHint int) (btypes.Device, bool) {
	if client == nil {
		return btypes.Device{}, false
	}

	whoisBase := &WhoIsOpts{Low: deviceID, High: deviceID}

	if ip != "" {
		parsedIP := net.ParseIP(ip)
		if parsedIP != nil {
			ports := []int{defaultBACnetPort}
			if portHint != 0 && portHint != defaultBACnetPort {
				ports = append(ports, portHint)
			}
			for _, p := range ports {
				whois := *whoisBase
				whois.Destination = datalink.IPPortToAddress(parsedIP, p)
				devices, err := client.WhoIs(&whois)
				if dev, ok := matchWhoIsDevice(devices, err, deviceID); ok {
					return dev, true
				}
			}
		}
	}

	whois := *whoisBase
	whois.Destination = nil
	time.Sleep(500 * time.Millisecond)
	devices, err := client.WhoIs(&whois)
	if dev, ok := matchWhoIsDevice(devices, err, deviceID); ok {
		return dev, true
	}

	return btypes.Device{}, false
}

func matchWhoIsDevice(devices []btypes.Device, err error, deviceID int) (btypes.Device, bool) {
	if err != nil || len(devices) == 0 {
		return btypes.Device{}, false
	}
	for _, dev := range devices {
		if dev.DeviceID == deviceID {
			return dev, true
		}
	}
	if len(devices) == 1 {
		return devices[0], true
	}
	return btypes.Device{}, false
}

func devicePortFromAddr(dev btypes.Device) int {
	if dev.Port != 0 {
		return dev.Port
	}
	if len(dev.Addr.Mac) >= 6 {
		return int(dev.Addr.Mac[4])<<8 | int(dev.Addr.Mac[5])
	}
	return defaultBACnetPort
}

func deviceIPFromAddr(dev btypes.Device, fallback string) string {
	if dev.Ip != "" {
		return dev.Ip
	}
	if len(dev.Addr.Mac) >= 4 {
		return net.IP([]byte{dev.Addr.Mac[0], dev.Addr.Mac[1], dev.Addr.Mac[2], dev.Addr.Mac[3]}).String()
	}
	return fallback
}

// applyDiscoveredDeviceLocked updates runtime device context; caller must hold d.mu.
func (d *BACnetDriver) applyDiscoveredDeviceLocked(deviceID int, configuredIP string, configuredPort int, found btypes.Device) {
	resolvedIP := deviceIPFromAddr(found, configuredIP)
	resolvedPort := devicePortFromAddr(found)

	devCtx, exists := d.deviceContexts[deviceID]
	if !exists {
		devCtx = &DeviceContext{
			Config: DeviceConfig{DeviceID: deviceID, IP: configuredIP, Port: configuredPort},
		}
		d.deviceContexts[deviceID] = devCtx
	}

	oldPort := devCtx.Config.Port
	devCtx.Device = found
	devCtx.Config.IP = resolvedIP
	devCtx.Config.Port = resolvedPort
	devCtx.LastDiscovery = time.Now()
	devCtx.Scheduler = NewPointScheduler(d.client, devCtx.Device, 20, 10*time.Millisecond, 10*time.Second, d.useDataformatDecoder)

	devCtx.State = DeviceStateOnline
	devCtx.ConsecutiveFailures = 0
	devCtx.IsolationCount = 0
	devCtx.IsolationUntil = time.Time{}

	deviceKey := devCtx.DeviceKey
	if deviceKey == "" {
		deviceKey = d.deviceKeyForInstance(deviceID)
	}

	if oldPort != resolvedPort || (configuredIP != "" && configuredIP != resolvedIP) {
		zap.L().Info("BACnet device address updated after discovery",
			zap.Int("device_id", deviceID),
			zap.String("device_key", deviceKey),
			zap.String("ip", resolvedIP),
			zap.Int("old_port", oldPort),
			zap.Int("new_port", resolvedPort),
		)
	}

	d.notifyAddressChange(deviceKey, resolvedIP, resolvedPort)
}

func (d *BACnetDriver) applyDiscoveredDevice(deviceID int, configuredIP string, configuredPort int, found btypes.Device) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.applyDiscoveredDeviceLocked(deviceID, configuredIP, configuredPort, found)
}

func (d *BACnetDriver) deviceKeyForInstance(deviceID int) string {
	for key, id := range d.idMap {
		if id == deviceID {
			return key
		}
	}
	return strconv.Itoa(deviceID)
}

func (d *BACnetDriver) notifyAddressChange(deviceKey, ip string, port int) {
	if d.addressNotifier == nil || deviceKey == "" || ip == "" || port <= 0 {
		return
	}
	d.addressNotifier.OnBACnetAddressDiscovered(deviceKey, ip, port)
}
