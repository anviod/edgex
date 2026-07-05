# ScanEngine 重构方案 v5.2 稳定版补丁

> **基线文档**：[ScanEngine重构方案.md](./ScanEngine重构方案.md)（v5.0 / v5.1 P0 已落地）  
> **创建日期**：2026-07-05  
> **定位**：架构评审可执行补丁包——**不重构代码**，仅给出最小变更设计与验收标准  
> **原则**：稳定性优先；消除双重决策与三重串行；统一限流语义

---

## 执行摘要

v5.1 P0 补丁已将 `ConnectionController` 注释层标为只读、`channelMu` 收敛到 `ExecutionLayer.readPoints`、并修复 Connecting 退避与队列软限。评审指出**残余最高风险**在于：（1）`ConnectionController` 仍保留完整 `CanRetry` 状态机与全局限流计数器，与 `driver.ConnectionManager` 形成「影子 Owner」；（2）共享链路上 **SerialQueue worker → channelMu → Transport.mu** 三重 I/O 串行；（3）`BackpressureController` 与 `ProtocolCongestionController` 双桶叠加且准入顺序与文档 §4.4.4 不一致。v5.2 补丁在不改变 ScanEngine 调度闭环的前提下，将上述三点收敛为**单一 Owner、单一链路互斥、单一 Allow() 入口**，并补充自适应 Tick、Driver 无状态铁律、FeedbackAggregator 与三阶段迁移压缩。下文逐项给出**现状 / 风险 / 最小补丁 / 验收标准**。

---

## 评审项 1：ConnectionController + ConnectionManager 双系统

### 现状（文档 + 代码）

| 来源 | 描述 |
|------|------|
| 文档 §5.3.2、§7.6.1 P0.1 | 已声明 `ConnectionController` 为辅助只读模块；dial 仅经 `ConnectionManager.EnsureConnected` / `ScheduleReconnect` |
| `internal/core/connection_controller.go` | 文件头注释为 read-only；仍含完整 `CanRetry()`、`RecordConnectionFailure()` 退避、`tryAcquireGlobalReconnectSlot()`、`AttemptHalfOpen()` |
| `internal/driver/connection_manager.go` | 唯一实际 dial Owner；Transport 层 `Connect`/`scheduleReconnect` 均调用 `connMgr` |
| `internal/driver/modbus/modbus.go` | `connController` 仅用于 `IsConnectionFailure` / `IsReadFailure` / `RecordReadSuccess` / `RecordReadFailure` — **生产路径未调用 `CanRetry`** |
| 全局限流 | `driver` 与 `core` 各维护 `MaxGlobalReconnectRate=10/s` 计数器（文档 §9.3） |

**代码/文档差距**：§9.1 仍写「Connecting 态 CanRetry 仍无退避 ⚠️」，但 P0.2 已通过 `ensureConnectingMinBackoff(200ms)` 修复；§9.1 状态表未同步。`ConnectionController.CanRetry` 虽未被 Driver 调用，仍与 `ConnectionManager.CanRetry` **逻辑重复**，诊断 API 若混用两者会给出矛盾建议。

### 风险

- **高**：两套状态机并行演进，运维/诊断误用 `ConnectionController.CanRetry` 可能绕过 `ConnectionManager` single-flight。
- **中**：双计数器全局限流，风暴场景下行为难以归因。

### 最小补丁

1. **`ConnectionController` 降级为纯观测层**（`connection_controller.go`）  
   - **保留**：`IsConnectionFailure`、`IsReadFailure`、`RecordReadSuccess`、`RecordReadFailure`、`GetStatus`、健康评分字段（新增 `HealthScore() float64` 可选）。  
   - **删除或 `@deprecated`**：`CanRetry`、`RecordConnectionFailure` 的退避副作用、`AttemptHalfOpen` 的状态迁移、`tryAcquireGlobalReconnectSlot` 在 core 包的副本。  
   - **`RecordConnectionFailure`** 改为仅递增 `connectionFailCount` + 日志，返回 `(false, 0)`，**不**修改 `state` 为 Retrying/Dead。

2. **全局限流单例**  
   - 将 `tryAcquireGlobalReconnectSlot` 移至 `internal/driver/reconnect_limiter.go`（或 `connection_manager.go`），仅 `ConnectionManager.EnsureConnected` / `ScheduleReconnect` 调用。

