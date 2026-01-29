package btypes

import (
	"fmt"

	ip2bytes "industrial-edge-gateway/internal/driver/bacnet/helpers/ipbytes"
	"industrial-edge-gateway/internal/driver/bacnet/helpers/validation"
)

type Enumerated uint32

type IAm struct {
	ID           ObjectID   `json:"object_id"`
	MaxApdu      uint32     `json:"max_apdu"`
	Segmentation Enumerated `json:"segmentation"`
	Vendor       uint32     `json:"vendor"`
	Addr         Address    `json:"addr"`
}

type Device struct {
	ID            ObjectID   `json:"-"`
	DeviceID      int        `json:"device_id"`
	Ip            string     `json:"ip"`
	Port          int        `json:"port"`
	NetworkNumber int        `json:"network_number"`
	MacMSTP       int        `json:"mac_mstp"`
	MaxApdu       uint32     `json:"max_apdu"` //maxApduLengthAccepted	62
	Segmentation  Enumerated `json:"segmentation"`
	Vendor        uint32     `json:"vendor"`
	Addr          Address    `json:"address"`
	Objects       ObjectMap  `json:"-"`
	SupportsRPM   bool       `json:"supports_rpm"` //support read prob multiple
	SupportsWPM   bool       `json:"supports_wpm"` //support read prob multiple
}

/*
If the device doesn't support segmentation then we need to read for example the device object list in chunks of the array index
Properties: []btypes.Property{
	{
		Type:       prop,
		ArrayIndex: bacnet.ArrayAll, So this needs to be changed as an example 0:returns AI:1, 1:returns AI:2 and so on
	},
},

BACnetSegmentation:
segmented-both:0
segmented-transmit:1
segmented-receive:2
no-segmentation: 3

MaxApdu
0: 50
1: 128
2: 206 jci PCG
3: 480 honeywell spyder
4: 1024
5: 1476 easyIO-30p when over IP (same device when over MSTP is 480)

*/

// NewDevice returns a new instance of ta bacnet device
func NewDevice(device *Device) (*Device, error) {

	port := device.Port
	//check ip
	ok := validation.ValidIP(device.Ip)
	if !ok {
		fmt.Println("fail ip")
	}
	//check port
	if port == 0 {
		port = 0xBAC0
	}
	ok = validation.ValidPort(port)
	if !ok {
		fmt.Println("fail port")
	}

	ip, err := ip2bytes.New(device.Ip, uint16(port))
	if err != nil {
		fmt.Println("fail ip2bytes")
		return nil, err
	}
	addr := Address{
		Net: uint16(device.NetworkNumber),
		Mac: ip,
		Adr: []uint8{},      //qygeng:uint8(device.MacMSTP)
		Len: uint8(len(ip)), //qygeng
		Id:  uint16(device.DeviceID),
	}
	object := ObjectID{
		Type:     DeviceType,
		Instance: ObjectInstance(device.DeviceID),
	}
	device.ID = object
	device.Addr = addr
	return device, nil
}

// ObjectSlice returns all the objects in the device as a slice (not thread-safe)
func (dev *Device) ObjectSlice() []Object {
	var objs []Object
	for _, objMap := range dev.Objects {
		for _, o := range objMap {
			objs = append(objs, o)
		}
	}
	return objs
}

// CheckADPU device max ADPU len (mstp can be > 480, and IP > 1476)
func (dev *Device) CheckADPU() error {
	errMsg := "device.CheckADPU() incorrect ADPU size:"
	size := dev.MaxApdu
	if size == 0 {
		return fmt.Errorf("%s %d", errMsg, size)
	}
	return nil
}
