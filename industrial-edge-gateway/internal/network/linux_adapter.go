package network

import (
	"bufio"
	"bytes"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"net"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

type LinuxAdapter struct{}

func NewLinuxAdapter() *LinuxAdapter {
	return &LinuxAdapter{}
}

func (a *LinuxAdapter) GetInterfaces() ([]model.NetworkInterface, error) {
	// 1. Get links
	cmd := exec.Command("ip", "-j", "link", "show")
	output, err := cmd.Output()
	if err != nil {
		return nil, err
	}
	// Note: Parsing JSON output from ip command would be ideal but requires a struct.
	// For simplicity/robustness without external deps, we might parse text or assume basic parsing.
	// However, standard "ip" command supports "-j" for JSON.
	// Let's fallback to text parsing if we want to be safe, or use simple text parsing.

	// Actually, let's use text parsing for "ip addr show" which gives us everything.
	cmd = exec.Command("ip", "addr", "show")
	output, err = cmd.Output()
	if err != nil {
		return nil, err
	}

	var interfaces []model.NetworkInterface
	var currentIface *model.NetworkInterface

	scanner := bufio.NewScanner(bytes.NewReader(output))
	for scanner.Scan() {
		line := scanner.Text()
		if len(line) == 0 {
			continue
		}

		// Line starting with digit is a new interface: "1: lo: <LOOPBACK,..."
		if line[0] >= '0' && line[0] <= '9' {
			if currentIface != nil {
				interfaces = append(interfaces, *currentIface)
			}
			parts := strings.Split(line, ": ")
			if len(parts) >= 2 {
				ifaceName := strings.TrimSpace(parts[1])
				// Check status
				status := "Disconnected"
				if strings.Contains(line, "UP") {
					status = "Connected"
				}

				currentIface = &model.NetworkInterface{
					Name:      ifaceName,
					Status:    status,
					IPConfigs: []model.IPConfig{},
				}
			}
		} else if currentIface != nil {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "inet ") {
				// inet 127.0.0.1/8 scope host lo
				parts := strings.Fields(line)
				if len(parts) >= 2 {
					cidr := parts[1]
					ip, ipNet, err := net.ParseCIDR(cidr)
					if err == nil {
						ones, _ := ipNet.Mask.Size()
						currentIface.IPConfigs = append(currentIface.IPConfigs, model.IPConfig{
							Address: ip.String(),
							Prefix:  ones,
							Version: "IPv4",
							Source:  "Static", // Difficult to determine DHCP from `ip addr` alone
							Enabled: true,
						})
					}
				}
			} else if strings.HasPrefix(line, "inet6 ") {
				// inet6 ::1/128 scope host
				parts := strings.Fields(line)
				if len(parts) >= 2 {
					cidr := parts[1]
					ip, ipNet, err := net.ParseCIDR(cidr)
					if err == nil {
						ones, _ := ipNet.Mask.Size()
						currentIface.IPConfigs = append(currentIface.IPConfigs, model.IPConfig{
							Address: ip.String(),
							Prefix:  ones,
							Version: "IPv6",
							Source:  "Static",
							Enabled: true,
						})
					}
				}
			}
		}
	}
	if currentIface != nil {
		interfaces = append(interfaces, *currentIface)
	}

	return interfaces, nil
}

func (a *LinuxAdapter) ApplyInterfaceConfig(iface model.NetworkInterface) error {
	// 1. Bring down
	// exec.Command("ip", "link", "set", iface.Name, "down").Run()

	// 2. Flush existing IPs
	exec.Command("ip", "addr", "flush", "dev", iface.Name).Run()

	// 3. Apply IPs
	for _, ip := range iface.IPConfigs {
		if !ip.Enabled {
			continue
		}
		// cidr := fmt.Sprintf("%s/%d", ip.Address, ip.Prefix)
		// cmd := exec.Command("ip", "addr", "add", cidr, "dev", iface.Name)
		// if err := cmd.Run(); err != nil {
		// 	return err
		// }

		// Handle DHCP
		if ip.Source == "DHCP" {
			// This is tricky on raw Linux without a network manager.
			// Try dhclient
			if ip.Version == "IPv6" {
				go exec.Command("dhclient", "-6", iface.Name).Run()
			} else {
				go exec.Command("dhclient", iface.Name).Run()
			}
		} else {
			cidr := fmt.Sprintf("%s/%d", ip.Address, ip.Prefix)
			// For IPv6, "ip addr add" works fine, but we can be explicit if needed.
			// Standard "ip" command handles IPv6 with colon detection.
			cmd := exec.Command("ip", "addr", "add", cidr, "dev", iface.Name)
			if err := cmd.Run(); err != nil {
				return err
			}
		}
	}

	// 4. Bring up
	if err := exec.Command("ip", "link", "set", iface.Name, "up").Run(); err != nil {
		return err
	}

	// 5. Apply Gateway (Default Route)
	// Find the gateway config
	// Assuming the first gateway found in IPConfigs (or iface.Gateway if it existed)
	// The model structure is: Interface -> []IPConfig.
	// The Gateway is usually per-interface or per-system.
	// The `model.GatewayConfig` exists in `SystemSettings` but here we receive `NetworkInterface`.
	// We might need to handle routes separately or assume `ip route add default via ...`

	return nil
}

