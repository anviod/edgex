package core

import (
	"context"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"industrial-edge-gateway/internal/northbound/mqtt"
	"industrial-edge-gateway/internal/northbound/opcua"
	"industrial-edge-gateway/internal/northbound/sparkplugb"
	"log"
	"sync"
)

type NorthboundStatus struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Type   string `json:"type"`
	Status string `json:"status"`
}

type NorthboundManager struct {
	config           model.NorthboundConfig
	mqttClients      map[string]*mqtt.Client
	opcuaServers     map[string]*opcua.Server
	sparkplugClients map[string]*sparkplugb.Client
	pipeline         *DataPipeline
	sb               model.SouthboundManager
	ctx              context.Context
	cancel           context.CancelFunc
	saveFunc         func(model.NorthboundConfig) error
	mu               sync.RWMutex
}

func NewNorthboundManager(cfg model.NorthboundConfig, pipeline *DataPipeline, sb model.SouthboundManager, saveFunc func(model.NorthboundConfig) error) *NorthboundManager {
	ctx, cancel := context.WithCancel(context.Background())
	return &NorthboundManager{
		config:           cfg,
		mqttClients:      make(map[string]*mqtt.Client),
		opcuaServers:     make(map[string]*opcua.Server),
		sparkplugClients: make(map[string]*sparkplugb.Client),
		pipeline:         pipeline,
		sb:               sb,
		ctx:              ctx,
		cancel:           cancel,
		saveFunc:         saveFunc,
	}
}

func (nm *NorthboundManager) GetNorthboundStats() []NorthboundStatus {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	var stats []NorthboundStatus

	// MQTT
	for _, cfg := range nm.config.MQTT {
		status := "Stopped"
		if !cfg.Enable {
			status = "Disabled"
		} else if _, ok := nm.mqttClients[cfg.ID]; ok {
			status = "Running"
		}
		stats = append(stats, NorthboundStatus{
			ID:     cfg.ID,
			Name:   cfg.Name,
			Type:   "MQTT",
			Status: status,
		})
	}

	// OPC UA
	for _, cfg := range nm.config.OPCUA {
		status := "Stopped"
		if !cfg.Enable {
			status = "Disabled"
		} else if _, ok := nm.opcuaServers[cfg.ID]; ok {
			status = "Running"
		}
		stats = append(stats, NorthboundStatus{
			ID:     cfg.ID,
			Name:   cfg.Name,
			Type:   "OPC UA",
			Status: status,
		})
	}

	// SparkplugB
	for _, cfg := range nm.config.SparkplugB {
		status := "Stopped"
		if !cfg.Enable {
			status = "Disabled"
		} else if _, ok := nm.sparkplugClients[cfg.ID]; ok {
			status = "Running"
		}
		stats = append(stats, NorthboundStatus{
			ID:     cfg.ID,
			Name:   cfg.Name,
			Type:   "SparkplugB",
			Status: status,
		})
	}

	return stats
}

func (nm *NorthboundManager) Start() {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	// Start MQTT Clients
	for _, cfg := range nm.config.MQTT {
		if cfg.Enable {
			client := mqtt.NewClient(cfg, nm.sb)
			if err := client.Start(); err != nil {
				log.Printf("Failed to start MQTT client [%s]: %v", cfg.Name, err)
			} else {
				log.Printf("Northbound MQTT client [%s] started", cfg.Name)
				nm.mqttClients[cfg.ID] = client
			}
		}
	}

	// Start OPC UA Servers
	for _, cfg := range nm.config.OPCUA {
		if cfg.Enable {
			server := opcua.NewServer(cfg, nm.sb)
			if err := server.Start(); err != nil {
				log.Printf("Failed to start OPC UA server [%s]: %v", cfg.Name, err)
			} else {
				log.Printf("Northbound OPC UA server [%s] started", cfg.Name)
				nm.opcuaServers[cfg.ID] = server
			}
		}
	}

	// Start SparkplugB Clients
	for _, cfg := range nm.config.SparkplugB {
		if cfg.Enable {
			client := sparkplugb.NewClient(cfg)
			if err := client.Start(); err != nil {
				log.Printf("Failed to start Sparkplug B client [%s]: %v", cfg.Name, err)
			} else {
				log.Printf("Northbound Sparkplug B client [%s] started", cfg.Name)
				nm.sparkplugClients[cfg.ID] = client
			}
		}
	}

	// Subscribe to pipeline
	nm.pipeline.AddHandler(nm.handleValue)
}

