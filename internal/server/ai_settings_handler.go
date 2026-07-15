package server

import (
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
	APIKeySet   bool `json:"api_key_set"`
	PasswordSet bool `json:"password_set"`
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
	return mergeAiSettingsDefaults(out)
}

func validateAiSettings(s model.AICopilotSettings) error {
	switch s.DeploymentMode {
	case "local", "remote", "cloud", "":
	default:
		return fmt.Errorf("deployment_mode 无效，可选 local / remote / cloud")
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
