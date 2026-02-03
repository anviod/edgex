package network

import (
	"industrial-edge-gateway/internal/driver/bacnet"
	"log"
)

type Network struct {
	Interface  string
	Ip         string
	Port       int
	SubnetCIDR int
	StoreID    string
	Client     bacnet.Client
}

// New returns a new instance of bacnet network
func New(net *Network) (*Network, error) {
	cb := &bacnet.ClientBuilder{
		Interface:  net.Interface,
		Ip:         net.Ip,
		Port:       net.Port,
		SubnetCIDR: net.SubnetCIDR,
	}

	bc, err := bacnet.NewClient(cb)
	if err != nil {
		return nil, err
	}
	net.Client = bc
	if BacStore != nil {
		BacStore.Set(net.StoreID, net, -1)
	}
	return net, nil
}

func (net *Network) NetworkClose() {
	if net.Client != nil {
		log.Printf("close bacnet network")
		err := net.Client.Close()
		if err != nil {
			log.Printf("close bacnet network err:%s", err.Error())
			return
		}
	}
}

func (net *Network) IsRunning() bool {
	if net.Client != nil {
		return net.Client.IsRunning()
	}
	return false
}

func (net *Network) NetworkRun() {
	if net.Client != nil {
		go net.Client.ClientRun()
	}
}

// func (net *Network) store() {

// }
