package main

import (
	"fmt"
	"net"
)

func main() {
	ifaces, err := net.Interfaces()
	if err != nil {
		panic(err)
	}
	for _, i := range ifaces {
		fmt.Printf("Name: %s, MAC: %s\n", i.Name, i.HardwareAddr)
		addrs, _ := i.Addrs()
		for _, a := range addrs {
			fmt.Printf("  Addr: %s\n", a.String())
		}
	}
}