func (nm *NorthboundManager) handleValue(v model.Value) {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	for _, client := range nm.mqttClients {
		client.Publish(v)
	}
	for _, server := range nm.opcuaServers {
		server.Update(v)
	}
	for _, client := range nm.sparkplugClients {
		client.Publish(v)
	}
}

// OnDeviceStatusChange handles device status changes and notifies northbound clients
func (nm *NorthboundManager) OnDeviceStatusChange(deviceID string, status int) {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	for _, client := range nm.mqttClients {
		client.PublishDeviceStatus(deviceID, status)
	}
}

// PublishMQTT publishes a message to a specific MQTT client or all if clientID is empty
func (nm *NorthboundManager) PublishMQTT(clientID string, topic string, payload []byte) error {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	if clientID != "" {
		if client, ok := nm.mqttClients[clientID]; ok {
			return client.PublishRaw(topic, payload)
		}
		return fmt.Errorf("MQTT client %s not found", clientID)
	}

	// If no client ID specified, try to publish to first available or all?
	// For now, let's say if no client ID, we pick the first one.
	for _, client := range nm.mqttClients {
		return client.PublishRaw(topic, payload)
	}
	return fmt.Errorf("no active MQTT clients")
}

func (nm *NorthboundManager) GetOPCUAStats(id string) (opcua.Stats, error) {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	if server, ok := nm.opcuaServers[id]; ok {
		return server.GetStats(), nil
	}
	return opcua.Stats{}, fmt.Errorf("OPC UA server %s not found or not running", id)
}

func (nm *NorthboundManager) GetMQTTStats(id string) (mqtt.MQTTStats, error) {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	if client, ok := nm.mqttClients[id]; ok {
		return client.GetStats(), nil
	}
	return mqtt.MQTTStats{}, fmt.Errorf("MQTT client %s not found or not running", id)
}

func (nm *NorthboundManager) Stop() {
	nm.cancel()
	nm.mu.Lock()
	defer nm.mu.Unlock()

	for _, client := range nm.mqttClients {
		client.Stop()
	}
	for _, server := range nm.opcuaServers {
		server.Stop()
	}
	for _, client := range nm.sparkplugClients {
		client.Stop()
	}
}

func (nm *NorthboundManager) GetConfig() model.NorthboundConfig {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	// Copy status to config before returning
	status := make(map[string]int)
	for id, client := range nm.mqttClients {
		status[id] = client.GetStatus()
	}
	for id, client := range nm.sparkplugClients {
		status[id] = client.GetStatus()
	}
	// OPC UA status usually implies running if in the map

	cfg := nm.config
	cfg.Status = status
	return cfg
}

// MQTT Operations

func (nm *NorthboundManager) UpsertMQTTConfig(cfg model.MQTTConfig) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	// Update config list
	found := false
	for i, c := range nm.config.MQTT {
		if c.ID == cfg.ID {
			nm.config.MQTT[i] = cfg
			found = true
			break
		}
	}
	if !found {
		nm.config.MQTT = append(nm.config.MQTT, cfg)
	}

	if err := nm.saveConfig(); err != nil {
		return err
	}

	// Manage runtime
	client, exists := nm.mqttClients[cfg.ID]

	if !cfg.Enable {
		if exists {
			client.Stop()
			delete(nm.mqttClients, cfg.ID)
		}
		return nil
	}

	if !exists {
		newClient := mqtt.NewClient(cfg, nm.sb)
		if err := newClient.Start(); err != nil {
			return err
		}
		nm.mqttClients[cfg.ID] = newClient
	} else {
		return client.UpdateConfig(cfg)
	}

	return nil
}

