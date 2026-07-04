---
layout: default
---

> **历史文档（2026-01，部分 superseded）**：本文记录多从站 Modbus 初版设计与 `device_manager.go` 时代的实现细节。**2026-06 起**南向采集已由 **ScanEngine** + **ChannelManager** 统一承担；`device_manager.go` / `deviceLoop` 已移除。  
> **现行多从站配置**：三级架构 `channels → devices → points`，同 TCP 通道下为每个 `slave_id` 建独立 Device，由 ScanEngine 调度 `Driver.ReadPoints`（Modbus 驱动内 `SetSlaveID`）。参阅 [三级架构快速入门](QUICK_START_THREE_LEVEL.html)、[集成指南](INTEGRATION_GUIDE.html)、[Modbus 驱动](../drivers/边缘网关Modbus优化.html)、[架构总览](../edge/边缘网关架构设计总览.html)。  
> 下文 `slaves:` 嵌套格式与 `device_manager` 代码片段为**历史参考**，配置请以 [三级架构快速入门](QUICK_START_THREE_LEVEL.html)、[产品说明 — 配置结构](../guide/产品说明.html#配置结构) 或 UI/API `BatchAddModbusSlaves` 为准。

# 多从属设备轮询实现指南

## 概述

本指南说明如何实现在单一 TCP 连接上轮询读取多个 Modbus 从属设备（Slave）。这对于需要与多台从属设备通信的网关应用非常有用。

## 核心特性

- ✅ **共享连接**：多个从属设备使用同一个 TCP 连接
- ✅ **轮询读取**：按顺序依次读取每个从属设备的数据
- ✅ **灵活配置**：支持启用/禁用单个从属设备
- ✅ **批量优化**：每个从属设备内部仍然使用批量读取优化
- ✅ **向后兼容**：原有的单设备配置方式保持不变
- ✅ **状态管理**：集成状态机管理，支持故障恢复

## 配置格式

### 旧格式（单设备模式 - 仍然支持）

```yaml
devices:
  - id: "device-1"
    name: "Single Device"
    protocol: "modbus-tcp"
    interval: 2s
    enable: true
    config:
      url: "tcp://127.0.0.1:502"
      slave_id: 1
    points:
      - id: "p1"
        name: "Temperature"
        address: "40001"
        datatype: "int16"
```

### 新格式（多从属设备模式 - 新增）

```yaml
devices:
  - id: "gateway-1"
    name: "Multi-Slave Gateway"
    protocol: "modbus-tcp"
    interval: 2s
    enable: true
    config:
      url: "tcp://127.0.0.1:502"
      # 注意：不再在 config 中设置 slave_id
    
    # 新增：slaves 数组定义多个从属设备
    slaves:
      - slave_id: 1
        enable: true
        points:
          - id: "p1"
            name: "Temperature"
            address: "40001"
            datatype: "int16"
      
      - slave_id: 6
        enable: true
        points:
          - id: "p2"
            name: "Humidity"
            address: "40002"
            datatype: "int16"
```

## 工作流程

```
轮询周期（interval=2s）
│
├─ 连接设备 (首次)
│
├─ Slave 1 轮询
│  ├─ 设置 Unit ID = 1
│  ├─ 批量读取 points
│  ├─ 解析数据
│  └─ 发送到 Pipeline
│
├─ Slave 6 轮询
│  ├─ 设置 Unit ID = 6
│  ├─ 批量读取 points
│  ├─ 解析数据
│  └─ 发送到 Pipeline
│
└─ 下一轮询周期
```

## 实现细节

### 1. 模型定义（model/types.go）

新增 `SlaveDevice` 结构体：

```go
type SlaveDevice struct {
    SlaveID uint8     // Modbus slave ID
    Points  []Point   // Points for this slave
    Enable  bool      // Whether this slave is enabled
}

type Device struct {
    // ... 现有字段 ...
    Points  []Point        // 单设备模式使用
    Slaves  []SlaveDevice  // 多设备模式使用
}
```

**关键点**：
- `Points` 用于单设备模式（向后兼容）
- `Slaves` 用于多设备模式
- 两者互斥使用

### 2. 驱动接口扩展（driver/interface.go）

新增方法：

```go
type Driver interface {
    // ... 现有方法 ...
    // SetSlaveID 为支持多从属设备的协议设置 slave/unit ID
    SetSlaveID(slaveID uint8) error
}
```

### 3. Modbus 驱动实现（driver/modbus/modbus.go）

#### SetSlaveID 实现

```go
func (d *ModbusDriver) SetSlaveID(slaveID uint8) error {
    if !d.connected || d.client == nil {
        return fmt.Errorf("driver not connected")
    }
    d.client.SetUnitId(slaveID)
    log.Printf("ModbusDriver SetSlaveID: changed to %d", slaveID)
    return nil
}
```

#### 批量读取多 Slave

```go
func (d *ModbusDriver) ReadMultipleSlaves(ctx context.Context, 
    slaves []model.SlaveDevice, deviceID string) (map[string]model.Value, error) {
    // 遍历每个从属设备
    // 为每个 slave 设置 Unit ID
    // 执行批量读取
    // 合并结果
}
```

### 4. 采集调度（现行：ScanEngine + ChannelManager）

> **2026-01 历史实现（已 superseded）**：初版在 `internal/core/device_manager.go` 的 `collect()` / `readPointsForSlave()` 中按 Slave 轮询；该文件已与 per-device `deviceLoop` 一并移除。

**现行路径**：

| 组件 | 路径 | 多从站职责 |
|------|------|------------|
| ChannelManager | `internal/core/channel_manager.go` | 通道/设备 CRUD、驱动生命周期；`BatchAddModbusSlaves` 批量建从站 Device |
| ScanEngine | `internal/core/scan_engine.go` | 按设备 `interval` / Scan Class 调度 `Driver.ReadPoints` |
| Modbus 驱动 | `internal/driver/modbus/modbus.go` | 共享 TCP 连接；`SetSlaveID` 切换 Unit ID；驱动内 `PointScheduler` 批量读 |
| 状态裁决 | `ChannelManager.finalizeScanCollect` | → `FinalizeCollect`（见 [状态机 API](../architecture/STATE_MACHINE_API.html)） |

同通道多从站：每个 Device 配置 `config.slave_id`，ScanEngine 分别注册扫描任务；单 Slave 故障由通道级隔离与状态机处理（见 `channel_slave_isolation_test.go`）。

## 配置示例

### 完整的多 Slave 配置

见 [三级架构快速入门](QUICK_START_THREE_LEVEL.html) 与本文件下方示例；legacy `slaves:` 嵌套见 `test/legacy/config_multi_slave_legacy.yaml`

关键配置点（现行）：
- 在 **Channel** `config` 中定义连接信息（URL）
- 同通道下为每个从站创建独立 **Device**，在 `config.slave_id` 设置 Unit ID
- 每个 Device 有独立的 `interval` 与 `points` 列表，由 ScanEngine 调度

## 性能特性

### 优化

1. **连接复用**：多个 Slave 共享单一 TCP 连接
   - 减少网络开销
   - 降低内存占用
   - 简化连接管理

2. **批量读取**：每个 Slave 内部使用批量读取
   - 每个轮询周期减少 Modbus 请求次数
   - 例如：18 个点位可能只需 2-5 次请求

3. **轮询顺序**：按配置文件中的 Slave 顺序轮询
   - Slave 1 → Slave 6 → Slave 10（如果启用）
   - 可预测的读取模式

### 性能示例

假设配置 3 个 Slave，每个 Slave 18 个点位：

**未优化方式**：
- 每个 Slave 18 次单点请求 × 3 = 54 次请求/周期

**使用本实现**：
- 每个 Slave 2-5 次批量请求 × 3 = 6-15 次请求/周期
- **性能提升**：3.5-9 倍

## 状态管理

### 集成状态机

每个设备（而非单个 Slave）有一个状态：

- **Online**：所有轮询都成功
- **Unstable**：部分轮询失败
- **Quarantine**：连续多次失败

### 故障处理

如果某个 Slave 读取失败：
- 标记该 Slave 的所有点位为 "Bad"
- 继续读取其他 Slave
- 设备总体状态由整体成功率决定

## 扩展功能

### 可选功能1：Slave 级状态管理

```go
type SlaveDevice struct {
    SlaveID   uint8
    Points    []Point
    Enable    bool
    // 可选：独立的状态追踪
    Runtime   *SlaveRuntime
}

type SlaveRuntime struct {
    FailCount     int
    SuccessCount  int
    LastFailTime  time.Time
}
```

### 可选功能2：动态启用/禁用

```go
// 运行时动态启用或禁用某个 Slave
func (dm *DeviceManager) SetSlaveEnabled(deviceID string, slaveID uint8, enabled bool) error {
    // 修改 dev.Slaves[].Enable
}
```

### 可选功能3：优先级读取

```go
// 根据优先级而非配置顺序读取
type SlaveDevice struct {
    SlaveID   uint8
    Points    []Point
    Enable    bool
    Priority  int  // 高优先级先读取
}
```

## 迁移指南

### 从单设备到多 Slave

**步骤 1**：使用新配置格式

```yaml
# 旧格式
devices:
  - id: "gw1"
    config:
      slave_id: 1
    points: [...]

# 新格式
devices:
  - id: "gw1"
    config:
      # 移除 slave_id
    slaves:
      - slave_id: 1
        points: [...]
```

**步骤 2**：重启网关

**步骤 3**：验证数据采集正常

### 兼容性

- ✅ 旧的单设备配置仍然可用
- ✅ 现有代码无需修改
- ✅ 可以在同一配置文件中混用两种格式

## 测试

### 单元测试

```go
// internal/core/channel_slave_isolation_test.go
// internal/integration/modbus_protocol_test.go
// 验证同通道多从站隔离、ScanEngine 调度与 Modbus 驱动 SetSlaveID
```

### 集成测试

```bash
# 通过 UI / BatchAddModbusSlaves API 配置同通道多 slave_id Device（运行时以 data/config.db 为准）

# ScanEngine 日志示例（同 TCP 通道轮询 slave 1、6）
# ScanEngine: device slave-1 slave_id=1 ...
# ScanEngine: device slave-6 slave_id=6 ...
```

## 故障排查

### 问题1：某个 Slave 的数据不更新

**原因**：
- Slave 被禁用（`enable: false`）
- 网络连接中断
- Slave 设备离线

**解决**：
- 检查配置文件中 `enable` 设置
- 查看日志中的错误消息
- 验证硬件连接

### 问题2：数据解析错误（全为 0）

**原因**：
- Scale=0 或配置错误
- 地址越界
- 数据类型错误

**解决**：
- 检查 `datatype` 和 `address` 配置
- 验证 `scale` 和 `offset` 值
- 查看批量读取的字节数据

### 问题3：性能下降

**原因**：
- Slave 太多
- 单个轮询周期的网络延迟
- 批量读取的分组不优化

**解决**：
- 调整 `interval` 时间
- 优化 `max_packet_size` 和 `group_threshold`
- 按需禁用某些 Slave

## 文件变更

| 文件 | 变更 | 说明 |
|------|------|------|
| `internal/model/types.go` | 新增 SlaveDevice 结构体 | 支持多从属设备配置 |
| `internal/driver/interface.go` | 新增 SetSlaveID() 方法 | 通用驱动接口 |
| `internal/driver/modbus/modbus.go` | 新增 SetSlaveID() 和 ReadMultipleSlaves() | Modbus 驱动实现 |
| `internal/core/channel_manager.go` + `scan_engine.go` | 2026-06 起替代 device_manager；多从站经 ScanEngine 调度 | **现行采集路径** |
| ~~`internal/core/device_manager.go`~~ | 2026-01 collect()/readPointsForSlave()（已删除） | 历史 |
| [test/README.md](../../test/README.md) | 文档 | v2 配置参考；legacy 见 `test/legacy/` |

## 总结

这个实现提供了：

1. **清晰的架构**：多 Slave 支持通过配置而非代码更改
2. **高效的资源使用**：连接和批量读取的充分利用
3. **良好的可维护性**：分离关注点，易于扩展
4. **完全的向后兼容性**：现有代码无需修改
5. **灵活的扩展空间**：支持多种高级特性

---

**相关文档（现行）**：
- [三级架构快速入门](QUICK_START_THREE_LEVEL.html)
- [集成指南](INTEGRATION_GUIDE.html)
- [Modbus 驱动](../drivers/边缘网关Modbus优化.html)
- [状态机 API](../architecture/STATE_MACHINE_API.html)
