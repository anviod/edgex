package core

import (
	"sync"
	"time"

	"go.uber.org/zap"
)

type WorkerPool struct {
	workers     []*Worker
	taskQueue   chan func()
	wg          sync.WaitGroup
	stopCh      chan struct{}
	maxQueueSize int
	mu          sync.Mutex
	activeCount int
}

type Worker struct {
	id        int
	taskQueue chan func()
	stopCh    chan struct{}
	wg        *sync.WaitGroup
}

func NewWorkerPool(workerCount int) *WorkerPool {
	if workerCount <= 0 {
		workerCount = 4
	}

	wp := &WorkerPool{
		taskQueue:   make(chan func(), 1000),
		stopCh:      make(chan struct{}),
		maxQueueSize: 1000,
		workers:     make([]*Worker, 0, workerCount),
	}

	for i := 0; i < workerCount; i++ {
		worker := NewWorker(i, wp.taskQueue, wp.stopCh, &wp.wg)
		wp.workers = append(wp.workers, worker)
	}

	return wp
}

func NewWorker(id int, taskQueue chan func(), stopCh chan struct{}, wg *sync.WaitGroup) *Worker {
	w := &Worker{
		id:        id,
		taskQueue: taskQueue,
		stopCh:    stopCh,
		wg:        wg,
	}

	w.wg.Add(1)
	go w.run()

	return w
}

func (w *Worker) run() {
	defer w.wg.Done()

	for {
		select {
		case task := <-w.taskQueue:
			if task != nil {
				task()
			}
		case <-w.stopCh:
			return
		}
	}
}

func (wp *WorkerPool) Start() {
	zap.L().Info("[WorkerPool] Worker池已启动",
		zap.Int("workerCount", len(wp.workers)),
		zap.Int("maxQueueSize", wp.maxQueueSize),
	)
}

func (wp *WorkerPool) Stop() {
	close(wp.stopCh)

	wp.wg.Wait()

	close(wp.taskQueue)

	zap.L().Info("[WorkerPool] Worker池已停止")
}

func (wp *WorkerPool) Submit(task func()) bool {
	select {
	case wp.taskQueue <- task:
		wp.mu.Lock()
		wp.activeCount++
		wp.mu.Unlock()
		return true
	default:
		zap.L().Warn("[WorkerPool] 任务队列已满")
		return false
	}
}

func (wp *WorkerPool) PendingCount() int {
	return len(wp.taskQueue)
}

func (wp *WorkerPool) ActiveCount() int {
	wp.mu.Lock()
	defer wp.mu.Unlock()
	return wp.activeCount
}

func (wp *WorkerPool) SetWorkerCount(count int) {
	wp.mu.Lock()
	defer wp.mu.Unlock()

	currentCount := len(wp.workers)

	if count == currentCount {
		return
	}

	if count > currentCount {
		for i := currentCount; i < count; i++ {
			worker := NewWorker(i, wp.taskQueue, wp.stopCh, &wp.wg)
			wp.workers = append(wp.workers, worker)
		}
	} else {
		for i := currentCount - 1; i >= count; i-- {
			close(wp.workers[i].stopCh)
			wp.workers = wp.workers[:i]
		}
	}

	zap.L().Info("[WorkerPool] Worker数量已更新",
		zap.Int("workerCount", len(wp.workers)),
	)
}

func (wp *WorkerPool) WaitForIdle(timeout time.Duration) bool {
	start := time.Now()

	for {
		if wp.PendingCount() == 0 && wp.activeCount == 0 {
			return true
		}

		if time.Since(start) >= timeout {
			return false
		}

		time.Sleep(10 * time.Millisecond)
	}
}