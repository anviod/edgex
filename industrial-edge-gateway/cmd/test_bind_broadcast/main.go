package main

import (
	"fmt"
	"net"
	"os"
)

func main() {
	addr := "192.168.3.255:47808"

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
}
