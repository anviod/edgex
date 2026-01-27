package server

import (
	"industrial-edge-gateway/internal/model"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) getSystemConfig(c *fiber.Ctx) error {
	cfg := s.sm.GetConfig()
	return c.JSON(cfg)
}

func (s *Server) updateSystemConfig(c *fiber.Ctx) error {
	var newConfig model.SystemConfig
	if err := c.BodyParser(&newConfig); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := s.sm.UpdateConfig(newConfig); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "System configuration updated"})
}

func (s *Server) getNetworkInterfaces(c *fiber.Ctx) error {
	interfaces, err := s.sm.GetNetworkInterfaces()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(interfaces)
}

func (s *Server) getRoutes(c *fiber.Ctx) error {
	routes, err := s.sm.GetRoutes()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(routes)
}

func (s *Server) handleRestart(c *fiber.Ctx) error {
	// Execute restart in a separate goroutine to allow the response to return
	go func() {
		time.Sleep(1 * time.Second)
		os.Exit(0)
	}()
	return c.JSON(fiber.Map{"status": "success", "message": "System is restarting..."})
}
