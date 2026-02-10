
// SaveOfflineMessage stores a failed message for a specific Northbound config
// Key format: configID_timestampNano
func (s *Storage) SaveOfflineMessage(configID string, data []byte, maxCount int) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(BucketNorthboundCache))
		if b == nil {
			return fmt.Errorf("bucket %s not found", BucketNorthboundCache)
		}

		// Generate Key: configID_timestampNano
		// Use Nano to reduce collision, suffix with seq if needed?
		// For simplicity, Nano is usually enough for sequential events.
		key := fmt.Sprintf("%s_%d", configID, time.Now().UnixNano())

		if err := b.Put([]byte(key), data); err != nil {
			return err
		}

		// Prune if needed
		// Scan keys with prefix configID
		c := b.Cursor()
		prefix := []byte(configID + "_")
		count := 0
		var keysToDelete [][]byte

		// Iterate to count and collect keys
		for k, _ := c.Seek(prefix); k != nil && string(k[:len(prefix)]) == string(prefix); k, _ = c.Next() {
			count++
		}

		if count > maxCount {
			toDelete := count - maxCount
			// Re-scan from start to delete oldest
			for k, _ := c.Seek(prefix); k != nil && string(k[:len(prefix)]) == string(prefix); k, _ = c.Next() {
				if toDelete <= 0 {
					break
				}
				keysToDelete = append(keysToDelete, k) // Copy key? k is valid only during transaction
				// Safe to delete inside cursor loop in bbolt?
				// "The cursor may be invalidated if the bucket is modified" -> Safer to collect keys first?
				// Actually bbolt docs say: "Delete() ... does not invalidate cursors"
				// But let's be safe and collect keys or just delete directly.
				toDelete--
			}
		}
		
		// Delete outside the scan loop to avoid any cursor issues
		for _, k := range keysToDelete {
			if err := b.Delete(k); err != nil {
				return err
			}
		}
		
		// Optimization: The above logic iterates TWICE.
		// For high throughput, we might want to optimize.
		// But for "Offline" scenario (server down), performance is less critical than reliability.
		// Also "1000" is small.

		return nil
	})
}

// GetOfflineMessages retrieves the oldest messages for a configID
func (s *Storage) GetOfflineMessages(configID string, limit int) ([]OfflineMessage, error) {
	var messages []OfflineMessage
	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(BucketNorthboundCache))
		if b == nil {
			return nil
		}

		c := b.Cursor()
		prefix := []byte(configID + "_")
		
		for k, v := c.Seek(prefix); k != nil && string(k[:len(prefix)]) == string(prefix); k, v = c.Next() {
			if len(messages) >= limit {
				break
			}
			// Copy data because byte slice is only valid inside tx
			dataCopy := make([]byte, len(v))
			copy(dataCopy, v)
			
			messages = append(messages, OfflineMessage{
				Key:  string(k),
				Data: dataCopy,
			})
		}
		return nil
	})
	return messages, err
}

// RemoveOfflineMessage deletes a message by key
func (s *Storage) RemoveOfflineMessage(key string) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(BucketNorthboundCache))
		if b == nil {
			return nil
		}
		return b.Delete([]byte(key))
	})
}
