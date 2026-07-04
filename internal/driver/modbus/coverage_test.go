package modbus

import (
	"context"
	"encoding/binary"
	"math"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockModbusTransport struct {
	connected bool
	unitID    uint8
	registers map[uint16]uint16
	coil      map[uint16]bool
}

func newMockModbusTransport() *mockModbusTransport {
	return &mockModbusTransport{
		registers: make(map[uint16]uint16),
		coil:      make(map[uint16]bool),
	}
}

func (m *mockModbusTransport) Connect(ctx context.Context) error {
	m.connected = true
	return nil
}

func (m *mockModbusTransport) Disconnect() error {
	m.connected = false
	return nil
}

func (m *mockModbusTransport) IsConnected() bool { return m.connected }

func (m *mockModbusTransport) ReadRegisters(_ context.Context, regType string, offset uint16, count uint16) ([]byte, error) {
	buf := make([]byte, count*2)
	for i := uint16(0); i < count; i++ {
		val := m.registers[offset+i]
		binary.BigEndian.PutUint16(buf[i*2:], val)
	}
	_ = regType
	return buf, nil
}

func (m *mockModbusTransport) ReadCoil(_ context.Context, offset uint16) (bool, error) {
	return m.coil[offset], nil
}

func (m *mockModbusTransport) ReadDiscreteInput(_ context.Context, offset uint16) (bool, error) {
	return m.coil[offset], nil
}

func (m *mockModbusTransport) ReadCustom(_ context.Context, _ byte, offset uint16, count uint16) ([]byte, error) {
	return m.ReadRegisters(context.Background(), "holding", offset, count)
}

func (m *mockModbusTransport) WriteRegister(_ context.Context, offset uint16, value uint16) error {
	m.registers[offset] = value
	return nil
}

func (m *mockModbusTransport) WriteRegisters(_ context.Context, offset uint16, values []uint16) error {
	for i, v := range values {
		m.registers[offset+uint16(i)] = v
	}
	return nil
}

func (m *mockModbusTransport) WriteCoil(_ context.Context, offset uint16, value bool) error {
	m.coil[offset] = value
	return nil
}

func (m *mockModbusTransport) SetUnitID(id uint8) { m.unitID = id }

func (m *mockModbusTransport) GetConnectionMetrics() (int64, int64, string, string, time.Time) {
	if m.connected {
		return 10, 1, "127.0.0.1:5020", "127.0.0.1:502", time.Time{}
	}
	return 0, 0, "", "", time.Time{}
}

func TestCoverage_DriverLifecycle(t *testing.T) {
	d := NewModbusDriver().(*ModbusDriver)
	cfg := model.DriverConfig{
		ChannelID: "ch-modbus",
		Protocol:  "modbus-tcp",
		Config: map[string]any{
			"url":        "127.0.0.1:502",
			"slave_id":   1,
			"byteOrder":  "ABCD",
			"batchSize":  10,
			"timeout":    500,
			"max_retries": 2,
		},
	}
	require.NoError(t, d.Init(cfg))
	assert.Equal(t, driver.HealthStatusUnknown, d.Health())

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()
	_ = d.Connect(ctx)
	_ = d.Disconnect()

	assert.NoError(t, d.SetSlaveID(2))
	assert.NoError(t, d.SetDeviceConfig(map[string]any{
		"slave_id":      3,
		"batchSize":     20,
		"max_gap":       5,
		"group_threshold": 8,
	}))

	metrics := d.GetMetrics()
	assert.Equal(t, "Modbus", metrics.Protocol)
	assert.NotNil(t, d.GetConnectionController())
}

func TestCoverage_SchedulerReadWriteWithMock(t *testing.T) {
	mock := newMockModbusTransport()
	mock.connected = true
	mock.registers[0] = 1234
	mock.registers[1] = 5678

	decoder := NewPointDecoder("ABCD", 0, 0)
	scheduler := NewPointScheduler(mock, decoder, 125, 50, 0)
	scheduler.SetSlaveID(1)

	points := []model.Point{
		{ID: "p1", Address: "40001", DataType: "int16", RegisterType: model.RegHolding},
		{ID: "p2", Address: "40002", DataType: "uint16", RegisterType: model.RegHolding},
	}

	results, err := scheduler.Read(context.Background(), points)
	require.NoError(t, err)
	assert.Equal(t, "Good", results["p1"].Quality)
	assert.Equal(t, int16(1234), results["p1"].Value)
	assert.Equal(t, "Good", results["p2"].Quality)

	pt := model.Point{ID: "w1", Address: "40001", DataType: "int16", RegisterType: model.RegHolding}
	require.NoError(t, scheduler.Write(context.Background(), pt, int16(999)))
	assert.Equal(t, uint16(999), mock.registers[0])

	assert.Equal(t, decoder, scheduler.GetDecoder())
	assert.Equal(t, uint8(1), scheduler.GetSlaveID())
}

func TestCoverage_DecoderRawAndScale(t *testing.T) {
	dec := NewPointDecoder("ABCD", 0, 0)

	point := model.Point{DataType: "int16"}
	val, quality, err := dec.Decode(point, []byte{0x04, 0xD2})
	require.NoError(t, err)
	assert.Equal(t, "Good", quality)
	assert.Equal(t, int16(1234), val)

	scaled := model.Point{DataType: "int16", Scale: 0.1, Offset: 5}
	val, quality, err = dec.Decode(scaled, []byte{0x03, 0xE8})
	require.NoError(t, err)
	assert.Equal(t, "Good", quality)
	assert.InDelta(t, 105.0, val, 0.001)

	f32Point := model.Point{DataType: "float32"}
	bits := math.Float32bits(3.14)
	raw := make([]byte, 4)
	binary.BigEndian.PutUint32(raw, bits)
	val, quality, err = dec.Decode(f32Point, raw)
	require.NoError(t, err)
	assert.Equal(t, "Good", quality)
	assert.InDelta(t, 3.14, val, 0.001)

	for _, order := range []string{"ABCD", "CDAB", "BADC", "DCBA"} {
		d := NewPointDecoder(order, 0, 0)
		out := d.applyByteOrder([]byte{0x01, 0x02, 0x03, 0x04})
		assert.Len(t, out, 4)
	}
}

func TestCoverage_ParseAddressRanges(t *testing.T) {
	dec := NewPointDecoder("ABCD", 0, 0)

	cases := []struct {
		addr     string
		regType  model.RegisterType
		offset   uint16
	}{
		{"40001", model.RegHolding, 0},
		{"30001", model.RegInput, 0},
		{"10001", model.RegDiscreteInput, 0},
		{"1001", model.RegCoil, 1000},
		{"0-1", model.RegHolding, 0},
	}
	for _, tc := range cases {
		regType, offset, err := dec.ParseAddress(tc.addr)
		require.NoError(t, err, tc.addr)
		assert.Equal(t, tc.regType, regType, tc.addr)
		assert.Equal(t, tc.offset, offset, tc.addr)
	}

	_, _, err := dec.ParseAddress("not-a-number")
	require.Error(t, err)
}

func TestCoverage_RTTModel(t *testing.T) {
	m := NewRTTModel()
	assert.Equal(t, 40, m.BestBatchSize())

	m.Record(10, 50*time.Millisecond)
	m.Record(10, 70*time.Millisecond)
	m.Record(20, 80*time.Millisecond)
	m.Record(20, 90*time.Millisecond)

	best := m.BestBatchSize()
	assert.True(t, best == 10 || best == 20)
}

func TestCoverage_DeviceStateMachine(t *testing.T) {
	sm := NewDeviceStateMachine()
	assert.Equal(t, StateOnline, sm.GetState())

	sm.OnFailure()
	sm.OnFailure()
	sm.OnFailure()
	assert.Equal(t, StateDegraded, sm.GetState())

	sm.OnFailure()
	sm.OnFailure()
	sm.OnFailure()
	assert.Equal(t, StateOffline, sm.GetState())

	sm.OnSuccess()
	assert.Equal(t, StateOnline, sm.GetState())

	sm.SetProbing()
	assert.Equal(t, StateProbing, sm.GetState())
	sm.SetRunning()
	assert.Equal(t, StateOnline, sm.GetState())
}

func TestCoverage_TransportHelpers(t *testing.T) {
	cfg := model.DriverConfig{
		ChannelID: "ch1",
		Config: map[string]any{
			"url":            "127.0.0.1:502",
			"timeout":        1000,
			"max_retries":    5,
			"max_fail_count": 2,
			"collect_cycle":  5000,
		},
	}
	transport := NewModbusTransport(cfg)
	defer transport.connMgr.Close()

	transport.SetUnitID(7)
	transport.RecordFailure(assert.AnError)
	transport.RecordSuccess()
	assert.False(t, transport.NeedProbeCheck())

	transport.lastActivityTime.Store(time.Now().Add(-20 * time.Second))
	assert.True(t, transport.NeedProbeCheck())

	require.NoError(t, transport.Disconnect())
	assert.False(t, transport.IsConnected())

	connSec, recon, local, remote, _ := transport.GetConnectionMetrics()
	assert.Equal(t, int64(0), connSec)
	assert.Equal(t, int64(0), recon)
	assert.Empty(t, local)
	assert.Empty(t, remote)
}

func TestCoverage_ReadPointsEmpty(t *testing.T) {
	d := NewModbusDriver().(*ModbusDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "ch1",
		Config:    map[string]any{"url": "127.0.0.1:502"},
	}))

	results, err := d.ReadPoints(context.Background(), nil)
	require.NoError(t, err)
	assert.Empty(t, results)
}

