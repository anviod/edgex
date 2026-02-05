package config

import (
	"fmt"
	"industrial-edge-gateway/internal/model"
	"os"
	"sync"
	"testing"
)

func TestSaveConfigConcurrency(t *testing.T) {
	// Create a temporary directory for testing
	tmpDir, err := os.MkdirTemp("", "config_test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	configDir := tmpDir

	// Initial config
	initialCfg := &Config{
		Server: struct {
			Port     int    `yaml:"port"`
			LogLevel string `yaml:"logLevel"`
		}{Port: 8080, LogLevel: "info"},
		Channels: []model.Channel{},
	}

	if err := SaveConfig(configDir, initialCfg); err != nil {
		t.Fatalf("Failed to save initial config: %v", err)
	}

	// Concurrent writes
	var wg sync.WaitGroup
	workers := 10
	iterations := 50

	errCh := make(chan error, workers*iterations)

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			for j := 0; j < iterations; j++ {
				cfg := &Config{
					Server: struct {
						Port     int    `yaml:"port"`
						LogLevel string `yaml:"logLevel"`
					}{Port: 8080 + workerID, LogLevel: "info"},
					Channels: []model.Channel{
						{ID: fmt.Sprintf("ch-%d-%d", workerID, j), Name: "Test Channel"},
					},
				}
				if err := SaveConfig(configDir, cfg); err != nil {
					errCh <- fmt.Errorf("worker %d iter %d failed: %v", workerID, j, err)
				}
			}
		}(i)
	}

	wg.Wait()
	close(errCh)

	for err := range errCh {
		t.Errorf("%v", err)
	}

	// Verify final file is valid YAML and not corrupted
	finalCfg, err := LoadConfig(configDir)
	if err != nil {
		t.Fatalf("Failed to load final config: %v", err)
	}

	t.Logf("Final config loaded successfully. Port: %d", finalCfg.Server.Port)
}

func TestSaveConfig_EdgeRules(t *testing.T) {
	// Create a temporary directory for testing
	tmpDir, err := os.MkdirTemp("", "config_test_rules")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	configDir := tmpDir

	// Initial config with rules
	initialCfg := &Config{
		EdgeRules: []model.EdgeRule{
			{
				ID:   "rule1",
				Name: "Test Rule",
				Type: "threshold",
			},
		},
	}

	// 1. Save Config
	if err := SaveConfig(configDir, initialCfg); err != nil {
		t.Fatalf("Failed to save initial config: %v", err)
	}

	// 2. Verify file exists
	rulePath := configDir + "/edge_rules.yaml"
	if _, err := os.Stat(rulePath); os.IsNotExist(err) {
		t.Fatalf("edge_rules.yaml not created")
	}

	// 3. Load Config and verify
	loadedCfg, err := LoadConfig(configDir)
	if err != nil {
		t.Fatalf("Failed to load config: %v", err)
	}

	if len(loadedCfg.EdgeRules) != 1 {
		t.Fatalf("Expected 1 rule, got %d", len(loadedCfg.EdgeRules))
	}
	if loadedCfg.EdgeRules[0].ID != "rule1" {
		t.Errorf("Expected rule ID 'rule1', got '%s'", loadedCfg.EdgeRules[0].ID)
	}

	// 4. Update Rules
	initialCfg.EdgeRules = append(initialCfg.EdgeRules, model.EdgeRule{
		ID:   "rule2",
		Name: "Test Rule 2",
	})
	if err := SaveConfig(configDir, initialCfg); err != nil {
		t.Fatalf("Failed to save updated config: %v", err)
	}

	// 5. Load again
	loadedCfg, err = LoadConfig(configDir)
	if err != nil {
		t.Fatalf("Failed to load updated config: %v", err)
	}
	if len(loadedCfg.EdgeRules) != 2 {
		t.Fatalf("Expected 2 rules, got %d", len(loadedCfg.EdgeRules))
	}
}
