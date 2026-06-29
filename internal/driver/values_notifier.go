package driver

import "github.com/anviod/edgex/internal/model"

// ValuesReadNotifier is implemented by drivers that cache reads in a background
// poller. The callback pushes fresh values into ShadowCore so history snapshots
// and live shadow reads stay aligned with the cache.
type ValuesReadNotifier interface {
	SetValuesReadNotifier(fn func(deviceID string, values map[string]model.Value))
}
