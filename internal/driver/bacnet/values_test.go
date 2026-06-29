package bacnet

import (
	"testing"

	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/driver/bacnet/btypes/null"
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
