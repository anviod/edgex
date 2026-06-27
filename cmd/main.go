package main

import (
	"context"
	"flag"
	"os"
	"os/signal"
	"path/filepath"
	"strconv"
	"syscall"

	"github.com/anviod/edgex/internal/config"
	"github.com/anviod/edgex/internal/core"
	_ "github.com/anviod/edgex/internal/driver/bacnet"
	_ "github.com/anviod/edgex/internal/driver/dlt645"
	_ "github.com/anviod/edgex/internal/driver/ethernetip"
	_ "github.com/anviod/edgex/internal/driver/ice104"
	_ "github.com/anviod/edgex/internal/driver/knxnetip"
	_ "github.com/anviod/edgex/internal/driver/mitsubishi"
	_ "github.com/anviod/edgex/internal/driver/modbus"
	_ "github.com/anviod/edgex/internal/driver/omron"
	_ "github.com/anviod/edgex/internal/driver/opcua"
	_ "github.com/anviod/edgex/internal/driver/s7"
	_ "github.com/anviod/edgex/internal/driver/snmp"
	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/pkg/logger"
	"github.com/anviod/edgex/internal/server"
	"github.com/anviod/edgex/internal/storage"
	"github.com/anviod/edgex/internal/sync"

	"go.uber.org/zap"
)

