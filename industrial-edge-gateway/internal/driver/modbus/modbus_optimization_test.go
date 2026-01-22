package modbus

import (
	"industrial-edge-gateway/internal/model"
	"strconv"
	"testing"
)

// TestGroupPoints 测试点位分组功能
func TestGroupPoints(t *testing.T) {
	driver := &ModbusDriver{
		maxPacketSize:  125,
		groupThreshold: 50,
	}

	// 测试场景1：连续的点位应该分组
	points := []model.Point{
		{ID: "point1", Address: "40001", DataType: "int16"},
		{ID: "point2", Address: "40002", DataType: "int16"},
		{ID: "point3", Address: "40003", DataType: "int16"},
	}

	groups, err := driver.groupPoints(points)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(groups) != 1 {
		t.Errorf("Expected 1 group, got: %d", len(groups))
	}

	if groups[0].Count != 3 {
		t.Errorf("Expected group count 3, got: %d", groups[0].Count)
	}

	// 测试场景2：地址间隔大的点位应该分组
	points = []model.Point{
		{ID: "point1", Address: "40001", DataType: "int16"},
		{ID: "point2", Address: "40100", DataType: "int16"}, // 间隔99，超过阈值50
	}

	groups, err = driver.groupPoints(points)
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

	groups, err = driver.groupPoints(points)
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

	groups, err = driver.groupPoints(points)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if len(groups) != 1 {
		t.Errorf("Expected 1 group, got: %d", len(groups))
	}

	// 总计应该是 3 个寄存器（2 + 1）
	if groups[0].Count != 3 {
		t.Errorf("Expected total count 3, got: %d", groups[0].Count)
	}
}

// TestRegisterCount 测试寄存器数量计算
func TestRegisterCount(t *testing.T) {
	driver := &ModbusDriver{}

	tests := []struct {
		dataType string
		expected uint16
	}{
		{"int16", 1},
		{"uint16", 1},
		{"int32", 2},
		{"uint32", 2},
		{"float32", 2},
		{"unknown", 1},
	}

	for _, tc := range tests {
		result := driver.getRegisterCount(tc.dataType)
		if result != tc.expected {
			t.Errorf("DataType %s: expected %d, got %d", tc.dataType, tc.expected, result)
		}
	}
}

// TestParseAddress 测试地址解析
func TestParseAddress(t *testing.T) {
	driver := &ModbusDriver{}

	tests := []struct {
		addr      string
		regType   string
		offset    uint16
		shouldErr bool
	}{
		{"40001", "HOLDING_REGISTER", 0, false},
		{"40100", "HOLDING_REGISTER", 99, false},
		{"30001", "INPUT_REGISTER", 0, false},
		{"10001", "DISCRETE_INPUT", 0, false},
		{"1", "COIL", 0, false},
		{"100", "COIL", 99, false},
		{"invalid", "", 0, true},
	}

	for _, tc := range tests {
		regType, offset, err := driver.parseAddress(tc.addr)
		if (err != nil) != tc.shouldErr {
			t.Errorf("Address %s: expected error=%v, got error=%v", tc.addr, tc.shouldErr, err)
		}

		if !tc.shouldErr {
			if regType != tc.regType {
				t.Errorf("Address %s: expected regType %s, got %s", tc.addr, tc.regType, regType)
			}
			if offset != tc.offset {
				t.Errorf("Address %s: expected offset %d, got %d", tc.addr, tc.offset, offset)
			}
		}
	}
}

// TestMaxPacketSizeLimit 测试最大封包大小限制
func TestMaxPacketSizeLimit(t *testing.T) {
	driver := &ModbusDriver{
		maxPacketSize:  10, // 限制为10个寄存器
		groupThreshold: 50,
	}

	// 创建20个点位，应该被分成多个组
	points := make([]model.Point, 20)
	for i := 0; i < 20; i++ {
		points[i] = model.Point{
			ID:       "point" + strconv.Itoa(i),
			Address:  strconv.Itoa(40001 + i),
			DataType: "int16",
		}
	}

	groups, err := driver.groupPoints(points)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	// 验证每个组都不超过最大封包大小
	for i, group := range groups {
		if group.Count > driver.maxPacketSize {
			t.Errorf("Group %d exceeds max packet size: %d > %d", i, group.Count, driver.maxPacketSize)
		}
	}

	// 应该至少有2个组
	if len(groups) < 2 {
		t.Errorf("Expected at least 2 groups, got: %d", len(groups))
	}
}

// TestSortAddressInfos 测试地址排序
func TestSortAddressInfos(t *testing.T) {
	infos := []AddressInfo{
		{Offset: 100},
		{Offset: 50},
		{Offset: 150},
		{Offset: 75},
	}

	sortAddressInfos(infos)

	expected := []uint16{50, 75, 100, 150}
	for i, info := range infos {
		if info.Offset != expected[i] {
			t.Errorf("Index %d: expected offset %d, got %d", i, expected[i], info.Offset)
		}
	}
}

// BenchmarkGroupPoints 基准测试：分组性能
func BenchmarkGroupPoints(b *testing.B) {
	driver := &ModbusDriver{
		maxPacketSize:  125,
		groupThreshold: 50,
	}

	// 创建100个点位
	points := make([]model.Point, 100)
	for i := 0; i < 100; i++ {
		points[i] = model.Point{
			ID:       "point" + strconv.Itoa(i),
			Address:  strconv.Itoa(40001 + i),
			DataType: "int16",
		}
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		driver.groupPoints(points)
	}
}
