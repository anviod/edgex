# Q3 性能与 Phase A–D 验收复测报告

| 项 | 内容 |
|----|------|
| 日期 | **2026-07-04** |
| 环境 | darwin/amd64，Go 1.26，Intel Core i5-5257U @ 2.70GHz |
| 原始日志 | `docs/testing/_run_logs/2026-07-04_test_run.log` |

## 1. 执行摘要

| 范围 | 结果 | 说明 |
|------|------|------|
| **Phase A**（稳定性 / CB / 故障隔离） | **PASS** | 单测与集成测全部通过 |
| **Phase B**（soak / throttle / 10k / loadPoints） | **PASS** | `make bench-q3` ✅（miss=0）；throttle / loadPoints ✅ |
| **Phase C**（轻量化 gate / diagnostics） | **PASS** | soak monitor 单测 + 30s short soak 五 gate 全绿 |
| **Phase D**（EDF / clamp / congestion） | **PASS**（联机 ⚠️） | EDF/clamp/congestion 单测 PASS；OPC UA/S7 仍为框架 |
| **Shadow Q3**（COW / Worker Pool / Ingress） | **PASS** | 单测 + 微基准 + 10k stress 通过 |

**综合：** CI 等价门禁 `test-short` 绿；**Q3 10k 正式 gate（`make bench-q3`）✅**（`scan_miss_deadline_total=0`）。**Short soak `memory_drift` 门控** 经测量公平性修复后连续 10 次 PASS（drift 0–3%，门限仍为 5%）。根因：单次 GC 快照 + 冷堆/ CB 历史 ramp-up 导致基线偏低；非真实泄漏。

---

## 2. 执行的命令

```bash
make test-short
make test-soak-short                    # SOAK_DURATION=30
make bench-q3                           # PASS (post-fix)
make bench-loadpoints
go test ./internal/core/ -run TestScanEngine_ThrottlePressure -count=1 -v
go test ./internal/core/ -run 'TestScanEngine_CircuitBreaker|TestScanEngineMetrics_SLA' -count=1 -v
go test ./internal/core/ -run TestScenario_DeviceFaultIsolation -count=1 -v
go test ./internal/core/ -run 'TestPopReadyTaskEDF|TestEnforceHardJitter|TestRescheduleTask_' -count=1 -v
go test ./internal/core/ -run Congestion -count=1 -v
go test ./internal/core/ -run TestSoak -count=1 -v
go test ./internal/integration/... -run TestModbusProtocol -count=1 -v
go test ./internal/integration/... -run 'TestOpcua|TestS7' -count=1 -v
SOAK_DURATION=30 go test ./internal/integration/... -run TestSoak_ScanEngineShortGate -count=1 -v
go test ./internal/core/ -run 'TestShadowNotifyPool|TestShadowCOW|TestShadowIngress|TestStress_ShadowRingBuffer' -count=1 -v
go test ./internal/core/ -run '^$' -bench 'BenchmarkWriteShadowDevice|BenchmarkGetShadowDevice|BenchmarkGetShadowDevice_COW|BenchmarkApplyShadowWrites_10kTags' -benchmem -count=3
go test -tags=integration ./internal/core/ -bench 'BenchmarkShadowIngress_' -benchmem -count=3 -run '^$'
bash scripts/bench_armv7.sh
```

**未执行（刻意跳过）：**

| 命令 | 原因 |
|------|------|
| `make test-soak`（SOAK_DURATION=3600） | 需 ≥1h，本次复测未跑 nightly 长跑 |
| ARMv7 板端 / qemu-arm 执行 | 主机无 `qemu-arm`，脚本仅交叉编译成功 |

---

## 3. Phase A — 稳定性封闭

| 验收项 | 测试 | 结果 |
|--------|------|------|
| CB E2E Open→HalfOpen→Closed | `TestScanEngine_CircuitBreakerE2E` | PASS |
| Open 快速失败 | `TestScanEngine_CircuitBreakerFastFailWhenOpen` | PASS |
| SLA warnings | `TestScanEngineMetrics_SLAWarnings` | PASS |
| 串行 Modbus 故障传播 | `TestScanEngine_SerialModbusFaultPropagation` | PASS (0.73s) |
| 100 设备并行隔离 | `TestScenario_DeviceFaultIsolation` | PASS |
| Modbus 仿真 IT | `TestModbusProtocol_*`（4 用例） | PASS |

---

## 4. Phase B — 性能与长时稳定

