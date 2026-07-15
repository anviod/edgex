package model

// LookupNorthboundPublishConfig resolves publish settings for a device ID across
// real-device and virtual-device northbound maps. When both maps are empty, all
// devices are allowed (legacy default).
func LookupNorthboundPublishConfig(deviceID string, devices, virtualDevices OpcUaDeviceMap) (DevicePublishConfig, bool) {
	if cfg, ok := devices[deviceID]; ok {
		return normalizePublishConfig(cfg), cfg.Enable
	}
	if cfg, ok := virtualDevices[deviceID]; ok {
		return normalizePublishConfig(cfg), cfg.Enable
	}
	if len(devices) == 0 && len(virtualDevices) == 0 {
		return DevicePublishConfig{Enable: true, Strategy: "realtime"}, true
	}
	return DevicePublishConfig{}, false
}

func normalizePublishConfig(cfg DevicePublishConfig) DevicePublishConfig {
	if cfg.Strategy == "" {
		cfg.Strategy = "realtime"
	}
	return cfg
}

// IsNorthboundVirtualDevice reports whether deviceID is configured as a virtual device.
func IsNorthboundVirtualDevice(deviceID string, virtualDevices OpcUaDeviceMap) bool {
	_, ok := virtualDevices[deviceID]
	return ok
}
