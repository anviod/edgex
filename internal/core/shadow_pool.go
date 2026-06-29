package core

import (
	"sync"

	"github.com/anviod/edgex/internal/model"
)

const shadowPointsMapInitialCap = 8

var shadowPointsMapPool = sync.Pool{
	New: func() any {
		m := make(map[string]model.ShadowPoint, shadowPointsMapInitialCap)
		return &m
	},
}

func borrowShadowPointsMap(_ int) map[string]model.ShadowPoint {
	raw := shadowPointsMapPool.Get().(*map[string]model.ShadowPoint)
	m := *raw
	for k := range m {
		delete(m, k)
	}
	return m
}

func returnShadowPointsMap(m map[string]model.ShadowPoint) {
	if m == nil {
		return
	}
	if len(m) > 256 {
		return
	}
	for k := range m {
		delete(m, k)
	}
	shadowPointsMapPool.Put(&m)
}

// cloneShadowPointsForNotify 为订阅者提供只读快照；标量 value 浅拷贝，复合类型仍深拷贝。
// 通知 map 生命周期由 GC 管理（订阅者可能异步持有引用）。
func cloneShadowPointsForNotify(src map[string]model.ShadowPoint) map[string]model.ShadowPoint {
	if src == nil {
		return nil
	}
	dst := make(map[string]model.ShadowPoint, len(src))
	for k, v := range src {
		cloned := v
		cloned.Value = cloneNotifyValue(v.Value)
		dst[k] = cloned
	}
	return dst
}

func cloneNotifyValue(value any) any {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case map[string]any, map[any]any, []any:
		return deepCloneValue(v)
	default:
		return value
	}
}
