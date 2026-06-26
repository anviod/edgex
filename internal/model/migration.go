package model

import (
	"time"
)

// BackupInfo 描述数据库备份文件的元信息。
type BackupInfo struct {
	BackupPath    string    `json:"backupPath"`
	BackupTime    time.Time `json:"backupTime"`
	OriginalPath  string    `json:"originalPath"`
	FileSizeBytes int64     `json:"fileSizeBytes"`
	Version       string    `json:"version"`
	Checksum      string    `json:"checksum,omitempty"`
}
