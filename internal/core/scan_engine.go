package core

import (
	"container/heap"
	"fmt"
	"sync"
	"time"

	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"go.uber.org/zap"
)

type ScanEngineConfig struct {
	TickInterval      time.Duration
	WorkerCount       int
	MaxQueueSize      int
	AntiStarvationSec int
	PriorityLevels    int
	GoroutineLimit    int
	ConnectionLimit   int
}

type ScanTaskStatus int

const (
	ScanTaskStatusIdle     ScanTaskStatus = iota
	ScanTaskStatusRunning
	ScanTaskStatusDegraded
	ScanTaskStatusStopped
)

func (s ScanTaskStatus) String() string {
	switch s {
	case ScanTaskStatusIdle:
		return "Idle"
	case ScanTaskStatusRunning:
		return "Running"
	case ScanTaskStatusDegraded:
		return "Degraded"
	case ScanTaskStatusStopped:
		return "Stopped"
	default:
		return "Unknown"
	}
}

type ScanTask struct {
	ID                  string
	DeviceKey           string
	ScanClass           string
	Protocol            string
	Interval            time.Duration
	BaseInterval        time.Duration
	NextRun             time.Time
	Priority            int
	FailRate            float64
	Status              ScanTaskStatus
	ConsecutiveFailures int
	ConsecutiveSuccess  int
	LastSuccess         time.Time
	LastFailure         time.Time
	PointIDs            []string
	Points              []model.Point
	Params              map[string]any
	mu                  sync.RWMutex
}

func (t *ScanTask) GetStatus() ScanTaskStatus {
	t.mu.RLock()
	defer t.mu.RUnlock()
	return t.Status
}

func (t *ScanTask) SetStatus(status ScanTaskStatus) {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.Status = status
}

func (t *ScanTask) UpdateNextRun(interval time.Duration) {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.NextRun = time.Now().Add(interval)
}

type PriorityQueue []*ScanTask

func (pq PriorityQueue) Len() int { return len(pq) }

func (pq PriorityQueue) Less(i, j int) bool {
	if pq[i].NextRun.Before(pq[j].NextRun) {
		return true
	}
	if pq[i].NextRun.Equal(pq[j].NextRun) {
		return pq[i].Priority > pq[j].Priority
	}
	return false
}

func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
}

func (pq *PriorityQueue) Push(x interface{}) {
	*pq = append(*pq, x.(*ScanTask))
}

func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	n := len(old)
	item := old[n-1]
	*pq = old[0 : n-1]
	return item
}

func (pq *PriorityQueue) Peek() *ScanTask {
	if len(*pq) == 0 {
		return nil
	}
	return (*pq)[0]
}

// CollectFinalizeFunc 采集完成后回写设备通信状态。
type CollectFinalizeFunc func(deviceID string, result *ExecuteResult)

type ScanEngine struct {
	tasks           map[string]*ScanTask
	priorityQueue   *PriorityQueue
	executionLayer  *ExecutionLayer
	resourceCtrl    *ResourceController
	shadowCore      *ShadowCore
	shadowIngress   *ShadowIngress
	pointDegrade    *PointDegradationManager
	collectFinalize CollectFinalizeFunc
	metrics         *ScanEngineMetrics
	config          ScanEngineConfig
	ticker          *time.Ticker
	running         bool
	stopCh          chan struct{}
	wg              sync.WaitGroup
	mu              sync.RWMutex
	taskIDCounter   int
}

func NewScanEngine(config ScanEngineConfig) *ScanEngine {
	if config.TickInterval == 0 {
		config.TickInterval = 10 * time.Millisecond
	}
	if config.WorkerCount == 0 {
		config.WorkerCount = 4
	}
	if config.MaxQueueSize == 0 {
		config.MaxQueueSize = 10000
	}
	if config.AntiStarvationSec == 0 {
		config.AntiStarvationSec = 300
	}
	if config.PriorityLevels == 0 {
		config.PriorityLevels = 10
	}
	if config.GoroutineLimit == 0 {
		config.GoroutineLimit = 2048
	}
	if config.ConnectionLimit == 0 {
		config.ConnectionLimit = 500
	}

	se := &ScanEngine{
		tasks:         make(map[string]*ScanTask),
		priorityQueue: &PriorityQueue{},
		executionLayer: NewExecutionLayer(),
		resourceCtrl: NewResourceController(ResourceLimits{
			GoroutineLimit:  config.GoroutineLimit,
			ConnectionLimit: config.ConnectionLimit,
			QueueLimit:      config.MaxQueueSize,
		}),
		shadowCore: nil,
		metrics:    &ScanEngineMetrics{},
		config:     config,
		stopCh:     make(chan struct{}),
	}

	heap.Init(se.priorityQueue)

	return se
}

