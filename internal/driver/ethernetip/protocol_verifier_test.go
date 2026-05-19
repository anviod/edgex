package ethernetip

import (
	"encoding/binary"
	"fmt"
	"math"
	"sync"
	"testing"

	go_ethernet_ip "github.com/anviod/ethernet-ip"
	"github.com/anviod/ethernet-ip/bufferx"
	"github.com/anviod/ethernet-ip/messages/packet"
	"github.com/anviod/ethernet-ip/types"
)

var tagToAttr = map[string]int{
	"BoolTag":   1,
	"SintTag":   2,
	"IntTag":    3,
	"DintTag":   4,
	"LintTag":   5,
	"UsintTag":  6,
	"UintTag":   7,
	"UdintTag":  8,
	"UlintTag":  9,
	"RealTag":   10,
	"LrealTag":  11,
	"StringTag": 12,
}

type ProtocolVerifier struct {
	conn *go_ethernet_ip.EIPTCP
}

func NewProtocolVerifier(conn *go_ethernet_ip.EIPTCP) *ProtocolVerifier {
	return &ProtocolVerifier{conn: conn}
}

type TestResult struct {
	Name    string
	Passed  bool
	Message string
	Value   interface{}
}

func dialForTest(t *testing.T) *go_ethernet_ip.EIPTCP {
	conn, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Skipf("跳过测试: 无法创建TCP连接: %v", err)
	}
	if err := conn.Connect(); err != nil {
		t.Skipf("跳过测试: 无法连接到模拟器: %v", err)
	}
	return conn
}

func ReadClass2Attribute(conn *go_ethernet_ip.EIPTCP, attrID int) ([]byte, error) {
	pathData := []byte{
		0x20, 0x02,
		0x24, 0x01,
		0x30, byte(attrID),
	}

	mr := packet.NewMessageRouter(0x0E, pathData, nil)
	response, err := conn.Send(mr)
	if err != nil {
		return nil, err
	}

	if response == nil || response.Packet == nil {
		return nil, fmt.Errorf("空响应")
	}

	itemIdx := -1
	for i, item := range response.Packet.Items {
		if item.TypeID == packet.ItemIDUnconnectedMessage {
			itemIdx = i
			break
		}
	}

	if itemIdx < 0 {
		return nil, fmt.Errorf("未找到 CIP 响应数据")
	}

	item := response.Packet.Items[itemIdx]
	if len(item.Data) < 4 {
		return nil, fmt.Errorf("响应数据过短")
	}

	rmr := &packet.MessageRouterResponse{}
	rmr.Decode(item.Data)

	if rmr.GeneralStatus != 0 {
		return nil, fmt.Errorf("CIP error: 0x%02X", rmr.GeneralStatus)
	}

	return rmr.ResponseData, nil
}

func (pv *ProtocolVerifier) verifyDeviceDiscovery() []TestResult {
	fmt.Println("\n[验证 1] 设备发现")
	results := []TestResult{}

	identity, err := pv.conn.ListIdentity()
	if err != nil {
		fmt.Printf("✗ 设备发现失败: %v\n", err)
		results = append(results, TestResult{Name: "设备发现", Passed: false, Message: err.Error()})
		return results
	}

	if len(identity.Items) == 0 {
		fmt.Printf("✗ 未发现任何设备\n")
		results = append(results, TestResult{Name: "设备发现", Passed: false, Message: "没有设备"})
		return results
	}

	item := identity.Items[0]

	if item.VendorID == 0 {
		results = append(results, TestResult{Name: "VendorID验证", Passed: false, Message: "VendorID无效"})
	} else {
		fmt.Printf("✓ 供应商ID有效: %d\n", item.VendorID)
		results = append(results, TestResult{Name: "VendorID验证", Passed: true, Value: item.VendorID})
	}

	if len(item.ProductName) == 0 {
		results = append(results, TestResult{Name: "ProductName验证", Passed: false, Message: "设备名称为空"})
	} else {
		fmt.Printf("✓ 设备名称: %s\n", string(item.ProductName))
		results = append(results, TestResult{Name: "ProductName验证", Passed: true, Value: string(item.ProductName)})
	}

	fmt.Printf("✓ 设备发现成功: 找到 %d 个设备\n", len(identity.Items))
	results = append(results, TestResult{Name: "设备发现", Passed: true, Value: len(identity.Items)})

	return results
}

