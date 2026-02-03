package btypes

import (
	"encoding/json"
	"reflect"
	"testing"
)

// TestMarshal tests encoding and decoding of the objectmap type. There is
// custom logic in it so we want to make sure it works.
func TestMarshal(t *testing.T) {
	test := ObjectMap{
		AnalogInput:  make(map[ObjectInstance]Object),
		BinaryOutput: make(map[ObjectInstance]Object),
	}
	test[AnalogInput][0] = Object{Name: "Pizza Sensor"}
	test[BinaryOutput][4] = Object{Name: "Should I Eat Pizza Sensor"}
	b, err := json.Marshal(test)
	if err != nil {
		t.Fatal(err)
	}

	out := make(ObjectMap, 0)
	err = json.Unmarshal(b, &out)
	if err != nil {
		t.Fatal(err)
	}

	if !reflect.DeepEqual(test, out) {
		t.Fatal("Encoding/decoding Object map is not equal")
	}

}
