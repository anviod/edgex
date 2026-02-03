package main

import (
	"fmt"
	"net"
	"os"
)

func main() {
	ip := "192.168.3.106"
	port := 47808
	addr := fmt.Sprintf("%s:%d", ip, port)

	fmt.Printf("Attempting to bind to %s...\n", addr)

	udpAddr, err := net.ResolveUDPAddr("udp4", addr)
	if err != nil {
		fmt.Printf("ResolveUDPAddr failed: %v\n", err)
		os.Exit(1)
	}

	conn, err := net.ListenUDP("udp", udpAddr)
	if err != nil {
		fmt.Printf("ListenUDP failed: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close()

	fmt.Printf("Successfully bound to %s\n", addr)
	
	// Keep it open for a moment
	// time.Sleep(5 * time.Second)
}