func main() {
	// Parse command-line flags
	confDir := flag.String("conf", "conf", "Path to legacy YAML config for one-time migration")
	flag.Parse()

	// Create LogBroadcaster
	logBroadcaster := logger.NewLogBroadcaster()

	// Init Logger (Console only for startup)
	logger.InitLogger("info", "", nil)
	zap.L().Info("Starting Industrial Edge Gateway...")

	// 1. 初始化流程：只需检测 config.db 是否存在且为空
	dataDir := "data"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		zap.L().Fatal("Failed to create data directory", zap.String("dir", dataDir), zap.Error(err))
	}

	configPath := filepath.Join(dataDir, "config.db")

	configExists := false
	if _, err := os.Stat(configPath); err == nil {
		configExists = true
	}

	zap.L().Info("Database check",
		zap.String("config_db", configPath),
		zap.Bool("config_exists", configExists))

	var store *storage.Storage
	var cfg *config.Config
	var cfgManager *config.ConfigManager
	var err error

	if configExists {
		zap.L().Info("Initializing storage...", zap.String("dir", dataDir))
		store, err = storage.NewStorage(dataDir)
		if err != nil {
			zap.L().Fatal("Failed to init storage", zap.Error(err))
		}
		zap.L().Info("Storage initialized successfully",
			zap.String("config_db", store.GetConfigPath()),
			zap.String("runtime_db", store.GetPath()))

		// 检查配置数据是否可用（config.db 存在但为空时进入安装模式）
		configStore, _ := storage.NewConfigStore(store.GetConfigDB())
		hasConfig, _ := configStore.HasConfigData()
		if hasConfig {
			zap.L().Info("Configuration data found in config.db")
		} else {
			zap.L().Info("config.db is empty, entering install mode")
		}

		zap.L().Info("Loading configuration from database...")
		cfgManager, err = config.NewConfigManagerWithDB(*confDir, store.GetConfigDB())
		if err != nil {
			zap.L().Fatal("Failed to load config with DB", zap.Error(err))
		}
		cfg = cfgManager.GetConfig()
		zap.L().Info("Configuration loaded successfully from database")
	} else {
		zap.L().Info("config.db not found, starting with default empty config (install mode)")
		cfgManager = config.NewConfigManagerWithEmptyConfig(*confDir)
		cfg = cfgManager.GetConfig()
		zap.L().Info("Default config loaded for installation")
	}

	// Re-init Logger with config and broadcaster
	if err := os.MkdirAll("logs", 0755); err != nil {
		zap.L().Warn("Failed to create logs directory", zap.Error(err))
	}
	logger.InitLogger(cfg.Server.LogLevel, "logs/gateway.edgex.log", logBroadcaster)
	zap.L().Info("Logger initialized", zap.String("level", cfg.Server.LogLevel), zap.String("file", "logs/gateway.edgex.log"))
	zap.L().Info("Build info",
		zap.String("version", model.Version),
		zap.String("build_time", model.BuildTime),
		zap.String("commit_id", model.CommitID),
	)

	// 1. Setup node data directory structure
	// Generate node ID
	nodeID := sync.GetDefaultNodeID()
	zap.L().Info("Node ID generated", zap.String("nodeID", nodeID))

	zap.L().Info("Data directory ready", zap.String("path", dataDir))

	var shadowCore *core.ShadowCore
	var virtualShadow *core.VirtualShadowEngine
	var vsm *core.VirtualShadowManager
	if store != nil {
		defer store.Close()
	}

	// 3. Init Core Components
	zap.L().Info("Initializing data pipeline...")
	pipeline := core.NewDataPipeline(100)
	zap.L().Info("Data pipeline initialized")

	storeForward := core.NewStoreForwardManager(store, core.StoreForwardPolicy{
		MaxSouthboundRecords: 10000,
		MaxNorthboundPerID:   1000,
	})
	pipeline.AddBatchHandler(storeForward.HandleBatch)

	// Init Edge Compute Manager
	zap.L().Info("Initializing Edge Compute Manager...")
	ecm := core.NewEdgeComputeManager(pipeline, store, func(rules []model.EdgeRule) error {
		current := cfgManager.GetConfig()
		current.EdgeRules = rules
		return cfgManager.SaveConfig(current)
	})
	ecm.LoadRules(cfg.EdgeRules)
	ecm.Start()
	zap.L().Info("Edge Compute Manager started")

	// 4. Init Channel Manager (Before Northbound)
	zap.L().Info("Initializing Channel Manager...")
	cm := core.NewChannelManager(pipeline, func(channels []model.Channel) error {
		current := cfgManager.GetConfig()
		current.Channels = channels
		return cfgManager.SaveConfig(current)
	})

	dsm := core.NewDeviceStorageManager(store, pipeline)

	wireShadowStack := func(sc *core.ShadowCore) {
		core.NewShadowBridge(pipeline).Attach(sc)
		dsm.SetShadowCore(sc)
		virtualShadow = core.NewVirtualShadowEngine(sc)
	}

	if store != nil {
		shadowCore = core.NewShadowCore()
		shadowCore.Start()
		cm.SetShadowCore(shadowCore)
		wireShadowStack(shadowCore)
		defer shadowCore.Stop()
		zap.L().Info("ShadowCore and VirtualShadowEngine initialized")
	}

	// 5. Init Northbound Manager
	zap.L().Info("Initializing Northbound Manager...")
	nbm := core.NewNorthboundManager(cfg.Northbound, pipeline, cm, store, func(nbCfg model.NorthboundConfig) error {
		current := cfgManager.GetConfig()
		current.Northbound = nbCfg
		return cfgManager.SaveConfig(current)
	})
	nbm.SetChannelManager(cm)
	cm.SetStatusHandler(func(deviceID string, status int) {
		nbm.OnDeviceStatusChange(deviceID, status)
	})
	cm.SetTopologyChangeHandler(func() {
		nbm.RebuildOPCUAServers()
		if vsm != nil {
			vsm.ReloadAll()
		}
	})

	// Connect Edge Compute to Northbound
	ecm.SetNorthboundManager(nbm)

	// Init System Manager
	sm := core.NewSystemManager(cfg)
	sm.SetConfigManager(cfgManager)

	for _, ch := range cfg.Channels {
		for _, dev := range ch.Devices {
			dsm.UpdateDeviceConfig(dev.ID, dev.Storage)
		}
	}
	zap.L().Info("Core components initialized")

	var syncManager *sync.SyncManager = nil
	if store != nil && cfg.System.Sync.Enabled {
		syncPort := cfg.System.Sync.Port
		if syncPort == 0 {
			syncPort = 9090
		}
		syncManager, err = sync.NewSyncManager(context.Background(), dataDir, syncPort)
		if err != nil {
			zap.L().Warn("Sync Manager init failed", zap.Error(err))
			syncManager = nil
		} else {
			syncManager.SeedSnapshot(nodeID, cfg)
			zap.L().Info("Sync Manager enabled (DB snapshot mode, no YAML path mutation)")
		}
	} else {
		zap.L().Info("Sync Manager disabled (set system.sync.enabled=true to enable)")
	}

	// 4. Init Web Server
	zap.L().Info("Initializing Web Server...")
	srv := server.NewServer(cm, store, pipeline, nbm, ecm, sm, dsm, cfgManager, syncManager, logBroadcaster)
	if shadowCore != nil {
		srv.SetShadowCore(shadowCore)
	}
	if virtualShadow != nil {
		srv.SetVirtualShadowEngine(virtualShadow)
	}
	if virtualShadow != nil && shadowCore != nil && cfgManager != nil {
		vsm = core.NewVirtualShadowManager(virtualShadow, cm, shadowCore, func(devices []model.VirtualShadowDeviceConfig) error {
			return cfgManager.SaveVirtualShadows(devices)
		})
		if configs, err := cfgManager.LoadVirtualShadows(); err == nil {
			vsm.Load(configs)
		} else {
			zap.L().Warn("Failed to load virtual shadows", zap.Error(err))
		}
		srv.SetVirtualShadowManager(vsm)
	}
	srv.SetStorageAttachHook(func(st *storage.Storage) {
		if ecm != nil {
			ecm.SetStorage(st)
		}
		if dsm != nil {
			dsm.SetStorage(st)
		}
		storeForward.SetStorage(st)
		if shadowCore == nil {
			shadowCore = core.NewShadowCore()
			shadowCore.Start()
			cm.SetShadowCore(shadowCore)
			wireShadowStack(shadowCore)
			srv.SetShadowCore(shadowCore)
			srv.SetVirtualShadowEngine(virtualShadow)
			if vsm == nil && cfgManager != nil {
				vsm = core.NewVirtualShadowManager(virtualShadow, cm, shadowCore, func(devices []model.VirtualShadowDeviceConfig) error {
					return cfgManager.SaveVirtualShadows(devices)
				})
				srv.SetVirtualShadowManager(vsm)
			}
			zap.L().Info("ShadowCore initialized after install")
		}
	})
	zap.L().Info("Web Server initialized")

	pipeline.Start()

	// 5. Start Web Server first (before any potentially blocking operations)
	go func() {
		port := 8080
		if cfg.Server.Port != 0 {
			port = cfg.Server.Port
		}
		addr := ":" + strconv.Itoa(port)
		zap.L().Info("Web server starting", zap.String("addr", addr))
		if err := srv.Start(addr); err != nil {
			zap.L().Fatal("Web server failed", zap.Error(err))
		}
	}()

	// 6. Start Channels then Northbound (sequential to ensure OPC UA address space includes all devices)
	go func() {
		for _, chConfig := range cfg.Channels {
			ch := chConfig
			ch.StopChan = make(chan struct{})

			err := cm.AddChannel(&ch)
			if err != nil {
				zap.L().Error("Failed to add channel", zap.String("channel", ch.Name), zap.Error(err))
				continue
			}

			err = cm.StartChannel(ch.ID)
			if err != nil {
				zap.L().Error("Failed to start channel", zap.String("channel", ch.Name), zap.Error(err))
			}
		}
		zap.L().Info("All channels initialization completed")

		nbm.Start()
		nbm.RebuildOPCUAServers()
		zap.L().Info("Northbound manager started")
	}()
	defer nbm.Stop()

	if syncManager != nil {
		syncManager.SeedSnapshot(syncManager.GetPeerIDString(), cfg)
	}

	// 7. Wait for shutdown signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	zap.L().Info("Shutting down...")

	// Stop sync manager
	if syncManager != nil {
		syncManager.Stop()
	}

	cm.Shutdown()
}
