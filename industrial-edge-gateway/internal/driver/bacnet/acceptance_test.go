package bacnet

import (
	"context"
	"testing"
	"time"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"industrial-edge-gateway/internal/driver/bacnet/btypes/null"
	"industrial-edge-gateway/internal/model"
)

// acceptance_test.go implements tests based on "BACnet 驱动采集测试与验收标准清单.md"

// 1. Device Discovery
func TestAcceptance_DeviceDiscovery(t *testing.T) {
	// 1.1 Who-Is / I-Am Discovery
	mockClient := &MockClient{
		WhoIsResp: []btypes.Device{
			{
				DeviceID:     1234,
				Vendor:       999,
				MaxApdu:      1476,
				Segmentation: btypes.Enumerated(3), // No segmentation
				Addr:         btypes.Address{Mac: []byte{192, 168, 1, 10, 0xBA, 0xC0}},
			},
		},
	}

	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.clientFactory = func(cb *ClientBuilder) (Client, error) {
		return mockClient, nil
	}

	// Connect triggers discovery
	err := d.Connect(context.Background())
	if err != nil {
		t.Fatalf("Connect failed: %v", err)
	}

	d.mu.Lock()
	ctx, ok := d.deviceContexts[1234]
	d.mu.Unlock()

	if !ok {
		t.Fatalf("Device context 1234 not found")
	}

	if ctx.Device.DeviceID != 1234 {
		t.Errorf("Expected DeviceID 1234, got %d", ctx.Device.DeviceID)
	}
	if ctx.Device.Vendor != 999 {
		t.Errorf("Expected VendorID 999, got %d", ctx.Device.Vendor)
	}
	if ctx.Device.MaxApdu != 1476 {
		t.Errorf("Expected MaxApdu 1476, got %d", ctx.Device.MaxApdu)
	}

	// 1.2 Reconnection (Simulated)
	d.connected = false
	mockClient.WhoIsCalled = false
	err = d.Connect(context.Background())
	if err != nil {
		t.Fatalf("Reconnect failed: %v", err)
	}
	if !mockClient.WhoIsCalled {
		t.Error("WhoIs should be called on reconnection")
	}
}

