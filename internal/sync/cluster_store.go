package sync

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"time"

	bolt "go.etcd.io/bbolt"
)

// ──────────────────────────────────────────────
//  Bucket 名称常量 — bbolt 嵌套层级结构
// ──────────────────────────────────────────────

const (
	bktCluster     = "cluster"      // 根 bucket
	bktNodes       = "nodes"        // cluster/nodes/<nodeID>/...
	bktDeviceIndex = "device_index" // cluster/device_index/<deviceID> → 跨节点索引
	bktMeta        = "meta"         // cluster/meta/<key> → 集群元数据
)

// ──────────────────────────────────────────────
//  保留键名 (在嵌套 bucket 中区分配置与子 bucket)
// ──────────────────────────────────────────────

const (
	reservedKeyMeta     = "__meta__"     // 节点/通道/设备 元数据
	reservedKeyConfig   = "__config__"   // 配置 JSON
	reservedKeySnapshot = "__snapshot__" // 全量快照 JSON (快速整取)
)

// ──────────────────────────────────────────────
//  ClusterStore — 基于 bbolt 的集群快照持久化存储
// ──────────────────────────────────────────────
//
//  层级 Bucket 结构:
//    cluster/
//      nodes/<nodeID>/                     ← 每个节点一个子 bucket
//        __meta__                           → NodeMeta JSON
//        __snapshot__                       → NodeSnapshot JSON（全量快照）
//        channels/<channelID>/              ← 通道子 bucket
//          __config__                        → TreeChannel JSON
//          devices/<deviceID>/              ← 设备子 bucket
//            __config__                      → TreeDevice JSON
//            points/<pointID>               → TreePoint JSON
//      device_index/<deviceID>             → DeviceIndexEntry JSON（跨节点）
//      meta/<key>                           → 集群级元数据
//
//  ARM64/ARMv7: bbolt 为纯 Go 实现，无 CGO 依赖，天然跨平台兼容。

type ClusterStore struct {
	db   *bolt.DB
	path string
	mu   sync.RWMutex
}

// ─────────────────── 辅助类型 ───────────────────

// NodeMeta 存储节点的基础元信息
type NodeMeta struct {
	NodeID     string      `json:"node_id"`
	NodeName   string      `json:"node_name"`
	CapturedAt time.Time   `json:"captured_at"`
	Summary    TreeSummary `json:"summary"`
	Status     string      `json:"status"` // online, offline, syncing
	Version    uint64      `json:"version"`
}

// DeviceIndexEntry 记录某个设备出现在哪些节点上
type DeviceIndexEntry struct {
	DeviceID string   `json:"device_id"`
	NodeIDs  []string `json:"node_ids"`
}

// ClusterSummary 集群聚合统计
type ClusterSummary struct {
	NodeCount    int       `json:"node_count"`
	DeviceCount  int       `json:"device_count"`
	ChannelCount int       `json:"channel_count"`
	PointCount   int       `json:"point_count"`
	KnownDevices int       `json:"known_devices"` // 去重后设备数
	UpdatedAt    time.Time `json:"updated_at"`
}

// DeviceSnapshot 按设备ID检索的跨节点快照
type DeviceSnapshot struct {
	DeviceID string                 `json:"device_id"`
	Nodes    map[string]*TreeDevice `json:"nodes"` // nodeID → device config
}

// ─────────────────── 构造 / 关闭 ───────────────────

