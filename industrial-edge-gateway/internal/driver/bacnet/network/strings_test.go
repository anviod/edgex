package network

import (
	"fmt"
	"testing"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func TestDevice_ReadPointName(t *testing.T) {

	localDevice, err := New(&Network{Interface: iface, Port: 47808})
	if err != nil {
		fmt.Println("ERR-client", err)
		return
	}
	defer localDevice.NetworkClose()
	go localDevice.NetworkRun()

	device, err := NewDevice(localDevice, &Device{Ip: deviceIP, DeviceID: deviceID})
	if err != nil {
		return
	}

	pnt := &Point{
		ObjectID:   1,
		ObjectType: btypes.AnalogOutput,
	}
	read, err := device.ReadPointName(pnt)
	fmt.Println(err)
	fmt.Println(read, err)

}

func TestDevice_WritePointName(t *testing.T) {

	localDevice, err := New(&Network{Interface: iface, Port: 47808})
	if err != nil {
		fmt.Println("ERR-client", err)
		return
	}
	defer localDevice.NetworkClose()
	go localDevice.NetworkRun()

	device, err := NewDevice(localDevice, &Device{Ip: deviceIP, DeviceID: deviceID})
	if err != nil {
		return
	}

	pnt := &Point{
		ObjectID:   1,
		ObjectType: btypes.AnalogOutput,
	}

	err = device.WritePointName(pnt, "new-name")
	fmt.Println(err)
	if err != nil {
		//return
	}
}
