---
layout: default
---

# 采集状态机集成指南

> **2026-06 架构更新**：南向采集调度已由 **ScanEngine**（`ExecutionLayer` + `ResourceController`）统一承担；`deviceLoop` / `CollectionScheduler` / `device_manager.go` 已移除。状态裁决经 `ChannelManager.finalizeScanCollect` → `FinalizeCollect`。完整架构见 [架构总览](../edge/边缘网关架构设计总览.html) 与 [状态机 API](../architecture/STATE_MACHINE_API.html)。

## 概述

采集状态机用于管理设备的通信状态、故障恢复和重试策略。在现行架构中，状态机与 **ScanEngine 调度闭环**、**ShadowCore 数据面**协同工作，不再依赖 per-device 采集循环。

## 核心改动

### 1. **node_status.go** - 状态机核心实现

#### 结构体定义
- `DeviceNodeTemplate`: 设备节点表示，包含设备 ID、名称和运行时状态
- `CommunicationManageTemplate`: 通信管理器，管理所有设备节点的状态

#### 状态定义
- `NodeState`: 设备状态枚举
  - `NodeStateOnline` (0): 在线状态 - 设备正常通信
  - `NodeStateUnstable` (1): 不稳定状态 - 设备通信时好时坏
  - `NodeStateOffline` (2): 离线状态 - 设备暂时无法连接
  - `NodeStateQuarantine` (3): 隔离状态 - 设备持续故障

#### 核心方法
- `ShouldCollect()`: 根据设备状态决定是否执行采集
  - Online/Unstable: 始终允许采集
  - Offline/Quarantine: 只有在退避时间过后才允许采集

- `onCollectFail()`: 处理采集失败
  - 3-9 次失败: 进入不稳定状态，5 秒后重试
  - 10 次以上失败: 进入隔离状态，指数退避（最长 5 分钟）

- `onCollectSuccess()`: 处理采集成功
  - 1 次成功即可恢复在线状态
  - 重置失败计数

- `FinalizeCollect()`: 最终裁决
  - Panic 一票否决
  - 无交互视为失败
  - 成功率 ≥30% 判定为成功

### 2. **channel_manager.go** + **ScanEngineAdapter** - 采集与状态集成

#### 集成要点
- `ScanEngineAdapter`: 将通道/设备/点位注册为 `ScanTask`，由 ScanEngine 统一调度
- `finalizeScanCollect()`: ScanEngine 采集回调，将 `ExecuteResult` 转为 `CollectContext` 并调用 `FinalizeCollect`
- `stateManager`: `CommunicationManageTemplate` 实例，在 `AddDevice` 时注册设备节点

#### 数据路径
- **ExecutionLayer** 执行 `Driver.ReadPoints`
- **ShadowCore** 接收批次写入（`WriteShadowDevice`）
- 状态机裁决后，ScanEngine 通过 `updateTaskState` 调整退避与优先级

### 3. **model/types.go** - 数据模型扩展

`Device` 结构体包含 `NodeRuntime` 字段，用于存储设备的运行时状态。

## 工作流程

```
ScanEngine Tick (10ms)
│
├─ processReadyTasks() — 到期 ScanTask 入 ExecutionLayer
│
├─ ExecutionLayer.Execute → Driver.ReadPoints
│
├─ 查询设备状态 (GetNode) — Degraded 任务可跳过
│
├─ ShadowCore.WriteShadowDevice(batch)
│
└─ finalizeScanCollect → FinalizeCollect
   ├─ 评估采集结果（链路级 vs 设备级错误隔离）
   ├─ 更新节点状态 (Online / Unstable / Offline / Quarantine)
   ├─ 设置重试时间 (退避机制)
   └─ ScanEngine updateTaskState（退避 / 优先级）
```

## 采集决策规则

### 状态转换图

```
Online (成功) ←─── Unstable ──→ Offline
  ↓ (3-9次失败)         ↓ (10次以上失败)
Unstable ────────→ Quarantine
```

### 退避策略
- **Unstable 状态**: 5 秒后重试
- **Quarantine 状态**: 指数退避，计算公式：`min(失败次数*1秒, 5分钟)`

### 成功率评估
- **最低成功率要求**: 30%
- 允许部分命令失败，适应工业现场不稳定性
- 部分成功的采集仍然认为是成功

## 使用示例

### 注册设备（经 ChannelManager）

设备通过 ChannelManager CRUD 添加后，`ScanEngineAdapter` 自动注册调度任务；无需手动启动 per-device 循环。

```go
// 通过 API 或配置添加设备后，ScanEngine 自动调度
// 查询状态示例：
state := cm.GetDeviceState("device1")
if state != nil {
    fmt.Printf("设备状态: %v\n", state.State)
    fmt.Printf("失败次数: %d\n", state.FailCount)
    fmt.Printf("下一次重试: %v\n", state.NextRetryTime)
}
```

### 诊断观测

```bash
# ScanEngine 运行时指标
curl http://localhost:8082/diagnostics/scan-engine
```

## 日志监控

采集闭环会输出以下日志信息：
- 调度层：任务入队、退避跳过、优先级调整
- 执行层：成功/失败点数统计
- 状态机：状态转换和重试时间信息

## 性能特性
- **并发安全**: 使用 RWMutex 保护状态访问
- **统一调度**: ScanEngine 替代分散的 per-device 循环，资源可控
- **自适应恢复**: 状态转换自动调整采集策略与任务优先级

## 扩展建议
1. 添加监控指标：采集成功率、状态转换频率（可接入 `/diagnostics/scan-engine`）
2. 实现告警机制：设备长期处于 Quarantine 状态时告警
3. 支持手动干预：允许管理员强制重置设备状态
4. 持久化状态：保存设备状态到数据库，便于重启后恢复

## 相关文档

- [状态机 API 参考](../architecture/STATE_MACHINE_API.html)
- [架构设计总览](../edge/边缘网关架构设计总览.html)
- [产品说明 — 系统架构](../guide/产品说明.html#系统架构)
