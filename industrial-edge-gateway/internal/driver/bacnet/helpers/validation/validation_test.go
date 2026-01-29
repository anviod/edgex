package validation

import (
	"fmt"
	"testing"
)

func TestPort(t *testing.T) {

	port := 8080
	ok := ValidPort(port)
	fmt.Println("port:", port, "is ok", ok)

	port = -1
	ok = ValidPort(port)
	fmt.Println("port:", port, "is ok", ok)

	port = 0
	ok = ValidPort(port)
	fmt.Println("port:", port, "is ok", ok)

	port = 47808
	ok = ValidPort(port)
	fmt.Println("port:", port, "is ok", ok)

	port = 24
	ok = ValidCIDR("192.168.15.1", port)
	fmt.Println("ValidCIDR:", port, "is ok", ok)

	port = 2000
	ok = ValidCIDR("192.168.15.1", port)
	fmt.Println("ValidCIDR:", port, "is ok", ok)
}
