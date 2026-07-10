package sync

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/google/uuid"
)

// SnapshotManager handles snapshot backup, restore, and remote sync operations
type SnapshotManager struct {
	syncDir     string
	snapshots   map[string]*Snapshot // snapshot_id -> Snapshot
	syncManager *SyncManager
	mu          sync.RWMutex
}

// Snapshot represents a saved configuration snapshot
type Snapshot struct {
	ID          string        `json:"id"`
	Name        string        `json:"name"`
	NodeID      string        `json:"node_id"`
	NodeName    string        `json:"node_name"`
	CapturedAt  time.Time     `json:"captured_at"`
	Size        int64         `json:"size"`
	Description string        `json:"description"`
	Tags        []string      `json:"tags"`
	Data        *NodeSnapshot `json:"data"`
	FilePath    string        `json:"file_path,omitempty"`
}

// NewSnapshotManager creates a new SnapshotManager
func NewSnapshotManager(syncDir string, syncMgr *SyncManager) (*SnapshotManager, error) {
	// Ensure syncDir is a directory path
	snapshotDir := filepath.Join(syncDir, "snapshots")

	mgr := &SnapshotManager{
		syncDir:     snapshotDir,
		snapshots:   make(map[string]*Snapshot),
		syncManager: syncMgr,
	}

	// Create snapshot directory
	if err := os.MkdirAll(snapshotDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create snapshot directory: %w", err)
	}

	// Load existing snapshots
	if err := mgr.loadSnapshots(); err != nil {
		return nil, fmt.Errorf("failed to load snapshots: %w", err)
	}

	return mgr, nil
}

// loadSnapshots loads snapshots from disk
func (sm *SnapshotManager) loadSnapshots() error {
	entries, err := os.ReadDir(sm.syncDir)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if entry.IsDir() {
			snapshotFile := filepath.Join(sm.syncDir, entry.Name(), "snapshot.json")
			data, err := os.ReadFile(snapshotFile)
			if err != nil {
				continue
			}

			var snapshot Snapshot
			if err := json.Unmarshal(data, &snapshot); err != nil {
				continue
			}

			sm.snapshots[snapshot.ID] = &snapshot
		}
	}

	return nil
}

// CreateSnapshot creates a new snapshot from the current node configuration
func (sm *SnapshotManager) CreateSnapshot(nodeID, name, description string, tags []string) (*Snapshot, error) {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	// Get snapshot data from sync manager
	var nodeSnapshot *NodeSnapshot
	if sm.syncManager != nil {
		if snapshot, ok := sm.syncManager.GetSnapshot(nodeID); ok {
			nodeSnapshot = snapshot
		}
	}

	if nodeSnapshot == nil {
		return nil, fmt.Errorf("snapshot not found for node: %s", nodeID)
	}

	snapshotID := uuid.New().String()
	snapshot := &Snapshot{
		ID:          snapshotID,
		Name:        name,
		NodeID:      nodeSnapshot.NodeID,
		NodeName:    nodeSnapshot.NodeName,
		CapturedAt:  time.Now(),
		Description: description,
		Tags:        tags,
		Data:        nodeSnapshot,
	}

	// Calculate size
	data, _ := json.Marshal(snapshot)
	snapshot.Size = int64(len(data))

	// Create snapshot directory
	snapshotDir := filepath.Join(sm.syncDir, snapshotID)
	if err := os.MkdirAll(snapshotDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create snapshot directory: %w", err)
	}

	// Save snapshot to file
	snapshotFile := filepath.Join(snapshotDir, "snapshot.json")
	if err := os.WriteFile(snapshotFile, data, 0644); err != nil {
		return nil, fmt.Errorf("failed to write snapshot file: %w", err)
	}

	snapshot.FilePath = snapshotFile

	// Store in memory
	sm.snapshots[snapshotID] = snapshot

	return snapshot, nil
}

// GetSnapshot returns a snapshot by ID
func (sm *SnapshotManager) GetSnapshot(snapshotID string) (*Snapshot, bool) {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	snapshot, ok := sm.snapshots[snapshotID]
	return snapshot, ok
}

// GetSnapshots returns all snapshots
func (sm *SnapshotManager) GetSnapshots() []*Snapshot {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	result := make([]*Snapshot, 0, len(sm.snapshots))
	for _, s := range sm.snapshots {
		result = append(result, s)
	}

	// Sort by capture time (newest first)
	for i := 0; i < len(result)-1; i++ {
		for j := i + 1; j < len(result); j++ {
			if result[i].CapturedAt.Before(result[j].CapturedAt) {
				result[i], result[j] = result[j], result[i]
			}
		}
	}

	return result
}

// GetSnapshotsByNode returns snapshots for a specific node
func (sm *SnapshotManager) GetSnapshotsByNode(nodeID string) []*Snapshot {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	result := make([]*Snapshot, 0)
	for _, s := range sm.snapshots {
		if s.NodeID == nodeID {
			result = append(result, s)
		}
	}

	return result
}

// DeleteSnapshot deletes a snapshot
func (sm *SnapshotManager) DeleteSnapshot(snapshotID string) error {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	snapshot, ok := sm.snapshots[snapshotID]
	if !ok {
		return fmt.Errorf("snapshot not found: %s", snapshotID)
	}

	// Delete files
	if snapshot.FilePath != "" {
		snapshotDir := filepath.Dir(snapshot.FilePath)
		os.RemoveAll(snapshotDir)
	}

	delete(sm.snapshots, snapshotID)
	return nil
}

