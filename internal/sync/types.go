package sync

import (
	"time"

	"github.com/libp2p/go-libp2p/core/peer"
)

// NodeRole defines the role of a node
type NodeRole string

const (
	RoleLeader   NodeRole = "leader"
	RoleFollower NodeRole = "follower"
	RoleReadonly NodeRole = "readonly"
)

// ConfigStage defines the stage of a config
type ConfigStage string

const (
	StageDraft      ConfigStage = "draft"
	StageActive     ConfigStage = "active"
	StageDeprecated ConfigStage = "deprecated"
)

// ConfigRecord represents a single configuration record
type ConfigRecord struct {
	Key        string      `json:"key"`
	Value      []byte      `json:"value"`
	Version    uint64      `json:"version"`
	NodeID     string      `json:"node_id"`
	Timestamp  int64       `json:"timestamp"`
	Hash       string      `json:"hash"`
	BindingKey string      `json:"binding_key"` // Device binding key
	Stage      ConfigStage `json:"stage"`       // draft/active/deprecated
}

// Digest for anti-entropy
type Digest struct {
	NodeID string            `json:"node_id"`
	Keys   map[string]uint64 `json:"keys"` // key -> version
	Hash   string            `json:"hash"` // Global merkle root
}

// PeerCache stores known peers for discovery recovery
type PeerCache struct {
	KnownPeers []string `json:"known_peers"`
}

// DeviceFingerprint for device identity
type DeviceFingerprint struct {
	Vendor string `json:"vendor"`
	Model  string `json:"model"`
	SN     string `json:"sn"`
}

// TakeoverLock for distributed takeover control
type TakeoverLock struct {
	DeviceKey string        `json:"device_key"`
	Owner     peer.ID       `json:"owner"`
	TTL       time.Duration `json:"ttl"`
	ExpiresAt time.Time     `json:"expires_at"`
}

// PeerInfo holds information about a connected peer
type PeerInfo struct {
	ID       peer.ID
	Addr     string
	LastSeen time.Time
	Status   string // online, offline, syncing
	Version  uint64
	IsLeader bool
	Role     NodeRole
}

// SyncMessage defines the synchronization message format
type SyncMessage struct {
	Version     string                 `json:"version"`
	MessageType string                 `json:"message_type"` // announce, pull, full_config, hello, takeover, digest
	MessageID   string                 `json:"message_id"`
	SourcePeer  string                 `json:"source_peer"`
	TargetPeer  string                 `json:"target_peer"`
	Timestamp   time.Time              `json:"timestamp"`
	PayloadType string                 `json:"payload_type"`
	Payload     map[string]interface{} `json:"payload"`
}

// SyncMeta contains metadata for synchronization
type SyncMeta struct {
	Operation  string    `json:"operation"`
	Version    uint64    `json:"version"`
	Checksum   string    `json:"checksum"`
	LastSyncAt time.Time `json:"last_sync_at"`
}

// ConfigMigrationRequest represents a request for device config migration
type ConfigMigrationRequest struct {
	DeviceCode     string `json:"device_code"`
	TargetDeviceID string `json:"target_device_id"`
	SourceNodeID   string `json:"source_node_id,omitempty"`
}

// SimpleSyncRequest represents a simple sync request
type SimpleSyncRequest struct {
	NodeID     string `json:"node_id"`
	DeviceCode string `json:"device_code"`
}

// DeviceCode represents a parsed device code
type DeviceCode struct {
	Protocol     string `json:"protocol"`
	VendorID     string `json:"vendor_id"`
	ModelID      string `json:"model_id"`
	SerialNumber string `json:"serial_number"`
	Extra        string `json:"extra,omitempty"`
}

// ParseDeviceCode parses a device code string
// Format: protocol-vendor-model-SN-serial-extra
func ParseDeviceCode(deviceCode string) (*DeviceCode, error) {
	// Simple implementation for now
	code := &DeviceCode{
		Protocol:     "unknown",
		VendorID:     "unknown",
		ModelID:      "unknown",
		SerialNumber: "unknown",
	}

	// For real implementation, parse the device code string
	// Example format: modbus-siemens-s71200-SN123456789-ABC123

	return code, nil
}
