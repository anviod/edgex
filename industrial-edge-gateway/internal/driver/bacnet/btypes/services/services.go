package services

import "fmt"

/*
Device Services Supported
Type bitSting
This property indicates which standardized protocol services are supported by this device's protocol implementation.
*/

// Supported eg: Name acknowledgeAlarm Number 0 Index 1
type Supported struct {
	Name      string //name of service
	Number    uint16 //prop number
	Index     int    //position in the bitString
	Supported bool   //feature supported boolean
}

var acknowledgeAlarm = Supported{
	Name:   "acknowledgeAlarm",
	Number: 0,
	Index:  0,
}

var confirmedCOVNotification = Supported{
	Name:   "confirmedCOVNotification",
	Number: 1,
	Index:  1,
}

var confirmedEventNotification = Supported{
	Name:   "confirmedEventNotification",
	Number: 2,
	Index:  2,
}

var getAlarmSummary = Supported{
	Name:   "getAlarmSummary",
	Number: 3,
	Index:  3,
}

var getEnrollmentSummary = Supported{
	Name:   "getEnrollmentSummary",
	Number: 4,
	Index:  4,
}

var subscribeCOV = Supported{
	Name:   "subscribeCOV",
	Number: 5,
	Index:  5,
}

var atomicReadFile = Supported{
	Name:   "atomicReadFile",
	Number: 6,
	Index:  6,
}

var atomicWriteFile = Supported{
	Name:   "atomicWriteFile",
	Number: 7,
	Index:  7,
}

var addListElement = Supported{
	Name:   "addListElement",
	Number: 8,
	Index:  8,
}

var removeListElement = Supported{
	Name:   "removeListElement",
	Number: 9,
	Index:  9,
}

var createObject = Supported{
	Name:   "createObject",
	Number: 10,
	Index:  10,
}

var deleteObject = Supported{
	Name:   "deleteObject",
	Number: 11,
	Index:  11,
}

var readProperty = Supported{
	Name:   "readProperty",
	Number: 12,
	Index:  12,
}

var readPropertyMultiple = Supported{
	Name:   "readPropertyMultiple",
	Number: 14,
	Index:  13,
}
var writeProperty = Supported{
	Name:   "writeProperty",
	Number: 15,
	Index:  14,
}

var writePropertyMultiple = Supported{
	Name:   "writePropertyMultiple",
	Number: 16,
	Index:  15,
}

var deviceCommunicationControl = Supported{
	Name:   "deviceCommunicationControl",
	Number: 17,
	Index:  16,
}

var confirmedPrivateTransfer = Supported{
	Name:   "confirmedPrivateTransfer",
	Number: 18,
	Index:  17,
}

var confirmedTextMessage = Supported{
	Name:   "confirmedTextMessage",
	Number: 19,
	Index:  18,
}

var reinitializeDevice = Supported{
	Name:   "reinitializeDevice",
	Number: 20,
	Index:  19,
}

var vtOpen = Supported{
	Name:   "vtOpen",
	Number: 21,
	Index:  20,
}

var vtClose = Supported{
	Name:   "vtClose",
	Number: 22,
	Index:  21,
}

var vtData = Supported{
	Name:   "vtData",
	Number: 23,
	Index:  22,
}

var iAm = Supported{
	Name:   "iAm",
	Number: 26,
	Index:  23,
}

var iHave = Supported{
	Name:   "iHave",
	Number: 27,
	Index:  24,
}

var unconfirmedCOVNotification = Supported{
	Name:   "unconfirmedCOVNotification",
	Number: 28,
	Index:  25,
}

var unconfirmedEventNotification = Supported{
	Name:   "unconfirmedEventNotification",
	Number: 29,
	Index:  26,
}

var unconfirmedPrivateTransfer = Supported{
	Name:   "unconfirmedPrivateTransfer",
	Number: 30,
	Index:  27,
}

var unconfirmedTextMessage = Supported{
	Name:   "unconfirmedTextMessage",
	Number: 31,
	Index:  28,
}

var timeSynchronization = Supported{
	Name:   "timeSynchronization",
	Number: 32,
	Index:  29,
}

var whoHas = Supported{
	Name:   "whoHas",
	Number: 33,
	Index:  30,
}

var whoIs = Supported{
	Name:   "whoIs",
	Number: 34,
	Index:  31,
}

var readRange = Supported{
	Name:   "readRange",
	Number: 35,
	Index:  32,
}

var utcTimeSynchronization = Supported{
	Name:   "utcTimeSynchronization",
	Number: 36,
	Index:  33,
}

