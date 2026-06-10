package main

import (
	"context"
	"flag"
	"os"
	"os/signal"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/anviod/edgex/internal/config"
	"github.com/anviod/edgex/internal/core"
	_ "github.com/anviod/edgex/internal/driver/bacnet"
	_ "github.com/anviod/edgex/internal/driver/dlt645"
	_ "github.com/anviod/edgex/internal/driver/ethernetip"
	_ "github.com/anviod/edgex/internal/driver/mitsubishi"
	_ "github.com/anviod/edgex/internal/driver/modbus"
	_ "github.com/anviod/edgex/internal/driver/omron"
	_ "github.com/anviod/edgex/internal/driver/opcua"
	_ "github.com/anviod/edgex/internal/driver/s7"
	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/pkg/logger"
	"github.com/anviod/edgex/internal/server"
	"github.com/anviod/edgex/internal/storage"
	"github.com/anviod/edgex/internal/sync"

	"go.uber.org/zap"
)

func main() {
	// Parse command-line flags
	confDir := flag.String("conf", "conf", "Path to configuration directory")
	flag.Parse()

	// Create LogBroadcaster
	logBroadcaster := logger.NewLogBroadcaster()

	// Init Logger (Console only for startup)
	logger.InitLogger("info", "", nil)
	zap.L().Info("Starting Industrial Edge Gateway...")

	// 1. Load Config using ConfigManager
	cfgManager, err := config.NewConfigManager(*confDir)
	if err != nil {
		zap.L().Fatal("Failed to load config", zap.Error(err))
	}
	cfg := cfgManager.GetConfig()

	// Re-init Logger with config and broadcaster
	// Ensure logs directory exists
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

	// 2. Setup node data directory structure: data/<节点名>/<节点ID>/conf
	nodeName := cfg.System.Hostname.Name
	if nodeName == "" {
		nodeName = "edgex"
	}

	// 生成节点ID
	nodeID := sync.GetDefaultNodeID()
	zap.L().Info("Node ID generated", zap.String("nodeID", nodeID))

	// 构建节点数据目录路径: data/<节点名>/<节点ID>/conf
	nodeConfDir := filepath.Join("data", nodeName, nodeID, "conf")
	if err := os.MkdirAll(nodeConfDir, 0755); err != nil {
		zap.L().Fatal("Failed to create node conf directory", zap.String("dir", nodeConfDir), zap.Error(err))
	}
	zap.L().Info("Node conf directory ready", zap.String("path", nodeConfDir))

	// 完整镜像 conf 目录到 data/<节点名>/<节点ID>/conf
	if _, err := os.Stat(*confDir); err == nil {
		if _, err := os.Stat(nodeConfDir); os.IsNotExist(err) {
			zap.L().Info("Migrating conf directory", zap.String("from", *confDir), zap.String("to", nodeConfDir))
			if err := migrateDirWithPermissions(*confDir, nodeConfDir); err != nil {
				zap.L().Fatal("Failed to migrate conf directory", zap.Error(err))
			}
			zap.L().Info("Conf directory migrated successfully")
		}
	}

	// Update device file paths in config to use new structure
	for i := range cfg.Channels {
		for j := range cfg.Channels[i].Devices {
			dev := &cfg.Channels[i].Devices[j]
			if dev.DeviceFile != "" {
				// Update old conf/devices paths to new data/<节点名>/<节点ID>/conf/devices paths
				if strings.HasPrefix(dev.DeviceFile, "conf/devices/") || strings.HasPrefix(dev.DeviceFile, filepath.Join(*confDir, "devices")) {
					relPath, err := filepath.Rel(*confDir, dev.DeviceFile)
					if err == nil {
						dev.DeviceFile = filepath.Join(nodeConfDir, relPath)
					}
				}
			}
		}
	}

	// Update storage path to use node data directory
	cfg.Storage.Path = filepath.Join(filepath.Dir(nodeConfDir), "config.db")

	// 3. Init Storage
	zap.L().Info("Initializing storage...")
	store, err := storage.NewStorage(cfg.Storage.Path)
	if err != nil {
		zap.L().Warn("Failed to init storage (continuing without storage)", zap.Error(err))
		store = nil
	} else {
		zap.L().Info("Storage initialized successfully")
	}
	if store != nil {
		defer store.Close()
	}

	// 3. Init Core Components
	zap.L().Info("Initializing data pipeline...")
	pipeline := core.NewDataPipeline(100)
	zap.L().Info("Data pipeline initialized")

	// Register pipeline handlers
	// a. Save to storage
	pipeline.AddHandler(func(v model.Value) {
		if store != nil {
			if err := store.SaveValue(v); err != nil {
				zap.L().Error("Failed to save value", zap.Error(err))
			}
		}
	})

	// Init Edge Compute Manager
	zap.L().Info("Initializing Edge Compute Manager...")
	ecm := core.NewEdgeComputeManager(pipeline, store, func(rules []model.EdgeRule) error {
		cfg.EdgeRules = rules
		return config.SaveConfig(*confDir, cfg)
	})
	ecm.LoadRules(cfg.EdgeRules)
	ecm.Start()
	zap.L().Info("Edge Compute Manager started")

	// 4. Init Channel Manager (Before Northbound)
	zap.L().Info("Initializing Channel Manager...")
	cm := core.NewChannelManager(pipeline, func(channels []model.Channel) error {
		cfg.Channels = channels
		return config.SaveConfig(*confDir, cfg)
	}, nodeConfDir)

	// 5. Init Northbound Manager
	zap.L().Info("Initializing Northbound Manager...")
	nbm := core.NewNorthboundManager(cfg.Northbound, pipeline, cm, store, func(nbCfg model.NorthboundConfig) error {
		cfg.Northbound = nbCfg
		return config.SaveConfig(*confDir, cfg)
	})
	nbm.SetChannelManager(cm)
	cm.SetStatusHandler(func(deviceID string, status int) {
		nbm.OnDeviceStatusChange(deviceID, status)
	})

	// Connect Edge Compute to Northbound
	ecm.SetNorthboundManager(nbm)

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
	zap.L().Info("Core components initialized")

	// Init Sync Manager
	zap.L().Info("Initializing Sync Manager...")
	var syncManager *sync.SyncManager
	syncManager, err = sync.NewSyncManager(context.Background(), cfg.Storage.Path, 4001)
	if err != nil {
		zap.L().Warn("Failed to init sync manager (continuing without sync)", zap.Error(err))
		syncManager = nil
	} else {
		zap.L().Info("Sync Manager created, starting...")
		if err := syncManager.Start(); err != nil {
			zap.L().Warn("Failed to start sync manager", zap.Error(err))
			syncManager = nil
		} else {
			zap.L().Info("Sync manager started", zap.String("node_id", syncManager.GetPeerIDString()))
		}
	}

	// 4. Init Web Server
	zap.L().Info("Initializing Web Server...")
	srv := server.NewServer(cm, store, pipeline, nbm, ecm, sm, dsm, cfgManager, syncManager, logBroadcaster)
	zap.L().Info("Web Server initialized")

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
			zap.L().Error("Failed to add channel", zap.String("channel", ch.Name), zap.Error(err))
			continue
		}

		err = cm.StartChannel(ch.ID)
		if err != nil {
			zap.L().Error("Failed to start channel", zap.String("channel", ch.Name), zap.Error(err))
		}
	}

	// Start Northbound Manager (after channels are loaded so OPC UA can build address space)
	nbm.Start()
	defer nbm.Stop()

	if syncManager != nil {
		syncManager.SeedSnapshot(syncManager.GetPeerIDString(), cfg)
	}

	// 6. Start Web Server
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

	// 7. Start config watcher for hot reload
	cfgManager.StartWatch(5 * time.Second)

	// 8. Handle config reload
	go func() {
		for range cfgManager.ReloadChan {
			zap.L().Info("Config reloaded, updating components...")
			newCfg := cfgManager.GetConfig()

			// Update Edge Compute rules
			ecm.LoadRules(newCfg.EdgeRules)

			// Update Northbound config
			nbm.UpdateConfig(newCfg.Northbound)

			// Update channels (add new ones, remove old ones, update existing ones)
			// This would require more complex logic, but for now we'll just log
			zap.L().Info("Channels config updated", zap.Int("count", len(newCfg.Channels)))

			// Update device storage configs
			for _, ch := range newCfg.Channels {
				for _, dev := range ch.Devices {
					dsm.UpdateDeviceConfig(dev.ID, dev.Storage)
				}
			}

			if syncManager != nil {
				syncManager.SeedSnapshot(syncManager.GetPeerIDString(), newCfg)
			}
		}
	}()

	// 9. Wait for shutdown signal
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

