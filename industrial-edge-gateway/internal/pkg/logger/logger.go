package logger

import (
	"os"
	"path/filepath"
	"strings"
	"sync"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// LogBroadcaster handles broadcasting log messages to WebSocket subscribers
type LogBroadcaster struct {
	mu          sync.RWMutex
	subscribers map[chan []byte]struct{}
}

func NewLogBroadcaster() *LogBroadcaster {
	return &LogBroadcaster{
		subscribers: make(map[chan []byte]struct{}),
	}
}

// Write implements io.Writer to broadcast logs
func (b *LogBroadcaster) Write(p []byte) (n int, err error) {
	b.mu.RLock()
	defer b.mu.RUnlock()

	// Create a copy of the data to avoid race conditions
	data := make([]byte, len(p))
	copy(data, p)

	for ch := range b.subscribers {
		select {
		case ch <- data:
		default:
			// Drop message if subscriber is slow
		}
	}
	return len(p), nil
}

func (b *LogBroadcaster) Subscribe() chan []byte {
	b.mu.Lock()
	defer b.mu.Unlock()
	ch := make(chan []byte, 100) // Buffer 100 logs
	b.subscribers[ch] = struct{}{}
	return ch
}

func (b *LogBroadcaster) Unsubscribe(ch chan []byte) {
	b.mu.Lock()
	defer b.mu.Unlock()
	if _, ok := b.subscribers[ch]; ok {
		delete(b.subscribers, ch)
		close(ch)
	}
}

// InitLogger initializes the global logger
func InitLogger(logLevel string, logFile string, broadcaster *LogBroadcaster) (*zap.Logger, error) {
	// Parse log level
	level := zap.InfoLevel
	if logLevel != "" {
		if l, err := zapcore.ParseLevel(strings.ToLower(logLevel)); err == nil {
			level = l
		}
	}

	// 1. Console Encoder (Colorized)
	consoleEncoderConfig := zap.NewDevelopmentEncoderConfig()
	consoleEncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	consoleEncoder := zapcore.NewConsoleEncoder(consoleEncoderConfig)

	// 2. File Encoder (Standard text)
	fileEncoderConfig := zap.NewProductionEncoderConfig()
	fileEncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	fileEncoder := zapcore.NewConsoleEncoder(fileEncoderConfig)

	// 3. JSON Encoder for WebSocket (Easier to parse in frontend)
	jsonEncoderConfig := zap.NewProductionEncoderConfig()
	jsonEncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	jsonEncoder := zapcore.NewJSONEncoder(jsonEncoderConfig)

	cores := []zapcore.Core{}

	// Console Core
	cores = append(cores, zapcore.NewCore(
		consoleEncoder,
		zapcore.Lock(os.Stdout),
		level,
	))

	// File Core
	if logFile != "" {
		// Ensure directory exists
		if err := os.MkdirAll(filepath.Dir(logFile), 0755); err == nil {
			f, err := os.OpenFile(logFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			if err == nil {
				cores = append(cores, zapcore.NewCore(
					fileEncoder,
					zapcore.AddSync(f),
					level,
				))
			} else {
				// Fallback to console if file fails
				// We can't log using zap yet, so just print to stderr
				os.Stderr.WriteString("Failed to open log file: " + err.Error() + "\n")
			}
		}
	}

	// Broadcaster Core (WebSocket)
	if broadcaster != nil {
		// Always allow Debug logs for WebSocket to support real-time monitoring
		// regardless of the file/console log level.
		cores = append(cores, zapcore.NewCore(
			jsonEncoder,
			zapcore.AddSync(broadcaster),
			zap.DebugLevel,
		))
	}

	// Combine all cores
	core := zapcore.NewTee(cores...)

	// Create logger
	logger := zap.New(core, zap.AddCaller())

	// Replace global logger
	zap.ReplaceGlobals(logger)
	zap.RedirectStdLog(logger)

	return logger, nil
}
