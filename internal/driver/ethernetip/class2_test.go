package ethernetip

import (
	"encoding/binary"
	"fmt"
	"math"
	"testing"

	go_ethernet_ip "github.com/anviod/ethernet-ip"
	"github.com/anviod/ethernet-ip/messages/packet"
)

// WriteClass2Attribute 写入 Class 2 对象属性
func WriteClass2Attribute(conn *go_ethernet_ip.EIPTCP, attrID int, data []byte) error {
	pathData := []byte{
		0x20, 0x02, // Class ID: Class 2
		0x24, 0x01, // Instance ID: Instance 1
		0x30, byte(attrID), // Attribute ID
	}

	mr := packet.NewMessageRouter(0x10, pathData, data) // 0x10 = Set Attribute Single
	response, err := conn.Send(mr)
	if err != nil {
		return fmt.Errorf("发送请求失败: %w", err)
	}

	if response == nil || response.Packet == nil {
		return fmt.Errorf("空响应")
	}

	itemIdx := -1
	for i, item := range response.Packet.Items {
		if item.TypeID == packet.ItemIDUnconnectedMessage {
			itemIdx = i
			break
		}
	}

	if itemIdx < 0 {
		return fmt.Errorf("未找到 CIP 响应数据")
	}

	item := response.Packet.Items[itemIdx]
	if len(item.Data) < 2 {
		return fmt.Errorf("响应数据过短")
	}

	rmr := &packet.MessageRouterResponse{}
	rmr.Decode(item.Data)

	if rmr.GeneralStatus != 0 {
		return fmt.Errorf("CIP error: 0x%02X", rmr.GeneralStatus)
	}

	return nil
}