// NewClusterStore 创建 ClusterStore，复用现有 storage/ConfigStore 的 bbolt 模式。
// dataPath: 数据目录路径（如 data/sync），数据库文件自动命名为 cluster.db。
func NewClusterStore(dataPath string) (*ClusterStore, error) {
	log.Printf("[ClusterStore] Initializing at: %s", dataPath)

	dbPath := dataPath
	if filepath.Ext(dataPath) == "" {
		if err := os.MkdirAll(dataPath, 0755); err != nil {
			log.Printf("[ClusterStore] Failed to create directory: %v", err)
			return nil, fmt.Errorf("cluster store mkdir: %w", err)
		}
		dbPath = filepath.Join(dataPath, "cluster.db")
		log.Printf("[ClusterStore] DB path: %s", dbPath)
	} else if err := os.MkdirAll(filepath.Dir(dataPath), 0755); err != nil {
		log.Printf("[ClusterStore] Failed to create parent dir: %v", err)
		return nil, fmt.Errorf("cluster store mkdir parent: %w", err)
	}

	// bbolt 打开选项 — 参考 config_store.go + boltdb.go
	// FreelistArrayType: ARM 设备上内存更友好（适合嵌入式）
	// Timeout: 5s, 比 ConfigStore 宽松但不过长
	// NoGrowSync: false 保障数据完整性
	db, err := bolt.Open(dbPath, 0600, &bolt.Options{
		Timeout:      5 * time.Second,
		NoGrowSync:   false, // 保证集群快照不丢失
		FreelistType: bolt.FreelistArrayType,
	})
	if err != nil {
		log.Printf("[ClusterStore] Failed to open db: %v", err)
		return nil, fmt.Errorf("cluster store open: %w", err)
	}

	// 初始化桶结构
	if err := db.Update(func(tx *bolt.Tx) error {
		root, err := tx.CreateBucketIfNotExists([]byte(bktCluster))
		if err != nil {
			return fmt.Errorf("create root bucket: %w", err)
		}
		if _, err := root.CreateBucketIfNotExists([]byte(bktNodes)); err != nil {
			return fmt.Errorf("create nodes bucket: %w", err)
		}
		if _, err := root.CreateBucketIfNotExists([]byte(bktDeviceIndex)); err != nil {
			return fmt.Errorf("create device_index bucket: %w", err)
		}
		if _, err := root.CreateBucketIfNotExists([]byte(bktMeta)); err != nil {
			return fmt.Errorf("create meta bucket: %w", err)
		}
		return nil
	}); err != nil {
		db.Close()
		return nil, err
	}

	log.Printf("[ClusterStore] Initialized successfully")
	return &ClusterStore{db: db, path: dbPath}, nil
}

// Close 关闭数据库（幂等）
func (cs *ClusterStore) Close() error {
	if cs.db != nil {
		log.Printf("[ClusterStore] Closing database")
		return cs.db.Close()
	}
	return nil
}

// ─────────────────── Node 操作 ───────────────────

// PutNodeSnapshot 存储一个节点的完整快照到 bbolt。
// 使用单事务保证原子性：失败则整体回滚。
func (cs *ClusterStore) PutNodeSnapshot(nodeID string, snapshot *NodeSnapshot) error {
	if snapshot == nil {
		return fmt.Errorf("snapshot is nil")
	}
	cs.mu.Lock()
	defer cs.mu.Unlock()

	return cs.db.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return fmt.Errorf("cluster root bucket missing")
		}
		nodes := root.Bucket([]byte(bktNodes))
		if nodes == nil {
			return fmt.Errorf("nodes bucket missing")
		}

		// 获取或创建节点 bucket
		nodeBucket, err := nodes.CreateBucketIfNotExists([]byte(nodeID))
		if err != nil {
			return fmt.Errorf("create node bucket %s: %w", nodeID, err)
		}

		// ── 存储元数据 ──
		meta := NodeMeta{
			NodeID:     nodeID,
			NodeName:   snapshot.NodeName,
			CapturedAt: snapshot.CapturedAt,
			Summary:    snapshot.Summary,
			Status:     "syncing",
		}
		metaJSON, _ := json.Marshal(meta)
		if err := nodeBucket.Put([]byte(reservedKeyMeta), metaJSON); err != nil {
			return fmt.Errorf("put node meta: %w", err)
		}

		// ── 存储全量快照 (快速整取) ──
		fullJSON, err := json.Marshal(snapshot)
		if err != nil {
			return fmt.Errorf("marshal snapshot: %w", err)
		}
		if err := nodeBucket.Put([]byte(reservedKeySnapshot), fullJSON); err != nil {
			return fmt.Errorf("put node snapshot: %w", err)
		}

		// ── 展开存储层级: channel → device → point ──
		if err := cs.putNodeChannels(nodeBucket, nodeID, snapshot.Channels); err != nil {
			return err
		}

		// ── 更新 device_index ──
		if err := cs.updateDeviceIndex(root, nodeID, snapshot.Channels); err != nil {
			return err
		}

		// ── 更新集群元数据 ──
		cs.markUpdated(root)

		log.Printf("[ClusterStore] Stored snapshot for node %s (%d channels, %d devices, %d points)",
			nodeID, len(snapshot.Channels), snapshot.Summary.DeviceCount, snapshot.Summary.PointCount)
		return nil
	})
}

