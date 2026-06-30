package modbus

import (
	"fmt"
	"testing"

	"github.com/anviod/edgex/internal/model"
)

// TestGroupPoints 测试点位分组功能
func TestGroupPoints(t *testing.T) {
	// Initialize components
	decoder := NewPointDecoder("ABCD", 0, 0)
	// mock transport can be nil for grouping test
	// maxPacketSize=125 registers, groupThreshold=50
	scheduler := NewPointScheduler(nil, decoder, 125, 50, 0)

	// 测试场景1：连续的点位应该分组
	points := []model.Point{
		{ID: "point1", Address: "0", DataType: "int16"},
		{ID: "point2", Address: "1", DataType: "int16"},
		{ID: "point3", Address: "2", DataType: "int16"},
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
		{ID: "point1", Address: "0", DataType: "int16"},
		{ID: "point2", Address: "99", DataType: "int16"}, // 间隔99，超过阈值50
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
		{ID: "point1", Address: "0", DataType: "int16", RegisterType: model.RegHolding}, // HOLDING_REGISTER
		{ID: "point2", Address: "0", DataType: "int16", RegisterType: model.RegInput},   // INPUT_REGISTER
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
		{ID: "point1", Address: "0", DataType: "float32"}, // 占用2个寄存器
		{ID: "point2", Address: "2", DataType: "int16"},   // 占用1个寄存器
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
	decoder := NewPointDecoder("ABCD", 0, 0)

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

// TestModbus100DiscreteGroupingReduction 验证 Gap 块读相对逐点读取减少请求数 ≥30%。
func TestModbus100DiscreteGroupingReduction(t *testing.T) {
	decoder := NewPointDecoder("ABCD", 0, 0)
	scheduler := NewPointScheduler(nil, decoder, 125, 64, 0)

	points := make([]model.Point, 100)
	for i := range points {
		points[i] = model.Point{
			ID:       fmt.Sprintf("p%d", i),
			Address:  fmt.Sprintf("%d", i*5),
			DataType: "int16",
		}
	}

	groups, err := scheduler.groupPoints(points)
	if err != nil {
		t.Fatalf("groupPoints: %v", err)
	}

	perPointBaseline := len(points)
	reduction := 1.0 - float64(len(groups))/float64(perPointBaseline)
	if reduction < 0.30 {
		t.Fatalf("request reduction %.1f%% < 30%% (baseline=%d groups=%d)",
			reduction*100, perPointBaseline, len(groups))
	}
}

// TestAddressBase tests the address base functionality
func TestAddressBase(t *testing.T) {
	// Test 0-based (default) with raw address 0
	decoder0 := NewPointDecoder("ABCD", 0, 0)
	regType, offset, err := decoder0.ParseAddress("0")
	if err != nil {
		t.Fatalf("ParseAddress failed: %v", err)
	}
	if regType != model.RegHolding {
		t.Errorf("Expected RegHolding, got %v", regType)
	}
	if offset != 0 {
		t.Errorf("Expected offset 0, got %d", offset)
	}

	// Test 1-based with raw address 20001 (above discrete input range 10001-20000)
	decoder1 := NewPointDecoder("ABCD", 0, 1)
	regType, offset, err = decoder1.ParseAddress("20001")
	if err != nil {
		t.Fatalf("ParseAddress failed: %v", err)
	}
	if regType != model.RegHolding {
		t.Errorf("Expected RegHolding, got %v", regType)
	}
	if offset != 20000 {
		t.Errorf("Expected offset 20000, got %d", offset)
	}

	// Test 1-based with address 20002 (above discrete input range)
	regType, offset, err = decoder1.ParseAddress("20002")
	if err != nil {
		t.Fatalf("ParseAddress failed: %v", err)
	}
	if regType != model.RegHolding {
		t.Errorf("Expected RegHolding, got %v", regType)
	}
	if offset != 20001 {
		t.Errorf("Expected offset 20001, got %d", offset)
	}

	// Test that standard Modbus addresses (40001+) still work
	regType, offset, err = decoder1.ParseAddress("40001")
	if err != nil {
		t.Fatalf("ParseAddress failed: %v", err)
	}
	if regType != model.RegHolding {
		t.Errorf("Expected RegHolding, got %v", regType)
	}
	if offset != 0 {
		t.Errorf("Expected offset 0, got %d", offset)
	}

	fmt.Println("TestAddressBase passed successfully")
}