3. **诊断 API 对齐**  
   - `GET /api/diagnostics/...` 连接态只读 `ConnectionManager.GetStatus()`；`ConnectionController` 指标归入 `connection_observability_*` 命名空间。

4. **测试**  
   - 删除或改写 `connection_controller_test.go` 中 `CanRetry` / `GlobalReconnectRateLimit` 用例；新增断言：**无任何 Transport 引用 `core.ConnectionController` 的 dial 路径**。

### 验收标准

- [ ] `grep -r 'connController.CanRetry\|ConnectionController.*EnsureConnected' internal/driver` 无命中  
- [ ] `ConnectionController` 无 `ScheduleReconnect` / dial / 全局限流副作用  
- [ ] Modbus/DLT645 重连指标 100% 来自 `ConnectionManager`  
- [ ] 现有 `go test ./internal/driver/... -run Reconnect` 与 `./internal/core/... -run ConnectionController` 通过（用例随 API 裁剪更新）

---

## 评审项 2：三重序列化（SerialQueue + channelMu + Transport.mu）

### 现状

共享链路协议（modbus-tcp、dlt645 等）执行路径：

```text
executeSerial
  → SerialQueueManager.Submit (shared:{channelID} 单 worker 串行)
    → SerialWorker.run → ReadFunc
      → ExecutionLayer.readPoints
          → channelMu.Lock()          // execution_layer.go:415-417
            → Driver.ReadPoints
              → ModbusTransport.ReadRegisters
                  → withRetry → t.mu.Lock()  // transport.go:601-602
```

| 层级 | 文件 | 作用 |
|------|------|------|
| SerialQueue | `serial_queue_manager.go` + `execution_context.go` | 每 `shared:{channelID}` 一个 goroutine 顺序消费 |
| channelMu | `execution_layer.go` `readPoints` | 共享链路 I/O 互斥；由 `scan_engine_compat.go` 注入 `task.Params` |
| Transport.mu | 各 `transport.go` | Modbus/S7/DLT645 等在 **每次 Read/Write** 持锁 |

文档 §4.4.5、§7.6.1 P0.3 要求 channelMu 仅在 ExecutionLayer 外层；Transport 不持 channelMu — **已满足**。但 Transport.mu 仍包裹 I/O，与 channelMu **功能重叠**。

非共享链路（单 deviceKey 队列）：仅 SerialQueue + Transport.mu 两重。

### 风险

- **高**：共享链路上锁持有时间 = 队列任务串行 × channelMu × Transport.mu，慢从站放大排队延迟，易触发 `serialOuterTimeout`（×16 readTimeout）。  
- **中**：`ScheduleReconnect` 的 `connectOnce` 在 Transport.mu 内（`modbus/transport.go:225-227`），与 channelMu 文档 §5.3.2「I/O 与重连互斥」依赖 implicit 顺序，非单一 mutex 保证。

### 最小补丁

1. **channelMu 为共享链路唯一 I/O 串行控制**  
   - 保持 `readPoints` 外层 `channelMu.Lock()` 不变。  
   - **Transport.mu 语义收窄**：仅保护 `client` 指针、`connected`、地址字段；**Read/Write 方法内不再 Lock mu**（在已持有 channelMu 或单线程队列前提下调用）。  
   - `connectOnce` / `Disconnect` 仍在 mu 内，但须文档化：**重连须在同 channelMu 临界区或 ConnectionManager single-flight 内完成**。

2. **SerialQueue 角色重新定义**  
   - 保留 SerialQueue 作为**有界缓冲 + 背压**（深度 64、90% 软限，`ErrQueueFull`），**不再承担额外互斥**（worker 仍顺序消费，但不与 channelMu 叠加强语义）。  
   - 可选优化：共享链路协议 worker 内不再假设「队列即互斥」，互斥完全交给 channelMu（减少认知负担）。

3. **文档 §4.4.5 更新**  
   - 表格增加一行：**I/O 串行 Owner = channelMu（共享链路）或 SerialQueue（非共享）二选一，禁止 Transport.mu 包裹 I/O**。

### 验收标准

