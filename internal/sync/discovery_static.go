package sync

import (
	"log"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multiaddr"
)

type StaticSeedDiscovery struct {
	seeds      []string
	peers      map[string]*PeerInfo
	connecting map[string]bool
	mu         sync.RWMutex
	gossip     *GossipManager
	enabled    bool
}

func NewStaticSeedDiscovery(gossip *GossipManager, seeds []string) *StaticSeedDiscovery {
	return &StaticSeedDiscovery{
		seeds:      seeds,
		peers:      make(map[string]*PeerInfo),
		connecting: make(map[string]bool),
		gossip:     gossip,
		enabled:    true,
	}
}

func (s *StaticSeedDiscovery) SetSeeds(seeds []string) {
	s.mu.Lock()
	s.seeds = seeds
	s.mu.Unlock()
}

func (s *StaticSeedDiscovery) Enable() {
	s.mu.Lock()
	s.enabled = true
	s.mu.Unlock()
	log.Printf("[StaticSeedDiscovery] Enabled")
}

func (s *StaticSeedDiscovery) Disable() {
	s.mu.Lock()
	s.enabled = false
	s.mu.Unlock()
	log.Printf("[StaticSeedDiscovery] Disabled")
}

func (s *StaticSeedDiscovery) ConnectToSeeds() {
	s.mu.RLock()
	enabled := s.enabled
	seeds := make([]string, len(s.seeds))
	copy(seeds, s.seeds)
	s.mu.RUnlock()

	if !enabled {
		return
	}

	for _, seed := range seeds {
		go s.tryConnect(seed)
	}
}

func (s *StaticSeedDiscovery) tryConnect(seed string) {
	s.mu.Lock()
	if s.connecting[seed] {
		s.mu.Unlock()
		return
	}
	s.connecting[seed] = true
	s.mu.Unlock()

	defer func() {
		s.mu.Lock()
		delete(s.connecting, seed)
		s.mu.Unlock()
	}()

	ma, err := multiaddr.NewMultiaddr(seed)
	if err != nil {
		log.Printf("[StaticSeedDiscovery] Invalid seed address: %s", seed)
		return
	}

	peerInfo, err := peer.AddrInfoFromP2pAddr(ma)
	if err != nil {
		log.Printf("[StaticSeedDiscovery] Failed to parse seed: %s", seed)
		return
	}

	if peerInfo.ID == s.gossip.HostID() {
		return
	}

	if err := s.gossip.host.Connect(s.gossip.ctx, *peerInfo); err != nil {
		log.Printf("[StaticSeedDiscovery] Failed to connect to seed %s: %v", seed, err)
		return
	}

	s.mu.Lock()
	s.peers[peerInfo.ID.String()] = &PeerInfo{
		ID:       peerInfo.ID,
		Addr:     seed,
		LastSeen: time.Now(),
		Status:   "online",
	}
	s.mu.Unlock()

	log.Printf("[StaticSeedDiscovery] Connected to seed: %s", peerInfo.ID)
}

func (s *StaticSeedDiscovery) GetSeeds() []string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.seeds
}

func (s *StaticSeedDiscovery) GetPeers() []*PeerInfo {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var peers []*PeerInfo
	for _, p := range s.peers {
		peers = append(peers, p)
	}
	return peers
}