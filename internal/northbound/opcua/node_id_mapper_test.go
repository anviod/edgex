package opcua

import (
	"testing"
)

func TestNodeIDMapper_GenerateAndParse(t *testing.T) {
	mapper := NewNodeIDMapper()

	// Test case 1: Basic channel, device, point
	channelID := "44amyf4grh5oquzc"
	deviceID := "slave-1"
	pointID := "hr_40000"

	// Generate string node ID - should return ns=2;s={deviceID}.{pointID}
	compactID := mapper.GenerateCompactNodeID(channelID, deviceID, pointID)
	expectedCompact := "ns=2;s=slave-1.hr_40000"
	if compactID != expectedCompact {
		t.Errorf("Expected compact ID %s, got %s", expectedCompact, compactID)
	}

	// Parse compact ID back
	chID, devID, ptID, ok := mapper.GetOriginalIDs(compactID)
	if !ok {
		t.Fatal("Failed to parse compact ID")
	}
	if chID != channelID {
		t.Errorf("Expected channel ID %s, got %s", channelID, chID)
	}
	if devID != deviceID {
		t.Errorf("Expected device ID %s, got %s", deviceID, devID)
	}
	if ptID != pointID {
		t.Errorf("Expected point ID %s, got %s", pointID, ptID)
	}
}

func TestNodeIDMapper_MultiplePoints(t *testing.T) {
	mapper := NewNodeIDMapper()

	// Generate multiple points - each gets unique string ID
	id1 := mapper.GenerateCompactNodeID("channel-1", "device-1", "point-1")
	id2 := mapper.GenerateCompactNodeID("channel-1", "device-1", "point-2")
	id3 := mapper.GenerateCompactNodeID("channel-2", "device-1", "point-1")

	if id1 != "ns=2;s=device-1.point-1" {
		t.Errorf("Expected ns=2;s=device-1.point-1, got %s", id1)
	}
	if id2 != "ns=2;s=device-1.point-2" {
		t.Errorf("Expected ns=2;s=device-1.point-2, got %s", id2)
	}
	if id3 != "ns=2;s=device-1.point-1" {
		t.Errorf("Expected ns=2;s=device-1.point-1, got %s (different channel, same device+point)", id3)
	}

	// Same point should return same ID (idempotent)
	id1Again := mapper.GenerateCompactNodeID("channel-1", "device-1", "point-1")
	if id1Again != id1 {
		t.Errorf("Expected same compact ID for same point, got %s vs %s", id1Again, id1)
	}
}

func TestNodeIDMapper_IDReuse(t *testing.T) {
	mapper := NewNodeIDMapper()

	// First point gets string ID based on device.point
	compact1 := mapper.GenerateCompactNodeID("ch-1", "dev-1", "pt-1")
	if compact1 != "ns=2;s=dev-1.pt-1" {
		t.Errorf("Expected ns=2;s=dev-1.pt-1, got %s", compact1)
	}

	// Same IDs should return the same compact ID (idempotent)
	compact1Again := mapper.GenerateCompactNodeID("ch-1", "dev-1", "pt-1")
	if compact1Again != compact1 {
		t.Errorf("Expected same compact ID, got different: %s vs %s", compact1, compact1Again)
	}
}

func TestNodeIDMapper_GenerateCompactFolderID(t *testing.T) {
	mapper := NewNodeIDMapper()

	// Generate channel folder ID - should start from 1001 (for folders only)
	chID := mapper.GenerateCompactFolderID("channel-123", "")
	// Channel folder gets the first numeric ID
	expected := "ns=2;i=1001"
	if chID != expected {
		t.Errorf("Expected %s, got %s", expected, chID)
	}

	// Generate device folder ID - should get next numeric ID
	devID := mapper.GenerateCompactFolderID("channel-123", "device-456")
	expected = "ns=2;i=1002"
	if devID != expected {
		t.Errorf("Expected %s, got %s", expected, devID)
	}
}

