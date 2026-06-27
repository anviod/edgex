package omron

import (
	"fmt"

	finsudp "github.com/anviod/fins/udp"
)

func dialUDPClient(cfg map[string]any) (*finsudp.Client, error) {
	plcIP, _ := cfg["plcIP"].(string)
	if plcIP == "" {
		if ip, ok := cfg["ip"].(string); ok {
			plcIP = ip
		}
	}
	if plcIP == "" {
		return nil, fmt.Errorf("plcIP is required for UDP mode")
	}

	plcPort := configInt(cfg, "plcPort", "port")
	if plcPort == 0 {
		plcPort = 9600
	}

	localIP, _ := cfg["localIP"].(string)
	if localIP == "" {
		if ip, ok := cfg["local_ip"].(string); ok {
			localIP = ip
		}
	}
	if localIP == "" {
		localIP = "0.0.0.0"
	}

	localPort := configInt(cfg, "localPort", "local_port")

	srcNet := configByte(cfg, "srcNetworkAddr", "src_network_addr")
	srcNode := configByte(cfg, "srcNodeAddr", "src_node_addr")
	srcUnit := configByte(cfg, "srcUnitAddr", "src_unit_addr")
	if srcNode == 0 {
		srcNode = 1
	}
	if srcUnit == 0 {
		srcUnit = 255
	}

	dstNet := configByte(cfg, "dstNetworkAddr", "dst_network_addr")
	dstNode := configByte(cfg, "dstNodeAddr", "dst_node_addr")
	dstUnit := configByte(cfg, "dstUnitAddr", "dst_unit_addr")
	if dstNode == 0 {
		dstNode = 1
	}

	localAddr := finsudp.NewAddress(localIP, localPort, srcNet, srcNode, srcUnit)
	plcAddr := finsudp.NewAddress(plcIP, plcPort, dstNet, dstNode, dstUnit)
	return finsudp.NewClient(localAddr, plcAddr)
}
