package server

import (
	"encoding/json"

	"industrial-edge-gateway/internal/model"
	"sort"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

// EdgeLogQuery represents query parameters
type EdgeLogQuery struct {
	RuleID    string `query:"rule_id"`
	StartDate string `query:"start_date"` // Format: YYYY-MM-DD HH:mm
	EndDate   string `query:"end_date"`   // Format: YYYY-MM-DD HH:mm
}

func (s *Server) handleGetEdgeLogs(c *fiber.Ctx) error {
	var query EdgeLogQuery
	if err := c.QueryParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid query parameters"})
	}

	var logs []model.RuleMinuteSnapshot

	// Parse dates if provided
	var start, end time.Time
	var err error
	if query.StartDate != "" {
		start, err = time.Parse("2006-01-02 15:04", query.StartDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_date format. Use YYYY-MM-DD HH:mm"})
		}
	}
	if query.EndDate != "" {
		end, err = time.Parse("2006-01-02 15:04", query.EndDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_date format. Use YYYY-MM-DD HH:mm"})
		}
	}

	err = s.storage.LoadAll("bblot", func(k, v []byte) error {
		// Key format: ruleID_YYYY-MM-DD HH:mm
		keyStr := string(k)
		
		// Filter by RuleID if provided
		if query.RuleID != "" {
			if !strings.HasPrefix(keyStr, query.RuleID+"_") {
				return nil
			}
		}

		// Extract date part from key
		// Assuming ruleID might contain underscores, we should look for the date pattern at the end
		// Date format is fixed length: 16 chars (YYYY-MM-DD HH:mm)
		if len(keyStr) < 16 {
			return nil
		}
		dateStr := keyStr[len(keyStr)-16:]
		
		// Filter by Date Range if provided
		if query.StartDate != "" || query.EndDate != "" {
			logTime, err := time.Parse("2006-01-02 15:04", dateStr)
			if err != nil {
				return nil // Skip malformed keys
			}

			if query.StartDate != "" && logTime.Before(start) {
				return nil
			}
			if query.EndDate != "" && logTime.After(end) {
				return nil
			}
		}

		var snapshot model.RuleMinuteSnapshot
		if err := json.Unmarshal(v, &snapshot); err != nil {
			return nil // Skip malformed data
		}
		logs = append(logs, snapshot)
		return nil
	})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to load logs"})
	}

	// Sort logs by time (descending)
	sort.Slice(logs, func(i, j int) bool {
		return logs[i].UpdatedAt.After(logs[j].UpdatedAt)
	})

	// Limit results to prevent overload (e.g., 1000 records)
	if len(logs) > 1000 {
		logs = logs[:1000]
	}

	return c.JSON(logs)
}