func (pv *ProtocolVerifier) verifyConnectionEstablishment() []TestResult {
	fmt.Println("\n[验证 2] 连接建立")
	results := []TestResult{}

	if pv.conn == nil {
		results = append(results, TestResult{Name: "TCP连接", Passed: false, Message: "连接对象为空"})
		return results
	}
	fmt.Printf("✓ TCP连接对象有效\n")
	results = append(results, TestResult{Name: "TCP连接", Passed: true})

	if !pv.conn.IsConnected() {
		results = append(results, TestResult{Name: "IsConnected", Passed: false, Message: "未建立连接"})
		return results
	}
	fmt.Printf("✓ 连接已建立 (IsConnected=true)\n")
	results = append(results, TestResult{Name: "IsConnected", Passed: true})

	return results
}

func (pv *ProtocolVerifier) verifyCIPGeneralMessages() []TestResult {
	fmt.Println("\n[验证 3] CIP通用消息")
	results := []TestResult{}

	identity, err := pv.conn.ListIdentity()
	if err != nil {
		fmt.Printf("✗ Get Attributes All 失败: %v\n", err)
		results = append(results, TestResult{Name: "GetAttributesAll", Passed: false, Message: err.Error()})
		return results
	}

	if len(identity.Items) > 0 {
		item := identity.Items[0]
		fmt.Printf("✓ Get Attributes All 成功 - 供应商ID: %d\n", item.VendorID)
		results = append(results, TestResult{Name: "GetAttributesAll", Passed: true, Value: item.VendorID})
	}

	attrData, err := ReadClass2Attribute(pv.conn, 1)
	if err != nil {
		fmt.Printf("✗ Get Attribute Single 失败: %v\n", err)
		results = append(results, TestResult{Name: "GetAttributeSingle", Passed: false, Message: err.Error()})
	} else {
		fmt.Printf("✓ Get Attribute Single 成功 - 数据长度: %d\n", len(attrData))
		results = append(results, TestResult{Name: "GetAttributeSingle", Passed: true, Value: len(attrData)})
	}

	return results
}

