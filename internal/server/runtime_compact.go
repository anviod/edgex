package server

import (
	"os"
	"time"

	"go.uber.org/zap"
)

const (
	runtimeCompactInterval   = 24 * time.Hour
	runtimeCompactMinDBBytes = 8 * 1024 * 1024 // 小于 8MB 跳过，避免小库频繁 compact
)

// startRuntimeCompactLoop 启动 runtime.db 定时压缩（幂等）。
func (s *Server) startRuntimeCompactLoop() {
	s.runtimeCompactOnce.Do(func() {
		s.runtimeCompactStop = make(chan struct{})
		go s.runtimeCompactLoop()
	})
}

// StopBackgroundTasks 停止后台维护任务（定时 compact 等）。
func (s *Server) StopBackgroundTasks() {
	s.runtimeCompactStopOnce.Do(func() {
		if s.runtimeCompactStop != nil {
			close(s.runtimeCompactStop)
		}
	})
}

func (s *Server) runtimeCompactLoop() {
	ticker := time.NewTicker(runtimeCompactInterval)
	defer ticker.Stop()
	for {
		select {
		case <-s.runtimeCompactStop:
			return
		case <-ticker.C:
			s.maybeCompactRuntimeDB()
		}
	}
}

func (s *Server) maybeCompactRuntimeDB() {
	if s.storage == nil {
		return
	}

	runtimePath := s.storage.GetRuntimePath()
	info, err := os.Stat(runtimePath)
	if err != nil {
		s.logger.Warn("runtime compact skipped: stat failed", zap.String("path", runtimePath), zap.Error(err))
		return
	}
	if info.Size() < runtimeCompactMinDBBytes {
		return
	}

	compactInfo, err := s.compactRuntimeWithStats()
	if err != nil {
		s.logger.Warn("scheduled runtime db compact failed", zap.Error(err))
		return
	}
	s.logger.Info("scheduled runtime db compact completed", zap.Any("stats", compactInfo))
}