// 2. Object Discovery
// 2.1 Scan with Device ID (UI Object Explorer)
func TestAcceptance_ScanDeviceObjects(t *testing.T) {
	t.Run("ScanDeviceObjects", func(t *testing.T) {
		mockClient := &MockClient{}
		d := NewBACnetDriver().(*BACnetDriver)
		d.targetDeviceID = 1234
		d.client = mockClient
		d.clientFactory = func(cb *ClientBuilder) (Client, error) { return mockClient, nil }
		d.deviceContexts = map[int]*DeviceContext{
			1234: {
				Device: btypes.Device{DeviceID: 1234},
				Config: DeviceConfig{DeviceID: 1234},
			},
		}
		d.connected = true

		// Mock WhoIs response for Scan
		mockClient.WhoIsResp = []btypes.Device{{DeviceID: 1234}}

		// Mock ReadProperty (ObjectList)
		objectList := []btypes.ObjectID{
			{Type: btypes.AnalogInput, Instance: 1},
			{Type: btypes.BinaryValue, Instance: 2},
		}
		mockClient.ReadPropertyResp = btypes.PropertyData{
			Object: btypes.Object{
				Properties: []btypes.Property{{Type: btypes.PropObjectList, Data: objectList}},
			},
		}

		// Mock ReadMultiProperty (Object Names)
		mockClient.ReadMultiPropertyHandler = func(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
			// Return names for the requested objects
			resp := btypes.MultiplePropertyData{
				Objects: []btypes.Object{
					{
						ID: btypes.ObjectID{Type: btypes.AnalogInput, Instance: 1},
						Properties: []btypes.Property{
							{Type: btypes.PropObjectName, Data: "Temp_Sensor"},
							{Type: btypes.PropDescription, Data: "Temperature Sensor"},
							{Type: btypes.PropUnits, Data: btypes.Enumerated(62)}, // DegreesCelsius
							{Type: btypes.PropPresentValue, Data: float32(23.5)},
							{Type: btypes.PropStatusFlags, Data: btypes.BitString{BitUsed: 4, Value: []byte{0}}}, // Normal
							{Type: btypes.PropReliability, Data: btypes.Enumerated(0)},                           // NoFaultDetected
						},
					},
					{
						ID: btypes.ObjectID{Type: btypes.BinaryValue, Instance: 2},
						Properties: []btypes.Property{
							{Type: btypes.PropObjectName, Data: "Fan_Switch"},
						},
					},
				},
			}
			return resp, nil
		}

		// Execute Scan
		res, err := d.Scan(context.Background(), map[string]any{"device_id": 1234})
		if err != nil {
			t.Fatalf("Scan failed: %v", err)
		}

		// Verify Results
		objects, ok := res.([]ObjectResult)
		if !ok {
			t.Fatalf("Expected []ObjectResult, got %T", res)
		}
		if len(objects) != 2 {
			t.Errorf("Expected 2 objects, got %d", len(objects))
		}
		if objects[0].Name != "Temp_Sensor" {
			t.Errorf("Expected Temp_Sensor, got %s", objects[0].Name)
		}
		if objects[0].Description != "Temperature Sensor" {
			t.Errorf("Expected Description 'Temperature Sensor', got %s", objects[0].Description)
		}
		// Units might be string "DegreesCelsius"
		if objects[0].Units != "DegreesCelsius" {
			t.Errorf("Expected Units 'DegreesCelsius', got %s", objects[0].Units)
		}
		if objects[0].StatusFlags != "[false,false,false,false]" {
			t.Errorf("Expected StatusFlags '[false,false,false,false]', got %s", objects[0].StatusFlags)
		}
		if objects[0].Reliability != "0" {
			t.Errorf("Expected Reliability '0', got %s", objects[0].Reliability)
		}
	})
}

func TestAcceptance_ObjectDiscovery(t *testing.T) {
	// Verify reading ObjectList property
	mockClient := &MockClient{}

	// Mock ObjectList response
	// Device Object: device:1234
	// Property: object-list (76)
	objectList := []btypes.ObjectID{
		{Type: btypes.AnalogInput, Instance: 1},
		{Type: btypes.BinaryValue, Instance: 2},
	}

	mockClient.ReadMultiPropertyResp = btypes.MultiplePropertyData{
		Objects: []btypes.Object{
			{
				ID: btypes.ObjectID{Type: btypes.DeviceType, Instance: 1234},
				Properties: []btypes.Property{
					{Type: btypes.PropObjectList, Data: objectList},
				},
			},
		},
	}

	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.client = mockClient
	dev := btypes.Device{DeviceID: 1234}
	d.connected = true
	d.deviceContexts = map[int]*DeviceContext{
		1234: {
			Device:    dev,
			Config:    DeviceConfig{DeviceID: 1234},
			Scheduler: NewPointScheduler(mockClient, dev, 20, 10*time.Millisecond, 10*time.Second),
		},
	}

	// Read device:1234:object-list
	points := []model.Point{
		{ID: "ObjList", Name: "ObjectList", Address: "device:1234:object-list"},
	}

	results, err := d.ReadPoints(context.Background(), points)
	if err != nil {
		t.Fatalf("ReadPoints failed: %v", err)
	}

	val, ok := results["ObjList"]
	if !ok {
		t.Fatal("Expected ObjList result")
	}

	// Verify data type
	list, ok := val.Value.([]btypes.ObjectID)
	if !ok {
		t.Errorf("Expected []ObjectID, got %T", val.Value)
	} else {
		if len(list) != 2 {
			t.Errorf("Expected 2 objects, got %d", len(list))
		}
	}
}

