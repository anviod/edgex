package core

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/anviod/edgeCore/internal/driver"
	"github.com/anviod/edgeCore/internal/model"
)

// panicDriver panics inside ReadPoints to exercise the recovery boundary.
type panicDriver struct{}

func (panicDriver) Init(_ model.DriverConfig) error { return nil }
func (panicDriver) Connect(_ context.Context) error { return nil }
func (panicDriver) Disconnect() error               { return nil }
func (panicDriver) ReadPoints(_ context.Context, _ []model.Point) (map[string]model.Value, error) {
	panic("simulated malformed-frame panic")
}
func (panicDriver) WritePoint(_ context.Context, _ model.Point, _ any) error { return nil }
func (panicDriver) Health() driver.HealthStatus                              { return driver.HealthStatusGood }
func (panicDriver) SetSlaveID(_ uint8) error                                 { return nil }
func (panicDriver) SetDeviceConfig(_ map[string]any) error                   { return nil }
func (panicDriver) GetConnectionMetrics() (int64, int64, string, string, time.Time) {
	return 0, 0, "", "", time.Time{}
}

// ---------------------------------------------------------------------------
// Queue integrity (double-enqueue / concurrent double-execution)
// ---------------------------------------------------------------------------

// TestAntiStarvation_RepeatedRescueKeepsSingleQueueEntry is the regression
// guard for the double-enqueue bug: enforceAntiStarvation used to heap.Push
// an already-queued task, producing two heap entries for one *ScanTask.
// popReadyTaskEDF would then dispatch the same task twice concurrently,
// racing on SetStatus / Points / rescheduleTask.
func TestAntiStarvation_RepeatedRescueKeepsSingleQueueEntry(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{AntiStarvationSec: 1, JitterBound: 10 * time.Millisecond})
	now := time.Now()

	task := se.AddTask("dev1", "modbus-tcp", time.Second, 3, []string{"p1"}, nil)

	for i := 0; i < 5; i++ {
		// Force overdue before each rescue; AddTask already queued the task.
		task.mu.Lock()
		task.NextRun = now.Add(-2 * time.Second)
		task.mu.Unlock()

		se.enforceAntiStarvation(now)
	}

	se.mu.RLock()
	queueLen := se.priorityQueue.Len()
	se.mu.RUnlock()

	if queueLen != 1 {
		t.Fatalf("priority queue length = %d after 5 rescues, want 1 (duplicate entries cause concurrent double execution)", queueLen)
	}
	if res := se.GetMetrics().Snapshot()["starvation_rescue_total"].(uint64); res != 5 {
		t.Fatalf("starvation_rescue_total = %d, want 5 (rescue must still trigger each round)", res)
	}
}

// TestAntiStarvation_RescuesInFlightTaskExactlyOnce verifies a task that was
// popped (running/idle, not in queue) is pushed back exactly once.
func TestAntiStarvation_RescuesInFlightTaskExactlyOnce(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{AntiStarvationSec: 1, JitterBound: 10 * time.Millisecond})
	now := time.Now()

	task := se.AddTask("dev1", "modbus-tcp", time.Second, 3, []string{"p1"}, nil)
	task.mu.Lock()
	task.NextRun = now.Add(-2 * time.Second)
	task.mu.Unlock()

	// Simulate an in-flight collect: pop it out of the queue.
	task.mu.Lock()
	task.NextRun = now.Add(-2 * time.Second)
	task.mu.Unlock()
	popped := se.popReadyTaskEDF(now)
	if popped != task {
		t.Fatalf("expected to pop the task, got %v", popped)
	}
	if task.isQueued() {
		t.Fatalf("task must not report queued after pop")
	}

	se.enforceAntiStarvation(now)

	se.mu.RLock()
	queueLen := se.priorityQueue.Len()
	se.mu.RUnlock()
	if queueLen != 1 {
		t.Fatalf("queue length = %d, want 1", queueLen)
	}
	if !task.isQueued() {
		t.Fatalf("task must report queued after rescue")
	}
}

// TestRemoveTask_ClearsQueueEntry ensures a removed task leaves no stale
// heap pointer behind (it used to linger until popped and skipped).
func TestRemoveTask_ClearsQueueEntry(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{})
	task := se.AddTask("dev1", "modbus-tcp", time.Second, 3, []string{"p1"}, nil)

	se.RemoveTask(task.ID)

	se.mu.RLock()
	queueLen := se.priorityQueue.Len()
	_, stillRegistered := se.tasks[task.ID]
	se.mu.RUnlock()

	if queueLen != 0 {
		t.Fatalf("queue length = %d after RemoveTask, want 0", queueLen)
	}
	if stillRegistered {
		t.Fatalf("task still registered after RemoveTask")
	}
	if task.isQueued() {
		t.Fatalf("task still reports queued after RemoveTask")
	}
}

// TestRebuildQueueAfterPanic_RestoresConsistency validates the rollback used
// when the dispatch loop panics: the queue is rebuilt from the authoritative
// task map, dropping duplicates and stale entries.
func TestRebuildQueueAfterPanic_RestoresConsistency(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{})
	a := se.AddTask("dev-a", "modbus-tcp", time.Second, 3, []string{"p1"}, nil)
	b := se.AddTask("dev-b", "modbus-tcp", time.Second, 3, []string{"p2"}, nil)

	// Corrupt the queue deliberately: duplicate a, drop b's flag.
	se.mu.Lock()
	heapPushRaw(se.priorityQueue, a)
	a.setQueued(false)
	b.setQueued(false)
	se.mu.Unlock()

	se.rebuildQueueAfterPanic()

	se.mu.RLock()
	queueLen := se.priorityQueue.Len()
	se.mu.RUnlock()

	if queueLen != 2 {
		t.Fatalf("rebuilt queue length = %d, want 2 (one entry per registered task)", queueLen)
	}
	if !a.isQueued() || !b.isQueued() {
		t.Fatalf("rebuilt queue must mark every live task as queued")
	}
}

