package sync

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p/core/peer"
)

// GroupSyncManager manages group-based synchronization
type GroupSyncManager struct {
	groupManager *GroupManager
	peerInfo     map[peer.ID]*GroupPeerInfo
	storage      StorageInterface
	ctx          context.Context
	cancel       context.CancelFunc
	mu           sync.RWMutex
}

// GroupPeerInfo contains peer information in a group
type GroupPeerInfo struct {
	PeerID       peer.ID    `json:"peer_id"`
	NodeID       string     `json:"node_id"`
	GroupID      string     `json:"group_id"`
	Online       bool       `json:"online"`
	LastSeen     time.Time  `json:"last_seen"`
	LastSync     time.Time  `json:"last_sync"`
	SyncVersion  uint64     `json:"sync_version"`
	OfflineSince *time.Time `json:"offline_since,omitempty"`
}

// StorageInterface defines the storage interface
type StorageInterface interface {
	Close() error
}

// NewGroupSyncManager creates a new group sync manager
func NewGroupSyncManager(storage StorageInterface) *GroupSyncManager {
	ctx, cancel := context.WithCancel(context.Background())
	return &GroupSyncManager{
		groupManager: NewGroupManager(),
		peerInfo:     make(map[peer.ID]*GroupPeerInfo),
		storage:      storage,
		ctx:          ctx,
		cancel:       cancel,
	}
}

// CreateGroup creates a new network group
func (gsm *GroupSyncManager) CreateGroup(groupID, name, description string) error {
	_, err := gsm.groupManager.CreateGroup(groupID, name, description)
	if err != nil {
		return err
	}
	log.Printf("[GroupSyncManager] Created group: %s (%s)", groupID, name)
	return nil
}

// JoinGroup makes the local peer join a group
func (gsm *GroupSyncManager) JoinGroup(groupID, nodeID string, peerID peer.ID) error {
	group, exists := gsm.groupManager.GetGroup(groupID)
	if !exists {
		return fmt.Errorf("group %s not found", groupID)
	}

	if err := group.JoinGroup(peerID); err != nil {
		return err
	}

	gsm.mu.Lock()
	gsm.peerInfo[peerID] = &GroupPeerInfo{
		PeerID:   peerID,
		NodeID:   nodeID,
		GroupID:  groupID,
		Online:   true,
		LastSeen: time.Now(),
	}
	gsm.mu.Unlock()

	log.Printf("[GroupSyncManager] Peer %s joined group %s", peerID, groupID)
	return nil
}

// LeaveGroup makes the local peer leave a group
func (gsm *GroupSyncManager) LeaveGroup(groupID string, peerID peer.ID) error {
	group, exists := gsm.groupManager.GetGroup(groupID)
	if !exists {
		return fmt.Errorf("group %s not found", groupID)
	}

	group.LeaveGroup(peerID)

	gsm.mu.Lock()
	if info, exists := gsm.peerInfo[peerID]; exists {
		info.Online = false
		now := time.Now()
		info.OfflineSince = &now
	}
	gsm.mu.Unlock()

	log.Printf("[GroupSyncManager] Peer %s left group %s", peerID, groupID)
	return nil
}

// DeleteGroup deletes a group
func (gsm *GroupSyncManager) DeleteGroup(groupID string) error {
	return gsm.groupManager.DeleteGroup(groupID)
}

// GetGroupMembers returns all members of a group
func (gsm *GroupSyncManager) GetGroupMembers(groupID string) ([]*GroupPeerInfo, error) {
	members, err := gsm.groupManager.GetGroupMembers(groupID)
	if err != nil {
		return nil, err
	}

	var result []*GroupPeerInfo
	for _, memberStr := range members {
		memberID, err := peer.Decode(memberStr)
		if err != nil {
			log.Printf("[GroupSyncManager] Failed to decode peer ID %s: %v", memberStr, err)
			continue
		}

		gsm.mu.RLock()
		info, exists := gsm.peerInfo[memberID]
		if exists {
			result = append(result, info)
		} else {
			result = append(result, &GroupPeerInfo{
				PeerID:  memberID,
				GroupID: groupID,
				Online:  false,
			})
		}
		gsm.mu.RUnlock()
	}

	return result, nil
}

