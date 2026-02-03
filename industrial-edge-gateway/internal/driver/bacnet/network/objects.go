package network

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/helpers/data"
	"log"
)

// DeviceObjects get device objects
func (device *Device) DeviceObjects(deviceID btypes.ObjectInstance, checkAPDU bool) (objectList []btypes.ObjectID, err error) {
	if checkAPDU { //check set the maxADPU and Segmentation
		whoIs, err := device.Whois(&bacnet.WhoIsOpts{
			High:            int(deviceID),
			Low:             int(deviceID),
			GlobalBroadcast: true,
		})
		if err != nil {
			return nil, err
		}
		for _, dev := range whoIs {
			if dev.ID.Instance == deviceID {
				device.MaxApdu = dev.MaxApdu
				device.Segmentation = uint32(dev.Segmentation)
			}
		}
		log.Printf("bacnet.DeviceObjects() do whois on deviceID: %v maxADPU: %v Segmentation: %v", deviceID, device.MaxApdu, device.Segmentation)
	}

	device.GetDeviceDetails(deviceID) //TODO remove this as its just here for testing

	//get object list
	obj := &Object{
		ObjectID:   deviceID,
		ObjectType: btypes.DeviceType,
		Prop:       btypes.PropObjectList,
		ArrayIndex: btypes.ArrayAll, //btypes.ArrayAll

	}
	out, err := device.Read(obj)
	if err != nil { //this is a device that would have a low maxADPU
		fmt.Println("DeviceObjects, now read here", err)
		return device.deviceObjectsBuilder(deviceID)

	}
	if len(out.Object.Properties) == 0 {
		fmt.Println("No value returned")
		return nil, nil
	}
	_, ids := data.ToArr(out)
	for _, id := range ids {
		objectID := id.(btypes.ObjectID)
		objectList = append(objectList, objectID)
	}
	return objectList, nil
}

// DeviceObjectsBuilder this is used when a device can't send the object list in the fully ArrayIndex
// it first reads the size of the object list and then loops the list to build an object list
func (device *Device) deviceObjectsBuilder(deviceID btypes.ObjectInstance) (objectList []btypes.ObjectID, err error) {
	//get object list
	obj := &Object{
		ObjectID:   deviceID,
		ObjectType: btypes.DeviceType,
		Prop:       btypes.PropObjectList,
		ArrayIndex: 0, //start at 0 and then loop through
	}
	out, err := device.Read(obj)
	if err != nil {
		log.Printf("[ERROR] failed to read object list in deviceObjectsBuilder() err: %v", err)
		return nil, err
	}
	_, o := data.ToUint32(out)
	log.Printf("[INFO] size of object-list: %v", o)
	var listLen = int(o)
	for i := 1; i <= listLen; i++ {
		obj.ArrayIndex = uint32(i)
		out, _ := device.Read(obj)
		objectID := out.Object.Properties[0].Data.(btypes.ObjectID)
		objectList = append(objectList, objectID)
	}
	return objectList, err

}
