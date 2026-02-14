package modbus

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/simonvetter/modbus"
	"go.uber.org/zap"
)

// Transport 接口定义
type Transport interface {
	Connect(ctx context.Context) error
	Disconnect() error
	IsConnected() bool

	ReadRegisters(ctx context.Context, regType string, offset uint16, count uint16) ([]byte, error)
	ReadCoil(ctx context.Context, offset uint16) (bool, error)
	ReadDiscreteInput(ctx context.Context, offset uint16) (bool, error)

	WriteRegister(ctx context.Context, offset uint16, value uint16) error
	WriteRegisters(ctx context.Context, offset uint16, values []uint16) error
	WriteCoil(ctx context.Context, offset uint16, value bool) error

	SetUnitID(id uint8)
}

// ModbusTransport 实现 Transport 接口
type ModbusTransport struct {
	cfg            model.DriverConfig
	client         *modbus.ModbusClient
	connected      atomic.Bool
	mu             sync.Mutex
	timeout        time.Duration
	maxRetries     int
	retryInterval  time.Duration
	heartbeatAddr  *uint16
	heartbeatTimer *time.Ticker
	stopHeartbeat  chan struct{}
}

func NewModbusTransport(cfg model.DriverConfig) *ModbusTransport {
	// Defaults
	timeout := 2 * time.Second
	maxRetries := 3
	retryInterval := 100 * time.Millisecond

	// Parse config
	if tVal, ok := cfg.Config["timeout"]; ok {
		if f, ok := tVal.(float64); ok {
			timeout = time.Duration(f) * time.Millisecond
		} else if i, ok := tVal.(int); ok {
			timeout = time.Duration(i) * time.Millisecond
		} else if s, ok := tVal.(string); ok {
			if d, err := time.ParseDuration(s); err == nil {
				timeout = d
			}
		}
	}

	if v, ok := cfg.Config["max_retries"]; ok {
		if f, ok := v.(float64); ok {
			maxRetries = int(f)
		} else if i, ok := v.(int); ok {
			maxRetries = i
		}
	}

	if v, ok := cfg.Config["retry_interval"]; ok {
		if f, ok := v.(float64); ok {
			retryInterval = time.Duration(f) * time.Millisecond
		} else if i, ok := v.(int); ok {
			retryInterval = time.Duration(i) * time.Millisecond
		}
	}

	var heartbeatAddr *uint16
	if v, ok := cfg.Config["heartbeatAddress"]; ok {
		if f, ok := v.(float64); ok {
			addr := uint16(f)
			heartbeatAddr = &addr
		} else if i, ok := v.(int); ok {
			addr := uint16(i)
			heartbeatAddr = &addr
		}
	}

	return &ModbusTransport{
		cfg:           cfg,
		timeout:       timeout,
		maxRetries:    maxRetries,
		retryInterval: retryInterval,
		heartbeatAddr: heartbeatAddr,
	}
}

func (t *ModbusTransport) startHeartbeatLoop() {
	if t.heartbeatAddr == nil {
		return
	}

	interval := 5 * time.Second
	if v, ok := t.cfg.Config["heartbeatInterval"]; ok {
		if f, ok := v.(float64); ok {
			interval = time.Duration(f) * time.Millisecond
		} else if i, ok := v.(int); ok {
			interval = time.Duration(i) * time.Millisecond
		}
	}

	t.mu.Lock()
	if t.heartbeatTimer != nil {
		t.heartbeatTimer.Stop()
	}
	t.heartbeatTimer = time.NewTicker(interval)
	t.stopHeartbeat = make(chan struct{})
	t.mu.Unlock()

	go func() {
		for {
			select {
			case <-t.stopHeartbeat:
				return
			case <-t.heartbeatTimer.C:
				if !t.IsConnected() {
					continue
				}
				// Perform read to check connection
				ctx, cancel := context.WithTimeout(context.Background(), t.timeout)
				_, err := t.ReadRegisters(ctx, "HOLDING_REGISTER", *t.heartbeatAddr, 1)
				cancel()
				if err != nil {
					zap.L().Warn("[Modbus] Heartbeat failed, closing TCP connection to force clean reconnect",
						zap.Error(err),
					)
					// Force disconnect to trigger reconnect on next operation?
					// Or just let the next operation fail.
					// If we want proactive reconnect, we might need to handle it here.
					t.Disconnect()
				}
			}
		}
	}()
}

