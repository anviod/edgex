package ethernetip

import (
	"testing"
)

// TestConnectionTypeCIP 测试标准 CIP 模式配置
func TestConnectionTypeCIP(t *testing.T) {
	cfg := map[string]any{
		"ip":             "127.0.0.1",
		"port":           44818,
		"slot":           0,
		"connection_type": "cip",
	}

	transport := NewENIPTransport(cfg)

	if transport.connectionType != "cip" {
		t.Errorf("Expected connection_type to be 'cip', got '%s'", transport.connectionType)
	}

	t.Logf("CIP mode configured correctly: %s", transport.connectionType)
}

// TestConnectionTypeLogix 测试 Logix 模式配置
func TestConnectionTypeLogix(t *testing.T) {
	cfg := map[string]any{
		"ip":             "127.0.0.1",
		"port":           44818,
		"slot":           0,
		"connection_type": "logix",
	}

	transport := NewENIPTransport(cfg)

	if transport.connectionType != "logix" {
		t.Errorf("Expected connection_type to be 'logix', got '%s'", transport.connectionType)
	}

	t.Logf("Logix mode configured correctly: %s", transport.connectionType)
}

// TestConnectionTypeDefault 测试未设置连接类型时使用默认值
func TestConnectionTypeDefault(t *testing.T) {
	cfg := map[string]any{
		"ip":   "127.0.0.1",
		"port": 44818,
		"slot": 0,
	}

	transport := NewENIPTransport(cfg)

	if transport.connectionType != "cip" {
		t.Errorf("Expected default connection_type to be 'cip', got '%s'", transport.connectionType)
	}

	t.Logf("Default CIP mode configured correctly: %s", transport.connectionType)
}

// TestConnectionTypeCaseInsensitive 测试连接类型是否大小写不敏感
func TestConnectionTypeCaseInsensitive(t *testing.T) {
	testCases := []struct {
		name     string
		input    string
		expected string
	}{
		{"uppercase CIP", "CIP", "CIP"},
		{"lowercase cip", "cip", "cip"},
		{"mixed case Cip", "Cip", "Cip"},
		{"uppercase LOGIX", "LOGIX", "LOGIX"},
		{"lowercase logix", "logix", "logix"},
		{"mixed case Logix", "Logix", "Logix"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			cfg := map[string]any{
				"ip":             "127.0.0.1",
				"port":           44818,
				"slot":           0,
				"connection_type": tc.input,
			}

			transport := NewENIPTransport(cfg)

			if transport.connectionType != tc.expected {
				t.Errorf("Expected connection_type to be '%s', got '%s'", tc.expected, transport.connectionType)
			}
		})
	}
}

// TestConnectionTypeInvalidValue 测试无效连接类型值的处理
func TestConnectionTypeInvalidValue(t *testing.T) {
	cfg := map[string]any{
		"ip":             "127.0.0.1",
		"port":           44818,
		"slot":           0,
		"connection_type": "invalid",
	}

	transport := NewENIPTransport(cfg)

	if transport.connectionType != "invalid" {
		t.Errorf("Expected connection_type to be 'invalid' (passed through), got '%s'", transport.connectionType)
	}

	t.Logf("Invalid connection type passed through: %s", transport.connectionType)
}

// TestConnectionTypeWithOtherConfigs 测试连接类型与其他配置参数组合
func TestConnectionTypeWithOtherConfigs(t *testing.T) {
	cfg := map[string]any{
		"ip":                "192.168.1.10",
		"port":              44818,
		"slot":              1,
		"connection_type":   "logix",
		"timeout":           5000,
		"max_retries":       3,
		"retry_interval":    200,
		"heartbeat_interval": 30000,
	}

	transport := NewENIPTransport(cfg)

	if transport.connectionType != "logix" {
		t.Errorf("Expected connection_type to be 'logix', got '%s'", transport.connectionType)
	}

	if transport.ip != "192.168.1.10" {
		t.Errorf("Expected IP to be '192.168.1.10', got '%s'", transport.ip)
	}

	if transport.slot != 1 {
		t.Errorf("Expected slot to be 1, got %d", transport.slot)
	}

	t.Logf("All configurations parsed correctly for Logix mode")
}
