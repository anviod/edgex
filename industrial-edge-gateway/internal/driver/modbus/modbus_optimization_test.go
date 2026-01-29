package modbus

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"sync"
	"testing"
	"time"

	"github.com/simonvetter/modbus"
)

// TestGroupPoints 测试点位分组功能
func TestGroupPoints(t *testing.T) {
	// Initialize components
	decoder := NewPointDecoder("ABCD", 0)
	// mock transport can be nil for grouping test
	// maxPacketSize=125 registers, groupThreshold=50
	scheduler := NewPointScheduler(nil, decoder, 125, 50, 0)

	// 测试场景1：连续的点位应该分组
	points := []model.Point{
		{ID: "point1", Address: "40001", DataType: "int16"},
		{ID: "point2", Address: "40002", DataType: "int16"},
		{ID: "point3", Address: "40003", DataType: "int16"},
	}

	groups, err := scheduler.groupPoints(points)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(groups) != 1 {
		t.Errorf("Expected 1 group, got: %d", len(groups))
	}

	if len(groups) > 0 && groups[0].Count != 3 {
		t.Errorf("Expected group count 3, got: %d", groups[0].Count)
	}

	// 测试场景2：地址间隔大的点位应该分组
	points = []model.Point{
		{ID: "point1", Address: "40001", DataType: "int16"},
		{ID: "point2", Address: "40100", DataType: "int16"}, // 间隔99，超过阈值50
	}

	groups, err = scheduler.groupPoints(points)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(groups) != 2 {
		t.Errorf("Expected 2 groups due to large gap, got: %d", len(groups))
	}

	// 测试场景3：不同寄存器类型应该分组
	points = []model.Point{
		{ID: "point1", Address: "40001", DataType: "int16"}, // HOLDING_REGISTER
		{ID: "point2", Address: "30001", DataType: "int16"}, // INPUT_REGISTER
	}

	groups, err = scheduler.groupPoints(points)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(groups) != 2 {
		t.Errorf("Expected 2 groups for different types, got: %d", len(groups))
	}

	// 测试场景4：32位数据类型占用2个寄存器
	points = []model.Point{
		{ID: "point1", Address: "40001", DataType: "float32"}, // 占用2个寄存器
		{ID: "point2", Address: "40003", DataType: "int16"},   // 占用1个寄存器
	}

	groups, err = scheduler.groupPoints(points)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(groups) != 1 {
		t.Errorf("Expected 1 group, got: %d", len(groups))
	}

	// 总计应该是 3 个寄存器（2 + 1）
	if len(groups) > 0 && groups[0].Count != 3 {
		t.Errorf("Expected total count 3, got: %d", groups[0].Count)
	}
}

// TestRegisterCount 测试寄存器数量计算
func TestRegisterCount(t *testing.T) {
	decoder := NewPointDecoder("ABCD", 0)

	tests := []struct {
		dataType string
		expected uint16
	}{
		{"int16", 1},
		{"uint16", 1},
		{"int32", 2},
		{"uint32", 2},
		{"float32", 2},
		{"int64", 4},
		{"uint64", 4},
		{"float64", 4},
		{"boolean", 1},
	}

	for _, test := range tests {
		count := decoder.GetRegisterCount(test.dataType)
		if count != test.expected {
			t.Errorf("DataType %s: expected %d, got %d", test.dataType, test.expected, count)
		}
	}
}

// Integration Test Components

type TestHandler struct {
	holdings [65535]uint16
	mu       sync.Mutex
}

func (h *TestHandler) HandleCoils(req *modbus.CoilsRequest) (res []bool, err error) {
	return make([]bool, req.Quantity), nil
}

func (h *TestHandler) HandleDiscreteInputs(req *modbus.DiscreteInputsRequest) (res []bool, err error) {
	return make([]bool, req.Quantity), nil
}

func (h *TestHandler) HandleHoldingRegisters(req *modbus.HoldingRegistersRequest) (res []uint16, err error) {
	h.mu.Lock()
	defer h.mu.Unlock()

	// Validations
	if int(req.Addr)+int(req.Quantity) > len(h.holdings) {
		return nil, modbus.ErrIllegalDataAddress
	}

	if req.IsWrite {
		copy(h.holdings[req.Addr:], req.Args)
		return req.Args, nil
	}

	// Return slice copy
	res = make([]uint16, req.Quantity)
	copy(res, h.holdings[req.Addr:req.Addr+req.Quantity])
	return res, nil
}

