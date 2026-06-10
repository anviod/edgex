package sync

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"sync"
)

// DiscoveryManager manages peer discovery with fallback
type DiscoveryManager struct {
	peerCache       *PeerCache
	cachePath       string
	gossip          *GossipManager
	udpDiscovery    *UDPDiscovery
	staticDiscovery *StaticSeedDiscovery
	ctx             context.Context
	cancel          context.CancelFunc
	mu              sync.RWMutex
}

// NewDiscoveryManager creates a new DiscoveryManager
func NewDiscoveryManager(dataPath string, gossip *GossipManager) (*DiscoveryManager, error) {
	cachePath := filepath.Join(dataPath, "peercache.json")

	ctx, cancel := context.WithCancel(context.Background())

	mgr := &DiscoveryManager{
		peerCache: &PeerCache{
			KnownPeers: []string{},
		},
		cachePath: cachePath,
		gossip:    gossip,
		ctx:       ctx,
		cancel:    cancel,
	}

	if err := mgr.loadPeerCache(); err != nil {
		log.Printf("Warning: could not load peer cache: %v", err)
	}

	udpDiscovery, err := NewUDPDiscovery(gossip)
	if err != nil {
		log.Printf("Warning: could not start UDP discovery: %v", err)
	} else {
		mgr.udpDiscovery = udpDiscovery
	}

	mgr.staticDiscovery = NewStaticSeedDiscovery(gossip, mgr.peerCache.KnownPeers)

	return mgr, nil
}

// loadPeerCache loads peer cache from disk
func (d *DiscoveryManager) loadPeerCache() error {
	data, err := os.ReadFile(d.cachePath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}

	return json.Unmarshal(data, d.peerCache)
}

// savePeerCache saves peer cache to disk
func (d *DiscoveryManager) savePeerCache() error {
	data, err := json.MarshalIndent(d.peerCache, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(d.cachePath, data, 0600)
}

// AddPeer adds a peer to cache
func (d *DiscoveryManager) AddPeer(addr string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	for _, p := range d.peerCache.KnownPeers {
		if p == addr {
			return
		}
	}

	d.peerCache.KnownPeers = append(d.peerCache.KnownPeers, addr)
	_ = d.savePeerCache()
}

// GetKnownPeers gets known peers
func (d *DiscoveryManager) GetKnownPeers() []string {
	d.mu.RLock()
	defer d.mu.RUnlock()

	peers := make([]string, len(d.peerCache.KnownPeers))
	copy(peers, d.peerCache.KnownPeers)
	return peers
}

// TryConnectPeers tries to connect to known peers
func (d *DiscoveryManager) TryConnectPeers() {
	peers := d.GetKnownPeers()
	for _, addr := range peers {
		log.Printf("Trying to connect to known peer: %s", addr)
	}

	if d.staticDiscovery != nil {
		d.staticDiscovery.ConnectToSeeds()
	}
}

// EnableDiscovery enables all discovery mechanisms
func (d *DiscoveryManager) EnableDiscovery() {
	if d.udpDiscovery != nil {
		d.udpDiscovery.Enable()
	}
	if d.staticDiscovery != nil {
		d.staticDiscovery.Enable()
	}
}

// DisableDiscovery disables all discovery mechanisms
func (d *DiscoveryManager) DisableDiscovery() {
	if d.udpDiscovery != nil {
		d.udpDiscovery.Disable()
	}
	if d.staticDiscovery != nil {
		d.staticDiscovery.Disable()
	}
}

// GetAllPeers returns all peers from all discovery mechanisms
func (d *DiscoveryManager) GetAllPeers() []*PeerInfo {
	var allPeers []*PeerInfo

	if d.udpDiscovery != nil {
		allPeers = append(allPeers, d.udpDiscovery.GetPeers()...)
	}
	if d.staticDiscovery != nil {
		allPeers = append(allPeers, d.staticDiscovery.GetPeers()...)
	}

	seen := make(map[string]bool)
	result := make([]*PeerInfo, 0, len(allPeers))
	for _, p := range allPeers {
		if !seen[p.ID.String()] {
			seen[p.ID.String()] = true
			result = append(result, p)
		}
	}

	return result
}

// SetStaticSeeds sets static seed nodes
func (d *DiscoveryManager) SetStaticSeeds(seeds []string) {
	if d.staticDiscovery != nil {
		d.staticDiscovery.SetSeeds(seeds)
	}
}

// Close closes the discovery manager
func (d *DiscoveryManager) Close() {
	d.cancel()
	if d.udpDiscovery != nil {
		d.udpDiscovery.Close()
	}
}
