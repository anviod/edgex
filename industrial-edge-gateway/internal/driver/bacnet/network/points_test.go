package network

import (
	"fmt"
	"testing"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	pprint "industrial-edge-gateway/internal/driver/bacnet/helpers/print"
)

func TestPointDetails(t *testing.T) {

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
		ObjectID:   2,
		ObjectType: btypes.AnalogInput,
	}

	readFloat64, err := device.PointDetails(pnt)
	if err != nil {
		//return
	}

	fmt.Println(readFloat64, err)

}

func TestRead(t *testing.T) {

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

	readFloat64, err := device.PointReadFloat32(pnt)
	if err != nil {
		return
	}

	fmt.Println(readFloat64, err)

}

func TestReadWrite(t *testing.T) {

	localDevice, err := New(&Network{Interface: iface, Port: 47809})
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
		ObjectID:         1,
		ObjectType:       btypes.AnalogOutput,
		WriteValue:       nil,
		WriteNull:        false,
		WritePriority:    15,
		ReadPresentValue: false,
		ReadPriority:     false,
	}

	err = device.PointWriteAnalogue(pnt, 11)
	if err != nil {
		//return
	}
	fmt.Println(err)
	readFloat64, err := device.PointReadFloat32(pnt)
	if err != nil {
		return
	}

	fmt.Println(readFloat64, err)

}

func TestPointReleasePriority(t *testing.T) {

	localDevice, err := New(&Network{Interface: iface, Port: 47809})
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
		ObjectID:         1,
		ObjectType:       btypes.AnalogOutput,
		WriteValue:       nil,
		WriteNull:        false,
		WritePriority:    15,
		ReadPresentValue: false,
		ReadPriority:     false,
	}

	err = device.PointReleasePriority(pnt, 15)
	if err != nil {
		//return
	}

}

func TestReadPri(t *testing.T) {

	localDevice, err := New(&Network{Interface: iface, Port: 47809})
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

	fmt.Println(err)
	readFloat64, err := device.PointReadPriority(pnt)
	if err != nil {
		return
	}
	pprint.PrintJOSN(readFloat64)

}
