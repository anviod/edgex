package model

type InstallConfig struct {
	Port            int    `json:"port"`
	Username        string `json:"username"`
	Password        string `json:"password"`
	StoragePath     string `json:"storagePath"`
	GatewayName     string `json:"gatewayName"`
	GatewayLocation string `json:"gatewayLocation"`
	DeviceSerial    string `json:"deviceSerial"`
	MigrateFromDB   string `json:"migrateFromDB,omitempty"`
	MigrateConfig   bool   `json:"migrateConfig,omitempty"`
	MigrateRuntime  bool   `json:"migrateRuntime,omitempty"`
}

type InstallStatus struct {
	IsInstalled bool     `json:"isInstalled"`
	CurrentStep int      `json:"currentStep"`
	TotalSteps  int      `json:"totalSteps"`
	Progress    int      `json:"progress"`
	Status      string   `json:"status"`
	LogMessages []string `json:"logMessages"`
}

type InstallResult struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

type PortCheckResult struct {
	Available bool   `json:"available"`
	Port      int    `json:"port"`
	Error     string `json:"error,omitempty"`
}

type PathCheckResult struct {
	Accessible bool   `json:"accessible"`
	Path       string `json:"path"`
	Error      string `json:"error,omitempty"`
}
