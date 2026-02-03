package storage

import (
	"encoding/json"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"time"

	"go.etcd.io/bbolt"
)

type Storage struct {
	db *bbolt.DB
}

const (
	BucketValues    = "values"
	BucketRuleState = "RuleState"
	BucketDataCache = "DataCache"
	BucketWindow    = "WindowData"
)

func NewStorage(path string) (*Storage, error) {
	db, err := bbolt.Open(path, 0600, &bbolt.Options{Timeout: 5 * time.Second})
	if err != nil {
		return nil, err
	}

	// Init buckets
	err = db.Update(func(tx *bbolt.Tx) error {
		buckets := []string{BucketValues, BucketRuleState, BucketDataCache, BucketWindow}
		for _, bucket := range buckets {
			if _, err := tx.CreateBucketIfNotExists([]byte(bucket)); err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	return &Storage{db: db}, nil
}

func (s *Storage) Close() error {
	return s.db.Close()
}

// SaveData generic save method
func (s *Storage) SaveData(bucketName string, key string, data interface{}) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(bucketName))
		if err != nil {
			return err
		}
		bytes, err := json.Marshal(data)
		if err != nil {
			return err
		}
		return b.Put([]byte(key), bytes)
	})
}

// GetData generic get method
func (s *Storage) GetData(bucketName string, key string, result interface{}) error {
	return s.db.View(func(tx *bbolt.Tx) error {
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

// DeleteData generic delete method
func (s *Storage) DeleteData(bucketName string, key string) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return nil // Bucket doesn't exist, nothing to delete
		}
		return b.Delete([]byte(key))
	})
}

// PruneOldest keeps only the latest maxRecords
func (s *Storage) PruneOldest(bucketName string, maxRecords int) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return nil
		}

		// Count
		count := b.Stats().KeyN
		if count <= maxRecords {
			return nil
		}

		deleteCount := count - maxRecords
		c := b.Cursor()
		for i := 0; i < deleteCount; i++ {
			k, _ := c.First()
			if k == nil {
				break
			}
			if err := b.Delete(k); err != nil {
				return err
			}
		}
		return nil
	})
}

// LoadLatest loads the latest N records
func (s *Storage) LoadLatest(bucketName string, limit int, callback func(k, v []byte) error) error {
	return s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return nil
		}

		c := b.Cursor()
		count := 0
		// Start from last
		for k, v := c.Last(); k != nil; k, v = c.Prev() {
			if limit > 0 && count >= limit {
				break
			}
			if err := callback(k, v); err != nil {
				return err
			}
			count++
		}
		return nil
	})
}

// LoadAll generic iterator
func (s *Storage) LoadAll(bucketName string, callback func(k, v []byte) error) error {
	return s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return nil
		}
		return b.ForEach(callback)
	})
}

// LoadRange generic iterator for key range
func (s *Storage) LoadRange(bucketName string, minKey, maxKey string, callback func(k, v []byte) error) error {
	return s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return nil
		}
		c := b.Cursor()
		count := 0
		// startT := time.Now()
		for k, v := c.Seek([]byte(minKey)); k != nil && string(k) <= maxKey; k, v = c.Next() {
			if err := callback(k, v); err != nil {
				return err
			}
			count++
		}
		// if count > 1000 {
		// 	fmt.Printf("[LoadRange] Scanned %d records in %s\n", count, time.Since(startT))
		// }
		return nil
	})
}

func (s *Storage) SaveValue(val model.Value) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(BucketValues))

		data, err := json.Marshal(val)
		if err != nil {
			return err
		}

		// Key: PointID (Last Value)
		return b.Put([]byte(val.PointID), data)
	})
}

func (s *Storage) GetLastValue(pointID string) (*model.Value, error) {
	var val model.Value
	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(BucketValues))
		data := b.Get([]byte(pointID))
		if data == nil {
			return fmt.Errorf("not found")
		}
		return json.Unmarshal(data, &val)
	})
	return &val, err
}

func (s *Storage) GetAllValues() (map[string]model.Value, error) {
	result := make(map[string]model.Value)
	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(BucketValues))
		return b.ForEach(func(k, v []byte) error {
			var val model.Value
			if err := json.Unmarshal(v, &val); err == nil {
				result[string(k)] = val
			}
			return nil
		})
	})
	return result, err
}
