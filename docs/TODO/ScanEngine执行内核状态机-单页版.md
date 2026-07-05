# ScanEngine 执行内核状态机（单页版）

> **关联**：[ScanEngine重构方案.md](./ScanEngine重构方案.md) · [v5.2 稳定版补丁](./ScanEngine重构方案-v5.2-稳定版补丁.md)  
> **用途**：一屏读懂调度、执行、连接、限流四条主路径的状态流转

---

## 1. 总览：调度闭环

```mermaid
stateDiagram-v2
    direction LR

    [*] --> TickWake: Run()
    TickWake --> Dispatch: processReadyTasks()
    Dispatch --> Executing: resourceCtrl.CanExecute
    Executing --> ShadowWrite: Execute OK/Fail
    ShadowWrite --> Feedback: applyCollectToShadow
    Feedback --> Reschedule: updateTaskState / Aggregator
    Reschedule --> Queued: heap.Push + NextRun
    Queued --> TickWake: nextReadyTime / 10-50ms fallback

    note right of TickWake
        双唤醒：wakeTimer(EDF)
        + fallback Ticker
        v5.2: 负载>70% → 50ms
    end note
```

**关键文件**：`scan_engine.go`（`dispatchLoop`、`processReadyTasks`、`executeTaskAsync`）  
**任务态**：`ScanTaskStatusIdle | Running | Degraded | Stopped`（`scan_engine.go`）

---

## 2. ScanEngine 任务调度（EDF + 资源门）

```mermaid
stateDiagram-v2
    direction TB

    state "PriorityQueue (heap)" as PQ
    state "Idle" as Idle
    state "Running" as Running
    state "Degraded" as Degraded
    state "Stopped" as Stopped

    [*] --> Idle: RegisterTask
    Idle --> Running: popReadyTaskEDF + go executeTaskAsync
    Running --> Idle: success / CB fast-fail
    Running --> Degraded: ConsecutiveFailures≥3
    Degraded --> Idle: success → Interval→BaseInterval
    Idle --> Stopped: StopTask
    Stopped --> [*]

    Running --> PQ: rescheduleTask
    Degraded --> PQ: interval 倍增(≤64s)
    PQ --> Idle: NextRun ≤ now

    note right of Running
        ResourceController
        GoroutineLimit 2048
        满则 re-push  break
    end note
```

| 转换 | 触发 | 函数 |
|------|------|------|
| 降级 | 连续失败 ≥3 | `updateTaskState` |
| 优先级升 | 错过 Deadline | `boostPriorityOnMiss` |
| 防饿死 | 300s 未执行 | `enforceAntiStarvation` |
| 自适应间隔 | 队列/RTT/失败率 | `AdaptiveThrottle.ApplyInterval` |

---

## 3. ExecutionLayer 三路执行

```mermaid
flowchart TB
    subgraph EL["ExecutionLayer.Execute()"]
        CB{CircuitBreaker<br/>Allow?}
        RT{protocolRegistry<br/>类型}
        SER[executeSerial]
        PAR[executeParallel]
        LIM[executeLimited]
        TH{Unified Allow<br/>Global→Device→Protocol}
    end

    CB -->|Open| BAD[ErrCircuitOpen Bad quality]
    CB -->|Closed| RT
    RT -->|Serial| SER
    RT -->|Parallel| TH
    RT -->|Limited| TH
    TH -->|reject| RL[ErrRateLimited + reason]
    TH -->|ok| PAR
    TH -->|ok| LIM

    SER --> SQM[SerialQueueManager<br/>depth≤64]
    SQM --> RP[readPoints + channelMu?]
    PAR --> WP[WorkerPool 32]
    WP --> RP
    LIM --> BP2[Allow deviceLimit=2]
    BP2 --> SER

    RP --> DRV[Driver.ReadPoints → Transport]

    style TH fill:#e8f4fc
    style SQM fill:#fff3cd
    style RP fill:#d4edda
```

**协议路由**：`channel_manager.go` `registerProtocolToScanEngine`

