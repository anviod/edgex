package network

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	segmentation2 "industrial-edge-gateway/internal/driver/bacnet/btypes/segmentation"

	//"github.com/ibuilding-x/driver-box/internal/plugins/bacnet/bacnet"

	"testing"
)

var iface = "wlp0s20f3"
var NetworkDevicePort = 47808
var deviceIP = "192.168.15.202"
var deviceID = 202
var networkNumber = 0
var macMSTP = 0
var segmentation = segmentation2.SegmentedBoth
var MaxApdu uint32 = btypes.MaxAPDU1476
var storeID = "my-id"

/*
MaxApdu
0 = 50
1 = 128
2 = 206 jci PCG
3 = 480 honeywell spyder
4 = 1024
5 = 1476  easyIO-30p when over IP

BACnetSegmentation:
segmented-both:0
segmented-transmit:1
segmented-receive:2
no-segmentation: 3
*/

func TestWhoIs(t *testing.T) {

	client, err := New(&Network{Interface: iface, Port: NetworkDevicePort})
	if err != nil {
		fmt.Println("ERR-client", err)
		return
	}
	defer client.NetworkClose()
	go client.NetworkRun()

	wi := &bacnet.WhoIsOpts{
		High:            0,
		Low:             0,
		GlobalBroadcast: true,
		NetworkNumber:   0,
	}

	whoIs, err := client.Whois(wi)
	if err != nil {
		fmt.Println("ERR-whoIs", err)
		return
	}

	for _, dev := range whoIs {
		fmt.Println(dev.ID)
		fmt.Println(dev.Vendor)
	}

}

func TestReadObj(t *testing.T) {

	NetworkDevice, err := New(&Network{Interface: iface, Port: NetworkDevicePort})
	if err != nil {
		fmt.Println("ERR-client", err)
		return
	}
	defer NetworkDevice.NetworkClose()
	go NetworkDevice.NetworkRun()

	device, err := NewDevice(NetworkDevice, &Device{Ip: deviceIP, DeviceID: deviceID, NetworkNumber: networkNumber, MacMSTP: macMSTP, MaxApdu: MaxApdu, Segmentation: uint32(segmentation)})
	if err != nil {
		return
	}

	obj := &Object{
		ObjectID:   1,
		ObjectType: btypes.AnalogInput,
		Prop:       btypes.PropUnits,
		ArrayIndex: btypes.ArrayAll, //btypes.ArrayAll

	}

	out, err := device.Read(obj)
	fmt.Println(err)
	fmt.Println(out)
	//fmt.Println("DATA", out.Object.Properties[0].Data)

}

func TestWriteObj(t *testing.T) {

	NetworkDevice, err := New(&Network{Interface: iface, Port: NetworkDevicePort})
	if err != nil {
		fmt.Println("ERR-client", err)
		return
	}
	defer NetworkDevice.NetworkClose()
	go NetworkDevice.NetworkRun()

	device, err := NewDevice(NetworkDevice, &Device{Ip: deviceIP, DeviceID: deviceID})
	if err != nil {
		return
	}

	device.Write(&Write{ObjectID: 1234, ObjectType: btypes.DeviceType, Prop: btypes.PropObjectName, WriteValue: "aidan test"})

}
