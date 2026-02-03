package btypes

type DayOfWeek int

const (
	None      DayOfWeek = iota
	Monday    DayOfWeek = iota
	Tuesday   DayOfWeek = iota
	Wednesday DayOfWeek = iota
	Thursday  DayOfWeek = iota
	Friday    DayOfWeek = iota
	Saturday  DayOfWeek = iota
	Sunday    DayOfWeek = iota
)

type Date struct {
	Year  int
	Month int
	Day   int
	// Bacnet has an option to only do operations on even or odd months
	EvenMonth      bool
	OddMonth       bool
	EvenDay        bool
	OddDay         bool
	LastDayOfMonth bool
	DayOfWeek      DayOfWeek
}

type Time struct {
	Hour        int
	Minute      int
	Second      int
	Millisecond int
}

type DataTime struct {
	Date
	Time
}

// UnspecifiedTime means that this time is triggered through out a period. An
// example of this is 02:FF:FF:FF will trigger all through out 2 am
const UnspecifiedTime = 0xFF

const (
	TimeStampTime     = 0
	TimeStampSequence = 1
	TimeStampDatetime = 2
)
