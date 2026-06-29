package bacnet

import (
	"fmt"
	"time"

	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/anviod/edgex/internal/driver/bacnet/btypes/null"
	"github.com/anviod/edgex/internal/model"
)

func applyFreshReadToCache(devCtx *DeviceContext, deviceID string, fresh map[string]model.Value) {
	if devCtx == nil || len(fresh) == 0 {
		return
	}
	devCtx.CacheMu.Lock()
	if devCtx.LastValues == nil {
		devCtx.LastValues = make(map[string]model.Value)
	}
	now := time.Now()
	for k, v := range fresh {
		v.DeviceID = deviceID
		v.CachedAt = now
		devCtx.LastValues[k] = v
	}
	devCtx.CacheMu.Unlock()
}

// normalizePresentValue converts BACnet decoded values into JSON-safe scalars
// suitable for ShadowCore and history storage.
func normalizePresentValue(v any) any {
	if v == nil {
		return nil
	}
	switch t := v.(type) {
	case null.Null:
		return nil
	case btypes.Enumerated:
		return uint32(t)
	case btypes.BitString:
		return t.String()
	case float32, float64, int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64, bool, string:
		return t
	default:
		return fmt.Sprintf("%v", v)
	}
}
