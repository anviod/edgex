package network

import (
	"fmt"

	//"github.com/ibuilding-x/driver-box/internal/plugins/bacnet/bacnet"

	"testing"

	pprint "industrial-edge-gateway/internal/driver/bacnet/helpers/print"
)

func TestDiscover(t *testing.T) {

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

	objects, err := device.DeviceObjects(202, true)
	if err != nil {
		return
	}
	pprint.PrintJOSN(objects)

}

func TestGetPointsList(t *testing.T) {

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

	objects, err := device.GetDevicePoints(202)
	if err != nil {
		return
	}
	pprint.PrintJOSN(objects)

}
