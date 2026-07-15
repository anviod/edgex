//go:build sim

package ethercat

import "fmt"

// stubUDPMaster is a placeholder for test builds (go test -tags sim).
// In simulation mode, the simulatorMaster is used instead of the real UDP master.
// This stub exists only to satisfy the newUDPMaster() reference in connectOnce() —
// it is never actually called because simulation mode always selects simulatorMaster.

type udpMaster struct{}

type slaveIO struct{}

func newUDPMaster() *udpMaster {
	panic("ethercat: udpMaster not available in simulation build — use -tags sim only for testing")
}

func (m *udpMaster) init(iface string) error {
	return fmt.Errorf("ethercat: udpMaster not available in simulation build")
}

func (m *udpMaster) scanSlaves() ([]slaveInfo, error) {
	return nil, fmt.Errorf("ethercat: udpMaster not available in simulation build")
}

func (m *udpMaster) bringToOP(positions []int) error {
	return fmt.Errorf("ethercat: udpMaster not available in simulation build")
}

func (m *udpMaster) sendProcessdata() error {
	return fmt.Errorf("ethercat: udpMaster not available in simulation build")
}

func (m *udpMaster) receiveProcessdata() error {
	return fmt.Errorf("ethercat: udpMaster not available in simulation build")
}

func (m *udpMaster) getTxPDO(position int) []byte {
	return nil
}

func (m *udpMaster) setRxPDO(position int, data []byte) {}

func (m *udpMaster) readSDO(position int, index, subindex uint16) ([]byte, error) {
	return nil, fmt.Errorf("ethercat: udpMaster not available in simulation build")
}

func (m *udpMaster) writeSDO(position int, index, subindex uint16, data []byte) error {
	return fmt.Errorf("ethercat: udpMaster not available in simulation build")
}

func (m *udpMaster) close() error {
	return nil
}
