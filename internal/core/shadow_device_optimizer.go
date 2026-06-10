package core

import (
	"log"
	"sync"
	"time"

	"github.com/anviod/edgex/internal/model"
)

// ShadowDeviceOptimizer 影子设备优化器，集成RTT、MTU、Gap优化
type ShadowDeviceOptimizer struct {
	rttManager   *RTTManager
	mtuManager   *MTUManager
	gapOptimizer *GapOptimizer
	mu           sync.RWMutex
}

// NewShadowDeviceOptimizer 创建影子设备优化器
func NewShadowDeviceOptimizer() *ShadowDeviceOptimizer {
	return &ShadowDeviceOptimizer{
		rttManager:   NewRTTManager(),
		mtuManager:   NewMTUManager(),
		gapOptimizer: NewGapOptimizer(),
	}
}

// UpdateDeviceRTT 更新设备RTT并触发相关优化
func (sdo *ShadowDeviceOptimizer) UpdateDeviceRTT(deviceID string, rtt int64) {
	sdo.rttManager.UpdateRTT(deviceID, rtt)

	// 根据RTT更新MTU
	sdo.mtuManager.NegotiateMTU(deviceID, rtt)

	// 获取当前MTU
	mtu := sdo.mtuManager.GetCurrentMTU(deviceID)

	// 根据MTU和RTT更新Gap
	sdo.gapOptimizer.OptimizeGap(deviceID, mtu, rtt)
}

// GetDeviceOptimization 获取设备优化参数
func (sdo *ShadowDeviceOptimizer) GetDeviceOptimization(deviceID string) map[string]interface{} {
	rtt := sdo.rttManager.GetEWMARTT(deviceID)
	mtu := sdo.mtuManager.GetCurrentMTU(deviceID)
	gap := sdo.gapOptimizer.GetCurrentGap(deviceID)

	return map[string]interface{}{
		"rtt": rtt,
		"mtu": mtu,
		"gap": gap,
	}
}

// UpdateShadowDeviceProfile 更新影子设备的通信画像
func (sdo *ShadowDeviceOptimizer) UpdateShadowDeviceProfile(shadowDevice *model.ShadowDevice) {
	if shadowDevice == nil {
		return
	}

	deviceID := shadowDevice.PhysicalDeviceID

	rtt := sdo.rttManager.GetEWMARTT(deviceID)
	mtu := sdo.mtuManager.GetCurrentMTU(deviceID)
	gap := sdo.gapOptimizer.GetCurrentGap(deviceID)

	// 初始化通信画像
	if shadowDevice.CommunicationProfile == nil {
		shadowDevice.CommunicationProfile = &model.DeviceCommunicationProfile{
			DeviceID:        deviceID,
			ChannelID:       shadowDevice.ChannelID,
			ProtocolType:    "", // 需要从设备信息中获取
			LastUpdated:     time.Now(),
			RTTSamples:      []int64{},
			RTTSampleWindow: 20,
			EWMARTT:         rtt,
			CurrentMTU:      mtu,
			MaxMTU:          1500,
			MinMTU:          128,
			CurrentGap:      gap,
			MaxGap:          512,
			GapFillStrategy: 1, // 1: 线性插值
		}
	} else {
		// 更新现有通信画像
		shadowDevice.CommunicationProfile.EWMARTT = rtt
		shadowDevice.CommunicationProfile.CurrentMTU = mtu
		shadowDevice.CommunicationProfile.CurrentGap = gap
		shadowDevice.CommunicationProfile.LastUpdated = time.Now()
	}

	// 添加RTT样本
	rttSamples := sdo.rttManager.GetRTTSamples(deviceID)
	if len(rttSamples) > 0 {
		shadowDevice.CommunicationProfile.RTTSamples = rttSamples
	}
}

// GetRTTManager 获取RTT管理器
func (sdo *ShadowDeviceOptimizer) GetRTTManager() *RTTManager {
	return sdo.rttManager
}

// GetMTUManager 获取MTU管理器
func (sdo *ShadowDeviceOptimizer) GetMTUManager() *MTUManager {
	return sdo.mtuManager
}

// GetGapOptimizer 获取Gap优化器
func (sdo *ShadowDeviceOptimizer) GetGapOptimizer() *GapOptimizer {
	return sdo.gapOptimizer
}

// ClearDeviceData 清除设备数据
func (sdo *ShadowDeviceOptimizer) ClearDeviceData(deviceID string) {
	sdo.rttManager.ClearRTTData(deviceID)
	sdo.mtuManager.ClearMTUData(deviceID)
	sdo.gapOptimizer.ClearGapData(deviceID)
}

// GetAllDevices 获取所有设备的优化数据
func (sdo *ShadowDeviceOptimizer) GetAllDevices() []string {
	// 这里需要实现获取所有设备ID的逻辑
	// 暂时返回空列表
	return []string{}
}

// LogDeviceOptimization 记录设备优化数据
func (sdo *ShadowDeviceOptimizer) LogDeviceOptimization(deviceID string) {
	opts := sdo.GetDeviceOptimization(deviceID)
	log.Printf("Device %s optimization: RTT=%d, MTU=%d, Gap=%d",
		deviceID, opts["rtt"], opts["mtu"], opts["gap"])
}
