package ethernetip

import (
	"encoding/hex"
	"net"
	"testing"
	"time"
)

// TestDebugReadError 调试读取错误
func TestDebugReadError(t *testing.T) {
	conn, err := net.DialTimeout("tcp", "127.0.0.1:44818", 2*time.Second)
	if err != nil {
		t.Fatalf("TCP connection failed: %v", err)
	}
	defer conn.Close()

	t.Log("TCP connection established")

	// RegisterSession
	registerReq := []byte{
		0x00, 0x06, // Command: RegisterSession
		0x00, 0x08, // Length: 8
		0x00, 0x00, 0x00, 0x00, // Session handle
		0x00, 0x00, 0x00, 0x00, // Status
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Sender context
		0x00, 0x00, 0x00, 0x00, // Options
		0x00, 0x00, 0x00, 0x00, // Protocol version
		0x00, 0x00, 0x00, 0x01, // Flags
	}

	_, err = conn.Write(registerReq)
	if err != nil {
		t.Fatalf("Failed to send register request: %v", err)
	}

	conn.SetReadDeadline(time.Now().Add(2 * time.Second))
	buf := make([]byte, 512)
	n, err := conn.Read(buf)
	if err != nil {
		t.Fatalf("Failed to read register response: %v", err)
	}

	t.Logf("Register response (%d bytes): %s", n, hex.EncodeToString(buf[:n]))

	// SendRRData for Tag Read
	sendRRDataReq := []byte{
		0x00, 0x0F, // Command: SendRRData
		0x00, 0x2F, // Length: 47
		0x00, 0x00, 0x00, 0x00, // Session handle (from response)
		0x00, 0x00, 0x00, 0x00, // Status
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Sender context
		0x00, 0x00, 0x00, 0x00, // Options
		// Interface Handle
		0x00, 0x00, 0x00, 0x01,
		// Timeout
		0x00, 0x00,
		// Item Count
		0x00, 0x01,
		// Item 1: CIP Read Tag Service
		0x00, 0x24, // Length
		0x00, 0x00, // Type ID: Connected
		// CIP Message Router Request
		0x01, // Service: Get Attribute Single
		0x00, // Path size
		// Tag path: Program:MainProgram.BoolTag
		0x20, 0x06, // Symbolic object
		0x00, 0x00, // Instance
		0x00, 0x00, // Length
	}

	_, err = conn.Write(sendRRDataReq)
	if err != nil {
		t.Fatalf("Failed to send read request: %v", err)
	}

	n, err = conn.Read(buf)
	if err != nil {
		t.Fatalf("Failed to read response: %v", err)
	}

	t.Logf("Read response (%d bytes): %s", n, hex.EncodeToString(buf[:n]))
}