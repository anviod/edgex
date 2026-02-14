package core

import (
	"fmt"
	"industrial-edge-gateway/internal/model"
	"industrial-edge-gateway/internal/northbound/http"
	"industrial-edge-gateway/internal/northbound/mqtt"
)

func (nm *NorthboundManager) UpsertHTTPConfig(cfg model.HTTPConfig) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	var oldCfg model.HTTPConfig
	found := false
	for i, c := range nm.config.HTTP {
		if c.ID == cfg.ID {
			oldCfg = c
			nm.config.HTTP[i] = cfg
			found = true
			break
		}
	}
	if !found {
		nm.config.HTTP = append(nm.config.HTTP, cfg)
	}

	// Diff Logic
	addedDevices := []string{}
	removedDevices := []string{}

	if found {
		for dID, enabled := range cfg.Devices {
			if enabled {
				if oldEnabled, ok := oldCfg.Devices[dID]; !ok || !oldEnabled {
					addedDevices = append(addedDevices, dID)
				}
			}
		}
		for dID, enabled := range oldCfg.Devices {
			if enabled {
				if newEnabled, ok := cfg.Devices[dID]; !ok || !newEnabled {
					removedDevices = append(removedDevices, dID)
				}
			}
		}
	} else {
		for dID, enabled := range cfg.Devices {
			if enabled {
				addedDevices = append(addedDevices, dID)
			}
		}
	}

	if err := nm.saveConfig(); err != nil {
		return err
	}

	client, exists := nm.httpClients[cfg.ID]
	if !cfg.Enable {
		if exists {
			client.Stop()
			delete(nm.httpClients, cfg.ID)
		}
		return nil
	}

	var targetClient *http.Client
	if !exists {
		newClient := http.NewClient(cfg, nm.storage)
		newClient.Start()
		nm.httpClients[cfg.ID] = newClient
		targetClient = newClient
	} else {
		client.UpdateConfig(cfg)
		targetClient = client
	}

	// Fire Events
	if targetClient != nil {
		for _, dID := range addedDevices {
			if dev := nm.findDevice(dID); dev != nil {
				targetClient.PublishDeviceLifecycle("add", *dev.(*model.Device))
			}
		}
		for _, dID := range removedDevices {
			if dev := nm.findDevice(dID); dev != nil {
				targetClient.PublishDeviceLifecycle("remove", *dev.(*model.Device))
			} else {
				targetClient.PublishDeviceLifecycle("remove", model.Device{ID: dID})
			}
		}
	}
	return nil
}

// SetChannelManager sets the ChannelManager reference for device lookups
func (nm *NorthboundManager) SetChannelManager(cm *ChannelManager) {
	nm.cm = cm
}

// findDevice retrieves a device by ID from all channels via ChannelManager
func (nm *NorthboundManager) findDevice(dID string) any {
	if nm.cm == nil {
		return nil
	}

	nm.cm.mu.RLock()
	defer nm.cm.mu.RUnlock()

	// Search through all channels to find the device
	for _, ch := range nm.cm.channels {
		for i, dev := range ch.Devices {
			if dev.ID == dID {
				return &ch.Devices[i]
			}
		}
	}
	return nil
}

func (nm *NorthboundManager) DeleteHTTPConfig(id string) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	if client, exists := nm.httpClients[id]; exists {
		client.Stop()
		delete(nm.httpClients, id)
	}

	newConfigs := []model.HTTPConfig{}
	for _, c := range nm.config.HTTP {
		if c.ID != id {
			newConfigs = append(newConfigs, c)
		}
	}
	nm.config.HTTP = newConfigs

	return nm.saveConfig()
}

// PublishHTTP sends a raw payload via a specific HTTP config
func (nm *NorthboundManager) PublishHTTP(configID string, payload []byte) error {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	if client, ok := nm.httpClients[configID]; ok {
		return client.Send(payload)
	}
	return fmt.Errorf("HTTP config %s not found or not running", configID)
}

// PublishMQTTClient publishes to a specific client
func (nm *NorthboundManager) PublishMQTTClient(clientID string, topic string, payload []byte) error {
	nm.mu.RLock()
	defer nm.mu.RUnlock()

	if client, ok := nm.mqttClients[clientID]; ok {
		return client.PublishRaw(topic, payload)
	}
	return fmt.Errorf("MQTT client %s not found", clientID)
}

func (nm *NorthboundManager) UpsertMQTTConfig(cfg model.MQTTConfig) error {
	nm.mu.Lock()
	defer nm.mu.Unlock()

	var oldCfg model.MQTTConfig
	found := false
	for i, c := range nm.config.MQTT {
		if c.ID == cfg.ID {
			oldCfg = c
			nm.config.MQTT[i] = cfg
			found = true
			break
		}
	}
	if !found {
		nm.config.MQTT = append(nm.config.MQTT, cfg)
	}

	// Diff Logic - detect added and removed devices
	addedDevices := []string{}
	removedDevices := []string{}

	if found {
		for dID, devCfg := range cfg.Devices {
			if devCfg.Enable {
				if oldDevCfg, ok := oldCfg.Devices[dID]; !ok || !oldDevCfg.Enable {
					addedDevices = append(addedDevices, dID)
				}
			}
		}
		for dID, devCfg := range oldCfg.Devices {
			if devCfg.Enable {
				if newDevCfg, ok := cfg.Devices[dID]; !ok || !newDevCfg.Enable {
					removedDevices = append(removedDevices, dID)
				}
			}
		}
	} else {
		// New config - all enabled devices are "added"
		for dID, devCfg := range cfg.Devices {
			if devCfg.Enable {
				addedDevices = append(addedDevices, dID)
			}
		}
	}

	if err := nm.saveConfig(); err != nil {
		return err
	}

	client, exists := nm.mqttClients[cfg.ID]
	if !cfg.Enable {
		if exists {
			client.Stop()
			delete(nm.mqttClients, cfg.ID)
		}
		return nil
	}

	var targetClient *mqtt.Client
	if !exists {
		newClient := mqtt.NewClient(cfg, nm.sb, nm.storage)
		if err := newClient.Start(); err != nil {
			return fmt.Errorf("failed to start MQTT client: %w", err)
		}
		nm.mqttClients[cfg.ID] = newClient
		targetClient = newClient
	} else {
		client.UpdateConfig(cfg)
		targetClient = client
	}

	// Fire device lifecycle events
	if targetClient != nil {
		for _, dID := range addedDevices {
			if dev := nm.findDevice(dID); dev != nil {
				targetClient.PublishDeviceLifecycle("add", *dev.(*model.Device))
			}
		}
		for _, dID := range removedDevices {
			if dev := nm.findDevice(dID); dev != nil {
				targetClient.PublishDeviceLifecycle("remove", *dev.(*model.Device))
			} else {
				targetClient.PublishDeviceLifecycle("remove", model.Device{ID: dID})
			}
		}
	}
	return nil
}
