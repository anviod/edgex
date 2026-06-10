package core

import (
	"fmt"
	"sort"
	"sync"
	"time"

	"github.com/anviod/edgex/internal/model"
)

// CollectionScheduler 采集调度器
type CollectionScheduler struct {
	deviceAdapterManager *DeviceAdapterManager
	protocolRegistry     *ProtocolAdapterRegistry
	mu                   sync.RWMutex
}

// NewCollectionScheduler 创建采集调度器
func NewCollectionScheduler(deviceAdapterManager *DeviceAdapterManager, protocolRegistry *ProtocolAdapterRegistry) *CollectionScheduler {
	return &CollectionScheduler{
		deviceAdapterManager: deviceAdapterManager,
		protocolRegistry:     protocolRegistry,
	}
}

// ScheduleDevices 调度设备采集
func (s *CollectionScheduler) ScheduleDevices(channels []model.Channel) []model.Device {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var devices []model.Device

	// 收集所有设备
	for _, channel := range channels {
		if !channel.Enable {
			continue
		}

		for _, device := range channel.Devices {
			if device.Enable {
				devices = append(devices, device)
			}
		}
	}

	// 根据设备稳定性评分和采集间隔排序
	sort.Slice(devices, func(i, j int) bool {
		// 先按稳定性评分排序，高评分优先
		adapterI := s.deviceAdapterManager.GetAdapter(devices[i].ID)
		adapterJ := s.deviceAdapterManager.GetAdapter(devices[j].ID)

		profileI, _ := adapterI.GetDeviceProfile(devices[i].ID)
		profileJ, _ := adapterJ.GetDeviceProfile(devices[j].ID)

		if profileI.StabilityScore != profileJ.StabilityScore {
			return profileI.StabilityScore > profileJ.StabilityScore
		}

		// 稳定性评分相同，按采集间隔排序，间隔短的优先
		return time.Duration(devices[i].Interval) < time.Duration(devices[j].Interval)
	})

	return devices
}

// OptimizeBatchRead 优化批量读取
func (s *CollectionScheduler) OptimizeBatchRead(deviceID string, points []model.Point) [][]model.Point {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// 获取设备画像
	adapter := s.deviceAdapterManager.GetAdapter(deviceID)
	profile, err := adapter.GetDeviceProfile(deviceID)
	if err != nil {
		// 如果获取画像失败，使用默认值
		return [][]model.Point{points}
	}

	// 根据Gap值对点位进行分组
	var batches [][]model.Point
	var currentBatch []model.Point
	var lastAddress int

	// 按地址排序点位
	sort.Slice(points, func(i, j int) bool {
		// 假设地址是数字字符串，转换为整数进行排序
		var addrI, addrJ int
		fmt.Sscanf(points[i].Address, "%d", &addrI)
		fmt.Sscanf(points[j].Address, "%d", &addrJ)
		return addrI < addrJ
	})

	for i, point := range points {
		var currentAddress int
		fmt.Sscanf(point.Address, "%d", &currentAddress)

		if i == 0 {
			// 第一个点位，开始新批次
			currentBatch = []model.Point{point}
			lastAddress = currentAddress
		} else {
			// 检查地址间隔是否在Gap范围内
			if currentAddress-lastAddress <= profile.CurrentGap {
				// 间隔在Gap范围内，加入当前批次
				currentBatch = append(currentBatch, point)
			} else {
				// 间隔超过Gap范围，开始新批次
				batches = append(batches, currentBatch)
				currentBatch = []model.Point{point}
			}
			lastAddress = currentAddress
		}
	}

	// 添加最后一个批次
	if len(currentBatch) > 0 {
		batches = append(batches, currentBatch)
	}

	return batches
}

// CalculateOptimalInterval 计算最优采集间隔
func (s *CollectionScheduler) CalculateOptimalInterval(deviceID string) time.Duration {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// 获取设备画像
	adapter := s.deviceAdapterManager.GetAdapter(deviceID)
	profile, err := adapter.GetDeviceProfile(deviceID)
	if err != nil {
		// 如果获取画像失败，返回默认值
		return 10 * time.Second
	}

	// 根据RTT和稳定性评分计算最优间隔
	rtt := profile.EWMARTT
	stability := profile.StabilityScore

	// 基础间隔 = RTT * 10
	baseInterval := time.Duration(rtt*10) * time.Microsecond
	if baseInterval < 1*time.Second {
		baseInterval = 1 * time.Second
	} else if baseInterval > 60*time.Second {
		baseInterval = 60 * time.Second
	}

	// 根据稳定性评分调整间隔
	adjustedInterval := baseInterval
	if stability < 50 {
		// 稳定性低，增加间隔
		adjustedInterval = baseInterval * 2
	} else if stability > 90 {
		// 稳定性高，减少间隔
		adjustedInterval = baseInterval / 2
	}

	// 确保间隔在合理范围内
	if adjustedInterval < 1*time.Second {
		adjustedInterval = 1 * time.Second
	} else if adjustedInterval > 60*time.Second {
		adjustedInterval = 60 * time.Second
	}

	// 更新设备画像
	profile.OptimalInterval = adjustedInterval
	adapter.UpdateDeviceProfile(profile)

	return adjustedInterval
}