func (se *ScanEngine) Run() {
	se.mu.Lock()
	if se.running {
		se.mu.Unlock()
		return
	}
	se.running = true
	se.mu.Unlock()

	se.wg.Add(1)
	go se.dispatchLoop()

	se.wg.Add(1)
	go se.resourceCtrl.Monitor(&se.wg)

	if se.executionLayer != nil {
		se.executionLayer.Start()
	}

	zap.L().Info("[ScanEngine] 调度引擎已启动",
		zap.String("tickInterval", se.config.TickInterval.String()),
		zap.Int("workerCount", se.config.WorkerCount),
		zap.Int("maxQueueSize", se.config.MaxQueueSize),
		zap.Int("antiStarvationSec", se.config.AntiStarvationSec),
		zap.Int("goroutineLimit", se.config.GoroutineLimit),
		zap.Int("connectionLimit", se.config.ConnectionLimit),
	)
}

func (se *ScanEngine) Stop() {
	se.mu.Lock()
	if !se.running {
		se.mu.Unlock()
		return
	}
	se.running = false
	se.mu.Unlock()

	close(se.stopCh)

	if se.ticker != nil {
		se.ticker.Stop()
	}

	se.resourceCtrl.Stop()
	if se.executionLayer != nil {
		se.executionLayer.Stop()
	}

	se.wg.Wait()

	zap.L().Info("[ScanEngine] 调度引擎已停止")
}

func (se *ScanEngine) dispatchLoop() {
	defer se.wg.Done()

	fallback := time.NewTicker(se.config.TickInterval)
	defer fallback.Stop()

	var wakeTimer *time.Timer
	var wakeCh <-chan time.Time

	scheduleWake := func() {
		next := se.nextReadyTime()
		if next.IsZero() {
			if wakeTimer != nil {
				if !wakeTimer.Stop() {
					select {
					case <-wakeTimer.C:
					default:
					}
				}
				wakeTimer = nil
				wakeCh = nil
			}
			return
		}

		delay := time.Until(next)
		if delay < 0 {
			delay = 0
		}

		if wakeTimer == nil {
			wakeTimer = time.NewTimer(delay)
			wakeCh = wakeTimer.C
			return
		}

		if !wakeTimer.Stop() {
			select {
			case <-wakeTimer.C:
			default:
			}
		}
		wakeTimer.Reset(delay)
		wakeCh = wakeTimer.C
	}

	scheduleWake()

	for {
		select {
		case <-se.stopCh:
			if wakeTimer != nil {
				wakeTimer.Stop()
			}
			return
		case <-wakeCh:
			se.processReadyTasks()
			scheduleWake()
		case <-fallback.C:
			now := time.Now()
			se.enforceAntiStarvation(now)
			se.processReadyTasks()
			scheduleWake()
		}
	}
}

func (se *ScanEngine) nextReadyTime() time.Time {
	se.mu.RLock()
	defer se.mu.RUnlock()
	if se.priorityQueue.Len() == 0 {
		return time.Time{}
	}
	task := (*se.priorityQueue)[0]
	if task == nil {
		return time.Time{}
	}
	return task.NextRun
}

func (se *ScanEngine) processReadyTasks() {
	now := time.Now()

	for {
		task := se.priorityQueue.Peek()
		if task == nil || now.Before(task.NextRun) {
			break
		}

		se.mu.Lock()
		task = se.priorityQueue.Pop().(*ScanTask)
		se.mu.Unlock()

		if !se.resourceCtrl.CanExecute() {
			se.mu.Lock()
			heap.Push(se.priorityQueue, task)
			se.mu.Unlock()
			continue
		}

		if task.GetStatus() == ScanTaskStatusStopped {
			continue
		}

		se.resourceCtrl.Acquire()
		go se.executeTaskAsync(task)
	}

	se.enforceAntiStarvation(now)
}

