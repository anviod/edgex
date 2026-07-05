package network

import (
	"errors"
	"testing"
	"time"

	"github.com/anviod/edgex/internal/driver/bacnet"
	"github.com/anviod/edgex/internal/driver/bacnet/btypes"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockBACnetClient struct {
	whoIsDevices []btypes.Device
	whoIsErr     error
	readProp     func(dest btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error)
	readMulti    func(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error)
	writePropErr error
	running      bool
}

func (m *mockBACnetClient) Close() error                         { return nil }
func (m *mockBACnetClient) IsRunning() bool                      { return m.running }
func (m *mockBACnetClient) ClientRun()                           { m.running = true }
func (m *mockBACnetClient) WhatIsNetworkNumber() []*btypes.Address { return nil }
func (m *mockBACnetClient) IAm(_ btypes.Address, _ btypes.IAm) error { return nil }
func (m *mockBACnetClient) WhoIsRouterToNetwork() *([]btypes.Address) { return nil }
func (m *mockBACnetClient) Objects(dev btypes.Device) (btypes.Device, error) {
	return dev, nil
}

func (m *mockBACnetClient) WhoIs(_ *bacnet.WhoIsOpts) ([]btypes.Device, error) {
	if m.whoIsErr != nil {
		return nil, m.whoIsErr
	}
	return m.whoIsDevices, nil
}

func (m *mockBACnetClient) ReadProperty(dest btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
	if m.readProp != nil {
		return m.readProp(dest, rp)
	}
	return rp, errors.New("read not configured")
}

func (m *mockBACnetClient) ReadMultiProperty(dev btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
	if m.readMulti != nil {
		return m.readMulti(dev, rp)
	}
	return rp, nil
}

func (m *mockBACnetClient) ReadPropertyWithTimeout(dest btypes.Device, rp btypes.PropertyData, _ time.Duration) (btypes.PropertyData, error) {
	return m.ReadProperty(dest, rp)
}

func (m *mockBACnetClient) ReadMultiPropertyWithTimeout(dev btypes.Device, rp btypes.MultiplePropertyData, _ time.Duration) (btypes.MultiplePropertyData, error) {
	return m.ReadMultiProperty(dev, rp)
}

func (m *mockBACnetClient) WriteProperty(_ btypes.Device, _ btypes.PropertyData) error {
	return m.writePropErr
}

func (m *mockBACnetClient) WriteMultiProperty(_ btypes.Device, _ btypes.MultiplePropertyData) error {
	return nil
}

func testDevice(t *testing.T, mock *mockBACnetClient) *Device {
	t.Helper()
	net := &Network{Client: mock}
	dev, err := NewDevice(net, &Device{
		Ip:       "192.168.1.10",
		DeviceID: 1001,
		MaxApdu:  btypes.MaxAPDU1476,
	})
	require.NoError(t, err)
	return dev
}

func TestCoverage_NetworkLifecycle(t *testing.T) {
	mock := &mockBACnetClient{}
	net := &Network{Client: mock}

	assert.False(t, net.IsRunning())
	go net.NetworkRun()
	time.Sleep(10 * time.Millisecond)
	assert.True(t, mock.running)
	net.NetworkClose()
}

func TestCoverage_DeviceWhois(t *testing.T) {
	mock := &mockBACnetClient{
		whoIsDevices: []btypes.Device{{DeviceID: 1001, MaxApdu: 1476}},
	}
	dev := testDevice(t, mock)

	found, err := dev.Whois(&bacnet.WhoIsOpts{Low: 1000, High: 2000})
	require.NoError(t, err)
	require.Len(t, found, 1)

	net := &Network{Client: mock}
	found2, err := net.Whois(&bacnet.WhoIsOpts{})
	require.NoError(t, err)
	assert.Len(t, found2, 1)
}

func TestCoverage_DeviceReadWriteObject(t *testing.T) {
	mock := &mockBACnetClient{
		readProp: func(_ btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
			out := rp
			switch rp.Object.Properties[0].Type {
			case btypes.PropPresentValue:
				out.Object.Properties[0].Data = float32(23.5)
			case btypes.PropObjectName:
				out.Object.Properties[0].Data = "AV-1"
			case btypes.PropUnits:
				out.Object.Properties[0].Data = uint32(95)
			case btypes.PropPriorityArray:
				out.Object.Properties[0].Data = []float32{0, 0, 0, 0, 0, 0, 0, 0, 23.5}
			default:
				out.Object.Properties[0].Data = "value"
			}
			return out, nil
		},
	}
	dev := testDevice(t, mock)

	pnt := &Point{ObjectID: 1, ObjectType: btypes.AnalogValue}
	val, err := dev.PointReadFloat32(pnt)
	require.NoError(t, err)
	assert.InDelta(t, float32(23.5), val, 0.01)

	pri, err := dev.PointReadPriority(pnt)
	require.NoError(t, err)
	assert.NotNil(t, pri)

	boolVal, err := dev.PointReadBool(&Point{ObjectID: 2, ObjectType: btypes.BinaryValue})
	require.NoError(t, err)
	assert.Equal(t, uint32(0), boolVal)

	details, err := dev.PointDetails(pnt)
	require.NoError(t, err)
	assert.Equal(t, "AV-1", details.Name)

	name, err := dev.ReadPointName(pnt)
	require.NoError(t, err)
	assert.Equal(t, "AV-1", name)

	obj := &Object{ObjectID: 1, ObjectType: btypes.AnalogValue, Prop: btypes.PropPresentValue, ArrayIndex: bacnet.ArrayAll}
	read, err := dev.Read(obj)
	require.NoError(t, err)
	assert.NotEmpty(t, read.Object.Properties)

	_, err = dev.Read(nil)
	require.Error(t, err)

	mock.writePropErr = nil
	require.NoError(t, dev.PointWriteAnalogue(pnt, 99.0))
	require.NoError(t, dev.PointWriteBool(&Point{ObjectID: 2, ObjectType: btypes.BinaryValue}, 1))
	require.NoError(t, dev.WritePointName(pnt, "renamed"))
	require.NoError(t, dev.WriteDeviceName(1001, "device-name"))
}

func TestCoverage_PointReleasePriorityValidation(t *testing.T) {
	dev := testDevice(t, &mockBACnetClient{})
	require.Error(t, dev.PointReleasePriority(nil, 8))
	require.Error(t, dev.PointReleasePriority(&Point{}, 0))
	require.Error(t, dev.PointReleasePriority(&Point{}, 17))
}

func TestCoverage_DeviceUpdateAndHelpers(t *testing.T) {
	dev := testDevice(t, &mockBACnetClient{})
	require.NoError(t, dev.Update())

	assert.True(t, dev.isPointFloat(&Point{ObjectType: btypes.AnalogInput}))
	assert.True(t, dev.isPointBool(&Point{ObjectType: btypes.BinaryInput}))
	assert.True(t, dev.isPointWriteable(&Point{ObjectType: btypes.AnalogOutput}))

	pd := btypes.PropertyData{
		Object: btypes.Object{
			Properties: []btypes.Property{{Data: float32(1.5)}},
		},
	}
	assert.InDelta(t, float32(1.5), dev.toFloat(pd), 0.01)
	assert.Equal(t, uint32(3), dev.toUint32(btypes.PropertyData{
		Object: btypes.Object{Properties: []btypes.Property{{Data: uint32(3)}}},
	}))
	assert.Equal(t, "txt", dev.toStr(btypes.PropertyData{
		Object: btypes.Object{Properties: []btypes.Property{{Data: "txt"}}},
	}))

	write := &Write{
		ObjectID: 1, ObjectType: btypes.AnalogValue,
		Prop: btypes.PropPresentValue, WriteNull: true, WritePriority: 8,
	}
	mock := &mockBACnetClient{}
	dev.network = mock
	require.NoError(t, dev.Write(write))
}

func TestCoverage_ReadSingleAndMulti(t *testing.T) {
	mock := &mockBACnetClient{
		readProp: func(_ btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
			rp.Object.Properties[0].Data = "single"
			return rp, nil
		},
		readMulti: func(_ btypes.Device, rp btypes.MultiplePropertyData) (btypes.MultiplePropertyData, error) {
			for i := range rp.Objects {
				for j := range rp.Objects[i].Properties {
					rp.Objects[i].Properties[j].Data = float32(1)
				}
			}
			return rp, nil
		},
	}
	dev := testDevice(t, mock)

	single, err := dev.ReadSingle(btypes.PropertyData{
		Object: btypes.Object{
			ID:         btypes.ObjectID{Type: btypes.AnalogValue, Instance: 1},
			Properties: []btypes.Property{{Type: btypes.PropPresentValue}},
		},
	})
	require.NoError(t, err)
	assert.Equal(t, "single", dev.toStr(single))

	multi, err := dev.ReadMuti(btypes.MultiplePropertyData{
		Objects: []btypes.Object{{
			ID:         btypes.ObjectID{Type: btypes.AnalogValue, Instance: 1},
			Properties: []btypes.Property{{Type: btypes.PropPresentValue}},
		}},
	})
	require.NoError(t, err)
	assert.NotEmpty(t, multi.Objects)
}

func TestCoverage_DeviceObjectsAndDiscover(t *testing.T) {
	mock := &mockBACnetClient{
		whoIsDevices: []btypes.Device{{
			DeviceID: 1001,
			MaxApdu:  480,
			Addr:     btypes.Address{Net: 0, Mac: []byte{192, 168, 1, 10, 0xBA, 0xC0}, Adr: []byte{5}},
			ID:       btypes.ObjectID{Type: btypes.DeviceType, Instance: 1001},
		}},
		readProp: func(_ btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
			out := rp
			prop := rp.Object.Properties[0]
			switch prop.Type {
			case btypes.PropObjectList:
				if prop.ArrayIndex == 0 {
					out.Object.Properties[0].Data = uint32(1)
				} else if prop.ArrayIndex == bacnet.ArrayAll {
					out.Object.Properties[0].Data = []interface{}{
						btypes.ObjectID{Type: btypes.AnalogValue, Instance: 1},
					}
				} else {
					out.Object.Properties[0].Data = btypes.ObjectID{Type: btypes.AnalogValue, Instance: btypes.ObjectInstance(prop.ArrayIndex)}
				}
			case btypes.PropObjectName:
				out.Object.Properties[0].Data = "AV1"
			case btypes.PropMaxAPDU:
				out.Object.Properties[0].Data = uint32(480)
			case btypes.PropVendorName:
				out.Object.Properties[0].Data = "Vendor"
			default:
				out.Object.Properties[0].Data = uint32(0)
			}
			return out, nil
		},
	}
	dev := testDevice(t, mock)

	list, err := dev.DeviceObjects(1001, true)
	require.NoError(t, err)
	require.Len(t, list, 1)

	details, err := dev.GetDeviceDetails(1001)
	require.NoError(t, err)
	assert.Equal(t, "Vendor", details.VendorName)

	points, err := dev.GetDevicePoints(1001)
	require.NoError(t, err)
	assert.NotEmpty(t, points)

	require.NoError(t, dev.DeviceDiscover())
}

func TestCoverage_NewDeviceErrors(t *testing.T) {
	dev, err := NewDevice(nil, &Device{Ip: "1.2.3.4", DeviceID: 1})
	require.Nil(t, dev)
	require.NoError(t, err) // legacy: nil net prints but returns nil error

	mock := &mockBACnetClient{}
	net := &Network{Client: mock}
	dev, err = NewDevice(net, &Device{Ip: "192.168.1.1", DeviceID: 1, MaxApdu: 1476})
	require.NoError(t, err)
	assert.NotNil(t, dev)
}

func TestCoverage_StoreHelpers(t *testing.T) {
	store := NewStore()
	mock := &mockBACnetClient{}
	net := &Network{Client: mock, StoreID: "net-1", Interface: "lo0", Port: 47808}
	BacStore.Set("net-1", net, -1)

	gotNet, err := store.GetNetwork("net-1")
	require.NoError(t, err)
	assert.Equal(t, net, gotNet)

	dev, err := NewDevice(net, &Device{Ip: "10.0.0.1", DeviceID: 9, StoreID: "dev-9", MaxApdu: 480})
	require.NoError(t, err)
	require.NoError(t, store.UpdateDevice("dev-9", net, dev))

	gotDev, err := store.GetDevice("dev-9")
	require.NoError(t, err)
	assert.Equal(t, dev, gotDev)

	_, err = store.GetNetwork("missing")
	require.Error(t, err)
	_, err = store.GetDevice("missing")
	require.Error(t, err)
}

func TestCoverage_ReadStringAndDeviceName(t *testing.T) {
	mock := &mockBACnetClient{
		readProp: func(_ btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
			rp.Object.Properties[0].Data = "named"
			return rp, nil
		},
	}
	dev := testDevice(t, mock)

	s, err := dev.ReadString(&Object{
		ObjectID: 1, ObjectType: btypes.AnalogValue,
		Prop: btypes.PropObjectName, ArrayIndex: bacnet.ArrayAll,
	})
	require.NoError(t, err)
	assert.Equal(t, "named", s)

	name, err := dev.ReadDeviceName(1001)
	require.NoError(t, err)
	assert.Equal(t, "named", name)
}

func TestCoverage_DeviceObjectsBuilderFallback(t *testing.T) {
	calls := 0
	mock := &mockBACnetClient{
		readProp: func(_ btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
			calls++
			out := rp
			if rp.Object.Properties[0].ArrayIndex == bacnet.ArrayAll {
				return out, errors.New("array-all unsupported")
			}
			if rp.Object.Properties[0].ArrayIndex == 0 {
				out.Object.Properties[0].Data = uint32(2)
				return out, nil
			}
			out.Object.Properties[0].Data = btypes.ObjectID{
				Type: btypes.AnalogValue, Instance: btypes.ObjectInstance(rp.Object.Properties[0].ArrayIndex),
			}
			return out, nil
		},
	}
	dev := testDevice(t, mock)
	list, err := dev.DeviceObjects(1001, false)
	require.NoError(t, err)
	require.Len(t, list, 2)
	assert.GreaterOrEqual(t, calls, 3)
}

func TestCoverage_ReadErrors(t *testing.T) {
	mock := &mockBACnetClient{
		readProp: func(_ btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
			if rp.Object.Properties[0].Type == btypes.PropObjectList {
				return rp, errors.New("object list error")
			}
			return rp, errors.New("read failed")
		},
	}
	dev := testDevice(t, mock)
	_, err := dev.Read(&Object{
		ObjectID: 1, ObjectType: btypes.DeviceType,
		Prop: btypes.PropObjectList, ArrayIndex: bacnet.ArrayAll,
	})
	require.Error(t, err)

	mock.readProp = func(_ btypes.Device, rp btypes.PropertyData) (btypes.PropertyData, error) {
		return rp, nil
	}
	_, err = dev.Read(&Object{ObjectID: 1, ObjectType: btypes.AnalogValue, Prop: btypes.PropPresentValue})
	require.NoError(t, err)
}

func TestCoverage_PointWriteErrors(t *testing.T) {
	mock := &mockBACnetClient{writePropErr: errors.New("write failed")}
	dev := testDevice(t, mock)
	err := dev.PointWriteAnalogue(&Point{ObjectID: 1, ObjectType: btypes.AnalogValue}, 1.0)
	require.Error(t, err)
}

func TestCoverage_IsPointHelpersFalseBranches(t *testing.T) {
	dev := testDevice(t, &mockBACnetClient{})
	assert.False(t, dev.isPointFloat(&Point{ObjectType: btypes.BinaryInput}))
	assert.False(t, dev.isPointBool(&Point{ObjectType: btypes.AnalogInput}))
	assert.True(t, dev.isPointWriteable(&Point{ObjectType: btypes.MultiStateValue}))
}
