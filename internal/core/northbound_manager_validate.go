package core

import (
	"fmt"
	"strings"
)

// validateNorthboundChannelName checks that name is non-empty and unique across all
// northbound protocols. excludeID is the channel being updated (empty when creating).
// Caller must hold nm.mu.
func (nm *NorthboundManager) validateNorthboundChannelName(excludeID, name string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return fmt.Errorf("通道名称不能为空")
	}
	for _, c := range nm.config.MQTT {
		if c.ID != excludeID && strings.EqualFold(strings.TrimSpace(c.Name), name) {
			return fmt.Errorf("通道名称「%s」已存在", name)
		}
	}
	for _, c := range nm.config.HTTP {
		if c.ID != excludeID && strings.EqualFold(strings.TrimSpace(c.Name), name) {
			return fmt.Errorf("通道名称「%s」已存在", name)
		}
	}
	for _, c := range nm.config.OPCUA {
		if c.ID != excludeID && strings.EqualFold(strings.TrimSpace(c.Name), name) {
			return fmt.Errorf("通道名称「%s」已存在", name)
		}
	}
	for _, c := range nm.config.SparkplugB {
		if c.ID != excludeID && strings.EqualFold(strings.TrimSpace(c.Name), name) {
			return fmt.Errorf("通道名称「%s」已存在", name)
		}
	}
	for _, c := range nm.config.EdgeOSMQTT {
		if c.ID != excludeID && strings.EqualFold(strings.TrimSpace(c.Name), name) {
			return fmt.Errorf("通道名称「%s」已存在", name)
		}
	}
	for _, c := range nm.config.EdgeOSNATS {
		if c.ID != excludeID && strings.EqualFold(strings.TrimSpace(c.Name), name) {
			return fmt.Errorf("通道名称「%s」已存在", name)
		}
	}
	return nil
}
