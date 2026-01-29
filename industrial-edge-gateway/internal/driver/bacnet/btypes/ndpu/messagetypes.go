package ndpu

type NetworkMessageType uint8

//go:generate stringer -type=NetworkMessageType
const (
	WhoIsRouterToNetwork NetworkMessageType = 0x00
	IamRouterToNetwork   NetworkMessageType = 0x01
	WhatIsNetworkNumber  NetworkMessageType = 0x12
	NetworkIs            NetworkMessageType = 0x13
)
