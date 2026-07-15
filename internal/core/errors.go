package core

import "errors"

var (
	ErrActorStopped          = errors.New("actor is stopped")
	ErrMailboxFull           = errors.New("actor mailbox is full")
	ErrInvalidMessage        = errors.New("invalid message type")
	ErrDeviceNotFound        = errors.New("device not found")
	ErrPointNotFound         = errors.New("point not found")
	ErrChannelNotFound       = errors.New("channel not found")
	ErrTimeout               = errors.New("operation timeout")
	ErrInvalidState          = errors.New("invalid state transition")
	ErrConnectionUnavailable = errors.New("connection unavailable")
	ErrCircuitOpen           = errors.New("circuit breaker open")
)