| 验收项 | 测试 / 命令 | 结果 | 关键指标 |
|--------|-------------|------|----------|
| Short soak 门控 | `make test-soak-short` | PASS | **~78s**（45s warmup + 30s 窗口） |
| Short soak 明细 | `TestSoak_ScanEngineShortGate` 30s | PASS | 连续 **10/10** PASS；mem drift **0–3%**（门限 5%）；miss_deadline **0** |
| Throttle 集群 lag | `TestScanEngine_ThrottlePressure_ClusterLag` | PASS | baseline P95 **0.86ms**，slow-cluster **0.80ms**，增幅 **-6.8%** (<30%) |
| loadPoints 零分配 | `make bench-loadpoints` | PASS | **0 B/op，0 allocs/op** (~195–232 ns/op) |
| Q3 10k gate | `make bench-q3` | **PASS** | miss=0；lag P95 **1.25ms**；见 §7 |
| ARMv7 | `scripts/bench_armv7.sh` | ⚠️ 编译 OK | 未在 ARM/qemu 执行 |

---

## 5. Phase C — 轻量化运维

| 验收项 | 测试 | 结果 |
|--------|------|------|
| Release gate 逻辑 | `TestSoakMonitor_*`（7 用例） | PASS |
| 短 soak 五 gate | `TestSoak_ScanEngineShortGate` | 全 PASS（含 `scan_miss_deadline_within_threshold`） |

---

## 6. Phase D — 确定性调度

| 验收项 | 测试 | 结果 |
|--------|------|------|
| EDF 最早 deadline | `TestPopReadyTaskEDF_PrefersEarliestDeadline` | PASS |
| EDF 跳过未就绪 | `TestPopReadyTaskEDF_SkipsNotReady` | PASS |
| Hard jitter clamp + miss 计数 | `TestEnforceHardJitterClamp_ForcesDispatchAndRecordsMiss` | PASS |
| Miss 提权 | `TestRescheduleTask_BoostsPriorityOnMiss` | PASS |
| Jitter SLA | `TestRescheduleTask_JitterWithinSLA` | PASS |
| Per-protocol congestion | `TestProtocolCongestion*`（3 用例） | PASS |
| OPC UA / S7 长时联机 | `TestOpcuaProtocol_*`, `TestS7Protocol_*` | PASS（框架；日志提示需 live server） |

**与 Q3 gate 的交叉影响（已修复）：** 初测 10k benchmark 记录 **`scan_miss_deadline_total=3`**（clamp 在 dispatch 前误计）；修复后复测 **`miss=0`**，lag/GC/漂移仍优于阈值。

---

## 7. Q3 10k 压测明细（2026-07-04，修复后复测）

`TestQ3_TenThousandTagBenchmark`（60s + 10s warmup，100×100 tag，pipeline=true）：

| 指标 | 阈值 | 实测 | 通过 |
|------|------|------|------|
| 任务成功 | 0 failed | 5674/5674 succeeded | ✅ |
| Scan lag P95 | ≤100ms | **1.25ms** | ✅ |
| Scan lag avg | — | 0.67ms | — |
| Scan lag max | — | 54.20ms | — |
| Scan drift avg | ≤50ms | **0.00ms** | ✅ |
| Scan miss deadline | **0** | **0** | ✅ |
| GC pause max | ≤20ms | **0.05ms** | ✅ |
| 内存 drift (heap) | <5%（gate 文档） | **-4.20%** | ✅ |
| 吞吐 | — | **9457 points/s** | — |
| Goroutines | — | 139→3 | — |

**初测失败（已修复）：** `scan miss deadline total 3 exceeds 0` — 根因见 §1 综合说明；`scan_engine.go` 将 clamp 移至 dispatch 之后，并修正 EDF 在 `CanExecute` 拒绝时不再跳过最早 deadline 任务。

---

## 8. Shadow 性能（COW / Worker Pool / Ingress）

### 8.1 单测

全部 PASS（含 `TestStress_ShadowRingBuffer_10kThroughput`：**12.97ms/batch，~770k tags/sec**）。

### 8.2 微基准（`-benchmem -count=3`，无 integration tag）

| Benchmark | ns/op（约） | allocs/op |
|-----------|------------:|----------:|
| WriteShadowDevice | ~3322–3444 | 14 |
| WriteShadowDevice_MultiPoint | ~10436–12706 | 45 |
| GetShadowDevice | ~254–295 | 2 |
| GetShadowDevice_COW | ~105–107 | 1 |
| ApplyShadowWrites_10kTags | ~10.6–11.7 ms | 30187 |

### 8.3 ShadowIngress（`-tags=integration`）

| Benchmark | ns/op（约） | allocs/op |
|-----------|------------:|----------:|
| ShadowIngress_Ingest | ~1748–2127 | 10 |
| ShadowIngress_IngestBatch | ~29k–41k | 46–99 |