- [ ] 共享链路 Modbus 7 从站场景：`TestSerialQueueKey_UsesChannelForSharedLink`、`channel_slave_isolation_test.go` 仍 PASS  
- [ ] `ModbusTransport.ReadRegisters` 等读路径无 `t.mu.Lock()` 包裹 `client.Read*`（mu 仅用于 Connect/Disconnect）  
- [ ] p99 同通道多从站排队延迟较 v5.1 下降（基准：`scan_engine_circuit_breaker_test.go` 七从站场景）

---

## 评审项 3：Backpressure + ProtocolCongestion 双重限流

### 现状

| 组件 | 文件 | 机制 |
|------|------|------|
| `BackpressureController` | `backpressure_controller.go` | Token Bucket 1000/s → 全局信号量 512 → 单设备信号量（Parallel 8 / Limited 2） |
| `ProtocolCongestionController` | `protocol_congestion.go` | 按协议族独立 Token Bucket（Modbus 1000/s、OPC UA 400/s、S7 300/s…） |

`ExecutionLayer.Execute`（`execution_layer.go:111-123`）准入顺序：

```text
Parallel/Limited: ProtocolCongestion.Allow(protocol) → executeParallel/Limited → Backpressure.Allow(...)
Serial: 两者均 bypass
```

文档 §4.4.4 写 Parallel 路径仅 `BackpressureController.Allow` 三层，**未写 ProtocolCongestion 在前** — 文档与代码不一致。

`BackpressureController` 内含全局 Token Bucket；`ProtocolCongestion` 又按协议分桶 —— **Parallel 协议可能被连续拒绝两次**，且拒绝原因不可区分。

### 风险

- **高**：双重 Token Bucket 导致有效吞吐低于预期，运维难以判断该降 interval 还是拆通道。  
- **中**：Limited 路径 `ProtocolCongestion` → `Backpressure(2)` → `executeSerial` 三层叠加，S7 场景易误杀。

### 最小补丁

1. **合并为统一 `ThrottlingController`**（或扩展 `BackpressureController`）  
   - 单一 `Allow(ctx ThrottleContext) (ok bool, reason RejectReason)` 入口。  
   - **固定顺序**：Global 并发 → Device 并发 → Protocol 速率（protocol **最后**）。  
   - 吸收 `protocol_congestion.go` 的 per-group bucket 为第三层，删除独立 `ProtocolCongestionController` 在 `Execute` 中的前置调用。

2. **`RejectReason` 枚举 + 指标**  
   - `reject_global` / `reject_device` / `reject_protocol` / `reject_token`（若保留全局速率桶）  
   - diagnostics API 暴露 `throttle_reject_by_reason{reason}`

3. **Serial 路径**  
   - 保持 bypass（仅 SerialQueue 深度背压），与现网一致。

详见本文 **「统一 Allow() 伪代码」** 章节。

### 验收标准

- [ ] Parallel/Limited 仅一次 `Allow()` 调用  
- [ ] 拒绝日志/metrics 含 `reject_reason`  
- [ ] `protocol_congestion_test.go` 行为迁移至统一控制器测试  
- [ ] 文档 §4.4.4 准入顺序与代码一致

---

## 评审项 4：10ms Tick 过于激进

### 现状

| 来源 | 描述 |
|------|------|
| `scan_engine.go` `dispatchLoop` | **双驱动**：`nextReadyTime()` 的 `wakeTimer` + **fallback `time.NewTicker(10ms)`** 均调用 `processReadyTasks()` |
| `channel_manager.go` | 默认 `TickInterval: 10ms` |
| `processReadyTasks` | 每次 tick：`popReadyTaskEDF` 循环派发 + `enforceHardJitterClamp` 扫描**全队列** + `enforceAntiStarvation` 扫描**全任务** |
| `AdaptiveThrottle` | 已有队列深度/failRate/RTT 驱动的 interval 放大（max 4×），**不调节 Tick 频率** |

文档 §1.2「时间闭环: 全局10ms Tick」；§9.1 标注已实现。

**差距**：已有 wake-on-next-deadline 优化，但 10ms fallback 在万级任务时仍造成 O(n) 全队列扫描 CPU 开销。

### 风险

- **中高**：高负载下 dispatch goroutine 空转，放大锁竞争（`se.mu`），间接增加 `scan_lag_p95_ms`。

### 最小补丁

