package ethernetip

import (
	"context"
	"fmt"
	"net"
	"reflect"
	"sync"
	"sync/atomic"
	"time"

	go_ethernet_ip "github.com/anviod/ethernet-ip"
	"go.uber.org/zap"
)

type ENIPClient = go_ethernet_ip.EIPTCP

type ENIPTransport struct {
	cfg map[string]any

	tcp *ENIPClient

	tcpFactory func(address string, cfg *go_ethernet_ip.Config) (*go_ethernet_ip.EIPTCP, error)

	ip             string
	port           int
	slot           int
	connectionType string
	timeout        time.Duration
	maxRetries     int
	retryInterval  time.Duration

	connected          atomic.Bool
	mu                 sync.Mutex
	connectTime        time.Time
	lastDisconnectTime time.Time
	reconnectCount     atomic.Int32
	localAddr          string
	remoteAddr         string

	heartbeatInterval time.Duration
	heartbeatTicker   *time.Ticker
	stopHeartbeat     chan struct{}

	lastActivityTime   atomic.Value
	heartbeatFailCount atomic.Int32
	heartbeatFailMax   int32
}

func NewENIPTransport(cfg map[string]any) *ENIPTransport {
	t := &ENIPTransport{
		cfg:               cfg,
		port:              44818,
		slot:              0,
		timeout:           2 * time.Second,
		maxRetries:        3,
		retryInterval:     100 * time.Millisecond,
		heartbeatInterval: 30 * time.Second,
		heartbeatFailMax:  3,
		stopHeartbeat:     make(chan struct{}),
	}

	t.tcpFactory = func(address string, cfg *go_ethernet_ip.Config) (*go_ethernet_ip.EIPTCP, error) {
		return go_ethernet_ip.NewTCP(address, cfg)
	}

	t.parseConfig()
	t.lastActivityTime.Store(time.Time{})

	return t
}

func (t *ENIPTransport) parseConfig() {
	if v, ok := t.cfg["ip"].(string); ok {
		t.ip = v
	}

	if v, ok := t.cfg["port"].(float64); ok {
		t.port = int(v)
	} else if v, ok := t.cfg["port"].(int); ok {
		t.port = v
	}

	if v, ok := t.cfg["slot"].(float64); ok {
		t.slot = int(v)
	} else if v, ok := t.cfg["slot"].(int); ok {
		t.slot = v
	}

	if v, ok := t.cfg["timeout"].(float64); ok {
		t.timeout = time.Duration(v) * time.Millisecond
	} else if v, ok := t.cfg["timeout"].(int); ok {
		t.timeout = time.Duration(v) * time.Millisecond
	}

	if v, ok := t.cfg["max_retries"].(float64); ok {
		t.maxRetries = int(v)
	} else if v, ok := t.cfg["max_retries"].(int); ok {
		t.maxRetries = v
	}

	if v, ok := t.cfg["retry_interval"].(float64); ok {
		t.retryInterval = time.Duration(v) * time.Millisecond
	} else if v, ok := t.cfg["retry_interval"].(int); ok {
		t.retryInterval = time.Duration(v) * time.Millisecond
	}

	if v, ok := t.cfg["heartbeat_interval"].(float64); ok {
		t.heartbeatInterval = time.Duration(v) * time.Millisecond
	} else if v, ok := t.cfg["heartbeat_interval"].(int); ok {
		t.heartbeatInterval = time.Duration(v) * time.Millisecond
	}

	if v, ok := t.cfg["connection_type"].(string); ok {
		t.connectionType = v
	} else {
		t.connectionType = "cip"
	}
}

func (t *ENIPTransport) Connect(ctx context.Context) error {
	t.mu.Lock()
	defer t.mu.Unlock()

	if t.connected.Load() {
		return nil
	}

	if t.ip == "" {
		return fmt.Errorf("ENIP transport: IP address not configured")
	}

	t.remoteAddr = fmt.Sprintf("%s:%d", t.ip, t.port)

	var lastErr error
	for attempt := 0; attempt <= t.maxRetries; attempt++ {
		if attempt > 0 {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(t.retryInterval * time.Duration(attempt)):
			}
			zap.L().Info("[ENIP] Retrying connection",
				zap.Int("attempt", attempt),
				zap.String("addr", t.remoteAddr),
			)
		}

		tcp, err := t.tcpFactory(t.ip, nil)
		if err != nil {
			lastErr = fmt.Errorf("failed to create ENIP client: %w", err)
			zap.L().Warn("[ENIP] Failed to create ENIP client",
				zap.Error(err),
				zap.String("addr", t.remoteAddr),
			)
			continue
		}

		connectCtx, cancel := context.WithTimeout(ctx, t.timeout)
		defer cancel()
		err = tcp.Connect()
		_ = connectCtx

		if err != nil {
			lastErr = fmt.Errorf("ENIP connection failed: %w", err)
			zap.L().Warn("[ENIP] Connection failed",
				zap.Error(err),
				zap.Int("attempt", attempt),
				zap.String("addr", t.remoteAddr),
			)
			continue
		}

		t.tcp = tcp
		t.connected.Store(true)
		t.connectTime = time.Now()
		t.reconnectCount.Add(1)
		t.localAddr = t.getLocalAddr()
		t.lastActivityTime.Store(time.Now())

		t.startHeartbeat()

		zap.L().Info("[ENIP] TCP connection established",
			zap.String("addr", t.remoteAddr),
			zap.Int("slot", t.slot),
			zap.Duration("timeout", t.timeout),
		)
		return nil
	}

	return fmt.Errorf("ENIP connection failed after %d retries: %w", t.maxRetries, lastErr)
}

