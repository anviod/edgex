package network

import (
	"fmt"
	"log"
	"net"
	"sync"

	"industrial-edge-gateway/internal/model"

	"github.com/grandcat/zeroconf"
)

// MDNSServer manages mDNS services
type MDNSServer struct {
	servers []*zeroconf.Server
	mu      sync.Mutex
}

// NewMDNSServer creates a new MDNSServer
func NewMDNSServer() *MDNSServer {
	return &MDNSServer{}
}

// Start starts the mDNS services based on configuration
func (s *MDNSServer) Start(cfg model.HostnameConfig) error {
	s.Stop() // Stop existing first
	s.mu.Lock()
	defer s.mu.Unlock()

	if !cfg.EnableMDNS {
		return nil
	}

	if cfg.Name == "" {
		cfg.Name = "edge-gateway"
	}

	// Resolve interfaces
	var ifaces []net.Interface
	if len(cfg.Interfaces) > 0 {
		for _, name := range cfg.Interfaces {
			if iface, err := net.InterfaceByName(name); err == nil {
				ifaces = append(ifaces, *iface)
			} else {
				log.Printf("Warning: Interface %s not found for mDNS", name)
			}
		}
	}

	// Collect IPs for Proxy
	// If no interfaces specified, we use all multicast interfaces (default behavior if we pass nil to Register)
	// But RegisterProxy requires explicit IPs if we want to override the hostname resolution.
	// Actually, RegisterProxy takes `host` string and `ips` []string.
	// If we want `device-name.local` to resolve to our IPs, we need to provide them.

	var ips []string
	targetInterfaces := ifaces
	if len(targetInterfaces) == 0 {
		// If no interfaces specified, get all
		allIfaces, err := net.Interfaces()
		if err == nil {
			targetInterfaces = allIfaces
		}
	}

	for _, iface := range targetInterfaces {
		if (iface.Flags&net.FlagUp) == 0 || (iface.Flags&net.FlagLoopback) != 0 {
			continue
		}
		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}
		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}
			if ip != nil && ip.To4() != nil { // Currently prefer IPv4, but could support IPv6
				ips = append(ips, ip.String())
			}
		}
	}

	if len(ips) == 0 {
		log.Println("Warning: No IPs found for mDNS broadcast")
	}

	hostName := fmt.Sprintf("%s.local.", cfg.Name)

	// Helper to register service
	register := func(serviceType string, port int, txt []string) error {
		// We use RegisterProxy to control the hostname and IPs
		server, err := zeroconf.RegisterProxy(
			cfg.Name,    // Instance Name
			serviceType, // Service Type
			"local.",    // Domain
			port,        // Port
			hostName,    // Hostname (Target for SRV)
			ips,         // IPs for A records
			txt,         // TXT records
			ifaces,      // Interfaces to broadcast on
		)
		if err != nil {
			return err
		}
		s.servers = append(s.servers, server)
		return nil
	}

	// Register HTTP
	if cfg.HTTPPort > 0 {
		if err := register("_http._tcp", cfg.HTTPPort, []string{"txtv=0", "lo=1", "la=2"}); err != nil {
			return fmt.Errorf("failed to register http service: %v", err)
		}
	}

	// Register HTTPS
	if cfg.HTTPSPort > 0 {
		if err := register("_https._tcp", cfg.HTTPSPort, []string{"txtv=0", "lo=1", "la=2"}); err != nil {
			return fmt.Errorf("failed to register https service: %v", err)
		}
	}

	// Register Gateway
	// Using port 80 or HTTP port as default for Gateway service
	gwPort := cfg.HTTPPort
	if gwPort == 0 {
		gwPort = 80
	}
	if err := register("_gateway._tcp", gwPort, []string{"model=edge-gateway", "version=1.0"}); err != nil {
		return fmt.Errorf("failed to register gateway service: %v", err)
	}

	log.Printf("mDNS services started for hostname: %s (%v)", cfg.Name, ips)
	return nil
}

// Stop stops all mDNS services
func (s *MDNSServer) Stop() {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, server := range s.servers {
		server.Shutdown()
	}
	s.servers = nil
}