**方案 A（推荐，最小侵入）**：自适应 fallback Tick

```go
// scan_engine.go dispatchLoop 伪代码
loadRatio := float64(se.GetPendingTaskCount()) / float64(se.config.MaxQueueSize)
tick := se.config.TickInterval // 默认 10ms
if loadRatio > 0.7 {
    tick = 50 * time.Millisecond
}
fallback.Reset(tick)
```

**方案 B**：Tick 仅维护 **ready-index**（下次唤醒时间 + 堆顶），`processReadyTasks` 只 pop 到期任务，**禁止**每 tick 全量 `enforceAntiStarvation`（改为每 1s 或每 100 tick 一次）。

**方案 C**：两者组合 — A 降频 + B 减扫描。

### 验收标准

- [ ] 10k 任务、50% 就绪时 dispatch CPU 较基线下降 ≥30%（`scan_engine_scale_test.go` 扩展）  
- [ ] `scan_miss_deadline_total` 不劣化于 v5.1  
- [ ] 空闲时仍能在 ≤20ms 内唤醒下一到期任务（wakeTimer 路径）

---

## 评审项 5：Driver 隐式状态

### 现状

文档 §5.1 定义 Driver = Stateless Executor；§9.3 列 Violation：

| 驱动 | 违规 | 位置 |
|------|------|------|
| OpcUaDriver | `go d.reconnect()` / `scheduleReconnect` 无 single-flight | `opcua/opcua.go:540` |
| ENIPTransport | 自定义 `scheduleReconnect` | `ethernetip/transport.go:238` |
| ModbusDriver | `go d.performMTUProbe()` | `modbus/modbus.go:131` |
| BacnetDriver | `go d.client.ClientRun()`、多处 `go checkRecovery` | `bacnet/bacnet.go` |
| 连接态 | 各 Transport 内联 `connected`、`client`、`withRetry` loop | 各 `transport.go` |

Execution 层状态：`ConnectionManager`（连接态）、`ScanTask`（调度态）、`DriverCircuitBreaker`（设备熔断）— **分散**。

### 风险

- **中高**：Driver/Transport 内 goroutine 与 ScanEngine 调度竞争，违反「单一时间 Owner」；隐式状态导致迁移/测试不可重复。

### 最小补丁

1. 将 **「Driver 无状态铁律」** 全文写入规范（见本文专用章节），并在 CI 增加静态检查清单（grep 禁止 `time.NewTicker` in `internal/driver/*/!(test)`）。  
2. 连接态 **唯一 Owner**：`driver.ConnectionManager` per channel；Transport 仅持有 `connMgr` 引用，不维护独立退避循环。  
3. 分驱动迁移表（不改架构，仅排期）：OpcUa / ENIP P0；Bacnet P1；Modbus MTU probe 改为 ScanEngine 一次性 Init 钩子。

### 验收标准

- [ ] 规范 §5.1 替换为 v5.2 铁律全文  
- [ ] 新增驱动合入 Checklist 含「无 goroutine / 无 retry loop / 无独立连接态机」  
- [ ] OpcUa `scheduleReconnect` 迁移至 `ConnectionManager.ScheduleReconnect`（单独 PR，本补丁仅设计）

---

## 评审项 6：迁移阶段 4→3 压缩

### 现状

文档 §2.1 四阶段：并行运行 → 串行灰度 → 并发灰度 → 完全切换。  
§9.2 显示：阶段 1 DRY_RUN **未实现**；阶段 4 旧调度已移除但 30 天 MTBF 未验证；**无协议路由灰度**。

### 风险

- **中**：四阶段中阶段 2/3 均依赖「协议路由分发器」（§2.3.1），代码未实现，阶段边界模糊，运维难以签退出。

### 最小补丁：三阶段映射

| 新阶段 | 名称 | 合并自旧阶段 | 核心交付 | 退出条件 |
|--------|------|-------------|----------|----------|
| **S1** | Shadow Parallel | 旧阶段 1 | ScanEngine DRY_RUN + Shadow 双写校验；旧调度已下线则用 **Shadow 回放/对比** 替代 | 72h 一致性 ≥99.9%；无 dial |
| **S2** | Serial-first Migration | 旧阶段 2 + Limited 协议 | Modbus/DLT645/Omron 等 Serial + S7/Profinet Limited；ConnectionManager 统一重连 | 串行协议 72h 无风暴；`ErrQueueFull`<1% |
| **S3** | Full ScanEngine Ownership | 旧阶段 3 + 4 | Parallel 协议 + 统一 Throttling + FeedbackAggregator；废弃 Driver 内调度 | 全协议 MTBF 30d；诊断 API 完整 |

