package btypes

import "encoding/json"

type ObjectMap map[ObjectType]map[ObjectInstance]Object

// Len returns the total number of entries within the object map.
func (o ObjectMap) Len() int {
	counter := 0
	for _, t := range o {
		for _ = range t {
			counter++
		}

	}
	return counter
}

func (om ObjectMap) MarshalJSON() ([]byte, error) {
	m := make(map[string]map[ObjectInstance]Object)
	for typ, sub := range om {
		key := typ.String()
		if m[key] == nil {
			m[key] = make(map[ObjectInstance]Object)
		}
		for inst, obj := range sub {
			m[key][inst] = obj
		}
	}
	return json.Marshal(m)
}

func (om ObjectMap) UnmarshalJSON(data []byte) error {
	m := make(map[string]map[ObjectInstance]Object, 0)
	err := json.Unmarshal(data, &m)
	if err != nil {
		return err
	}

	for t, sub := range m {
		key := GetType(t)
		if om[key] == nil {
			om[key] = make(map[ObjectInstance]Object)
		}
		for inst, obj := range sub {
			om[key][inst] = obj
		}
	}
	return nil
}
