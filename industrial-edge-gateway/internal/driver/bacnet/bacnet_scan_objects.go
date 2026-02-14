package bacnet
import (
	"context"
	"fmt"
)
// ScanObjects implements ObjectScanner interface
func (d *BACnetDriver) ScanObjects(ctx context.Context, config map[string]any) (any, error) {
	deviceID := 0
	if v, ok := config["device_id"]; ok {
		if id, ok := v.(int); ok {
			deviceID = id
		} else if id, ok := v.(float64); ok {
			deviceID = int(id)
		}
	}

	if deviceID == 0 {
		return nil, fmt.Errorf("device_id is required")
	}

	deep := false
	if v, ok := config["mode"]; ok {
		if s, ok := v.(string); ok && (s == "deep" || s == "full") {
			deep = true
		}
	}
	if v, ok := config["deep"]; ok {
		if b, ok := v.(bool); ok && b {
			deep = true
		}
	}

	return d.scanDeviceObjects(nil, deviceID, deep)
}
