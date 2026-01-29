package datalink

////go:build MSTP
//// +build MSTP

//
//
//import (
//	"fmt"
//	"github.com/ibuilding-x/driver-box/internal/plugins/bacnet/bacnet/btypes"
//	"os"
//	"time"
//	"unsafe"
//)
//
////libbacnet is compiled from github.com/bacnet-stack/bacnet-stack
//
//// #cgo CFLAGS: -DBACDL_MSTP=1 -I./include
//// #cgo LDFLAGS: -L./lib -lbacnet -lWinmm
//// #include<dlmstp.h>
//// #include <stdlib.h>
//import "C"
//
//func cAddrToGoAddr(addr *C.BACNET_ADDRESS) *btypes.Address {
//	var result btypes.Address
//	for i := 0; i < len(result.Mac) && i < len(addr.mac); i++ {
//		result.Mac[i] = uint8(addr.mac[i])
//	}
//	result.MacLen = uint8(addr.mac_len)
//	for i := 0; i < len(result.Adr) && i < len(addr.adr); i++ {
//		result.Adr[i] = uint8(addr.adr[i])
//	}
//	result.Len = uint8(addr.len)
//	result.Net = uint16(addr.net)
//	return &result
//}
//
//type mstpDataLink int
//
//func NewMSTPDataLink(ifname string, baudrate uint32) DataLink {
//	os.Setenv("BACNET_DATALINK ", "mstp")
//	name := C.CString(ifname)
//	defer C.free(unsafe.Pointer(name))
//	C.dlmstp_set_baud_rate(C.uint(baudrate))
//	C.dlmstp_init(name)
//	return mstpDataLink(0)
//}
//
//func (M mstpDataLink) GetMyAddress() *btypes.Address {
//	var addr C.BACNET_ADDRESS
//	C.dlmstp_get_my_address(&addr)
//	return cAddrToGoAddr(&addr)
//}
//
//func (M mstpDataLink) GetBroadcastAddress() *btypes.Address {
//	var addr C.BACNET_ADDRESS
//	C.dlmstp_get_broadcast_address(&addr)
//	return cAddrToGoAddr(&addr)
//}
//
//func (M mstpDataLink) Send(data []byte, npdu *btypes.NPDU, dest *btypes.Address) (int, error) {
//	var addr C.BACNET_ADDRESS
//	for i := 0; i < len(dest.Mac) && i < len(addr.mac); i++ {
//		addr.mac[i] = C.uchar(dest.Mac[i])
//	}
//	addr.mac_len = C.uchar(dest.MacLen)
//	for i := 0; i < len(dest.Adr) && i < len(addr.adr); i++ {
//		addr.adr[i] = C.uchar(dest.Adr[i])
//	}
//	addr.len = C.uchar(dest.Len)
//	addr.net = C.ushort(dest.Net)
//
//	var cnpdu C.struct_bacnet_npdu_data_t
//	cnpdu.protocol_version = C.uchar(npdu.Version)
//	cnpdu.data_expecting_reply = C.bool(npdu.ExpectingReply)
//	cnpdu.network_layer_message = C.bool(npdu.IsNetworkLayerMessage)
//	cnpdu.priority = C.BACNET_MESSAGE_PRIORITY(C.uchar(npdu.Priority))
//	cnpdu.network_message_type = C.BACNET_NETWORK_MESSAGE_TYPE(C.uchar(npdu.NetworkLayerMessageType))
//	cnpdu.vendor_id = C.ushort(npdu.VendorId)
//	cnpdu.hop_count = C.uchar(npdu.HopCount)
//
//	n := C.dlmstp_send_pdu(&addr, &cnpdu, (*C.uchar)(&data[0]), C.uint(len(data)))
//	return int(n), nil
//}
//
//func (M mstpDataLink) Receive(data []byte) (*btypes.Address, int, error) {
//	var addr C.BACNET_ADDRESS
//	n := C.dlmstp_receive(&addr, (*C.uchar)(&data[0]), C.ushort(len(data)), C.uint(time.Minute/1000000))
//	if uint16(n) == 0 {
//		fmt.Errorf("timeout, no data received")
//	}
//	return cAddrToGoAddr(&addr), int(uint16(n)), nil
//}
//
//func (M mstpDataLink) Close() error {
//	C.dlmstp_cleanup()
//	return nil
//}
