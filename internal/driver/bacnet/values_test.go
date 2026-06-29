package bacnet

import (
	"testing"

	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/driver/bacnet/btypes/null"
	"github.com/anviod/edgex/internal/model"
)

func TestNormalizePresentValue(t *testing.T) {
	if got := normalizePresentValue(null.Null{}); got != nil {
		t.Fatalf("null.Null should normalize to nil, got %v", got)
	}
	if got := normalizePresentValue(btypes.Enumerated(3)); got != uint32(3) {
		t.Fatalf("Enumerated should normalize to uint32, got %v", got)
	}
	if got := normalizePresentValue(float32(21.5)); got != float32(21.5) {
		t.Fatalf("float32 should pass through, got %v", got)
	}
}

func TestPointsNeedingFreshRead(t *testing.T) {
	cache := map[string]model.Value{
		"p1": {Value: 1.0},
		"p2": {Value: nil},
	}
	need := pointsNeedingFreshRead([]model.Point{
		{ID: "p1"},
		{ID: "p2"},
		{ID: "p3"},
	}, cache)
	if len(need) != 2 {
		t.Fatalf("expected 2 points needing read, got %d", len(need))
	}
	if need[0].ID != "p2" || need[1].ID != "p3" {
		t.Fatalf("unexpected points: %+v", need)
	}
}
