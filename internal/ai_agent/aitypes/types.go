package aitypes

import "time"

type TaskStatus string

const (
	StatusPending        TaskStatus = "pending"
	StatusQueued         TaskStatus = "queued"
	StatusProcessing     TaskStatus = "processing"
	StatusWaitingModel   TaskStatus = "waiting_model"
	StatusValidating     TaskStatus = "validating"
	StatusWaitingConfirm TaskStatus = "waiting_confirm"
	StatusApplied        TaskStatus = "applied"
	StatusFailed         TaskStatus = "failed"
	StatusCancelled      TaskStatus = "cancelled"
)

type PipelineStage string

const (
	StageCapture  PipelineStage = "capture"
	StageDecode   PipelineStage = "decode"
	StageSemantic PipelineStage = "semantic"
	StageOutput   PipelineStage = "output"
)

type Skill string

const (
	SkillProtocolReverse Skill = "protocol-reverse"
	SkillDocParse        Skill = "doc-parse"
	SkillConfigGen       Skill = "config-gen"
	SkillEdgeRuleDraft   Skill = "edge-rule-draft"
	SkillDiagnostics     Skill = "diagnostics"
)

type ProtocolModel struct {
	ProtocolID    string         `json:"protocol_id"`
	Confidence    float64        `json:"confidence"`
	FramePattern  map[string]any `json:"frame_pattern,omitempty"`
	AddressModel  string         `json:"address_model,omitempty"`
	DatatypeRules []string       `json:"datatype_rules,omitempty"`
}

type PointCandidate struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Address      string  `json:"address"`
	RegisterType string  `json:"register_type,omitempty"`
	FunctionCode int     `json:"function_code,omitempty"`
	Datatype     string  `json:"datatype"`
	ByteOrder    string  `json:"byte_order,omitempty"`
	Scale        float64 `json:"scale"`
	Offset       float64 `json:"offset,omitempty"`
	Unit         string  `json:"unit,omitempty"`
	ReadWrite    string  `json:"readwrite,omitempty"`
	ScanClass    string  `json:"scan_class,omitempty"`
	SlaveID      int     `json:"slave_id,omitempty"`
	Confidence   float64 `json:"confidence"`
	Evidence     string  `json:"evidence,omitempty"`
}

type PointDefinition struct {
	Skill      string           `json:"skill"`
	ProtocolID string           `json:"protocol_id"`
	Points     []PointCandidate `json:"points"`
	Warnings   []string         `json:"warnings,omitempty"`
}

type DriverParameter struct {
	ProtocolID   string         `json:"protocol_id"`
	Name         string         `json:"name"`
	Connection   map[string]any `json:"connection"`
	ScanDefaults map[string]any `json:"scan_defaults,omitempty"`
}

type FrameEvidence struct {
	FC        int     `json:"fc,omitempty"`
	StartAddr int     `json:"start_addr,omitempty"`
	RawHex    string  `json:"raw_hex,omitempty"`
	Decoded   float64 `json:"decoded,omitempty"`
}

type ValidationCaseEntry struct {
	PointID         string        `json:"point_id"`
	ExpectedValue   float64       `json:"expected_value"`
	TolerancePct    float64       `json:"tolerance_pct"`
	ObservationTime string        `json:"observation_time,omitempty"`
	FrameEvidence   FrameEvidence `json:"frame_evidence,omitempty"`
	Confidence      float64       `json:"confidence"`
}

type ValidationCase struct {
	Cases []ValidationCaseEntry `json:"validation_cases"`
}

type Deliverables struct {
	ProtocolModel   *ProtocolModel   `json:"protocol_model,omitempty"`
	PointDefinition *PointDefinition `json:"point_definition,omitempty"`
	DriverParameter *DriverParameter `json:"driver_parameter,omitempty"`
	ValidationCase  *ValidationCase  `json:"validation_case,omitempty"`
}

type StageProgress struct {
	Stage      PipelineStage `json:"stage"`
	Label      string        `json:"label"`
	Status     string        `json:"status"`
	StartedAt  *time.Time    `json:"started_at,omitempty"`
	FinishedAt *time.Time    `json:"finished_at,omitempty"`
	Message    string        `json:"message,omitempty"`
}

type ValidationFieldResult struct {
	Field      string  `json:"field"`
	Path       string  `json:"path,omitempty"`
	Passed     bool    `json:"passed"`
	Severity   string  `json:"severity"`
	Message    string  `json:"message"`
	Confidence float64 `json:"confidence,omitempty"`
}

type ValidationReport struct {
	Passed       bool                    `json:"passed"`
	PassRate     float64                 `json:"pass_rate"`
	TotalChecks  int                     `json:"total_checks"`
	FailedChecks int                     `json:"failed_checks"`
	Fields       []ValidationFieldResult `json:"fields"`
}

type TaskRecord struct {
	ID            string            `json:"id"`
	Skill         Skill             `json:"skill"`
	Scenario      string            `json:"scenario,omitempty"`
	Status        TaskStatus        `json:"status"`
	Mode          string            `json:"mode"`
	ProtocolID    string            `json:"protocol_id,omitempty"`
	InputFiles    []string          `json:"input_files,omitempty"`
	Meta          map[string]string `json:"meta,omitempty"`
	Stages        []StageProgress   `json:"stages"`
	Deliverables  *Deliverables     `json:"deliverables,omitempty"`
	Validation    *ValidationReport `json:"validation,omitempty"`
	ErrorMessage  string            `json:"error_message,omitempty"`
	TokensUsed    int               `json:"tokens_used"`
	CreatedAt     time.Time         `json:"created_at"`
	UpdatedAt     time.Time         `json:"updated_at"`
	ConfirmedAt   *time.Time        `json:"confirmed_at,omitempty"`
	AppliedResult map[string]any    `json:"applied_result,omitempty"`
}

type Observation struct {
	Label string  `json:"label"`
	Value float64 `json:"value"`
	Unit  string  `json:"unit,omitempty"`
}

type CreateRequest struct {
	Skill        Skill             `json:"skill"`
	ProtocolID   string            `json:"protocol_id,omitempty"`
	Filename     string            `json:"filename,omitempty"`
	Scenario     string            `json:"scenario,omitempty"`
	Meta         map[string]string `json:"meta,omitempty"`
	Observations []Observation     `json:"observations,omitempty"`
	Description  string            `json:"description,omitempty"`
}

type ConfirmRequest struct {
	ChannelID string `json:"channel_id,omitempty"`
	DeviceID  string `json:"device_id,omitempty"`
	ApplyMode string `json:"apply_mode,omitempty"`
}
