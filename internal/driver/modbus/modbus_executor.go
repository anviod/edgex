package modbus

import (
	"context"
	"time"

	"github.com/anviod/edgex/internal/core"
	"github.com/anviod/edgex/internal/driver"
	"github.com/anviod/edgex/internal/model"
	"go.uber.org/zap"
)

func init() {
	driver.RegisterDriver("modbus-tcp", NewModbusExecutor)
	driver.RegisterDriver("modbus-rtu", NewModbusExecutor)
	driver.RegisterDriver("modbus-rtu-over-tcp", NewModbusExecutor)
}

type ModbusExecutor struct {
	config              model.DriverConfig
	transport           *ModbusTransport
	scheduler           *PointScheduler
	connController      *core.ConnectionController
	slaveID             uint8
	connectionStartTime time.Time
	reconnectCount      int64
	lastDisconnectTime  time.Time
}

func NewModbusExecutor() driver.Driver {
	return &ModbusExecutor{}
}

func (d *ModbusExecutor) Init(cfg model.DriverConfig) error {
	d.config = cfg

	d.slaveID = 1
	if v, ok := cfg.Config["slave_id"]; ok {
		switch val := v.(type) {
		case int:
			d.slaveID = uint8(val)
		case float64:
			d.slaveID = uint8(val)
		}
	}

	byteOrder4 := "ABCD"
	if v, ok := cfg.Config["byteOrder"]; ok {
		byteOrder4 = v.(string)
	}

	startAddress := 0
	if v, ok := cfg.Config["startAddress"]; ok {
		switch val := v.(type) {
		case int:
			startAddress = val
		case float64:
			startAddress = int(val)
		}
	}

	addressBase := uint16(0)
	if v, ok := cfg.Config["start_address"]; ok {
		switch val := v.(type) {
		case int:
			addressBase = uint16(val)
		case float64:
			addressBase = uint16(val)
		}
	} else if v, ok := cfg.Config["address_base"]; ok {
		switch val := v.(type) {
		case int:
			addressBase = uint16(val)
		case float64:
			addressBase = uint16(val)
		}
	}

	d.transport = NewModbusTransport(cfg)

	if mc := model.GetGlobalMetricsCollector(); mc != nil {
		d.transport.SetMetricsRecorder(mc, cfg.ChannelID)
	}

	d.transport.SetUnitID(d.slaveID)

	decoder := NewPointDecoder(byteOrder4, startAddress, addressBase)

	if v, ok := cfg.Config["use_dataformat_decoder"]; ok {
		switch val := v.(type) {
		case bool:
			decoder.EnableDataformatDecoder(val)
		case string:
			if val == "true" || val == "1" {
				decoder.EnableDataformatDecoder(true)
			}
		}
	}

	batchSize := uint16(120)
	if v, ok := cfg.Config["batchSize"]; ok {
		switch val := v.(type) {
		case int:
			batchSize = uint16(val)
		case float64:
			batchSize = uint16(val)
		}
	}

	instructionInterval := 10 * time.Millisecond
	if v, ok := cfg.Config["instructionInterval"]; ok {
		switch val := v.(type) {
		case int:
			instructionInterval = time.Duration(val) * time.Millisecond
		case float64:
			instructionInterval = time.Duration(val) * time.Millisecond
		}
	}

	d.scheduler = NewPointScheduler(d.transport, decoder, 125, batchSize, instructionInterval)
	d.scheduler.SetSlaveID(d.slaveID)

	d.connController = core.NewConnectionController("modbus-executor", cfg.ChannelID, cfg.Protocol)

	zap.L().Info("[ModbusExecutor] 初始化完成",
		zap.String("channelID", cfg.ChannelID),
		zap.String("protocol", cfg.Protocol),
		zap.Uint8("slaveID", d.slaveID),
	)

	return nil
}

func (d *ModbusExecutor) Connect(ctx context.Context) error {
	d.connectionStartTime = time.Now()
	d.reconnectCount++

	err := d.transport.Connect(ctx)
	if err != nil {
		d.connController.RecordConnectionFailure()
		return err
	}

	d.connController.RecordConnectionSuccess()
	return nil
}

func (d *ModbusExecutor) Disconnect() error {
	d.lastDisconnectTime = time.Now()
	return d.transport.Disconnect()
}

func (d *ModbusExecutor) Health() driver.HealthStatus {
	if d.transport.IsConnected() {
		return driver.HealthStatusGood
	}

	if d.connController.GetState() == core.ConnStateDead {
		return driver.HealthStatusBad
	}

	return driver.HealthStatusUnknown
}