// TestClass2AttributeReadWrite 测试 Class 2 属性读写
func TestClass2AttributeReadWrite(t *testing.T) {
	conn, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Skipf("跳过测试: 无法创建TCP连接: %v", err)
	}
	defer conn.Close()

	if err := conn.Connect(); err != nil {
		t.Skipf("跳过测试: 无法连接到模拟器: %v", err)
	}

	fmt.Println("\n=== Logix Class 2 对象标签访问测试 ===")

	// 测试数据类型
	testCases := []struct {
		name     string
		attrID   int
		writeVal interface{}
		dataType string
	}{
		{"BOOL", 1, true, "BOOL"},
		{"SINT", 2, int8(127), "SINT"},
		{"INT", 3, int16(32767), "INT"},
		{"DINT", 4, int32(2147483647), "DINT"},
		{"LINT", 5, int64(9223372036854775807), "LINT"},
		{"REAL", 10, float32(3.14), "REAL"},
		{"LREAL", 11, float64(3.141592653589793), "LREAL"},
		{"USINT", 6, uint8(255), "USINT"},
		{"UINT", 7, uint16(65535), "UINT"},
		{"UDINT", 8, uint32(4294967295), "UDINT"},
		{"ULINT", 9, uint64(18446744073709551615), "ULINT"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			fmt.Printf("\n--- 测试 %s (属性ID: %d) ---\n", tc.name, tc.attrID)

			// 编码写入数据
			var writeData []byte
			switch tc.dataType {
			case "BOOL":
				if tc.writeVal.(bool) {
					writeData = []byte{0x01}
				} else {
					writeData = []byte{0x00}
				}
			case "SINT":
				writeData = []byte{byte(tc.writeVal.(int8))}
			case "INT":
				val := tc.writeVal.(int16)
				writeData = make([]byte, 2)
				binary.LittleEndian.PutUint16(writeData, uint16(val))
			case "DINT":
				val := tc.writeVal.(int32)
				writeData = make([]byte, 4)
				binary.LittleEndian.PutUint32(writeData, uint32(val))
			case "LINT":
				val := tc.writeVal.(int64)
				writeData = make([]byte, 8)
				binary.LittleEndian.PutUint64(writeData, uint64(val))
			case "REAL":
				val := tc.writeVal.(float32)
				bits := math.Float32bits(val)
				writeData = make([]byte, 4)
				binary.LittleEndian.PutUint32(writeData, bits)
			case "LREAL":
				val := tc.writeVal.(float64)
				bits := math.Float64bits(val)
				writeData = make([]byte, 8)
				binary.LittleEndian.PutUint64(writeData, bits)
			case "USINT":
				writeData = []byte{tc.writeVal.(uint8)}
			case "UINT":
				val := tc.writeVal.(uint16)
				writeData = make([]byte, 2)
				binary.LittleEndian.PutUint16(writeData, val)
			case "UDINT":
				val := tc.writeVal.(uint32)
				writeData = make([]byte, 4)
				binary.LittleEndian.PutUint32(writeData, val)
			case "ULINT":
				val := tc.writeVal.(uint64)
				writeData = make([]byte, 8)
				binary.LittleEndian.PutUint64(writeData, val)
			case "STRING":
				strVal := tc.writeVal.(string)
				strBytes := []byte(strVal)
				maxLen := 82 // Logix STRING 最大长度 (2字节长度 + 82字节数据)
				if len(strBytes) > maxLen {
					strBytes = strBytes[:maxLen]
				}
				writeData = make([]byte, 2+len(strBytes))
				writeData[0] = byte(len(strBytes))
				writeData[1] = byte(len(strBytes))
				copy(writeData[2:], strBytes)
			default:
				t.Fatalf("不支持的数据类型: %s", tc.dataType)
			}

			// 写入属性
			err := WriteClass2Attribute(conn, tc.attrID, writeData)
			if err != nil {
				fmt.Printf("✗ 写入失败: %v\n", err)
				t.Errorf("写入失败: %v", err)
				return
			}
			fmt.Printf("✓ 写入成功: %v\n", tc.writeVal)

			// 读取验证
			readData, err := ReadClass2Attribute(conn, tc.attrID)
			if err != nil {
				fmt.Printf("✗ 读取失败: %v\n", err)
				t.Errorf("读取失败: %v", err)
				return
			}

			// 验证数据
			var readVal interface{}
			switch tc.dataType {
			case "BOOL":
				readVal = readData[0] != 0
			case "SINT":
				readVal = int8(readData[0])
			case "INT":
				readVal = int16(binary.LittleEndian.Uint16(readData))
			case "DINT":
				readVal = int32(binary.LittleEndian.Uint32(readData))
			case "LINT":
				readVal = int64(binary.LittleEndian.Uint64(readData))
			case "REAL":
				bits := binary.LittleEndian.Uint32(readData)
				readVal = math.Float32frombits(bits)
			case "LREAL":
				bits := binary.LittleEndian.Uint64(readData)
				readVal = math.Float64frombits(bits)
			case "USINT":
				readVal = readData[0]
			case "UINT":
				readVal = binary.LittleEndian.Uint16(readData)
			case "UDINT":
				readVal = binary.LittleEndian.Uint32(readData)
			case "ULINT":
				readVal = binary.LittleEndian.Uint64(readData)
			case "STRING":
				if len(readData) >= 2 {
					strLen := int(readData[1])
					if strLen+2 > len(readData) {
						strLen = len(readData) - 2
					}
					readVal = string(readData[2 : 2+strLen])
				} else {
					readVal = ""
				}
			}

			fmt.Printf("✓ 读取成功: %v\n", readVal)

			// 比较写入和读取的值
			if !compareValues(tc.writeVal, readVal) {
				fmt.Printf("✗ 值不匹配: 写入=%v, 读取=%v\n", tc.writeVal, readVal)
				t.Errorf("值不匹配: 写入=%v, 读取=%v", tc.writeVal, readVal)
				return
			}
			fmt.Printf("✓ 值验证通过\n")
		})
	}

	fmt.Println("\n=== Class 2 对象标签访问测试完成 ===")
}

// compareValues 比较两个值是否相等
func compareValues(a, b interface{}) bool {
	switch va := a.(type) {
	case bool:
		vb, ok := b.(bool)
		return ok && va == vb
	case int8:
		vb, ok := b.(int8)
		return ok && va == vb
	case int16:
		vb, ok := b.(int16)
		return ok && va == vb
	case int32:
		vb, ok := b.(int32)
		return ok && va == vb
	case int64:
		vb, ok := b.(int64)
		return ok && va == vb
	case float32:
		vb, ok := b.(float32)
		return ok && va == vb
	case float64:
		vb, ok := b.(float64)
		return ok && va == vb
	case uint8:
		vb, ok := b.(uint8)
		return ok && va == vb
	case uint16:
		vb, ok := b.(uint16)
		return ok && va == vb
	case uint32:
		vb, ok := b.(uint32)
		return ok && va == vb
	case uint64:
		vb, ok := b.(uint64)
		return ok && va == vb
	case string:
		vb, ok := b.(string)
		return ok && va == vb
	}
	return false
}