func TestCoverage_QualityScore(t *testing.T) {
	d := NewModbusDriver().(*ModbusDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "ch1",
		Config:    map[string]any{"url": "127.0.0.1:502"},
	}))

	assert.Equal(t, 0, d.calculateQualityScore())

	d.transport.connected.Store(true)
	d.reconnectCount = 1
	d.scheduler.mu.Lock()
	d.scheduler.txTotal = 10
	d.scheduler.rxTotal = 10
	d.scheduler.mu.Unlock()

	score := d.calculateQualityScore()
	assert.Greater(t, score, 0)
}

func TestCoverage_DriverReadWriteWithMock(t *testing.T) {
	d := NewModbusDriver().(*ModbusDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "rw",
		Config:    map[string]any{"url": "127.0.0.1:502", "slave_id": 1},
	}))

	mock := newMockModbusTransport()
	mock.connected = true
	mock.registers[0] = 100
	d.transport.connected.Store(true)
	d.scheduler = NewPointScheduler(mock, NewPointDecoder("ABCD", 0, 0), 125, 50, 0)
	d.scheduler.SetSlaveID(1)

	ctx := context.Background()
	results, err := d.ReadPoints(ctx, []model.Point{
		{ID: "p1", Address: "40001", DataType: "int16", RegisterType: model.RegHolding},
	})
	require.NoError(t, err)
	assert.Equal(t, int16(100), results["p1"].Value)

	pt := model.Point{ID: "w1", Address: "40001", DataType: "int16", RegisterType: model.RegHolding}
	require.NoError(t, d.WritePoint(ctx, pt, int16(200)))
	assert.Equal(t, uint16(200), mock.registers[0])
}

