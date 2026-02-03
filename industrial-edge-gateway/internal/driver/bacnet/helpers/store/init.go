package store

import (
	"sync"
	"time"
)

type Handler struct {
	data  map[string]interface{}
	mutex sync.RWMutex
}

// Init init store
func Init() *Handler {
	return &Handler{
		data: make(map[string]interface{}),
	}
}

// Get an item from the store. Returns the item or nil, and a bool indicating
// whether the key was found.
func (l *Handler) Get(key string) (interface{}, bool) {
	l.mutex.RLock()
	defer l.mutex.RUnlock()
	value, found := l.data[key]
	return value, found
}

// Set an item to the store, replacing any existing item.
// Duration d is currently ignored in this simple implementation.
func (l *Handler) Set(key string, value interface{}, d time.Duration) {
	l.mutex.Lock()
	defer l.mutex.Unlock()
	l.data[key] = value
}
