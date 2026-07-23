package server

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"

	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/storage"
	"github.com/gofiber/fiber/v2"
)

func (s *Server) getConfigStore() (*storage.ConfigStore, error) {
	if s.storage == nil {
		return nil, fiber.NewError(fiber.StatusServiceUnavailable, "storage not available")
	}
	return storage.NewConfigStore(s.storage.GetConfigDB())
}

func (s *Server) loadAiCopilotSettings() model.AICopilotSettings {
	if s.aiSettingsMem != nil {
		return mergeAiSettingsDefaults(*s.aiSettingsMem)
	}
	settings := model.DefaultAICopilotSettings()
	cs, err := s.getConfigStore()
	if err != nil {
		return settings
	}
	saved, err := cs.LoadAICopilotSettings()
	if err != nil || saved == nil {
		return settings
	}
	return mergeAiSettingsDefaults(*saved)
}

func mergeAiSettingsDefaults(in model.AICopilotSettings) model.AICopilotSettings {
	def := model.DefaultAICopilotSettings()
	if in.DeploymentMode == "" {
		in.DeploymentMode = def.DeploymentMode
	}
	if in.Provider == "" {
		in.Provider = def.Provider
	}
	if in.GrpcEndpoint == "" {
		in.GrpcEndpoint = def.GrpcEndpoint
	}
	if in.AuthType == "" {
		in.AuthType = def.AuthType
	}
	if in.APIKeyHeader == "" {
		in.APIKeyHeader = def.APIKeyHeader
	}
	if in.AzureAPIVersion == "" {
		in.AzureAPIVersion = def.AzureAPIVersion
	}
	if in.TokensLimit <= 0 {
		in.TokensLimit = def.TokensLimit
	}
	if in.TasksLimit <= 0 {
		in.TasksLimit = def.TasksLimit
	}
	return in
}

func (s *Server) saveAiCopilotSettings(settings model.AICopilotSettings) error {
	cs, err := s.getConfigStore()
	if err != nil {
		cp := settings
		s.aiSettingsMem = &cp
		return nil
	}
	return cs.SaveAICopilotSettings(settings)
}

func (s *Server) applyAiCopilotSettings(settings model.AICopilotSettings) {
	agent := s.ensureAiAgent()
	agent.ApplySettings(settings)
}

func (s *Server) getAiSettings(c *fiber.Ctx) error {
	settings := s.loadAiCopilotSettings()
	return c.JSON(fiber.Map{
		"code":    "0",
		"message": "success",
		"data":    settings.ToPublic(),
	})
}

type aiSettingsUpdateRequest struct {
	model.AICopilotSettings
	APIKeySet    bool `json:"api_key_set"`
	PasswordSet  bool `json:"password_set"`
	McpApiKeySet bool `json:"mcp_api_key_set"`
}

func (s *Server) putAiSettings(c *fiber.Ctx) error {
	var req aiSettingsUpdateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code": "1", "message": "请求格式无效", "data": nil,
		})
	}

	if err := validateAiSettings(req.AICopilotSettings); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code": "1", "message": err.Error(), "data": nil,
		})
	}

	current := s.loadAiCopilotSettings()
	merged := mergeAiSettingsUpdate(current, req)

	if err := s.saveAiCopilotSettings(merged); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code": "1", "message": "保存配置失败", "data": nil,
		})
	}

	s.applyAiCopilotSettings(merged)

	return c.JSON(fiber.Map{
		"code":    "0",
		"message": "success",
		"data":    merged.ToPublic(),
	})
}

func mergeAiSettingsUpdate(current model.AICopilotSettings, req aiSettingsUpdateRequest) model.AICopilotSettings {
	out := req.AICopilotSettings
	if strings.TrimSpace(out.APIKey) == "" && req.APIKeySet {
		out.APIKey = current.APIKey
	}
	if strings.TrimSpace(out.Password) == "" && req.PasswordSet {
		out.Password = current.Password
	}
	if strings.TrimSpace(out.McpApiKey) == "" && req.McpApiKeySet {
		out.McpApiKey = current.McpApiKey
	}
	return mergeAiSettingsDefaults(out)
}

func validateAiSettings(s model.AICopilotSettings) error {
	switch s.DeploymentMode {
	case "remote", "cloud", "":
	default:
		return fmt.Errorf("deployment_mode 无效，可选 remote / cloud")
	}
	if s.DeploymentMode == "cloud" && !s.EnableCloud {
		return fmt.Errorf("云端模式需显式启用 enable_cloud")
	}
	switch s.AuthType {
	case "", "none", "bearer", "api_key", "basic", "azure_key", "custom_header":
	default:
		return fmt.Errorf("auth_type 无效")
	}
	if s.DeploymentMode == "remote" && strings.TrimSpace(s.GrpcEndpoint) == "" {
		return fmt.Errorf("remote 模式需填写 AI Model Center gRPC 端点")
	}
	if s.DeploymentMode == "cloud" && strings.TrimSpace(s.BaseURL) == "" {
		return fmt.Errorf("cloud 模式需填写 API Base URL")
	}
	return nil
}

// ── MCP 激活管理 ──

// handleMcpActivate 处理 MCP 全功能激活（用户确认后开启全功能读写）
func (s *Server) handleMcpActivate(c *fiber.Ctx) error {
	var req struct {
		FullAccess bool   `json:"full_access"`
		ApiKey     string `json:"api_key"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code": "1", "message": "请求格式无效", "data": nil,
		})
	}

	settings := s.loadAiCopilotSettings()

	// 如果提供了新的 API Key 则更新
	if strings.TrimSpace(req.ApiKey) != "" && len(req.ApiKey) >= 8 {
		settings.McpApiKey = req.ApiKey
	}

	settings.McpFullAccess = req.FullAccess
	settings.McpEnabled = true

	if err := s.saveAiCopilotSettings(settings); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code": "1", "message": "保存 MCP 配置失败", "data": nil,
		})
	}

	return c.JSON(fiber.Map{
		"code":    "0",
		"message": "success",
		"data": fiber.Map{
			"mcp_enabled":     settings.McpEnabled,
			"mcp_full_access": settings.McpFullAccess,
			"mcp_api_key_set": settings.McpApiKey != "",
		},
	})
}

// handleMcpGenerateKey 生成随机 MCP API Key（64 字符十六进制 / 256 位熵）
func (s *Server) handleMcpGenerateKey(c *fiber.Ctx) error {
	// 32 随机字节 → 64 字符十六进制（256 位安全强度）
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"code": "1", "message": "密钥生成失败", "data": nil,
		})
	}
	apiKey := hex.EncodeToString(b)
	return c.JSON(fiber.Map{
		"code":    "0",
		"message": "success",
		"data": fiber.Map{
			"api_key": apiKey,
		},
	})
}

// handleMcpStatus 返回 MCP 当前激活状态
func (s *Server) handleMcpStatus(c *fiber.Ctx) error {
	settings := s.loadAiCopilotSettings()
	return c.JSON(fiber.Map{
		"code":    "0",
		"message": "success",
		"data": fiber.Map{
			"mcp_enabled":     settings.McpEnabled,
			"mcp_full_access": settings.McpFullAccess,
			"mcp_api_key_set": settings.McpApiKey != "",
		},
	})
}
