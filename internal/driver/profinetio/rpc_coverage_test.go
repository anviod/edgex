package profinetio

import (
	"encoding/binary"
	"io"
	"net"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCoverage_RPCClientReadWrite(t *testing.T) {
	clientConn, serverConn := net.Pipe()
	defer clientConn.Close()

	go func() {
		defer serverConn.Close()
		for i := 0; i < 2; i++ {
			header := make([]byte, 8)
			if _, err := io.ReadFull(serverConn, header); err != nil {
				return
			}
			payloadLen := binary.BigEndian.Uint32(header[4:8])
			payload := make([]byte, payloadLen)
			if _, err := io.ReadFull(serverConn, payload); err != nil {
				return
			}
			respHeader := make([]byte, 8)
			binary.BigEndian.PutUint32(respHeader[0:4], 0)
			binary.BigEndian.PutUint32(respHeader[4:8], 4)
			respPayload := []byte{0x01, 0x02, 0x03, 0x04}
			_, _ = serverConn.Write(append(respHeader, respPayload...))
		}
	}()

	cli := newRPCClient(clientConn, time.Second)
	data, err := cli.ReadIO(1, 1, 0, 4)
	require.NoError(t, err)
	assert.Equal(t, []byte{0x01, 0x02, 0x03, 0x04}, data)

	require.NoError(t, cli.WriteIO(1, 1, 0, []byte{0xAA}))
	require.NoError(t, cli.close())
}

func TestCoverage_RPCBuildRequests(t *testing.T) {
	read := buildReadRequest(7, 1, 2, 3, 8)
	require.NotEmpty(t, read)
	assert.Equal(t, byte(0x01), read[len(read)-4])

	write := buildWriteRequest(8, 1, 2, 0, []byte{0xFF})
	require.NotEmpty(t, write)
	assert.Equal(t, byte(0x02), write[20])
}

func TestCoverage_RPCClientValidation(t *testing.T) {
	cli := &rpcClient{}
	_, err := cli.ReadIO(1, 1, 0, 4)
	require.Error(t, err)
	require.Error(t, cli.WriteIO(1, 1, 0, nil))
	require.NoError(t, cli.close())
}
