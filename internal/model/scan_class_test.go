package model

import (
	"testing"
	"time"
)

func TestScanClassInterval(t *testing.T) {
	if got := ScanClassInterval(ScanClassFast, 0); got != 100*time.Millisecond {
		t.Fatalf("fast: got %v", got)
	}
	if got := ScanClassInterval(ScanClassSlow, 0); got != 10*time.Second {
		t.Fatalf("slow: got %v", got)
	}
	if got := ScanClassInterval(ScanClassNormal, Duration(2*time.Second)); got != 2*time.Second {
		t.Fatalf("normal device interval: got %v", got)
	}
}

func TestGroupPointsByScanClass(t *testing.T) {
	points := []Point{
		{ID: "p1", ScanClass: "fast"},
		{ID: "p2"},
		{ID: "p3", ScanClass: "slow"},
	}
	groups := GroupPointsByScanClass(points)
	if len(groups["fast"]) != 1 || len(groups["normal"]) != 1 || len(groups["slow"]) != 1 {
		t.Fatalf("unexpected groups: %v", groups)
	}
}
