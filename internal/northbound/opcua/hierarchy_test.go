package opcua

import "testing"

// TestAddressSpaceHierarchyCrossChannel verifies duplicate device IDs across
// channels produce distinct compact NodeIDs and correct reverse lookups.
func TestAddressSpaceHierarchyCrossChannel(t *testing.T) {
	mapper := NewNodeIDMapper()

	idA := mapper.GenerateCompactNodeID("ch-a", "shared-dev", "temp")
	idB := mapper.GenerateCompactNodeID("ch-b", "shared-dev", "temp")

	if idA == idB {
		t.Fatalf("cross-channel points must have distinct compact NodeIDs: %s", idA)
	}
	if idA != "ns=2;s=ch-a.shared-dev.temp" {
		t.Fatalf("unexpected idA: %s", idA)
	}
	if idB != "ns=2;s=ch-b.shared-dev.temp" {
		t.Fatalf("unexpected idB: %s", idB)
	}

	chID, devID, ptID, ok := mapper.GetOriginalIDs(idA)
	if !ok || chID != "ch-a" || devID != "shared-dev" || ptID != "temp" {
		t.Fatalf("GetOriginalIDs(%s) = (%s,%s,%s,%v), want (ch-a,shared-dev,temp,true)", idA, chID, devID, ptID, ok)
	}

	chID, devID, ptID, ok = mapper.GetOriginalIDs(idB)
	if !ok || chID != "ch-b" || devID != "shared-dev" || ptID != "temp" {
		t.Fatalf("GetOriginalIDs(%s) = (%s,%s,%s,%v), want (ch-b,shared-dev,temp,true)", idB, chID, devID, ptID, ok)
	}
}