func (t *ModbusTransport) Connect(ctx context.Context) error {
	t.mu.Lock()
	defer t.mu.Unlock()

	if t.connected.Load() {
		zap.L().Debug("[Modbus] Connect skipped: already connected")
		return nil
	}

	// Ensure previous client is closed
	if t.client != nil {
		zap.L().Info("[Modbus] Closing existing TCP client before reconnect")
		_ = t.client.Close()
		t.client = nil
	}

	// Build URL
	url, ok := t.cfg.Config["url"].(string)
	if !ok || url == "" {
		if port, okPort := t.cfg.Config["port"].(string); okPort && port != "" {
			baudRate := 9600
			if v, ok := t.cfg.Config["baudRate"]; ok {
				if f, ok := v.(float64); ok {
					baudRate = int(f)
				} else if i, ok := v.(int); ok {
					baudRate = i
				}
			}
			dataBits := 8
			if v, ok := t.cfg.Config["dataBits"]; ok {
				if f, ok := v.(float64); ok {
					dataBits = int(f)
				} else if i, ok := v.(int); ok {
					dataBits = i
				}
			}
			stopBits := 1
			if v, ok := t.cfg.Config["stopBits"]; ok {
				if f, ok := v.(float64); ok {
					stopBits = int(f)
				} else if i, ok := v.(int); ok {
					stopBits = i
				}
			}
			parity := "N"
			if v, ok := t.cfg.Config["parity"].(string); ok {
				parity = v
			}
			url = fmt.Sprintf("rtu://%s?baudrate=%d&data_bits=%d&parity=%s&stop_bits=%d",
				port, baudRate, dataBits, parity, stopBits)
		} else {
			addr, _ := t.cfg.Config["address"].(string)
			if addr != "" {
				url = "tcp://" + addr
			} else {
				return fmt.Errorf("modbus url or port not configured")
			}
		}
	}

	zap.L().Info("[Modbus] Establishing TCP connection",
		zap.String("url", url),
		zap.Duration("timeout", t.timeout),
	)
	client, err := modbus.NewClient(&modbus.ClientConfiguration{
		URL:     url,
		Timeout: t.timeout,
	})
	if err != nil {
		zap.L().Error("[Modbus] Create client failed",
			zap.String("url", url),
			zap.Error(err),
		)
		return err
	}

	if err := client.Open(); err != nil {
		zap.L().Error("[Modbus] Open TCP connection failed",
			zap.String("url", url),
			zap.Error(err),
		)
		return err
	}

	t.client = client

	// Set initial Unit ID
	if slaveID, ok := t.cfg.Config["slave_id"]; ok {
		var sid uint8
		switch v := slaveID.(type) {
		case int:
			sid = uint8(v)
		case float64:
			sid = uint8(v)
		case uint8:
			sid = v
		default:
			sid = 1
		}
		t.client.SetUnitId(sid)
	}

	t.connected.Store(true)
	zap.L().Info("[Modbus] TCP connection established",
		zap.String("url", url),
	)
	t.startHeartbeatLoop()
	return nil
}

func (t *ModbusTransport) Disconnect() error {
	t.mu.Lock()
	defer t.mu.Unlock()

	if t.client != nil {
		zap.L().Info("[Modbus] Closing TCP connection")
		_ = t.client.Close()
		t.client = nil
	}

	if t.heartbeatTimer != nil {
		t.heartbeatTimer.Stop()
		t.heartbeatTimer = nil
	}
	if t.stopHeartbeat != nil {
		close(t.stopHeartbeat)
		t.stopHeartbeat = nil
	}

	t.connected.Store(false)
	zap.L().Info("[Modbus] Disconnected")
	return nil
}

func (t *ModbusTransport) IsConnected() bool {
	return t.connected.Load()
}

func (t *ModbusTransport) SetUnitID(id uint8) {
	t.mu.Lock()
	defer t.mu.Unlock()
	if t.client != nil {
		t.client.SetUnitId(id)
	}
}