func (se *ScanEngine) enforceAntiStarvation(now time.Time) {
	antiStarvationDuration := time.Duration(se.config.AntiStarvationSec) * time.Second

	se.mu.Lock()
	defer se.mu.Unlock()

	for _, task := range se.tasks {
		if task.NextRun.IsZero() {
			continue
		}
		if now.Sub(task.NextRun) > antiStarvationDuration {
			se.metrics.RecordOverdue()
			zap.L().Warn("[防饿死] 任务超过预期执行时间",
				zap.String("taskID", task.ID),
				zap.String("deviceKey", task.DeviceKey),
				zap.Duration("overdue", now.Sub(task.NextRun)),
			)
			if task.GetStatus() == ScanTaskStatusIdle {
				se.metrics.RecordStarvationRescue()
				task.Priority = 10
				task.NextRun = now
				heap.Push(se.priorityQueue, task)
			}
		}
	}
}

func (se *ScanEngine) executeTaskAsync(task *ScanTask) {
	defer se.resourceCtrl.Release()

	task.SetStatus(ScanTaskStatusRunning)

	task.mu.RLock()
	scheduledAt := task.NextRun
	task.mu.RUnlock()
	start := time.Now()
	lagMicros := start.Sub(scheduledAt).Microseconds()
	if lagMicros < 0 {
		lagMicros = 0
	}

	var result *ExecuteResult
	if se.executionLayer != nil {
		result = se.executionLayer.Execute(task)
	} else {
		result = &ExecuteResult{Success: false, Error: ErrDriverNotFound}
	}

	if result.Success && se.shadowCore != nil {
		se.shadowCore.UpdateDeviceRTT(task.DeviceKey, time.Since(start).Microseconds())
	}
	se.metrics.RecordExecute(result != nil && result.Success, lagMicros)

	if result.Success && len(result.Values) > 0 {
		channelID := ""
		if task.Params != nil {
			if id, ok := task.Params["channelID"].(string); ok {
				channelID = id
			}
		}
		now := time.Now()
		points := make([]model.ShadowIngressPoint, 0, len(result.Values))
		for pointID, value := range result.Values {
			collectedAt := value.TS
			if collectedAt.IsZero() {
				collectedAt = now
			}
			degraded := false
			if se.pointDegrade != nil {
				degraded = se.pointDegrade.IsDegraded(task.DeviceKey, pointID)
			}
			points = append(points, model.ShadowIngressPoint{
				PointID:        pointID,
				Value:          value.Value,
				Quality:        value.Quality,
				SamplePeriodMs: int(task.Interval.Milliseconds()),
				CollectedAt:    collectedAt,
				Degraded:       degraded,
			})
		}
		msg := model.ShadowIngressMessage{
			DeviceID:  task.DeviceKey,
			ChannelID: channelID,
			Timestamp: now,
			Points:    points,
			Meta: model.ShadowIngressMeta{
				Source: "scan_engine",
			},
		}
		if se.shadowIngress != nil {
			se.shadowIngress.IngestDirect(msg)
		} else if se.shadowCore != nil {
			se.shadowCore.WriteShadowDevice(msg)
		}
	}

	se.updateTaskState(task, result)

	if se.collectFinalize != nil {
		se.collectFinalize(task.DeviceKey, result)
	}

	task.SetStatus(ScanTaskStatusIdle)

	se.mu.RLock()
	running := se.running
	se.mu.RUnlock()

	if !running {
		return
	}

	task.mu.Lock()
	currentInterval := task.Interval
	task.mu.Unlock()

	task.UpdateNextRun(currentInterval)

	se.mu.Lock()
	if se.running {
		heap.Push(se.priorityQueue, task)
	}
	se.mu.Unlock()
}

