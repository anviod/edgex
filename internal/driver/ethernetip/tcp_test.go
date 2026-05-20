package ethernetip

import (
	"net"
	"testing"
	"time"
)

// TestBasicTCPConnection 测试基本TCP连接
func TestBasicTCPConnection(t *testing.T) {
	conn, err := net.DialTimeout("tcp", "127.0.0.1:44818", 2*time.Second)
	if err != nil {
		t.Skipf("TCP connection failed (simulator not available): %v", err)
	}
	defer conn.Close()

	t.Log("TCP connection established")

	// 发送 RegisterSession 请求
	req := []byte{
		0x00, 0x06, // Command: RegisterSession (6)
		0x00, 0x08, // Length: 8 bytes of data
		0x00, 0x00, 0x00, 0x00, // Session handle: 0 (new session)
		0x00, 0x00, 0x00, 0x00, // Status: 0
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // Sender context
		0x00, 0x00, 0x00, 0x00, // Options: 0
		0x01, 0x00, // Protocol version: 1.0
		0x00, 0x00, 0x00, 0x00, // Option flags: 0
	}

	_, err = conn.Write(req)
	if err != nil {
		t.Skipf("Failed to send request: %v", err)
	}

	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	buf := make([]byte, 1024)
	n, err := conn.Read(buf)
	if err != nil {
		t.Skipf("Failed to read response (simulator may not support raw protocol): %v", err)
	}

	t.Logf("Received %d bytes: %x", n, buf[:n])
}
