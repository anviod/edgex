package core

import "testing"

func TestEvaluateChannelStatus(t *testing.T) {
	cases := []struct {
		name         string
		linkUp       bool
		online       int
		offline      int
		total        int
		qualityScore int
		want         string
	}{
		{"disabled channel handled separately", true, 0, 0, 0, 0, "Good"},
		{"link down", false, 5, 0, 5, 95, "Offline"},
		{"all devices offline", true, 0, 10, 10, 95, "Offline"},
		{"single device offline link up", true, 9, 1, 10, 95, "Excellent"},
		{"single device offline low score not channel offline", true, 9, 1, 10, 40, "Degraded"},
		{"no metrics most online", true, 9, 1, 10, 0, "Good"},
		{"half devices online no metrics", true, 1, 1, 2, 0, "Degraded"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := evaluateChannelStatus(tc.linkUp, tc.online, tc.offline, tc.total, tc.qualityScore)
			if got != tc.want {
				t.Fatalf("evaluateChannelStatus() = %q, want %q", got, tc.want)
			}
		})
	}
}
