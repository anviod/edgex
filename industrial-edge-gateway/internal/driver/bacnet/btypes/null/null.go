package null

// Null is used when a value is empty.
type Null struct{}

func (n Null) String() string {
	return "<null>"
}