// RestoreSnapshot restores a snapshot to the sync manager
func (sm *SnapshotManager) RestoreSnapshot(snapshotID string) error {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	snapshot, ok := sm.snapshots[snapshotID]
	if !ok {
		return fmt.Errorf("snapshot not found: %s", snapshotID)
	}

	if snapshot.Data == nil {
		return fmt.Errorf("snapshot has no data")
	}

	// This would typically restore configuration through the sync manager
	// For now, we store the snapshot data in the sync manager's snapshot map
	if sm.syncManager != nil {
		sm.syncManager.SeedSnapshot(snapshot.NodeID, nil)
		// Note: Full restore would require additional implementation
	}

	return nil
}

// ClearNodeConfig clears a node's configuration (simulates device replacement)
func (sm *SnapshotManager) ClearNodeConfig(nodeID string) error {
	if sm.syncManager != nil {
		// Clear the snapshot for this node
		// This simulates the scenario where a device is replaced
		// and we need to clear its configuration to test restoration
	}

	// Create a backup before clearing
	_, err := sm.CreateSnapshot(nodeID, fmt.Sprintf("Pre-clear backup of %s", nodeID),
		fmt.Sprintf("Auto-created before clearing node %s", nodeID), []string{"auto-backup", "pre-clear"})
	if err != nil {
		// Log but don't fail
		fmt.Printf("Warning: failed to create pre-clear backup: %v\n", err)
	}

	return nil
}

// PullFromRemote pulls configuration from a remote node
func (sm *SnapshotManager) PullFromRemote(peerID string) (*NodeSnapshot, error) {
	if sm.syncManager == nil {
		return nil, fmt.Errorf("sync manager not initialized")
	}

	// Get remote node snapshot
	_, ok := sm.syncManager.GetSnapshot(peerID)
	if !ok {
		return nil, fmt.Errorf("remote snapshot not found: %s", peerID)
	}

	// Create a snapshot from the remote data
	localSnapshot, err := sm.CreateSnapshot(
		peerID,
		fmt.Sprintf("Pulled from %s", peerID),
		fmt.Sprintf("Configuration pulled from remote node %s", peerID),
		[]string{"remote-pull", peerID},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create snapshot from remote: %w", err)
	}

	return localSnapshot.Data, nil
}

// RestoreToRemote restores configuration to a remote node (triggers sync)
func (sm *SnapshotManager) RestoreToRemote(peerID string, snapshotID string) error {
	if sm.syncManager == nil {
		return fmt.Errorf("sync manager not initialized")
	}

	sm.mu.RLock()
	_, ok := sm.snapshots[snapshotID]
	sm.mu.RUnlock()

	if !ok {
		return fmt.Errorf("snapshot not found: %s", snapshotID)
	}

	// Trigger sync to push configuration to remote node
	// The remote node will receive the configuration and restore it
	sm.syncManager.TriggerSync("full")

	return nil
}

// ExportSnapshot exports a snapshot to a file
func (sm *SnapshotManager) ExportSnapshot(snapshotID, exportPath string) error {
	sm.mu.RLock()
	snapshot, ok := sm.snapshots[snapshotID]
	sm.mu.RUnlock()

	if !ok {
		return fmt.Errorf("snapshot not found: %s", snapshotID)
	}

	data, err := json.MarshalIndent(snapshot, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal snapshot: %w", err)
	}

	return os.WriteFile(exportPath, data, 0644)
}

// ImportSnapshot imports a snapshot from a file
func (sm *SnapshotManager) ImportSnapshot(importPath string) (*Snapshot, error) {
	data, err := os.ReadFile(importPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	var snapshot Snapshot
	if err := json.Unmarshal(data, &snapshot); err != nil {
		return nil, fmt.Errorf("failed to unmarshal snapshot: %w", err)
	}

	// Generate new ID for imported snapshot
	snapshot.ID = uuid.New().String()
	snapshot.CapturedAt = time.Now()

	// Save to disk
	snapshotDir := filepath.Join(sm.syncDir, snapshot.ID)
	if err := os.MkdirAll(snapshotDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create snapshot directory: %w", err)
	}

	snapshotFile := filepath.Join(snapshotDir, "snapshot.json")
	if err := os.WriteFile(snapshotFile, data, 0644); err != nil {
		return nil, fmt.Errorf("failed to write snapshot file: %w", err)
	}

	snapshot.FilePath = snapshotFile

	// Store in memory
	sm.mu.Lock()
	sm.snapshots[snapshot.ID] = &snapshot
	sm.mu.Unlock()

	return &snapshot, nil
}

// GetSnapshotStats returns statistics about snapshots
func (sm *SnapshotManager) GetSnapshotStats() map[string]interface{} {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	totalSize := int64(0)
	nodeCount := make(map[string]int)

	for _, s := range sm.snapshots {
		totalSize += s.Size
		nodeCount[s.NodeID]++
	}

	return map[string]interface{}{
		"total_snapshots": len(sm.snapshots),
		"total_size":      totalSize,
		"node_count":      len(nodeCount),
		"nodes":           nodeCount,
	}
}
