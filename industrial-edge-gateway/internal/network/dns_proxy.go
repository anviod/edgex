package network

import (
	"log"
	"net"
	"strings"
	"sync"

	"github.com/miekg/dns"
	"industrial-edge-gateway/internal/model"
)

// DNSProxy handles DNS requests for bare hostname access
type DNSProxy struct {
	serverUDP *dns.Server
	serverTCP *dns.Server
	mu        sync.Mutex
	config    model.HostnameConfig
	ips       []net.IP
}

// NewDNSProxy creates a new DNSProxy
func NewDNSProxy() *DNSProxy {
	return &DNSProxy{}
}

// Start starts the DNS proxy
func (d *DNSProxy) Start(cfg model.HostnameConfig) error {
	d.Stop()
	d.mu.Lock()
	defer d.mu.Unlock()

	if !cfg.EnableBare {
		return nil
	}

	d.config = cfg
	d.ips = []net.IP{}

	// Collect IPs
	// If interfaces are specified, only use those
	ifaces, err := net.Interfaces()
	if err != nil {
		return err
	}

	for _, iface := range ifaces {
		validIface := true
		if len(cfg.Interfaces) > 0 {
			validIface = false
			for _, name := range cfg.Interfaces {
				if iface.Name == name {
					validIface = true
					break
				}
			}
		}

		if !validIface {
			continue
		}

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
			if ip != nil && ip.To4() != nil {
				d.ips = append(d.ips, ip)
			}
		}
	}

	// Use this instance as the handler
	d.serverUDP = &dns.Server{Addr: ":53", Net: "udp", Handler: d}
	d.serverTCP = &dns.Server{Addr: ":53", Net: "tcp", Handler: d}

	go func() {
		if err := d.serverUDP.ListenAndServe(); err != nil {
			log.Printf("Failed to start UDP DNS server: %v", err)
		}
	}()

	go func() {
		if err := d.serverTCP.ListenAndServe(); err != nil {
			log.Printf("Failed to start TCP DNS server: %v", err)
		}
	}()

	log.Printf("DNS Proxy started for hostname: %s", cfg.Name)
	return nil
}

// Stop stops the DNS proxy
func (d *DNSProxy) Stop() {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.serverUDP != nil {
		d.serverUDP.Shutdown()
		d.serverUDP = nil
	}
	if d.serverTCP != nil {
		d.serverTCP.Shutdown()
		d.serverTCP = nil
	}
}

// ServeDNS implements the dns.Handler interface
func (d *DNSProxy) ServeDNS(w dns.ResponseWriter, r *dns.Msg) {
	m := new(dns.Msg)
	m.SetReply(r)
	m.Compress = false

	switch r.Opcode {
	case dns.OpcodeQuery:
		for _, q := range m.Question {
			name := strings.TrimSuffix(q.Name, ".")
			// Match hostname or hostname.local
			if strings.EqualFold(name, d.config.Name) || strings.EqualFold(name, d.config.Name+".local") {
				if q.Qtype == dns.TypeA {
					for _, ip := range d.ips {
						rr := &dns.A{
							Hdr: dns.RR_Header{Name: q.Name, Rrtype: dns.TypeA, Class: dns.ClassINET, Ttl: 60},
							A:   ip,
						}
						m.Answer = append(m.Answer, rr)
					}
				}
			} else {
				// For now, return Refused or NameError for other queries
				// If we want to support forwarding, we would need an upstream DNS config
				m.Rcode = dns.RcodeNameError
			}
		}
	}

	w.WriteMsg(m)
}
