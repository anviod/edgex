package model

// ServerConfig represents server configuration
type ServerConfig struct {
	Port     int    `json:"port" yaml:"port"`
	LogLevel string `json:"logLevel" yaml:"logLevel"`
}

// UserConfig represents a user configuration
type UserConfig struct {
	Username string `json:"username" yaml:"username"`
	Password string `json:"password" yaml:"password"` // Plain text (or hashed, but simple for now)
	Role     string `json:"role" yaml:"role"`
}