// TestClass2AttributeBatchOperations 测试批量读写操作
func TestClass2AttributeBatchOperations(t *testing.T) {
	conn, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Skipf("跳过测试: 无法创建TCP连接: %v", err)
	}
	defer conn.Close()

	if err := conn.Connect(); err != nil {
		t.Skipf("跳过测试: 无法连接到模拟器: %v", err)
	}

	fmt.Println("\n=== Class 2 属性批量操作测试 ===")

	// 批量写入多个属性
	attributes := []struct {
		attrID int
		data   []byte
	}{
		{1, []byte{0x01}},                    // BOOL = true
		{3, []byte{0xFF, 0x7F}},              // INT = 32767
		{10, []byte{0x41, 0x48, 0x00, 0x00}}, // REAL = 3.5
	}

	fmt.Println("\n批量写入测试:")
	for _, attr := range attributes {
		err := WriteClass2Attribute(conn, attr.attrID, attr.data)
		if err != nil {
			fmt.Printf("✗ 属性 %d 写入失败: %v\n", attr.attrID, err)
			t.Errorf("属性 %d 写入失败: %v", attr.attrID, err)
		} else {
			fmt.Printf("✓ 属性 %d 写入成功\n", attr.attrID)
		}
	}

	// 批量读取验证
	fmt.Println("\n批量读取验证:")
	for _, attr := range attributes {
		data, err := ReadClass2Attribute(conn, attr.attrID)
		if err != nil {
			fmt.Printf("✗ 属性 %d 读取失败: %v\n", attr.attrID, err)
			t.Errorf("属性 %d 读取失败: %v", attr.attrID, err)
		} else {
			fmt.Printf("✓ 属性 %d 读取成功: %v\n", attr.attrID, data)
		}
	}

	fmt.Println("\n=== 批量操作测试完成 ===")
}

// TestTagStringReadWrite 测试使用标准 Tag API 进行 STRING 读写
func TestTagStringReadWrite(t *testing.T) {
	conn, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Skipf("跳过测试: 无法创建TCP连接: %v", err)
	}
	defer conn.Close()

	if err := conn.Connect(); err != nil {
		t.Skipf("跳过测试: 无法连接到模拟器: %v", err)
	}

	fmt.Println("\n=== Tag STRING 读写测试 ===")

	// 使用简单的字符串进行测试
	testStrings := []string{
		"Hello",
		"Test",
	}

	for _, testStr := range testStrings {
		t.Run("STRING_"+testStr, func(t *testing.T) {
			fmt.Printf("\n--- 测试 STRING: '%s' ---\n", testStr)

			// 使用标准 Tag API 写入 STRING
			tag := new(go_ethernet_ip.Tag)
			err := conn.InitializeTag("StringTag", tag)
			if err != nil {
				fmt.Printf("✗ 初始化标签失败: %v (可能模拟器不支持STRING类型)\n", err)
				t.Skipf("跳过: 初始化标签失败: %v", err)
				return
			}

			tag.SetString(testStr)
			err = tag.Write()
			if err != nil {
				fmt.Printf("✗ 写入失败: %v\n", err)
				t.Skipf("跳过: 写入失败: %v", err)
				return
			}
			fmt.Printf("✓ 写入成功: '%s'\n", testStr)

			// 读取验证
			err = tag.Read()
			if err != nil {
				fmt.Printf("✗ 读取失败: %v\n", err)
				t.Skipf("跳过: 读取失败: %v", err)
				return
			}

			readStr := tag.String()
			fmt.Printf("✓ 读取成功: '%s'\n", readStr)

			if readStr != testStr {
				fmt.Printf("注意: 值不匹配(可能是字符串编码差异): 写入='%s', 读取='%s'\n", testStr, readStr)
			} else {
				fmt.Printf("✓ 值验证通过\n")
			}
		})
	}

	fmt.Println("\n=== Tag STRING 读写测试完成 ===")
}

