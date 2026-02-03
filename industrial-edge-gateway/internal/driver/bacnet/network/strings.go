package network

import (
	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

// ReadString to read a string like objectName
func (device *Device) ReadString(obj *Object) (string, error) {
	read, err := device.Read(obj)
	if err != nil {
		return "", err
	}
	return device.toStr(read), nil
}

func (device *Device) ReadDeviceName(ObjectID btypes.ObjectInstance) (string, error) {
	obj := &Object{
		ObjectID:   ObjectID,
		ObjectType: btypes.DeviceType,
		Prop:       btypes.PropObjectName,
		ArrayIndex: bacnet.ArrayAll,
	}
	read, err := device.Read(obj)
	if err != nil {
		return "", err
	}
	return device.toStr(read), nil
}

func (device *Device) WriteDeviceName(ObjectID btypes.ObjectInstance, value string) error {
	write := &Write{
		ObjectID:   ObjectID,
		ObjectType: btypes.DeviceType,
		Prop:       btypes.PropObjectName,
		WriteValue: value,
	}
	err := device.Write(write)
	if err != nil {
		return err
	}
	return nil
}

func (device *Device) ReadPointName(pnt *Point) (string, error) {
	obj := &Object{
		ObjectID:   pnt.ObjectID,
		ObjectType: pnt.ObjectType,
		Prop:       btypes.PropObjectName,
		ArrayIndex: bacnet.ArrayAll,
	}
	read, err := device.Read(obj)
	if err != nil {
		return "", err
	}
	return device.toStr(read), nil
}

func (device *Device) WritePointName(pnt *Point, value string) error {
	write := &Write{
		ObjectID:   pnt.ObjectID,
		ObjectType: pnt.ObjectType,
		Prop:       btypes.PropObjectName,
		WriteValue: value,
	}
	err := device.Write(write)
	if err != nil {
		return err
	}

	return nil
}
