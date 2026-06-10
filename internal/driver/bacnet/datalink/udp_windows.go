//go:build windows
// +build windows

package datalink

import (
	"context"
	"fmt"
	"net"
	"syscall"
)

func createUDPListener(ipAddr string, port int) (*net.UDPConn, error) {
	udpAddrStr := fmt.Sprintf("%s:%d", ipAddr, port)

	lc := net.ListenConfig{
		Control: func(network, address string, c syscall.RawConn) error {
			var opErr error
			err := c.Control(func(fd uintptr) {
				opErr = syscall.SetsockoptInt(syscall.Handle(fd), syscall.SOL_SOCKET, syscall.SO_REUSEADDR, 1)
			})
			if err != nil {
				return err
			}
			return opErr
		},
	}

	conn, err := lc.ListenPacket(context.Background(), "udp4", udpAddrStr)
	if err != nil {
		return nil, err
	}

	return conn.(*net.UDPConn), nil
}
