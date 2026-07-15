package bacnet

import (
	"github.com/anviod/bacnet/btypes"
)

// From:
// https://stackoverflow.com/questions/6878590/the-maximum-value-for-an-int-type-in-go
const (
	maxUint = ^uint(0)
	minUint = 0
	// based on 2's complement structure of max int
	maxInt = int(maxUint >> 1)
	minInt = -maxInt - 1
)

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// objectCopy copies objects from src into the destination ObjectMap.
// Moved from objectlist.go (now provided by external library).
func objectCopy(dest btypes.ObjectMap, src []btypes.Object) {
	for _, o := range src {
		if dest[o.ID.Type] == nil {
			dest[o.ID.Type] = make(map[btypes.ObjectInstance]btypes.Object)
		}
		dest[o.ID.Type][o.ID.Instance] = o
	}
}
