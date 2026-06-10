package sync

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"

	bolt "go.etcd.io/bbolt"
)

const (
	walBucket       = "wal"
	configBucket    = "config"
	indexBucket     = "index"
	deviceBucket    = "device_%s"
	snapshotBucket  = "snapshot_%s"
	syncNodeBucket  = "sync_node_%s"
	valuesBucket    = "values"
)

type BucketConfig struct {
	Pattern        string
	Description    string
	AccessMode     string
	RetentionDays  int
	MaxRecords     int
	PartitionKey   string
}

type StorageConfig struct {
	Path           string
	PageSize       int
	CacheSize      int
	Timeout        time.Duration
	NoGrowSync     bool
	FreelistType   bolt.FreelistType
	WriteBuffer    int
}

type ConfigStore struct {
	mem         map[string]*ConfigRecord
	disk        *bolt.DB
	index       map[string][]string
	path        string
	mu          sync.RWMutex
	bucketConfigs map[string]*BucketConfig
}

func DefaultStorageConfig() StorageConfig {
	return StorageConfig{
		Path:         "data/edgex.db",
		PageSize:     65536,
		CacheSize:    134217728,
		Timeout:      30 * time.Second,
		NoGrowSync:   true,
		FreelistType: bolt.FreelistArrayType,
		WriteBuffer:  65536,
	}
}

func NewConfigStoreWithConfig(cfg StorageConfig) (*ConfigStore, error) {
	log.Printf("[ConfigStore] Creating config store at path: %s", cfg.Path)

	dbPath := cfg.Path
	if filepath.Ext(cfg.Path) == "" {
		if err := os.MkdirAll(cfg.Path, 0755); err != nil {
			log.Printf("[ConfigStore] Failed to create directory: %v", err)
			return nil, err
		}
		dbPath = filepath.Join(cfg.Path, "config.db")
		log.Printf("[ConfigStore] Directory created, db path: %s", dbPath)
	} else if err := os.MkdirAll(filepath.Dir(cfg.Path), 0755); err != nil {
		log.Printf("[ConfigStore] Failed to create parent directory: %v", err)
		return nil, err
	}

	log.Printf("[ConfigStore] Opening bolt database...")
	db, err := bolt.Open(dbPath, 0600, &bolt.Options{
		Timeout:        cfg.Timeout,
		NoGrowSync:     cfg.NoGrowSync,
		FreelistType:   cfg.FreelistType,
		PageSize:       cfg.PageSize,
	})
	if err != nil {
		log.Printf("[ConfigStore] Failed to open database: %v", err)
		return nil, err
	}
	log.Printf("[ConfigStore] Database opened successfully")

	log.Printf("[ConfigStore] Creating core buckets...")
	if err := db.Update(func(tx *bolt.Tx) error {
		for _, bucket := range []string{walBucket, configBucket, indexBucket, valuesBucket} {
			if _, err := tx.CreateBucketIfNotExists([]byte(bucket)); err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		log.Printf("[ConfigStore] Failed to create buckets: %v", err)
		db.Close()
		return nil, err
	}
	log.Printf("[ConfigStore] Core buckets created")

	store := &ConfigStore{
		mem:         make(map[string]*ConfigRecord),
		disk:        db,
		index:       make(map[string][]string),
		path:        dbPath,
		bucketConfigs: make(map[string]*BucketConfig),
	}

	store.initBucketConfigs()

	log.Printf("[ConfigStore] Loading from disk...")
	if err := store.loadFromDisk(); err != nil {
		log.Printf("[ConfigStore] Failed to load from disk: %v", err)
		db.Close()
		return nil, err
	}
	log.Printf("[ConfigStore] Config store initialized successfully")

	return store, nil
}

func NewConfigStore(path string) (*ConfigStore, error) {
	cfg := DefaultStorageConfig()
	cfg.Path = path
	return NewConfigStoreWithConfig(cfg)
}

func (s *ConfigStore) initBucketConfigs() {
	s.bucketConfigs[configBucket] = &BucketConfig{
		Pattern:       configBucket,
		Description:   "Configuration storage for sync manager",
		AccessMode:    "read-write",
		RetentionDays: 365,
		MaxRecords:    10000,
	}
	s.bucketConfigs[walBucket] = &BucketConfig{
		Pattern:       walBucket,
		Description:   "Write-ahead log for data integrity",
		AccessMode:    "write-only",
		RetentionDays: 1,
		MaxRecords:    100000,
	}
	s.bucketConfigs[valuesBucket] = &BucketConfig{
		Pattern:       valuesBucket,
		Description:   "Latest value cache for all data points",
		AccessMode:    "read-write",
		RetentionDays: 7,
		MaxRecords:    500000,
	}
}

func (s *ConfigStore) GetDeviceBucketName(channelID string) string {
	return fmt.Sprintf(deviceBucket, channelID)
}

func (s *ConfigStore) GetSnapshotBucketName(deviceID string) string {
	return fmt.Sprintf(snapshotBucket, deviceID)
}

func (s *ConfigStore) GetSyncNodeBucketName(nodeID string) string {
	return fmt.Sprintf(syncNodeBucket, nodeID)
}

func (s *ConfigStore) EnsureBucket(bucketName string) error {
	return s.disk.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(bucketName))
		return err
	})
}

