package ethernetip

import (
	"testing"

	"github.com/anviod/edgex/internal/model"

	go_ethernet_ip "github.com/anviod/ethernet-ip"
)

func TestENIPScheduler_processTagValue_NilValue(t *testing.T) {
	s := &ENIPScheduler{}
	results := make(map[string]model.Value)

	s.processTagValue(tagWithPoint{
		tag:  &go_ethernet_ip.Tag{},
		pwt:  pointWithTag{Point: model.Point{ID: "pt-nil"}},
		name: "NilTag",
	}, results)

	val, ok := results["pt-nil"]
	if !ok {
		t.Fatal("expected result entry")
	}
	if val.Quality != "Bad" {
		t.Fatalf("quality = %q, want Bad", val.Quality)
	}
	_, _, failures := s.GetStats()
	if failures != 1 {
		t.Fatalf("failure count = %d, want 1", failures)
	}
}

func TestENIPScheduler_processTagValue_WithValue(t *testing.T) {
	tag := &go_ethernet_ip.Tag{}
	tag.Type = go_ethernet_ip.INT
	tag.SetValue([]byte{0x39, 0x30}) // 12345 little-endian

	s := &ENIPScheduler{}
	results := make(map[string]model.Value)
	s.processTagValue(tagWithPoint{
		tag:  tag,
		pwt:  pointWithTag{Point: model.Point{ID: "pt-int"}},
		name: "Program:Main.IntTag",
	}, results)

	val, ok := results["pt-int"]
	if !ok {
		t.Fatal("expected result entry")
	}
	if val.Quality != "Good" {
		t.Fatalf("quality = %q, want Good", val.Quality)
	}
	if val.Value == nil {
		t.Fatal("expected non-nil value")
	}
	if val.TS.IsZero() {
		t.Fatal("expected timestamp")
	}
	_, successes, _ := s.GetStats()
	if successes != 1 {
		t.Fatalf("success count = %d, want 1", successes)
	}
}
