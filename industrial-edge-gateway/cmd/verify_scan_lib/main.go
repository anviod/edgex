package main

import (
	"log"

	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func main() {
	log.Println("Starting BACnet Library Scan Verification...")

	// Create Client
	cb := &bacnet.ClientBuilder{
		Ip:         "192.168.3.106",
		Port:       47810,
		SubnetCIDR: 24,
	}
	client, err := bacnet.NewClient(cb)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer client.Close()

	go client.ClientRun()

	// 1. Send Broadcast WhoIs
	log.Println("Sending Broadcast WhoIs...")
	whoIsOpts := &bacnet.WhoIsOpts{
		Low:  -1,
		High: -1,
	}

	devices, err := client.WhoIs(whoIsOpts)
	if err != nil {
		log.Printf("WhoIs error: %v", err)
	}

	log.Printf("Broadcast Scan found %d devices:", len(devices))
	for _, d := range devices {
		log.Printf("- Device %d at %s:%d", d.DeviceID, d.Ip, d.Port)
	}

	// 2. Send Unicast WhoIs
	log.Println("Sending Unicast WhoIs to 192.168.3.106:47808...")
	unicastDest := &btypes.Address{
		Net:    0,
		MacLen: 6,
		Mac:    []uint8{192, 168, 3, 106, 0xBA, 0xC0}, // 47808 = 0xBA 0xC0
	}
	whoIsUnicast := &bacnet.WhoIsOpts{
		Low:         -1,
		High:        -1,
		Destination: unicastDest,
	}
	devices, err = client.WhoIs(whoIsUnicast)
	if err != nil {
		log.Printf("Unicast WhoIs error: %v", err)
	}
	log.Printf("Unicast Scan found %d devices:", len(devices))
	for _, d := range devices {
		log.Printf("- Device %d at %s:%d", d.DeviceID, d.Ip, d.Port)
	}
}