// putNodeChannels 展开存储通道、设备、点位的层级结构。
func (cs *ClusterStore) putNodeChannels(nodeBucket *bolt.Bucket, nodeID string, channels []TreeChannel) error {
	// 为 channels 创建子 bucket
	chBucket, err := nodeBucket.CreateBucketIfNotExists([]byte("channels"))
	if err != nil {
		return fmt.Errorf("create channels bucket: %w", err)
	}

	// 先清理旧数据: 删除所有现存 channel 子 bucket
	_ = chBucket.ForEach(func(k, v []byte) error {
		if v == nil { // 子 bucket
			return chBucket.DeleteBucket(k)
		}
		return nil
	})

	for _, ch := range channels {
		chData := TreeChannel{
			Type:       ch.Type,
			ID:         ch.ID,
			Label:      ch.Label,
			Name:       ch.Name,
			Protocol:   ch.Protocol,
			Status:     ch.Status,
			Enabled:    ch.Enabled,
			HasDiff:    ch.HasDiff,
			SourceFile: ch.SourceFile,
			Config:     ch.Config,
		}

		// 每个通道一个子 bucket
		chSub, err := chBucket.CreateBucketIfNotExists([]byte(ch.ID))
		if err != nil {
			return fmt.Errorf("create channel bucket %s: %w", ch.ID, err)
		}

		// 存储通道配置
		chJSON, _ := json.Marshal(chData)
		if err := chSub.Put([]byte(reservedKeyConfig), chJSON); err != nil {
			return fmt.Errorf("put channel config %s: %w", ch.ID, err)
		}

		// 递归存储设备
		if err := cs.putChannelDevices(chSub, ch.Devices); err != nil {
			return err
		}
	}
	return nil
}

// putChannelDevices 在通道 bucket 下存储所有设备及点位。
func (cs *ClusterStore) putChannelDevices(chSub *bolt.Bucket, devices []TreeDevice) error {
	devBucket, err := chSub.CreateBucketIfNotExists([]byte("devices"))
	if err != nil {
		return fmt.Errorf("create devices bucket: %w", err)
	}

	// 清理旧设备数据
	_ = devBucket.ForEach(func(k, v []byte) error {
		if v == nil {
			return devBucket.DeleteBucket(k)
		}
		return nil
	})

	for _, dev := range devices {
		devData := TreeDevice{
			Type:       dev.Type,
			ID:         dev.ID,
			Label:      dev.Label,
			Name:       dev.Name,
			Status:     dev.Status,
			Enabled:    dev.Enabled,
			HasDiff:    dev.HasDiff,
			PointCount: dev.PointCount,
			SourceFile: dev.SourceFile,
			Config:     dev.Config,
		}

		devSub, err := devBucket.CreateBucketIfNotExists([]byte(dev.ID))
		if err != nil {
			return fmt.Errorf("create device bucket %s: %w", dev.ID, err)
		}

		devJSON, _ := json.Marshal(devData)
		if err := devSub.Put([]byte(reservedKeyConfig), devJSON); err != nil {
			return fmt.Errorf("put device config %s: %w", dev.ID, err)
		}

		// 存储点位
		if err := cs.putDevicePoints(devSub, dev.Points); err != nil {
			return err
		}
	}
	return nil
}

