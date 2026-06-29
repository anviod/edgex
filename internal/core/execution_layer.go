package core

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
)

var (
	ErrDriverNotFound = errors.New("driver not found")
	ErrQueueFull      = errors.New("queue full")
	ErrRateLimited    = errors.New("rate limited")
)

type ProtocolType int

const (
	ProtocolTypeSerial ProtocolType = iota
	ProtocolTypeParallel
	ProtocolTypeLimited
)

type ExecuteResult struct {
	Success bool
	Values  map[string]model.Value
	Error   error
}

// DeviceIOProfile Modbus 等协议的动态 IO 参数（来自 Shadow 通信画像）。
type DeviceIOProfile struct {
	Gap       int
	BatchSize int
}

type IOProfileProvider func(deviceID string) DeviceIOProfile

type ExecutionLayer struct {
	serialManager      *SerialQueueManager
	backpressure       *BackpressureController
	workerPool         *WorkerPool
	gapOptimizer       *GapOptimizer
	pointDegradation   *PointDegradationManager
	ioProfileProvider  IOProfileProvider
	protocolRegistry   map[string]ProtocolType
	driverRegistry     map[string]driver.Driver
	mu                 sync.RWMutex
	stopCh             chan struct{}
}

func NewExecutionLayer() *ExecutionLayer {
	return &ExecutionLayer{
		serialManager:    NewSerialQueueManager(),
		backpressure:     NewBackpressureController(512, 1000),
		workerPool:       NewWorkerPool(32),
		gapOptimizer:     NewGapOptimizer(),
		protocolRegistry: make(map[string]ProtocolType),
		driverRegistry:   make(map[string]driver.Driver),
		stopCh:           make(chan struct{}),
	}
}

func (el *ExecutionLayer) RegisterProtocol(protocol string, pType ProtocolType) {
	el.mu.Lock()
	defer el.mu.Unlock()
	el.protocolRegistry[protocol] = pType
}

func (el *ExecutionLayer) RegisterDriver(deviceKey string, d driver.Driver) {
	el.mu.Lock()
	defer el.mu.Unlock()
	el.driverRegistry[deviceKey] = d
	el.serialManager.RegisterDriver(deviceKey, d)
}

func (el *ExecutionLayer) UnregisterDriver(deviceKey string) {
	el.mu.Lock()
	defer el.mu.Unlock()
	delete(el.driverRegistry, deviceKey)
	el.serialManager.RemoveContext(deviceKey)
}

func (el *ExecutionLayer) GetDriver(deviceKey string) driver.Driver {
	el.mu.RLock()
	defer el.mu.RUnlock()
	return el.driverRegistry[deviceKey]
}

func (el *ExecutionLayer) Execute(task *ScanTask) *ExecuteResult {
	el.mu.RLock()
	pType, ok := el.protocolRegistry[task.Protocol]
	el.mu.RUnlock()

	if !ok {
		pType = ProtocolTypeSerial
	}

	switch pType {
	case ProtocolTypeSerial:
		return el.executeSerial(task)
	case ProtocolTypeParallel:
		return el.executeParallel(task)
	case ProtocolTypeLimited:
		return el.executeLimited(task)
	default:
		return el.executeSerial(task)
	}
}

func (el *ExecutionLayer) executeTimeout(task *ScanTask) time.Duration {
	timeout := task.Interval * 2
	if timeout < 5*time.Second {
		timeout = 5 * time.Second
	}
	return timeout
}

// isSharedLinkProtocol identifies protocols where multiple devices share one
// physical link (TCP socket or serial bus) and must not run I/O concurrently.
func isSharedLinkProtocol(protocol string) bool {
	switch protocol {
	case "modbus-tcp", "modbus-rtu", "modbus-rtu-over-tcp", "dlt645", "omron-fins", "mitsubishi-slmp":
		return true
	default:
		return false
	}
}