// ---------------------------------------------------------------------------
// task.Params copy-on-write (concurrent map read/write fatal error)
// ---------------------------------------------------------------------------

// TestUpdateTaskDriverConfig_ConcurrentWithReaders must be run under -race.
// It reproduces the "concurrent map read and map write" hazard: the old
// implementation mutated task.Params in place while hot-path readers
// (taskShadowChannelID, taskDegradeOnFailure, execution layer) read it.
func TestUpdateTaskDriverConfig_ConcurrentWithReaders(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{})
	task := se.AddTask("dev-cfg", "bacnet-ip", time.Second, 3, []string{"p1"},
		map[string]any{
			"channelID":        "ch-1",
			"degradeOnFailure": true,
			"driverConfig":     map[string]any{"ip": "192.168.1.10"},
		})

	const iterations = 500
	var wg sync.WaitGroup

	// Writers: config updates.
	wg.Add(1)
	go func() {
		defer wg.Done()
		for i := 0; i < iterations; i++ {
			se.UpdateTaskDriverConfig("dev-cfg", map[string]any{
				"ip":   "192.168.1.11",
				"port": 47808,
			})
		}
	}()

	// Readers: hot-path accessors.
	for r := 0; r < 3; r++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := 0; i < iterations; i++ {
				_ = taskShadowChannelID(task)
				_ = se.taskDegradeOnFailure(task)
				if params := task.paramsSnapshot(); params != nil {
					if dc, ok := params["driverConfig"].(map[string]any); ok {
						_ = dc["ip"]
					}
				}
			}
		}()
	}

	wg.Wait()

	// Final published config must reflect the last write.
	dc, _ := task.paramsSnapshot()["driverConfig"].(map[string]any)
	if dc == nil || dc["port"] != 47808 {
		t.Fatalf("driverConfig not updated correctly: %#v", dc)
	}
}

// ---------------------------------------------------------------------------
// Panic recovery
// ---------------------------------------------------------------------------

// TestExecutionLayer_RecoversDriverPanic verifies a driver panic during a
// collect is converted into a read error instead of crashing the process.
func TestExecutionLayer_RecoversDriverPanic(t *testing.T) {
	el := NewExecutionLayer()
	el.RegisterProtocol("modbus-tcp", ProtocolTypeSerial)
	el.RegisterDriver("dev-panic", panicDriver{})

	task := &ScanTask{
		ID:        "task-panic",
		DeviceKey: "dev-panic",
		Protocol:  "modbus-tcp",
		Interval:  time.Second,
		PointIDs:  []string{"p1"},
		Status:    ScanTaskStatusIdle,
	}

	result := el.Execute(task)
	if result == nil {
		t.Fatalf("Execute returned nil")
	}
	if result.Success {
		t.Fatalf("panicking driver must yield a failed result, got success")
	}
	if result.Error == nil {
		t.Fatalf("panicking driver must yield an error")
	}
}

// TestExecuteTaskAsync_RecoversPanicAndRearmsTask verifies the scheduler-level
// recovery: a panic raised inside the scheduler's own post-collect stage
// (shadow apply / finalize / metrics) re-arms the task rather than silently
// dropping it. Driver-level panics are already absorbed one layer down in
// ExecutionLayer.readPoints, so we inject the panic via the finalize hook,
// which runs in executeTaskAsync's goroutine.
func TestExecuteTaskAsync_RecoversPanicAndRearmsTask(t *testing.T) {
	se := NewScanEngine(ScanEngineConfig{TickInterval: 10 * time.Millisecond, WorkerCount: 1})
	el := NewExecutionLayer()
	el.RegisterProtocol("modbus-tcp", ProtocolTypeSerial)
	el.RegisterDriver("dev-ok", &execStubDriver{})
	se.executionLayer = el

	// Panic after the driver call, inside the scheduler goroutine.
	se.SetCollectFinalize(func(string, *ExecuteResult) {
		panic("simulated shadow-apply panic")
	})

	task := se.AddTask("dev-ok", "modbus-tcp", time.Second, 3, []string{"p1"}, nil)

	se.mu.Lock()
	se.running = true
	se.mu.Unlock()

	// Simulate the dispatch step: pop then run.
	task.mu.Lock()
	task.NextRun = time.Now().Add(-time.Second)
	task.mu.Unlock()
	if popped := se.popReadyTaskEDF(time.Now()); popped != task {
		t.Fatalf("expected to pop the task")
	}

	before := se.GetMetrics().Snapshot()["task_panics_total"].(uint64)

	se.resourceCtrl.Acquire() // balance executeTaskAsync's deferred Release
	se.executeTaskAsync(task) // must not propagate the panic

	after := se.GetMetrics().Snapshot()["task_panics_total"].(uint64)
	if after != before+1 {
		t.Fatalf("task_panics_total = %d, want %d", after, before+1)
	}

	if task.GetStatus() == ScanTaskStatusStopped {
		t.Fatalf("task must not be left Stopped after a recoverable panic")
	}
	if !task.isQueued() {
		t.Fatalf("task must be re-armed (queued) after a recoverable panic")
	}
}

// heapPushRaw pushes without the queued bookkeeping; test-only helper to
// deliberately corrupt queue state.
func heapPushRaw(pq *PriorityQueue, task *ScanTask) {
	*pq = append(*pq, task)
}