func (h *TestHandler) HandleInputRegisters(req *modbus.InputRegistersRequest) (res []uint16, err error) {
	return make([]uint16, req.Quantity), nil
}

// TestModbusOptimization Integration test for optimization
func TestModbusOptimization(t *testing.T) {
	handler := &TestHandler{}

	// Pre-populate data
	// Set 40001 (offset 0) = 123
	handler.holdings[0] = 123

	// Set 40002 (offset 1) = 456
	handler.holdings[1] = 456

	// Set 40003-40004 (offset 2-3) = float32(123.456)
	// 123.456 = 0x42F6E979
	// ABCD order: 0x42F6, 0xE979
	handler.holdings[2] = 0x42F6
	handler.holdings[3] = 0xE979

	// 1. Start a mock Modbus TCP Server
	server, err := modbus.NewServer(&modbus.ServerConfiguration{
		URL:        "tcp://localhost:50502",
		Timeout:    1 * time.Second,
		MaxClients: 5,
	}, handler)
	if err != nil {
		t.Fatalf("Failed to create server: %v", err)
	}

	err = server.Start()
	if err != nil {
		t.Fatalf("Failed to start server: %v", err)
	}
	defer server.Stop()

	// Wait for server start
	time.Sleep(100 * time.Millisecond)

	// 3. Initialize ModbusDriver
	driver := NewModbusDriver()
	config := model.DriverConfig{
		Config: map[string]any{
			"url":                 "tcp://localhost:50502",
			"slave_id":            1,
			"byteOrder":           "ABCD",
			"batchSize":           10,
			"instructionInterval": 10, // 10ms
			"startAddress":        1,  // 40001 -> offset 0
		},
	}

	err = driver.Init(config)
	if err != nil {
		t.Fatalf("Failed to init driver: %v", err)
	}

	ctx := context.Background()
	err = driver.Connect(ctx)
	if err != nil {
		t.Fatalf("Failed to connect: %v", err)
	}
	defer driver.Disconnect()

	// 4. Test ReadPoints
	points := []model.Point{
		{
			ID:       "p1",
			Address:  "40001", // Offset 0
			DataType: "uint16",
		},
		{
			ID:       "p2",
			Address:  "40002", // Offset 1
			DataType: "uint16",
		},
		{
			ID:       "p3",
			Address:  "40003", // Offset 2, float32 takes 2 regs
			DataType: "float32",
		},
	}

	results, err := driver.ReadPoints(ctx, points)
	if err != nil {
		t.Fatalf("ReadPoints failed: %v", err)
	}

	// Verify p1
	if val, ok := results["p1"]; ok {
		if val.Value.(uint16) != 123 {
			t.Errorf("p1 expected 123, got %v", val.Value)
		}
	} else {
		t.Errorf("p1 missing")
	}

	// Verify p2
	if val, ok := results["p2"]; ok {
		if val.Value.(uint16) != 456 {
			t.Errorf("p2 expected 456, got %v", val.Value)
		}
	} else {
		t.Errorf("p2 missing")
	}

	// Verify p3
	if val, ok := results["p3"]; ok {
		// float comparison
		fVal := val.Value.(float32)
		if fVal < 123.45 || fVal > 123.46 {
			t.Errorf("p3 expected ~123.456, got %v", fVal)
		}
	} else {
		t.Errorf("p3 missing")
	}

	// 5. Test WritePoint
	// Write 789 to p1
	err = driver.WritePoint(ctx, points[0], 789)
	if err != nil {
		t.Fatalf("WritePoint failed: %v", err)
	}

	// Verify write by checking handler state directly
	handler.mu.Lock()
	val := handler.holdings[0]
	handler.mu.Unlock()

	if val != 789 {
		t.Errorf("p1 after write expected 789, got %v", val)
	}

	fmt.Println("TestModbusOptimization passed successfully")
}
