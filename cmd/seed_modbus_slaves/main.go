// 向 Modbus 通道批量添加 7 台从站设备（slave_id 1-7，保持寄存器 0-199，功能码 0x03）。
//
// 用法（网关停止时写入数据库）:
//
//	go run ./cmd/seed_modbus_slaves/ -db data
//	go run ./cmd/seed_modbus_slaves/ -db data -channel modbus-tcp-1
package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/anviod/edgex/internal/config"
	"github.com/anviod/edgex/internal/model"
	"github.com/anviod/edgex/internal/storage"
)

func main() {
	dbPath := flag.String("db", "data", "data directory containing config.db and runtime.db")
	channelID := flag.String("channel", "", "target modbus channel id (default: first modbus-tcp channel)")
	interval := flag.String("interval", "1s", "device scan interval")
	flag.Parse()

	if _, err := os.Stat(*dbPath); err != nil {
		fmt.Fprintf(os.Stderr, "database not found: %s\n", err)
		os.Exit(1)
	}

	store, err := storage.NewStorage(*dbPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "open db: %v\n", err)
		os.Exit(1)
	}
	defer store.Close()

	cfgManager, err := config.NewConfigManagerWithDB("conf", store.GetConfigDB())
	if err != nil {
		fmt.Fprintf(os.Stderr, "load config: %v\n", err)
		os.Exit(1)
	}

	cfg := cfgManager.GetConfig()
	if len(cfg.Channels) == 0 {
		fmt.Fprintln(os.Stderr, "no channels in database; create a modbus-tcp channel first")
		os.Exit(1)
	}

	targetIdx := -1
	if *channelID != "" {
		for i, ch := range cfg.Channels {
			if ch.ID == *channelID {
				targetIdx = i
				break
			}
		}
		if targetIdx < 0 {
			fmt.Fprintf(os.Stderr, "channel %q not found\n", *channelID)
			os.Exit(1)
		}
	} else {
		for i, ch := range cfg.Channels {
			if ch.Protocol == "modbus-tcp" || ch.Protocol == "modbus-rtu" || ch.Protocol == "modbus-rtu-over-tcp" {
				targetIdx = i
				break
			}
		}
		if targetIdx < 0 {
			fmt.Fprintln(os.Stderr, "no modbus channel found; use -channel to specify")
			os.Exit(1)
		}
	}

	ch := &cfg.Channels[targetIdx]
	if ch.Protocol != "modbus-tcp" && ch.Protocol != "modbus-rtu" && ch.Protocol != "modbus-rtu-over-tcp" {
		fmt.Fprintf(os.Stderr, "channel %q protocol is %q, not modbus\n", ch.ID, ch.Protocol)
		os.Exit(1)
	}

	existing := make(map[string]struct{}, len(ch.Devices))
	for _, d := range ch.Devices {
		existing[d.ID] = struct{}{}
		if sid, ok := d.Config["slave_id"]; ok {
			existing[fmt.Sprintf("slave:%v", sid)] = struct{}{}
		}
	}

	d, err := time.ParseDuration(*interval)
	if err != nil {
		fmt.Fprintf(os.Stderr, "invalid interval: %v\n", err)
		os.Exit(1)
	}
	scanInterval := model.Duration(d)

	added := 0
	for slaveID := 1; slaveID <= 7; slaveID++ {
		devID := fmt.Sprintf("modbus-slave-%d", slaveID)
		if _, ok := existing[devID]; ok {
			fmt.Printf("skip existing device %s\n", devID)
			continue
		}
		if _, ok := existing[fmt.Sprintf("slave:%d", slaveID)]; ok {
			fmt.Printf("skip existing slave_id %d\n", slaveID)
			continue
		}

		dev := model.Device{
			ID:       devID,
			Name:     fmt.Sprintf("Modbus 从站 %d", slaveID),
			Enable:   true,
			Interval: scanInterval,
			Config: map[string]any{
				"slave_id":              slaveID,
				"auto_points_range":     "0-199",
				"auto_points_datatype":  "int16",
				"auto_points_readwrite": "R",
			},
		}
		generateHoldingPoints(&dev, 0, 199)
		ch.Devices = append(ch.Devices, dev)
		added++
		fmt.Printf("added device %s (slave_id=%d, points=%d)\n", devID, slaveID, len(dev.Points))
	}

	if added == 0 {
		fmt.Println("nothing to add")
		return
	}

	if err := cfgManager.SaveConfig(cfg); err != nil {
		fmt.Fprintf(os.Stderr, "save config: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("done: %d device(s) added to channel %q (%s)\n", added, ch.ID, ch.Name)
}

func generateHoldingPoints(dev *model.Device, start, end int) {
	points := make([]model.Point, 0, end-start+1)
	for addr := start; addr <= end; addr++ {
		points = append(points, model.Point{
			Name:         fmt.Sprintf("HR %d", addr),
			ID:           fmt.Sprintf("hr_%d", addr),
			Address:      strconv.Itoa(addr),
			DataType:     "int16",
			ReadWrite:    "R",
			Scale:        1,
			Offset:       0,
			RegisterType: model.RegHolding,
			FunctionCode: 3,
			DeviceID:     dev.ID,
		})
	}
	dev.Points = points
}
