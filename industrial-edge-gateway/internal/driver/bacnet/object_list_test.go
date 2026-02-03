package bacnet

import (
	"context"
	"industrial-edge-gateway/internal/driver/bacnet/btypes"
	"testing"
)

// MockObjectScanClient for Object List Scanning tests
type MockObjectScanClient struct {
	MockScanClient
	objectList []btypes.ObjectID
}

func (m *MockObjectScanClient) ReadProperty(dev btypes.Device, prop btypes.PropertyData) (btypes.PropertyData, error) {
	// Check for ObjectList (76)
	if len(prop.Object.Properties) > 0 && prop.Object.Properties[0].Type == btypes.PropObjectList {
		return btypes.PropertyData{
			Object: btypes.Object{
				Properties: []btypes.Property{
					{
						Type: btypes.PropObjectList,
						Data: m.objectList,
					},
				},
			},
		}, nil
	}

	return btypes.PropertyData{
		Object: btypes.Object{
			Properties: []btypes.Property{
				{Data: "MockValue"},
			},
		},
	}, nil
}

func (m *MockObjectScanClient) ReadMultiProperty(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	res := btypes.MultiplePropertyData{
		Objects: make([]btypes.Object, len(rp.Objects)),
	}
	for i, obj := range rp.Objects {
		res.Objects[i] = btypes.Object{
			ID: obj.ID,
			Properties: []btypes.Property{
				{
					Type: btypes.PropObjectName,
					Data: "MockObject",
				},
			},
		}
	}
	return res, nil
}

func (m *MockObjectScanClient) WhoIs(opts *WhoIsOpts) ([]btypes.Device, error) {
	// Always return the target device
	return []btypes.Device{{DeviceID: 1234, Ip: "127.0.0.1"}}, nil
}

func setupDriver(mock *MockObjectScanClient) *BACnetDriver {
	return &BACnetDriver{
		client: mock,
		clientFactory: func(cb *ClientBuilder) (Client, error) {
			return mock, nil
		},
		targetDeviceID: 1234,
		connected:      true,
		deviceContexts: map[int]*DeviceContext{
			1234: {
				Device: btypes.Device{DeviceID: 1234},
				Config: DeviceConfig{DeviceID: 1234},
			},
		},
		historicalObjects: make(map[int]map[string]ObjectResult),
	}
}

// OBJ-FUNC-01: First Scan (All New)
func TestOBJ_FUNC_01_FirstScan(t *testing.T) {
	mock := &MockObjectScanClient{
		objectList: []btypes.ObjectID{
			{Type: 0, Instance: 1},
			{Type: 0, Instance: 2},
		},
	}
	driver := setupDriver(mock)

	res, err := driver.Scan(context.Background(), map[string]any{"device_id": 1234})
	if err != nil {
		t.Fatalf("Scan failed: %v", err)
	}

	results := res.([]ObjectResult)
	if len(results) != 2 {
		t.Errorf("Expected 2 objects, got %d", len(results))
	}

	for _, r := range results {
		if r.DiffStatus != "new" {
			t.Errorf("Object %s:%d expected 'new', got '%s'", r.Type, r.Instance, r.DiffStatus)
		}
	}
}

// OBJ-FUNC-02: Second Scan (No Change -> All Existing)
func TestOBJ_FUNC_02_SecondScan(t *testing.T) {
	mock := &MockObjectScanClient{
		objectList: []btypes.ObjectID{
			{Type: 0, Instance: 1},
		},
	}
	driver := setupDriver(mock)

	// First Scan
	driver.Scan(context.Background(), map[string]any{"device_id": 1234})

	// Second Scan (No Change)
	res, _ := driver.Scan(context.Background(), map[string]any{"device_id": 1234})
	results := res.([]ObjectResult)

	if len(results) != 1 {
		t.Errorf("Expected 1 object, got %d", len(results))
	}
	if results[0].DiffStatus != "existing" {
		t.Errorf("Expected 'existing', got '%s'", results[0].DiffStatus)
	}
}