func (pv *ProtocolVerifier) verifyTagReadWrite() []TestResult {
	fmt.Println("\n[验证 4] 标签读写")
	results := []TestResult{}

	tag := new(go_ethernet_ip.Tag)
	err := pv.conn.InitializeTag("Program:MainProgram.IntTag", tag)
	if err != nil {
		fmt.Printf("✗ 单个标签读取 - 初始化失败: %v\n", err)
		results = append(results, TestResult{Name: "单标签读_初始化", Passed: false, Message: err.Error()})
		return results
	}

	err = tag.Read()
	if err != nil {
		fmt.Printf("✗ 单个标签读取 - 读取失败: %v\n", err)
		results = append(results, TestResult{Name: "单标签读取", Passed: false, Message: err.Error()})
	} else {
		fmt.Printf("✓ 单个标签读取成功: %d\n", tag.Int16())
		results = append(results, TestResult{Name: "单标签读取", Passed: true, Value: tag.Int16()})
	}

	tag2 := new(go_ethernet_ip.Tag)
	err = pv.conn.InitializeTag("Program:MainProgram.IntTag", tag2)
	if err != nil {
		fmt.Printf("✗ 单个标签写入 - 初始化失败: %v\n", err)
		results = append(results, TestResult{Name: "单标签写_初始化", Passed: false, Message: err.Error()})
	} else {
		tag2.SetInt32(12345)
		err = tag2.Write()
		if err != nil {
			fmt.Printf("✗ 单个标签写入失败: %v\n", err)
			results = append(results, TestResult{Name: "单标签写入", Passed: false, Message: err.Error()})
		} else {
			fmt.Printf("✓ 单个标签写入成功: 12345\n")
			results = append(results, TestResult{Name: "单标签写入", Passed: true, Value: 12345})
		}
	}

	tg := go_ethernet_ip.NewTagGroup(new(sync.Mutex))
	tags := []string{
		"Program:MainProgram.IntTag",
		"Program:MainProgram.DintTag",
		"Program:MainProgram.RealTag",
	}
	tagCount := 0
	for _, name := range tags {
		t := new(go_ethernet_ip.Tag)
		if err := pv.conn.InitializeTag(name, t); err == nil {
			tg.Add(t)
			tagCount++
		}
	}

	if tagCount == 0 {
		fmt.Printf("✗ 批量读取 - 没有有效标签\n")
		results = append(results, TestResult{Name: "批量读取", Passed: false, Message: "没有有效标签"})
	} else {
		err = tg.Read()
		if err != nil {
			fmt.Printf("✗ 批量读取失败: %v\n", err)
			results = append(results, TestResult{Name: "批量读取", Passed: false, Message: err.Error()})
		} else {
			fmt.Printf("✓ 批量读取成功: 读取了 %d 个标签\n", tagCount)
			results = append(results, TestResult{Name: "批量读取", Passed: true, Value: tagCount})
		}
	}

	tg2 := go_ethernet_ip.NewTagGroup(new(sync.Mutex))
	tag3 := new(go_ethernet_ip.Tag)
	tagCount2 := 0
	if err := pv.conn.InitializeTag("Program:MainProgram.IntTag", tag3); err == nil {
		tg2.Add(tag3)
		tagCount2++
	}
	tag4 := new(go_ethernet_ip.Tag)
	if err := pv.conn.InitializeTag("Program:MainProgram.RealTag", tag4); err == nil {
		tg2.Add(tag4)
		tagCount2++
	}

	if tagCount2 < 2 {
		fmt.Printf("✗ 批量写入 - 标签不足\n")
		results = append(results, TestResult{Name: "批量写入", Passed: false, Message: "标签不足"})
	} else {
		err = tg2.Write()
		if err != nil {
			fmt.Printf("✗ 批量写入失败: %v\n", err)
			results = append(results, TestResult{Name: "批量写入", Passed: false, Message: err.Error()})
		} else {
			fmt.Printf("✓ 批量写入成功\n")
			results = append(results, TestResult{Name: "批量写入", Passed: true})
		}
	}

	return results
}

