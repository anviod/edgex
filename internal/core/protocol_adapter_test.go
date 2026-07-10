package core

import (
	"testing"
)

func TestProtocolAdapterRegistry(t *testing.T) {
	registry := NewProtocolAdapterRegistry()

	// 测试获取默认协议适配器
	defaultAdapter := registry.GetAdapter("unknown")
	if defaultAdapter == nil {
		t.Error("Expected default adapter to be non-nil")
	}
	if defaultAdapter.GetProtocolType() != "default" {
		t.Errorf("Expected default adapter type to be 'default', got %s", defaultAdapter.GetProtocolType())
	}

	// 测试获取Modbus协议适配器
	modbusAdapter := registry.GetAdapter("modbus")
	if modbusAdapter == nil {
		t.Error("Expected Modbus adapter to be non-nil")
	}
	if modbusAdapter.GetProtocolType() != "modbus" {
		t.Errorf("Expected Modbus adapter type to be 'modbus', got %s", modbusAdapter.GetProtocolType())
	}

	// 测试获取TCP协议适配器
	tcpAdapter := registry.GetAdapter("tcp")
	if tcpAdapter == nil {
		t.Error("Expected TCP adapter to be non-nil")
	}
	if tcpAdapter.GetProtocolType() != "tcp" {
		t.Errorf("Expected TCP adapter type to be 'tcp', got %s", tcpAdapter.GetProtocolType())
	}

	// 测试获取BACnet协议适配器
	bacnetAdapter := registry.GetAdapter("bacnet")
	if bacnetAdapter == nil {
		t.Error("Expected BACnet adapter to be non-nil")
	}
	if bacnetAdapter.GetProtocolType() != "bacnet" {
		t.Errorf("Expected BACnet adapter type to be 'bacnet', got %s", bacnetAdapter.GetProtocolType())
	}

	// 测试获取默认参数
	defaultParams := defaultAdapter.GetDefaultParameters()
	if defaultParams == nil {
		t.Error("Expected default parameters to be non-nil")
	}

	// 测试调整参数
	params := map[string]interface{}{"timeout": 5000}
	adjustedParams := defaultAdapter.AdjustParameters("test-device", params)
	if adjustedParams == nil {
		t.Error("Expected adjusted parameters to be non-nil")
	}

	// 测试验证参数
	err := defaultAdapter.ValidateParameters(params)
	if err != nil {
		t.Errorf("Expected no error when validating parameters, got %v", err)
	}
}
