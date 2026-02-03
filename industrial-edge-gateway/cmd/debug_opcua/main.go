package main

import (
	"context"
	"log"

	"github.com/gopcua/opcua"
	"github.com/gopcua/opcua/ua"
)

func main() {
	endpoint := "opc.tcp://127.0.0.1:53530/OPCUA/SimulationServer"
	ctx := context.Background()

	// 1. Connect
	c, err := opcua.NewClient(endpoint, opcua.SecurityMode(ua.MessageSecurityModeNone))
	if err != nil {
		log.Fatal(err)
	}
	if err := c.Connect(ctx); err != nil {
		log.Fatal(err)
	}
	defer c.Close(ctx)
	log.Println("Connected")

	// 2. Write
	nodeID, _ := ua.ParseNodeID("ns=5;s=String")
	v, _ := ua.NewVariant("Hello Trae")
	req := &ua.WriteRequest{
		NodesToWrite: []*ua.WriteValue{
			{
				NodeID:      nodeID,
				AttributeID: ua.AttributeIDValue,
				Value: &ua.DataValue{
					Value: v,
				},
			},
		},
	}
	resp, err := c.Write(ctx, req)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Write Status: %v", resp.Results[0])

	// 3. Read
	readReq := &ua.ReadRequest{
		NodesToRead: []*ua.ReadValueID{
			{
				NodeID:      nodeID,
				AttributeID: ua.AttributeIDValue,
			},
		},
	}
	readResp, err := c.Read(ctx, readReq)
	if err != nil {
		log.Fatal(err)
	}
	if len(readResp.Results) > 0 {
		res := readResp.Results[0]
		log.Printf("Read Status: %v", res.Status)
		if res.Value != nil {
			log.Printf("Read Value: %v", res.Value.Value())
			log.Printf("Read Variant Type: %v", res.Value.Type())
		} else {
			log.Println("Read Value is nil")
		}
	}

	// 4. Check standard simulation nodes
	nodesToCheck := []string{"ns=3;i=1001", "ns=3;i=1002", "ns=5;s=Counter1"}
	for _, n := range nodesToCheck {
		nid, _ := ua.ParseNodeID(n)
		r := &ua.ReadRequest{
			NodesToRead: []*ua.ReadValueID{
				{
					NodeID:      nid,
					AttributeID: ua.AttributeIDValue,
				},
			},
		}
		resp, err := c.Read(ctx, r)
		if err != nil {
			log.Printf("Failed to read %s: %v", n, err)
			continue
		}
		if len(resp.Results) > 0 {
			res := resp.Results[0]
			log.Printf("Read %s Status: %v", n, res.Status)
			if res.Value != nil {
				log.Printf("Read %s Value: %v (Type: %v)", n, res.Value.Value(), res.Value.Type())
			} else {
				log.Printf("Read %s Value: <nil>", n)
			}
		}
	}
}
