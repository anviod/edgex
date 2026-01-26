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
		Port int `yaml:"port"`
	} `yaml:"server"`
	Storage struct {
		Path string `yaml:"path"`
	} `yaml:"storage"`
	Northbound model.NorthboundConfig `yaml:"northbound"`
	Channels   []model.Channel        `yaml:"channels"`
	EdgeRules  []model.EdgeRule       `yaml:"edge_rules"`
	System     model.SystemConfig     `yaml:"system"`
}

func LoadConfig(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var cfg Config
	err = yaml.Unmarshal(data, &cfg)
	if err != nil {
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

	return &cfg, nil
}

func SaveConfig(path string, cfg *Config) error {
	saveMu.Lock()
	defer saveMu.Unlock()

	data, err := yaml.Marshal(cfg)
	if err != nil {
		return err
	}

	// Atomic write: write to temp file, then rename
	dir := filepath.Dir(path)
	tmpFile, err := os.CreateTemp(dir, "config-*.yaml.tmp")
	if err != nil {
		return fmt.Errorf("failed to create temp file: %v", err)
	}
	defer os.Remove(tmpFile.Name()) // Clean up if rename fails

	if _, err := tmpFile.Write(data); err != nil {
		tmpFile.Close()
		return fmt.Errorf("failed to write to temp file: %v", err)
	}
	if err := tmpFile.Close(); err != nil {
		return fmt.Errorf("failed to close temp file: %v", err)
	}

	// Rename (Atomic replace)
	if err := os.Rename(tmpFile.Name(), path); err != nil {
		return fmt.Errorf("failed to rename temp file to config: %v", err)
	}

	return nil
}