func (nm *NorthboundManager) DeleteMQTTConfig(id string) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	// Remove from runtime
	if client, exists := nm.mqttClients[id]; exists {
		client.Stop()
		delete(nm.mqttClients, id)
	}

	// Remove from config
	newConfigs := []model.MQTTConfig{}
	for _, c := range nm.config.MQTT {
		if c.ID != id {
			newConfigs = append(newConfigs, c)
		}
	}
	nm.config.MQTT = newConfigs

	return nm.saveConfig()
}

// SparkplugB Operations

func (nm *NorthboundManager) UpsertSparkplugBConfig(cfg model.SparkplugBConfig) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	found := false
	for i, c := range nm.config.SparkplugB {
		if c.ID == cfg.ID {
			nm.config.SparkplugB[i] = cfg
			found = true
			break
		}
	}
	if !found {
		nm.config.SparkplugB = append(nm.config.SparkplugB, cfg)
	}

	if err := nm.saveConfig(); err != nil {
		return err
	}

	client, exists := nm.sparkplugClients[cfg.ID]

	if !cfg.Enable {
		if exists {
			client.Stop()
			delete(nm.sparkplugClients, cfg.ID)
		}
		return nil
	}

	if !exists {
		newClient := sparkplugb.NewClient(cfg)
		if err := newClient.Start(); err != nil {
			return err
		}
		nm.sparkplugClients[cfg.ID] = newClient
	} else {
		return client.UpdateConfig(cfg)
	}

	return nil
}

func (nm *NorthboundManager) DeleteSparkplugBConfig(id string) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	if client, exists := nm.sparkplugClients[id]; exists {
		client.Stop()
		delete(nm.sparkplugClients, id)
	}

	newConfigs := []model.SparkplugBConfig{}
	for _, c := range nm.config.SparkplugB {
		if c.ID != id {
			newConfigs = append(newConfigs, c)
		}
	}
	nm.config.SparkplugB = newConfigs

	return nm.saveConfig()
}

// OPC UA Operations

func (nm *NorthboundManager) UpsertOPCUAConfig(cfg model.OPCUAConfig) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	found := false
	for i, c := range nm.config.OPCUA {
		if c.ID == cfg.ID {
			nm.config.OPCUA[i] = cfg
			found = true
			break
		}
	}
	if !found {
		nm.config.OPCUA = append(nm.config.OPCUA, cfg)
	}

	if err := nm.saveConfig(); err != nil {
		return err
	}

	server, exists := nm.opcuaServers[cfg.ID]

	if !cfg.Enable {
		if exists {
			server.Stop()
			delete(nm.opcuaServers, cfg.ID)
		}
		return nil
	}

	if !exists {
		newServer := opcua.NewServer(cfg, nm.sb)
		if err := newServer.Start(); err != nil {
			return err
		}
		nm.opcuaServers[cfg.ID] = newServer
	} else {
		return server.UpdateConfig(cfg)
	}

	return nil
}

func (nm *NorthboundManager) DeleteOPCUAConfig(id string) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	if server, exists := nm.opcuaServers[id]; exists {
		server.Stop()
		delete(nm.opcuaServers, id)
	}

	newConfigs := []model.OPCUAConfig{}
	for _, c := range nm.config.OPCUA {
		if c.ID != id {
			newConfigs = append(newConfigs, c)
		}
	}
	nm.config.OPCUA = newConfigs

	return nm.saveConfig()
}

func (nm *NorthboundManager) saveConfig() error {
	if nm.saveFunc != nil {
		return nm.saveFunc(nm.config)
	}
	return nil
}
