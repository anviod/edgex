package ethercat

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// simulatorMaster is an in-memory EtherCAT master implementation for testing.
// It simulates slave I/O images and SDO dictionary without requiring real hardware
// or network access. Used when channelCfg.simulation is true.
//
// Build constraint: this file is compiled unconditionally (pure Go).
// The real udpMaster is always compiled via transport.go (no CGO required).

type simulatorMaster struct {
	mu      sync.Mutex
	slaves  map[int]*simSlave
	opState atomic.Int32 // 0=INIT, 1=PREOP, 2=SAFEOP, 3=OP
}

// simSlave holds simulated slave I/O data and SDO dictionary.
type simSlave struct {
	position    int
	vendorID    uint32
	productCode uint32
	revision    uint32
	txPDO       []byte
	rxPDO       []byte
	sdoDict     map[uint32][]byte // key = (index<<16) | subindex
	mu          sync.Mutex
}

func newSimulatorMaster() *simulatorMaster {
	return &simulatorMaster{
		slaves: make(map[int]*simSlave),
	}
}

func (m *simulatorMaster) init(iface string) error {
	m.opState.Store(0) // INIT
	return nil
}

func (m *simulatorMaster) scanSlaves() ([]slaveInfo, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	// Create default simulated slaves if none exist
	if len(m.slaves) == 0 {
		// Default: one simulated slave at position 1
		m.slaves[1] = &simSlave{
			position:    1,
			vendorID:    0x00000002, // Beckhoff
			productCode: 0x07D43052,
			revision:    0x00010000,
			txPDO:       make([]byte, 16),
			rxPDO:       make([]byte, 8),
			sdoDict:     make(map[uint32][]byte),
		}
	}

	var slaves []slaveInfo
	for _, s := range m.slaves {
		slaves = append(slaves, slaveInfo{
			Position:    s.position,
			VendorID:    s.vendorID,
			ProductCode: s.productCode,
			Revision:    s.revision,
			TxPDOSize:   len(s.txPDO),
			RxPDOSize:   len(s.rxPDO),
		})
	}
	return slaves, nil
}

func (m *simulatorMaster) bringToOP(positions []int) error {
	m.opState.Store(3) // OP
	return nil
}

func (m *simulatorMaster) sendProcessdata() error {
	// In simulation, RxPDO data is already in the slave buffers
	return nil
}

func (m *simulatorMaster) receiveProcessdata() error {
	// In simulation, TxPDO data is pre-set by tests
	return nil
}

func (m *simulatorMaster) getTxPDO(position int) []byte {
	m.mu.Lock()
	defer m.mu.Unlock()

	if s, ok := m.slaves[position]; ok {
		s.mu.Lock()
		defer s.mu.Unlock()
		result := make([]byte, len(s.txPDO))
		copy(result, s.txPDO)
		return result
	}
	return nil
}

func (m *simulatorMaster) setRxPDO(position int, data []byte) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if s, ok := m.slaves[position]; ok {
		s.mu.Lock()
		defer s.mu.Unlock()
		copy(s.rxPDO, data)
	}
}

func (m *simulatorMaster) readSDO(position int, index, subindex uint16) ([]byte, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	s, ok := m.slaves[position]
	if !ok {
		return nil, fmt.Errorf("ethercat sim: slave %d not found", position)
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	key := (uint32(index) << 16) | uint32(subindex)
	if data, ok := s.sdoDict[key]; ok {
		result := make([]byte, len(data))
		copy(result, data)
		return result, nil
	}

	return nil, fmt.Errorf("ethercat sim: SDO 0x%04X:%d not found for slave %d", index, subindex, position)
}

func (m *simulatorMaster) writeSDO(position int, index, subindex uint16, data []byte) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	s, ok := m.slaves[position]
	if !ok {
		return fmt.Errorf("ethercat sim: slave %d not found", position)
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	key := (uint32(index) << 16) | uint32(subindex)
	value := make([]byte, len(data))
	copy(value, data)
	s.sdoDict[key] = value
	return nil
}

func (m *simulatorMaster) close() error {
	m.opState.Store(0)
	return nil
}

// --- Test helpers for simulation ---

// setTxPDO sets the TxPDO image data for a simulated slave.
// Used by tests to simulate slave input data.
func (m *simulatorMaster) setTxPDO(position int, offset int, data []byte) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if s, ok := m.slaves[position]; ok {
		s.mu.Lock()
		defer s.mu.Unlock()
		if offset+len(data) <= len(s.txPDO) {
			copy(s.txPDO[offset:], data)
		}
	}
}

// getRxPDO returns the current RxPDO image data for a simulated slave.
// Used by tests to verify WritePoint output.
func (m *simulatorMaster) getRxPDO(position int) []byte {
	m.mu.Lock()
	defer m.mu.Unlock()

	if s, ok := m.slaves[position]; ok {
		s.mu.Lock()
		defer s.mu.Unlock()
		result := make([]byte, len(s.rxPDO))
		copy(result, s.rxPDO)
		return result
	}
	return nil
}

// addSlave adds a simulated slave at the given position with the specified PDO sizes.
func (m *simulatorMaster) addSlave(position int, vendorID, productCode uint32, txSize, rxSize int) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.slaves[position] = &simSlave{
		position:    position,
		vendorID:    vendorID,
		productCode: productCode,
		revision:    0x00010000,
		txPDO:       make([]byte, txSize),
		rxPDO:       make([]byte, rxSize),
		sdoDict:     make(map[uint32][]byte),
	}
}

// setSDO sets a value in the simulated slave's SDO dictionary.
func (m *simulatorMaster) setSDO(position int, index, subindex uint16, data []byte) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if s, ok := m.slaves[position]; ok {
		s.mu.Lock()
		defer s.mu.Unlock()
		key := (uint32(index) << 16) | uint32(subindex)
		value := make([]byte, len(data))
		copy(value, data)
		s.sdoDict[key] = value
	}
}
