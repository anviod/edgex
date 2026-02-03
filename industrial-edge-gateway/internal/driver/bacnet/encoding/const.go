package encoding

const MaxInstance = 0x3FFFFF
const InstanceBits = 22
const MaxPropertyID = 4194303

const MaxAPDUOverIP = 1476
const MaxAPDU = MaxAPDUOverIP

const initialTagPos = 0

const (
	size8  = 1
	size16 = 2
	size24 = 3
	size32 = 4
)

const (
	flag16bit uint8 = 254
	flag32bit uint8 = 255
)

// ArrayAll is an argument typically passed during a read to signify where to
// read
const ArrayAll uint32 = ^uint32(0)
