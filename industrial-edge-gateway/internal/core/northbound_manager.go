package core

import (
	"context"
	"industrial-edge-gateway/internal/model"
	"industrial-edge-gateway/internal/northbound/mqtt"
	"industrial-edge-gateway/internal/northbound/opcua"
	"log"
)

type NorthboundManager struct {
	config   model.NorthboundConfig
	mqtt     *mqtt.Client
	opcua    *opcua.Server
	pipeline *DataPipeline
	ctx      context.Context
	cancel   context.CancelFunc
	saveFunc func(model.NorthboundConfig) error
}

func NewNorthboundManager(cfg model.NorthboundConfig, pipeline *DataPipeline, saveFunc func(model.NorthboundConfig) error) *NorthboundManager {
	ctx, cancel := context.WithCancel(context.Background())
	return &NorthboundManager{
		config:   cfg,
		pipeline: pipeline,
		ctx:      ctx,
		cancel:   cancel,
		saveFunc: saveFunc,
	}
}

func (nm *NorthboundManager) Start() {
	// Start MQTT
	if nm.config.MQTT.Enable {
		nm.mqtt = mqtt.NewClient(nm.config.MQTT)
		if err := nm.mqtt.Start(); err != nil {
			log.Printf("Failed to start MQTT client: %v", err)
		} else {
			log.Println("Northbound MQTT client started")
		}
	}

	// Start OPC UA
	if nm.config.OPCUA.Enable {
		nm.opcua = opcua.NewServer(nm.config.OPCUA)
		if err := nm.opcua.Start(); err != nil {
			log.Printf("Failed to start OPC UA server: %v", err)
		} else {
			log.Println("Northbound OPC UA server started")
		}
	}

	// Subscribe to pipeline
	nm.pipeline.AddHandler(nm.handleValue)
}

func (nm *NorthboundManager) handleValue(v model.Value) {
	if nm.mqtt != nil {
		nm.mqtt.Publish(v)
	}
	if nm.opcua != nil {
		nm.opcua.Update(v)
	}
}

func (nm *NorthboundManager) Stop() {
	nm.cancel()
	if nm.mqtt != nil {
		nm.mqtt.Stop()
	}
	if nm.opcua != nil {
		nm.opcua.Stop()
	}
}

func (nm *NorthboundManager) GetConfig() model.NorthboundConfig {
	return nm.config
}

func (nm *NorthboundManager) GetMQTTStatus() int {
	if nm.mqtt == nil {
		return 0 // StatusDisconnected
	}
	return nm.mqtt.GetStatus()
}

func (nm *NorthboundManager) UpdateMQTTConfig(cfg model.MQTTConfig) error {
	nm.config.MQTT = cfg
	if nm.saveFunc != nil {
		if err := nm.saveFunc(nm.config); err != nil {
			log.Printf("Failed to save northbound config: %v", err)
		}
	}

	// If disabled, stop if running
	if !cfg.Enable {
		if nm.mqtt != nil {
			nm.mqtt.Stop()
			nm.mqtt = nil
		}
		return nil
	}

	// If enabled
	if nm.mqtt == nil {
		nm.mqtt = mqtt.NewClient(cfg)
		return nm.mqtt.Start()
	}

	// Update existing client
	return nm.mqtt.UpdateConfig(cfg)
}

func (nm *NorthboundManager) UpdateOPCUAConfig(cfg model.OPCUAConfig) error {
	nm.config.OPCUA = cfg
	if nm.saveFunc != nil {
		if err := nm.saveFunc(nm.config); err != nil {
			log.Printf("Failed to save northbound config: %v", err)
		}
	}

	// If disabled, stop if running
	if !cfg.Enable {
		if nm.opcua != nil {
			nm.opcua.Stop()
			nm.opcua = nil
		}
		return nil
	}

	// If enabled
	if nm.opcua == nil {
		nm.opcua = opcua.NewServer(cfg)
		return nm.opcua.Start()
	}

	// Update existing server
	return nm.opcua.UpdateConfig(cfg)
}
