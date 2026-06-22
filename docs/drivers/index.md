---
layout: default
title: 设备驱动
description: EdgeX 设备驱动文档
---

# 设备驱动

本章节汇总所有南向采集驱动的设计文档、测试报告、优化方案和故障分析。

## 目录

### BACnet
- [BACnet 设计说明](BACnet_设计说明.md)
- [BACnet 驱动采集测试验收清单](BACnet_Driver_Collection_Test_Acceptance_Checklist.md)
- [BACnet 故障隔离报告](BACnet_Fault_Isolation_Report.md)
- [BACnet 前端功能清单](BACnet_Frontend_UI_Functionality_Checklist.md)
- [BACnet 前端需求](BACnet_Frontend_UI_Requirements.md)
- [BACnet 多设备隔离测试计划](BACnet_Multi_Device_Isolation_Test_Plan.md)
- [BACnet 点位串流 bug](BACnet点位串流bug.md)

### Modbus
- [Modbus 优化](MODBUS_OPTIMIZATION.md)
- [Modbus 优化最终报告](MODBUS_OPTIMIZATION_FINAL.md)
- [Modbus 优化报告](MODBUS_OPTIMIZATION_REPORT.md)
- [Modbus 心跳优化](MODBUS_HEARTBEAT_OPTIMIZATION.md)
- [Modbus 智能探测](Modbus智能探测.md)
- [边缘网关 Modbus 优化](边缘网关Modbus优化.md)

### OPC UA
- [OPC UA 设计](OPC_UA_Design.md)
- [OPC UA 服务端功能](OPC-UA_Server_Functionality.md)
- [OPC UA UI 审查](OPC_UA_UI审查.md)

### S7 协议
- [S7 协议](PLC_S7.md)
- [S7 连接生命周期系统](S7_Connection_Lifecycle.md)

### EtherNet/IP
- [EtherNet/IP 真实通信实现方案](EtherNet_IP驱动真实通信实现方案.md)

### 其他驱动
- [API BACnet](API_BACnet.md)

---

## 最新改动说明

### 连接管理系统升级 (2026年6月)

### 1. 公共连接管理器 (ConnectionManager)

**核心特性**:
- 统一连接状态机：`Disconnected → Connecting → Connected → Retrying → Dead`
- 指数退避算法：`backoff = min(base_delay × 2^retry_count, max_delay) + jitter`
- 冷却期策略：基础冷却 1 分钟，指数增长，最大 1 小时
- 每日清零机制：每日零点自动重置重试计数与冷却次数
- 零内存分配：核心路径无额外内存分配

**位置**: `internal/driver/connection_manager.go`

**适用驱动**: S7、Modbus、EtherNet/IP、OPC UA

### 2. 采集健康检测（取消独立心跳）

**设计理念**:
> 采集成功 = 连接健康
> 采集失败 = 连接异常
> 连续失败达到阈值 → 触发状态变更

**各驱动阈值配置**:

| 驱动/型号 | 最大失败次数 | 默认采集周期 | 说明 |
| :--- | :--- | :--- | :--- |
| **S7-200Smart** | 3 次 | 60 秒 | 弱 PLC，保护设备 |
| **S7-1200/1500** | 5 次 | 10 秒 | 标准 PLC |
| **Modbus** | 5 次 | 可配置 | 通用设置 |
| **EtherNet/IP** | 5 次 | 可配置 | Rockwell 系列 |
| **OPC UA** | 5 次 | 订阅回调触发 | 订阅数据质量判断 |

### 3. 低频采集补偿探测

**触发条件**: 当采集周期超过 3 倍时，自动触发轻量探测请求

**实现机制**:
- S7：读取 M 区 1 字节轻量请求
- Modbus：读取单个寄存器
- EtherNet/IP：读取单个 Tag
- OPC UA：读取 ServerStatus 节点

### 4. BACnet 半开探测逻辑

**优化点**:
- 冷却期结束后自动探测设备是否恢复
- 探测成功：发送 WhoIs 轻量请求
- 成功 → 清除隔离状态，恢复正常采集
- 失败 → 延长冷却期（指数增长）

### 5. 各驱动差异化策略差异

#### S7 驱动

| PLC 型号 | 最大重试次数 | 最大失败次数 | 采集周期 |
| :--- | :--- | :--- | :--- |
| **S7-200Smart** | 8 次 | 3 次 | ≥ 10 秒（默认 60 秒） |
| **S7-1200/1500** | 64 次 | 5 次 | 1~5 秒（默认 10 秒） |

#### Modbus 驱动
- 智能 MTU 探测
- 非法数据地址 24 小时长冷却
- TCP 链路深度监控

#### EtherNet/IP 驱动
- ControlLogix、CompactLogix、Micro800、SLC 500、PLC-5 全系列支持
- 基于真实 TCP 通信
- Tag 地址格式批量读取

#### OPC UA 驱动
- 订阅回调集成健康检测
- 数据质量判断连接状态
- 断线自动重连

### 6. 技术架构

**指数退避算法**:
```
backoff_time = min(base_delay × (2^retry_count), max_delay) + jitter
base_delay = 100ms
max_delay = 30s
jitter = 0~50ms
```

**冷却期策略**:
- 第 1 次冷却期：1 分钟
- 第 2 次冷却期：2 分钟
- 第 3 次冷却期：4 分钟
- 第 4 次冷却期：8 分钟
- 第 5 次及以上：1 小时

**每日清零**:
- 每日零点自动重置
- 重试计数清零
- 冷却次数重置为 0

### 7. 并发安全

- 使用互斥锁保护状态
- 原子操作计数器
- 线程安全的状态转换

---

## 驱动支持矩阵

| 协议 | 状态 | 连接管理 | 采集检测 | 低频探测 | 半开探测 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Modbus TCP/RTU** | ✅ 已实现 | ✅ ConnectionManager | ✅ 采集驱动检测 | ✅ 自动补偿 | ✅ 半开探测 |
| **BACnet IP** | ✅ 已实现 | ✅ 故障隔离机制 | ✅ 采集成功判断 | ⚠️ 部分支持 | ✅ 半开探测 |
| **OPC UA** | ✅ 已实现 | ✅ ConnectionManager | ✅ 订阅回调检测 | ✅ 自动补偿 | ✅ 半开探测 |
| **S7** | ✅ 已实现 | ✅ ConnectionManager | ✅ 采集驱动检测 | ✅ 自动补偿 | ✅ 半开探测 |
| **EtherNet/IP** | ✅ 已实现 | ✅ ConnectionManager | ✅ 采集驱动检测 | ✅ 自动补偿 | ✅ 半开探测 |

---

## 相关文档

- [开发计划](../development_plan/index.html) - 待开发驱动规划
- [架构设计](../architecture/index.html) - 系统架构设计
- [测试验证](../testing/index.html) - 测试方案报告
