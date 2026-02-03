package network

import (
	"errors"

	"industrial-edge-gateway/internal/driver/bacnet"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/priority"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/units"
	"industrial-edge-gateway/internal/driver/bacnet/helpers/data"
)

type Point struct {
	ObjectID         btypes.ObjectInstance `json:"object_id,omitempty"`
	ObjectType       btypes.ObjectType     `json:"object_type,omitempty"`
	WriteValue       interface{}
	WriteNull        bool
	WritePriority    uint8
	ReadPresentValue bool
	ReadPriority     bool
}

/*
***** GET point details *****
 */

type PointDetails struct {
	Name       string                `json:"name,omitempty"`
	Unit       uint32                `json:"unit,omitempty"`
	UnitString string                `json:"unit_string,omitempty"`
	ObjectID   btypes.ObjectInstance `json:"object_id,omitempty"`
	ObjectType btypes.ObjectType     `json:"object_type,omitempty"`
	PointType  string                `json:"point_type,omitempty"`
}

// PointDetails use this when wanting to read point name, units and so on
func (device *Device) PointDetails(pnt *Point) (resp *PointDetails, err error) {
	resp = &PointDetails{}
	obj := &Object{
		ObjectType: pnt.ObjectType,
		ObjectID:   pnt.ObjectID,
		ArrayIndex: bacnet.ArrayAll,
	}
	props := []btypes.PropertyType{btypes.PropObjectName, btypes.PropUnits} //TODO add in more
	for _, prop := range props {
		obj.Prop = prop
		if device.isPointBool(pnt) && prop == btypes.PropUnits {
			continue
		}
		read, _ := device.Read(obj)
		resp.ObjectType = pnt.ObjectType
		resp.PointType = pnt.ObjectType.String()
		resp.ObjectID = pnt.ObjectID
		switch prop {
		case btypes.PropObjectName:
			resp.Name = device.toStr(read)
		case btypes.PropUnits:
			resp.Unit = device.toUint32(read)
			resp.UnitString = units.Unit.String(units.Unit(resp.Unit))
		}
	}
	return resp, nil
}

/*
***** READS *****
 */

// PointReadFloat32 use this when wanting to read point values for an AI, AV, AO
func (device *Device) PointReadFloat32(pnt *Point) (float32, error) {
	if device.isPointFloat(pnt) {

	}
	obj := &Object{
		ObjectID:   pnt.ObjectID,
		ObjectType: pnt.ObjectType,
		Prop:       btypes.PropPresentValue,
		ArrayIndex: bacnet.ArrayAll,
	}

	read, err := device.Read(obj)
	if err != nil {
		return 0, err
	}
	return device.toFloat(read), nil
}

// PointReadPriority use this when wanting to read point values for an AI, AV, AO
func (device *Device) PointReadPriority(pnt *Point) (pri *priority.Float32, err error) {
	if device.isPointWriteable(pnt) {

	}
	pri = &priority.Float32{}
	obj := &Object{
		ObjectID:   pnt.ObjectID,
		ObjectType: pnt.ObjectType,
		Prop:       btypes.PropPriorityArray,
		ArrayIndex: bacnet.ArrayAll,
	}

	read, err := device.Read(obj)
	if err != nil {
		return pri, err
	}
	return priority.BuildFloat32(read, pnt.ObjectType), nil
}

// PointReadBool use this when wanting to read point values for an BI, BV, BO
func (device *Device) PointReadBool(pnt *Point) (uint32, error) {
	if !device.isPointBool(pnt) {

	}
	obj := &Object{
		ObjectID:   pnt.ObjectID,
		ObjectType: pnt.ObjectType,
		Prop:       btypes.PropPresentValue,
		ArrayIndex: bacnet.ArrayAll,
	}

	read, err := device.Read(obj)
	if err != nil {
		return 0, err
	}
	return device.toUint32(read), nil
}

// PointReleasePriority use this when releasing a priority
func (device *Device) PointReleasePriority(pnt *Point, pri uint8) error {
	if pnt == nil {
		return errors.New("invalid point to PointReleasePriority()")
	}
	if pri > 16 || pri < 1 {
		return errors.New("invalid priority to PointReleasePriority()")
	}
	write := &Write{
		ObjectID:      pnt.ObjectID,
		ObjectType:    pnt.ObjectType,
		Prop:          btypes.PropPresentValue,
		WriteNull:     true,
		WritePriority: pri,
	}
	err := device.Write(write)
	if err != nil {
		return err
	}
	return nil
}

/*
***** WRITES *****
 */

// PointWriteAnalogue use this when wanting to write a new value for an AV, AO
func (device *Device) PointWriteAnalogue(pnt *Point, value float32) error {
	if device.isPointFloat(pnt) {

	}
	write := &Write{
		ObjectID:      pnt.ObjectID,
		ObjectType:    pnt.ObjectType,
		Prop:          btypes.PropPresentValue,
		WriteValue:    value,
		WritePriority: pnt.WritePriority,
	}
	err := device.Write(write)
	if err != nil {
		return err
	}
	return nil
}

// PointWriteBool use this when wanting to write a new value for an BV, AO
func (device *Device) PointWriteBool(pnt *Point, value uint32) error {
	if device.isPointFloat(pnt) {

	}
	write := &Write{
		ObjectID:      pnt.ObjectID,
		ObjectType:    pnt.ObjectType,
		Prop:          btypes.PropPresentValue,
		WriteValue:    value,
		WritePriority: pnt.WritePriority,
	}
	err := device.Write(write)
	if err != nil {
		return err
	}
	return nil
}

/*
***** HELPERS *****
 */

func (device *Device) toFloat(d btypes.PropertyData) float32 {
	_, out := data.ToFloat32(d)
	return out
}

func (device *Device) ToBitString(d btypes.PropertyData) *btypes.BitString {
	_, out := data.ToBitString(d)
	return out
}

func (device *Device) toUint32(d btypes.PropertyData) uint32 {
	_, out := data.ToUint32(d)
	return out
}

func (device *Device) toInt(d btypes.PropertyData) int {
	_, out := data.ToInt(d)
	return out
}

func (device *Device) toBool(d btypes.PropertyData) bool {
	_, out := data.ToBool(d)
	return out
}

func (device *Device) toStr(d btypes.PropertyData) string {
	_, out := data.ToStr(d)
	return out
}

func (device *Device) isPointWriteable(pnt *Point) (ok bool) {
	if pnt.ObjectType != btypes.BinaryOutput {
		return true
	}
	if pnt.ObjectType != btypes.BinaryValue {
		return true
	}
	if pnt.ObjectType != btypes.AnalogOutput {
		return true
	}
	if pnt.ObjectType != btypes.AnalogOutput {
		return true
	}
	if pnt.ObjectType != btypes.MultiStateOutput {
		return true
	}
	if pnt.ObjectType != btypes.MultiStateValue {
		return true
	}
	return false
}

func (device *Device) isPointFloat(pnt *Point) (ok bool) {
	if pnt.ObjectType == btypes.AnalogInput {
		return true
	}
	if pnt.ObjectType == btypes.AnalogOutput {
		return true
	}
	if pnt.ObjectType == btypes.AnalogValue {
		return true
	}
	return false
}

func (device *Device) isPointBool(pnt *Point) (ok bool) {
	if pnt.ObjectType == btypes.BinaryInput {
		return true
	}
	if pnt.ObjectType == btypes.BinaryOutput {
		return true
	}
	if pnt.ObjectType == btypes.BinaryValue {
		return true
	}
	return false
}
