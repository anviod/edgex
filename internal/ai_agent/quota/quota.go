package quota

import (
	"sync"
	"time"
)

// UsageSnapshot is returned by GET /api/ai/quota.
type UsageSnapshot struct {
	PeriodStart  time.Time    `json:"period_start"`
	PeriodEnd    time.Time    `json:"period_end"`
	TokensUsed   int          `json:"tokens_used"`
	TokensLimit  int          `json:"tokens_limit"`
	TasksToday   int          `json:"tasks_today"`
	TasksLimit   int          `json:"tasks_limit"`
	LastTaskID   string       `json:"last_task_id,omitempty"`
	Mode         string       `json:"mode"`
	AuditEntries []AuditEntry `json:"audit_entries,omitempty"`
}

// AuditEntry records token consumption for G6 auditing.
type AuditEntry struct {
	TaskID    string    `json:"task_id"`
	Skill     string    `json:"skill"`
	Tokens    int       `json:"tokens"`
	Timestamp time.Time `json:"timestamp"`
	Mode      string    `json:"mode"`
}

// Tracker maintains local token counters (scaffold for AI Model Center sync).
type Tracker struct {
	mu          sync.Mutex
	tokensUsed  int
	tokensLimit int
	tasksToday  int
	tasksLimit  int
	lastTaskID  string
	periodStart time.Time
	audit       []AuditEntry
	mode        string
}

func NewTracker(mode string) *Tracker {
	now := time.Now()
	return &Tracker{
		tokensLimit: 50000,
		tasksLimit:  100,
		periodStart: time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location()),
		mode:        mode,
	}
}

func (t *Tracker) RecordTask(taskID, skill string, tokens int) {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.resetDayIfNeeded()
	t.tokensUsed += tokens
	t.tasksToday++
	t.lastTaskID = taskID
	t.audit = append([]AuditEntry{{
		TaskID:    taskID,
		Skill:     skill,
		Tokens:    tokens,
		Timestamp: time.Now(),
		Mode:      t.mode,
	}}, t.audit...)
	if len(t.audit) > 50 {
		t.audit = t.audit[:50]
	}
}

func (t *Tracker) SetMode(mode string) {
	t.mu.Lock()
	defer t.mu.Unlock()
	if mode != "" {
		t.mode = mode
	}
}

func (t *Tracker) SetLimits(tokensLimit, tasksLimit int) {
	t.mu.Lock()
	defer t.mu.Unlock()
	if tokensLimit > 0 {
		t.tokensLimit = tokensLimit
	}
	if tasksLimit > 0 {
		t.tasksLimit = tasksLimit
	}
}

func (t *Tracker) TokensLimit() int {
	t.mu.Lock()
	defer t.mu.Unlock()
	return t.tokensLimit
}

func (t *Tracker) TasksLimit() int {
	t.mu.Lock()
	defer t.mu.Unlock()
	return t.tasksLimit
}

func (t *Tracker) Snapshot() UsageSnapshot {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.resetDayIfNeeded()
	end := t.periodStart.Add(24 * time.Hour)
	return UsageSnapshot{
		PeriodStart:  t.periodStart,
		PeriodEnd:    end,
		TokensUsed:   t.tokensUsed,
		TokensLimit:  t.tokensLimit,
		TasksToday:   t.tasksToday,
		TasksLimit:   t.tasksLimit,
		LastTaskID:   t.lastTaskID,
		Mode:         t.mode,
		AuditEntries: append([]AuditEntry(nil), t.audit...),
	}
}

func (t *Tracker) WouldExceed(tokens int) bool {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.resetDayIfNeeded()
	return t.tokensUsed+tokens > t.tokensLimit || t.tasksToday >= t.tasksLimit
}

func (t *Tracker) resetDayIfNeeded() {
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	if start.After(t.periodStart) {
		t.periodStart = start
		t.tokensUsed = 0
		t.tasksToday = 0
	}
}
