package tsm

import (
	"context"
	"testing"
	"time"
)

func TestTSM(t *testing.T) {
	size := 3
	tsm := New(size)
	ctx := context.Background()
	var err error
	for i := 0; i < size-1; i++ {
		_, err = tsm.ID(ctx)
		if err != nil {
			t.Fatal(err)
		}
	}

	id, err := tsm.ID(ctx)
	if err != nil {
		t.Fatal(err)
	}

	// The buffer should be full at this point.
	ctx, cancel := context.WithTimeout(ctx, time.Millisecond)
	defer cancel()
	_, err = tsm.ID(ctx)
	if err == nil {
		t.Fatal("Buffer was full but an id was given ")
	}

	// Free an ID
	err = tsm.Put(id)
	if err != nil {
		t.Fatal(err)
	}

	// Now we should be able to get a new id since we free id
	_, err = tsm.ID(context.Background())
	if err != nil {
		t.Fatal(err)
	}

}

func TestDataTransaction(t *testing.T) {
	size := 2
	tsm := New(size)
	ids := make([]int, size)
	var err error

	for i := 0; i < size; i++ {
		ids[i], err = tsm.ID(context.Background())
		if err != nil {
			t.Fatal(err)
		}
	}

	go func() {
		err = tsm.Send(ids[0], "Hello First ID")
		if err != nil {
			t.Error(err)
		}
	}()

	go func() {
		err = tsm.Send(ids[1], "Hello Second ID")
		if err != nil {
			t.Error(err)
		}
	}()

	go func() {
		b, err := tsm.Receive(ids[0], time.Duration(5)*time.Second)
		if err != nil {
			t.Error(err)
		}
		s, ok := b.(string)
		if !ok {
			t.Errorf("type was not preseved")
			return
		}
		t.Log(s)
	}()

	b, err := tsm.Receive(ids[1], time.Duration(5)*time.Second)
	if err != nil {
		t.Error(err)
	}

	s, ok := b.(string)
	if !ok {
		t.Errorf("type was not preseved")
		return
	}
	t.Log(s)
}
