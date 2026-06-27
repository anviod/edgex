package dlt645

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEncodeMeterAddress(t *testing.T) {
	addr, err := EncodeMeterAddress("210220003011")
	require.NoError(t, err)
	assert.Equal(t, []byte{0x11, 0x30, 0x00, 0x20, 0x02, 0x21}, addr[:])

	back := MeterAddressString(addr)
	assert.Equal(t, "210220003011", back)
}

func TestParseDataID(t *testing.T) {
	di, err := ParseDataID("02-01-01-00")
	require.NoError(t, err)
	assert.Equal(t, [4]byte{0x00, 0x01, 0x01, 0x02}, di)
	assert.Equal(t, "02-01-01-00", DataIDString(di))
}

func TestBuildReadFrame(t *testing.T) {
	addr, err := EncodeMeterAddress("210220003011")
	require.NoError(t, err)
	di, err := ParseDataID("02-01-01-00")
	require.NoError(t, err)

	frame := BuildReadFrame(addr, di)
	require.GreaterOrEqual(t, len(frame), 12)
	assert.Equal(t, byte(FrameStart), frame[0])
	assert.Equal(t, byte(FrameStart), frame[7])
	assert.Equal(t, byte(CtrlRead), frame[8])
	assert.Equal(t, byte(DataIDLen), frame[9])
	assert.Equal(t, byte(FrameEnd), frame[len(frame)-1])

	cs := checksum(frame[:len(frame)-2])
	assert.Equal(t, cs, frame[len(frame)-2])
}

func TestDecodeFrameRoundTrip(t *testing.T) {
	addr, _ := EncodeMeterAddress("123456789012")
	di, _ := ParseDataID("00-00-00-00")

	req := BuildReadFrame(addr, di)
	parsed, err := DecodeFrame(req)
	require.NoError(t, err)
	assert.Equal(t, addr, parsed.MeterAddr)
	assert.Equal(t, byte(CtrlRead), parsed.Control)
	assert.Equal(t, di, [4]byte(parsed.Data))
}

func TestDecodeFrameResponse(t *testing.T) {
	addr, _ := EncodeMeterAddress("210220003011")
	di, _ := ParseDataID("02-01-01-00")

	// Simulated voltage response: 220.0V -> BCD 0x20 0x02
	value := []byte{0x20, 0x02}
	body := append(di[:], value...)
	data := encode033(body)

	frame := buildFrame(addr, CtrlReadResp, data)
	parsed, err := DecodeFrame(frame)
	require.NoError(t, err)

	gotDI, gotVal, err := ParseReadResponse(parsed)
	require.NoError(t, err)
	assert.Equal(t, di, gotDI)
	assert.Equal(t, value, gotVal)
}

func TestDecodeValueVoltage(t *testing.T) {
	raw := []byte{0x20, 0x02}
	val, err := DecodeValue(raw, "UINT16", 0, 0)
	require.NoError(t, err)
	assert.Equal(t, int64(220), val)
}

func TestParseAddress(t *testing.T) {
	dec := NewDLT645Decoder()
	parsed, err := dec.ParseAddress("210220003011#02-01-01-00")
	require.NoError(t, err)
	assert.Equal(t, "02-01-01-00", DataIDString(parsed.DataID))

	dec.SetDefaultMeterAddress("210220003011")
	parsed, err = dec.ParseAddress("02-02-01-00")
	require.NoError(t, err)
	assert.Equal(t, "02-02-01-00", DataIDString(parsed.DataID))
}

func TestChecksumValidation(t *testing.T) {
	addr, _ := EncodeMeterAddress("210220003011")
	di, _ := ParseDataID("02-01-01-00")
	frame := BuildReadFrame(addr, di)

	bad := append([]byte(nil), frame...)
	bad[len(bad)-2] ^= 0xFF

	_, err := DecodeFrame(bad)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "checksum")
}

func TestEncode033Decode033(t *testing.T) {
	in := []byte{0x00, 0x01, 0x02, 0x03}
	enc := encode033(in)
	dec := decode033(enc)
	assert.Equal(t, in, dec)
}

func TestParseTransportConfig(t *testing.T) {
	tcpCfg := parseTransportConfig(map[string]any{
		"connectionType": "tcp",
		"ip":             "192.168.1.10",
		"port":           float64(8001),
		"timeout":        float64(3000),
	})
	assert.Equal(t, connTCP, tcpCfg.mode)
	assert.Equal(t, "192.168.1.10:8001", tcpCfg.remoteAddr())

	serialCfg := parseTransportConfig(map[string]any{
		"connectionType": "serial",
		"port":           "/dev/ttyS1",
		"baudRate":       float64(2400),
	})
	assert.Equal(t, connSerial, serialCfg.mode)
	assert.Equal(t, "/dev/ttyS1", serialCfg.remoteAddr())
	assert.Equal(t, 2400, serialCfg.baudRate)
}
