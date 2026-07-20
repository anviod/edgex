---
layout: default
title: BACnet 驱动开发最佳实践
description: BACnet/IP 驱动开发、部署、测试的最佳实践指南
---

# BACnet 驱动开发最佳实践

> **最后更新**: 2026-07-20
> **依赖版本**: `github.com/anviod/bacnet@v0.0.6+`

## 一、设备发现（Yabe 风格）

### 1.1 核心原则

**使用 Yabe 三步法，拒绝复杂化**：

```
Step 1: 绑定 INADDR_ANY → Step 2: 广播 WhoIs(Low:0, High:0) → Step 3: 收集 IAm + 富化名称
```

### 1.2 实现代码

```go
// Step 1: 绑定所有网卡，使用标准发现端口
cb := &bacnetlib.ClientBuilder{
    Ip:         "0.0.0.0",
    Port:       47808,          // 设备只响应此端口的 WhoIs
    SubnetCIDR: 0,
    MaxPDU:     btypes.MaxAPDU,
}
scanClient, err := clientFactory(cb)

// Step 2: 广播 WhoIs，不限制设备 ID 范围
whoisDevices, err := scanClient.WhoIs(&bacnetlib.WhoIsOpts{
    Low:             0,
    High:            0,         // 0 = 无范围限制
    GlobalBroadcast: true,
})

// Step 3: ReadProperty 获取 ObjectName
for _, dev := range whoisDevices {
    name, _ := scanClient.ReadProperty(dev.IP, dev.Port, dev.ID,
        bacnetlib.ObjectTypeDevice, dev.ID, bacnetlib.PropertyObjectName)
}
```

### 1.3 反模式（已废弃）

```go
// ❌ 不要这样做
// 1. 自动检测 IP 后绑定特定接口 → 虚拟网卡会导致广播到错误子网
// 2. 多网卡循环扫描 → 增加复杂度，无实际收益
// 3. 单播 WhoIs (target_ip) → 仅适用于已知设备 IP 的场景
// 4. 全局广播回退 (255.255.255.255) → INADDR_ANY 已覆盖所有子网
```

### 1.4 interface_ip 配置

| 配置值 | 行为 | 适用场景 |
|--------|------|---------|
| `""` 或 `"0.0.0.0"` | 绑定所有物理网卡（推荐） | 通用部署 |
| 指定 IP | 仅在指定网卡发送广播 | 多网段隔离 |

## 二、对象扫描

### 2.1 核心原则

1. 使用独立临时 Client（非复用 driver client），避免阻塞读写操作
2. 读取 ObjectList 属性获取设备对象列表
3. 为每个对象填充类型、名称、可写性等元数据

### 2.2 点位地址格式

所有 BACnet 点位必须使用 `ObjectType:Instance` 格式：

```
AnalogInput:0    → 地址: "AnalogInput:0"
AnalogValue:1    → 地址: "AnalogValue:1"
BinaryValue:0    → 地址: "BinaryValue:0"
MultiStateValue:1 → 地址: "MultiStateValue:1"
```

### 2.3 数据类型推断

| BACnet 对象类型 | 推断 dataType |
|----------------|-------------|
| AnalogInput, AnalogOutput, AnalogValue | float32 |
| BinaryInput, BinaryOutput, BinaryValue | bool |
| MultiStateInput, MultiStateOutput, MultiStateValue | uint16 |

## 三、点位读取

### 3.1 锁优化

```go
// ✅ 正确：锁范围仅限数据查找
func (d *Driver) ReadPoint(ctx context.Context, pointID string) (*model.Value, error) {
    d.mu.RLock()
    pt := d.pointIndex[pointID]
    d.mu.RUnlock()  // 立即释放锁
    // 网络 I/O 在锁外执行
    return d.readProperty(ctx, pt)
}

// ❌ 错误：锁持有期间执行网络 I/O → 阻塞所有其他读写
func (d *Driver) ReadPoint(ctx context.Context, pointID string) (*model.Value, error) {
    d.mu.RLock()
    defer d.mu.RUnlock()
    return d.readProperty(ctx, pt)  // 网络 I/O 可能耗时 3s+
}
```

### 3.2 连接管理

```go
// connectOnce 三步流程
func (d *Driver) connectOnce() error {
    // 1. 加锁关闭旧连接
    d.mu.Lock()
    d.closeClientLocked()
    d.mu.Unlock()
    
    // 2. 解锁创建新连接
    newClient, err := d.createClient()
    
    // 3. 加锁保存新连接
    d.mu.Lock()
    d.client = newClient
    d.mu.Unlock()
    return err
}
```

### 3.3 异步持久化