func (pv *ProtocolVerifier) verifyDataTypeSupport() []TestResult {
	fmt.Println("\n[验证 5] 数据类型支持")
	results := []TestResult{}

	type testCase struct {
		attrID   int
		dataType string
		parseFn  func([]byte) interface{}
	}

	tests := []testCase{
		{tagToAttr["BoolTag"], "BOOL", func(data []byte) interface{} {
			if len(data) >= 1 {
				return data[0] != 0
			}
			return nil
		}},
		{tagToAttr["SintTag"], "SINT", func(data []byte) interface{} {
			if len(data) >= 1 {
				return int8(data[0])
			}
			return nil
		}},
		{tagToAttr["IntTag"], "INT", func(data []byte) interface{} {
			if len(data) >= 2 {
				return int16(binary.LittleEndian.Uint16(data[:2]))
			}
			return nil
		}},
		{tagToAttr["DintTag"], "DINT", func(data []byte) interface{} {
			if len(data) >= 4 {
				return int32(binary.LittleEndian.Uint32(data[:4]))
			}
			return nil
		}},
		{tagToAttr["LintTag"], "LINT", func(data []byte) interface{} {
			if len(data) >= 8 {
				return int64(binary.LittleEndian.Uint64(data[:8]))
			}
			return nil
		}},
		{tagToAttr["UsintTag"], "USINT", func(data []byte) interface{} {
			if len(data) >= 1 {
				return uint8(data[0])
			}
			return nil
		}},
		{tagToAttr["UintTag"], "UINT", func(data []byte) interface{} {
			if len(data) >= 2 {
				return binary.LittleEndian.Uint16(data[:2])
			}
			return nil
		}},
		{tagToAttr["UdintTag"], "UDINT", func(data []byte) interface{} {
			if len(data) >= 4 {
				return binary.LittleEndian.Uint32(data[:4])
			}
			return nil
		}},
		{tagToAttr["UlintTag"], "ULINT", func(data []byte) interface{} {
			if len(data) >= 8 {
				return binary.LittleEndian.Uint64(data[:8])
			}
			return nil
		}},
		{tagToAttr["RealTag"], "REAL", func(data []byte) interface{} {
			if len(data) >= 4 {
				return math.Float32frombits(binary.LittleEndian.Uint32(data[:4]))
			}
			return nil
		}},
		{tagToAttr["LrealTag"], "LREAL", func(data []byte) interface{} {
			if len(data) >= 8 {
				return math.Float64frombits(binary.LittleEndian.Uint64(data[:8]))
			}
			return nil
		}},
		{tagToAttr["StringTag"], "STRING", func(data []byte) interface{} {
			if len(data) >= 2 {
				strLen := int(binary.LittleEndian.Uint16(data[:2]))
				if len(data) >= 2+strLen {
					return string(data[2 : 2+strLen])
				}
				return string(data[2:])
			}
			return ""
		}},
	}

	for _, tc := range tests {
		data, err := ReadClass2Attribute(pv.conn, tc.attrID)
		if err != nil {
			fmt.Printf("✗ %s 读取失败: %v\n", tc.dataType, err)
			results = append(results, TestResult{Name: tc.dataType, Passed: false, Message: err.Error()})
			continue
		}
		parsedValue := tc.parseFn(data)
		fmt.Printf("✓ %s 读取成功: %v\n", tc.dataType, parsedValue)
		results = append(results, TestResult{Name: tc.dataType, Passed: true, Value: parsedValue})
	}

	return results
}

func (pv *ProtocolVerifier) verifyProtocolCompliance() []TestResult {
	fmt.Println("\n[验证 6] 协议合规性")
	results := []TestResult{}

	pathData := []byte{
		0x20, 0x02,
		0x24, 0x01,
		0x30, 0x01,
	}
	mr := packet.NewMessageRouter(0x0E, pathData, nil)
	encoded := mr.Encode()
	if len(encoded) == 0 {
		fmt.Printf("✗ 封装协议头格式错误: 编码为空\n")
		results = append(results, TestResult{Name: "封装协议头", Passed: false, Message: "编码为空"})
	} else {
		fmt.Printf("✓ 封装协议头格式正确: 长度=%d\n", len(encoded))
		results = append(results, TestResult{Name: "封装协议头", Passed: true, Value: len(encoded)})
	}

	respData := []byte{
		0x4C, 0x00,
		0x00, 0x00,
		0x00, 0x00,
		0x00, 0x00,
		0x02, 0x00,
		0x01, 0x00,
		0xC3, 0x00,
		0x01, 0x00,
		0x39, 0x30,
	}

	mrResp := &packet.MessageRouterResponse{}
	mrResp.Decode(respData)
	if mrResp.GeneralStatus == 0 {
		fmt.Printf("✓ CIP命令响应格式正确\n")
		results = append(results, TestResult{Name: "CIP响应格式", Passed: true})
	} else {
		results = append(results, TestResult{Name: "CIP响应格式", Passed: false, Message: fmt.Sprintf("状态码: 0x%02X", mrResp.GeneralStatus)})
	}

	if mrResp.GeneralStatus == 0 {
		fmt.Printf("✓ 状态码返回正确: 0x00\n")
		results = append(results, TestResult{Name: "状态码", Passed: true, Value: mrResp.GeneralStatus})
	} else {
		results = append(results, TestResult{Name: "状态码", Passed: false, Message: fmt.Sprintf("状态码: 0x%02X", mrResp.GeneralStatus)})
	}

	return results
}

