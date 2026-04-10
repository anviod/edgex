package config

import (
	"edge-gateway/internal/model"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"gopkg.in/yaml.v3"
)

var saveMu sync.Mutex

// ConfigManager 管理配置的加载和热重载
type ConfigManager struct {
	Config     *Config
	ConfDir    string
	WatchFiles map[string]time.Time
	ReloadChan chan struct{}
}

type Config struct {
	Server struct {
		Port     int    `yaml:"port"`
		LogLevel string `yaml:"logLevel"`
	} `yaml:"server"`
	Storage struct {
		Path string `yaml:"path"`
	} `yaml:"storage"`
	Northbound model.NorthboundConfig `yaml:"northbound"`
	Channels   []model.Channel        `yaml:"channels"`
	EdgeRules  []model.EdgeRule       `yaml:"edge_rules"`
	System     model.SystemConfig     `yaml:"system"`
	Users      []model.UserConfig     `yaml:"users"`
}

func LoadConfig(confDir string) (*Config, error) {
	cfg := &Config{}

	loadFile := func(name string, target interface{}) error {
		path := filepath.Join(confDir, name)
		data, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("failed to read %s: %w", name, err)
		}
		if err := yaml.Unmarshal(data, target); err != nil {
			return fmt.Errorf("failed to parse %s: %w", name, err)
		}
		return nil
	}

	if err := loadFile("server.yaml", &cfg.Server); err != nil {
		return nil, err
	}
	if err := loadFile("storage.yaml", &cfg.Storage); err != nil {
		return nil, err
	}
	if err := loadFile("northbound.yaml", &cfg.Northbound); err != nil {
		return nil, err
	}
	if err := loadFile("channels.yaml", &cfg.Channels); err != nil {
		return nil, err
	}
	if err := loadFile("edge_rules.yaml", &cfg.EdgeRules); err != nil {
		return nil, err
	}
	if err := loadFile("system.yaml", &cfg.System); err != nil {
		return nil, err
	}
	if err := loadFile("users.yaml", &cfg.Users); err != nil {
		return nil, err
	}

	// 加载设备文件
	for i := range cfg.Channels {
		for j := range cfg.Channels[i].Devices {
			device := &cfg.Channels[i].Devices[j]
			if device.DeviceFile != "" {
				// 检查设备文件路径是否存在
				devicePath := device.DeviceFile
				// 如果路径不存在，尝试相对于 conf 目录的路径
				if _, err := os.Stat(devicePath); os.IsNotExist(err) {
					devicePath = filepath.Join(confDir, device.DeviceFile)
				}
				data, err := os.ReadFile(devicePath)
				if err != nil {
					return nil, fmt.Errorf("failed to read device file %s: %w", devicePath, err)
				}
				if err := yaml.Unmarshal(data, device); err != nil {
					return nil, fmt.Errorf("failed to parse device file %s: %w", devicePath, err)
				}
				// 保留设备文件路径
				device.DeviceFile = devicePath
			}
		}
	}

	// 初始化通道的运行时字段
	for i := range cfg.Channels {
		cfg.Channels[i].StopChan = make(chan struct{})
		cfg.Channels[i].NodeRuntime = &model.NodeRuntime{State: 0}

		// 初始化设备的运行时字段
		for j := range cfg.Channels[i].Devices {
			cfg.Channels[i].Devices[j].StopChan = make(chan struct{})
			cfg.Channels[i].Devices[j].NodeRuntime = &model.NodeRuntime{State: 0}
		}
	}

	return cfg, nil
}

// NewConfigManager 创建一个新的配置管理器
func NewConfigManager(confDir string) (*ConfigManager, error) {
	cfg, err := LoadConfig(confDir)
	if err != nil {
		return nil, err
	}

	manager := &ConfigManager{
		Config:     cfg,
		ConfDir:    confDir,
		WatchFiles: make(map[string]time.Time),
		ReloadChan: make(chan struct{}),
	}

	// 初始化监控文件的修改时间
	manager.updateWatchFiles()

	return manager, nil
}

// updateWatchFiles 更新监控文件的修改时间
func (cm *ConfigManager) updateWatchFiles() {
	files := []string{
		"server.yaml",
		"storage.yaml",
		"northbound.yaml",
		"channels.yaml",
		"edge_rules.yaml",
		"system.yaml",
		"users.yaml",
	}

	for _, file := range files {
		path := filepath.Join(cm.ConfDir, file)
		if info, err := os.Stat(path); err == nil {
			cm.WatchFiles[path] = info.ModTime()
		}
	}

	// 监控设备文件
	for _, channel := range cm.Config.Channels {
		for _, device := range channel.Devices {
			if device.DeviceFile != "" {
				if info, err := os.Stat(device.DeviceFile); err == nil {
					cm.WatchFiles[device.DeviceFile] = info.ModTime()
				}
			}
		}
	}
}

