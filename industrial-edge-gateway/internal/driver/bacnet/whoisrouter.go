package bacnet

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/ndpu"
	"industrial-edge-gateway/internal/driver/bacnet/encoding"
)

/*
Is in beta
*/

func (c *client) WhoIsRouterToNetwork() (resp *[]btypes.Address) {
	var err error
	dest := *c.dataLink.GetBroadcastAddress()
	enc := encoding.NewEncoder()
	npdu := &btypes.NPDU{
		Version:                 btypes.ProtocolVersion,
		Destination:             &dest,
		Source:                  c.dataLink.GetMyAddress(),
		IsNetworkLayerMessage:   true,
		NetworkLayerMessageType: ndpu.WhoIsRouterToNetwork,
		// We are not expecting a direct reply from a single destination
		ExpectingReply: false,
		Priority:       btypes.Normal,
		HopCount:       btypes.DefaultHopCount,
	}
	enc.NPDU(npdu)
	// Run in parallel
	errChan := make(chan error)
	broadcast := &SetBroadcastType{Set: true, BacFunc: btypes.BacFuncBroadcast}
	go func() {
		_, err = c.Send(dest, npdu, enc.Bytes(), broadcast)
		errChan <- err
	}()
	values, err := c.utsm.Subscribe(1, 65534) //65534 is the max number a network can be
	if err != nil {
		fmt.Println(`err`, err)
	}
	err = <-errChan
	if err != nil {

	}
	var list []btypes.Address
	for _, addresses := range values {
		r, ok := addresses.([]btypes.Address)
		if !ok {
			continue
		}
		for _, addr := range r {
			list = append(list, addr)
		}
	}
	return &list

}
