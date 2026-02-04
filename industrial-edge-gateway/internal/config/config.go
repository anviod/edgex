package config

import (
	"fmt"
	"industrial-edge-gateway/internal/model"
	"os"
	"path/filepath"
	"sync"

	"gopkg.in/yaml.v3"
)

var saveMu sync.Mutex

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

	if err := saveFile("server.yaml", &cfg.Server); err != nil {
		return err
	}
	if err := saveFile("storage.yaml", &cfg.Storage); err != nil {
		return err
	}
	if err := saveFile("northbound.yaml", &cfg.Northbound); err != nil {
		return err
	}
	if err := saveFile("channels.yaml", &cfg.Channels); err != nil {
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
