package server

import (
	"github.com/gofiber/fiber/v2"
)

// ============================================================
//  Cluster API — 集群快照查询 (基于 bbolt 持久化)
//  路由:
//    GET  /api/cluster/summary       → 集群聚合统计
//    GET  /api/cluster/nodes         → 所有节点元数据
//    GET  /api/cluster/nodes/:id     → 指定节点完整快照
//    GET  /api/cluster/devices       → 已知设备列表（去重）
//    GET  /api/cluster/devices/:id   → 按设备ID跨节点快照
// ============================================================

// getClusterSummary GET /api/cluster/summary
func (s *Server) getClusterSummary(c *fiber.Ctx) error {
	if s.syncManager == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"error": "sync manager not initialized",
		})
	}

	summary, err := s.syncManager.GetClusterSummary()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"summary": summary,
	})
}

// getClusterNodes GET /api/cluster/nodes
func (s *Server) getClusterNodes(c *fiber.Ctx) error {
	if s.syncManager == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"error": "sync manager not initialized",
		})
	}

	nodes, err := s.syncManager.GetAllClusterNodes()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"nodes": nodes,
		"count": len(nodes),
	})
}

// getClusterNode GET /api/cluster/nodes/:id
func (s *Server) getClusterNode(c *fiber.Ctx) error {
	if s.syncManager == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"error": "sync manager not initialized",
		})
	}

	nodeID := c.Params("id")

	// 尝试获取快照 (内存 + bbolt)
	snapshot, ok := s.syncManager.GetSnapshot(nodeID)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   "node snapshot not found",
			"node_id": nodeID,
		})
	}

	return c.JSON(fiber.Map{
		"node_id":  nodeID,
		"snapshot": snapshot,
	})
}

// getClusterDevices GET /api/cluster/devices
func (s *Server) getClusterDevices(c *fiber.Ctx) error {
	if s.syncManager == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"error": "sync manager not initialized",
		})
	}

	devices, err := s.syncManager.GetClusterDevices()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"devices": devices,
		"count":   len(devices),
	})
}

// getClusterDevice GET /api/cluster/devices/:id
func (s *Server) getClusterDevice(c *fiber.Ctx) error {
	if s.syncManager == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"error": "sync manager not initialized",
		})
	}

	deviceID := c.Params("id")

	ds, err := s.syncManager.GetDeviceClusterSnapshot(deviceID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"device_id": deviceID,
		"nodes":     ds.Nodes,
		"count":     len(ds.Nodes),
	})
}
