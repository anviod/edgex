package btypes

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes/bacerr"
)

/*
Max ADPU sizes
0 = 50
1 = 128
2 = 206
3 = 480
4 = 1024
5 = 1476
*/

const MaxAPDU = 1476
const MaxAPDU128 = 128
const MaxAPDU206 = 206
const MaxAPDU480 = 480
const MaxAPDU1024 = 1024
const MaxAPDU1476 = 1476

type ServiceConfirmed uint8
type ServiceUnconfirmed uint8

const (
	ServiceUnconfirmedIAm               ServiceUnconfirmed = 0
	ServiceUnconfirmedIHave             ServiceUnconfirmed = 1
	ServiceUnconfirmedCOVNotification   ServiceUnconfirmed = 2
	ServiceUnconfirmedEventNotification ServiceUnconfirmed = 3
	ServiceUnconfirmedPrivateTransfer   ServiceUnconfirmed = 4
	ServiceUnconfirmedTextMessage       ServiceUnconfirmed = 5
	ServiceUnconfirmedTimeSync          ServiceUnconfirmed = 6
	ServiceUnconfirmedWhoHas            ServiceUnconfirmed = 7
	ServiceUnconfirmedWhoIs             ServiceUnconfirmed = 8
	ServiceUnconfirmedUTCTimeSync       ServiceUnconfirmed = 9
	ServiceUnconfirmedWriteGroup        ServiceUnconfirmed = 10
	MaxServiceUnconfirmed               ServiceUnconfirmed = 11

	/* Other services to be added as they are defined. */
	/* All choice values in this production are reserved */
	/* for definition by ASHRAE. */
	/* Proprietary extensions are made by using the */
	/* UnconfirmedPrivateTransfer service. See Clause 23. */
)

const (
	/* Alarm and Event Services */
	ServiceConfirmedAcknowledgeAlarm     ServiceConfirmed = 0
	ServiceConfirmedCOVNotification      ServiceConfirmed = 1
	ServiceConfirmedEventNotification    ServiceConfirmed = 2
	ServiceConfirmedGetAlarmSummary      ServiceConfirmed = 3
	ServiceConfirmedGetEnrollmentSummary ServiceConfirmed = 4
	ServiceConfirmedGetEventInformation  ServiceConfirmed = 29
	ServiceConfirmedSubscribeCOV         ServiceConfirmed = 5
	ServiceConfirmedSubscribeCOVProperty ServiceConfirmed = 28
	ServiceConfirmedLifeSafetyOperation  ServiceConfirmed = 27
	/* File Access Services */
	ServiceConfirmedAtomicReadFile  ServiceConfirmed = 6
	ServiceConfirmedAtomicWriteFile ServiceConfirmed = 7
	/* Object Access Services */
	ServiceConfirmedAddListElement      ServiceConfirmed = 8
	ServiceConfirmedRemoveListElement   ServiceConfirmed = 9
	ServiceConfirmedCreateObject        ServiceConfirmed = 10
	ServiceConfirmedDeleteObject        ServiceConfirmed = 11
	ServiceConfirmedReadProperty        ServiceConfirmed = 12
	ServiceConfirmedReadPropConditional ServiceConfirmed = 13
	ServiceConfirmedReadPropMultiple    ServiceConfirmed = 14
	ServiceConfirmedReadRange           ServiceConfirmed = 26
	ServiceConfirmedWriteProperty       ServiceConfirmed = 15
	ServiceConfirmedWritePropMultiple   ServiceConfirmed = 16
	/* Remote Device Management Services */
	ServiceConfirmedDeviceCommunicationControl ServiceConfirmed = 17
	ServiceConfirmedPrivateTransfer            ServiceConfirmed = 18
	ServiceConfirmedTextMessage                ServiceConfirmed = 19
	ServiceConfirmedReinitializeDevice         ServiceConfirmed = 20
	/* Virtual Terminal Services */
	ServiceConfirmedVTOpen  ServiceConfirmed = 21
	ServiceConfirmedVTClose ServiceConfirmed = 22
	ServiceConfirmedVTData  ServiceConfirmed = 23
	/* Security Services */
	ServiceConfirmedAuthenticate ServiceConfirmed = 24
	ServiceConfirmedRequestKey   ServiceConfirmed = 25
	/* Services added after 1995 */
	/* readRange (26) see Object Access Services */
	/* lifeSafetyOperation (27) see Alarm and Event Services */
	/* subscribeCOVProperty (28) see Alarm and Event Services */
	/* getEventInformation (29) see Alarm and Event Services */
	maxBACnetConfirmedService ServiceConfirmed = 30
)

// APDU - Application Protocol Data Unit
type APDU struct {
	DataType                  PDUType
	SegmentedMessage          bool
	MoreFollows               bool
	SegmentedResponseAccepted bool
	MaxSegs                   uint
	MaxApdu                   uint
	InvokeId                  uint8
	Sequence                  uint8
	WindowNumber              uint8
	Service                   ServiceConfirmed
	UnconfirmedService        ServiceUnconfirmed
	Error                     struct {
		Class bacerr.ErrorClass
		Code  bacerr.ErrorCode
	}

	// This is the raw data passed based on the service
	RawData []byte
}

// PDUType encompasses all valid pdus.
type PDUType uint8

// pdu requests
const (
	ConfirmedServiceRequest   PDUType = 0
	UnconfirmedServiceRequest PDUType = 0x10
	SimpleAck                 PDUType = 0x20
	ComplexAck                PDUType = 0x30
	SegmentAck                PDUType = 0x40
	Error                     PDUType = 0x50
	Reject                    PDUType = 0x60
	Abort                     PDUType = 0x70
)

// IsConfirmedServiceRequest checks to see if the APDU is in the list of known services
func (a *APDU) IsConfirmedServiceRequest() bool {
	return (0xF0 & a.DataType) == ConfirmedServiceRequest
}

func (s *ServiceConfirmed) String() string {
	switch *s {
	default:
		return fmt.Sprintf("Unknown %d", uint(*s))
	}
}
