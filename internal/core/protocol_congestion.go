package core

import (
	"strings"
	"sync"
)

const (
	protocolCongestionModbusRate = 800.0
	protocolCongestionOpcuaRate  = 400.0
	protocolCongestionS7Rate     = 300.0
	protocolCongestionDefaultRate = 600.0
)

// ProtocolCongestionController applies independent token buckets per protocol family
// so Modbus, OPC UA, and S7 congestion do not starve each other.
type ProtocolCongestionController struct {
	buckets sync.Map // group -> *TokenBucket
}

func NewProtocolCongestionController() *ProtocolCongestionController {
	return &ProtocolCongestionController{}
}

func protocolCongestionGroup(protocol string) string {
	p := strings.ToLower(protocol)
	switch {
	case isModbusProtocol(p):
		return "modbus"
	case strings.Contains(p, "opc"):
		return "opcua"
	case strings.HasPrefix(p, "s7") || strings.Contains(p, "snap7"):
		return "s7"
	default:
		return "default"
	}
}

func protocolCongestionRate(group string) float64 {
	switch group {
	case "modbus":
		return protocolCongestionModbusRate
	case "opcua":
		return protocolCongestionOpcuaRate
	case "s7":
		return protocolCongestionS7Rate
	default:
		return protocolCongestionDefaultRate
	}
}

func (pc *ProtocolCongestionController) bucket(group string) *TokenBucket {
	if raw, ok := pc.buckets.Load(group); ok {
		return raw.(*TokenBucket)
	}
	rate := protocolCongestionRate(group)
	b := NewTokenBucket(rate, rate*2)
	actual, _ := pc.buckets.LoadOrStore(group, b)
	return actual.(*TokenBucket)
}

func (pc *ProtocolCongestionController) Allow(protocol string) bool {
	if pc == nil {
		return true
	}
	return pc.bucket(protocolCongestionGroup(protocol)).Allow()
}

func (pc *ProtocolCongestionController) RejectTotal() uint64 {
	if pc == nil {
		return 0
	}
	var total uint64
	pc.buckets.Range(func(_, value any) bool {
		_ = value.(*TokenBucket)
		return true
	})
	return total
}