// UpdatePeerStatus updates peer online/offline status
func (gsm *GroupSyncManager) UpdatePeerStatus(peerID peer.ID, online bool) {
	gsm.mu.Lock()
	defer gsm.mu.Unlock()

	if info, exists := gsm.peerInfo[peerID]; exists {
		info.Online = online
		info.LastSeen = time.Now()
		if online {
			info.OfflineSince = nil
		} else {
			now := time.Now()
			info.OfflineSince = &now
		}
	}
}

// RequestSync requests sync with a specific peer in the group
func (gsm *GroupSyncManager) RequestSync(groupID string, targetPeer peer.ID, fullSync bool) error {
	log.Printf("[GroupSyncManager] Requesting sync with peer %s in group %s (fullSync=%v)", targetPeer, groupID, fullSync)
	return nil
}

// CanSyncWithPeer checks if sync can proceed with a peer
func (gsm *GroupSyncManager) CanSyncWithPeer(peerID peer.ID) (bool, error) {
	gsm.mu.RLock()
	defer gsm.mu.RUnlock()

	info, exists := gsm.peerInfo[peerID]
	if !exists {
		return true, nil
	}

	if info.Online {
		if info.OfflineSince != nil {
			since := time.Since(*info.OfflineSince)
			if since < 5*time.Minute {
				return false, fmt.Errorf("peer %s was only offline for %v, need to wait for full offline", peerID, since)
			}
		}
		return false, fmt.Errorf("peer %s is online, cannot sync (old device must be offline for sync)", peerID)
	}

	return true, nil
}

// GetPeerInfo returns peer information
func (gsm *GroupSyncManager) GetPeerInfo(peerID peer.ID) (*GroupPeerInfo, bool) {
	gsm.mu.RLock()
	defer gsm.mu.RUnlock()

	info, exists := gsm.peerInfo[peerID]
	return info, exists
}

// GetGroupInfo returns group information
func (gsm *GroupSyncManager) GetGroupInfo(groupID string) (*NetworkGroup, bool) {
	return gsm.groupManager.GetGroup(groupID)
}

// ListGroups lists all groups
func (gsm *GroupSyncManager) ListGroups() []*NetworkGroup {
	return gsm.groupManager.ListGroups()
}

// SerializeGroup serializes group configuration for sync
func (gsm *GroupSyncManager) SerializeGroup(groupID string) ([]byte, error) {
	group, exists := gsm.groupManager.GetGroup(groupID)
	if !exists {
		return nil, fmt.Errorf("group %s not found", groupID)
	}

	members, _ := gsm.groupManager.GetGroupMembers(groupID)

	data, err := json.Marshal(map[string]interface{}{
		"group":     group,
		"members":   members,
		"timestamp": time.Now().Unix(),
		"version":   uint64(time.Now().Unix()),
	})
	if err != nil {
		return nil, err
	}

	return data, nil
}

// DeserializeGroup deserializes group configuration from sync
func (gsm *GroupSyncManager) DeserializeGroup(data []byte) error {
	var syncData map[string]interface{}
	if err := json.Unmarshal(data, &syncData); err != nil {
		return err
	}

	if groupData, ok := syncData["group"].(map[string]interface{}); ok {
		groupBytes, err := json.Marshal(groupData)
		if err != nil {
			return err
		}

		group, err := gsm.groupManager.DeserializeGroup(groupBytes)
		if err != nil {
			return err
		}

		gsm.mu.Lock()
		gsm.groupManager.groups[group.GroupID] = group
		gsm.mu.Unlock()

		log.Printf("[GroupSyncManager] Deserialized group %s with %d members", group.GroupID, len(group.Members))
	}

	return nil
}

// Close closes the group sync manager
func (gsm *GroupSyncManager) Close() error {
	gsm.cancel()
	if gsm.storage != nil {
		return gsm.storage.Close()
	}
	return nil
}
