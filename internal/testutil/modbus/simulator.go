package modbus

import (
	"fmt"
	"net"
	"sync"
	"testing"
	"time"

	mb "github.com/simonvetter/modbus"
)

// Simulator is a minimal Modbus TCP server for protocol-level integration tests.
type Simulator struct {
	mu          sync.Mutex
	holding     map[uint8][]uint16
	latency     map[uint8]time.Duration
	blockSlaves map[uint8]bool

	server *mb.ModbusServer
	url    string
}

type simulatorHandler struct {
	sim *Simulator
}

func (h *simulatorHandler) HandleCoils(_ *mb.CoilsRequest) ([]bool, error) {
	return nil, mb.ErrIllegalFunction
}

func (h *simulatorHandler) HandleDiscreteInputs(_ *mb.DiscreteInputsRequest) ([]bool, error) {
	return nil, mb.ErrIllegalFunction
}

func (h *simulatorHandler) HandleInputRegisters(_ *mb.InputRegistersRequest) ([]uint16, error) {
	return nil, mb.ErrIllegalFunction
}

func (h *simulatorHandler) HandleHoldingRegisters(req *mb.HoldingRegistersRequest) ([]uint16, error) {
	if req.IsWrite {
		return nil, mb.ErrIllegalFunction
	}

	h.sim.mu.Lock()
	latency := h.sim.latency[req.UnitId]
	blocked := h.sim.blockSlaves[req.UnitId]
	regs := h.sim.holding[req.UnitId]
	h.sim.mu.Unlock()

	// Blocked slave fails immediately so ScanEngine records task failures.
	if blocked {
		return nil, mb.ErrIllegalDataAddress
	}
	if latency > 0 {
		time.Sleep(latency)
	}
	if len(regs) == 0 {
		return nil, mb.ErrIllegalDataAddress
	}
	end := int(req.Addr) + int(req.Quantity)
	if end > len(regs) {
		return nil, mb.ErrIllegalDataAddress
	}
	out := make([]uint16, req.Quantity)
	copy(out, regs[req.Addr:end])
	return out, nil
}

// StartSimulator listens on an ephemeral port and serves holding registers per unit ID.
func StartSimulator(t *testing.T) *Simulator {
	t.Helper()

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	port := ln.Addr().(*net.TCPAddr).Port
	_ = ln.Close()

	sim := &Simulator{
		holding:     make(map[uint8][]uint16),
		latency:     make(map[uint8]time.Duration),
		blockSlaves: make(map[uint8]bool),
		url:         fmt.Sprintf("tcp://127.0.0.1:%d", port),
	}

	server, err := mb.NewServer(&mb.ServerConfiguration{
		URL:        sim.url,
		MaxClients: 32,
		Timeout:    30 * time.Second,
	}, &simulatorHandler{sim: sim})
	if err != nil {
		t.Fatalf("new server: %v", err)
	}
	if err := server.Start(); err != nil {
		t.Fatalf("start server: %v", err)
	}
	sim.server = server
	t.Cleanup(func() { _ = server.Stop() })
	return sim
}

func (s *Simulator) URL() string {
	return s.url
}

func (s *Simulator) SeedHolding(unitID uint8, values ...uint16) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.holding[unitID] = append([]uint16(nil), values...)
}

func (s *Simulator) SetLatency(unitID uint8, d time.Duration) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.latency[unitID] = d
}

func (s *Simulator) BlockSlave(unitID uint8, blocked bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.blockSlaves[unitID] = blocked
}
