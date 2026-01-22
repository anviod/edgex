package config

import (
	"industrial-edge-gateway/internal/model"
	"os"
	"time"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server struct {
		Port int `yaml:"port"`
	} `yaml:"server"`
	Storage struct {
		Path string `yaml:"path"`
	} `yaml:"storage"`
	Northbound model.NorthboundConfig `yaml:"northbound"`
	Channels   []model.Channel        `yaml:"channels"`
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
		cfg.Channels[i].NodeRuntime = &struct {
			FailCount     int
			SuccessCount  int
			LastFailTime  time.Time
			NextRetryTime time.Time
			State         int
		}{State: 0}

		// 初始化设备的运行时字段
		for j := range cfg.Channels[i].Devices {
			cfg.Channels[i].Devices[j].StopChan = make(chan struct{})
			cfg.Channels[i].Devices[j].NodeRuntime = &struct {
				FailCount     int
				SuccessCount  int
				LastFailTime  time.Time
				NextRetryTime time.Time
				State         int
			}{State: 0}
		}
	}

	return &cfg, nil
}

func SaveConfig(path string, cfg *Config) error {
	data, err := yaml.Marshal(cfg)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}