// serialQueueKey routes shared-link devices through one per-channel queue so a
// slow/offline slave cannot block peers via channelMu contention + scan timeout.
func (el *ExecutionLayer) serialQueueKey(task *ScanTask) string {
	if task == nil {
		return ""
	}
	if isSharedLinkProtocol(task.Protocol) && task.Params != nil {
		if channelID, ok := task.Params["channelID"].(string); ok && channelID != "" {
			return "shared:" + channelID
		}
	}
	return task.DeviceKey
}

func (el *ExecutionLayer) serialOuterTimeout(task *ScanTask) time.Duration {
	readTimeout := el.executeTimeout(task)
	if isSharedLinkProtocol(task.Protocol) {
		// Allow several peers to queue on the same TCP/serial link.
		return readTimeout * 16
	}
	return readTimeout
}

func (el *ExecutionLayer) executeSerial(task *ScanTask) *ExecuteResult {
	d := el.GetDriver(task.DeviceKey)
	if d == nil {
		return &ExecuteResult{Success: false, Error: ErrDriverNotFound}
	}

	readTimeout := el.executeTimeout(task)
	outerCtx, outerCancel := context.WithTimeout(context.Background(), el.serialOuterTimeout(task))
	defer outerCancel()

	resultChan := make(chan *ExecuteResult, 1)
	points := el.loadPoints(task)

	taskObj := &DriverTask{
		DeviceKey: el.serialQueueKey(task),
		Points:    points,
		ReadFunc: func(context.Context, []model.Point) (map[string]model.Value, error) {
			execCtx, execCancel := context.WithTimeout(context.Background(), readTimeout)
			defer execCancel()
			return el.readPoints(d, task, execCtx, points)
		},
		Callback: func(values map[string]model.Value, err error) {
			select {
			case resultChan <- &ExecuteResult{Success: err == nil, Values: values, Error: err}:
			default:
			}
		},
	}

	if !el.serialManager.Submit(taskObj) {
		return &ExecuteResult{Success: false, Error: ErrQueueFull}
	}

	select {
	case result := <-resultChan:
		return result
	case <-outerCtx.Done():
		return &ExecuteResult{Success: false, Error: ErrTimeout}
	case <-el.stopCh:
		return &ExecuteResult{Success: false, Error: ErrTimeout}
	}
}

func (el *ExecutionLayer) executeParallel(task *ScanTask) *ExecuteResult {
	d := el.GetDriver(task.DeviceKey)
	if d == nil {
		return &ExecuteResult{Success: false, Error: ErrDriverNotFound}
	}

	if !el.backpressure.Allow(task.DeviceKey, 8) {
		return &ExecuteResult{Success: false, Error: ErrRateLimited}
	}

	resultChan := make(chan *ExecuteResult, 1)
	points := el.loadPoints(task)

	el.workerPool.Submit(func() {
		defer el.backpressure.Release(task.DeviceKey)

		values, err := el.readPoints(d, task, context.Background(), points)

		if err != nil {
			resultChan <- &ExecuteResult{Success: false, Error: err}
		} else {
			resultChan <- &ExecuteResult{Success: true, Values: values}
		}
	})

	select {
	case result := <-resultChan:
		return result
	case <-time.After(el.executeTimeout(task)):
		return &ExecuteResult{Success: false, Error: ErrTimeout}
	}
}

func (el *ExecutionLayer) executeLimited(task *ScanTask) *ExecuteResult {
	if !el.backpressure.Allow(task.DeviceKey, 2) {
		return &ExecuteResult{Success: false, Error: ErrRateLimited}
	}

	defer el.backpressure.Release(task.DeviceKey)

	return el.executeSerial(task)
}

func (el *ExecutionLayer) loadPoints(task *ScanTask) []model.Point {
	if len(task.Points) > 0 {
		points := make([]model.Point, len(task.Points))
		copy(points, task.Points)
		for i := range points {
			points[i].DeviceID = task.DeviceKey
		}
		return points
	}
	var points []model.Point
	for _, id := range task.PointIDs {
		points = append(points, model.Point{ID: id, DeviceID: task.DeviceKey})
	}
	return points
}