var lifeSafetyOperation = Supported{
	Name:   "lifeSafetyOperation",
	Number: 37,
	Index:  34,
}

var subscribeCOVProperty = Supported{
	Name:   "subscribeCOVProperty",
	Number: 38,
	Index:  35,
}

var getEventInformation = Supported{
	Name:   "getEventInformation",
	Number: 39,
	Index:  36,
}

var writeGroup = Supported{
	Name:   "writeGroup",
	Number: 40,
	Index:  37,
}

var supportedList = map[Supported]string{
	acknowledgeAlarm:             acknowledgeAlarm.Name,
	confirmedCOVNotification:     confirmedCOVNotification.Name,
	confirmedEventNotification:   confirmedEventNotification.Name,
	getAlarmSummary:              getAlarmSummary.Name,
	getEnrollmentSummary:         getEnrollmentSummary.Name,
	subscribeCOV:                 subscribeCOV.Name,
	atomicReadFile:               atomicReadFile.Name,
	atomicWriteFile:              atomicWriteFile.Name,
	addListElement:               addListElement.Name,
	removeListElement:            removeListElement.Name,
	createObject:                 createObject.Name,
	deleteObject:                 deleteObject.Name,
	readProperty:                 readProperty.Name,
	readPropertyMultiple:         readPropertyMultiple.Name,
	writeProperty:                writeProperty.Name,
	writePropertyMultiple:        writePropertyMultiple.Name,
	deviceCommunicationControl:   deviceCommunicationControl.Name,
	confirmedPrivateTransfer:     confirmedPrivateTransfer.Name,
	confirmedTextMessage:         confirmedTextMessage.Name,
	reinitializeDevice:           reinitializeDevice.Name,
	vtOpen:                       vtOpen.Name,
	vtClose:                      vtClose.Name,
	vtData:                       vtData.Name,
	iAm:                          iAm.Name,
	iHave:                        iHave.Name,
	unconfirmedCOVNotification:   unconfirmedCOVNotification.Name,
	unconfirmedEventNotification: unconfirmedEventNotification.Name,
	unconfirmedPrivateTransfer:   unconfirmedPrivateTransfer.Name,
	unconfirmedTextMessage:       unconfirmedTextMessage.Name,
	timeSynchronization:          timeSynchronization.Name,
	whoHas:                       whoHas.Name,
	whoIs:                        whoIs.Name,
	readRange:                    readRange.Name,
	utcTimeSynchronization:       utcTimeSynchronization.Name,
	lifeSafetyOperation:          lifeSafetyOperation.Name,
	subscribeCOVProperty:         subscribeCOVProperty.Name,
	getEventInformation:          getEventInformation.Name,
	writeGroup:                   writeGroup.Name,
}

func (support Supported) ListAll() map[Supported]string {
	return supportedList
}

func (support Supported) GetType(s string) *Supported {
	for typ, str := range supportedList {
		if s == str {
			return &typ
		}
	}
	return nil

}

func (support Supported) GetString(t Supported) string {
	s, ok := supportedList[t]
	if !ok {
		return fmt.Sprintf("Unknown (%s)", t.Name)
	}
	return fmt.Sprintf("%s", s)
}

// protocolServicesSupported	97
// bitString
const (
// acknowledgeAlarm           = 0
// confirmedCOVNotification   = 1
// confirmedEventNotification = 2
// getAlarmSummary            = 3
// getEnrollmentSummary       = 4
// subscribeCOV               = 5
// atomicReadFile    = 6
// atomicWriteFile   = 7
// addListElement    = 8
// removeListElement = 9
// createObject      = 10
// deleteObject      = 11
// readProperty               = 12
// readPropertyMultiple       = 14
// writeProperty              = 15
// writePropertyMultiple      = 16
// deviceCommunicationControl   = 17
// confirmedPrivateTransfer     = 18
// confirmedTextMessage         = 19
// reinitializeDevice           = 20
// vtOpen                       = 21
// vtClose                      = 22
// vtData                       = 23
// iAm                          = 26
// iHave                        = 27
// unconfirmedCOVNotification   = 28
// unconfirmedEventNotification = 29
// unconfirmedPrivateTransfer   = 30
// unconfirmedTextMessage       = 31
// timeSynchronization          = 32
// whoHas                       = 33
// whoIs                        = 34
// readRange                    = 35
// utcTimeSynchronization       = 36
// lifeSafetyOperation          = 37
// subscribeCOVProperty         = 38
// getEventInformation          = 39
// writeGroup                   = 40
)
