package model

import "time"

// RuleMinuteSnapshot represents a minute-level summary of rule execution
type RuleMinuteSnapshot struct {
	RuleID       string      `json:"rule_id"`
	RuleName     string      `json:"rule_name"`
	Minute       string      `json:"minute"` // e.g. "2026-01-29 10:51"
	Status       string      `json:"status"`
	TriggerCount int64       `json:"trigger_count"`
	LastValue    any         `json:"last_value"`
	LastTrigger  time.Time   `json:"last_trigger"`
	ErrorMessage string      `json:"error_message,omitempty"`
	UpdatedAt    time.Time   `json:"updated_at"`
}