// OBJ-FUNC-03: Add Object (New + Existing)
func TestOBJ_FUNC_03_AddObject(t *testing.T) {
	mock := &MockObjectScanClient{
		objectList: []btypes.ObjectID{
			{Type: 0, Instance: 1},
		},
	}
	driver := setupDriver(mock)

	// First Scan
	driver.Scan(context.Background(), map[string]any{"device_id": 1234})

	// Add Object
	mock.objectList = append(mock.objectList, btypes.ObjectID{Type: 0, Instance: 2})

	// Second Scan
	res, _ := driver.Scan(context.Background(), map[string]any{"device_id": 1234})
	results := res.([]ObjectResult)

	// Map results for checking
	resMap := make(map[int]string)
	for _, r := range results {
		resMap[r.Instance] = r.DiffStatus
	}

	if resMap[1] != "existing" {
		t.Errorf("Instance 1 expected 'existing', got '%s'", resMap[1])
	}
	if resMap[2] != "new" {
		t.Errorf("Instance 2 expected 'new', got '%s'", resMap[2])
	}
}

// OBJ-FUNC-04: Remove Object (Removed + Existing)
func TestOBJ_FUNC_04_RemoveObject(t *testing.T) {
	mock := &MockObjectScanClient{
		objectList: []btypes.ObjectID{
			{Type: 0, Instance: 1},
			{Type: 0, Instance: 2},
		},
	}
	driver := setupDriver(mock)

	// First Scan
	driver.Scan(context.Background(), map[string]any{"device_id": 1234})

	// Remove Object 2
	mock.objectList = []btypes.ObjectID{{Type: 0, Instance: 1}}

	// Second Scan
	res, _ := driver.Scan(context.Background(), map[string]any{"device_id": 1234})
	results := res.([]ObjectResult)

	if len(results) != 2 {
		t.Errorf("Expected 2 results (1 existing + 1 removed), got %d", len(results))
	}

	resMap := make(map[int]string)
	for _, r := range results {
		resMap[r.Instance] = r.DiffStatus
	}

	if resMap[1] != "existing" {
		t.Errorf("Instance 1 expected 'existing', got '%s'", resMap[1])
	}
	if resMap[2] != "removed" {
		t.Errorf("Instance 2 expected 'removed', got '%s'", resMap[2])
	}
}

// OBJ-FUNC-05: Mixed Change (New + Existing + Removed)
func TestOBJ_FUNC_05_MixedChange(t *testing.T) {
	mock := &MockObjectScanClient{
		objectList: []btypes.ObjectID{
			{Type: 0, Instance: 1}, // Will stay
			{Type: 0, Instance: 2}, // Will be removed
		},
	}
	driver := setupDriver(mock)

	// First Scan
	driver.Scan(context.Background(), map[string]any{"device_id": 1234})

	// Change: Remove 2, Add 3
	mock.objectList = []btypes.ObjectID{
		{Type: 0, Instance: 1},
		{Type: 0, Instance: 3},
	}

	// Second Scan
	res, _ := driver.Scan(context.Background(), map[string]any{"device_id": 1234})
	results := res.([]ObjectResult)

	resMap := make(map[int]string)
	for _, r := range results {
		resMap[r.Instance] = r.DiffStatus
	}

	if resMap[1] != "existing" {
		t.Errorf("Instance 1 expected 'existing', got '%s'", resMap[1])
	}
	if resMap[2] != "removed" {
		t.Errorf("Instance 2 expected 'removed', got '%s'", resMap[2])
	}
	if resMap[3] != "new" {
		t.Errorf("Instance 3 expected 'new', got '%s'", resMap[3])
	}
}

// OBJ-DATA-01: Uniqueness
func TestOBJ_DATA_01_Uniqueness(t *testing.T) {
	// The driver relies on the device returning unique ObjectIDs in ObjectList.
	// But our map logic enforces uniqueness by key (Type:Instance).
	// If the device returns duplicates, the last one wins in the map construction before diffing.
	// Wait, in `scanDeviceObjects`:
	// `currentMap[key] = res` overwrites.
	// `finalResults` appends. So `finalResults` might have duplicates if `results` has duplicates.
	// We should probably deduplicate `finalResults` or `results` before processing.
	// But let's check current behavior.

	mock := &MockObjectScanClient{
		objectList: []btypes.ObjectID{
			{Type: 0, Instance: 1},
			{Type: 0, Instance: 1}, // Duplicate
		},
	}
	driver := setupDriver(mock)

	// Scan
	res, _ := driver.Scan(context.Background(), map[string]any{"device_id": 1234})
	results := res.([]ObjectResult)

	// If the driver just appends to `finalResults`, we get 2.
	// If we want to enforce uniqueness, we should deduplicate.
	// The requirement says: "Repeat objects should be merged or marked exception".
	// Current impl just appends.

	if len(results) != 1 {
		t.Errorf("Expected 1 unique object, got %d", len(results))
	}
}