// putDevicePoints 在设备 bucket 下存储所有点位。
func (cs *ClusterStore) putDevicePoints(devSub *bolt.Bucket, points []TreePoint) error {
	ptBucket, err := devSub.CreateBucketIfNotExists([]byte("points"))
	if err != nil {
		return fmt.Errorf("create points bucket: %w", err)
	}

	// 清理旧点位
	_ = ptBucket.ForEach(func(k, v []byte) error {
		return ptBucket.Delete(k)
	})

	for _, pt := range points {
		ptJSON, err := json.Marshal(pt)
		if err != nil {
			return fmt.Errorf("marshal point %s: %w", pt.ID, err)
		}
		if err := ptBucket.Put([]byte(pt.ID), ptJSON); err != nil {
			return fmt.Errorf("put point %s: %w", pt.ID, err)
		}
	}
	return nil
}

// ─────────────────── 索引操作 ───────────────────

// updateDeviceIndex 更新 deviceID → nodeIDs 的映射索引。
func (cs *ClusterStore) updateDeviceIndex(root *bolt.Bucket, nodeID string, channels []TreeChannel) error {
	idxBucket := root.Bucket([]byte(bktDeviceIndex))
	if idxBucket == nil {
		return fmt.Errorf("device_index bucket missing")
	}

	for _, ch := range channels {
		for _, dev := range ch.Devices {
			entry := cs.getOrCreateIndexEntry(idxBucket, dev.ID)
			entry.NodeIDs = dedupeStrings(append(entry.NodeIDs, nodeID))
			sort.Strings(entry.NodeIDs)

			data, _ := json.Marshal(entry)
			if err := idxBucket.Put([]byte(dev.ID), data); err != nil {
				return fmt.Errorf("put device index %s: %w", dev.ID, err)
			}
		}
	}
	return nil
}

// getOrCreateIndexEntry 读取或创建 DeviceIndexEntry。
func (cs *ClusterStore) getOrCreateIndexEntry(idxBucket *bolt.Bucket, deviceID string) *DeviceIndexEntry {
	if data := idxBucket.Get([]byte(deviceID)); data != nil {
		var entry DeviceIndexEntry
		if err := json.Unmarshal(data, &entry); err == nil {
			return &entry
		}
	}
	return &DeviceIndexEntry{DeviceID: deviceID}
}

// removeFromDeviceIndex 从索引中移除某节点对该设备的引用。
func (cs *ClusterStore) removeFromDeviceIndex(root *bolt.Bucket, nodeID string, channels []TreeChannel) error {
	idxBucket := root.Bucket([]byte(bktDeviceIndex))
	if idxBucket == nil {
		return nil
	}

	for _, ch := range channels {
		for _, dev := range ch.Devices {
			data := idxBucket.Get([]byte(dev.ID))
			if data == nil {
				continue
			}
			var entry DeviceIndexEntry
			if err := json.Unmarshal(data, &entry); err != nil {
				continue
			}

			// 移除该 nodeID
			entry.NodeIDs = removeString(entry.NodeIDs, nodeID)
			if len(entry.NodeIDs) == 0 {
				// 没有节点持有该设备，清理索引
				_ = idxBucket.Delete([]byte(dev.ID))
			} else {
				data, _ := json.Marshal(entry)
				_ = idxBucket.Put([]byte(dev.ID), data)
			}
		}
	}
	return nil
}

// ─────────────────── 读取操作 ───────────────────

// GetNodeSnapshot 从 bbolt 重建完整 NodeSnapshot。
func (cs *ClusterStore) GetNodeSnapshot(nodeID string) (*NodeSnapshot, error) {
	cs.mu.RLock()
	defer cs.mu.RUnlock()

	var snapshot *NodeSnapshot
	err := cs.db.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return fmt.Errorf("cluster root bucket missing")
		}
		nodes := root.Bucket([]byte(bktNodes))
		if nodes == nil {
			return nil
		}
		nodeBucket := nodes.Bucket([]byte(nodeID))
		if nodeBucket == nil {
			return nil // 节点不存在，返回 nil
		}

		// 优先读取全量快照
		snapData := nodeBucket.Get([]byte(reservedKeySnapshot))
		if snapData != nil {
			snapshot = &NodeSnapshot{}
			return json.Unmarshal(snapData, snapshot)
		}

		// fallback: 从层级结构重建
		meta := cs.readNodeMeta(nodeBucket)
		snapshot = &NodeSnapshot{
			NodeID:     nodeID,
			NodeName:   meta.NodeName,
			CapturedAt: meta.CapturedAt,
			Summary:    meta.Summary,
		}

		// 重建 channels
		snapshot.Channels = cs.readChannels(nodeBucket)

		// 重建 summary
		snapshot.Summary = TreeSummary{
			ChannelCount: len(snapshot.Channels),
		}
		for _, ch := range snapshot.Channels {
			snapshot.Summary.DeviceCount += len(ch.Devices)
			for _, dev := range ch.Devices {
				snapshot.Summary.PointCount += len(dev.Points)
			}
		}
		return nil
	})
	return snapshot, err
}