func (d *ModbusExecutor) ReadPoints(ctx context.Context, points []model.Point) (map[string]model.Value, error) {
	if len(points) == 0 {
		return make(map[string]model.Value), nil
	}

	if !d.transport.IsConnected() {
		canRetry, waitTime := planTransportReconnect(d.connController)
		if !canRetry {
			zap.L().Warn("[ModbusExecutor] 连接不可用且不允许重试",
				zap.String("channelID", d.config.ChannelID),
			)
			return nil, core.ErrConnectionUnavailable
		}

		if waitTime > 0 {
			select {
			case <-time.After(waitTime):
			case <-ctx.Done():
				return nil, ctx.Err()
			}
		}

		if err := d.Connect(ctx); err != nil {
			d.connController.RecordConnectionFailure()
			return nil, err
		}
	}

	results, err := d.scheduler.Read(ctx, points)

	if err != nil {
		if d.connController.IsConnectionFailure(err) {
			zap.L().Warn("[ModbusExecutor] 连接失败",
				zap.String("channelID", d.config.ChannelID),
				zap.Error(err),
			)
			d.connController.RecordConnectionFailure()
			return results, err
		}

		if d.connController.IsReadFailure(err) {
			zap.L().Debug("[ModbusExecutor] 读取失败",
				zap.String("channelID", d.config.ChannelID),
				zap.Error(err),
			)
			d.connController.RecordReadFailure()
			return results, err
		}

		d.connController.RecordReadFailure()
		return results, err
	}

	d.connController.RecordReadSuccess()
	return results, nil
}

func (d *ModbusExecutor) WritePoint(ctx context.Context, point model.Point, value any) error {
	if !d.transport.IsConnected() {
		if err := d.Connect(ctx); err != nil {
			d.connController.RecordConnectionFailure()
			return err
		}
	}

	err := d.scheduler.Write(ctx, point, value)
	if err != nil {
		if d.connController.IsConnectionFailure(err) {
			d.connController.RecordConnectionFailure()
		} else {
			d.connController.RecordReadFailure()
		}
		return err
	}

	d.connController.RecordReadSuccess()
	return nil
}

func (d *ModbusExecutor) SetSlaveID(slaveID uint8) error {
	d.slaveID = slaveID
	d.transport.SetUnitID(slaveID)
	if d.scheduler != nil {
		d.scheduler.SetSlaveID(slaveID)
	}
	return nil
}

func (d *ModbusExecutor) SetDeviceConfig(config map[string]any) error {
	if v, ok := config["slave_id"]; ok {
		switch val := v.(type) {
		case int:
			d.slaveID = uint8(val)
		case float64:
			d.slaveID = uint8(val)
		}
		d.transport.SetUnitID(d.slaveID)
		if d.scheduler != nil {
			d.scheduler.SetSlaveID(d.slaveID)
		}
	}

	if d.scheduler != nil {
		applySchedulerIOConfig(d.scheduler, config)
	}

	return nil
}

func (d *ModbusExecutor) GetConnectionMetrics() (connectionSeconds int64, reconnectCount int64, localAddr string, remoteAddr string, lastDisconnectTime time.Time) {
	if d.transport != nil {
		return d.transport.GetConnectionMetrics()
	}
	return 0, 0, "", "", time.Time{}
}

func (d *ModbusExecutor) GetMetrics() model.ChannelMetrics {
	connSec, reconCount, localAddr, remoteAddr, lastDisc := d.GetConnectionMetrics()

	totalRequests := int64(0)
	successCount := int64(0)
	failureCount := int64(0)

	if d.scheduler != nil {
		d.scheduler.mu.Lock()
		totalRequests = d.scheduler.txTotal
		successCount = d.scheduler.rxTotal
		failureCount = d.scheduler.errorsTotal
		d.scheduler.mu.Unlock()
	}

	successRate := 0.0
	if totalRequests > 0 {
		successRate = float64(successCount) / float64(totalRequests)
	}

	return model.ChannelMetrics{
		QualityScore:       d.calculateQualityScore(),
		Protocol:           "Modbus",
		SuccessRate:        successRate,
		TimeoutCount:       failureCount,
		CrcErrorRate:       0,
		RetryRate:          0,
		TotalRequests:      totalRequests,
		SuccessCount:       successCount,
		FailureCount:       failureCount,
		PacketLoss:         1.0 - successRate,
		ReconnectCount:     reconCount,
		ConnectionSeconds:  connSec,
		LocalAddr:          localAddr,
		RemoteAddr:         remoteAddr,
		LastDisconnectTime: lastDisc,
		Timestamp:          time.Now(),
	}
}

func (d *ModbusExecutor) calculateQualityScore() int {
	if d.transport == nil || !d.transport.IsConnected() {
		return 0
	}

	score := 70
	if d.connController != nil && d.connController.GetState() == core.ConnStateDead {
		return 0
	}

	if d.scheduler != nil {
		d.scheduler.mu.Lock()
		total := d.scheduler.txTotal
		success := d.scheduler.rxTotal
		d.scheduler.mu.Unlock()

		if total > 0 {
			rate := float64(success) / float64(total)
			if rate > 0.95 {
				score += 20
			} else if rate > 0.90 {
				score += 10
			} else if rate < 0.80 {
				score -= 10
			}
		}
	}

	if score < 0 {
		score = 0
	} else if score > 100 {
		score = 100
	}
	return score
}