func (se *ScanEngine) updateTaskState(task *ScanTask, result *ExecuteResult) {
	task.mu.Lock()
	defer task.mu.Unlock()

	if result.Success {
		task.ConsecutiveSuccess++
		task.ConsecutiveFailures = 0
		task.LastSuccess = time.Now()
		task.FailRate = 0
		task.Status = ScanTaskStatusIdle

		if task.Priority < 10 {
			task.Priority++
		}
	} else {
		task.ConsecutiveFailures++
		task.ConsecutiveSuccess = 0
		task.LastFailure = time.Now()
		task.FailRate = (task.FailRate*0.8 + 1.0*0.2)

		if task.ConsecutiveFailures >= 3 && se.taskDegradeOnFailure(task) {
			shift := task.ConsecutiveFailures - 3
			if shift > 6 {
				shift = 6
			}
			newInterval := task.Interval * (1 << shift)
			if newInterval > 64*time.Second {
				newInterval = 64 * time.Second
			}
			if task.BaseInterval > 0 && newInterval < task.BaseInterval {
				newInterval = task.BaseInterval
			}
			if newInterval < time.Millisecond {
				newInterval = time.Millisecond
			}
			zap.L().Warn("[降级] 任务失败率过高，调整采集间隔",
				zap.String("taskID", task.ID),
				zap.String("deviceKey", task.DeviceKey),
				zap.Int("failures", task.ConsecutiveFailures),
				zap.Duration("oldInterval", task.Interval),
				zap.Duration("newInterval", newInterval),
			)
			task.Interval = newInterval
			task.Status = ScanTaskStatusDegraded
		}

		if task.Priority > 1 {
			task.Priority--
		}
	}
}

func (se *ScanEngine) taskDegradeOnFailure(task *ScanTask) bool {
	if task.Params == nil {
		return true
	}
	if v, ok := task.Params["degradeOnFailure"].(bool); ok {
		return v
	}
	return true
}

func (se *ScanEngine) AddTask(deviceKey, protocol string, interval time.Duration, priority int, pointIDs []string, params map[string]any) *ScanTask {
	return se.addTask(deviceKey, protocol, "", interval, priority, pointIDs, params)
}

func (se *ScanEngine) AddTaskWithScanClass(deviceKey, protocol, scanClass string, interval time.Duration, priority int, pointIDs []string, params map[string]any) *ScanTask {
	return se.addTask(deviceKey, protocol, scanClass, interval, priority, pointIDs, params)
}

func (se *ScanEngine) addTask(deviceKey, protocol, scanClass string, interval time.Duration, priority int, pointIDs []string, params map[string]any) *ScanTask {
	se.mu.Lock()
	defer se.mu.Unlock()

	taskID := fmt.Sprintf("task_%d_%s", se.taskIDCounter, deviceKey)
	if scanClass != "" {
		taskID = fmt.Sprintf("task_%d_%s_%s", se.taskIDCounter, deviceKey, scanClass)
	}
	se.taskIDCounter++

	var points []model.Point
	if params != nil {
		if pts, ok := params["points"].([]model.Point); ok {
			points = pts
		}
	}

	task := &ScanTask{
		ID:           taskID,
		DeviceKey:    deviceKey,
		ScanClass:    scanClass,
		Protocol:     protocol,
		Interval:     interval,
		BaseInterval: interval,
		NextRun:      time.Now(),
		Priority:     priority,
		FailRate:     0,
		Status:       ScanTaskStatusIdle,
		PointIDs:     pointIDs,
		Points:       points,
		Params:       params,
		LastSuccess:  time.Time{},
		LastFailure:  time.Time{},
	}

	se.tasks[taskID] = task
	heap.Push(se.priorityQueue, task)

	zap.L().Info("[ScanEngine] 添加任务",
		zap.String("taskID", taskID),
		zap.String("deviceKey", deviceKey),
		zap.String("scanClass", scanClass),
		zap.String("protocol", protocol),
		zap.Duration("interval", interval),
		zap.Int("priority", priority),
		zap.Int("pointsCount", len(pointIDs)),
	)

	return task
}

func (se *ScanEngine) RemoveTask(taskID string) {
	se.mu.Lock()
	defer se.mu.Unlock()

	if task, exists := se.tasks[taskID]; exists {
		task.SetStatus(ScanTaskStatusStopped)
		delete(se.tasks, taskID)
		zap.L().Info("[ScanEngine] 移除任务",
			zap.String("taskID", taskID),
			zap.String("deviceKey", task.DeviceKey),
		)
	}
}

func (se *ScanEngine) RemoveTasksByDeviceKey(deviceKey string) {
	se.mu.Lock()
	defer se.mu.Unlock()

	for taskID, task := range se.tasks {
		if task.DeviceKey == deviceKey {
			task.SetStatus(ScanTaskStatusStopped)
			delete(se.tasks, taskID)
			zap.L().Info("[ScanEngine] 移除任务",
				zap.String("taskID", taskID),
				zap.String("deviceKey", deviceKey),
			)
		}
	}
}

func (se *ScanEngine) GetTask(taskID string) *ScanTask {
	se.mu.RLock()
	defer se.mu.RUnlock()
	return se.tasks[taskID]
}

