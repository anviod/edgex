---
layout: default
title: 分阶段开发路线图
description: EdgeX 工业边缘网关分阶段路线图 — 稳定性闭环、工业验证、性能优化与轻量化可观测
version: v1.0
date: 2026-07-03
status: 现行
---

# 分阶段开发路线图

> **工程铁律：** 任何性能优化不得以牺牲稳定性为代价；任何架构优化不得增加系统恢复复杂度。

本文档定义 EdgeX 的**战略分阶段实施顺序**。各阶段有明确前置条件：**未完成 Phase 1，不得进入 Phase 3 性能优化；不得在稳定性封闭前优化确定性调度。**

> 相关文档：
> - [开发原则与验收标准](DEVELOPMENT_PRINCIPLES.html) — 优先级与量化验收
> - [版本发布门禁](RELEASE_GATE.html) — 每版本四道门禁
> - [开发计划索引](development_plan/index.html) — Q3/Q4 驱动与功能交付跟踪
> - [ScanEngine SLA 评估](TODO/SLA评估.html) — Phase A–D 技术任务拆分

---

## 路线图总览

```text
Phase 1  稳定性闭环（必须完成）──────► ScanEngine 稳定运行时基础
    │
    ▼
Phase 2  工业验证（非新功能）────────► 各协议联机 + 统一测试报告
    │
    ▼
Phase 3  性能优化（稳定性封闭后）────► Pool / 零分配 / 自适应 / GC
    │
    ▼
Phase 4  轻量化与可观测 ─────────────► HTTP/UI/日志诊断，无重型依赖
```

| Phase | 名称 | 性质 | 前置条件 |
| --- | --- | --- | --- |
| **1** | 稳定性闭环 | **必须完成** | — |
| **2** | 工业验证 | 验证为主 | Phase 1 出口 |
| **3** | 性能优化 | 优化 | Phase 1 封闭 |
| **4** | 轻量化与可观测 | 增强 | 可与 Phase 2/3 并行，不削弱 1 |

---

## Phase 1 — 稳定性闭环（必须完成）

**目标：** 建立 ScanEngine **稳定运行时基础**。仅当本阶段完成，ScanEngine 方可视为具备工业现场候选调度能力。

### 1.1 交付物

| 能力 | 说明 | 状态参考 |
| --- | --- | --- |
| Driver Circuit Breaker | 每设备断路器，Open 快速失败 | `circuit_breaker.go` |
| Device Failure Isolation | 单设备故障不拖死同通道其他设备 | 串行/并行隔离测试 |
| Channel Failure Isolation | 单通道故障不扩散全局 | 多通道故障注入 |
| Retry + Cooldown | 失败重试与冷却期 | ScanTask 退避 |
| Adaptive Backoff | 自适应退避与降级 | interval×2、Degraded |
| Fault Recovery Verification | 断连恢复、HalfOpen、自动 Closed | E2E CB 测试 |
| E2E Fault Injection Tests | 故障传播、混合注入、长时 soak | `integration/`、`fault/injector` |

### 1.2 出口标准