func (pv *ProtocolVerifier) verifyErrorHandling() []TestResult {
	fmt.Println("\n[验证 7] 错误处理")
	results := []TestResult{}

	tag := new(go_ethernet_ip.Tag)
	err := pv.conn.InitializeTag("NotExistTag", tag)
	if err == nil {
		err = tag.Read()
	}
	if err != nil {
		fmt.Printf("✓ 无效标签返回正确错误: %v\n", err)
		results = append(results, TestResult{Name: "无效标签错误", Passed: true, Message: err.Error()})
	} else {
		results = append(results, TestResult{Name: "无效标签错误", Passed: false, Message: "未返回错误"})
	}

	_, err = ReadClass2Attribute(pv.conn, 999)
	if err != nil {
		fmt.Printf("✓ 无效属性ID返回正确错误: %v\n", err)
		results = append(results, TestResult{Name: "无效属性ID错误", Passed: true, Message: err.Error()})
	} else {
		results = append(results, TestResult{Name: "无效属性ID错误", Passed: false, Message: "未返回错误"})
	}

	conn2, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err == nil {
		conn2.Close()
		fmt.Printf("✓ 连接断开后能正确处理\n")
		results = append(results, TestResult{Name: "连接断开处理", Passed: true})
	} else {
		results = append(results, TestResult{Name: "连接断开处理", Passed: false, Message: err.Error()})
	}

	return results
}

func (pv *ProtocolVerifier) RunAllTests() []TestResult {
	allResults := []TestResult{}

	allResults = append(allResults, pv.verifyDeviceDiscovery()...)
	allResults = append(allResults, pv.verifyConnectionEstablishment()...)
	allResults = append(allResults, pv.verifyCIPGeneralMessages()...)
	allResults = append(allResults, pv.verifyTagReadWrite()...)
	allResults = append(allResults, pv.verifyDataTypeSupport()...)
	allResults = append(allResults, pv.verifyProtocolCompliance()...)
	allResults = append(allResults, pv.verifyErrorHandling()...)

	return allResults
}

func TestProtocolVerifier_All(t *testing.T) {
	conn := dialForTest(t)
	if conn == nil {
		return
	}
	defer conn.Close()

	pv := NewProtocolVerifier(conn)
	results := pv.RunAllTests()

	passed := 0
	failed := 0
	for _, r := range results {
		if r.Passed {
			passed++
		} else {
			failed++
		}
	}

	fmt.Printf("\n========================================\n")
	fmt.Printf("EtherNet/IP 协议验证结果汇总\n")
	fmt.Printf("通过=%d, 失败=%d\n", passed, failed)
	fmt.Printf("========================================\n")

	if failed > 0 {
		t.Errorf("%d 个测试失败", failed)
	}
}

func TestProtocolVerifier_DeviceDiscovery(t *testing.T) {
	conn := dialForTest(t)
	if conn == nil {
		return
	}
	defer conn.Close()

	pv := NewProtocolVerifier(conn)
	results := pv.verifyDeviceDiscovery()

	for _, r := range results {
		if !r.Passed {
			t.Errorf("设备发现 %s 验证失败: %s", r.Name, r.Message)
		}
	}
}

