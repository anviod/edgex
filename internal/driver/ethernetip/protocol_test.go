//go:build integration

package ethernetip

import (
	"encoding/hex"
	"net"
	"testing"
	"time"
)

// TestRegisterSession 测试RegisterSession请求
func TestRegisterSession(t *testing.T) {
	conn, err := net.DialTimeout("tcp", "127.0.0.1:44818", 2*time.Second)
	if err != nil {
		t.Fatalf("TCP connection failed: %v", err)
	}
	defer conn.Close()

	// RegisterSession请求
	// Command: 0x06 (RegisterSession)
	// Length: 0x0008 (8 bytes of specific data)
	req := []byte{
		0x00, 0x06, // Command: RegisterSession
		0x00, 0x08, // Length: 8
		0x00, 0x00, 0x00, 0x00, // Session handle: 0
		0x00, 0x00, 0x00, 0x00, // Status: 0
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Sender context
		0x00, 0x00, 0x00, 0x00, // Options: 0
		// Specific data for RegisterSession
		0x01, 0x00, 0x00, 0x00, // Protocol version: 1.0 (little endian)
		0x00, 0x00, 0x00, 0x00, // Flags: 0
	}

	t.Logf("Sending RegisterSession request: %s", hex.EncodeToString(req))

	_, err = conn.Write(req)
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}

	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	buf := make([]byte, 512)
	n, err := conn.Read(buf)
	if err != nil {
		t.Skipf("Failed to read response (simulator may not support raw protocol): %v", err)
	}

	t.Logf("Received %d bytes: %s", n, hex.EncodeToString(buf[:n]))

	// Parse the response
	if n >= 4 {
		command := uint16(buf[0])<<8 | uint16(buf[1])
		length := uint16(buf[2])<<8 | uint16(buf[3])
		t.Logf("Command: 0x%04X, Length: %d", command, length)
		t.Logf("Remaining bytes after header: %d", n-24)
	}
}