// migrateDir recursively copies a directory tree from src to dst
func migrateDir(src, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		dstPath := filepath.Join(dst, relPath)
		if info.IsDir() {
			return os.MkdirAll(dstPath, info.Mode())
		}
		return copyFile(path, dstPath)
	})
}

// migrateDirWithPermissions recursively copies a directory tree with full permissions
func migrateDirWithPermissions(src, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		dstPath := filepath.Join(dst, relPath)
		if info.IsDir() {
			if err := os.MkdirAll(dstPath, info.Mode()); err != nil {
				return err
			}
			// 保留目录时间戳
			if err := os.Chtimes(dstPath, info.ModTime(), info.ModTime()); err != nil {
				return err
			}
			return nil
		}
		return copyFileWithPermissions(path, dstPath, info)
	})
}

// copyFileWithPermissions copies a single file with full permissions and attributes
func copyFileWithPermissions(src, dst string, info os.FileInfo) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}

	out, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, info.Mode())
	if err != nil {
		return err
	}
	defer out.Close()

	if _, err := out.ReadFrom(in); err != nil {
		return err
	}

	// 保留文件时间戳
	if err := os.Chtimes(dst, info.ModTime(), info.ModTime()); err != nil {
		return err
	}

	return nil
}

// copyFile copies a single file from src to dst
func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = out.ReadFrom(in)
	return err
}
