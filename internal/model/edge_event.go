package model

import "time"

// EdgeRuleEventPhase captures one stage in a rule execution lifecycle.
type EdgeRuleEventPhase struct {
	Phase      string         `json:"phase"`
	StartedAt  time.Time      `json:"started_at"`
	EndedAt    time.Time      `json:"ended_at,omitempty"`
	DurationMs int64          `json:"duration_ms,omitempty"`
	Error      string         `json:"error,omitempty"`
	Detail     map[string]any `json:"detail,omitempty"`
}

// EdgeRuleEventAction captures a single action outcome within an event.
type EdgeRuleEventAction struct {
	Index      int       `json:"index"`
	Type       string    `json:"type"`
	Status     string    `json:"status"` // success, failed, skipped
	Error      string    `json:"error,omitempty"`
	StartedAt  time.Time `json:"started_at"`
	EndedAt    time.Time `json:"ended_at,omitempty"`
	DurationMs int64     `json:"duration_ms,omitempty"`
}

// EdgeRuleEvent is a complete rule execution record from trigger to completion.
type EdgeRuleEvent struct {
	ID            string                `json:"id"`
	RuleID        string                `json:"rule_id"`
	RuleName      string                `json:"rule_name"`
	StartedAt     time.Time             `json:"started_at"`
	EndedAt       time.Time             `json:"ended_at,omitempty"`
	DurationMs    int64                 `json:"duration_ms,omitempty"`
	Status        string                `json:"status"` // running, completed, error, dropped
	Triggered     bool                  `json:"triggered"`
	TriggerSource Value                 `json:"trigger_source,omitempty"`
	TriggerValue  any                   `json:"trigger_value,omitempty"`
	Condition     string                `json:"condition,omitempty"`
	OutputValue   any                   `json:"output_value,omitempty"`
	Phases        []EdgeRuleEventPhase  `json:"phases,omitempty"`
	Actions       []EdgeRuleEventAction `json:"actions,omitempty"`
	ErrorMessage  string                `json:"error_message,omitempty"`
}

// Edge error log categories exposed to API and UI.
const (
	EdgeErrorTypeFormula   = "formula_error"
	EdgeErrorTypeExecution = "execution_error"
	EdgeErrorTypeTimeout   = "timeout"
	EdgeErrorTypeDispatch  = "dispatch_error"
	EdgeErrorTypeOther     = "other"
)

// EdgeFailureRecord is a structured failure log entry accessible via API.
type EdgeFailureRecord struct {
	ID           string         `json:"id"`
	RuleID       string         `json:"rule_id"`
	RuleName     string         `json:"rule_name,omitempty"`
	Category     string         `json:"category,omitempty"`
	ChannelID    string         `json:"channel_id,omitempty"`
	DeviceID     string         `json:"device_id,omitempty"`
	ErrorType    string         `json:"error_type,omitempty"`
	Phase        string         `json:"phase"`
	Error        string         `json:"error"`
	Timestamp    time.Time      `json:"timestamp"`
	TriggerValue any            `json:"trigger_value,omitempty"`
	Condition    string         `json:"condition,omitempty"`
	ActionType   string         `json:"action_type,omitempty"`
	ActionIndex  int            `json:"action_index,omitempty"`
	Context      map[string]any `json:"context,omitempty"`
}
