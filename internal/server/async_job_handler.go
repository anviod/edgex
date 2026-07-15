package server

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func wantSyncScan(c *fiber.Ctx) bool {
	return c.Query("sync") == "1" || c.Query("sync") == "true" ||
		c.Get("X-Sync-Scan") == "1" || c.Get("X-Sync-Scan") == "true"
}

func (s *Server) scanChannel(c *fiber.Ctx) error {
	id := c.Params("channelId")
	zap.L().Info("Received Scan request for channel", zap.String("channel_id", id))

	var params map[string]any
	if len(c.Body()) > 0 {
		if err := c.BodyParser(&params); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON body"})
		}
	}

	if wantSyncScan(c) {
		ctx, cancel := context.WithTimeout(c.UserContext(), 45*time.Second)
		defer cancel()
		result, err := s.cm.ScanChannel(ctx, id, params)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"message": err.Error()})
		}
		return c.JSON(result)
	}

	job, err := s.cm.StartScanChannelJob(id, params)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusAccepted).JSON(job)
}

// scanDevice starts device object/point discovery as an async job by default.
func (s *Server) scanDevice(c *fiber.Ctx) error {
	channelId := c.Params("channelId")
	deviceId := c.Params("deviceId")

	var params map[string]any
	if err := c.BodyParser(&params); err != nil {
		params = make(map[string]any)
	}

	if wantSyncScan(c) {
		ctx, cancel := context.WithTimeout(c.UserContext(), 180*time.Second)
		defer cancel()
		result, err := s.cm.ScanDevice(ctx, channelId, deviceId, params)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"message": err.Error()})
		}
		return c.JSON(result)
	}

	job, err := s.cm.StartScanDeviceJob(channelId, deviceId, params)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusAccepted).JSON(job)
}

func (s *Server) getAsyncJob(c *fiber.Ctx) error {
	id := c.Params("jobId")
	jobs := s.cm.Jobs()
	if jobs == nil {
		return c.Status(503).JSON(fiber.Map{"error": "job manager not available"})
	}
	job, ok := jobs.Get(id)
	if !ok {
		return c.Status(404).JSON(fiber.Map{"error": "job not found"})
	}
	return c.JSON(job)
}

func (s *Server) cancelAsyncJob(c *fiber.Ctx) error {
	id := c.Params("jobId")
	jobs := s.cm.Jobs()
	if jobs == nil {
		return c.Status(503).JSON(fiber.Map{"error": "job manager not available"})
	}
	if err := jobs.Cancel(id); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	job, _ := jobs.Get(id)
	return c.JSON(job)
}
