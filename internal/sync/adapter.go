package sync

import (
	"encoding/json"
	"fmt"
)

// LegacySyncAdapter provides compatibility with existing SyncManager
type LegacySyncAdapter struct {
	syncMgr *SyncManager
}

// NewLegacySyncAdapter creates a new adapter
func NewLegacySyncAdapter(syncMgr *SyncManager) *LegacySyncAdapter {
	return &LegacySyncAdapter{
		syncMgr: syncMgr,
	}
}

// LegacyPeerInfo matches old PeerInfo
type LegacyPeerInfo struct {
	ID       string
	Addr     string
	Status   string
	Version  uint64
	IsLeader bool
}

// GetPeers returns peers in legacy format
func (a *LegacySyncAdapter) GetPeers() []*LegacyPeerInfo {
	peers := a.syncMgr.gossip.GetPeers()
	result := make([]*LegacyPeerInfo, 0, len(peers))

	for _, p := range peers {
		result = append(result, &LegacyPeerInfo{
			ID:       p.ID.String(),
			Addr:     p.Addr,
			Status:   p.Status,
			Version:  p.Version,
			IsLeader: p.IsLeader,
		})
	}

	return result
}

// PutConfig puts config in legacy format
func (a *LegacySyncAdapter) PutConfig(key string, value interface{}, bindingKey string) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return a.syncMgr.PutConfig(key, data, bindingKey)
}

// GetConfig gets config in legacy format
func (a *LegacySyncAdapter) GetConfig(key string, out interface{}) error {
	rec, ok := a.syncMgr.GetConfig(key)
	if !ok {
		return fmt.Errorf("config not found: %s", key)
	}

	return json.Unmarshal(rec.Value, out)
}

// GetLocalNodeID returns local node ID
func (a *LegacySyncAdapter) GetLocalNodeID() string {
	return a.syncMgr.nodeID
}

// GetNodeStatus returns node status info
func (a *LegacySyncAdapter) GetNodeStatus() map[string]interface{} {
	return a.syncMgr.GetNodeInfo()
}

// StartSync starts sync (compatibility)
func (a *LegacySyncAdapter) StartSync() error {
	return nil // sync already started by SyncManager
}
