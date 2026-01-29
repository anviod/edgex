package bacnet

import (
	"fmt"

	"industrial-edge-gateway/internal/driver/bacnet/btypes"
)

func (c *client) objectListLen(dev btypes.Device) (int, error) {
	rp := btypes.PropertyData{
		Object: btypes.Object{
			ID: dev.ID,
			Properties: []btypes.Property{
				{
					Type:       btypes.PropObjectList,
					ArrayIndex: 0,
				},
			},
		},
	}

	resp, err := c.ReadProperty(dev, rp)
	if err != nil {
		return 0, fmt.Errorf("reading property failed: %v", err)
	}

	if len(resp.Object.Properties) == 0 {
		return 0, fmt.Errorf("no data was returned")
	}

	data, ok := resp.Object.Properties[0].Data.(uint32)
	if !ok {
		return 0, fmt.Errorf("Unable to get object length")
	}
	return int(data), nil
}

func (c *client) objectsRange(dev btypes.Device, start, end int) ([]btypes.Object, error) {
	rpm := btypes.MultiplePropertyData{
		Objects: []btypes.Object{
			{
				ID: dev.ID,
			},
		},
	}

	for i := start; i <= end; i++ {
		rpm.Objects[0].Properties = append(rpm.Objects[0].Properties, btypes.Property{
			Type:       btypes.PropObjectList,
			ArrayIndex: uint32(i),
		})
	}
	resp, err := c.ReadMultiProperty(dev, rpm)
	if err != nil {
		return nil, fmt.Errorf("unable to read multiple properties: %v", err)
	}
	if len(resp.Objects) == 0 {
		return nil, fmt.Errorf("no data was returned")
	}

	objs := make([]btypes.Object, len(resp.Objects[0].Properties))

	for i, prop := range resp.Objects[0].Properties {
		id, ok := prop.Data.(btypes.ObjectID)
		if !ok {
			return nil, fmt.Errorf("expected type Object ID, got %T", prop.Data)
		}
		objs[i].ID = id
	}

	return objs, nil
}

const readPropRequestSize = 20

func objectCopy(dest btypes.ObjectMap, src []btypes.Object) {
	for _, o := range src {
		if dest[o.ID.Type] == nil {
			dest[o.ID.Type] = make(map[btypes.ObjectInstance]btypes.Object)
		}
		dest[o.ID.Type][o.ID.Instance] = o
	}

}

func (c *client) objectList(dev *btypes.Device) error {
	dev.Objects = make(btypes.ObjectMap)

	l, err := c.objectListLen(*dev)
	if err != nil {
		return fmt.Errorf("unable to get list length: %v", err)
	}

	// Scan size is broken
	scanSize := int(dev.MaxApdu) / readPropRequestSize
	i := 0
	for i = 0; i < l/scanSize; i++ {
		start := i*scanSize + 1
		end := (i + 1) * scanSize

		objs, err := c.objectsRange(*dev, start, end)
		if err != nil {
			return fmt.Errorf("unable to retrieve objects between %d and %d: %v", start, end, err)
		}
		objectCopy(dev.Objects, objs)
	}
	start := i*scanSize + 1
	end := l
	if start <= end {
		objs, err := c.objectsRange(*dev, start, end)
		if err != nil {
			return fmt.Errorf("unable to retrieve objects between %d and %d: %v", start, end, err)
		}
		objectCopy(dev.Objects, objs)
	}
	return nil
}

func (c *client) objectInformation(dev *btypes.Device, objs []btypes.Object) error {
	// Often times the map will re-arrange the order it spits out,
	// so we need to keep track since the response will be in the
	// same order we issue the commands.
	keys := make([]btypes.ObjectID, len(objs))
	counter := 0
	rpm := btypes.MultiplePropertyData{
		Objects: []btypes.Object{},
	}

	for _, o := range objs {
		if o.ID.Type > maxStandardBacnetType {
			continue
		}
		keys[counter] = o.ID
		counter++
		rpm.Objects = append(rpm.Objects, btypes.Object{
			ID: o.ID,
			Properties: []btypes.Property{
				{
					Type:       btypes.PropObjectName,
					ArrayIndex: btypes.ArrayAll,
				},
				{
					Type:       btypes.PropDescription,
					ArrayIndex: btypes.ArrayAll,
				},
			},
		})

	}
	resp, err := c.ReadMultiProperty(*dev, rpm)
	if err != nil {
		return fmt.Errorf("unable to read multiple property :%v", err)
	}
	var name, description string
	var ok bool
	for i, r := range resp.Objects {
		name, ok = r.Properties[0].Data.(string)
		if !ok {
			return fmt.Errorf("expecting string got %T", r.Properties[0].Data)
		}
		description, ok = r.Properties[1].Data.(string)
		if !ok {
			return fmt.Errorf("expecting string got %T", r.Properties[1].Data)
		}
		obj := dev.Objects[keys[i].Type][keys[i].Instance]
		obj.Name = name
		obj.Description = description
		dev.Objects[keys[i].Type][keys[i].Instance] = obj
	}
	return nil
}

func (c *client) allObjectInformation(dev *btypes.Device) error {
	objs := dev.ObjectSlice()
	incrSize := 5

	var err error
	for i := 0; i < len(objs); i += incrSize {
		subset := objs[i:min(i+incrSize, len(objs))]
		err = c.objectInformation(dev, subset)
		if err != nil {
			return err
		}
	}

	return nil
}

// Objects retrieves all the objects within the given device and returns a
// device with these objects. Along with the list of objects, it will also
// gather additional information from the object such as the name and
// description of the objects. The device returned contains all the name and
// description fields for all objects
func (c *client) Objects(dev btypes.Device) (btypes.Device, error) {
	err := c.objectList(&dev)
	if err != nil {
		return dev, fmt.Errorf("unable to get object list: %v", err)
	}
	err = c.allObjectInformation(&dev)
	if err != nil {
		return dev, fmt.Errorf("unable to get object's information: %v", err)
	}
	return dev, nil
}