```go
// saveChannels 在 goroutine 中异步执行，避免阻塞 API 读路径
go func() {
    if err := d.saveChannels(); err != nil {
        log.Warn("channel save failed", zap.Error(err))
    }
}()
```

## 四、点位写入

### 4.1 值类型匹配

| BACnet 对象类型 | 写入值类型 | 示例 |
|----------------|----------|------|
| AnalogValue | float32 / float64 | `25.5` |
| BinaryValue | bool | `true` / `false` |
| MultiStateValue | uint16 / int32 | `3` |

### 4.2 常见错误

```go
// ❌ 错误：发送字符串类型值到 AnalogValue
WriteProperty("AnalogValue:0", "25.5")  // DeviceError code Other

// ✅ 正确：发送匹配类型
WriteProperty("AnalogValue:0", 25.5)    // float32
```

### 4.3 写入验证

- 写入后应通过 ReadProperty 二次验证值是否生效
- 模拟器可能限制某些对象类型的写入（如 BinaryValue、MultiStateValue）
- 写入失败不应影响其他设备的正常轮询

## 五、跨平台注意事项

### 5.1 Windows

```go
// Windows UDP 套接字必须显式启用 SO_BROADCAST
// 否则 WhoIs 广播包会被操作系统静默丢弃
// 此问题在 bacnet v0.0.6+ 中已修复
```

### 5.2 Linux (ARM64)

```go
// 交叉编译配置
// GOOS=linux GOARCH=arm64 CGO_ENABLED=0
// ARM64 无需额外套接字选项
```

### 5.3 同机 UDP 回环问题

Windows 下，当 BACnet 驱动和 Yabe 模拟器运行在同一台机器上时，UDP 回环会导致 Yabe 发出的 ReadPropertyRequest 被自身 Socket 接收。解决方案：使用独立测试工具（如 `test_bacnet_server`）替代 Yabe 进行服务端验证。

## 六、4-Phase 验收流程

| Phase | 验证内容 | 验收标准 | 测试方法 |
|-------|---------|---------|---------|
| Phase 1 | WhoIs 广播 | 4/4 设备发现 | `POST /api/channels/{id}/scan` |
| Phase 2 | 对象扫描 | 4/4 设备成功 | `POST /api/channels/{id}/devices/{deviceId}/scan` |
| Phase 3 | 点位读取 | 全部成功，0 失败 | `GET /api/diagnostics/scan-engine` |
| Phase 4 | 可写点写入 | 可写点 100% 成功 | `POST /api/write` |

### 6.1 测试 Token

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6IiIsImlzcyI6IkluZHVzdHJpYWxFZGdlR2F0ZXdheSIsImV4cCI6MTc4NTE1OTY0MCwibmJmIjoxNzg0NTU0ODQwfQ.qNC2fj4-uxB1pGrE4Pxnk-gBMYsvHu2ysvPQXG7LgdQ"
```

### 6.2 目标设备清单

| 设备 ID | Instance ID | IP | Yabe 模拟器 |
|--------|------------|-----|-----------|
| bacnet-2228316 | 2228316 | 192.168.3.115 | Device 1 |
| bacnet-2228317 | 2228317 | 192.168.3.115 | Device 2 |
| bacnet-2228318 | 2228318 | 192.168.3.115 | Device 3 |
| bacnet-2228319 | 2228319 | 192.168.3.115 | Device 4 |

### 6.3 标准对象清单（每设备）

| 对象 | 类型 | 可写 | 数据类型 |
|------|------|------|---------|
| AnalogInput:0 | Temperature.Indoor | R | float32 |
| AnalogInput:1 | Temperature.Water | R | float32 |
| AnalogInput:2 | Temperature.Outdoor | R | float32 |
| AnalogValue:0 | SetPoint.Value | RW | float32 |
| AnalogValue:1 | Setpoint.1 | RW | float32 |
| AnalogValue:2 | Setpoint.2 | RW | float32 |
| AnalogValue:3 | Setpoint.3 | RW | float32 |
| BinaryValue:0 | State.Heater | RW | bool |
| BinaryValue:1 | State.Chiller | RW | bool |
| MultiStateValue:0 | State | RW | uint16 |
| MultiStateValue:1 | State.VentilationLevel | RW | uint16 |

## 七、相关文档

- [BACnet 设计说明](BACnet_设计说明.md)
- [BACnet API 参考](API_BACnet.md)
- [BACnet 测试文档](BACnet_测试文档.md)
- [BACnet 验收清单](BACnet_Driver_Collection_Test_Acceptance_Checklist.md)
- [BACnet 运维手册](../operations/运维手册_BACnet.md)
- [BACnet Server 北向通道](../../internal/northbound/bacnet/README.md)