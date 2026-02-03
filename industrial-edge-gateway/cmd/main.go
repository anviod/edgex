package main

import (
	"flag"
	"industrial-edge-gateway/internal/config"
	"industrial-edge-gateway/internal/core"
	_ "industrial-edge-gateway/internal/driver/bacnet"
	_ "industrial-edge-gateway/internal/driver/dlt645"
	_ "industrial-edge-gateway/internal/driver/ethernetip"
	_ "industrial-edge-gateway/internal/driver/mitsubishi"
	_ "industrial-edge-gateway/internal/driver/modbus"
	_ "industrial-edge-gateway/internal/driver/omron"
	_ "industrial-edge-gateway/internal/driver/opcua"
	_ "industrial-edge-gateway/internal/driver/s7"
	"industrial-edge-gateway/internal/model"
	"industrial-edge-gateway/internal/server"
	"industrial-edge-gateway/internal/storage"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
)

func main() {
	// Parse command-line flags
	confDir := flag.String("conf", "conf", "Path to configuration directory")
	flag.Parse()

	log.Println("Starting Industrial Edge Gateway...")

	// 1. Load Config
	cfg, err := config.LoadConfig(*confDir)
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 2. Init Storage
	store, err := storage.NewStorage(cfg.Storage.Path)
	if err != nil {
		log.Printf("Warning: Failed to init storage: %v (continuing without storage)", err)
		store = nil
	}
	if store != nil {
		defer store.Close()
	}

	// 3. Init Core Components
	pipeline := core.NewDataPipeline(100)

	// Register pipeline handlers
	// a. Save to storage
	pipeline.AddHandler(func(v model.Value) {
		if store != nil {
			if err := store.SaveValue(v); err != nil {
				log.Printf("Failed to save value: %v", err)
			}
		}
	})

	// Init Edge Compute Manager
	ecm := core.NewEdgeComputeManager(pipeline, store, func(rules []model.EdgeRule) error {
		cfg.EdgeRules = rules
		return config.SaveConfig(*confDir, cfg)
	})
	ecm.LoadRules(cfg.EdgeRules)
	ecm.Start()

	// 5. Init Northbound Manager
	nbm := core.NewNorthboundManager(cfg.Northbound, pipeline, func(nbCfg model.NorthboundConfig) error {
		cfg.Northbound = nbCfg
		return config.SaveConfig(*confDir, cfg)
	})
	nbm.Start()
	defer nbm.Stop()

	// Connect Edge Compute to Northbound
	ecm.SetNorthboundManager(nbm)

	// 使用新的 ChannelManager（支持三级结构）
	cm := core.NewChannelManager(pipeline, func(channels []model.Channel) error {
		cfg.Channels = channels
		return config.SaveConfig(*confDir, cfg)
	})

	// Init System Manager
	sm := core.NewSystemManager(cfg, *confDir)

	// Init Device Storage Manager
	dsm := core.NewDeviceStorageManager(store, pipeline)
	// Initialize with loaded config
	for _, ch := range cfg.Channels {
		for _, dev := range ch.Devices {
			dsm.UpdateDeviceConfig(dev.ID, dev.Storage)
		}
	}

	// 4. Init Web Server
	srv := server.NewServer(cm, store, pipeline, nbm, ecm, sm, dsm)

	// Register pipeline handler for WebSocket broadcast
	pipeline.AddHandler(func(v model.Value) {
		srv.BroadcastValue(v)
	})

	pipeline.Start()

	// 6. Start Channels from Config
	for _, chConfig := range cfg.Channels {
		// Create a copy to avoid loop variable issues
		ch := chConfig
		ch.StopChan = make(chan struct{})

		err := cm.AddChannel(&ch)
		if err != nil {
			log.Printf("Failed to add channel %s: %v", ch.Name, err)
			continue
		}

		err = cm.StartChannel(ch.ID)
		if err != nil {
			log.Printf("Failed to start channel %s: %v", ch.Name, err)
		}
	}

	// 6. Start Web Server
	go func() {
		port := 8080
		if cfg.Server.Port != 0 {
			port = cfg.Server.Port
		}
		addr := ":" + strconv.Itoa(port)
		log.Printf("Web server starting on %s", addr)
		if err := srv.Start(addr); err != nil {
			log.Fatalf("Web server failed: %v", err)
		}
	}()

	// 7. Wait for shutdown signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Println("Shutting down...")
	cm.Shutdown()
}
