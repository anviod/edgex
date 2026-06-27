package core

import (
	"errors"
	"strings"

	drv "github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
)

func isChannelLinkError(err error) bool {
	if err == nil {
		return false
	}
	if errors.Is(err, ErrConnectionUnavailable) {
		return true
	}
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "connection refused") ||
		strings.Contains(msg, "connection failed") ||
		strings.Contains(msg, "cooldown") ||
		strings.Contains(msg, "connection unavailable") ||
		strings.Contains(msg, "connect:")
}

func isChannelLinkUp(d drv.Driver) bool {
	if d == nil {
		return false
	}
	return d.Health() == drv.HealthStatusGood
}

func resolveEffectiveDeviceState(ch *model.Channel, d drv.Driver, dev *model.Device, rawState int) int {
	if ch != nil && !ch.Enable {
		return int(NodeStateOffline)
	}
	if dev != nil && !dev.Enable {
		return int(NodeStateOffline)
	}
	if !isChannelLinkUp(d) {
		return int(NodeStateOffline)
	}
	return rawState
}

func (cm *ChannelManager) channelIDForDevice(deviceID string) string {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	for id, ch := range cm.channels {
		for _, dev := range ch.Devices {
			if dev.ID == deviceID {
				return id
			}
		}
	}
	return ""
}

func (cm *ChannelManager) markChannelDevicesOffline(channelID string) {
	cm.mu.RLock()
	ch, ok := cm.channels[channelID]
	if !ok {
		cm.mu.RUnlock()
		return
	}
	deviceIDs := make([]string, 0, len(ch.Devices))
	for _, dev := range ch.Devices {
		if dev.Enable {
			deviceIDs = append(deviceIDs, dev.ID)
		}
	}
	cm.mu.RUnlock()

	for _, id := range deviceIDs {
		cm.stateManager.MarkOffline(id)
	}
}

func (cm *ChannelManager) applyDeviceRuntimeState(ch *model.Channel, d drv.Driver, dev *model.Device) {
	rawState := int(NodeStateOnline)
	if node := cm.stateManager.GetNode(dev.ID); node != nil {
		rawState = int(node.Runtime.State)
		dev.NodeRuntime = &model.NodeRuntime{
			FailCount:     node.Runtime.FailCount,
			SuccessCount:  node.Runtime.SuccessCount,
			LastFailTime:  node.Runtime.LastFailTime,
			NextRetryTime: node.Runtime.NextRetryTime,
			State:         rawState,
		}
	}

	effective := resolveEffectiveDeviceState(ch, d, dev, rawState)
	dev.State = effective
	if dev.NodeRuntime != nil {
		dev.NodeRuntime.State = effective
	}
}