func (se *ScanEngine) GetTaskByDeviceKey(deviceKey string) *ScanTask {
	se.mu.RLock()
	defer se.mu.RUnlock()
	for _, task := range se.tasks {
		if task.DeviceKey == deviceKey {
			return task
		}
	}
	return nil
}

func (se *ScanEngine) GetTasksByDeviceKey(deviceKey string) []*ScanTask {
	se.mu.RLock()
	defer se.mu.RUnlock()
	var tasks []*ScanTask
	for _, task := range se.tasks {
		if task.DeviceKey == deviceKey {
			tasks = append(tasks, task)
		}
	}
	return tasks
}

func (se *ScanEngine) GetTasks() []*ScanTask {
	se.mu.RLock()
	defer se.mu.RUnlock()
	tasks := make([]*ScanTask, 0, len(se.tasks))
	for _, task := range se.tasks {
		tasks = append(tasks, task)
	}
	return tasks
}

func (se *ScanEngine) UpdateTaskInterval(deviceKey string, interval time.Duration) {
	se.mu.Lock()
	defer se.mu.Unlock()

	task := se.findTaskLocked(deviceKey)
	if task != nil {
		task.mu.Lock()
		task.Interval = interval
		task.BaseInterval = interval
		task.NextRun = time.Now().Add(interval)
		task.mu.Unlock()
		zap.L().Info("[ScanEngine] 更新任务间隔",
			zap.String("taskID", task.ID),
			zap.Duration("interval", interval),
		)
	}
}

func (se *ScanEngine) findTaskLocked(key string) *ScanTask {
	if task, exists := se.tasks[key]; exists {
		return task
	}
	for _, task := range se.tasks {
		if task.DeviceKey == key {
			return task
		}
	}
	return nil
}

func (se *ScanEngine) UpdateTaskPriority(deviceKey string, priority int) {
	se.mu.Lock()
	defer se.mu.Unlock()

	task := se.findTaskLocked(deviceKey)
	if task != nil {
		task.mu.Lock()
		task.Priority = priority
		task.mu.Unlock()
		zap.L().Info("[ScanEngine] 更新任务优先级",
			zap.String("taskID", task.ID),
			zap.Int("priority", priority),
		)
	}
}

func (se *ScanEngine) GetActiveTaskCount() int {
	se.mu.RLock()
	defer se.mu.RUnlock()
	count := 0
	for _, task := range se.tasks {
		if task.GetStatus() == ScanTaskStatusRunning {
			count++
		}
	}
	return count
}

func (se *ScanEngine) GetPendingTaskCount() int {
	return len(*se.priorityQueue)
}

func (se *ScanEngine) RegisterProtocol(protocol string, pType ProtocolType) {
	se.executionLayer.RegisterProtocol(protocol, pType)
}

func (se *ScanEngine) RegisterDriver(deviceKey string, d driver.Driver) {
	se.executionLayer.RegisterDriver(deviceKey, d)
}

func (se *ScanEngine) UnregisterDriver(deviceKey string) {
	se.executionLayer.UnregisterDriver(deviceKey)
}

func (se *ScanEngine) SetShadowCore(sc *ShadowCore) {
	se.mu.Lock()
	defer se.mu.Unlock()
	se.shadowCore = sc
}

func (se *ScanEngine) SetShadowIngress(si *ShadowIngress) {
	se.mu.Lock()
	defer se.mu.Unlock()
	se.shadowIngress = si
	if si != nil {
		se.shadowCore = si.shadowCore
	}
}

func (se *ScanEngine) SetCollectFinalize(fn CollectFinalizeFunc) {
	se.mu.Lock()
	defer se.mu.Unlock()
	se.collectFinalize = fn
}

func (se *ScanEngine) GetShadowCore() *ShadowCore {
	return se.shadowCore
}

func (se *ScanEngine) SetPointDegradation(m *PointDegradationManager) {
	se.mu.Lock()
	se.pointDegrade = m
	se.mu.Unlock()
	if se.executionLayer != nil {
		se.executionLayer.SetPointDegradation(m)
	}
}

func (se *ScanEngine) SetIOProfileProvider(fn IOProfileProvider) {
	if se.executionLayer != nil {
		se.executionLayer.SetIOProfileProvider(fn)
	}
}

func (se *ScanEngine) GetMetrics() *ScanEngineMetrics {
	return se.metrics
}