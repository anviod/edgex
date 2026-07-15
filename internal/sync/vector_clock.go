package sync

import (
	"encoding/json"
	"fmt"
	"sort"
)

type VectorClock map[string]uint64

func NewVectorClock() VectorClock {
	return make(map[string]uint64)
}

func (vc VectorClock) Increment(nodeID string) {
	if vc == nil {
		return
	}
	vc[nodeID]++
}

func (vc VectorClock) Get(nodeID string) uint64 {
	if vc == nil {
		return 0
	}
	return vc[nodeID]
}

func (vc VectorClock) Compare(other VectorClock) int {
	if vc == nil && other == nil {
		return 0
	}
	if vc == nil {
		return -1
	}
	if other == nil {
		return 1
	}

	hasLower := false
	hasHigher := false

	for nodeID, counter := range vc {
		otherCounter, exists := other[nodeID]
		if !exists {
			if counter > 0 {
				hasHigher = true
			}
			continue
		}

		if counter < otherCounter {
			hasLower = true
		} else if counter > otherCounter {
			hasHigher = true
		}
	}

	for nodeID, counter := range other {
		if _, exists := vc[nodeID]; !exists && counter > 0 {
			hasLower = true
		}
	}

	if hasLower && !hasHigher {
		return -1
	}
	if hasHigher && !hasLower {
		return 1
	}
	return 0
}

func (vc VectorClock) Merge(other VectorClock) {
	if vc == nil || other == nil {
		return
	}
	for nodeID, counter := range other {
		if vc[nodeID] < counter {
			vc[nodeID] = counter
		}
	}
}

func (vc VectorClock) Clone() VectorClock {
	result := NewVectorClock()
	if vc == nil {
		return result
	}
	for k, v := range vc {
		result[k] = v
	}
	return result
}

func (vc VectorClock) IsEmpty() bool {
	return vc == nil || len(vc) == 0
}

func (vc VectorClock) String() string {
	if vc == nil {
		return "VectorClock{}"
	}
	keys := make([]string, 0, len(vc))
	for k := range vc {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var parts []string
	for _, k := range keys {
		parts = append(parts, fmt.Sprintf("%s:%d", k, vc[k]))
	}

	return fmt.Sprintf("VectorClock{%s}", joinStrings(parts, ", "))
}

func (vc VectorClock) MarshalJSON() ([]byte, error) {
	type clock struct {
		Entries map[string]uint64 `json:"entries"`
	}
	if vc == nil {
		return json.Marshal(&clock{Entries: make(map[string]uint64)})
	}
	return json.Marshal(&clock{Entries: map[string]uint64(vc)})
}

func (vc *VectorClock) UnmarshalJSON(data []byte) error {
	if vc == nil {
		return nil
	}
	type clock struct {
		Entries map[string]uint64 `json:"entries"`
	}
	var c clock
	if err := json.Unmarshal(data, &c); err != nil {
		return err
	}
	if c.Entries == nil {
		c.Entries = make(map[string]uint64)
	}
	*vc = VectorClock(c.Entries)
	return nil
}

func joinStrings(strs []string, sep string) string {
	result := ""
	for i, s := range strs {
		if i > 0 {
			result += sep
		}
		result += s
	}
	return result
}
