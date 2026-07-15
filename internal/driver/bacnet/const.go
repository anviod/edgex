package bacnet

import "time"

// fail read or write retry count
const retryCount = 1

// MTSP
const defaultMTSPBAUD = 38400
const defaultMTSPMAC = 127

// General Bacnet
const defaultMaxMaster = 127
const defaultMaxInfoFrames = 1

// ArrayAll is used when reading/writing to a property to read/write the entire
// array
const ArrayAll = 0xFFFFFFFF
const maxStandardBacnetType = 128

// Port separation aligned with bacnet reference acceptance flow:
// discovery binds the standard port; confirmed Read/Write uses a separate local port
// to avoid socket contention when peers also occupy 47808.
const (
	discoveryListenPort = 47808 // Who-Is / ephemeral discovery clients
	confirmedListenPort = 47809 // long-lived Connect client for confirmed services
)

const (
	probeVerifyTimeout   = 10 * time.Second
	propertyReadTimeout  = 5 * time.Second
	writeVerifyInterval  = 500 * time.Millisecond
	batchReadTimeout     = 3 * time.Second
	singleReadTimeout    = 5 * time.Second
)