func (t *ENIPTransport) Disconnect() error {
	t.mu.Lock()
	defer t.mu.Unlock()

	if !t.connected.Load() {
		return nil
	}

	t.stopHeartbeat <- struct{}{}

	if t.tcp != nil {
		t.tcp.Close()
	}

	t.connected.Store(false)
	t.lastDisconnectTime = time.Now()

	zap.L().Info("[ENIP] Disconnected")
	return nil
}

func (t *ENIPTransport) IsConnected() bool {
	return t.connected.Load()
}

func (t *ENIPTransport) GetClient() *ENIPClient {
	if !t.connected.Load() {
		return nil
	}
	return t.tcp
}

func (t *ENIPTransport) startHeartbeat() {
	t.heartbeatTicker = time.NewTicker(t.heartbeatInterval)

	go func() {
		for {
			select {
			case <-t.stopHeartbeat:
				t.heartbeatTicker.Stop()
				return
			case <-t.heartbeatTicker.C:
				if t.connected.Load() && t.tcp != nil {
					t.mu.Lock()
					_, err := t.tcp.ListIdentity()
					if err != nil {
						t.heartbeatFailCount.Add(1)
						if t.heartbeatFailCount.Load() >= t.heartbeatFailMax {
							go t.reconnect()
						}
					} else {
						t.heartbeatFailCount.Store(0)
						t.lastActivityTime.Store(time.Now())
					}
					t.mu.Unlock()
				}
			}
		}
	}()
}

func (t *ENIPTransport) reconnect() {
	t.mu.Lock()
	if !t.connected.Load() {
		t.mu.Unlock()
		return
	}

	if t.tcp != nil {
		t.tcp.Close()
	}
	t.mu.Unlock()

	ctx, cancel := context.WithTimeout(context.Background(), t.timeout)
	defer cancel()

	for i := 0; i < t.maxRetries; i++ {
		if err := t.Connect(ctx); err == nil {
			return
		}
		time.Sleep(t.retryInterval * time.Duration(i+1))
	}
}

func (t *ENIPTransport) GetConnectionMetrics() (
	connectionSeconds int64,
	reconnectCount int64,
	localAddr string,
	remoteAddr string,
	lastDisconnectTime time.Time,
) {
	t.mu.Lock()
	defer t.mu.Unlock()

	if t.connectTime.IsZero() {
		return 0, 0, "", "", time.Time{}
	}

	connectionSeconds = int64(time.Since(t.connectTime).Seconds())
	reconnectCount = int64(t.reconnectCount.Load())
	localAddr = t.localAddr
	remoteAddr = t.remoteAddr
	lastDisconnectTime = t.lastDisconnectTime

	return
}

// GetRemoteAddr 返回远程地址
func (t *ENIPTransport) GetRemoteAddr() string {
	t.mu.Lock()
	defer t.mu.Unlock()
	return t.remoteAddr
}

func (t *ENIPTransport) getLocalAddr() string {
	if t.tcp == nil {
		return ""
	}

	// Try to get local address through reflection
	// The underlying TCP connection may be stored in an unexported field
	val := reflect.ValueOf(t.tcp).Elem()

	// Look for common connection field names
	fieldNames := []string{"conn", "connection", "tcp", "client", "netConn"}
	for _, name := range fieldNames {
		field := val.FieldByName(name)
		if field.IsValid() && !field.IsNil() {
			// Check if it implements net.Conn
			connIface := field.Interface()
			if conn, ok := connIface.(net.Conn); ok {
				return conn.LocalAddr().String()
			}
			// Try to find net.Conn in nested structure
			nestedVal := reflect.ValueOf(connIface)
			if nestedVal.Kind() == reflect.Ptr {
				nestedVal = nestedVal.Elem()
			}
			if nestedVal.Kind() == reflect.Struct {
				for i := 0; i < nestedVal.NumField(); i++ {
					nestedField := nestedVal.Field(i)
					if nestedField.CanInterface() {
						if nestedConn, ok := nestedField.Interface().(net.Conn); ok {
							return nestedConn.LocalAddr().String()
						}
					}
				}
			}
		}
	}

	// Fallback: return a reasonable default
	return fmt.Sprintf("127.0.0.1:%d", t.port)
}

type MockENIPClient struct {
	connectFunc    func() error
	disconnectFunc func() error
	readFunc       func(tag string) ([]byte, error)
	writeFunc      func(tag string, data []byte) error
	pingFunc       func() error
}

func (m *MockENIPClient) Connect() error {
	if m.connectFunc != nil {
		return m.connectFunc()
	}
	return nil
}

func (m *MockENIPClient) Disconnect() error {
	if m.disconnectFunc != nil {
		return m.disconnectFunc()
	}
	return nil
}

func (m *MockENIPClient) Ping() error {
	if m.pingFunc != nil {
		return m.pingFunc()
	}
	return nil
}
