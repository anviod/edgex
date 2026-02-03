package main

import (
	"context"
	"encoding/json"
	"fmt"
	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/model"
	"log"
	"time"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)
	log.Println("Starting BACnet Discovery Test...")

	// 1. Create Driver
	d := bacnet.NewBACnetDriver()

	// 2. Init Driver
	// Configure for local interface if needed, or default
	config := model.DriverConfig{
		Config: map[string]any{
			"interface_ip":   "192.168.3.106", // Bind to specific IP to ensure source IP is correct
			"interface_port": 47808,           // Share port with simulators
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

	log.Println("Driver connected. Waiting 2 seconds before scan...")
	time.Sleep(2 * time.Second)

	// 4. Perform Scan
	// We want to find ALL devices, so we don't pass device_id.
	// We can pass interface_ip if we want to target a specific one, or leave empty for all.
	scanParams := map[string]any{
		"low_limit":  0,
		"high_limit": 4194303,
		// "interface_ip": "192.168.3.106", // Optional: test specific interface
	}

	log.Println("Initiating Scan (WhoIs)...")

	// Assert Scanner interface
	scanner, ok := d.(driver.Scanner)
	if !ok {
		log.Fatalf("Driver does not implement Scanner interface")
	}

	result, err := scanner.Scan(ctx, scanParams)
	if err != nil {
		log.Fatalf("Scan failed: %v", err)
	}

	// 5. Print Results
	bytes, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		log.Printf("Failed to marshal result: %v", err)
		log.Printf("Result: %+v", result)
	} else {
		log.Printf("Scan Result:\n%s", string(bytes))
	}

	// 6. Check for specific nodes and Read
	// Parse back from JSON to generic struct to access fields
	var scanResults []struct {
		DeviceID int    `json:"device_id"`
		IP       string `json:"ip"`
		Port     int    `json:"port"`
	}
	if err := json.Unmarshal(bytes, &scanResults); err != nil {
		log.Printf("[ERROR] Failed to unmarshal scan results: %v", err)
	}

	if len(scanResults) > 0 {
		// Try to read from all found devices
		for _, targetDev := range scanResults {
			log.Printf("[INFO] Attempting to read points from device %d (%s:%d)...", targetDev.DeviceID, targetDev.IP, targetDev.Port)

			// Set Target Device
			config := map[string]any{
				"device_id": targetDev.DeviceID,
				"ip":        targetDev.IP,
				"port":      targetDev.Port,
			}
			log.Printf("[INFO] Configuring device %d (%s:%d)...", targetDev.DeviceID, targetDev.IP, targetDev.Port)
			err = d.SetDeviceConfig(config)
			if err != nil {
				log.Printf("[ERROR] SetDeviceConfig failed for device %d: %v", targetDev.DeviceID, err)
				continue
			}

			// Wait for scheduler init
			time.Sleep(1 * time.Second)

			// Define Point
			point := model.Point{
				ID:      fmt.Sprintf("test-point-%d", targetDev.DeviceID),
				Name:    "AI:0",
				Address: "0:0", // AnalogInput:0
			}

			// Read
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			results, err := d.ReadPoints(ctx, []model.Point{point})
			cancel()

			if err != nil {
				log.Printf("[ERROR] ReadPoints failed for device %d (Port %d): %v", targetDev.DeviceID, targetDev.Port, err)

				// RETRY with Port 47808 if discovered port was different
				if targetDev.Port != 47808 {
					log.Printf("[INFO] Retrying device %d with Port 47808...", targetDev.DeviceID)
					config["port"] = 47808
					d.SetDeviceConfig(config)

					// Wait for scheduler re-init
					time.Sleep(500 * time.Millisecond)

					ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
					results, err = d.ReadPoints(ctx, []model.Point{point})
					cancel()

					if err != nil {
						log.Printf("[ERROR] Retry with Port 47808 failed for device %d: %v", targetDev.DeviceID, err)
					} else {
						log.Printf("[INFO] SUCCESS: ReadPoints worked with Port 47808 for device %d!", targetDev.DeviceID)
						log.Printf("[INFO] ReadPoints Success for device %d: %+v", targetDev.DeviceID, results)
					}
				}
			} else {
				log.Printf("[INFO] SUCCESS: ReadPoints worked with discovered port %d for device %d", targetDev.Port, targetDev.DeviceID)
				log.Printf("[INFO] ReadPoints Success for device %d: %+v", targetDev.DeviceID, results)
			}

			// Small delay between devices
			time.Sleep(500 * time.Millisecond)
		}
	}

	log.Println("Test Complete.")
}