func (el *ExecutionLayer) SetPointDegradation(m *PointDegradationManager) {
	el.mu.Lock()
	el.pointDegradation = m
	el.mu.Unlock()
}

func (el *ExecutionLayer) SetIOProfileProvider(fn IOProfileProvider) {
	el.mu.Lock()
	el.ioProfileProvider = fn
	el.mu.Unlock()
}

func (el *ExecutionLayer) filterPoints(task *ScanTask, points []model.Point) []model.Point {
	el.mu.RLock()
	pd := el.pointDegradation
	el.mu.RUnlock()
	if pd == nil || len(points) == 0 {
		return points
	}
	ids := make([]string, len(points))
	for i, p := range points {
		ids[i] = p.ID
	}
	activeIDs, _ := pd.FilterForRead(task.DeviceKey, ids)
	if len(activeIDs) == len(points) {
		return points
	}
	active := make(map[string]struct{}, len(activeIDs))
	for _, id := range activeIDs {
		active[id] = struct{}{}
	}
	filtered := make([]model.Point, 0, len(activeIDs))
	for _, p := range points {
		if _, ok := active[p.ID]; ok {
			filtered = append(filtered, p)
		}
	}
	return filtered
}

func (el *ExecutionLayer) recordPointResults(task *ScanTask, values map[string]model.Value) {
	el.mu.RLock()
	pd := el.pointDegradation
	el.mu.RUnlock()
	if pd == nil || len(values) == 0 {
		return
	}
	qualities := make(map[string]string, len(values))
	for id, v := range values {
		qualities[id] = v.Quality
	}
	pd.RecordResults(task.DeviceKey, qualities)
}

func (el *ExecutionLayer) readPoints(d driver.Driver, task *ScanTask, ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	if len(points) == 0 {
		points = el.loadPoints(task)
	}
	points = el.filterPoints(task, points)
	if len(points) == 0 {
		return map[string]model.Value{}, nil
	}

	if task.Params != nil {
		if mu, ok := task.Params["channelMu"].(*sync.Mutex); ok && mu != nil {
			mu.Lock()
			defer mu.Unlock()
		}
		cfg := map[string]any{}
		if base, ok := task.Params["driverConfig"].(map[string]any); ok && base != nil {
			for k, v := range base {
				cfg[k] = v
			}
		}
		if isModbusProtocol(task.Protocol) {
			el.mu.RLock()
			provider := el.ioProfileProvider
			el.mu.RUnlock()
			if provider != nil {
				profile := provider(task.DeviceKey)
				if profile.Gap > 0 {
					cfg["max_gap"] = profile.Gap
					cfg["group_threshold"] = profile.Gap
					el.gapOptimizer.SetGap(task.DeviceKey, profile.Gap)
				}
				if profile.BatchSize > 0 {
					cfg["batchSize"] = profile.BatchSize
				}
			} else {
				gap := el.gapOptimizer.GetCurrentGap(task.DeviceKey)
				cfg["max_gap"] = gap
				cfg["group_threshold"] = gap
			}
		}
		if len(cfg) > 0 {
			if err := d.SetDeviceConfig(cfg); err != nil {
				return nil, err
			}
		}
		if slaveID, ok := task.Params["slave_id"]; ok {
			switch v := slaveID.(type) {
			case float64:
				d.SetSlaveID(uint8(v))
			case int:
				d.SetSlaveID(uint8(v))
			}
		}
	}

	values, err := d.ReadPoints(ctx, points)
	if err == nil {
		el.recordPointResults(task, values)
	}
	return values, err
}

func isModbusProtocol(protocol string) bool {
	switch protocol {
	case "modbus-tcp", "modbus-rtu", "modbus-rtu-over-tcp":
		return true
	default:
		return false
	}
}

func (el *ExecutionLayer) Start() {
	el.workerPool.Start()
}

func (el *ExecutionLayer) Stop() {
	close(el.stopCh)
	el.workerPool.Stop()
	el.serialManager.Stop()
}