package utsm

import (
	"context"
	"sync"
	"time"
)

type subscriber struct {
	// Start and End is the range that this object is subscribed to
	start               int
	end                 int
	timeout             time.Duration
	lastReceivedTimeout time.Duration
	lastReceived        time.Time
	// Data channel is used for data transfer between subscriber and publisher
	data  chan interface{}
	mutex *sync.Mutex
}

// SubscriberOption are options passed to a particular subscribe function
type SubscriberOption func(s *subscriber)

// Timeout is the overall timeout for subscribing.
func (s *subscriber) Timeout(d time.Duration) SubscriberOption {
	return func(s *subscriber) {
		s.mutex.Lock()
		defer s.mutex.Unlock()
		s.timeout = d
	}
}

// LastReceivedTimeout is a timeout between the last time we have heard from a
// publisher
func (s *subscriber) LastReceivedTimeout(d time.Duration) SubscriberOption {
	return func(s *subscriber) {
		s.mutex.Lock()
		defer s.mutex.Unlock()
		s.lastReceivedTimeout = d
	}
}

// getTimeout returns the expiration time based on when we last received a message
func (s *subscriber) getTimeout() time.Duration {
	s.mutex.Lock()
	// Deadline is x seconds after the last packet we received.
	timeout := s.lastReceived.Add(s.lastReceivedTimeout).Sub(time.Now())
	s.mutex.Unlock()
	return timeout
}

// Subscribe receives data meant for ids that fall between the start and end range.
func (m *Manager) Subscribe(start int, end int, options ...SubscriberOption) ([]interface{}, error) {
	var store []interface{}
	s := m.newSubscriber(start, end, options)
	defer m.removeSubscriber(s)

	ctx, cancel := context.WithTimeout(context.Background(), s.timeout)
	defer cancel()

	for {
		c, can := context.WithTimeout(ctx, s.getTimeout())
		defer can()

		select {
		case <-c.Done():
			return store, nil
		case b := <-s.data:
			store = append(store, b)
		}
	}
}
