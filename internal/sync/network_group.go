package sync

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p/core/peer"
)

// NetworkGroup represents a sync group that multiple gateways can join
type NetworkGroup struct {
	GroupID     string    `json:"group_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Members     []string  `json:"members"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	mu          sync.RWMutex
}

// NewNetworkGroup creates a new network group
func NewNetworkGroup(groupID, name, description string) *NetworkGroup {
	now := time.Now()
	return &NetworkGroup{
		GroupID:     groupID,
		Name:        name,
		Description: description,
		Members:     make([]string, 0),
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

// JoinGroup adds a peer to this group
func (ng *NetworkGroup) JoinGroup(peerID peer.ID) error {
	ng.mu.Lock()
	defer ng.mu.Unlock()

	for _, m := range ng.Members {
		if m == peerID.String() {
			return fmt.Errorf("peer %s already joined group %s", peerID, ng.GroupID)
		}
	}

	ng.Members = append(ng.Members, peerID.String())
	ng.UpdatedAt = time.Now()
	return nil
}

// LeaveGroup removes a peer from this group
func (ng *NetworkGroup) LeaveGroup(peerID peer.ID) {
	ng.mu.Lock()
	defer ng.mu.Unlock()

	for i, m := range ng.Members {
		if m == peerID.String() {
			ng.Members = append(ng.Members[:i], ng.Members[i+1:]...)
			ng.UpdatedAt = time.Now()
			return
		}
	}
}

// IsMember checks if a peer is a member of this group
func (ng *NetworkGroup) IsMember(peerID peer.ID) bool {
	ng.mu.RLock()
	defer ng.mu.RUnlock()

	for _, m := range ng.Members {
		if m == peerID.String() {
			return true
		}
	}
	return false
}

// GetMembers returns a copy of members list
func (ng *NetworkGroup) GetMembers() []string {
	ng.mu.RLock()
	defer ng.mu.RUnlock()

	members := make([]string, len(ng.Members))
	copy(members, ng.Members)
	return members
}

// GroupManager manages network groups
type GroupManager struct {
	groups map[string]*NetworkGroup
	mu     sync.RWMutex
}

// NewGroupManager creates a new group manager
func NewGroupManager() *GroupManager {
	return &GroupManager{
		groups: make(map[string]*NetworkGroup),
	}
}

// CreateGroup creates a new network group
func (gm *GroupManager) CreateGroup(groupID, name, description string) (*NetworkGroup, error) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	if _, exists := gm.groups[groupID]; exists {
		return nil, fmt.Errorf("group %s already exists", groupID)
	}

	group := NewNetworkGroup(groupID, name, description)
	gm.groups[groupID] = group
	return group, nil
}

// GetGroup gets a group by ID
func (gm *GroupManager) GetGroup(groupID string) (*NetworkGroup, bool) {
	gm.mu.RLock()
	defer gm.mu.RUnlock()

	group, exists := gm.groups[groupID]
	return group, exists
}

// DeleteGroup deletes a group
func (gm *GroupManager) DeleteGroup(groupID string) error {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	if _, exists := gm.groups[groupID]; !exists {
		return fmt.Errorf("group %s not found", groupID)
	}

	delete(gm.groups, groupID)
	return nil
}

// JoinGroup adds a peer to a group
func (gm *GroupManager) JoinGroup(groupID string, peerID peer.ID) error {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	group, exists := gm.groups[groupID]
	if !exists {
		return fmt.Errorf("group %s not found", groupID)
	}

	return group.JoinGroup(peerID)
}

// LeaveGroup removes a peer from a group
func (gm *GroupManager) LeaveGroup(groupID string, peerID peer.ID) error {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	group, exists := gm.groups[groupID]
	if !exists {
		return fmt.Errorf("group %s not found", groupID)
	}

	group.LeaveGroup(peerID)
	return nil
}

// GetGroupsByPeer returns all groups that a peer belongs to
func (gm *GroupManager) GetGroupsByPeer(peerID peer.ID) []*NetworkGroup {
	gm.mu.RLock()
	defer gm.mu.RUnlock()

	var result []*NetworkGroup
	for _, group := range gm.groups {
		if group.IsMember(peerID) {
			result = append(result, group)
		}
	}
	return result
}

// GetGroupMembers returns all members of a group
func (gm *GroupManager) GetGroupMembers(groupID string) ([]string, error) {
	group, exists := gm.GetGroup(groupID)
	if !exists {
		return nil, fmt.Errorf("group %s not found", groupID)
	}
	return group.GetMembers(), nil
}

// SerializeGroup serializes a group to JSON
func (gm *GroupManager) SerializeGroup(groupID string) ([]byte, error) {
	group, exists := gm.GetGroup(groupID)
	if !exists {
		return nil, fmt.Errorf("group %s not found", groupID)
	}

	return json.MarshalIndent(group, "", "  ")
}

// DeserializeGroup deserializes a group from JSON
func (gm *GroupManager) DeserializeGroup(data []byte) (*NetworkGroup, error) {
	var group NetworkGroup
	if err := json.Unmarshal(data, &group); err != nil {
		return nil, err
	}
	return &group, nil
}

// ListGroups returns all groups
func (gm *GroupManager) ListGroups() []*NetworkGroup {
	gm.mu.RLock()
	defer gm.mu.RUnlock()

	result := make([]*NetworkGroup, 0, len(gm.groups))
	for _, group := range gm.groups {
		result = append(result, group)
	}
	return result
}