func (s *ConfigStore) GeneratePartitionKey(deviceID string, timestamp time.Time) string {
	hour := timestamp.Truncate(time.Hour)
	return fmt.Sprintf("%s_%d", deviceID, hour.Unix())
}

func (s *ConfigStore) GenerateSecondaryKey(deviceID string, timestamp time.Time, sequence int64) string {
	return fmt.Sprintf("%s_%d_%012d", deviceID, timestamp.Unix(), sequence)
}

func (s *ConfigStore) loadFromDisk() error {
	return s.disk.View(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(configBucket))
		if bucket == nil {
			return nil
		}

		return bucket.ForEach(func(k, v []byte) error {
			var rec ConfigRecord
			if err := json.Unmarshal(v, &rec); err != nil {
				return err
			}

			s.mem[string(k)] = &rec

			if rec.BindingKey != "" {
				s.index[rec.BindingKey] = append(s.index[rec.BindingKey], string(k))
			}

			return nil
		})
	})
}

func (s *ConfigStore) writeWAL(op string, rec *ConfigRecord) error {
	return s.disk.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(walBucket))
		if bucket == nil {
			return fmt.Errorf("wal bucket not found")
		}

		key := fmt.Sprintf("%d-%s", time.Now().UnixNano(), op)
		val, _ := json.Marshal(rec)
		return bucket.Put([]byte(key), val)
	})
}

func (s *ConfigStore) Put(rec *ConfigRecord) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if rec.Hash == "" {
		rec.Hash = s.computeHash(rec)
	}

	if err := s.writeWAL("put", rec); err != nil {
		return err
	}

	if err := s.writeToDisk(rec); err != nil {
		return err
	}

	s.mem[rec.Key] = rec

	if rec.BindingKey != "" {
		s.index[rec.BindingKey] = append(s.index[rec.BindingKey], rec.Key)
	}

	return nil
}

func (s *ConfigStore) PutToBucket(bucketName, key string, data interface{}) error {
	return s.disk.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(bucketName))
		if err != nil {
			return err
		}

		val, err := json.Marshal(data)
		if err != nil {
			return err
		}

		return b.Put([]byte(key), val)
	})
}

func (s *ConfigStore) GetFromBucket(bucketName, key string, result interface{}) error {
	return s.disk.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return fmt.Errorf("bucket %s not found", bucketName)
		}

		data := b.Get([]byte(key))
		if data == nil {
			return fmt.Errorf("key %s not found in bucket %s", key, bucketName)
		}

		return json.Unmarshal(data, result)
	})
}

