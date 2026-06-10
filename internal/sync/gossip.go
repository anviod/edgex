package sync

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/p2p/discovery/mdns"
	"github.com/multiformats/go-multiaddr"
)

const (
	gossipTopic = "edge-sync-gossip"
)

// GossipManager manages gossip-based communication
type GossipManager struct {
	host   host.Host
	pubsub *pubsub.PubSub
	topic  *pubsub.Topic
	sub    *pubsub.Subscription
	msgCh  chan *SyncMessage
	peers  map[peer.ID]*PeerInfo
	ctx    context.Context
	cancel context.CancelFunc
	mu     sync.RWMutex
}

// NewGossipManager creates a new GossipManager
func NewGossipManager(ctx context.Context, port int) (*GossipManager, error) {
	log.Printf("[GossipManager] Starting initialization on port %d...", port)

	// Create host with minimal configuration to avoid blocking
	log.Printf("[GossipManager] Creating libp2p host...")
	h, err := libp2p.New(
		libp2p.ListenAddrStrings(fmt.Sprintf("/ip4/0.0.0.0/tcp/%d", port)),
		libp2p.DisableRelay(),
		libp2p.Ping(false),
	)
	if err != nil {
		log.Printf("[GossipManager] Failed to create host: %v", err)
		return nil, err
	}

	log.Printf("[GossipManager] Host created successfully: %s", h.ID())
	log.Printf("[GossipManager] Host addresses: %v", h.Addrs())

	ps, err := pubsub.NewGossipSub(ctx, h)
	if err != nil {
		log.Printf("[GossipManager] Failed to create pubsub: %v", err)
		h.Close()
		return nil, err
	}

	log.Printf("[GossipManager] PubSub created")

	topic, err := ps.Join(gossipTopic)
	if err != nil {
		log.Printf("[GossipManager] Failed to join topic: %v", err)
		h.Close()
		return nil, err
	}

	log.Printf("[GossipManager] Joined topic: %s", gossipTopic)

	sub, err := topic.Subscribe()
	if err != nil {
		log.Printf("[GossipManager] Failed to subscribe: %v", err)
		h.Close()
		return nil, err
	}

	log.Printf("[GossipManager] Subscribed successfully")

	ctx, cancel := context.WithCancel(ctx)

	mgr := &GossipManager{
		host:   h,
		pubsub: ps,
		topic:  topic,
		sub:    sub,
		msgCh:  make(chan *SyncMessage, 100),
		peers:  make(map[peer.ID]*PeerInfo),
		ctx:    ctx,
		cancel: cancel,
	}

	go mgr.readLoop()
	go mgr.heartbeat()

	log.Printf("[GossipManager] Initialization complete")

	return mgr, nil
}

// readLoop reads incoming messages
func (g *GossipManager) readLoop() {
	for {
		select {
		case <-g.ctx.Done():
			return
		default:
			msg, err := g.sub.Next(g.ctx)
			if err != nil {
				log.Printf("Error reading message: %v", err)
				continue
			}

			if msg.ReceivedFrom == g.host.ID() {
				continue
			}

			var syncMsg SyncMessage
			if err := json.Unmarshal(msg.Data, &syncMsg); err != nil {
				log.Printf("Error unmarshaling message: %v", err)
				continue
			}

			g.mu.Lock()
			g.peers[msg.ReceivedFrom] = &PeerInfo{
				ID:       msg.ReceivedFrom,
				LastSeen: time.Now(),
				Status:   "online",
			}
			g.mu.Unlock()

			g.msgCh <- &syncMsg
		}
	}
}

// Publish publishes a message
func (g *GossipManager) Publish(msg *SyncMessage) error {
	data, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	return g.topic.Publish(g.ctx, data)
}

// Messages returns the message channel
func (g *GossipManager) Messages() <-chan *SyncMessage {
	return g.msgCh
}

// HostID returns the host ID
func (g *GossipManager) HostID() peer.ID {
	return g.host.ID()
}

// GetPeers returns connected peers
func (g *GossipManager) GetPeers() []*PeerInfo {
	g.mu.RLock()
	defer g.mu.RUnlock()

	var peers []*PeerInfo
	for _, p := range g.peers {
		peers = append(peers, p)
	}
	return peers
}

// heartbeat updates peer status
func (g *GossipManager) heartbeat() {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-g.ctx.Done():
			return
		case <-ticker.C:
			g.mu.Lock()
			now := time.Now()
			for _, p := range g.peers {
				if now.Sub(p.LastSeen) > 30*time.Second {
					p.Status = "offline"
				}
			}
			g.mu.Unlock()
		}
	}
}

// Close closes the gossip manager
func (g *GossipManager) Close() {
	g.cancel()
	if g.sub != nil {
		g.sub.Cancel()
	}
	if g.topic != nil {
		g.topic.Close()
	}
	_ = g.host.Close()
}

// SetupMDNS sets up mDNS discovery
func (g *GossipManager) SetupMDNS(serviceName string) error {
	notifee := &mdnsNotifee{
		host: g.host,
		mgr:  g,
	}

	service := mdns.NewMdnsService(g.host, serviceName, notifee)
	return service.Start()
}

// mdnsNotifee handles mDNS discovery
type mdnsNotifee struct {
	host host.Host
	mgr  *GossipManager
}

// selectBestAddress 从地址列表中选择最佳地址（优先选择可连通的同网段地址）
func selectBestAddress(addrs []multiaddr.Multiaddr) string {
	if len(addrs) == 0 {
		return ""
	}

	var bestAddr string
	var hasCandidate bool

	// 1. 优先选择 192.168.3.x 网段的地址（可 ping 通的网段）
	for _, addr := range addrs {
		addrStr := addr.String()
		if strings.Contains(addrStr, "/ip4/192.168.3.") && !strings.Contains(addrStr, "/ip4/127.0.0.1") && !strings.Contains(addrStr, "/ip4/0.0.0.0") {
			log.Printf("[selectBestAddress] 优先选择同网段地址: %s", addrStr)
			return addrStr
		}
	}

	// 2. 如果没有找到同网段，选择其他非回环的 IPv4 地址
	for _, addr := range addrs {
		addrStr := addr.String()
		if strings.Contains(addrStr, "/ip4/") && !strings.Contains(addrStr, "/ip4/127.0.0.1") && !strings.Contains(addrStr, "/ip4/0.0.0.0") {
			if !hasCandidate {
				bestAddr = addrStr
				hasCandidate = true
			}
		}
	}

	if hasCandidate {
		log.Printf("[selectBestAddress] 选择地址: %s", bestAddr)
		return bestAddr
	}

	// 3. 兜底选择第一个地址
	fallbackAddr := addrs[0].String()
	log.Printf("[selectBestAddress] 使用兜底地址: %s", fallbackAddr)
	return fallbackAddr
}

func (n *mdnsNotifee) HandlePeerFound(pi peer.AddrInfo) {
	if pi.ID == n.host.ID() {
		return
	}

	if err := n.host.Connect(n.mgr.ctx, pi); err != nil {
		log.Printf("Error connecting to peer %s: %v", pi.ID, err)
		return
	}

	n.mgr.mu.Lock()
	n.mgr.peers[pi.ID] = &PeerInfo{
		ID:       pi.ID,
		Addr:     selectBestAddress(pi.Addrs),
		LastSeen: time.Now(),
		Status:   "online",
	}
	n.mgr.mu.Unlock()

	log.Printf("Found and connected to peer: %s", pi.ID)
}