**S3 代码层状态（2026-07-05）**：✅ **已完成** — BACnet/KNX 驱动 goroutine 迁入 ConnectionManager；基准 `bench-q3`/`bench-g007` PASS。运维退出（30d MTBF、72h 长跑）仍待现场验证。

**删除的独立阶段**：「并发协议灰度」不再单独设门 — 并入 S3，S2 只验证**链路层**（Serial/Limited）。

### 验收标准

- [x] 路线图 / ROADMAP 引用三阶段（主方案 §9.2）
- [ ] 每阶段 ≤5 条可勾选退出条件（运维级）— S3 代码层完成，MTBF/72h 待运维

---

## 评审项 7：FeedbackAggregator（1–5s 聚合）

### 现状

反馈闭环在 `scan_engine.go` `executeTaskAsync` **同步**执行：

```text
Execute → applyCollectToShadow → updateTaskState → rescheduleTask → heap.Push
```

每次采集完成立即调整 priority/interval/failRate，高并发失败时 **feedback storm** 可放大 `AdaptiveThrottle` 振荡。

**代码中不存在** `FeedbackAggregator` 或批处理反馈组件。

### 风险

- **中**：毫秒级失败潮导致 interval 抖动、优先级频繁变更，不利于 SLA 评估。

### 最小补丁：设计 sketch（见下节「FeedbackAggregator 设计」）

### 验收标准

- [ ] 失败反馈聚合窗口可配置（默认 2s）  
- [ ] `updateTaskState` 对同一 deviceKey 在窗口内最多执行一次 interval 降级  
- [ ] Shadow 写入仍实时；**仅调度状态调整**延迟聚合

---

## Top 3 最小变更实施计划

> 若资源只允许 3 项，按此顺序实施。

### 变更 1：ConnectionController → 纯只读

| 项 | 内容 |
|----|------|
| 目标 | 消除与 ConnectionManager 的双重 reconnect 判断 |
| 文件 | `internal/core/connection_controller.go`、`connection_controller_test.go`；`internal/driver/reconnect_limiter.go`（新建，可选） |
| 步骤 | 1) deprecated `CanRetry` / `AttemptHalfOpen` / core 包全局限流 2) `RecordConnectionFailure` 改为纯计数 3) 诊断 API 只暴露 ConnectionManager 4) 更新测试 |
| 估时 | 1–2 人日 |

### 变更 2：channelMu 为唯一链路 I/O 互斥

| 项 | 内容 |
|----|------|
| 目标 | 去掉 Transport.mu 对 I/O 的包裹 |
| 文件 | `internal/driver/modbus/transport.go`、`dlt645/transport.go`、`s7/transport.go`、`knxnetip/transport.go`、`profinetio/transport.go`、`mitsubishi/transport.go`；`internal/core/execution_layer.go`（注释强化） |
| 步骤 | 1) 读路径移除 mu 2) Connect/Disconnect 保留 mu 3) 文档 §5.3.2 明确重连与 channelMu 顺序 4) 跑 channel 隔离回归 |
| 估时 | 2–3 人日 |

### 变更 3：ProtocolCongestion 并入 Backpressure

| 项 | 内容 |
|----|------|
| 目标 | 单一 Allow() + reject_reason |
| 文件 | `internal/core/backpressure_controller.go`（扩展）、`protocol_congestion.go`（合并后删除或 thin wrapper）、`execution_layer.go` `Execute`/`executeParallel`/`executeLimited` |
| 步骤 | 1) 实现 `AllowWithReason` 2) 固定 Global→Device→Protocol 顺序 3) metrics 4) 迁移测试 |
| 估时 | 2 人日 |

---

## 迁移阶段压缩（旧 4 → 新 3）

