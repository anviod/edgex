package network

import (
	"errors"
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/helpers/store"
)

//var memDb *store.Handler

type Store struct{}

var BacStore *store.Handler

func NewStore() *Store {
	BacStore = store.Init()
	s := &Store{}
	return s
}

// UpdateNetwork updated a cached
func (store *Store) UpdateNetwork(storeID string, net *Network) error {
	//first close the client
	net.NetworkClose()
	cb := &bacnet.ClientBuilder{
		Interface:  net.Interface,
		Ip:         net.Ip,
		Port:       net.Port,
		SubnetCIDR: net.SubnetCIDR,
	}
	bc, err := bacnet.NewClient(cb)
	if err != nil {
		return err
	}
	net.Client = bc
	if BacStore != nil {
		BacStore.Set(storeID, net, -1)
	}
	return nil
}

func (store *Store) GetNetwork(uuid string) (*Network, error) {
	cli, ok := BacStore.Get(uuid)
	if !ok {
		return nil, errors.New(fmt.Sprintf("bacnet: no network found with uuid:%s", uuid))
	}
	parse := cli.(*Network)
	return parse, nil
}

// UpdateDevice updated a cached device
func (store *Store) UpdateDevice(storeID string, net *Network, device *Device) error {
	var err error
	dev := &btypes.Device{
		Ip:            device.Ip,
		DeviceID:      device.DeviceID,
		NetworkNumber: device.NetworkNumber,
		MacMSTP:       device.MacMSTP,
		MaxApdu:       device.MaxApdu,
		Segmentation:  btypes.Enumerated(device.Segmentation),
	}
	dev, err = btypes.NewDevice(dev)
	if err != nil {
		return err
	}
	if dev == nil {
		fmt.Println("dev is nil")
		return err
	}
	device.network = net.Client
	device.dev = *dev
	if BacStore != nil {
		BacStore.Set(storeID, device, -1)
	}
	//var err error
	//dev := &btypes.Device{
	//	Ip:            device.Ip,
	//	DeviceID:      device.DeviceID,
	//	NetworkNumber: device.NetworkNumber,
	//	MacMSTP:       device.MacMSTP,
	//	MaxApdu:       device.MaxApdu,
	//	Segmentation:  btypes.Enumerated(device.Segmentation),
	//}
	//fmt.Println("UPDATE store", storeID)
	//pprint.Print(device)
	//dev, err = btypes.NewDevice(dev)
	//if err != nil {
	//	return err
	//}
	//if dev == nil {
	//	fmt.Println("dev is nil")
	//	return err
	//}
	//device.network = device.network
	//device.dev = *dev
	//if BacStore != nil {
	//	BacStore.Set(storeID, device, -1)
	//}
	return nil
}

func (store *Store) GetDevice(uuid string) (*Device, error) {
	cli, ok := BacStore.Get(uuid)
	if !ok {
		return nil, errors.New(fmt.Sprintf("bacnet: no device found with uuid:%s", uuid))
	}
	parse := cli.(*Device)
	return parse, nil
}
