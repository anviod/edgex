package ethernetip

import (
	"sync"
	"testing"

	go_ethernet_ip "github.com/anviod/ethernet-ip"
)

// TestFullIntegration 全面测试Ethernet/IP模拟器对接
func TestFullIntegration(t *testing.T) {
	t.Run("ConnectionEstablishment", testConnectionEstablishment)
	t.Run("TagReadWrite", testTagReadWrite)
	t.Run("DataTypeSupport", testDataTypeSupport)
	t.Run("BatchOperations", testBatchOperations)
	t.Run("ErrorHandling", testErrorHandling)
}

// 1. 连接建立测试
func testConnectionEstablishment(t *testing.T) {
	t.Log("Testing Connection Establishment...")
	
	tcp, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Fatalf("Failed to create TCP client: %v", err)
	}

	err = tcp.Connect()
	if err != nil {
		t.Fatalf("Connection failed: %v", err)
	}

	t.Log("✓ Connection established successfully")
	
	defer tcp.Close()
}

// 2. 标签读写测试
func testTagReadWrite(t *testing.T) {
	t.Log("Testing Tag Read/Write...")
	
	tcp, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Fatalf("Failed to create TCP client: %v", err)
	}
	defer tcp.Close()

	err = tcp.Connect()
	if err != nil {
		t.Fatalf("Connection failed: %v", err)
	}

	// 单个标签读取
	t.Run("SingleTagRead", func(t *testing.T) {
		tag := new(go_ethernet_ip.Tag)
		err := tcp.InitializeTag("Program:MainProgram.BoolTag", tag)
		if err != nil {
			t.Fatalf("Single tag read failed: %v", err)
		}
		t.Logf("✓ Single tag read: BoolTag = %v", tag.GetValue())
	})

	// 单个标签写入
	t.Run("SingleTagWrite", func(t *testing.T) {
		tagGroup := go_ethernet_ip.NewTagGroup(new(sync.Mutex))
		
		tag := new(go_ethernet_ip.Tag)
		err := tcp.InitializeTag("Program:MainProgram.IntTag", tag)
		if err != nil {
			t.Fatalf("InitializeTag failed: %v", err)
		}
		tagGroup.Add(tag)
		
		err = tagGroup.Write()
		if err != nil {
			t.Fatalf("Single tag write failed: %v", err)
		}
		t.Log("✓ Single tag write successful")
	})
}

// 3. 数据类型支持测试
func testDataTypeSupport(t *testing.T) {
	t.Log("Testing Data Type Support...")
	
	tcp, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Fatalf("Failed to create TCP client: %v", err)
	}
	defer tcp.Close()

	err = tcp.Connect()
	if err != nil {
		t.Fatalf("Connection failed: %v", err)
	}

	testCases := []struct {
		name    string
		tagName string
	}{
		{"BOOL", "Global.BoolTag"},
		{"SINT", "Global.SintTag"},
		{"INT", "Global.IntTag"},
		{"DINT", "Global.DintTag"},
		{"LINT", "Global.LintTag"},
		{"USINT", "Global.UsintTag"},
		{"UINT", "Global.UintTag"},
		{"UDINT", "Global.UdintTag"},
		{"REAL", "Global.RealTag"},
		{"LREAL", "Global.LrealTag"},
		{"STRING", "Global.StringTag"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			tag := new(go_ethernet_ip.Tag)
			err := tcp.InitializeTag(tc.tagName, tag)
			if err != nil {
				t.Errorf("%s read failed: %v", tc.name, err)
				return
			}
			t.Logf("✓ %s = %v (type: %T)", tc.tagName, tag.GetValue(), tag.GetValue())
		})
	}
}

// 4. 批量操作测试
func testBatchOperations(t *testing.T) {
	t.Log("Testing Batch Operations...")
	
	tcp, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Fatalf("Failed to create TCP client: %v", err)
	}
	defer tcp.Close()

	err = tcp.Connect()
	if err != nil {
		t.Fatalf("Connection failed: %v", err)
	}

	// 批量读取
	t.Run("BatchRead", func(t *testing.T) {
		tagGroup := go_ethernet_ip.NewTagGroup(new(sync.Mutex))
		
		tags := []string{
			"Global.BoolTag",
			"Global.IntTag",
			"Global.RealTag",
			"Global.StringTag",
		}
		
		for _, name := range tags {
			tag := new(go_ethernet_ip.Tag)
			err := tcp.InitializeTag(name, tag)
			if err != nil {
				t.Fatalf("InitializeTag %s failed: %v", name, err)
			}
			tagGroup.Add(tag)
		}
		
		err := tagGroup.Read()
		if err != nil {
			t.Fatalf("Batch read failed: %v", err)
		}
		t.Log("✓ Batch read successful")
	})

	// 批量写入
	t.Run("BatchWrite", func(t *testing.T) {
		tagGroup := go_ethernet_ip.NewTagGroup(new(sync.Mutex))
		
		tag1 := new(go_ethernet_ip.Tag)
		err := tcp.InitializeTag("Program:MainProgram.IntTag", tag1)
		if err != nil {
			t.Fatalf("InitializeTag IntTag failed: %v", err)
		}
		
		tag2 := new(go_ethernet_ip.Tag)
		err = tcp.InitializeTag("Program:MainProgram.RealTag", tag2)
		if err != nil {
			t.Fatalf("InitializeTag RealTag failed: %v", err)
		}
		
		tagGroup.Add(tag1)
		tagGroup.Add(tag2)
		
		err = tagGroup.Write()
		if err != nil {
			t.Fatalf("Batch write failed: %v", err)
		}
		t.Log("✓ Batch write successful")
	})
}

// 5. 错误处理测试
func testErrorHandling(t *testing.T) {
	t.Log("Testing Error Handling...")
	
	tcp, err := go_ethernet_ip.NewTCP("127.0.0.1", nil)
	if err != nil {
		t.Fatalf("Failed to create TCP client: %v", err)
	}
	defer tcp.Close()

	err = tcp.Connect()
	if err != nil {
		t.Fatalf("Connection failed: %v", err)
	}

	// 无效标签测试
	t.Run("InvalidTag", func(t *testing.T) {
		tag := new(go_ethernet_ip.Tag)
		err := tcp.InitializeTag("Global.InvalidTag", tag)
		if err == nil {
			t.Error("Expected error for invalid tag, but got nil")
		} else {
			t.Logf("✓ Invalid tag correctly returned error: %v", err)
		}
	})

	// 数组元素读取测试
	t.Run("ArrayElementRead", func(t *testing.T) {
		tag := new(go_ethernet_ip.Tag)
		err := tcp.InitializeTag("Global.IntArray[0]", tag)
		if err != nil {
			t.Fatalf("Array element read failed: %v", err)
		}
		t.Logf("✓ Array element read: IntArray[0] = %v", tag.GetValue())
	})

	t.Log("Error handling tests completed")
}