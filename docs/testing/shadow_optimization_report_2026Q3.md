# Shadow Q4 优化性能报告（2026 Q3）

> 测试环境：darwin/amd64，Go 1.26，Intel Core i5-5257U @ 2.70GHz  
> 目标平台：linux/arm GOARM=7（工业网关 ARMv7 32-bit）  
> 测试文件：`internal/core/shadow_core_armv7_test.go`、`shadow_optimization_test.go`

## 1. 优化摘要

| 类别 | Q3 基线 | Q4 变更 |
|------|---------|---------|
| 订阅扇出 | 每写 1 goroutine 同步 notify | 固定 6 worker pool + hash 分区 |
| 读路径 | `cloneShadowDevice` 深拷贝 Points | COW `atomic.Pointer` 快照，共享 immutable map |
| 采集写入 | ScanEngine 直写 ShadowCore | ShadowIngress 8ms/256 缓冲 + ring queue |
| 批量 apply | 无 | `ApplyShadowWrites` 单锁多消息 |
| 通信画像 | 每次写刷新 | RTT Δ≥10ms 或 ≥5% 才刷新 |

## 2. 微基准对比（`-benchmem -count=3`）

命令：

```bash
go test ./internal/core/ -run '^$' \
  -bench 'BenchmarkWriteShadowDevice|BenchmarkGetShadowDevice|BenchmarkNotifySubscribers|BenchmarkGetShadowDevice_COW|BenchmarkApplyShadowWrites_10kTags' \
  -benchmem -count=3
```

| Benchmark | Q3 基线 (ns/op) | Q4 (ns/op) | Q3 allocs/op | Q4 allocs/op |
|-----------|----------------:|-----------:|-------------:|-------------:|
| WriteShadowDevice（1 point） | ~2300 | ~2700 | 10 | 14 |
| WriteShadowDevice_MultiPoint（10 points） | ~7500 | ~9600 | 30 | 45 |
| GetShadowDevice（100 devices） | ~1070 | **~249** | 6 | **2** |
| GetShadowDevice_COW（100 points/device） | — | **~110** | — | **1** |
| NotifySubscribers（10 subs, worker pool） | ~2200 | ~2800 | 10 | 14 |
| ApplyShadowWrites_10kTags | — | ~10.8ms/op | — | 30187 |

### 读路径收益

- `GetShadowDevice`：**~4.3× faster**，allocs **6 → 2**
- 100 点位设备 COW 读：**~110 ns/op，1 alloc**（仅分配返回 struct，Points map 共享）

### 10k tag 批量

- 单批次 10k 点位 apply：**~10.5 ms**（~**952k tags/sec** 写入吞吐）
- Stress test：`TestStress_ShadowRingBuffer_10kThroughput` 验证点位完整性

## 3. Goroutine 稳定性

`TestShadowNotifyPool_NoUnboundedGoroutines`：500 次高频写后 goroutine 增长 < 20（worker pool 有界）。

## 4. 单元测试

```bash
go test ./internal/core/... -short -count=1
```

覆盖：

- `TestShadowNotifyPool_*` — worker pool 有界性
- `TestShadowCOW_ConcurrentReadWriteConsistent` — 读写一致性
- `TestShadowCore_ApplyShadowWrites_Batch` — 同设备批量合并 notify
- `TestShadowIngress_ScanEnginePath` — Ingress flush → Pipeline
- `TestShadowDeviceOptimizer_LazyProfileUpdate` — 小 RTT 变化跳过 profile 刷新

## 5. 生产挂载

`cmd/main.go`：

```go
shadowIngress = core.NewShadowIngress(sc, 256, 8*time.Millisecond)
shadowIngress.Start()
cm.SetShadowIngress(shadowIngress)
```

ScanEngine 采集路径：`IngestDirect` → ring buffer → 定时/满缓冲 flush → `ApplyShadowWrites`。

REST/写点路径仍直写 `ShadowCore.WriteShadowDevice`（低延迟）。


## 7. 2026-07-04 复测（darwin/amd64，Go 1.26）

命令与 Phase A–D 总表见 [q3_phase_abcd_verification_2026-07-04.md](q3_phase_abcd_verification_2026-07-04.html)。

| 项目 | 结果 |
|------|------|
| Shadow 单测（Ingress/COW/Worker Pool/10k stress） | ✅ PASS |
| `TestStress_ShadowRingBuffer_10kThroughput` | **14.86ms**，~**673k tags/sec**（2026-07-04 二轮） |
| `TestStress_VirtualShadow_10kRefresh`（新增） | **119.8ms**，~**83.5k source tags/sec**；100 虚拟设备 × 100 map 点 |
| `GetShadowDevice` bench | ~**254–295 ns/op**，2 allocs |
| `GetShadowDevice_COW` | ~**105–107 ns/op**，1 alloc |
| `ApplyShadowWrites_10kTags` | ~**10.6–11.7 ms/op** |
| `BenchmarkShadowIngress_Ingest`（`-tags=integration`） | ~**1.7–2.1 µs/op**，10 allocs |

## 6. 相关文件

| 文件 | 说明 |
|------|------|
| `internal/core/shadow_notify_pool.go` | P1 worker pool |
| `internal/core/shadow_cow.go` | P1 COW 快照 |
| `internal/core/shadow_ring_buffer.go` | P2 环形队列 |
| `internal/core/shadow_ingress.go` | P2 批量 flush |
| `internal/core/shadow_device_optimizer.go` | P3 惰性 profile |
| `internal/core/shadow_optimization_test.go` | Q4 单元/基准/压测 |
| `docs/edge/6. 影子设备设计.md` §6.10 | 设计说明 |

## 7. 剩余差距

- WriteShadowDevice 单点写 alloc 略增（worker pool 入队 + COW map 合并）；高写频场景收益在 goroutine 稳定与批量路径
- ARMv7 板端需交叉编译后复跑 benchmark 验证对齐与真实 P99
- Virtual shadow 10k 刷新压测已覆盖（`TestStress_VirtualShadow_10kRefresh`）；Virtual shadow 路径尚未 COW（低优先级）

## 8. SLA Phase B 补充（2026-07-02）

| 项 | 结果 |
|----|------|
| loadPoints 热路径 | **0 allocs/op** |
| per-device RTT throttle | 100+5 压测 P95 增幅 **10.9%** |
| GC gate | Q3 `gc_pause_max_ms` <20ms |
| Soak | build tag + CI short gate |

详见 `docs/testing/sla_completion_report_2026Q3.md`。
