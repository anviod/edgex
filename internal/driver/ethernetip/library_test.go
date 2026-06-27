//go:build integration

package ethernetip

import (
	"sync"
	"testing"

	go_ethernet_ip "github.com/anviod/ethernet-ip"
)

// TestENIPLibraryDirectly 直接测试go-ethernet-ip库
func TestENIPLibraryDirectly(t *testing.T) {
	// 使用默认配置
	cfg := go_ethernet_ip.DefaultConfig()
	cfg.TCPPort = 44818

	tcp, err := go_ethernet_ip.NewTCP("127.0.0.1", cfg)
	if err != nil {
		t.Fatalf("Failed to create EIPTCP: %v", err)
	}

	t.Log("EIPTCP created")

	// 尝试连接
	err = tcp.Connect()
	if err != nil {
		t.Fatalf("Connect failed: %v", err)
	}

	t.Log("Connected successfully")
	defer tcp.Close()

	// 尝试读取一个标签
	tag := new(go_ethernet_ip.Tag)
	tag.TCP = tcp
	tag.Lock = new(sync.Mutex)
	tcp.InitializeTag("Program:MainProgram.BoolTag", tag)

	if err := tag.Read(); err != nil {
		t.Fatalf("Tag read failed: %v", err)
	}

	t.Logf("Tag value: %v", tag.GetValue())
}
