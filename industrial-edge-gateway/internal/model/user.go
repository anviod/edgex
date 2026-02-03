package model

// UserConfig represents a user configuration
type UserConfig struct {
	Username string `json:"username" yaml:"username"`
	Password string `json:"password" yaml:"password"` // Plain text (or hashed, but simple for now)
	Role     string `json:"role" yaml:"role"`
}