// readNodeMeta 读取节点元数据
func (cs *ClusterStore) readNodeMeta(nodeBucket *bolt.Bucket) NodeMeta {
	var meta NodeMeta
	if data := nodeBucket.Get([]byte(reservedKeyMeta)); data != nil {
		_ = json.Unmarshal(data, &meta)
	}
	return meta
}

// readChannels 从层级存储中读取所有通道。
func (cs *ClusterStore) readChannels(nodeBucket *bolt.Bucket) []TreeChannel {
	chBucket := nodeBucket.Bucket([]byte("channels"))
	if chBucket == nil {
		return nil
	}

	var channels []TreeChannel
	_ = chBucket.ForEach(func(k, v []byte) error {
		if v != nil {
			return nil // 跳过非 bucket 项
		}
		chSub := chBucket.Bucket(k)
		if chSub == nil {
			return nil
		}

		var ch TreeChannel
		if data := chSub.Get([]byte(reservedKeyConfig)); data != nil {
			_ = json.Unmarshal(data, &ch)
		}

		// 读取设备
		ch.Devices = cs.readDevices(chSub, string(k))
		channels = append(channels, ch)
		return nil
	})

	sort.Slice(channels, func(i, j int) bool { return channels[i].ID < channels[j].ID })
	return channels
}

// readDevices 从通道 bucket 中读取所有设备。
func (cs *ClusterStore) readDevices(chSub *bolt.Bucket, channelID string) []TreeDevice {
	devBucket := chSub.Bucket([]byte("devices"))
	if devBucket == nil {
		return nil
	}

	var devices []TreeDevice
	_ = devBucket.ForEach(func(k, v []byte) error {
		if v != nil {
			return nil
		}
		devSub := devBucket.Bucket(k)
		if devSub == nil {
			return nil
		}

		var dev TreeDevice
		if data := devSub.Get([]byte(reservedKeyConfig)); data != nil {
			_ = json.Unmarshal(data, &dev)
		}

		// 读取点位
		dev.Points = cs.readPoints(devSub)
		dev.PointCount = len(dev.Points)
		devices = append(devices, dev)
		return nil
	})

	sort.Slice(devices, func(i, j int) bool { return devices[i].ID < devices[j].ID })
	return devices
}

// readPoints 从设备 bucket 中读取所有点位。
func (cs *ClusterStore) readPoints(devSub *bolt.Bucket) []TreePoint {
	ptBucket := devSub.Bucket([]byte("points"))
	if ptBucket == nil {
		return nil
	}

	var points []TreePoint
	_ = ptBucket.ForEach(func(k, v []byte) error {
		var pt TreePoint
		if err := json.Unmarshal(v, &pt); err == nil {
			points = append(points, pt)
		}
		return nil
	})

	sort.Slice(points, func(i, j int) bool { return points[i].ID < points[j].ID })
	return points
}

// ─────────────────── 按设备ID查询 ───────────────────

