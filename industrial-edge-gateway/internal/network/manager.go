package network

import (
	"fmt"
	"industrial-edge-gateway/internal/model"
	"sync"
)

// NetworkManager manages network configurations and operations
type NetworkManager struct {
	adapter NetworkAdapter
	mu      sync.RWMutex
}

// NewNetworkManager creates a new NetworkManager
func NewNetworkManager() *NetworkManager {
	return &NetworkManager{
		adapter: NewNetworkAdapter(),
	}
}

// ApplyConfig applies the given network configuration
func (nm *NetworkManager) ApplyConfig(interfaces []model.NetworkInterface, routes []model.StaticRoute) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	// 1. Apply Interface Configs
	for _, iface := range interfaces {
		if err := nm.adapter.ApplyInterfaceConfig(iface); err != nil {
			return fmt.Errorf("failed to apply config for interface %s: %v", iface.Name, err)
		}
	}

	// 2. Apply Static Routes
	for _, route := range routes {
		if err := nm.adapter.ApplyStaticRoute(route); err != nil {
			return fmt.Errorf("failed to apply static route %s: %v", route.Destination, err)
		}
	}

	return nil
}

// ApplyConfigWithTransaction applies the given network configuration with transaction support (rollback on failure)
func (nm *NetworkManager) ApplyConfigWithTransaction(interfaces []model.NetworkInterface, routes []model.StaticRoute, validationTargets []model.ConnectivityTarget) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	// 1. Snapshot (Get current state)
	oldInterfaces, err := nm.adapter.GetInterfaces()
	if err != nil {
		return fmt.Errorf("failed to snapshot interfaces: %v", err)
	}
	oldRoutes, err := nm.adapter.GetRoutes()
	if err != nil {
		return fmt.Errorf("failed to snapshot routes: %v", err)
	}

	// 2. Apply New Config
	// We reuse the logic from ApplyConfig but we are already locked
	applyErr := func() error {
		for _, iface := range interfaces {
			if err := nm.adapter.ApplyInterfaceConfig(iface); err != nil {
				return fmt.Errorf("interface config failed: %v", err)
			}
		}
		for _, route := range routes {
			if err := nm.adapter.ApplyStaticRoute(route); err != nil {
				return fmt.Errorf("route config failed: %v", err)
			}
		}
		return nil
	}()

	// 3. Validate
	if applyErr == nil {
		// Only validate if application succeeded
		if len(validationTargets) > 0 {
			report, err := nm.adapter.ValidateConnectivity(validationTargets)
			if err != nil {
				applyErr = fmt.Errorf("connectivity validation error: %v", err)
			} else if !report.Success {
				applyErr = fmt.Errorf("connectivity validation failed: %v", report)
			}
		}
	}

	// 4. Rollback if needed
	if applyErr != nil {
		fmt.Printf("Network transaction failed: %v. Rolling back...\n", applyErr)

		// Restore interfaces
		for _, iface := range oldInterfaces {
			// We might need to find the matching old interface or just apply all old ones
			// Since oldInterfaces contains the full state snapshot, applying them should restore state.
			if err := nm.adapter.ApplyInterfaceConfig(iface); err != nil {
				fmt.Printf("Rollback failed for interface %s: %v\n", iface.Name, err)
			}
		}

		// Restore routes
		// For routes, we might need to remove new ones first?
		// Or just applying old routes is enough if they overwrite.
		// A proper implementation would diff and revert.
		// For now, let's try to apply old routes.
		for _, route := range oldRoutes {
			if err := nm.adapter.ApplyStaticRoute(route); err != nil {
				fmt.Printf("Rollback failed for route %s: %v\n", route.Destination, err)
			}
		}

		return applyErr
	}

	return nil
}

// GetInterfaces returns the current status of all interfaces
func (nm *NetworkManager) GetInterfaces() ([]model.NetworkInterface, error) {
	nm.mu.RLock()
	defer nm.mu.RUnlock()
	return nm.adapter.GetInterfaces()
}

// GetRoutes returns the current static routes
func (nm *NetworkManager) GetRoutes() ([]model.StaticRoute, error) {
	nm.mu.RLock()
	defer nm.mu.RUnlock()
	return nm.adapter.GetRoutes()
}
