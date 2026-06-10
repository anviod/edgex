package network

import (
	"github.com/anviod/edgex/internal/driver/bacnet"
	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/driver/bacnet/btypes/null"
)

type Write struct {
	DeviceId      string
	PointName     string
	ObjectID      btypes.ObjectInstance
	ObjectType    btypes.ObjectType
	Prop          btypes.PropertyType
	WriteValue    interface{}
	WriteNull     bool
	WritePriority uint8
}

func (device *Device) Write(write *Write) error {
	var err error
	writeValue := write.WriteValue

	rp := btypes.PropertyData{
		Object: btypes.Object{
			ID: btypes.ObjectID{
				Type:     write.ObjectType,
				Instance: write.ObjectID,
			},
			Properties: []btypes.Property{
				{
					Type:       write.Prop,
					ArrayIndex: bacnet.ArrayAll,
					Priority:   btypes.NPDUPriority(write.WritePriority),
				},
			},
		},
	}

	if write.WriteNull {
		writeValue = null.Null{}
	}

	rp.Object.Properties[0].Data = writeValue

	err = device.network.WriteProperty(device.dev, rp)

	if err != nil {
		return err
	}
	return nil
}
