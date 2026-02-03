package main

import (
	"context"
	"log"

	"github.com/gopcua/opcua"
	"github.com/gopcua/opcua/ua"
)

type TestPoint struct {
	NodeID   string
	DataType string // "float32", "string", "uint16"
	Value    interface{}
}

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
	log.Println("Connected to", endpoint)

	// 0. Read Namespace Array
	nsNodeID, _ := ua.ParseNodeID("ns=0;i=2255")
	nsReq := &ua.ReadRequest{
		NodesToRead: []*ua.ReadValueID{
			{
				NodeID:      nsNodeID,
				AttributeID: ua.AttributeIDValue,
			},
		},
	}
	nsResp, err := c.Read(ctx, nsReq)
	if err == nil && len(nsResp.Results) > 0 && nsResp.Results[0].Value != nil {
		log.Printf("Namespaces: %v", nsResp.Results[0].Value.Value())
	}

	points := []TestPoint{
		{"ns=3;i=1002", "float64", nil},                         // Random (Read Only check)
		{"ns=3;i=1011", "bytestring", []byte{0x01, 0x02, 0x03}}, // Fix DataType
		{"ns=5;s=String", "string", "TestString"},
	}

	for _, p := range points {
		log.Printf("--- Testing %s ---", p.NodeID)

		// Parse NodeID
		nid, err := ua.ParseNodeID(p.NodeID)
		if err != nil {
			log.Printf("Failed to parse NodeID %s: %v", p.NodeID, err)
			continue
		}

		// Read Attributes
		attrReq := &ua.ReadRequest{
			NodesToRead: []*ua.ReadValueID{
				{NodeID: nid, AttributeID: ua.AttributeIDDataType},
				{NodeID: nid, AttributeID: ua.AttributeIDAccessLevel},
				{NodeID: nid, AttributeID: ua.AttributeIDValue},
			},
		}
		attrResp, err := c.Read(ctx, attrReq)
		if err == nil && len(attrResp.Results) == 3 {
			log.Printf("DataType: %v", attrResp.Results[0].Value.Value())
			log.Printf("AccessLevel: %v", attrResp.Results[1].Value.Value())
			log.Printf("Current Value: %v", attrResp.Results[2].Value.Value())
		}

		if p.Value == nil {
			continue // Skip write if no value provided
		}

		// Create Variant
		v, err := ua.NewVariant(p.Value)
		if err != nil {
			log.Printf("Failed to create variant for %s: %v", p.NodeID, err)
			continue
		}

		// Write
		req := &ua.WriteRequest{
			NodesToWrite: []*ua.WriteValue{
				{
					NodeID:      nid,
					AttributeID: ua.AttributeIDValue,
					Value: &ua.DataValue{
						Value: v,
					},
				},
			},
		}
		resp, err := c.Write(ctx, req)
		if err != nil {
			log.Printf("Write failed: %v", err)
			continue
		}
		if len(resp.Results) > 0 {
			log.Printf("Write Status: %v", resp.Results[0])
		}

		// Read back immediately
		readReq := &ua.ReadRequest{
			NodesToRead: []*ua.ReadValueID{
				{
					NodeID:      nid,
					AttributeID: ua.AttributeIDValue,
				},
			},
		}
		readResp, err := c.Read(ctx, readReq)
		if err != nil {
			log.Printf("Read failed: %v", err)
			continue
		}
		if len(readResp.Results) > 0 {
			res := readResp.Results[0]
			log.Printf("Read Status: %v", res.Status)
			if res.Value != nil {
				log.Printf("Read Value: %v (Type: %v)", res.Value.Value(), res.Value.Type())
			} else {
				log.Printf("Read Value: <nil>")
			}
		}
	}
}