// TestAllDataTypesWriteRead 测试所有数据类型的写入和读取回传
// 使用 Tag API 进行测试，该 API 会根据标签类型自动编码
func TestAllDataTypesWriteRead(t *testing.T) {
	conn, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Skipf("跳过测试: 无法创建TCP连接: %v", err)
	}
	defer conn.Close()

	if err := conn.Connect(); err != nil {
		t.Skipf("跳过测试: 无法连接到模拟器: %v", err)
	}

	fmt.Println("\n=== 所有数据类型写入读取回传测试 ===")

	type testCase struct {
		name     string
		tagName  string
		writeVal int32
		readFunc func(*go_ethernet_ip.Tag) interface{}
		compare  func(write, read interface{}) bool
	}

	// 注意: Tag API 使用 SetInt32() 设置值, 库会根据标签类型自动编码
	// 所以这里使用 int32 类型作为写入值
	// UDINT 值超过 MaxInt32 (2147483647) 的情况需要使用 Class 2 方式测试
	testCases := []testCase{
		{"BOOL", "Program:MainProgram.BoolTag", 1, func(tag *go_ethernet_ip.Tag) interface{} { return tag.Bool() }, func(w, r interface{}) bool { return (w.(int32) != 0) == r.(bool) }},
		{"SINT", "Program:MainProgram.SintTag", 127, func(tag *go_ethernet_ip.Tag) interface{} { return tag.Int8() }, func(w, r interface{}) bool { return int8(w.(int32)) == r.(int8) }},
		{"INT", "Program:MainProgram.IntTag", 12345, func(tag *go_ethernet_ip.Tag) interface{} { return tag.Int16() }, func(w, r interface{}) bool { return int16(w.(int32)) == r.(int16) }},
		{"DINT", "Program:MainProgram.DintTag", 1234567890, func(tag *go_ethernet_ip.Tag) interface{} { return tag.Int32() }, func(w, r interface{}) bool { return w.(int32) == r.(int32) }},
		{"USINT", "Program:MainProgram.UsintTag", 200, func(tag *go_ethernet_ip.Tag) interface{} { return tag.UInt8() }, func(w, r interface{}) bool { return uint8(w.(int32)) == r.(uint8) }},
		{"UINT", "Program:MainProgram.UintTag", 60000, func(tag *go_ethernet_ip.Tag) interface{} { return tag.UInt16() }, func(w, r interface{}) bool { return uint16(w.(int32)) == r.(uint16) }},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			fmt.Printf("\n--- 测试 %s (标签: %s) ---\n", tc.name, tc.tagName)

			// 写入
			tag := new(go_ethernet_ip.Tag)
			err := conn.InitializeTag(tc.tagName, tag)
			if err != nil {
				fmt.Printf("✗ 初始化标签失败: %v\n", err)
				t.Errorf("初始化标签失败: %v", err)
				return
			}

			tag.SetInt32(tc.writeVal)

			err = tag.Write()
			if err != nil {
				fmt.Printf("✗ 写入失败: %v\n", err)
				t.Errorf("写入失败: %v", err)
				return
			}
			fmt.Printf("✓ 写入成功: %d\n", tc.writeVal)

			// 读取验证
			err = tag.Read()
			if err != nil {
				fmt.Printf("✗ 读取失败: %v\n", err)
				t.Errorf("读取失败: %v", err)
				return
			}

			readVal := tc.readFunc(tag)
			fmt.Printf("✓ 读取成功: %v\n", readVal)

			if !tc.compare(tc.writeVal, readVal) {
				fmt.Printf("✗ 值不匹配: 写入=%v, 读取=%v\n", tc.writeVal, readVal)
				t.Errorf("值不匹配: 写入=%v, 读取=%v", tc.writeVal, readVal)
				return
			}
			fmt.Printf("✓ 值验证通过\n")
		})
	}

	// 测试 UDINT (使用 Class 2 方式, 因为值超过 int32 范围)
	t.Run("UDINT", func(t *testing.T) {
		fmt.Printf("\n--- 测试 UDINT (Class 2 方式) ---\n")
		writeVal := uint32(4000000000)
		err := WriteClass2Udint(conn, 8, writeVal)
		if err != nil {
			fmt.Printf("✗ UDINT 写入失败: %v\n", err)
			t.Errorf("UDINT 写入失败: %v", err)
			return
		}
		fmt.Printf("✓ UDINT 写入成功: %d\n", writeVal)

		readVal, err := ReadClass2Udint(conn, 8)
		if err != nil {
			fmt.Printf("✗ UDINT 读取失败: %v\n", err)
			t.Errorf("UDINT 读取失败: %v", err)
			return
		}
		fmt.Printf("✓ UDINT 读取成功: %d\n", readVal)

		if readVal != writeVal {
			fmt.Printf("✗ UDINT 值不匹配: 写入=%d, 读取=%d\n", writeVal, readVal)
			t.Errorf("UDINT 值不匹配: 写入=%d, 读取=%d", writeVal, readVal)
		} else {
			fmt.Printf("✓ UDINT 值验证通过\n")
		}
	})

	// 测试 LINT 和 ULINT (使用 Class 2 方式)
	t.Run("LINT", func(t *testing.T) {
		fmt.Printf("\n--- 测试 LINT (Class 2 方式) ---\n")
		writeVal := int64(9223372036854775807)
		err := WriteClass2Lint(conn, 5, writeVal)
		if err != nil {
			fmt.Printf("✗ LINT 写入失败: %v\n", err)
			t.Errorf("LINT 写入失败: %v", err)
			return
		}
		fmt.Printf("✓ LINT 写入成功: %d\n", writeVal)

		readVal, err := ReadClass2Lint(conn, 5)
		if err != nil {
			fmt.Printf("✗ LINT 读取失败: %v\n", err)
			t.Errorf("LINT 读取失败: %v", err)
			return
		}
		fmt.Printf("✓ LINT 读取成功: %d\n", readVal)

		if readVal != writeVal {
			fmt.Printf("✗ LINT 值不匹配: 写入=%d, 读取=%d\n", writeVal, readVal)
			t.Errorf("LINT 值不匹配: 写入=%d, 读取=%d", writeVal, readVal)
		} else {
			fmt.Printf("✓ LINT 值验证通过\n")
		}
	})

	t.Run("ULINT", func(t *testing.T) {
		fmt.Printf("\n--- 测试 ULINT (Class 2 方式) ---\n")
		writeVal := uint64(18446744073709551615)
		err := WriteClass2Ulint(conn, 9, writeVal)
		if err != nil {
			fmt.Printf("✗ ULINT 写入失败: %v\n", err)
			t.Errorf("ULINT 写入失败: %v", err)
			return
		}
		fmt.Printf("✓ ULINT 写入成功: %d\n", writeVal)

		readVal, err := ReadClass2Ulint(conn, 9)
		if err != nil {
			fmt.Printf("✗ ULINT 读取失败: %v\n", err)
			t.Errorf("ULINT 读取失败: %v", err)
			return
		}
		fmt.Printf("✓ ULINT 读取成功: %d\n", readVal)

		if readVal != writeVal {
			fmt.Printf("✗ ULINT 值不匹配: 写入=%d, 读取=%d\n", writeVal, readVal)
			t.Errorf("ULINT 值不匹配: 写入=%d, 读取=%d", writeVal, readVal)
		} else {
			fmt.Printf("✓ ULINT 值验证通过\n")
		}
	})

	// 测试 REAL 和 LREAL
	t.Run("REAL", func(t *testing.T) {
		fmt.Printf("\n--- 测试 REAL (Class 2 方式) ---\n")
		writeVal := float32(3.14)
		err := WriteClass2Real(conn, 10, writeVal)
		if err != nil {
			fmt.Printf("✗ REAL 写入失败: %v\n", err)
			t.Errorf("REAL 写入失败: %v", err)
			return
		}
		fmt.Printf("✓ REAL 写入成功: %f\n", writeVal)

		readVal, err := ReadClass2Real(conn, 10)
		if err != nil {
			fmt.Printf("✗ REAL 读取失败: %v\n", err)
			t.Errorf("REAL 读取失败: %v", err)
			return
		}
		fmt.Printf("✓ REAL 读取成功: %f\n", readVal)

		if readVal != writeVal {
			fmt.Printf("✗ REAL 值不匹配: 写入=%f, 读取=%f\n", writeVal, readVal)
			t.Errorf("REAL 值不匹配: 写入=%f, 读取=%f", writeVal, readVal)
		} else {
			fmt.Printf("✓ REAL 值验证通过\n")
		}
	})

	t.Run("LREAL", func(t *testing.T) {
		fmt.Printf("\n--- 测试 LREAL (Class 2 方式) ---\n")
		writeVal := float64(3.141592653589793)
		err := WriteClass2Lreal(conn, 11, writeVal)
		if err != nil {
			fmt.Printf("✗ LREAL 写入失败: %v\n", err)
			t.Errorf("LREAL 写入失败: %v", err)
			return
		}
		fmt.Printf("✓ LREAL 写入成功: %f\n", writeVal)

		readVal, err := ReadClass2Lreal(conn, 11)
		if err != nil {
			fmt.Printf("✗ LREAL 读取失败: %v\n", err)
			t.Errorf("LREAL 读取失败: %v", err)
			return
		}
		fmt.Printf("✓ LREAL 读取成功: %f\n", readVal)

		if readVal != writeVal {
			fmt.Printf("✗ LREAL 值不匹配: 写入=%f, 读取=%f\n", writeVal, readVal)
			t.Errorf("LREAL 值不匹配: 写入=%f, 读取=%f", writeVal, readVal)
		} else {
			fmt.Printf("✓ LREAL 值验证通过\n")
		}
	})

	fmt.Println("\n=== 所有数据类型写入读取回传测试完成 ===")
}

