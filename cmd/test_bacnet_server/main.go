// test_bacnet_server 测试北向 BACnet Server 是否正常响应
// 用法: go run ./cmd/test_bacnet_server/ <server_port> <device_id> <client_port>
// 例如: go run ./cmd/test_bacnet_server/ 47808 1000 47810
package main

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/anviod/bacnet"
	"github.com/anviod/bacnet/btypes"
)

func main() {
	port := 47808
	deviceID := 1000
	clientPort := 47810
	if len(os.Args) > 1 {
		p, err := strconv.Atoi(os.Args[1])
		if err == nil {
			port = p
		}
	}
	if len(os.Args) > 2 {
		id, err := strconv.Atoi(os.Args[2])
		if err == nil {
			deviceID = id
		}
	}
	if len(os.Args) > 3 {
		p, err := strconv.Atoi(os.Args[3])
		if err == nil {
			clientPort = p
		}
	}

	fmt.Printf("=== BACnet Server Test Tool ===\n")
	fmt.Printf("Target: 127.0.0.1:%d, DeviceID=%d, ClientPort=%d\n\n", port, deviceID, clientPort)

	// 创建 BACnet 客户端 (绑定到指定端口避免冲突)
	client, err := bacnet.NewClient(&bacnet.ClientBuilder{
		Ip:         "0.0.0.0",
		Port:       clientPort,
		SubnetCIDR: 24,
	})
	if err != nil {
		fmt.Printf("ERROR: Failed to create BACnet client: %v\n", err)
		os.Exit(1)
	}
	defer client.Close()

	go client.ClientRun()
	time.Sleep(500 * time.Millisecond)

	// 构造目标设备(直接连接,指定端口)
	dev := btypes.Device{
		ID: btypes.ObjectID{
			Type:     btypes.DeviceType,
			Instance: btypes.ObjectInstance(deviceID),
		},
		Addr: btypes.Address{
			Mac:    []byte{127, 0, 0, 1, byte(port >> 8), byte(port & 0xFF)},
			MacLen: 6,
		},
		MaxApdu: 1476,
	}

	// Step 1: 单播 WhoIs
	fmt.Println("--- Step 1: Unicast WhoIs ---")
	devices, err := client.WhoIs(&bacnet.WhoIsOpts{
		Low:       -1,
		High:      -1,
		Destination: &btypes.Address{
			Mac:    []byte{127, 0, 0, 1, byte(port >> 8), byte(port & 0xFF)},
			MacLen: 6,
		},
	})
	if err != nil {
		fmt.Printf("  WhoIs error: %v\n", err)
	} else {
		fmt.Printf("  Found %d device(s) via WhoIs\n", len(devices))
		for _, d := range devices {
			fmt.Printf("    Device: ID=%d, Addr=%v\n", d.ID, d.Addr)
		}
	}

	// Step 2: 直接读取 Device Object_Name
	fmt.Println("\n--- Step 2: Read Device Object_Name (direct) ---")
	rp, err := client.ReadPropertyWithTimeout(dev, btypes.PropertyData{
		Object: btypes.Object{
			ID: btypes.ObjectID{
				Type:     btypes.DeviceType,
				Instance: btypes.ObjectInstance(deviceID),
			},
			Properties: []btypes.Property{
				{Type: btypes.PROP_OBJECT_NAME, ArrayIndex: btypes.ArrayAll},
			},
		},
	}, 3*time.Second)
	if err != nil {
		fmt.Printf("  ERROR: %v\n", err)
	} else if len(rp.Object.Properties) > 0 {
		fmt.Printf("  Device %d Object_Name: %v\n", deviceID, rp.Object.Properties[0].Data)
	} else {
		fmt.Println("  No properties in response")
	}

	// Step 3: 读取 Object_List 大小
	fmt.Println("\n--- Step 3: Read Object_List size ---")
	rp, err = client.ReadPropertyWithTimeout(dev, btypes.PropertyData{
		Object: btypes.Object{
			ID: btypes.ObjectID{
				Type:     btypes.DeviceType,
				Instance: btypes.ObjectInstance(deviceID),
			},
			Properties: []btypes.Property{
				{Type: btypes.PROP_OBJECT_LIST, ArrayIndex: 0},
			},
		},
	}, 3*time.Second)
	if err != nil {
		fmt.Printf("  ERROR: %v\n", err)
	} else if len(rp.Object.Properties) > 0 {
		fmt.Printf("  Object_List size: %v\n", rp.Object.Properties[0].Data)
	}

	// Step 4: 读取完整 Object_List
	fmt.Println("\n--- Step 4: Read full Object_List ---")
	rp, err = client.ReadPropertyWithTimeout(dev, btypes.PropertyData{
		Object: btypes.Object{
			ID: btypes.ObjectID{
				Type:     btypes.DeviceType,
				Instance: btypes.ObjectInstance(deviceID),
			},
			Properties: []btypes.Property{
				{Type: btypes.PROP_OBJECT_LIST, ArrayIndex: btypes.ArrayAll},
			},
		},
	}, 5*time.Second)
	if err != nil {
		fmt.Printf("  ERROR: %v\n", err)
	} else if len(rp.Object.Properties) > 0 {
		switch v := rp.Object.Properties[0].Data.(type) {
		case []btypes.ObjectID:
			fmt.Printf("  Object_List contains %d objects:\n", len(v))
			for i, objID := range v {
				if i < 10 {
					fmt.Printf("    %s:%d\n", objID.Type, objID.Instance)
				}
			}
			if len(v) > 10 {
				fmt.Printf("    ... and %d more\n", len(v)-10)
			}
			// 读取第一个非 Device 对象的 PresentValue
			for _, objID := range v {
				if objID.Type == btypes.DeviceType {
					continue
				}
				rpPV, err := client.ReadPropertyWithTimeout(dev, btypes.PropertyData{
					Object: btypes.Object{
						ID: objID,
						Properties: []btypes.Property{
							{Type: btypes.PROP_PRESENT_VALUE, ArrayIndex: btypes.ArrayAll},
						},
					},
				}, 3*time.Second)
				if err != nil {
					fmt.Printf("  ReadProperty(PresentValue) on %s:%d: ERROR: %v\n", objID.Type, objID.Instance, err)
				} else if len(rpPV.Object.Properties) > 0 {
					fmt.Printf("  %s:%d PresentValue = %v\n", objID.Type, objID.Instance, rpPV.Object.Properties[0].Data)
				}
				break
			}
		default:
			fmt.Printf("  Object_List type: %T, value: %v\n", rp.Object.Properties[0].Data, rp.Object.Properties[0].Data)
		}
	}

	fmt.Println("\n=== Test Complete ===")
}