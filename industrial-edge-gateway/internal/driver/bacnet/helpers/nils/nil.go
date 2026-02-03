package nils

func NewString(value string) *string {
	return &value
}

func StringIsNil(b *string) string {
	if b == nil {
		return ""
	} else {
		return *b
	}
}
func StringNilCheck(b *string) bool {
	if b == nil {
		return true
	} else {
		return false
	}
}

func Float64IsNil(b *float64) float64 {
	if b == nil {
		return 0
	} else {
		return *b
	}
}

func NewInt(value int) *int {
	return &value
}

func NewBool(value bool) *bool {
	return &value
}

func BoolIsNil(value *bool) bool {
	if value == nil {
		return false
	}
	return *value
}

func NewTrue() *bool {
	b := true
	return &b
}

func NewFalse() *bool {
	b := false
	return &b
}

func NewUint16(value uint16) *uint16 {
	return &value
}

func NewUint32(value uint32) *uint32 {
	return &value
}

func NewFloat32(value float32) *float32 {
	return &value
}

func NewFloat64(value float64) *float64 {
	return &value
}

func IntIsNil(b *int) int {
	if b == nil {
		return 0
	} else {
		return *b
	}
}

func BoolNilCheck(b *bool) bool {
	if b == nil {
		return true
	} else {
		return false
	}
}

func IntNilCheck(b *int) bool {
	if b == nil {
		return true
	} else {
		return false
	}
}

func Float32IsNil(b *float32) float32 {
	if b == nil {
		return 0
	} else {
		return *b
	}
}

func UnitIsNil(b *uint) uint {
	if b == nil {
		return 0
	} else {
		return *b
	}
}

func Unit16IsNil(b *uint16) uint16 {
	if b == nil {
		return 0
	} else {
		return *b
	}
}

func Unit32IsNil(b *uint32) uint32 {
	if b == nil {
		return 0
	} else {
		return *b
	}
}

func Unit32NilCheck(b *uint32) bool {
	if b == nil {
		return true
	} else {
		return false
	}
}

func FloatIsNilCheck(b *float64) bool {
	if b == nil {
		return true
	} else {
		return false
	}
}