func (a *LinuxAdapter) ApplyStaticRoute(route model.StaticRoute) error {
	// ip route add {destination} via {gateway} dev {interface} metric {metric}
	args := []string{"route", "add"}

	dest := route.Destination
	if route.Prefix > 0 {
		dest = fmt.Sprintf("%s/%d", route.Destination, route.Prefix)
	}
	args = append(args, dest)

	if route.Gateway != "" {
		args = append(args, "via", route.Gateway)
	}

	if route.Interface != "" {
		args = append(args, "dev", route.Interface)
	}

	if route.Metric > 0 {
		args = append(args, "metric", strconv.Itoa(route.Metric))
	}

	cmd := exec.Command("ip", args...)
	return cmd.Run()
}

func (a *LinuxAdapter) GetRoutes() ([]model.StaticRoute, error) {
	cmd := exec.Command("ip", "route", "show")
	output, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	var routes []model.StaticRoute
	scanner := bufio.NewScanner(bytes.NewReader(output))
	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Fields(line)
		if len(fields) < 1 {
			continue
		}

		// Example: default via 192.168.1.1 dev eth0 proto dhcp metric 100
		// Example: 192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100

		route := model.StaticRoute{
			Enabled: true,
		}

		// Destination
		if fields[0] == "default" {
			route.Destination = "0.0.0.0"
			route.Prefix = 0
		} else {
			_, ipNet, err := net.ParseCIDR(fields[0])
			if err == nil {
				route.Destination = ipNet.IP.String()
				ones, _ := ipNet.Mask.Size()
				route.Prefix = ones
			} else {
				// Maybe just an IP
				route.Destination = fields[0]
				route.Prefix = 32
			}
		}

		// Parse other fields
		for i := 1; i < len(fields)-1; i++ {
			if fields[i] == "via" {
				route.Gateway = fields[i+1]
			} else if fields[i] == "dev" {
				route.Interface = fields[i+1]
			} else if fields[i] == "metric" {
				m, _ := strconv.Atoi(fields[i+1])
				route.Metric = m
			}
		}

		routes = append(routes, route)
	}

	return routes, nil
}

func (a *LinuxAdapter) ValidateConnectivity(targets []model.ConnectivityTarget) (model.ConnectivityReport, error) {
	report := model.ConnectivityReport{
		Success: true,
		Details: []model.ConnectivityResult{},
	}

	for _, target := range targets {
		result := model.ConnectivityResult{
			Target:  target.Target,
			Success: false,
		}

		switch target.Type {
		case "gateway", "ip":
			// Ping
			cmd := exec.Command("ping", "-c", "1", "-W", strconv.Itoa(target.Timeout), target.Target)
			if err := cmd.Run(); err == nil {
				result.Success = true
				result.Message = "Ping successful"
			} else {
				result.Message = "Ping failed"
				report.Success = false
			}
		case "http":
			// HTTP GET
			client := &http.Client{
				Timeout: time.Duration(target.Timeout) * time.Second,
			}
			resp, err := client.Get(target.Target)
			if err == nil && resp.StatusCode >= 200 && resp.StatusCode < 400 {
				result.Success = true
				result.Message = fmt.Sprintf("HTTP check successful: %s", resp.Status)
				resp.Body.Close()
			} else {
				if err != nil {
					result.Message = fmt.Sprintf("HTTP check failed: %v", err)
				} else {
					result.Message = fmt.Sprintf("HTTP check failed: %s", resp.Status)
					resp.Body.Close()
				}
				report.Success = false
			}
		default:
			result.Message = "Unknown target type"
			report.Success = false
		}

		report.Details = append(report.Details, result)
	}

	return report, nil
}
