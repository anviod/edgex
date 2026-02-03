package opcua

import (
	"industrial-edge-gateway/internal/model"
	"log"
)

type Server struct {
	config model.OPCUAConfig
}

func NewServer(cfg model.OPCUAConfig) *Server {
	return &Server{
		config: cfg,
	}
}

func (s *Server) Start() error {
	log.Printf("Starting OPC UA Server (Mock) on port %d...", s.config.Port)
	log.Printf("Endpoint: opc.tcp://0.0.0.0:%d%s", s.config.Port, s.config.Endpoint)
	// In a real implementation, this would start a listener
	return nil
}

func (s *Server) Update(v model.Value) {
	// Check if device is enabled for OPC UA
	if enabled, ok := s.config.Devices[v.DeviceID]; !ok || !enabled {
		return
	}

	// In a real implementation, this would update the node value in the address space
	// log.Printf("OPC UA Update: Node=%s.%s Value=%v", v.DeviceID, v.PointID, v.Value)
}

func (s *Server) UpdateConfig(cfg model.OPCUAConfig) error {
	s.config = cfg
	// In a real implementation, if port/endpoint changed, we might need to restart
	log.Printf("OPC UA Server config updated: Port=%d, Endpoint=%s, Devices=%d", cfg.Port, cfg.Endpoint, len(cfg.Devices))
	return nil
}

func (s *Server) Stop() {
	log.Println("Stopping OPC UA Server...")
}
