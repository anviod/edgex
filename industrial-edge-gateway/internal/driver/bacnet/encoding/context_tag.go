package encoding

import "industrial-edge-gateway/internal/driver/bacnet/btypes"

/* refer to https://github.com/bacnet-stack/bacnet-stack/blob/bacnet-stack-0.9.1/src/bacapp.c#L583 */
/* returns the fixed tag type for certain context tagged properties */
func tagTypeInContext(property btypes.PropertyType, tagNumber uint8) uint8 {
	tag := tagNumber
	switch property {
	case btypes.PROP_ACTUAL_SHED_LEVEL:
	case btypes.PROP_REQUESTED_SHED_LEVEL:
	case btypes.PROP_EXPECTED_SHED_LEVEL:
		switch tagNumber {
		case 0, 1:
			tag = tagUint
		case 2:
			tag = tagReal
		}
	case btypes.PROP_ACTION:
		switch tagNumber {
		case 0, 1:
			tag = tagObjectID
		case 2:
			tag = tagEnumerated
		case 3, 5, 6:
			tag = tagUint
		case 7, 8:
			tag = tagBool
		case 4: /* propertyValue: abstract syntax */
		}
	case btypes.PROP_LIST_OF_GROUP_MEMBERS:
		/* Sequence of ReadAccessSpecification */
		switch tagNumber {
		case 0:
			tag = tagObjectID
		}
	case btypes.PROP_EXCEPTION_SCHEDULE:
		switch tagNumber {
		case 1:
			tag = tagObjectID
		case 3:
			tag = tagUint
		case 0: /* calendarEntry: abstract syntax + context */
		case 2: /* list of BACnetTimeValue: abstract syntax */
		}
		break
	case btypes.PROP_LOG_DEVICE_OBJECT_PROPERTY:
		switch tagNumber {
		case 0: /* Object ID */
			fallthrough
		case 3: /* Device ID */
			tag = tagObjectID
		case 1: /* Property ID */
			tag = tagEnumerated
		case 2: /* Array index */
			tag = tagUint
		}
		break
	case btypes.PROP_SUBORDINATE_LIST:
		/* BACnetARRAY[N] of BACnetDeviceObjectReference */
		switch tagNumber {
		case 0: /* Optional Device ID */
			fallthrough
		case 1: /* Object ID */
			tag = tagObjectID
		}
	case btypes.PROP_RECIPIENT_LIST:
		/* List of BACnetDestination */
		switch tagNumber {
		case 0: /* Device Object ID */
			tag = tagObjectID
		case 1:
			/* 2015.08.22 EKH 135-2012 pg 708
			   todo - Context 1 in Recipient list would be a BACnetAddress, not coded yet...
			   BACnetRecipient::= CHOICE {
			        device  [0] BACnetObjectIdentifier,
			        address  [1] BACnetAddress
			         }
			*/
		}
		break
	case btypes.PROP_ACTIVE_COV_SUBSCRIPTIONS:
		/* BACnetCOVSubscription */
		switch tagNumber {
		case 0: /* BACnetRecipientProcess */
		case 1: /* BACnetObjectPropertyReference */
		case 2: /* issueConfirmedNotifications */
			tag = tagBool
		case 3: /* timeRemaining */
			tag = tagUint
		case 4: /* covIncrement */
			tag = tagReal
		}
	}

	return tag
}
