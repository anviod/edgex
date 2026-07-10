package model

// AICopilotSettings is persisted in config.db → ai_copilot bucket (key: settings).
type AICopilotSettings struct {
	DeploymentMode string `json:"deployment_mode"` // local | remote | cloud
	Provider       string `json:"provider"`        // edgex-local | edgex-center | openai | anthropic | azure-openai | deepseek | qwen | ernie | zhipu | moonshot | custom

	// AI Model Center (Mode A/B — remote)
	GrpcEndpoint string `json:"grpc_endpoint"`

	// Direct LLM API (Mode C — cloud or custom provider)
	BaseURL         string            `json:"base_url"`
	AuthType        string            `json:"auth_type"` // none | bearer | api_key | basic | azure_key | custom_header
	APIKey          string            `json:"api_key,omitempty"`
	APIKeyHeader    string            `json:"api_key_header"`
	Username        string            `json:"username,omitempty"`
	Password        string            `json:"password,omitempty"`
	AzureAPIVersion string            `json:"azure_api_version"`
	CustomHeaders   map[string]string `json:"custom_headers,omitempty"`

	Model       string `json:"model"`
	EnableCloud bool   `json:"enable_cloud"`
	TokensLimit int    `json:"tokens_limit"`
	TasksLimit  int    `json:"tasks_limit"`
}

// AICopilotSettingsPublic masks secrets for GET /api/ai/settings.
type AICopilotSettingsPublic struct {
	AICopilotSettings
	APIKeySet   bool   `json:"api_key_set"`
	PasswordSet bool   `json:"password_set"`
	APIKey      string `json:"api_key,omitempty"`
	Password    string `json:"password,omitempty"`
}

func DefaultAICopilotSettings() AICopilotSettings {
	return AICopilotSettings{
		DeploymentMode:  "local",
		Provider:        "edgex-local",
		GrpcEndpoint:    "127.0.0.1:50051",
		BaseURL:         "",
		AuthType:        "bearer",
		APIKeyHeader:    "X-API-Key",
		AzureAPIVersion: "2024-02-15-preview",
		Model:           "",
		EnableCloud:     false,
		TokensLimit:     50000,
		TasksLimit:      100,
	}
}

// RuntimeMode maps deployment_mode to the runtime mode used by Agent / Quota UI.
func (s AICopilotSettings) RuntimeMode() string {
	switch s.DeploymentMode {
	case "remote", "cloud":
		return "remote"
	default:
		return "local"
	}
}

// ProviderLabel returns a human-readable provider name for status UI.
func (s AICopilotSettings) ProviderLabel() string {
	labels := map[string]string{
		"edgex-local":  "本地 Mock",
		"edgex-center": "AI Model Center",
		"openai":       "OpenAI",
		"anthropic":    "Anthropic",
		"azure-openai": "Azure OpenAI",
		"deepseek":     "DeepSeek",
		"qwen":         "通义千问",
		"ernie":        "文心一言",
		"zhipu":        "智谱 AI",
		"moonshot":     "Moonshot",
		"custom":       "自定义",
	}
	if label, ok := labels[s.Provider]; ok {
		return label
	}
	if s.Provider != "" {
		return s.Provider
	}
	if s.RuntimeMode() == "remote" {
		return "AI Model Center"
	}
	return "本地 Mock"
}

func (s AICopilotSettings) ToPublic() AICopilotSettingsPublic {
	pub := AICopilotSettingsPublic{AICopilotSettings: s}
	if s.APIKey != "" {
		pub.APIKeySet = true
		pub.APIKey = ""
	}
	if s.Password != "" {
		pub.PasswordSet = true
		pub.Password = ""
	}
	return pub
}