// GetDeviceSnapshot 按设备ID获取跨节点的设备快照。
// 返回该设备在各个节点上的配置。
func (cs *ClusterStore) GetDeviceSnapshot(deviceID string) (*DeviceSnapshot, error) {
	cs.mu.RLock()
	defer cs.mu.RUnlock()

	ds := &DeviceSnapshot{
		DeviceID: deviceID,
		Nodes:    make(map[string]*TreeDevice),
	}

	err := cs.db.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return fmt.Errorf("cluster root bucket missing")
		}

		// 从索引查该设备所属节点
		idxBucket := root.Bucket([]byte(bktDeviceIndex))
		if idxBucket == nil {
			return nil
		}
		data := idxBucket.Get([]byte(deviceID))
		if data == nil {
			return nil // 设备未找到
		}
		var entry DeviceIndexEntry
		if err := json.Unmarshal(data, &entry); err != nil {
			return err
		}

		// 逐节点查找设备
		nodesBucket := root.Bucket([]byte(bktNodes))
		if nodesBucket == nil {
			return nil
		}
		for _, nodeID := range entry.NodeIDs {
			nodeBucket := nodesBucket.Bucket([]byte(nodeID))
			if nodeBucket == nil {
				continue
			}
			dev := cs.findDeviceInNode(nodeBucket, deviceID)
			if dev != nil {
				ds.Nodes[nodeID] = dev
			}
		}
		return nil
	})

	return ds, err
}

// findDeviceInNode 在节点 bucket 中根据 deviceID 遍历查找设备。
func (cs *ClusterStore) findDeviceInNode(nodeBucket *bolt.Bucket, deviceID string) *TreeDevice {
	chBucket := nodeBucket.Bucket([]byte("channels"))
	if chBucket == nil {
		return nil
	}

	var found *TreeDevice
	_ = chBucket.ForEach(func(chKey, chVal []byte) error {
		if chVal != nil {
			return nil
		}
		chSub := chBucket.Bucket(chKey)
		if chSub == nil {
			return nil
		}
		devBucket := chSub.Bucket([]byte("devices"))
		if devBucket == nil {
			return nil
		}
		devSub := devBucket.Bucket([]byte(deviceID))
		if devSub == nil {
			return nil
		}
		var dev TreeDevice
		if data := devSub.Get([]byte(reservedKeyConfig)); data != nil {
			_ = json.Unmarshal(data, &dev)
		}

		// 同时读取点位
		dev.Points = cs.readPoints(devSub)
		dev.PointCount = len(dev.Points)
		found = &dev
		return fmt.Errorf("stop") // 找到后停止遍历
	})
	return found
}

// GetDeviceOwners 返回持有指定设备的所有节点ID。
func (cs *ClusterStore) GetDeviceOwners(deviceID string) ([]string, error) {
	cs.mu.RLock()
	defer cs.mu.RUnlock()

	var owners []string
	err := cs.db.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return nil
		}
		idxBucket := root.Bucket([]byte(bktDeviceIndex))
		if idxBucket == nil {
			return nil
		}
		data := idxBucket.Get([]byte(deviceID))
		if data == nil {
			return nil
		}
		var entry DeviceIndexEntry
		if err := json.Unmarshal(data, &entry); err != nil {
			return err
		}
		owners = entry.NodeIDs
		return nil
	})
	return owners, err
}

// ─────────────────── 节点列表与统计 ───────────────────

// GetAllNodes 返回所有已知节点元数据。
func (cs *ClusterStore) GetAllNodes() ([]NodeMeta, error) {
	cs.mu.RLock()
	defer cs.mu.RUnlock()

	var nodes []NodeMeta
	err := cs.db.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return nil
		}
		nodesBucket := root.Bucket([]byte(bktNodes))
		if nodesBucket == nil {
			return nil
		}

		return nodesBucket.ForEach(func(k, v []byte) error {
			if v != nil {
				return nil
			}
			nodeBucket := nodesBucket.Bucket(k)
			if nodeBucket == nil {
				return nil
			}
			meta := cs.readNodeMeta(nodeBucket)
			nodes = append(nodes, meta)
			return nil
		})
	})

	sort.Slice(nodes, func(i, j int) bool { return nodes[i].NodeID < nodes[j].NodeID })
	return nodes, err
}

// GetNodeDevices 返回指定节点的所有设备列表。
func (cs *ClusterStore) GetNodeDevices(nodeID string) ([]TreeDevice, error) {
	snap, err := cs.GetNodeSnapshot(nodeID)
	if err != nil || snap == nil {
		return nil, err
	}

	var devices []TreeDevice
	for _, ch := range snap.Channels {
		devices = append(devices, ch.Devices...)
	}
	return devices, nil
}