- [RELEASE_GATE — G-Stability](RELEASE_GATE.html#g-stability--稳定性门禁) 全部通过
- ScanEngine 诊断可观测 CB、lag、warnings
- **出口声明：** 「ScanEngine 已具备稳定运行时基础」

### 1.3 与 SLA 评估 Phase A 的对应

技术任务细节见 [SLA评估 — Phase A](TODO/SLA评估.html#phase-a--稳定性封闭-已完成待合并主干)。路线图 Phase 1 与 SLA Phase A/B 稳定性部分对齐。

---

## Phase 2 — 工业验证

**性质：** **不是新功能开发**，是对已支持协议的工业级验证。

### 2.1 协议范围

| 协议 | 验证重点 |
| --- | --- |
| Modbus TCP | 多从站、块读、断网恢复 |
| Modbus RTU | 串口抖动、超时、从站离线 |
| OPC UA | 订阅/监控、断线重连、PLC 重启 |
| Siemens S7 | 连接生命周期、读写稳定性 |
| DL/T645 | 表计通信、异常帧 |
| BACnet | 多设备隔离、发现与读写 |

### 2.2 每协议必测场景

| 场景 | 说明 |
| --- | --- |
| 24h / 72h 长跑 | 按协议风险选择时长 |
| 网络断开恢复 | 拔线/防火墙/路由切换 |
| PLC 重启 | 设备侧重启后自动恢复采集 |
| 网络抖动 | 延迟波动、间歇丢包 |
| 超时 | 响应超时与 CB 联动 |
| 高丢包 | 极端网络下的隔离与恢复 |

### 2.3 交付物

- **统一测试报告**（按协议 + 按场景汇总）— 使用 [工业验证测试报告模板](testing/工业验证测试报告模板.html) 填写归档
- 通过 [G-Industrial](RELEASE_GATE.html#g-industrial--工业验证门禁)

---

## Phase 3 — 性能优化

**前置条件：** Phase 1 稳定性**已封闭**。本阶段为优化，不得破坏 Phase 1 隔离与恢复能力。

### 3.1 优化项

| 项 | 说明 |
| --- | --- |
| Object Pool | 热路径对象复用（如 scan point / shadow slice） |
| Zero Allocation | 调度热路径零分配 |
| Adaptive Batch | 自适应批量读 |
| Adaptive Scan Interval | 按设备画像动态间隔 |
| RTT Learning | EWMA RTT → 超时与 throttle |
| MTU Learning | 批量包大小探测 |
| GC Optimization | GC 监控与反压联动 |

### 3.2 约束

- 每项优化须通过 **G-Performance** 与稳定性回归
- **不得**为性能取消 CB、串行队列或单一 ConnectionManager 恢复路径
- **不得**在 Phase 1 未完成时推进确定性调度（EDF / hard jitter）作为上线承诺

### 3.3 工业定位说明

工业边缘网关以 **统计 SLA** 为 sufficient：

- P95/P99 Scan Lag、慢设备隔离、长时稳定、自动恢复
- 不将「scan interval 硬实时上限」作为 Phase 3 必达项（属长期可选，见 SLA Phase D）

---

## Phase 4 — 轻量化与可观测

**目标：** 在不引入重量级监控依赖的前提下，满足现场运维与 SLA 巡检。

### 4.1 交付物

| 能力 | 说明 |
| --- | --- |
| HTTP Diagnostics | `GET /diagnostics/scan-engine` 等 JSON 端点 |
| JSON Diagnostics | 设备/通道/SLA warnings 结构化输出 |
| Web Dashboard | UI 轮询 diagnostics、通道监控 |
| Rolling Log | 结构化日志 + 通道 Event Log |
| Health API | 健康检查与 SLA 告警列表 |

### 4.2 约束

- 避免 Prometheus/Grafana/外部 TSDB 等**强制依赖**
- 诊断能力须满足 [G-Lightweight](RELEASE_GATE.html#g-lightweight--轻量化门禁)

---

## 与 Q3/Q4 开发计划的关系

| 路线图 Phase | 开发计划 / SLA 对应 |
| --- | --- |
| Phase 1 | ScanEngine 重构已落地；CB/隔离/E2E 收尾 → SLA Phase A |
| Phase 2 | [联机测试方案](TODO/联机测试方案.html)、各驱动现场验收 |
| Phase 3 | RTT/MTU/Gap 闭环、10k benchmark、GC gate → SLA Phase B/C |
| Phase 4 | diagnostics UI、Event Log、Health API → SLA Phase C |

具体驱动交付（ICE104 M2、libp2p 同步等）见 [development_plan/index](development_plan/index.html)，**不得抢占 Phase 1 稳定性优先级**。

---

## 当前建议焦点（2026 Q3）

1. **封闭 Phase 1**：E2E 故障注入 + soak + 合并主干 CI 全绿
2. **启动 Phase 2 队列**：Modbus / OPC UA / S7 联机报告优先
3. **Phase 3 仅做已通过 gate 的优化**：Object Pool、zero-alloc 热路径
4. **Phase 4 与运维并行**：diagnostics UI、sla_warnings 日志联动

---

## 当前状态（2026-07）

> Q3 任务分解见 [Q3 采集优化方案]([TODO]边缘计算南向采集优化方案2026第三季度.html)。

### 主体交付完成

EdgeX **调度驱动南向采集内核**主体已交付：

```text
ScanEngine 统一调度 → ExecutionLayer 硬隔离/背压 → Driver 纯执行
    → ShadowCore 运行时快照 → ShadowBridge/Pipeline 扇出 → WebSocket/REST 读影子
```

工业网关骨架已具备：多协议、防饿死、背压、ConnectionManager 统一重连（Modbus/DLT645 等已迁移）。

与 [架构总览 Phase 1](edge/边缘网关架构设计总览.html#phase-1--统一数据面p0-largely-)（统一数据面）一致：**largely ✅**。

### 与 Kepware 级工业标准的核心差距

| # | 差距 | 关联 Phase / 包 |
|---|------|-----------------|
| 1 | **画像与读路径未闭环** — RTT/MTU/Gap 未驱动 ExecutionLayer 块读分片 | Phase 3 · Q3-B |
| 2 | **部分 Driver 重连待迁移** — OpcUa/ENIP 尚未完全接入 ConnectionManager single-flight | Phase 1 连接 Owner |
| 3 | **Scan Class 与可观测 SLA** — 代码已支持多 Class，产品化与调度指标验收仍在 Q3 | Phase 2 · Q3-A/B |
| 4 | **四阶段灰度运维验证** — 熔断、72h 长跑、DRY_RUN 双跑等待生产确认 | ScanEngine 重构方案 §9 |

**稳定性优先**：Q3 性能项（块读、RTT 闭环、万 Tag 压测）在 Phase A 数据面稳定与 Phase B 调度 SLA 基线之上推进，不跳过发布门禁。详见 [SLA 评估](TODO/SLA评估.html)。

### Q3 最高优先级

| 序 | 项 | 说明 |
|----|-----|------|
| 1 | **Q3-B** Gap → Modbus 读路径 | ExecutionLayer 读前分片，画像消费闭环 |
| 2 | ScanEngine → RTT 画像闭环 | Execute 后 `UpdateDeviceRTT`，驱动动态超时 |
| 3 | 万 Tag 压测 | 1w Tag 基线报告（`docs/testing/Q3_10k_tag_benchmark_2026Q3.md`） |
| 4 | OpcUa 重连统一 | 接入 ConnectionManager single-flight |
