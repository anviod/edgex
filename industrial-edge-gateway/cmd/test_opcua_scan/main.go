package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"industrial-edge-gateway/internal/driver"
	"industrial-edge-gateway/internal/driver/opcua"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)
	log.Println("Starting OPC UA Object Scan Test (Driver Integration)...")

	endpoint := "opc.tcp://127.0.0.1:53530/OPCUA/SimulationServer"

	// 1. Create Driver
	d := opcua.NewOpcUaDriver()

	// 2. Perform Object Scan
	log.Printf("Initiating ScanObjects for Endpoint %s...", endpoint)

	scanner, ok := d.(driver.ObjectScanner)
	if !ok {
		log.Fatalf("Driver does not implement ObjectScanner interface")
	}

	scanConfig := map[string]any{
		"endpoint":     endpoint,
		"root_node_id": "ns=0;i=85", // Objects folder
	}

	ctx := context.Background()
	results, err := scanner.ScanObjects(ctx, scanConfig)
	if err != nil {
		log.Fatalf("ScanObjects failed: %v", err)
	}

	// 3. Print Results
	bytes, err := json.MarshalIndent(results, "", "  ")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(bytes))
}
