// Package sync implements industrial-grade distributed configuration sync
// based on go-libp2p with Gossip, WAL, Anti-Entropy, and Device Takeover.
//
// Features:
//   - ConfigStore with WAL + KV persistence for reliability
//   - Gossip PubSub for fast propagation
//   - mDNS + Peer Cache for robust discovery
//   - Announce/Pull for efficient sync
//   - Digest Anti-Entropy for eventual consistency
//   - DeviceKey composite identity for IP drift resilience
//   - Takeover lock for distributed control
//   - Node roles (Leader/Follower/Readonly) for write control
package sync
