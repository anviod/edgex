package services

import (
	"fmt"
	"testing"

	pprint "industrial-edge-gateway/internal/driver/bacnet/helpers/print"
)

func TestSupported(t *testing.T) {

	//Object to store name and supported values for sorting
	type supportedObject struct {
		Name      string
		Supported bool
	}

	ss := Supported{}
	//Imported array goes here - change name & references
	arrayTest := []bool{false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, true, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, false}

	//Creating array of services map in the correct order & size
	var servicesSize = len(ss.ListAll())
	orderedArray := make([]supportedObject, servicesSize)

	//Sorting services map to array
	for supported := range ss.ListAll() {
		//Assigning supported value from bool array
		supported.Supported = arrayTest[supported.Index]

		//Adding objects to sorted array
		obj := new(supportedObject)
		obj.Name = supported.Name
		obj.Supported = supported.Supported
		orderedArray[supported.Index] = *obj
	}
	//Printing sorted array of objects
	for i, v := range orderedArray {
		var supportedStatus string

		if v.Supported == true {
			supportedStatus = "Supported"
		}
		if v.Supported == false {
			supportedStatus = "Not Supported"
		}
		fmt.Println(i, v.Name+":", supportedStatus)
	}

	pprint.PrintJOSN(orderedArray)
}
