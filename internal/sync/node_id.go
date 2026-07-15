package sync

import (
	"net"
	"os"
	"strings"

	"github.com/google/uuid"
)

// NodeIDGenerator handles node ID generation and management
type NodeIDGenerator struct {
	macAddresses []string
	hostname     string
}

// NewNodeIDGenerator creates a new NodeIDGenerator
func NewNodeIDGenerator() *NodeIDGenerator {
	return &NodeIDGenerator{
		macAddresses: getMACAddresses(),
		hostname:     getHostname(),
	}
}

// getMACAddresses returns all non-loopback MAC addresses
func getMACAddresses() []string {
	var macs []string
	ifaces, err := net.Interfaces()
	if err != nil {
		return macs
	}
	for _, iface := range ifaces {
		if iface.Flags&net.FlagLoopback == 0 && iface.HardwareAddr != nil {
			macs = append(macs, iface.HardwareAddr.String())
		}
	}
	return macs
}

// getHostname returns the system hostname
func getHostname() string {
	name, err := os.Hostname()
	if err != nil {
		return "unknown-host"
	}
	return name
}

// GenerateNodeID generates a unique node ID based on system information
func (n *NodeIDGenerator) GenerateNodeID() string {
	if n.hostname != "" {
		return "NODE-" + strings.ToUpper(strings.ReplaceAll(n.hostname, "-", "_"))
	}

	if len(n.macAddresses) > 0 {
		mac := n.macAddresses[0]
		parts := strings.Split(mac, ":")
		if len(parts) >= 6 {
			return "NODE-" + strings.ToUpper(strings.Join(parts[3:], ""))
		}
		return "NODE-" + strings.ToUpper(strings.ReplaceAll(mac, ":", ""))
	}

	return "NODE-" + strings.ToUpper(strings.ReplaceAll(uuid.New().String(), "-", "")[:8])
}

// GetDefaultNodeID returns a default node ID based on hostname
func GetDefaultNodeID() string {
	gen := NewNodeIDGenerator()
	return gen.GenerateNodeID()
}

// GetNodeIDFromConfig returns node ID from config or generates one
func GetNodeIDFromConfig(configNodeID string) string {
	if configNodeID != "" && configNodeID != "auto" {
		return configNodeID
	}
	return GetDefaultNodeID()
}

// GetHostname returns the hostname
func (n *NodeIDGenerator) GetHostname() string {
	return n.hostname
}

// GetMACAddresses returns MAC addresses
func (n *NodeIDGenerator) GetMACAddresses() []string {
	return n.macAddresses
}

// FormatNodeID formats a node ID to standard format
func FormatNodeID(nodeID string) string {
	if strings.HasPrefix(strings.ToUpper(nodeID), "NODE-") {
		return strings.ToUpper(nodeID)
	}
	return "NODE-" + strings.ToUpper(nodeID)
}
