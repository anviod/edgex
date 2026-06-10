package sync

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

// GenDeviceKey generates a device key from identity info
func GenDeviceKey(ip, protocol string, port int, fingerprint *DeviceFingerprint) string {
	var key string

	if fingerprint != nil && fingerprint.SN != "" {
		key = fmt.Sprintf("%s:%s:%s:%d", fingerprint.Vendor, fingerprint.Model, fingerprint.SN, port)
	} else {
		key = fmt.Sprintf("%s:%s:%d", ip, protocol, port)
	}

	hash := sha256.Sum256([]byte(key))
	return hex.EncodeToString(hash[:])
}

// GenBindingKey generates a binding key for config
func GenBindingKey(ip, protocol string, port int) string {
	key := fmt.Sprintf("%s:%s:%d", ip, protocol, port)
	hash := sha256.Sum256([]byte(key))
	return hex.EncodeToString(hash[:])
}