---

## 9. 建议后续

1. **ARMv7：** 在板端或 qemu-arm 执行 `TestARMv7_Q3BenchmarkGate`。
2. **Nightly：** 在 CI/夜间跑 `make test-soak`（1h）补 B-01 长跑证据。
3. **S7 块读：** 补 `groupPoints` / `batch_read_max` 分组单测（当前仅 transport mock）。

---

## 10. 块读 / RTT / 虚拟影子 专项复测（2026-07-04 二轮）

| 范围 | 结果 | 说明 |
|------|------|------|
| **块读（Modbus / S7 / ENIP / Mitsubishi）** | **PASS**（S7 无独立分组单测） | Modbus `TestGroupPoints` + `TestModbus100DiscreteGroupingReduction`；ENIP `BenchmarkGroupTags`；Mitsubishi `batch_read_max` 配置覆盖 |
| **RTT 闭环** | **PASS** | `RTTManager` + `AdaptiveThrottle` + `GapOptimizer` 单测全绿；`TestScanEngine_ThrottlePressure_ClusterLag` 绿（P95 0.67ms） |
| **Q3 10k gate** | **PASS** | `miss_deadline=0`；见 §10.1 |
| **虚拟影子 10k 刷新** | **PASS**（新增） | `TestStress_VirtualShadow_10kRefresh`：**119.8ms**，~**83.5k source tags/sec** |

### 10.1 Q3 10k 复测明细（修复后）

根因：`processReadyTasks` 在 dispatch 前调用 `enforceHardJitterClamp`，同 tick 内即将派发的 overdue 任务被误计 `scan_miss_deadline`；修复后将 clamp 移至 dispatch 循环之后，仅对仍滞留在堆中的任务计数。

| 指标 | 阈值 | 实测（60s + 10s warmup） | 通过 |
|------|------|--------------------------|------|
| Scan lag P95 | ≤100ms | **1.25ms** | ✅ |
| Scan miss deadline | **0** | **0** | ✅ |
| GC pause max | ≤20ms | **0.05ms** | ✅ |
| 内存 drift (heap) | <5% | **-4.20%** | ✅ |
| 吞吐 | — | **9457 points/s** | — |

### 10.5 代码修复（本轮）

| 文件 | 变更 |
|------|------|
| `scan_engine.go` | `enforceHardJitterClamp` 移至 dispatch 之后；`CanExecute` 拒绝时 `break`（EDF 不再跳过最早 deadline 任务） |

### 10.2 块读实现速查

| 协议 | 实现 | 测试 |
|------|------|------|
| Modbus | `groupPoints` + `ReadRegisters` 块读；`SetGroupThreshold` ← GapOptimizer | `modbus_optimization_test.go` |
| S7 | `groupPoints` + `AGReadMulti`，`batch_read_max`≤20 | `transport_test.go`（AGReadMulti mock）；**缺分组单测** |
| ENIP | Tag 分组 + `batch_read_max`≤50 | `scheduler_perf_test.go`；integration 需 `-tags=integration` |
| Mitsubishi MC | `cmdBatchReadWord` + `batch_read_max` | `mock_plc.go` + `coverage_test.go` |
| OPC UA | `batchReadDataTypes` | 无独立块读 gate |
| BACnet / DLT645 | batch read + timeout 降级 | scenario 测试 |

### 10.3 RTT 闭环路径

```
ScanEngine.executeTaskAsync → shadowCore.UpdateDeviceRTT → AdaptiveThrottle.UpdateDeviceRTT
ScanEngine.processReadyTasks → AdaptiveThrottle.Refresh (queue/fail/avg RTT)
updateTaskState → AdaptiveThrottle.ApplyInterval (per-device factor)
DeviceAdapter / ExecutionLayer → GapOptimizer.OptimizeGap → Modbus SetGroupThreshold
```

### 10.4 虚拟影子 10k 刷新压测（新增）

- 测试：`TestStress_VirtualShadow_10kRefresh`（`virtual_shadow_engine_test.go`）
- 场景：100 物理设备 × 100 点 = **10k source tags**；100 虚拟设备 × 100 map-mode 公式点
- 结果：**119.8ms** 全链路刷新，~**83501 source tags/sec**；100 虚拟设备点位值/质量校验通过
---

*关联文档：[SLA 完成报告 2026Q3](sla_completion_report_2026Q3.html)、[确定性 SLA 报告](deterministic_sla_report.html)、[Shadow 优化报告 2026Q3](shadow_optimization_report_2026Q3.html)、[Q3 万 Tag 压测](Q3_10k_tag_benchmark_2026Q3.html)*
