package server

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) getEdgeEvents(c *fiber.Ctx) error {
	if s.ecm == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Edge Compute manager not initialized"})
	}
	ruleID := c.Query("rule_id")
	limit := 100
	if raw := c.Query("limit"); raw != "" {
		if n, err := strconv.Atoi(raw); err == nil && n > 0 {
			limit = n
		}
	}
	return c.JSON(s.ecm.GetEvents(ruleID, limit))
}

func (s *Server) getEdgeFailures(c *fiber.Ctx) error {
	if s.ecm == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Edge Compute manager not initialized"})
	}
	ruleID := c.Query("rule_id")
	limit := 100
	if raw := c.Query("limit"); raw != "" {
		if n, err := strconv.Atoi(raw); err == nil && n > 0 {
			limit = n
		}
	}
	return c.JSON(s.ecm.GetFailures(ruleID, limit))
}