func (t *ModbusTransport) withRetry(ctx context.Context, fn func() (any, error)) (any, error) {
	var lastErr error
	for i := 0; i <= t.maxRetries; i++ {
		if i > 0 {
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-time.After(t.retryInterval):
			}
		}

		// Check connection
		if !t.connected.Load() {
			if err := t.Connect(ctx); err != nil {
				lastErr = err
				continue
			}
		}

		res, err := fn()
		if err == nil {
			return res, nil
		}

		lastErr = err
		zap.L().Warn("[Modbus] Operation failed",
			zap.Int("attempt", i+1),
			zap.Int("max_attempts", t.maxRetries+1),
			zap.Error(err),
		)

		// Only disconnect on network/IO errors, not protocol errors
		// Protocol errors: "illegal", "exception", "busy"
		// Network errors: "timeout", "reset", "broken pipe", "EOF"
		errMsg := err.Error()
		isProtocolError := false
		if len(errMsg) > 0 {
			// Check for common Modbus protocol errors that don't require reconnect
			if contains(errMsg, "illegal") || contains(errMsg, "exception") || contains(errMsg, "busy") {
				isProtocolError = true
			}
		}

		if !isProtocolError {
			// Force disconnect to trigger reconnect on next attempt
			zap.L().Warn("[Modbus] Network/IO error detected, forcing disconnect to ensure clean session before reconnect",
				zap.String("error", errMsg),
			)
			t.Disconnect()
		}
	}
	return nil, lastErr
}

func contains(s, substr string) bool {
	return strings.Contains(strings.ToLower(s), substr)
}

func (t *ModbusTransport) ReadRegisters(ctx context.Context, regType string, offset uint16, count uint16) ([]byte, error) {
	res, err := t.withRetry(ctx, func() (any, error) {
		t.mu.Lock()
		defer t.mu.Unlock()
		if t.client == nil {
			return nil, fmt.Errorf("client is nil")
		}

		switch regType {
		case "HOLDING_REGISTER":
			return t.client.ReadBytes(offset, count*2, modbus.HOLDING_REGISTER)
		case "INPUT_REGISTER":
			return t.client.ReadBytes(offset, count*2, modbus.INPUT_REGISTER)
		default:
			return nil, fmt.Errorf("unsupported regType for ReadRegisters: %s", regType)
		}
	})
	if err != nil {
		return nil, err
	}
	return res.([]byte), nil
}

func (t *ModbusTransport) ReadCoil(ctx context.Context, offset uint16) (bool, error) {
	res, err := t.withRetry(ctx, func() (any, error) {
		t.mu.Lock()
		defer t.mu.Unlock()
		if t.client == nil {
			return nil, fmt.Errorf("client is nil")
		}
		return t.client.ReadCoil(offset)
	})
	if err != nil {
		return false, err
	}
	return res.(bool), nil
}

func (t *ModbusTransport) ReadDiscreteInput(ctx context.Context, offset uint16) (bool, error) {
	res, err := t.withRetry(ctx, func() (any, error) {
		t.mu.Lock()
		defer t.mu.Unlock()
		if t.client == nil {
			return nil, fmt.Errorf("client is nil")
		}
		return t.client.ReadDiscreteInput(offset)
	})
	if err != nil {
		return false, err
	}
	return res.(bool), nil
}

func (t *ModbusTransport) WriteRegister(ctx context.Context, offset uint16, value uint16) error {
	_, err := t.withRetry(ctx, func() (any, error) {
		t.mu.Lock()
		defer t.mu.Unlock()
		if t.client == nil {
			return nil, fmt.Errorf("client is nil")
		}
		return nil, t.client.WriteRegister(offset, value)
	})
	return err
}

func (t *ModbusTransport) WriteRegisters(ctx context.Context, offset uint16, values []uint16) error {
	_, err := t.withRetry(ctx, func() (any, error) {
		t.mu.Lock()
		defer t.mu.Unlock()
		if t.client == nil {
			return nil, fmt.Errorf("client is nil")
		}
		return nil, t.client.WriteRegisters(offset, values)
	})
	return err
}

func (t *ModbusTransport) WriteCoil(ctx context.Context, offset uint16, value bool) error {
	_, err := t.withRetry(ctx, func() (any, error) {
		t.mu.Lock()
		defer t.mu.Unlock()
		if t.client == nil {
			return nil, fmt.Errorf("client is nil")
		}
		return nil, t.client.WriteCoil(offset, value)
	})
	return err
}
