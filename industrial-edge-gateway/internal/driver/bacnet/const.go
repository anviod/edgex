package bacnet

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
