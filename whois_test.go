//go:build ignore
// +build ignore

package main

import (
	"context"
	"fmt"
	"net"
	"time"

	bacnetlib "github.com/anviod/bacnet"
	"github.com/anviod/bacnet/btypes"
)

func main() {
	// Test 1: broadcast from 192.168.3.230:47808
	fmt.Println("=== Test 1: Broadcast WhoIs from 192.168.3.230:47808 ===")
	testWhoIs("192.168.3.230", 47808, nil)

	// Test 2: unicast to 192.168.3.115:47808
	fmt.Println("\n=== Test 2: Unicast WhoIs to 192.168.3.115:47808 ===")
	dest := makeAddr("192.168.3.115", 47808)
	testWhoIs("192.168.3.230", 47809, dest)

	// Test 3: unicast to 192.168.3.115:58494 (simulator port)
	fmt.Println("\n=== Test 3: Unicast WhoIs to 192.168.3.115:58494 ===")
	dest3 := makeAddr("192.168.3.115", 58494)
	testWhoIs("192.168.3.230", 47810, dest3)

	// Test 4: unicast to all simulator ports
	fmt.Println("\n=== Test 4: Unicast to all simulator ports ===")
	ports := []int{58494, 64339, 54304, 64806, 50900}
	for _, port := range ports {
		d := makeAddr("192.168.3.115", port)
		devs, err := doWhoIs("192.168.3.230", 47811, d)
		if err != nil {
			fmt.Printf("  Port %d: error: %v\n", port, err)
		} else {
			fmt.Printf("  Port %d: %d devices\n", port, len(devs))
			for _, dev := range devs {
				fmt.Printf("    Device %d @ %s:%d\n", dev.DeviceID, dev.Ip, dev.Port)
			}
		}
	}
}

func testWhoIs(ip string, port int, dest *btypes.Address) {
	devs, err := doWhoIs(ip, port, dest)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Found %d devices\n", len(devs))
		for _, dev := range devs {
			fmt.Printf("  Device %d @ %s:%d\n", dev.DeviceID, dev.Ip, dev.Port)
		}
	}
}

func doWhoIs(ip string, port int, dest *btypes.Address) ([]btypes.Device, error) {
	client, err := bacnetlib.NewClient(&bacnetlib.ClientBuilder{
		Ip:         ip,
		Port:       port,
		SubnetCIDR: 24,
	})
	if err != nil {
		return nil, fmt.Errorf("create client: %w", err)
	}
	defer client.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	go client.ClientRun()
	time.Sleep(100 * time.Millisecond)

	opts := &bacnetlib.WhoIsOpts{
		Low:  0,
		High: 4194303,
	}
	if dest != nil {
		opts.Destination = dest
	}

	devs, err := client.WhoIs(opts)
	cancel()
	time.Sleep(200 * time.Millisecond)
	return devs, err
}

func makeAddr(ipStr string, port int) *btypes.Address {
	ip := net.ParseIP(ipStr).To4()
	return &btypes.Address{
		Mac:    []byte{ip[0], ip[1], ip[2], ip[3], uint8(port >> 8), uint8(port & 0xFF)},
		MacLen: 6,
	}
}