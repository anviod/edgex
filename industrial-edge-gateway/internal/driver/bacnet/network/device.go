package network

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

type Device struct {
	Ip            string
	Port          int
	DeviceID      int
	NetworkNumber int
	MacMSTP       int
	MaxApdu       uint32
	Segmentation  uint32
	StoreID       string
	dev           btypes.Device
	network       bacnet.Client
}

// NewDevice returns a new instance of ta bacnet device
func NewDevice(net *Network, device *Device) (*Device, error) {
	var err error
	if net == nil {
		fmt.Println("network can not be nil")
		return nil, err
	}
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
		return nil, err
	}
	if dev == nil {
		fmt.Println("dev is nil")
		return nil, err
	}
	device.network = net.Client
	device.dev = *dev
	if BacStore != nil {
		BacStore.Set(device.StoreID, device, -1)
	}
	return device, nil
}

// update attributes to internal btypes.Device
func (dev *Device) Update() error {
	bdev := &btypes.Device{
		Ip:            dev.Ip,
		DeviceID:      dev.DeviceID,
		NetworkNumber: dev.NetworkNumber,
		MacMSTP:       dev.MacMSTP,
		MaxApdu:       dev.MaxApdu,
		Segmentation:  btypes.Enumerated(dev.Segmentation),
	}
	bdev, err := btypes.NewDevice(bdev)
	if err != nil {
		return err
	}
	dev.dev = *bdev
	return nil
}