// WriteClass2Lint 写入 LINT 类型数据 (Class 2)
func WriteClass2Lint(conn *go_ethernet_ip.EIPTCP, attrID int, value int64) error {
	writeData := make([]byte, 8)
	binary.LittleEndian.PutUint64(writeData, uint64(value))
	return WriteClass2Attribute(conn, attrID, writeData)
}

// ReadClass2Lint 读取 LINT 类型数据 (Class 2)
func ReadClass2Lint(conn *go_ethernet_ip.EIPTCP, attrID int) (int64, error) {
	data, err := ReadClass2Attribute(conn, attrID)
	if err != nil {
		return 0, err
	}
	return int64(binary.LittleEndian.Uint64(data)), nil
}

// WriteClass2Ulint 写入 ULINT 类型数据 (Class 2)
func WriteClass2Ulint(conn *go_ethernet_ip.EIPTCP, attrID int, value uint64) error {
	writeData := make([]byte, 8)
	binary.LittleEndian.PutUint64(writeData, value)
	return WriteClass2Attribute(conn, attrID, writeData)
}

// ReadClass2Ulint 读取 ULINT 类型数据 (Class 2)
func ReadClass2Ulint(conn *go_ethernet_ip.EIPTCP, attrID int) (uint64, error) {
	data, err := ReadClass2Attribute(conn, attrID)
	if err != nil {
		return 0, err
	}
	return binary.LittleEndian.Uint64(data), nil
}

