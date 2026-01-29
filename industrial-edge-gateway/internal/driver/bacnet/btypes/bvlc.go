package btypes

// BACnet Virtual Link Control (BVLC)

// BVLCTypeBacnetIP is the only valid type for the BVLC layer as of 2002.
// Additional btypes may be added in the future
const BVLCTypeBacnetIP = 0x81

// BacFunc Function
type BacFunc byte

// List of possible BACnet functions
const (
	BacFuncResult                          BacFunc = 0
	BacFuncWriteBroadcastDistributionTable BacFunc = 1
	BacFuncBroadcastDistributionTable      BacFunc = 2
	BacFuncBroadcastDistributionTableAck   BacFunc = 3
	BacFuncForwardedNPDU                   BacFunc = 4
	BacFuncUnicast                         BacFunc = 10
	BacFuncBroadcast                       BacFunc = 11
)

type BVLC struct {
	Type     byte
	Function BacFunc

	// Length includes the length of Type, Function, and Length. (4 bytes) It also
	// has the length of the data field after
	Length uint16
	Data   []byte
}
