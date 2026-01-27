package core

import (
	"fmt"
	"industrial-edge-gateway/internal/config"
	"industrial-edge-gateway/internal/model"
	"industrial-edge-gateway/internal/network"
	"sync"
)

type SystemManager struct {
	confDir    string
	config     *config.Config
	mu         sync.RWMutex
	mdnsServer *network.MDNSServer
	dnsProxy   *network.DNSProxy
	netManager *network.NetworkManager
}

func NewSystemManager(cfg *config.Config, confDir string) *SystemManager {
	// Initialize with defaults if empty
	if cfg.System.Time.Mode == "" {
		cfg.System.Time.Mode = "manual"
		cfg.System.Time.Manual.Timezone = "Asia/Shanghai"
	}
	if cfg.System.Hostname.Name == "" {
		cfg.System.Hostname.Name = "edge-gateway"
	}
	if cfg.System.Hostname.HTTPPort == 0 {
		cfg.System.Hostname.HTTPPort = 8082
	}
	if cfg.System.Hostname.HTTPSPort == 0 {
		cfg.System.Hostname.HTTPSPort = 443
	}

	sm := &SystemManager{
		confDir:    confDir,
		config:     cfg,
		mdnsServer: network.NewMDNSServer(),
		dnsProxy:   network.NewDNSProxy(),
		netManager: network.NewNetworkManager(),
	}

	// Start network services
	go sm.mdnsServer.Start(cfg.System.Hostname)
	go sm.dnsProxy.Start(cfg.System.Hostname)
	go sm.netManager.ApplyConfig(cfg.System.Network, cfg.System.Routes)

	return sm
}

func (sm *SystemManager) GetConfig() model.SystemConfig {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	return sm.config.System
}

func (sm *SystemManager) UpdateConfig(newConfig model.SystemConfig) error {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	// Update config in memory
	sm.config.System = newConfig

	// Persist to file
	if err := config.SaveConfig(sm.confDir, sm.config); err != nil {
		return fmt.Errorf("failed to save system config: %v", err)
	}

	// Apply changes (Mocking the system calls)
	go sm.applyConfig(newConfig)

	return nil
}

func (sm *SystemManager) applyConfig(cfg model.SystemConfig) {
	// Apply network settings
	if err := sm.mdnsServer.Start(cfg.Hostname); err != nil {
		fmt.Printf("Error updating mDNS: %v\n", err)
	}
	if err := sm.dnsProxy.Start(cfg.Hostname); err != nil {
		fmt.Printf("Error updating DNS Proxy: %v\n", err)
	}

	if err := sm.netManager.ApplyConfigWithTransaction(cfg.Network, cfg.Routes, cfg.ConnectivityTargets); err != nil {
		fmt.Printf("Error updating network config: %v\n", err)
	}

	// TODO: Implement other system calls here
	// 1. Set System Time
	// 2. Configure HA/Keepalived

	fmt.Printf("System configuration applied: %+v\n", cfg)
}

func (sm *SystemManager) GetNetworkInterfaces() ([]model.NetworkInterface, error) {
	return sm.netManager.GetInterfaces()
}

func (sm *SystemManager) GetUser(username string) (*model.UserConfig, bool) {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	for _, u := range sm.config.Users {
		if u.Username == username {
			// Return a copy to prevent accidental modification
			userCopy := u
			return &userCopy, true
		}
	}
	return nil, false
}

func (sm *SystemManager) UpdateUserPassword(username, newPassword string) error {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	found := false
	for i, u := range sm.config.Users {
		if u.Username == username {
			sm.config.Users[i].Password = newPassword
			found = true
			break
		}
	}

	if !found {
		return fmt.Errorf("user not found")
	}

	// Persist to file
	if err := config.SaveConfig(sm.confDir, sm.config); err != nil {
		return fmt.Errorf("failed to save system config: %v", err)
	}

	return nil
}

func (sm *SystemManager) GetRoutes() ([]model.StaticRoute, error) {
	return sm.netManager.GetRoutes()
}
