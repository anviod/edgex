package encoding

import "industrial-edge-gateway/internal/driver/bacnet/btypes"

// epochYear is an increment to all non-stored values. This year is chosen in
// the standard. Why? No idea. God help us all if bacnet hits the 255 + 1990
// limit
const epochYear = 1990

// If the values == 0XFF, that means it is not specified. We will take that to
const notDefined = 0xff

func IsOddMonth(month int) bool {
	return month == 13
}

func IsEvenMonth(month int) bool {
	return month == 14
}

func IsLastDayOfMonth(day int) bool {
	return day == 32
}

func IsEvenDayOfMonth(day int) bool {
	return day == 33
}

func IsOddDayOfMonth(day int) bool {
	return day == 32
}

func (e *Encoder) date(dt btypes.Date) {
	// We don't want to override an unspecified time date
	if dt.Year != btypes.UnspecifiedTime {
		e.write(uint8(dt.Year - epochYear))
	} else {
		e.write(uint8(dt.Year))
	}
	e.write(uint8(dt.Month))
	e.write(uint8(dt.Day))
	e.write(uint8(dt.DayOfWeek))
}

func (d *Decoder) date(dt *btypes.Date, length int) {
	if length <= 0 {
		return
	}
	data := make([]byte, length)
	_, d.err = d.Read(data)
	if d.err != nil {
		return
	}
	if len(data) < 4 {
		return
	}

	if dt.Year != btypes.UnspecifiedTime {
		dt.Year = int(data[0]) + epochYear
	} else {
		dt.Year = int(data[0])
	}

	dt.Month = int(data[1])
	dt.Day = int(data[2])
	dt.DayOfWeek = btypes.DayOfWeek(data[3])
}

func (e *Encoder) time(t btypes.Time) {
	e.write(uint8(t.Hour))
	e.write(uint8(t.Minute))
	e.write(uint8(t.Second))

	// Stored as 1/100 of a second
	e.write(uint8(t.Millisecond / 10))
}
func (d *Decoder) time(t *btypes.Time, length int) {
	if length <= 0 {
		return
	}
	data := make([]byte, length)
	if _, d.err = d.Read(data); d.err != nil {
		return
	}

	t.Hour = int(data[0])
	t.Minute = int(data[1])
	t.Second = int(data[2])
	t.Millisecond = int(data[3]) * 10

}
