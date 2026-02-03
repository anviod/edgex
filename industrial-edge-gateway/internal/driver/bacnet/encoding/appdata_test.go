package encoding

import (
	"reflect"
	"testing"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func subTestSimpleData(t *testing.T, d *Decoder, x interface{}) func(t *testing.T) {
	return func(t *testing.T) {
		y, err := d.AppData()
		if err != nil {
			t.Fatal(err)
		}
		if !reflect.DeepEqual(x, y) {
			t.Errorf("Mismatch between decrypted values. Received %v, expected %v", y, x)
		}
	}
}

func TestSimpleDatabtypes(t *testing.T) {
	t.Run("Specific function based encoding", generalSimpleDatabtypes(t, false))
	t.Run("General Interface Encoding", generalSimpleDatabtypes(t, true))
}

// generic states if we plan to use specific or generic encoding
func generalSimpleDatabtypes(t *testing.T, generic bool) func(t *testing.T) {
	return func(t *testing.T) {
		enc := NewEncoder()
		var real float32 = 3.14

		// Default float 64
		double := 1234567.890
		boolean := false
		// Will be stored as an 8 bit uint
		var small uint32 = 12

		// Stored as 16
		var medium uint32 = 0xABF0

		// Stored as 24
		var wtf uint32 = 0x302010

		// Stored as 32
		var large uint32 = 0xFFFFFFF0

		str := "my pizza pizza"
		objID := btypes.ObjectID{93, 42}

		if generic {
			values := []interface{}{real, double, boolean, !boolean, small, medium, wtf, large, str, objID}
			for _, v := range values {
				enc.AppData(v, false)
			}

		} else {
			enc.tag(tagInfo{ID: tagReal, Context: appLayerContext, Value: realLen})
			enc.real(real)

			enc.tag(tagInfo{ID: tagDouble, Context: appLayerContext, Value: doubleLen})
			enc.double(double)

			enc.boolean(boolean)
			enc.boolean(!boolean)

			enc.tag(tagInfo{ID: tagUint, Context: appLayerContext, Value: size8})
			enc.unsigned(small)

			enc.tag(tagInfo{ID: tagUint, Context: appLayerContext, Value: size16})
			enc.unsigned(medium)

			enc.tag(tagInfo{ID: tagUint, Context: appLayerContext, Value: size24})
			enc.unsigned(wtf)

			enc.tag(tagInfo{ID: tagUint, Context: appLayerContext, Value: size32})
			enc.unsigned(large)

			enc.tag(tagInfo{ID: tagCharacterString, Context: appLayerContext, Value: uint32(len(str) + 1)})
			enc.string(str)

			enc.tag(tagInfo{ID: tagObjectID, Context: appLayerContext, Value: objectIDLen})
			enc.objectId(objID.Type, objID.Instance)
		}

		if err := enc.Error(); err != nil {
			t.Fatal(err)
		}

		dec := NewDecoder(enc.Bytes())
		t.Run("Encoding Real", subTestSimpleData(t, dec, real))
		t.Run("Encoding Double", subTestSimpleData(t, dec, double))
		t.Run("Encoding Boolean", subTestSimpleData(t, dec, boolean))
		t.Run("Encoding Flipped Boolean", subTestSimpleData(t, dec, !boolean))
		t.Run("Encoding Uint8", subTestSimpleData(t, dec, small))
		t.Run("Encoding Uint16", subTestSimpleData(t, dec, medium))
		t.Run("Encoding uint24", subTestSimpleData(t, dec, wtf))
		t.Run("Encoding uint32", subTestSimpleData(t, dec, large))
		t.Run("Encoding string", subTestSimpleData(t, dec, str))
		t.Run("Encoding object id", subTestSimpleData(t, dec, objID))

		if err := dec.Error(); err != nil {
			t.Fatal(err)
		}
	}
}

func TestRandomData(t *testing.T) {
	b := []byte{196, 2, 3, 208, 91, 34, 9, 96, 101, 6, 10, 20, 0, 47, 186, 192, 196, 2, 3,
		180, 113, 34, 9, 96, 101, 6, 10, 20, 0, 204, 186, 192, 196, 2, 0, 81, 65, 34, 9, 96, 101, 6, 10, 20, 0,
		208, 186, 192}
	dec := NewDecoder(b)
	for dec.len() > 0 {
		res, _ := dec.AppData()
		t.Logf("%v", res)

		res, _ = dec.AppData()
		t.Logf("%v", res)

		res, _ = dec.AppData()
		t.Logf("%v", res)
	}

}

func TestPropertyList(t *testing.T) {
	b := []byte{196, 225, 0, 0, 1, 196, 2, 128, 0, 109, 196, 2, 128, 0, 94, 196,
		2, 3, 180, 141, 196, 2, 128, 0, 1, 196, 2, 128, 0, 2, 196, 2, 128, 0, 3,
		196, 2, 128, 0, 99, 196, 2, 128, 0, 98, 196, 2, 128, 0, 97, 196, 2, 128, 0,
		96, 196, 3, 192, 0, 1, 196, 3, 192, 0, 2, 196, 3, 192, 0, 3, 196, 3, 192, 0,
		4, 196, 3, 192, 0, 5, 196, 1, 128, 0, 1, 196, 1, 128, 0, 2, 196, 1, 128, 0,
		3, 196, 1, 128, 0, 4, 196, 1, 128, 0, 5, 196, 1, 125, 9, 0, 196, 1, 125, 9,
		1, 196, 1, 125, 9, 2, 196, 1, 125, 9, 3, 196, 1, 125, 9, 4, 196, 1, 125, 9,
		5, 196, 1, 125, 9, 6, 196, 1, 125, 12, 232, 196, 2, 128, 0, 101, 196, 2,
		128, 0, 102, 196, 2, 128, 0, 104, 196, 4, 0, 0, 1, 196, 0, 0, 0, 3, 196, 5,
		0, 0, 3, 196, 5, 0, 0, 8, 196, 0, 64, 0, 1, 196, 5, 0, 0, 4, 196, 1, 64, 0,
		6, 196, 1, 64, 0, 5, 196, 1, 64, 0, 1, 196, 0, 128, 0, 6, 196, 1, 64, 0, 7,
		196, 1, 64, 0, 8, 196, 1, 64, 0, 9, 196, 1, 64, 0, 10, 196, 0, 128, 0, 9,
		196, 5, 0, 0, 10, 196, 4, 64, 0, 1, 196, 0, 128, 0, 11, 196, 0, 0, 0, 1,
		196, 192, 0, 0, 1, 196, 5, 0, 0, 1, 196, 5, 0, 0, 7, 196, 5, 0, 0, 12, 196,
		5, 0, 0, 5, 196, 1, 64, 0, 4, 196, 1, 64, 0, 3, 196, 0, 128, 0, 4, 196, 0,
		128, 0, 2, 196, 1, 64, 0, 11, 196, 0, 128, 0, 12, 196, 5, 0, 0, 13, 196, 0,
		128, 0, 10, 196, 5, 0, 0, 9, 196, 0, 0, 0, 2, 196, 5, 0, 0, 2, 196, 5, 0, 0,
		11, 196, 5, 0, 0, 6}
	dec := NewDecoder(b)
	for dec.len() > 0 {
		res, _ := dec.AppData()
		t.Logf("%v", res)
	}

}

// Testing for bug where a unicode is sometimes appending to the front of the string returned.
func TestStringUnicode(t *testing.T) {
	s := "there is there such thing as too much pizza?"
	enc := NewEncoder()
	enc.AppData(s, false)

	dec := NewDecoder(enc.Bytes())
	out, err := dec.AppData()
	if err != nil {
		t.Errorf("decoding string failed: %v", err)
	}

	outStr := out.(string)
	if outStr[0] != s[0] {
		t.Fatal("an unknown code was prepending to output")
	}
}

func TestReverseBitsInByte(t *testing.T) {
	var a byte = 0x0F
	a = byteReverseBits(a)
	if a != 0xF0 {
		t.Errorf("byteReverseBits error")
	}
}