func (s *ConfigStore) DeleteFromBucket(bucketName, key string) error {
	return s.disk.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return nil
		}
		return b.Delete([]byte(key))
	})
}

func (s *ConfigStore) writeToDisk(rec *ConfigRecord) error {
	return s.disk.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(configBucket))
		if bucket == nil {
			return fmt.Errorf("config bucket not found")
		}

		val, err := json.Marshal(rec)
		if err != nil {
			return err
		}

		return bucket.Put([]byte(rec.Key), val)
	})
}

func (s *ConfigStore) Get(key string) (*ConfigRecord, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rec, ok := s.mem[key]
	return rec, ok
}

func (s *ConfigStore) GetByBindingKey(bindingKey string) []*ConfigRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var results []*ConfigRecord
	for _, key := range s.index[bindingKey] {
		if rec, ok := s.mem[key]; ok {
			results = append(results, rec)
		}
	}
	return results
}

func (s *ConfigStore) Delete(key string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	rec, ok := s.mem[key]
	if !ok {
		return nil
	}

	if err := s.writeWAL("delete", rec); err != nil {
		return err
	}

	if err := s.disk.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(configBucket))
		if bucket == nil {
			return nil
		}
		return bucket.Delete([]byte(key))
	}); err != nil {
		return err
	}

	delete(s.mem, key)

	if rec.BindingKey != "" {
		for i, k := range s.index[rec.BindingKey] {
			if k == key {
				s.index[rec.BindingKey] = append(s.index[rec.BindingKey][:i], s.index[rec.BindingKey][i+1:]...)
				break
			}
		}
	}

	return nil
}

func (s *ConfigStore) GetAll() []*ConfigRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var results []*ConfigRecord
	for _, rec := range s.mem {
		results = append(results, rec)
	}
	return results
}

func (s *ConfigStore) GetDigest(nodeID string) *Digest {
	s.mu.RLock()
	defer s.mu.RUnlock()

	digest := &Digest{
		NodeID: nodeID,
		Keys:   make(map[string]uint64),
	}

	var allVersions []byte
	for key, rec := range s.mem {
		digest.Keys[key] = rec.Version
		allVersions = append(allVersions, []byte(fmt.Sprintf("%s:%d", key, rec.Version))...)
	}

	hash := sha256.Sum256(allVersions)
	digest.Hash = hex.EncodeToString(hash[:])

	return digest
}

func (s *ConfigStore) ListBucketKeys(bucketName string, prefix string) ([]string, error) {
	var keys []string
	err := s.disk.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return nil
		}

		c := b.Cursor()
		prefixBytes := []byte(prefix)
		for k, _ := c.Seek(prefixBytes); k != nil && len(k) >= len(prefixBytes) && string(k[:len(prefixBytes)]) == prefix; k, _ = c.Next() {
			keys = append(keys, string(k))
		}
		return nil
	})
	return keys, err
}

func (s *ConfigStore) PruneOldRecords(bucketName string, maxAge time.Duration) error {
	return s.disk.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return nil
		}

		cutoff := time.Now().Add(-maxAge).Unix()
		c := b.Cursor()
		var keysToDelete [][]byte

		for k, _ := c.First(); k != nil; k, _ = c.Next() {
			var timestamp int64
			if _, err := fmt.Sscanf(string(k), "%*[^_]_%d", &timestamp); err == nil {
				if timestamp < cutoff {
					keysToDelete = append(keysToDelete, append([]byte{}, k...))
				}
			}
		}

		for _, k := range keysToDelete {
			if err := b.Delete(k); err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *ConfigStore) computeHash(rec *ConfigRecord) string {
	data := fmt.Sprintf("%s:%d:%s:%s", rec.Key, rec.Version, rec.NodeID, string(rec.Value))
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

func (s *ConfigStore) Close() error {
	if s.disk != nil {
		return s.disk.Close()
	}
	return nil
}