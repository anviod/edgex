package utsm

import (
	"fmt"
	"testing"
	"time"
)

func sub(t *testing.T, m *Manager, start, end int) {
	b, err := m.Subscribe(start, end)
	if err != nil {
		t.Fatal(err)
	}

	t.Logf("[%d, %d] %v", start, end, b)
}

func publisher(t *testing.T, m *Manager) {
	for i := 0; i < 5; i++ {
		go m.Publish(20, fmt.Sprintf("HI!%d", i))
		time.Sleep(time.Duration(100) * time.Millisecond)
	}
}
func TestUTSM(t *testing.T) {
	opts := []ManagerOption{
		DefaultSubscriberTimeout(time.Duration(2) * time.Second),
		DefaultSubscriberLastReceivedTimeout(time.Duration(300) * time.Millisecond),
	}
	m := NewManager(opts...)

	go publisher(t, m)
	go sub(t, m, 9, 20)
	go sub(t, m, 0, 2)
	sub(t, m, 10, 30)
}
