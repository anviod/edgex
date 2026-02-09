package model

// TimeConfig represents system time settings
type TimeConfig struct {
	Mode   string     `json:"mode"` // manual, ntp
	Manual ManualTime `json:"manual"`
	NTP    NTPConfig  `json:"ntp"`
}

type ManualTime struct {
	Datetime string `json:"datetime"` // YYYY-MM-DD HH:MM:SS
	Timezone string `json:"timezone"`
	SyncRTC  bool   `json:"sync_rtc"`
}

type NTPConfig struct {
	Servers  []string `json:"servers"`
	Interval int      `json:"interval"` // Hours
	Enabled  bool     `json:"enabled"`
}

// IPConfig represents an IP address configuration
type IPConfig struct {
	Address string `json:"address"` // IP address
	Prefix  int    `json:"prefix"`  // Prefix length (e.g., 24 for IPv4, 64 for IPv6)
	Version string `json:"version"` // IPv4, IPv6
	Source  string `json:"source"`  // DHCP, Static
	Enabled bool   `json:"enabled"`
}

// GatewayConfig represents a gateway configuration
type GatewayConfig struct {
	Gateway   string `json:"gateway"`
	Metric    int    `json:"metric"`
	Interface string `json:"interface"`
	Scope     string `json:"scope"` // Default, Specific
	Enabled   bool   `json:"enabled"`
}

// NetworkInterface represents a physical or virtual network interface
type NetworkInterface struct {
	Name            string          `json:"name"`
	MAC             string          `json:"mac"`
	Status          string          `json:"status"` // UP, DOWN
	InterfaceMetric int             `json:"interface_metric"`
	IPConfigs       []IPConfig      `json:"ip_configs"`
	Gateways        []GatewayConfig `json:"gateways"`
	Enabled         bool            `json:"enabled"`
}

// StaticRoute represents a static routing rule
type StaticRoute struct {
	Destination string `json:"destination"`
	Prefix      int    `json:"prefix"`
	Gateway     string `json:"gateway"`
	Interface   string `json:"interface"`
	Metric      int    `json:"metric"`
	Enabled     bool   `json:"enabled"`
}

// HAConfig represents High Availability settings
type HAConfig struct {
	Role          string `json:"role"`           // master, backup
	HeartbeatType string `json:"heartbeat_type"` // TCP, UDP, HTTP
	Interval      int    `json:"interval"`       // Seconds
	Timeout       int    `json:"timeout"`        // Seconds
	Retries       int    `json:"retries"`
}

// HostnameConfig represents system hostname and access settings
type HostnameConfig struct {
	Name       string   `json:"name"`
	EnableMDNS bool     `json:"enable_mdns"`
	EnableBare bool     `json:"enable_bare"` // Bare hostname access
	HTTPPort   int      `json:"http_port"`
	HTTPSPort  int      `json:"https_port"`
	Interfaces []string `json:"interfaces"` // e.g. ["eth0", "wlan0"]
}

// SystemConfig aggregates all system settings
type SystemConfig struct {
	Time                TimeConfig           `json:"time"`
	Network             []NetworkInterface   `json:"network"`
	Routes              []StaticRoute        `json:"routes"`
	HA                  HAConfig             `json:"ha"`
	Hostname            HostnameConfig       `json:"hostname"`
	LDAP                LDAPConfig           `json:"ldap"`
	ConnectivityTargets []ConnectivityTarget `json:"connectivity_targets,omitempty"`
}

// LDAPConfig represents LDAP authentication settings
type LDAPConfig struct {
	Enabled      bool   `json:"enabled"`
	Server       string `json:"server"`        // e.g., ldap.example.com
	Port         int    `json:"port"`          // e.g., 389 or 636
	BaseDN       string `json:"base_dn"`       // e.g., dc=example,dc=com
	BindDN       string `json:"bind_dn"`       // e.g., cn=admin,dc=example,dc=com (optional for anonymous bind)
	BindPassword string `json:"bind_password"` // (optional)
	UserFilter   string `json:"user_filter"`   // e.g., (uid=%s) or (sAMAccountName=%s)
	Attributes   string `json:"attributes"`    // e.g., "uid,cn,mail"
	UseSSL       bool   `json:"use_ssl"`       // LDAPS
	SkipVerify   bool   `json:"skip_verify"`   // Skip SSL verification
}

// ConnectivityTarget represents a target to verify network connectivity
type ConnectivityTarget struct {
	Type    string `json:"type"` // gateway, ip, domain, http
	Target  string `json:"target"`
	Timeout int    `json:"timeout"` // Seconds
}

// ConnectivityResult represents the result of a connectivity check
type ConnectivityResult struct {
	Target  string `json:"target"`
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// ConnectivityReport aggregates results of connectivity checks
type ConnectivityReport struct {
	Success bool                 `json:"success"`
	Details []ConnectivityResult `json:"details"`
}
