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
		t.Fatalf("TCP connection failed: %v", err)
	}
	defer conn.Close()

	t.Log("TCP connection established")

	// 发送简单的测试数据
	// EtherNet/IP TCP header: 6 bytes (command + length)
	// ListIdentity request
	req := []byte{
		0x00, 0x0C, // Command: ListIdentity (12)
		0x00, 0x00, // Length: 0
		0x00, 0x00, 0x00, 0x00, // Session handle
		0x00, 0x00, 0x00, 0x00, // Status
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Sender context
		0x00, 0x00, 0x00, 0x00, // Options
	}

	_, err = conn.Write(req)
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}

	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	buf := make([]byte, 1024)
	n, err := conn.Read(buf)
	if err != nil {
		t.Fatalf("Failed to read response: %v", err)
	}

	t.Logf("Received %d bytes: %x", n, buf[:n])
}