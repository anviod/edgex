package btypes

import "fmt"

type ObjectType uint16

const (
	TypeAnalogInput       = 0
	TypeAnalogOutput      = 1
	TypeAnalogValue       = 2
	TypeBinaryInput       = 3
	TypeBinaryOutput      = 4
	TypeBinaryValue       = 5
	TypeDeviceType        = 8
	TypeFile              = 10
	TypeMultiStateInput   = 13
	TypeMultiStateOutput  = 14
	TypeNotificationClass = 15
	TypeMultiStateValue   = 19
	TypeTrendLog          = 20
	TypeCharacterString   = 40
)

const (
	AnalogInput       ObjectType = 0
	AnalogOutput      ObjectType = 1
	AnalogValue       ObjectType = 2
	BinaryInput       ObjectType = 3
	BinaryOutput      ObjectType = 4
	BinaryValue       ObjectType = 5
	DeviceType        ObjectType = 8
	File              ObjectType = 10
	MultiStateInput   ObjectType = 13
	MultiStateOutput  ObjectType = 14
	NotificationClass ObjectType = 15
	MultiStateValue   ObjectType = 19
	TrendLog          ObjectType = 20
	CharacterString   ObjectType = 40
	LargeAnalogValue  ObjectType = 46
)

// 变量字典
const (
	AnalogInputStr       = "AnalogInput"
	AnalogOutputStr      = "AnalogOutput"
	AnalogValueStr       = "AnalogValue"
	BinaryInputStr       = "BinaryInput"
	BinaryOutputStr      = "BinaryOutput"
	BinaryValueStr       = "BinaryValue"
	Devicebtypestr       = "Device"
	FileStr              = "File"
	NotificationClassStr = "NotificationClass"
	MultiStateValueStr   = "MultiStateValue"
	MultiStateInputStr   = "MultiStateInput"
	MultiStateOutputStr  = "MultiStateOutput"
	TrendLogStr          = "TrendLog"
	CharacterStringStr   = "CharacterString"
	LargeAnalogValueStr  = "LargeAnalogValue"
)

var objTypeMap = map[ObjectType]string{
	AnalogInput:       AnalogInputStr,
	AnalogOutput:      AnalogOutputStr,
	AnalogValue:       AnalogValueStr,
	BinaryInput:       BinaryInputStr,
	BinaryOutput:      BinaryOutputStr,
	BinaryValue:       BinaryValueStr,
	DeviceType:        Devicebtypestr,
	File:              FileStr,
	NotificationClass: NotificationClassStr,
	MultiStateValue:   MultiStateValueStr,
	MultiStateInput:   MultiStateInputStr,
	MultiStateOutput:  MultiStateOutputStr,
	TrendLog:          TrendLogStr,
	CharacterString:   CharacterStringStr,
}

var objStrTypeMap = map[string]ObjectType{
	AnalogInputStr:       AnalogInput,
	AnalogOutputStr:      AnalogOutput,
	AnalogValueStr:       AnalogValue,
	BinaryInputStr:       BinaryInput,
	BinaryOutputStr:      BinaryOutput,
	BinaryValueStr:       BinaryValue,
	Devicebtypestr:       DeviceType,
	FileStr:              File,
	NotificationClassStr: NotificationClass,
	MultiStateValueStr:   MultiStateValue,
	MultiStateInputStr:   MultiStateInput,
	MultiStateOutputStr:  MultiStateOutput,
	TrendLogStr:          TrendLog,
	CharacterStringStr:   CharacterString,
	LargeAnalogValueStr:  LargeAnalogValue,
	// Kebab-case mappings for friendlier address strings
	"analog-input":       AnalogInput,
	"analog-output":      AnalogOutput,
	"analog-value":       AnalogValue,
	"binary-input":       BinaryInput,
	"binary-output":      BinaryOutput,
	"binary-value":       BinaryValue,
	"device":             DeviceType,
	"multi-state-input":  MultiStateInput,
	"multi-state-output": MultiStateOutput,
	"multi-state-value":  MultiStateValue,
}

func GetType(s string) ObjectType {
	t, ok := objStrTypeMap[s]
	if !ok {
		return 0
	}
	return t
}

func (t ObjectType) String() string {
	s, ok := objTypeMap[t]
	if !ok {
		return fmt.Sprintf("Unknown (%d)", t)
	}
	return s
}

type ObjectInstance uint32

type ObjectID struct {
	Type     ObjectType     `json:"type"`
	Instance ObjectInstance `json:"instance"`
}

// String returns a pretty print of the ObjectID structure
func (id ObjectID) String() string {
	return fmt.Sprintf("Instance: %d Type: %s", id.Instance, id.Type.String())
}

type Object struct {
	//Bacnet通讯点ID与逻辑点的映射关系： key:deviceSn,value: pointName
	Points      map[string]string
	Name        string
	Description string
	ID          ObjectID
	Properties  []Property `json:",omitempty"`
}