func TestCoverage_DecoderEncodeAllTypes(t *testing.T) {
	dec := NewPointDecoder("ABCD", 0, 0)

	encodeCases := []struct {
		point model.Point
		value any
	}{
		{model.Point{DataType: "int16"}, int16(42)},
		{model.Point{DataType: "uint16"}, uint16(1000)},
		{model.Point{DataType: "int32"}, int32(123456)},
		{model.Point{DataType: "float32"}, float32(1.5)},
	}
	for _, tc := range encodeCases {
		regs, err := dec.Encode(tc.point, tc.value)
		require.NoError(t, err, tc.point.DataType)
		assert.NotEmpty(t, regs)
	}

	scaled := model.Point{DataType: "int16", Scale: 0.1, Offset: 5}
	regs, err := dec.Encode(scaled, float64(105.0))
	require.NoError(t, err)
	assert.NotEmpty(t, regs)
}

func TestCoverage_SetDeviceConfigPaths(t *testing.T) {
	d := NewModbusDriver().(*ModbusDriver)
	require.NoError(t, d.Init(model.DriverConfig{
		ChannelID: "cfg",
		Config:    map[string]any{"url": "127.0.0.1:502"},
	}))

	require.NoError(t, d.SetDeviceConfig(map[string]any{
		"slave_id":          5,
		"start_address":     10,
		"address_base":      1,
		"batchSize":         30,
		"max_gap":           4,
		"group_threshold":   6,
		"instructionInterval": 20,
	}))
	assert.Equal(t, uint8(5), d.slaveID)
}