// GetClusterSummary 返回集群聚合统计信息。
func (cs *ClusterStore) GetClusterSummary() (*ClusterSummary, error) {
	cs.mu.RLock()
	defer cs.mu.RUnlock()

	summary := &ClusterSummary{}
	knownSet := make(map[string]struct{})

	err := cs.db.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return nil
		}
		nodesBucket := root.Bucket([]byte(bktNodes))
		if nodesBucket == nil {
			return nil
		}

		return nodesBucket.ForEach(func(k, v []byte) error {
			if v != nil {
				return nil
			}
			nodeBucket := nodesBucket.Bucket(k)
			if nodeBucket == nil {
				return nil
			}
			meta := cs.readNodeMeta(nodeBucket)
			summary.NodeCount++
			summary.ChannelCount += meta.Summary.ChannelCount
			summary.DeviceCount += meta.Summary.DeviceCount
			summary.PointCount += meta.Summary.PointCount

			// 收集已知设备
			chBucket := nodeBucket.Bucket([]byte("channels"))
			if chBucket != nil {
				_ = chBucket.ForEach(func(chKey, chVal []byte) error {
					if chVal != nil {
						return nil
					}
					chSub := chBucket.Bucket(chKey)
					if chSub == nil {
						return nil
					}
					devBucket := chSub.Bucket([]byte("devices"))
					if devBucket != nil {
						_ = devBucket.ForEach(func(devKey, devVal []byte) error {
							if devVal == nil {
								knownSet[string(devKey)] = struct{}{}
							}
							return nil
						})
					}
					return nil
				})
			}
			return nil
		})
	})

	summary.KnownDevices = len(knownSet)
	summary.UpdatedAt = time.Now()
	return summary, err
}

// ─────────────────── 删除操作 ───────────────────

// DeleteNode 删除指定节点及其关联索引。
func (cs *ClusterStore) DeleteNode(nodeID string) error {
	cs.mu.Lock()
	defer cs.mu.Unlock()

	return cs.db.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return nil
		}
		nodesBucket := root.Bucket([]byte(bktNodes))
		if nodesBucket == nil {
			return nil
		}

		// 先清理索引 — 读取设备列表
		nodeBucket := nodesBucket.Bucket([]byte(nodeID))
		if nodeBucket == nil {
			return nil // 节点已不存在
		}

		// 收集设备ID以清理索引
		var deviceIDs []string
		chBucket := nodeBucket.Bucket([]byte("channels"))
		if chBucket != nil {
			_ = chBucket.ForEach(func(chKey, chVal []byte) error {
				if chVal != nil {
					return nil
				}
				chSub := chBucket.Bucket(chKey)
				if chSub == nil {
					return nil
				}
				devBucket := chSub.Bucket([]byte("devices"))
				if devBucket != nil {
					_ = devBucket.ForEach(func(devKey, devVal []byte) error {
						if devVal == nil {
							deviceIDs = append(deviceIDs, string(devKey))
						}
						return nil
					})
				}
				return nil
			})
		}

		// 删除节点 bucket
		if err := nodesBucket.DeleteBucket([]byte(nodeID)); err != nil {
			return fmt.Errorf("delete node bucket %s: %w", nodeID, err)
		}

		// 清理索引
		idxBucket := root.Bucket([]byte(bktDeviceIndex))
		if idxBucket != nil {
			for _, devID := range deviceIDs {
				cs.removeDeviceIDFromIndex(idxBucket, devID, nodeID)
			}
		}

		cs.markUpdated(root)
		log.Printf("[ClusterStore] Deleted node: %s", nodeID)
		return nil
	})
}

// removeDeviceIDFromIndex 从索引中移除某节点对设备的引用。
func (cs *ClusterStore) removeDeviceIDFromIndex(idxBucket *bolt.Bucket, deviceID, nodeID string) {
	data := idxBucket.Get([]byte(deviceID))
	if data == nil {
		return
	}
	var entry DeviceIndexEntry
	if err := json.Unmarshal(data, &entry); err != nil {
		return
	}
	entry.NodeIDs = removeString(entry.NodeIDs, nodeID)
	if len(entry.NodeIDs) == 0 {
		_ = idxBucket.Delete([]byte(deviceID))
	} else {
		newData, _ := json.Marshal(entry)
		_ = idxBucket.Put([]byte(deviceID), newData)
	}
}