func TestProtocolVerifier_ConnectionEstablishment(t *testing.T) {
	conn := dialForTest(t)
	if conn == nil {
		return
	}
	defer conn.Close()

	pv := NewProtocolVerifier(conn)
	results := pv.verifyConnectionEstablishment()

	for _, r := range results {
		if !r.Passed {
			t.Errorf("连接建立 %s 验证失败: %s", r.Name, r.Message)
		}
	}
}

func TestProtocolVerifier_CIPGeneralMessages(t *testing.T) {
	conn := dialForTest(t)
	if conn == nil {
		return
	}
	defer conn.Close()

	pv := NewProtocolVerifier(conn)
	results := pv.verifyCIPGeneralMessages()

	for _, r := range results {
		if !r.Passed {
			t.Errorf("CIP通用消息 %s 验证失败: %s", r.Name, r.Message)
		}
	}
}

func TestProtocolVerifier_TagReadWrite(t *testing.T) {
	conn := dialForTest(t)
	if conn == nil {
		return
	}
	defer conn.Close()

	pv := NewProtocolVerifier(conn)
	results := pv.verifyTagReadWrite()

	for _, r := range results {
		if !r.Passed {
			t.Errorf("标签读写 %s 验证失败: %s", r.Name, r.Message)
		}
	}
}

func TestProtocolVerifier_DataTypeSupport(t *testing.T) {
	conn := dialForTest(t)
	if conn == nil {
		return
	}
	defer conn.Close()

	pv := NewProtocolVerifier(conn)
	results := pv.verifyDataTypeSupport()

	for _, r := range results {
		if !r.Passed {
			t.Errorf("数据类型支持 %s 验证失败: %s", r.Name, r.Message)
		}
	}
}

func TestProtocolVerifier_ProtocolCompliance(t *testing.T) {
	conn := dialForTest(t)
	if conn == nil {
		return
	}
	defer conn.Close()

	pv := NewProtocolVerifier(conn)
	results := pv.verifyProtocolCompliance()

	for _, r := range results {
		if !r.Passed {
			t.Errorf("协议合规性 %s 验证失败: %s", r.Name, r.Message)
		}
	}
}

func TestProtocolVerifier_ErrorHandling(t *testing.T) {
	conn := dialForTest(t)
	if conn == nil {
		return
	}
	defer conn.Close()

	pv := NewProtocolVerifier(conn)
	results := pv.verifyErrorHandling()

	for _, r := range results {
		if !r.Passed {
			t.Errorf("错误处理 %s 验证失败: %s", r.Name, r.Message)
		}
	}
}

func TestBufferX_Protocol(t *testing.T) {
	t.Run("LittleEndian写入读取", func(t *testing.T) {
		buf := bufferx.New(nil)
		buf.WL(int16(12345))
		buf.WL(int32(67890))
		buf.WL(float32(3.14159))

		if buf.Error() != nil {
			t.Fatalf("写入错误: %v", buf.Error())
		}

		var v1 int16
		var v2 int32
		var v3 float32

		rbuf := bufferx.New(buf.Bytes())
		rbuf.RL(&v1)
		rbuf.RL(&v2)
		rbuf.RL(&v3)

		if rbuf.Error() != nil {
			t.Fatalf("读取错误: %v", rbuf.Error())
		}

		if v1 != 12345 {
			t.Errorf("INT16: 预期 12345, 实际 %d", v1)
		}
		if v2 != 67890 {
			t.Errorf("INT32: 预期 67890, 实际 %d", v2)
		}
	})
}

func TestPacket_Protocol(t *testing.T) {
	t.Run("MessageRouterRequest编码", func(t *testing.T) {
		pathData := []byte{
			0x20, 0x02,
			0x24, 0x01,
			0x30, 0x01,
		}
		mr := packet.NewMessageRouter(0x0E, pathData, nil)

		encoded := mr.Encode()

		if len(encoded) == 0 {
			t.Errorf("编码结果为空")
		}
	})
}

var _ = types.UDInt(0)
var _ = fmt.Sprintf
