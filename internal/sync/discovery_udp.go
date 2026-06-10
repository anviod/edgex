package sync

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p/core/peer"
)

const (
	udpBroadcastPort = 4002
	udpBroadcastAddr = "255.255.255.255:4002"
	broadcastInterval = 5 * time.Second
)

type UDPDiscovery struct {
	conn       *net.UDPConn
	localAddr  string
	peers      map[string]*PeerInfo
	ctx        context.Context
	cancel     context.CancelFunc
	mu         sync.RWMutex
	gossip     *GossipManager
	enabled    bool
}

func NewUDPDiscovery(gossip *GossipManager) (*UDPDiscovery, error) {
	conn, err := net.ListenUDP("udp4", &net.UDPAddr{Port: udpBroadcastPort})
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithCancel(context.Background())

	discovery := &UDPDiscovery{
		conn:      conn,
		peers:     make(map[string]*PeerInfo),
		ctx:       ctx,
		cancel:    cancel,
		gossip:    gossip,
		localAddr: getLocalIPv4Address(),
	}

	go discovery.listen()
	go discovery.broadcastLoop()

	log.Printf("[UDPDiscovery] Initialized on port %d", udpBroadcastPort)
	return discovery, nil
}

func (u *UDPDiscovery) Enable() {
	u.mu.Lock()
	u.enabled = true
	u.mu.Unlock()
	log.Printf("[UDPDiscovery] Enabled")
}

func (u *UDPDiscovery) Disable() {
	u.mu.Lock()
	u.enabled = false
	u.mu.Unlock()
	log.Printf("[UDPDiscovery] Disabled")
}

func (u *UDPDiscovery) listen() {
	buf := make([]byte, 1024)
	for {
		select {
		case <-u.ctx.Done():
			return
		default:
			n, addr, err := u.conn.ReadFromUDP(buf)
			if err != nil {
				continue
			}

			if addr.String() == u.localAddr+":"+fmt.Sprintf("%d", udpBroadcastPort) {
				continue
			}

			var msg discoveryMessage
			if err := json.Unmarshal(buf[:n], &msg); err != nil {
				continue
			}

			u.handleDiscoveryMessage(msg, addr)
		}
	}
}

func (u *UDPDiscovery) broadcastLoop() {
	ticker := time.NewTicker(broadcastInterval)
	defer ticker.Stop()

	for {
		select {
		case <-u.ctx.Done():
			return
		case <-ticker.C:
			u.broadcastPresence()
		}
	}
}

func (u *UDPDiscovery) broadcastPresence() {
	u.mu.RLock()
	enabled := u.enabled
	hostID := u.gossip.HostID().String()
	u.mu.RUnlock()

	if !enabled {
		return
	}

	msg := discoveryMessage{
		Type:    "presence",
		PeerID:  hostID,
		Address: u.localAddr,
		Port:    4001,
	}

	data, _ := json.Marshal(msg)
	broadcastAddr, _ := net.ResolveUDPAddr("udp4", udpBroadcastAddr)
	_, _ = u.conn.WriteToUDP(data, broadcastAddr)
}

func (u *UDPDiscovery) handleDiscoveryMessage(msg discoveryMessage, addr *net.UDPAddr) {
	if msg.Type != "presence" {
		return
	}

	if msg.PeerID == u.gossip.HostID().String() {
		return
	}

	u.mu.Lock()
	defer u.mu.Unlock()

	peerID := msg.PeerID
	peerAddr := fmt.Sprintf("/ip4/%s/tcp/%d", msg.Address, msg.Port)

	if existing, ok := u.peers[peerID]; ok {
		existing.LastSeen = time.Now()
		existing.Status = "online"
	} else {
		u.peers[peerID] = &PeerInfo{
			ID:       peer.ID(msg.PeerID),
			Addr:     peerAddr,
			LastSeen: time.Now(),
			Status:   "online",
		}
		log.Printf("[UDPDiscovery] Discovered peer via UDP: %s (%s)", peerID, peerAddr)
	}
}

func (u *UDPDiscovery) GetPeers() []*PeerInfo {
	u.mu.RLock()
	defer u.mu.RUnlock()

	var peers []*PeerInfo
	for _, p := range u.peers {
		peers = append(peers, p)
	}
	return peers
}

func (u *UDPDiscovery) Close() {
	u.cancel()
	_ = u.conn.Close()
}

type discoveryMessage struct {
	Type    string `json:"type"`
	PeerID  string `json:"peer_id"`
	Address string `json:"address"`
	Port    int    `json:"port"`
}

func getLocalIPv4Address() string {
	ifaces, err := net.Interfaces()
	if err != nil {
		return "127.0.0.1"
	}

	for _, iface := range ifaces {
		if iface.Flags&net.FlagUp == 0 || iface.Flags&net.FlagLoopback != 0 {
			continue
		}

		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}

		for _, addr := range addrs {
			ipnet, ok := addr.(*net.IPNet)
			if !ok || ipnet.IP.IsLoopback() {
				continue
			}

			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}

	return "127.0.0.1"
}