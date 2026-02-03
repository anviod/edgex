package main

import (
	"context"
	"encoding/json"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/model"
	"log"
	"time"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)
	log.Println("Starting BACnet Object Scan Test...")

	// 1. Create Driver
	d := bacnet.NewBACnetDriver()

	// 2. Init Driver
	config := model.DriverConfig{
		Config: map[string]any{
			"interface_ip":   "192.168.3.106", 
			"interface_port": 47808,           
			"subnet_cidr":    24,
		},
	}
	if err := d.Init(config); err != nil {
		log.Fatalf("Init failed: %v", err)
	}

	// 3. Connect (Start Driver)
	ctx := context.Background()
	if err := d.Connect(ctx); err != nil {
		log.Fatalf("Connect failed: %v", err)
	}
	defer d.Disconnect()

	log.Println("Driver connected. Waiting 2 seconds...")
	time.Sleep(2 * time.Second)

	// 4. Perform Object Scan for Device 2228318
	targetDeviceID := 2228318
	log.Printf("Initiating ScanObjects for Device %d...", targetDeviceID)

	// Assert ObjectScanner interface
	scanner, ok := d.(driver.ObjectScanner)
	if !ok {
		log.Fatalf("Driver does not implement ObjectScanner interface")
	}

	scanConfig := map[string]any{
		"device_id": targetDeviceID,
	}

	// We might need to ensure the driver knows about the device (IP/Port) first.
	// In a real scenario, the device is usually added first.
	// But ScanObjects triggers WhoIs if not found in cache.
	
	// Let's try calling ScanObjects directly.
	results, err := scanner.ScanObjects(ctx, scanConfig)
	if err != nil {
		log.Fatalf("ScanObjects failed: %v", err)
	}

	// 5. Print Results
	bytes, err := json.MarshalIndent(results, "", "  ")
	if err != nil {
		log.Printf("Failed to marshal result: %v", err)
		log.Printf("Result: %+v", results)
	} else {
		log.Printf("ScanObjects Result:\n%s", string(bytes))
	}
}
