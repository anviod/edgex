---
layout: section-index
title: 开发计划
description: EdgeX 开发计划与路线图 — Q3/Q4 驱动交付、ScanEngine、ShadowCore、多节点同步
hero_eyebrow: Roadmap & Planning
hero_lead: EdgeX 项目开发规划、路线图与待实现功能 — 驱动扩展、ScanEngine 采集优化、ShadowCore 影子设备与多节点同步通信。
hero_buttons:
  - text: 返回首页
    url: ../index.html
    style: primary
  - text: 驱动总览
    url: ../drivers/index.html
    style: secondary
  - text: 架构设计
    url: ../architecture/index.html
    style: secondary
---

## 路线图总览

### 已交付

#### 驱动支持
- **Modbus TCP/RTU**: 完整支持，智能 MTU 探测与指数退避
- **BACnet IP**: 设备发现、对象扫描、点位读写、半开探测
- **OPC UA 客户端**: 订阅与监控，断线自动重连
- **Siemens S7**: S7-200Smart/1200/1500/300/400 全系列
- **EtherNet/IP (ODVA)**: Rockwell PLC 全系列支持
- **Omron FINS TCP/UDP**: CIO/D/W/H/EM 区域批量读写
- **SNMP v2c/v3**: Community / USM 认证，OID 批量采集
- **IEC 60870-5-104 M1**: 总召唤、自发上报、单点遥控

#### 核心特性
- **ScanEngine 调度驱动内核**（2026-06 已落地）：10ms Tick + PriorityQueue + ExecutionLayer 三路分发
- ConnectionManager 公共连接管理组件（唯一 dial Owner）
- 全驱动采集健康检测（取消独立心跳）
- 指数退避 + 冷却期策略 + single-flight 重连
- ShadowCore 影子设备系统 + ShadowBridge → DataPipeline 扇出
- RTT/MTU/Gap 画像模块（ExecutionLayer 读路径闭环 — Q3-B 进行中）

### 进行中

| 模块 | 状态 | 预计完成 | 说明 |
| :--- | :--- | :--- | :--- |
| **DL/T 645-2007** | 开发中 | Q3 2026 | 多功能电能表通信协议 |
| **ScanEngine 采集优化** | Q3 收尾 | Q3 2026 | 内核已落地；RTT→读分片闭环、熔断、灰度运维验证 |
| **ShadowCore 增强** | 进行中 | Q3 2026 | 虚拟影子、跨通道聚合 |
| **多节点同步通信** | 预研中 | Q3 2026 | 基于 go-libp2p 的分布式配置同步 |
| **高可用接管** | 预研中 | Q3 2026 | 故障自动接管与租约机制 |
| **IEC 104 M2** | 待启动 | Q4 2026 | 遥调、时钟同步、SOE、双点遥控 |

---

## 目录

### 驱动开发计划
- [DL/T 645-2007 驱动开发](drivers/DL-T-645-2007驱动开发.html)
- [IEC 60870-5-104 驱动开发](drivers/采集驱动ICE104开发.html)
- [Omron FINS TCP 驱动开发](drivers/采集驱动Omron%20FINS%20TCP开发.html)
- [SNMP 驱动开发](drivers/SNMP采集驱动开发.html)

### 多节点同步通信
- [基于 go-libp2p 同步通信规划方案](sync/基于go-libp2p%20同步通信规划方案.html)
- [联机测试方案](sync/联机测试方案.html)

---

## Q3 2026 重点交付

1. **ScanEngine 南向采集优化（内核已交付，Q3 收尾画像闭环）**
   - ScanEngine：10ms Tick、PriorityQueue、防饿死、Scan Class
   - ExecutionLayer：Serial 硬隔离 + Parallel 三层背压
   - RTT 管理器：EWMA 算法动态超时（读路径消费待闭环）
   - MTU 管理器：自动探测最大传输单元
   - Gap 优化器：寄存器 Gap 合并策略 → Modbus 读分片

2. **ShadowCore 影子设备**
   - 统一内部数据模型
   - 纯内存运行时快照
   - 真实/虚拟影子设备支持

3. **DL/T 645-2007 驱动**
   - 电能量采集（有功/无功电能）
   - 需量采集与变量采集
   - 谐波数据与冻结数据支持

4. **多节点同步通信**
   - 基于 go-libp2p 的 P2P 网络
   - 配置自动发现与同步
   - 设备控制权租约机制

---

## 核心特性规划

### 多节点同步通信 (Hybrid Sync Model)

**定位**: 分布式配置与控制权同步系统，而非数据同步系统

**三层一致性模型**:
- **Config 层** → 最终一致 (Eventual Consistency)
- **Ownership 层** → 租约约束 (Lease)
- **Runtime 层** → 单点主控 (Owner Only)

**核心价值**:
- 0 配置运维：节点接入网络自动组网
- 高可用保障：单点故障秒级接管
- 工业协议适配：Exclusive/Shared/Lease 三种访问模式
- 轻量级实现：内存占用 < 50MB，ARMv7 友好

> 详细方案请参考 [基于 go-libp2p 同步通信规划方案](sync/基于go-libp2p%20同步通信规划方案.html)

---

## 项目进度跟踪

### 2026年6月
- [已交付] IEC 104 M1 交付（总召唤、自发上报、遥控）
- [已交付] SNMP v2c/v3 与 Omron FINS 驱动完成
- [已交付] ConnectionManager 公共组件发布
- [已交付] 全驱动采集健康检测集成
- [已交付] CGO-free CI 流水线稳定
- [已交付] **ScanEngine 调度驱动内核**（10ms Tick + ExecutionLayer + 12 协议迁移）
- [进行中] RTT/Gap 读路径闭环、熔断、四阶段灰度运维验证
- [预研中] 多节点同步通信方案设计

### 2026年5月
- [已交付] S7 协议完整支持
- [已交付] 连接生命周期系统构建
- [已交付] 指数退避与冷却期策略

---

## 相关文档

- [驱动总览](../drivers/index.html) — 已支持驱动的完整文档
- [架构设计](../architecture/index.html) — ScanEngine 调度驱动内核与 ShadowCore 设计
- [边缘计算](../edge/index.html) — 边缘计算功能与场景
- [测试验证](../testing/index.html) — 测试方案与验证报告
- [Q3 采集优化方案](../%5BTODO%5D边缘计算南向采集优化方案2026第三季度.html) — ScanEngine 详细规划
