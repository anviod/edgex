package segmentation

//BACnetSegmentation:
//segmented-both:0
//segmented-transmit:1
//segmented-receive:2
//no-segmentation: 3

type SegmentedType uint8

//go:generate stringer -type=SegmentedType
const (
	SegmentedBoth     SegmentedType = 0x00
	SegmentedTransmit SegmentedType = 0x01
	SegmentedReceive  SegmentedType = 0x02
	NoSegmentation    SegmentedType = 0x03
)
