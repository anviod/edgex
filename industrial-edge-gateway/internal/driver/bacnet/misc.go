package bacnet

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