// 3. Point Read (Properties)
func TestAcceptance_PointRead_Properties(t *testing.T) {
	mockClient := &MockClient{}

	// Setup response for multiple properties
	mockClient.ReadMultiPropertyResp = btypes.MultiplePropertyData{
		Objects: []btypes.Object{
			{
				ID: btypes.ObjectID{Type: btypes.AnalogInput, Instance: 1},
				Properties: []btypes.Property{
					{Type: btypes.PropPresentValue, Data: float32(23.4)},
					{Type: btypes.PropUnits, Data: btypes.Enumerated(62)}, // Degrees Celsius
				},
			},
		},
	}

	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.client = mockClient
	dev := btypes.Device{DeviceID: 1234}
	d.connected = true
	d.deviceContexts = map[int]*DeviceContext{
		1234: {
			Device:    dev,
			Config:    DeviceConfig{DeviceID: 1234},
			Scheduler: NewPointScheduler(mockClient, dev, 20, 10*time.Millisecond, 10*time.Second),
		},
	}

	points := []model.Point{
		{ID: "TempPV", Name: "Temp Present Value", Address: "analog-input:1:present-value"},
		{ID: "TempUnits", Name: "Temp Units", Address: "analog-input:1:units"},
	}

	results, err := d.ReadPoints(context.Background(), points)
	if err != nil {
		t.Fatalf("ReadPoints failed: %v", err)
	}

	if v, ok := results["TempPV"]; !ok || v.Value != float32(23.4) {
		t.Errorf("Expected TempPV 23.4, got %v", v)
	}
	if v, ok := results["TempUnits"]; !ok || v.Value != btypes.Enumerated(62) {
		t.Errorf("Expected TempUnits 62, got %v", v)
	}
}

// 4. Point Write (Priority)
func TestAcceptance_PointWrite_Priority(t *testing.T) {
	mockClient := &MockClient{}
	d := NewBACnetDriver().(*BACnetDriver)
	d.targetDeviceID = 1234
	d.client = mockClient
	dev := btypes.Device{DeviceID: 1234}
	d.connected = true
	d.deviceContexts = map[int]*DeviceContext{
		1234: {
			Device:    dev,
			Config:    DeviceConfig{DeviceID: 1234},
			Scheduler: NewPointScheduler(mockClient, dev, 20, 10*time.Millisecond, 10*time.Second),
		},
	}

	// 4.1 Default Priority (16)
	point := model.Point{Name: "SetPoint", Address: "analog-value:1"}
	err := d.WritePoint(context.Background(), point, 100.0)
	if err != nil {
		t.Fatalf("WritePoint failed: %v", err)
	}

	if mockClient.LastWriteProp.Object.Properties[0].Priority != 16 {
		t.Errorf("Expected priority 16, got %d", mockClient.LastWriteProp.Object.Properties[0].Priority)
	}

	// 4.2 Explicit Priority (8)
	valMap := map[string]any{
		"value":    200.0,
		"priority": 8,
	}
	err = d.WritePoint(context.Background(), point, valMap)
	if err != nil {
		t.Fatalf("WritePoint priority 8 failed: %v", err)
	}
	if mockClient.LastWriteProp.Object.Properties[0].Priority != 8 {
		t.Errorf("Expected priority 8, got %d", mockClient.LastWriteProp.Object.Properties[0].Priority)
	}
	if mockClient.LastWriteProp.Object.Properties[0].Data != 200.0 {
		t.Errorf("Expected value 200.0, got %v", mockClient.LastWriteProp.Object.Properties[0].Data)
	}

	// 4.3 Release (NULL)
	err = d.WritePoint(context.Background(), point, nil)
	if err != nil {
		t.Fatalf("WritePoint NULL failed: %v", err)
	}
	// Check for Null type
	_, isNull := mockClient.LastWriteProp.Object.Properties[0].Data.(null.Null)
	if !isNull {
		t.Errorf("Expected Null type for release, got %T", mockClient.LastWriteProp.Object.Properties[0].Data)
	}
}
