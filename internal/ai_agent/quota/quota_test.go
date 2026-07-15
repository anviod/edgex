package quota

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTracker_RecordAndSnapshot(t *testing.T) {
	t.Parallel()
	tr := NewTracker("local")

	assert.False(t, tr.WouldExceed(1000))
	tr.RecordTask("task_1", "protocol-reverse", 1000)

	snap := tr.Snapshot()
	assert.Equal(t, 1000, snap.TokensUsed)
	assert.Equal(t, 1, snap.TasksToday)
	assert.Equal(t, "task_1", snap.LastTaskID)
	assert.Equal(t, "local", snap.Mode)
	assert.Len(t, snap.AuditEntries, 1)
}

func TestTracker_WouldExceedTokenLimit(t *testing.T) {
	t.Parallel()
	tr := NewTracker("local")

	tr.RecordTask("t1", "doc-parse", 49000)
	assert.False(t, tr.WouldExceed(500))
	assert.True(t, tr.WouldExceed(1500))
}
