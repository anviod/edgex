package encoding

import "fmt"

type ErrorIncorrectTag struct {
	Expected uint8
	Given    uint8
}

func (e *ErrorIncorrectTag) Error() string {
	return fmt.Sprintf("Incorrect tag %d, expected %d.", e.Given, e.Expected)
}

type tagInfo struct {
	// Tag id. Typically sequential, except when it is not...
	ID      uint8
	Context bool
	// Either has a value or length of the next value
	Value   uint32
	Opening bool
	Closing bool
}
