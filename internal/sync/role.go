package sync

import (
	"sort"
	"sync"

	"github.com/libp2p/go-libp2p/core/peer"
)

// RoleManager manages node roles
type RoleManager struct {
	selfID   peer.ID
	role     NodeRole
	peers    map[peer.ID]*PeerInfo
	mu       sync.RWMutex
}

// NewRoleManager creates a new RoleManager
func NewRoleManager(selfID peer.ID) *RoleManager {
	return &RoleManager{
		selfID: selfID,
		role:   RoleFollower,
		peers:  make(map[peer.ID]*PeerInfo),
	}
}

// ElectLeader elects a leader based on node ID
func (r *RoleManager) ElectLeader() NodeRole {
	r.mu.Lock()
	defer r.mu.Unlock()

	var allIDs []string
	allIDs = append(allIDs, string(r.selfID))

	for id := range r.peers {
		allIDs = append(allIDs, string(id))
	}

	sort.Strings(allIDs)

	if allIDs[0] == string(r.selfID) {
		r.role = RoleLeader
	} else {
		r.role = RoleFollower
	}

	return r.role
}

// GetRole gets current role
func (r *RoleManager) GetRole() NodeRole {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.role
}

// IsLeader checks if current node is leader
func (r *RoleManager) IsLeader() bool {
	return r.GetRole() == RoleLeader
}

// CanWrite checks if current node can write
func (r *RoleManager) CanWrite() bool {
	role := r.GetRole()
	return role == RoleLeader || role == RoleFollower
}

// SetReadonly sets node to readonly
func (r *RoleManager) SetReadonly() {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.role = RoleReadonly
}

// UpdatePeer updates peer info
func (r *RoleManager) UpdatePeer(peerID peer.ID, info *PeerInfo) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.peers[peerID] = info
}
