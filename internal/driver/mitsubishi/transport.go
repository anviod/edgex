package mitsubishi

import (
	"context"
	"encoding/binary"
	"fmt"
	"io"
	"net"
	"sync"
	"sync/atomic"
	"time"

	"go.uber.org/zap"
)

type MCTransport struct {
	cfg driverConfig

	mu                 sync.Mutex
	conn               net.Conn
	connected          atomic.Bool
	connectTime        time.Time
	lastDisconnectTime time.Time
	reconnectCount     atomic.Int32
	localAddr          string
	remoteAddr         string

	frameCfg frameConfig

	dialFn func(network, address string, timeout time.Duration) (net.Conn, error)
}

func NewMCTransport(cfg driverConfig) *MCTransport {
	t := &MCTransport{
		cfg: cfg,
		frameCfg: frameConfig{
			networkNo: cfg.networkNo,
			pcNo:      cfg.pcNo,
			stationNo: cfg.stationNo,
		},
		remoteAddr: fmt.Sprintf("%s:%d", cfg.ip, cfg.port),
		dialFn: func(network, address string, timeout time.Duration) (net.Conn, error) {
			return net.DialTimeout(network, address, timeout)
		},
	}
	return t
}

func (t *MCTransport) Connect(ctx context.Context) error {
	t.mu.Lock()
	defer t.mu.Unlock()

	if t.connected.Load() {
		return nil
	}

	addr := t.remoteAddr
	var lastErr error

	for attempt := 0; attempt <= t.cfg.maxRetries; attempt++ {
		if attempt > 0 {
			wait := time.Duration(attempt) * 100 * time.Millisecond
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(wait):
			}
		}

		conn, err := t.dialFn("tcp", addr, t.cfg.timeout)
		if err != nil {
			lastErr = err
			zap.L().Warn("[Mitsubishi] connection failed",
				zap.Error(err),
				zap.Int("attempt", attempt),
				zap.String("addr", addr),
			)
			continue
		}

		if t.conn != nil {
			_ = t.conn.Close()
		}

		t.conn = conn
		t.connected.Store(true)
		t.connectTime = time.Now()
		t.reconnectCount.Add(1)
		t.localAddr = conn.LocalAddr().String()

		zap.L().Info("[Mitsubishi] TCP connected",
			zap.String("addr", addr),
			zap.Duration("timeout", t.cfg.timeout),
		)
		return nil
	}

	return fmt.Errorf("mitsubishi connect failed: %w", lastErr)
}

func (t *MCTransport) Disconnect() error {
	t.mu.Lock()
	defer t.mu.Unlock()

	if t.conn != nil {
		_ = t.conn.Close()
		t.conn = nil
	}
	if t.connected.Load() {
		t.lastDisconnectTime = time.Now()
	}
	t.connected.Store(false)
	return nil
}

func (t *MCTransport) IsConnected() bool {
	return t.connected.Load()
}

func (t *MCTransport) GetConnectionMetrics() (connectionSeconds int64, reconnectCount int64, localAddr string, remoteAddr string, lastDisconnectTime time.Time) {
	reconnectCount = int64(t.reconnectCount.Load())
	lastDisconnectTime = t.lastDisconnectTime
	remoteAddr = t.remoteAddr

	if !t.connected.Load() {
		return 0, reconnectCount, t.localAddr, remoteAddr, lastDisconnectTime
	}

	if !t.connectTime.IsZero() {
		connectionSeconds = int64(time.Since(t.connectTime).Seconds())
	}
	return connectionSeconds, reconnectCount, t.localAddr, remoteAddr, lastDisconnectTime
}

func (t *MCTransport) ReadRaw(addr *MCAddress, byteLen int, isBit bool) ([]byte, error) {
	frame := buildReadFrame(t.frameCfg, addr, byteLen, isBit)
	resp, err := t.transact(frame)
	if err != nil {
		return nil, err
	}
	_, data, err := parseResponse(resp)
	return data, err
}

func (t *MCTransport) WriteRaw(addr *MCAddress, data []byte, isBit bool) error {
	frame := buildWriteFrame(t.frameCfg, addr, data, isBit)
	resp, err := t.transact(frame)
	if err != nil {
		return err
	}
	_, _, err = parseResponse(resp)
	return err
}

func (t *MCTransport) transact(frame []byte) ([]byte, error) {
	t.mu.Lock()
	defer t.mu.Unlock()

	if !t.connected.Load() || t.conn == nil {
		return nil, fmt.Errorf("mitsubishi not connected")
	}

	_ = t.conn.SetDeadline(time.Now().Add(t.cfg.timeout))

	if _, err := t.conn.Write(frame); err != nil {
		t.markDisconnected()
		return nil, fmt.Errorf("mitsubishi write failed: %w", err)
	}

	buf := make([]byte, 4096)
	n, err := io.ReadAtLeast(t.conn, buf, 11)
	if err != nil {
		t.markDisconnected()
		return nil, fmt.Errorf("mitsubishi read failed: %w", err)
	}

	for n < len(buf) {
		_ = t.conn.SetDeadline(time.Now().Add(100 * time.Millisecond))
		m, err := t.conn.Read(buf[n:])
		if m > 0 {
			n += m
		}
		if err != nil {
			break
		}
		if n >= 11 {
			dataLen := int(binary.LittleEndian.Uint16(buf[7:9]))
			if n >= 9+dataLen {
				break
			}
		}
	}

	return append([]byte(nil), buf[:n]...), nil
}

func (t *MCTransport) markDisconnected() {
	if t.conn != nil {
		_ = t.conn.Close()
		t.conn = nil
	}
	if t.connected.Load() {
		t.lastDisconnectTime = time.Now()
	}
	t.connected.Store(false)
}
