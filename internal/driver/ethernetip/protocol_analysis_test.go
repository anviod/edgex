//go:build integration

package ethernetip

import (
	"encoding/hex"
	"net"
	"testing"
	"time"
)

// TestProtocolDebug 详细调试协议交互
func TestProtocolDebug(t *testing.T) {
	conn, err := net.DialTimeout("tcp", "127.0.0.1:44818", 2*time.Second)
	if err != nil {
		t.Fatalf("TCP connection failed: %v", err)
	}
	defer conn.Close()

	t.Log("✓ TCP connection established")

	// RegisterSession请求
	registerReq := []byte{
		0x00, 0x06, // Command: RegisterSession (6)
		0x00, 0x08, // Length: 8 bytes of specific data
		0x00, 0x00, 0x00, 0x00, // Session handle: 0
		0x00, 0x00, 0x00, 0x00, // Status: 0
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // Sender context
		0x00, 0x00, 0x00, 0x00, // Options: 0
		0x01, 0x00, // Protocol version: 1.0 (little endian)
		0x00, 0x00, 0x00, 0x00, // Flags: 0
	}

	t.Logf("Sending RegisterSession: %s", hex.EncodeToString(registerReq))
	_, err = conn.Write(registerReq)
	if err != nil {
		t.Fatalf("Failed to send RegisterSession: %v", err)
	}

	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	buf := make([]byte, 1024)
	n, err := conn.Read(buf)
	if err != nil {
		t.Skipf("Failed to read RegisterSession response (simulator may not support raw protocol): %v", err)
	}

	t.Logf("RegisterSession response (%d bytes): %s", n, hex.EncodeToString(buf[:n]))

	// 解析Session handle
	if n >= 8 {
		sessionHandle := buf[4:8]
		t.Logf("Session Handle: %s", hex.EncodeToString(sessionHandle))
	}

	// SendRRData - Read Tag请求
	// 构建Tag读取请求
	sendRRDataReq := []byte{
		0x00, 0x0F, // Command: SendRRData (15)
		0x00, 0x3A, // Length: 58 bytes
		0x00, 0x00, 0x00, 0x00, // Session handle (from response)
		0x00, 0x00, 0x00, 0x00, // Status
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // Sender context
		0x00, 0x00, 0x00, 0x00, // Options
		0x00, 0x00, 0x00, 0x01, // Interface handle
		0x00, 0x00, // Timeout
		0x00, 0x01, // Item count
		// Item 1: CIP Message Router Request
		0x00, 0x30, // Item length: 48 bytes
		0x00, 0x00, // Type ID: Connected
		// Message Router Request
		0x4C, // Service: Read Tag (0x4C)
		0x0C, // Path length: 12 bytes
		// Path segments
		0x20, 0x06, // Symbolic object
		0x00, 0x00, // Instance
		0x00, 0x19, // Length of symbol name (25 bytes)
		// Symbol name: "Global.BoolTag" (16 bytes)
		0x47, 0x6C, 0x6F, 0x62, 0x61, 0x6C, 0x2E, 0x42,
		0x6F, 0x6F, 0x6C, 0x54, 0x61, 0x67, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x00,
	}

	// 使用实际的session handle
	copy(sendRRDataReq[4:8], buf[4:8])

	t.Logf("Sending Read Tag request: %s", hex.EncodeToString(sendRRDataReq))
	_, err = conn.Write(sendRRDataReq)
	if err != nil {
		t.Fatalf("Failed to send Read Tag request: %v", err)
	}

	n, err = conn.Read(buf)
	if err != nil {
		t.Fatalf("Failed to read Read Tag response: %v", err)
	}

	t.Logf("Read Tag response (%d bytes): %s", n, hex.EncodeToString(buf[:n]))

	// 解析响应
	if n >= 4 {
		command := uint16(buf[0])<<8 | uint16(buf[1])
		length := uint16(buf[2])<<8 | uint16(buf[3])
		t.Logf("Command: 0x%04X, Length: %d", command, length)

		// 检查CIP响应
		if n > 24 {
			t.Logf("Specific data (%d bytes): %s", n-24, hex.EncodeToString(buf[24:n]))
		}
	}
}