```text
旧阶段 1 并行运行          ──┐
                              ├──► 新 S1 Shadow Parallel
旧阶段 1 退出条件(一致性)   ──┘

旧阶段 2 串行协议灰度      ──┐
旧阶段 2 Limited 部分       ├──► 新 S2 Serial-first Migration
                              │
旧阶段 3 中 Limited 协议   ──┘

旧阶段 3 并发协议灰度      ──┐
旧阶段 4 完全切换          ──┴──► 新 S3 Full ScanEngine Ownership
```

| 旧阶段 | 新阶段 | 备注 |
|--------|--------|------|
| 1 并行运行 | S1 | DRY_RUN 仍待实现；可用 Shadow 对比替代双跑 |
| 2 串行灰度 | S2 | Modbus/DLT645 已 mostly 在 ScanEngine |
| 3 并发灰度 | S3 | OPC UA 重连迁移属 S3 前置 |
| 4 完全切换 | S3 | 旧 CollectionScheduler 已移除，S3 = 协议补全 + 长跑 |

---

## 统一 Throttling Allow() 伪代码

```go
type RejectReason string

const (
    RejectNone           RejectReason = ""
    RejectGlobalSemaphore RejectReason = "global_semaphore"
    RejectDeviceSemaphore RejectReason = "device_semaphore"
    RejectProtocolRate    RejectReason = "protocol_rate"
    RejectGlobalRate      RejectReason = "global_rate" // 可选：若保留全局 token bucket
)

type ThrottleContext struct {
    DeviceKey string
    Protocol  string
    DeviceLimit int   // Parallel=8, Limited=2
    ProtocolGroup string // modbus|opcua|s7|default — 来自 protocolCongestionGroup()
}

func (tc *ThrottlingController) Allow(ctx ThrottleContext) (bool, RejectReason) {
    // Layer 1: Global concurrency (512)
    if !tc.globalSem.TryAcquire(1) {
        tc.recordReject(RejectGlobalSemaphore)
        return false, RejectGlobalSemaphore
    }

    // Layer 2: Per-device concurrency
    devSem := tc.deviceSem(ctx.DeviceKey, ctx.DeviceLimit)
    if !devSem.TryAcquire(1) {
        tc.globalSem.Release(1)
        tc.recordReject(RejectDeviceSemaphore)
        return false, RejectDeviceSemaphore
    }

    // Layer 3: Protocol rate (LAST — modbus 1000/s, opcua 400/s, s7 300/s, ...)
    bucket := tc.protocolBucket(ctx.ProtocolGroup)
    if !bucket.Allow() {
        devSem.Release(1)
        tc.globalSem.Release(1)
        tc.recordReject(RejectProtocolRate)
        return false, RejectProtocolRate
    }

    return true, RejectNone
}

func (tc *ThrottlingController) Release(ctx ThrottleContext) {
    tc.deviceSem(ctx.DeviceKey, ctx.DeviceLimit).Release(1)
    tc.globalSem.Release(1)
    // protocol bucket 为速率限制，无 per-request release
}
```

**日志示例**：

```text
[Throttling] reject device=modbus-tcp-1-slave-3 reason=protocol_rate protocol=modbus-tcp
```

**与现网差异**：移除 `BackpressureController` 内独立全局 Token Bucket（1000/s），或将其降为可选 Layer 0；避免与 Protocol 层双桶。建议 **仅保留 Protocol 层速率 + Global/Device 信号量**。

---

## Driver 无状态铁律（规范粘贴版）