func TestNodeIDMapper_GetOriginalIDs_Invalid(t *testing.T) {
	mapper := NewNodeIDMapper()

	tests := []struct {
		name   string
		input  string
		wantOK bool
	}{
		{"empty string", "", false},
		{"invalid format", "ns=invalid", false},
		{"wrong namespace", "ns=3;i=1001", false},
		{"random numeric", "ns=2;i=9999", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, _, _, ok := mapper.GetOriginalIDs(tt.input)
			if ok != tt.wantOK {
				t.Errorf("GetOriginalIDs(%q) ok = %v, want %v", tt.input, ok, tt.wantOK)
			}
		})
	}
}

func TestNodeIDMapper_Size(t *testing.T) {
	mapper := NewNodeIDMapper()

	// Empty mapper should have size 0
	if mapper.Size() != 0 {
		t.Errorf("Expected size 0, got %d", mapper.Size())
	}

	// Add some mappings
	mapper.GenerateCompactNodeID("ch-1", "dev-1", "pt-1")
	mapper.GenerateCompactNodeID("ch-1", "dev-1", "pt-2")
	mapper.GenerateCompactNodeID("ch-1", "dev-2", "pt-1")
	mapper.GenerateCompactNodeID("ch-2", "dev-1", "pt-1")

	// Should have 4 point mappings
	size := mapper.Size()
	expected := 4
	if size != expected {
		t.Errorf("Expected size %d, got %d", expected, size)
	}
}

func TestNodeIDMapper_ParseCompactNodeID(t *testing.T) {
	mapper := NewNodeIDMapper()

	// Generate a string node ID
	channelID := "44amyf4grh5oquzc"
	deviceID := "slave-1"
	pointID := "hr_40000"
	original := "Gateway/Channels/44amyf4grh5oquzc/Devices/slave-1/Points/hr_40000"
	compact := mapper.GenerateCompactNodeID(channelID, deviceID, pointID)

	// Parse back
	fullPath, ok := mapper.ParseCompactNodeID(compact)
	if !ok {
		t.Fatal("Failed to parse compact node ID")
	}
	if fullPath != original {
		t.Errorf("Expected %s, got %s", original, fullPath)
	}

	// Non-compact ID should return false
	_, ok = mapper.ParseCompactNodeID("Gateway/Channels/test")
	if ok {
		t.Error("Expected false for non-compact ID")
	}

	// Random ns format should return false (not registered)
	_, ok = mapper.ParseCompactNodeID("ns=2;s=UnknownDevice.Point")
	if ok {
		t.Error("Expected false for unregistered node ID")
	}
}

func TestNodeIDMapper_Stats(t *testing.T) {
	mapper := NewNodeIDMapper()

	// Add some points (string IDs, no folder IDs assigned yet)
	mapper.GenerateCompactNodeID("ch-1", "dev-1", "pt-1")
	mapper.GenerateCompactNodeID("ch-1", "dev-1", "pt-2")

	// Check stats through GetAllMappings
	mappings := mapper.GetAllMappings()

	if mappings["namespace"] != uint16(2) {
		t.Errorf("Expected namespace 2, got %v", mappings["namespace"])
	}

	if mappings["nextFolderID"] != uint32(1001) {
		t.Errorf("Expected nextFolderID 1001, got %v", mappings["nextFolderID"])
	}

	if mappings["total"] != nil {
		t.Error("Should not have 'total' field in new format")
	}
}

func BenchmarkGenerateCompactNodeID(b *testing.B) {
	mapper := NewNodeIDMapper()
	channels := []string{"ch-1", "ch-2", "ch-3"}
	devices := []string{"dev-1", "dev-2", "dev-3"}
	points := []string{"pt-1", "pt-2", "pt-3"}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		ch := channels[i%len(channels)]
		dev := devices[i%len(devices)]
		pt := points[i%len(points)]
		mapper.GenerateCompactNodeID(ch, dev, pt)
	}
}

func BenchmarkGetOriginalIDs(b *testing.B) {
	mapper := NewNodeIDMapper()

	// Pre-populate with different points
	for i := 0; i < 100; i++ {
		mapper.GenerateCompactNodeID(
			"channel-"+string(rune('0'+i%10)),
			"device-"+string(rune('0'+i%10)),
			"point-"+string(rune('0'+i%10)),
		)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _, _, _ = mapper.GetOriginalIDs("ns=2;i=1050")
	}
}