// ─────────────────── 元数据操作 ───────────────────

// markUpdated 更新集群级别的时间戳。
func (cs *ClusterStore) markUpdated(root *bolt.Bucket) {
	metaBucket := root.Bucket([]byte(bktMeta))
	if metaBucket != nil {
		ts, _ := json.Marshal(time.Now())
		_ = metaBucket.Put([]byte("last_updated"), ts)
	}
}

// SetClusterMeta 设置集群级别的键值对元数据。
func (cs *ClusterStore) SetClusterMeta(key, value string) error {
	cs.mu.Lock()
	defer cs.mu.Unlock()

	return cs.db.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return fmt.Errorf("cluster root bucket missing")
		}
		metaBucket := root.Bucket([]byte(bktMeta))
		if metaBucket == nil {
			return fmt.Errorf("meta bucket missing")
		}
		return metaBucket.Put([]byte(key), []byte(value))
	})
}

// GetClusterMeta 获取集群级别元数据。
func (cs *ClusterStore) GetClusterMeta(key string) (string, error) {
	cs.mu.RLock()
	defer cs.mu.RUnlock()

	var value string
	err := cs.db.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return nil
		}
		metaBucket := root.Bucket([]byte(bktMeta))
		if metaBucket == nil {
			return nil
		}
		data := metaBucket.Get([]byte(key))
		if data != nil {
			value = string(data)
		}
		return nil
	})
	return value, err
}

// ─────────────────── 设备索引工具 ───────────────────

// ListKnownDevices 返回所有已知的设备ID列表（去重）。
func (cs *ClusterStore) ListKnownDevices() ([]string, error) {
	cs.mu.RLock()
	defer cs.mu.RUnlock()

	var devices []string
	err := cs.db.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return nil
		}
		idxBucket := root.Bucket([]byte(bktDeviceIndex))
		if idxBucket == nil {
			return nil
		}
		return idxBucket.ForEach(func(k, v []byte) error {
			devices = append(devices, string(k))
			return nil
		})
	})

	sort.Strings(devices)
	return devices, err
}

// ─────────────────── 工具函数 ───────────────────

// dedupeStrings 去重字符串切片（保持顺序）。
func dedupeStrings(ss []string) []string {
	seen := make(map[string]struct{}, len(ss))
	var out []string
	for _, s := range ss {
		if _, ok := seen[s]; !ok {
			seen[s] = struct{}{}
			out = append(out, s)
		}
	}
	return out
}

// removeString 从切片中移除指定字符串。
func removeString(ss []string, target string) []string {
	for i, s := range ss {
		if s == target {
			return append(ss[:i], ss[i+1:]...)
		}
	}
	return ss
}

// ─────────────────── 批量快照同步 ───────────────────

// PutRemoteSnapshot 存储远程节点的快照（与 PutNodeSnapshot 相同，语义区分）。
func (cs *ClusterStore) PutRemoteSnapshot(nodeID string, snapshot *NodeSnapshot) error {
	return cs.PutNodeSnapshot(nodeID, snapshot)
}

// SnapshotExists 判断指定节点快照是否已存在。
func (cs *ClusterStore) SnapshotExists(nodeID string) bool {
	cs.mu.RLock()
	defer cs.mu.RUnlock()

	exists := false
	_ = cs.db.View(func(tx *bolt.Tx) error {
		root := tx.Bucket([]byte(bktCluster))
		if root == nil {
			return nil
		}
		nodes := root.Bucket([]byte(bktNodes))
		if nodes == nil {
			return nil
		}
		if nodes.Bucket([]byte(nodeID)) != nil {
			exists = true
		}
		return nil
	})
	return exists
}

// DBPath returns the database file path.
func (cs *ClusterStore) DBPath() string {
	return cs.path
}