```markdown
### Driver 无状态铁律（v5.2 · Execution Layer 强制）

**定义**：Driver 及其直接调用的 Transport 在 Execution Layer 视角下必须是**无状态纯函数**：给定 `(ctx, points, 已通过 ConnectionManager 建立的连接)`，输出 `(values, error)`，不保留跨调用可观测的调度语义。

**连接与重连**：
- 连接生命周期状态**仅**由 `driver.ConnectionManager` 持有（每 Channel 一个实例）。
- 所有 dial / reconnect **必须**经 `EnsureConnected` 或 `ScheduleReconnect`；禁止 Driver/Transport 内 `go reconnect()` 独立循环。

**禁止项**（`internal/driver/<name>/` 生产代码，测试除外）：
- `time.NewTicker` / `time.AfterFunc` 驱动采集或重连
- 未受 ScanEngine 派发的 `go func()` 长期 goroutine（Init 阶段 MTU/能力探测须一次性完成或移入 Channel 初始化钩子）
- 读写路径内的 unbounded retry loop（`withRetry` 最多 3 次且不含 sleep 退避；链路退避归属 ConnectionManager）
- 独立连接状态机（`CanRetry`、指数退避、cooldown）— 仅 ConnectionManager 允许

**允许项**：
- 协议编解码、PDU 拼装、字节序转换
- 单次 `Connect(ctx)` / `Disconnect()` 委托给 Transport → ConnectionManager
- 通过 `core.ConnectionController` **只读**上报：`IsConnectionFailure`、`RecordReadSuccess`（不得影响执行决策）

**违规处理**：新驱动 PR 不合并；存量驱动按 S2/S3 迁移表逐步清理，OpcUa/ENIP 为 S3 阻塞项。

**验收**：`grep -E 'time\.NewTicker|go func|scheduleReconnect' internal/driver/<driver>/` 生产文件零命中（Transport 内 `ScheduleReconnect` 调用 ConnectionManager 除外）。
```

---

## FeedbackAggregator 设计 sketch

```text
┌─────────────────────────────────────────────────────────────┐
│ executeTaskAsync (per task, 实时)                            │
│   Execute → applyCollectToShadow (实时，不延迟)               │
│   └─► feedbackChan <- FeedbackEvent{deviceKey, success, ...} │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│ FeedbackAggregator (单 goroutine, 默认 window=2s, 可配置 1-5s) │
│   per deviceKey 滑动窗口:                                    │
│     - success_count, fail_count, last_err                    │
│     - max_consecutive_fail                                   │
│   on flush tick:                                             │
│     - 调用 updateTaskStateAggregated() 一次                  │
│     - 更新 AdaptiveThrottle 输入（failRate 用窗口均值）      │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│ ScanEngine.updateTaskState / rescheduleTask                  │
│   interval 降级：窗口内 fail_rate > 阈值才触发                 │
│   priority：连续失败用窗口内 max，避免单次抖动                 │
└─────────────────────────────────────────────────────────────┘
```

**接口草案**（`internal/core/feedback_aggregator.go`，新文件）：

```go
type FeedbackEvent struct {
    DeviceKey string
    TaskID    string
    Success   bool
    Err       error
    At        time.Time
    LagMicros int64
}

type FeedbackAggregator struct {
    window   time.Duration  // default 2s
    events   chan FeedbackEvent
    onFlush  func(deviceKey string, stats AggregatedStats)
}

type AggregatedStats struct {
    SuccessCount int
    FailCount    int
    FailRate     float64
    LastError    error
}
```

**约束**：
- Shadow 写入路径**不经过** Aggregator  
- CB Open / ErrCircuitOpen 仍可 fast-path 立即反馈（可选旁路）  
- diagnostics 暴露 `feedback_aggregate_window_sec`、`feedback_flush_total`

---

## 代码 vs 文档差距汇总

| 主题 | 文档说法 | 代码现实 | v5.2 动作 |
|------|----------|----------|-----------|
| ConnectionController | §7.6.1 已只读 | 仍有完整 CanRetry 状态机；生产未调用 | 删除/deprecated 执行语义 |
| Connecting 退避 | §9.1 ⚠️ 无退避 | P0.2 已 200ms min | 更新 §9.1 |
| ProtocolCongestion 顺序 | §4.4.4 未写前置 | Execute 先 Protocol 后 Backpressure | 合并 Allow + 更新文档 |
| 熔断 | §9.1 ❌ 未实现 | `DriverCircuitBreaker` 已在 `execution_layer.go` | 更新 §9.1 为 ✅ |
| DRY_RUN | 阶段 1 要求 | 未实现 | S1 设计保留 |
| 反馈闭环 | 实时 per-task | 无 Aggregator | 新增设计 |
| Driver 无状态 | §5.1 理想 | OpcUa/Bacnet/Modbus 多处违规 | 铁律 + 迁移表 |

---

## 参考验证命令

```bash
go test ./internal/core/... -run 'ConnectionController|SerialQueue|Backpressure|ProtocolCongestion|ScanEngine'
go test ./internal/driver/... -run 'Reconnect|EnsureConnected|Connecting'
go test ./internal/core/... -run 'ChannelSlave|SerialQueueKey'
```

---

**文档结束**
