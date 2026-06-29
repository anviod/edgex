//go:build integration

package ice104

import (
	"encoding/binary"
	"encoding/hex"
	"io"
	"net"
	"testing"
	"time"
)

func sendSAck(conn net.Conn, recvSeq uint16) {
	ctrl := make([]byte, 4)
	ctrl[0], ctrl[1] = 0x01, 0x00
	binary.LittleEndian.PutUint16(ctrl[2:4], recvSeq<<1)
	frame := append([]byte{0x68, 0x04}, ctrl...)
	_, _ = conn.Write(frame)
}

func TestLiveRawFramesAfterStartDT(t *testing.T) {
	if !simulatorAvailable(t) {
		return
	}
	conn, err := net.DialTimeout("tcp", "127.0.0.1:2404", 2*time.Second)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()
	writeU := func(b byte) {
		_, _ = conn.Write([]byte{0x68, 0x04, b, 0, 0, 0})
	}
	readU := func(want byte) {
		buf := make([]byte, 6)
		if _, err := io.ReadFull(conn, buf); err != nil {
			t.Fatalf("readU: %v", err)
		}
		if buf[2] != want {
			t.Fatalf("want 0x%02x got %s", want, hex.EncodeToString(buf))
		}
	}
	writeU(uTestFRAct)
	readU(uTestFRCon)
	writeU(uStartDTAct)
	readU(uStartDTCon)
	var recv uint16
	readFrame := func(label string) bool {
		_ = conn.SetReadDeadline(time.Now().Add(3 * time.Second))
		hdr := make([]byte, 2)
		if _, err := io.ReadFull(conn, hdr); err != nil {
			t.Logf("%s read err: %v", label, err)
			return false
		}
		body := make([]byte, int(hdr[1]))
		if _, err := io.ReadFull(conn, body); err != nil {
			t.Fatal(err)
		}
		t.Logf("%s apdu=%s", label, hex.EncodeToString(body))
		if len(body) >= 4 && body[0]&0x01 == 0 && body[0]&0x03 == 0 {
			ns := binary.LittleEndian.Uint16(body[0:2]) >> 1
			recv = ns + 1
			sendSAck(conn, recv)
			t.Logf("sent S ack recv=%d", recv)
		}
		return true
	}
	readFrame("spont")
	_ = conn.SetReadDeadline(time.Time{})
	giASDU := buildASDU(typeC_IC_NA_1, 1, cotActivation, 1, encodeGeneralInterrogation(0))
	ctrl := []byte{0x02, 0x00, byte(recv << 1), 0x00}
	if recv > 0x7F {
		ctrl[2] = byte((recv << 1) & 0xff)
		ctrl[3] = byte(recv >> 7)
	}
	frame := append([]byte{0x68, byte(4 + len(giASDU))}, append(ctrl, giASDU...)...)
	t.Logf("send GI %s", hex.EncodeToString(frame))
	if _, err := conn.Write(frame); err != nil {
		t.Fatal(err)
	}
	for i := 0; i < 20; i++ {
		if !readFrame("post-GI") {
			break
		}
	}
}
