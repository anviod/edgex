package encoding

import (
	"fmt"
)

type TagType string

const (
	ContextTag TagType = "context"
	OpeningTag TagType = "opening"
	ClosingTag TagType = "closing"
)

// ErrorWrongTagType is given when a certain tag type is expected but not given when encoding/decoding
type ErrorWrongTagType struct {
	Type TagType
}

func (e *ErrorWrongTagType) Error() string {
	return fmt.Sprintf("Tag should be a %s tag", e.Type)
}