| 模式 | 协议示例 | 串行机制 | 限流 |
|------|----------|----------|------|
| Serial | modbus, dlt645 | SerialQueue + channelMu(共享) | 队列深度 |
| Parallel | opc-ua, http | WorkerPool | Unified Allow(8) |
| Limited | s7, profinet | SerialQueue + Allow(2) | Unified Allow(2) |

---

## 4. 共享链路 I/O 串行（v5.2 目标）

```mermaid
sequenceDiagram
    participant SE as ScanEngine
    participant SQM as SerialQueue<br/>shared:channelID
    participant EL as readPoints
    participant MU as channelMu
    participant TR as Transport
    participant CM as ConnectionManager

    SE->>SQM: Submit(DriverTask)
    SQM->>EL: worker 顺序 dequeue
    EL->>MU: Lock (共享链路)
    EL->>TR: ReadPoints (无 Transport.mu I/O 锁)
    TR->>CM: EnsureConnected (如需)
    TR-->>EL: values / err
    EL->>MU: Unlock
```

> **v5.2 铁律**：共享链路 **仅 channelMu** 串行 I/O；Transport.mu 只管连接对象生命周期。

---

## 5. ConnectionManager 生命周期

```mermaid
stateDiagram-v2
    direction LR

    [*] --> Disconnected
    Disconnected --> Connecting: EnsureConnected / ScheduleReconnect
    Connecting --> Connected: dial OK
    Connecting --> Retrying: dial fail
    Retrying --> Connecting: CanRetry + backoff
    Retrying --> Dead: maxRetries
    Dead --> Retrying: cooldown 到期
    Connected --> Disconnected: Disconnect / 硬错误
    Connected --> Retrying: RecordFailure

    note right of Connecting
        single-flight
        reconnectRunning
        MaxGlobalReconnectRate 10/s
    end note

    note left of Disconnected
        ConnectionController (v5.2)
        只读：错误分类 + 指标
        不参与 dial 决策
    end note
```

**Owner**：`internal/driver/connection_manager.go`  
**调用链**：`ModbusTransport.Connect` → `connMgr.EnsureConnected(connectOnce)`  
**禁止**：`core.ConnectionController.CanRetry` 触发 dial（v5.2 移除执行语义）

---

## 6. 统一背压 Allow() 流程（v5.2）

```mermaid
flowchart LR
    A[Allow 请求] --> G[① Global Sem 512]
    G -->|fail| R1[reject_global_semaphore]
    G -->|ok| D[② Device Sem 8 or 2]
    D -->|fail| R2[reject_device_semaphore]
    D -->|ok| P[③ Protocol Token Bucket]
    P -->|fail| R3[reject_protocol_rate]
    P -->|ok| OK[执行 WorkerPool / Serial]

    OK --> REL[Release: Device + Global]

    style P fill:#ffe0b2
    style R3 fill:#ffcdd2
```

**Serial 路径**：跳过 ①②③，仅 `SerialQueue` 90% 软限 → `ErrQueueFull`

---

## 7. 反馈路径（现行 vs v5.2）

```mermaid
flowchart TB
    subgraph now["现行 (v5.1)"]
        E1[executeTaskAsync] --> S1[applyCollectToShadow 实时]
        S1 --> U1[updateTaskState 实时]
        U1 --> H1[heap.Push]
    end

    subgraph target["v5.2 目标"]
        E2[executeTaskAsync] --> S2[applyCollectToShadow 实时]
        E2 --> AG[FeedbackAggregator 1-5s]
        AG --> U2[updateTaskState 聚合]
        U2 --> H2[heap.Push]
    end
```

---

## 快速对照表

| 子系统 | 状态 Owner | 入口文件 |
|--------|-----------|----------|
| 调度 | ScanEngine / ScanTask | `scan_engine.go` |
| 执行路由 | ExecutionLayer | `execution_layer.go` |
| 链路串行 | channelMu + SerialQueue | `execution_layer.go`, `serial_queue_manager.go` |
| 连接 | ConnectionManager | `driver/connection_manager.go` |
| 连接观测 | ConnectionController (只读) | `connection_controller.go` |
| 限流 | ThrottlingController (v5.2) | `backpressure_controller.go` |
| 熔断 | DriverCircuitBreaker | `circuit_breaker.go` |

---

*单页版 · 2026-07-05*
