package model

import "time"

// RuleMinuteSnapshot represents a minute-level error log entry for a rule.
type RuleMinuteSnapshot struct {
	RuleID       string    `json:"rule_id"`
	RuleName     string    `json:"rule_name"`
	Minute       string    `json:"minute"` // e.g. "2026-01-29 10:51"
	Category     string    `json:"category,omitempty"`
	ChannelID    string    `json:"channel_id,omitempty"`
	DeviceID     string    `json:"device_id,omitempty"`
	ErrorType    string    `json:"error_type,omitempty"`
	ErrorMessage string    `json:"error_message,omitempty"`
	UpdatedAt    time.Time `json:"updated_at"`
	// Deprecated: kept for backward-compatible reads of historical bblot rows.
	Status       string    `json:"status,omitempty"`
	TriggerCount int64     `json:"trigger_count,omitempty"`
	LastValue    any       `json:"last_value,omitempty"`
	LastTrigger  time.Time `json:"last_trigger,omitempty"`
}
