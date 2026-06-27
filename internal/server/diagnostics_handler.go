package server

import (
	"github.com/anviod/edgex/internal/model"
	"github.com/gofiber/fiber/v2"
)

// getScanEngineDiagnostics 返回 ScanEngine 调度指标。
func (s *Server) getScanEngineDiagnostics(c *fiber.Ctx) error {
	if s.cm == nil {
		return c.JSON(fiber.Map{})
	}
	return c.JSON(s.cm.GetScanEngineMetricsSnapshot())
}

// getDeviceDiagnostics 返回单设备通信画像与点位降级状态。
func (s *Server) getDeviceDiagnostics(c *fiber.Ctx) error {
	deviceID := c.Params("deviceId")
	if deviceID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "device id is required"})
	}
	if s.cm == nil {
		return c.Status(503).JSON(fiber.Map{"error": "channel manager unavailable"})
	}
	return c.JSON(s.cm.GetDeviceDiagnostics(deviceID))
}

// getChannelEventLog 返回通道最近事件（对标 Kepware Event Log）。
func (s *Server) getChannelEventLog(c *fiber.Ctx) error {
	channelID := c.Params("channelId")
	if channelID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "channel id is required"})
	}
	if s.cm == nil {
		return c.Status(503).JSON(fiber.Map{"error": "channel manager unavailable"})
	}
	if s.cm.GetChannel(channelID) == nil {
		return c.Status(404).JSON(fiber.Map{"error": "channel not found"})
	}

	events := []model.ErrorRecord{}
	if mc := model.GetGlobalMetricsCollector(); mc != nil {
		if metrics := mc.GetChannelMetrics(channelID); metrics != nil {
			events = metrics.RecentErrors
		}
	}
	return c.JSON(fiber.Map{
		"channel_id": channelID,
		"events":     events,
	})
}