// StartWatch 开始监控配置文件变化
func (cm *ConfigManager) StartWatch(interval time.Duration) {
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()

		for range ticker.C {
			if cm.checkForChanges() {
				newCfg, err := LoadConfig(cm.ConfDir)
				if err == nil {
					cm.Config = newCfg
					cm.updateWatchFiles()
					// 通知应用程序配置已重载
					select {
					case cm.ReloadChan <- struct{}{}:
					default:
					}
				}
			}
		}
	}()
}

// checkForChanges 检查配置文件是否有变化
func (cm *ConfigManager) checkForChanges() bool {
	// 检查主配置文件
	files := []string{
		"server.yaml",
		"storage.yaml",
		"northbound.yaml",
		"channels.yaml",
		"edge_rules.yaml",
		"system.yaml",
		"users.yaml",
	}

	for _, file := range files {
		path := filepath.Join(cm.ConfDir, file)
		if info, err := os.Stat(path); err == nil {
			if modTime, exists := cm.WatchFiles[path]; !exists || info.ModTime().After(modTime) {
				return true
			}
		}
	}

	// 检查设备文件
	for _, channel := range cm.Config.Channels {
		for _, device := range channel.Devices {
			if device.DeviceFile != "" {
				if info, err := os.Stat(device.DeviceFile); err == nil {
					if modTime, exists := cm.WatchFiles[device.DeviceFile]; !exists || info.ModTime().After(modTime) {
						return true
					}
				}
			}
		}
	}

	return false
}

// GetConfig 获取当前配置
func (cm *ConfigManager) GetConfig() *Config {
	return cm.Config
}

// Reload 手动重载配置
func (cm *ConfigManager) Reload() error {
	newCfg, err := LoadConfig(cm.ConfDir)
	if err != nil {
		return err
	}

	cm.Config = newCfg
	cm.updateWatchFiles()

	// 通知应用程序配置已重载
	select {
	case cm.ReloadChan <- struct{}{}:
	default:
	}

	return nil
}

// StopWatch 停止监控配置文件变化
func (cm *ConfigManager) StopWatch() {
	// 目前实现为空，因为我们使用的是无限循环的 goroutine
	// 实际项目中可以使用 context 来控制
}

func SaveConfig(confDir string, cfg *Config) error {
	saveMu.Lock()
	defer saveMu.Unlock()

	saveFile := func(name string, data interface{}) error {
		path := filepath.Join(confDir, name)
		bytes, err := yaml.Marshal(data)
		if err != nil {
			return err
		}

		// Atomic write
		tmpFile, err := os.CreateTemp(confDir, name+"-*.tmp")
		if err != nil {
			return fmt.Errorf("failed to create temp file for %s: %v", name, err)
		}
		defer os.Remove(tmpFile.Name())

		if _, err := tmpFile.Write(bytes); err != nil {
			tmpFile.Close()
			return fmt.Errorf("failed to write to temp file for %s: %v", name, err)
		}
		if err := tmpFile.Close(); err != nil {
			return fmt.Errorf("failed to close temp file for %s: %v", name, err)
		}

		if err := os.Rename(tmpFile.Name(), path); err != nil {
			// Fallback: directly write to target (Windows editors may lock renames)
			if err2 := os.WriteFile(path, bytes, 0644); err2 != nil {
				return fmt.Errorf("failed to save %s: rename error: %v, direct write error: %v", name, err, err2)
			}
		}
		return nil
	}

	// 保存通道配置时，只保留设备ID和设备文件路径，不保存设备详细信息
	channelsToSave := make([]model.Channel, len(cfg.Channels))
	for i, channel := range cfg.Channels {
		channelsToSave[i] = channel
		devicesToSave := make([]model.Device, len(channel.Devices))
		for j, device := range channel.Devices {
			devicesToSave[j] = model.Device{
				ID:         device.ID,
				DeviceFile: device.DeviceFile,
			}
		}
		channelsToSave[i].Devices = devicesToSave
	}

	if err := saveFile("server.yaml", &cfg.Server); err != nil {
		return err
	}
	if err := saveFile("storage.yaml", &cfg.Storage); err != nil {
		return err
	}
	if err := saveFile("northbound.yaml", &cfg.Northbound); err != nil {
		return err
	}
	if err := saveFile("channels.yaml", channelsToSave); err != nil {
		return err
	}
	if err := saveFile("edge_rules.yaml", &cfg.EdgeRules); err != nil {
		return err
	}
	if err := saveFile("system.yaml", &cfg.System); err != nil {
		return err
	}
	if err := saveFile("users.yaml", &cfg.Users); err != nil {
		return err
	}

	return nil
}
