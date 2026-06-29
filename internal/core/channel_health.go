package core

// evaluateChannelStatus derives channel health label from link state, device
// online ratio, and quality score. See docs/南向采集通道决策方案.md.
func evaluateChannelStatus(linkUp bool, online, offline, total int, qualityScore int) string {
	if !linkUp {
		return "Offline"
	}

	if total == 0 {
		if qualityScore >= 90 {
			return "Excellent"
		}
		return "Good"
	}

	onlineRatio := float64(online) / float64(total) * 100
	if onlineRatio == 0 {
		return "Offline"
	}

	if qualityScore == 0 && onlineRatio >= 90 {
		return "Good"
	}

	status := scoreToChannelStatus(qualityScore)

	// Link is up and at least one device is online: channel stays usable even
	// when quality score is zero (no metrics) or reflects device-level faults.
	if status == "Offline" {
		return "Degraded"
	}

	return status
}

func scoreToChannelStatus(qualityScore int) string {
	switch {
	case qualityScore >= 90:
		return "Excellent"
	case qualityScore >= 75:
		return "Good"
	case qualityScore >= 50:
		return "Degraded"
	default:
		return "Offline"
	}
}
