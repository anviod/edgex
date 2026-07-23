package core

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
)

// AsyncJobStatus is the lifecycle state of a long-running API job (scan/browse).
type AsyncJobStatus string

const (
	AsyncJobQueued    AsyncJobStatus = "queued"
	AsyncJobRunning   AsyncJobStatus = "running"
	AsyncJobSucceeded AsyncJobStatus = "succeeded"
	AsyncJobFailed    AsyncJobStatus = "failed"
	AsyncJobCancelled AsyncJobStatus = "cancelled"
)

// AsyncJobType classifies work submitted via the async job API.
type AsyncJobType string

const (
	AsyncJobScanChannel AsyncJobType = "scan_channel"
	AsyncJobScanDevice  AsyncJobType = "scan_device"
)

const (
	asyncJobDefaultTTL = 30 * time.Minute
	asyncJobMaxEntries = 256
	asyncJobSweepEvery = time.Minute
)

// AsyncJob is a pollable record for long scan/browse work.
type AsyncJob struct {
	ID        string         `json:"job_id"`
	Type      AsyncJobType   `json:"type"`
	Status    AsyncJobStatus `json:"status"`
	ChannelID string         `json:"channel_id,omitempty"`
	DeviceID  string         `json:"device_id,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	Result    any            `json:"result,omitempty"`
	Error     string         `json:"error,omitempty"`

	cancel context.CancelFunc
}

// AsyncJobManager stores in-memory scan/browse jobs (same shape as AI task poll).
type AsyncJobManager struct {
	mu      sync.RWMutex
	jobs    map[string]*AsyncJob
	stopCh  chan struct{}
	stopped sync.Once
}

// NewAsyncJobManager creates a job store with background TTL eviction.
func NewAsyncJobManager() *AsyncJobManager {
	m := &AsyncJobManager{
		jobs:   make(map[string]*AsyncJob),
		stopCh: make(chan struct{}),
	}
	go m.sweeper()
	return m
}

// Stop halts the eviction goroutine.
func (m *AsyncJobManager) Stop() {
	m.stopped.Do(func() { close(m.stopCh) })
}

func (m *AsyncJobManager) sweeper() {
	ticker := time.NewTicker(asyncJobSweepEvery)
	defer ticker.Stop()
	for {
		select {
		case <-m.stopCh:
			return
		case <-ticker.C:
			m.evictExpired(asyncJobDefaultTTL)
		}
	}
}

func (m *AsyncJobManager) evictExpired(ttl time.Duration) {
	cutoff := time.Now().Add(-ttl)
	m.mu.Lock()
	defer m.mu.Unlock()
	for id, job := range m.jobs {
		if job.Status == AsyncJobRunning || job.Status == AsyncJobQueued {
			continue
		}
		if job.UpdatedAt.Before(cutoff) {
			delete(m.jobs, id)
		}
	}
	// Soft cap: drop oldest finished jobs when over limit.
	for len(m.jobs) > asyncJobMaxEntries {
		var oldestID string
		var oldestTime time.Time
		for id, job := range m.jobs {
			if job.Status == AsyncJobRunning || job.Status == AsyncJobQueued {
				continue
			}
			if oldestID == "" || job.UpdatedAt.Before(oldestTime) {
				oldestID = id
				oldestTime = job.UpdatedAt
			}
		}
		if oldestID == "" {
			break
		}
		delete(m.jobs, oldestID)
	}
}

// Submit creates a job and runs work in the background. Returns a snapshot immediately.
func (m *AsyncJobManager) Submit(jobType AsyncJobType, channelID, deviceID string, work func(ctx context.Context) (any, error)) *AsyncJob {
	now := time.Now()
	ctx, cancel := context.WithCancel(context.Background())
	job := &AsyncJob{
		ID:        "job_" + uuid.New().String(),
		Type:      jobType,
		Status:    AsyncJobQueued,
		ChannelID: channelID,
		DeviceID:  deviceID,
		CreatedAt: now,
		UpdatedAt: now,
		cancel:    cancel,
	}

	m.mu.Lock()
	m.jobs[job.ID] = job
	m.mu.Unlock()

	go m.run(job.ID, ctx, work)
	return m.Snapshot(job.ID)
}

func (m *AsyncJobManager) run(id string, ctx context.Context, work func(ctx context.Context) (any, error)) {
	m.setStatus(id, AsyncJobRunning, "", nil)
	result, err := work(ctx)
	if ctx.Err() != nil {
		m.setStatus(id, AsyncJobCancelled, ctx.Err().Error(), nil)
		return
	}
	if err != nil {
		m.setStatus(id, AsyncJobFailed, err.Error(), nil)
		return
	}
	m.setStatus(id, AsyncJobSucceeded, "", result)
}

func (m *AsyncJobManager) setStatus(id string, status AsyncJobStatus, errMsg string, result any) {
	m.mu.Lock()
	defer m.mu.Unlock()
	job, ok := m.jobs[id]
	if !ok {
		return
	}
	job.Status = status
	job.UpdatedAt = time.Now()
	if errMsg != "" {
		job.Error = errMsg
	}
	if result != nil {
		job.Result = result
	}
}

// Get returns a detached snapshot of a job.
func (m *AsyncJobManager) Get(id string) (*AsyncJob, bool) {
	snap := m.Snapshot(id)
	if snap == nil {
		return nil, false
	}
	return snap, true
}

// Snapshot copies job fields for JSON responses (excludes cancel).
func (m *AsyncJobManager) Snapshot(id string) *AsyncJob {
	m.mu.RLock()
	defer m.mu.RUnlock()
	job, ok := m.jobs[id]
	if !ok {
		return nil
	}
	return &AsyncJob{
		ID:        job.ID,
		Type:      job.Type,
		Status:    job.Status,
		ChannelID: job.ChannelID,
		DeviceID:  job.DeviceID,
		CreatedAt: job.CreatedAt,
		UpdatedAt: job.UpdatedAt,
		Result:    job.Result,
		Error:     job.Error,
	}
}

// Cancel requests cancellation of a running job.
func (m *AsyncJobManager) Cancel(id string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	job, ok := m.jobs[id]
	if !ok {
		return fmt.Errorf("job not found")
	}
	if job.Status != AsyncJobQueued && job.Status != AsyncJobRunning {
		return fmt.Errorf("job is not cancellable (status=%s)", job.Status)
	}
	if job.cancel != nil {
		job.cancel()
	}
	return nil
}
