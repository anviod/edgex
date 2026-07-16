package model

import "time"

// Build-time metadata injected by goreleaser.
var (
	Version   = "dev"
	BuildTime = "unknown"
	CommitID  = "unknown"
)

func FormatBuildTime() string {
	if BuildTime == "unknown" {
		return BuildTime
	}
	t, err := time.Parse(time.RFC3339, BuildTime)
	if err != nil {
		return BuildTime
	}
	return t.Local().Format("200601021504")
}