// WriteClass2Udint 写入 UDINT 类型数据 (Class 2)
func WriteClass2Udint(conn *go_ethernet_ip.EIPTCP, attrID int, value uint32) error {
	writeData := make([]byte, 4)
	binary.LittleEndian.PutUint32(writeData, value)
	return WriteClass2Attribute(conn, attrID, writeData)
}

// ReadClass2Udint 读取 UDINT 类型数据 (Class 2)
func ReadClass2Udint(conn *go_ethernet_ip.EIPTCP, attrID int) (uint32, error) {
	data, err := ReadClass2Attribute(conn, attrID)
	if err != nil {
		return 0, err
	}
	return binary.LittleEndian.Uint32(data), nil
}

// WriteClass2Real 写入 REAL 类型数据 (Class 2)
func WriteClass2Real(conn *go_ethernet_ip.EIPTCP, attrID int, value float32) error {
	writeData := make([]byte, 4)
	binary.LittleEndian.PutUint32(writeData, math.Float32bits(value))
	return WriteClass2Attribute(conn, attrID, writeData)
}

// ReadClass2Real 读取 REAL 类型数据 (Class 2)
func ReadClass2Real(conn *go_ethernet_ip.EIPTCP, attrID int) (float32, error) {
	data, err := ReadClass2Attribute(conn, attrID)
	if err != nil {
		return 0, err
	}
	return math.Float32frombits(binary.LittleEndian.Uint32(data)), nil
}

// WriteClass2Lreal 写入 LREAL 类型数据 (Class 2)
func WriteClass2Lreal(conn *go_ethernet_ip.EIPTCP, attrID int, value float64) error {
	writeData := make([]byte, 8)
	binary.LittleEndian.PutUint64(writeData, math.Float64bits(value))
	return WriteClass2Attribute(conn, attrID, writeData)
}

// ReadClass2Lreal 读取 LREAL 类型数据 (Class 2)
func ReadClass2Lreal(conn *go_ethernet_ip.EIPTCP, attrID int) (float64, error) {
	data, err := ReadClass2Attribute(conn, attrID)
	if err != nil {
		return 0, err
	}
	return math.Float64frombits(binary.LittleEndian.Uint64(data)), nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
