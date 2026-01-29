package ip2bytes

import (
	"fmt"
	"testing"
)

func TestIP(t *testing.T) {

	mac, err := New("192.168.15.10", 47808)
	if err != nil {
		return
	}

	fmt.Println(mac)

}
