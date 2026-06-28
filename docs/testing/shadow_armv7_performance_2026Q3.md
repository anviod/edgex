# Shadow ARMv7 性能报告（2026 Q3）

> 测试环境：darwin/amd64，Go 1.26.4，Intel Core i5-5257U @ 2.70GHz  
> 目标平台：linux/arm GOARM=7（工业网关 ARMv7 32-bit）  
> 测试文件：`internal/core/shadow_core_armv7_test.go`

## 1. 优化摘要

| 类别 | 变更 |
|------|------|
| ARMv7 对齐 | `versionCounter` → `atomic.Uint64`，struct 首字段 8 字节对齐 |
| 写路径 alloc | scratch `changed` map 使用 `sync.Pool` |
| 通知 payload | Delta-only + 标量浅拷贝（`cloneShadowPointsForNotify`） |
| 扇出路径 | `ResolvePublishTarget` 去掉全量 `GetShadowDevice` 克隆 |
| Goroutine | 每次写 1 个 notify goroutine（原：1 + N 订阅者 goroutine） |
| CAS/单点写 | 同步改为 delta notify（原：克隆全量 Points） |

## 2. 微基准（`-benchmem -count=3`）

命令：

```bash
go test ./internal/core/ -run '^$' \
  -bench 'BenchmarkWriteShadowDevice|BenchmarkGetShadowDevice|BenchmarkNotifySubscribers' \
  -benchmem -count=3
```

| Benchmark | ns/op | B/op | allocs/op |
|-----------|------:|-----:|----------:|
| WriteShadowDevice（1 point） | ~2300 | 737 | 10 |
| WriteShadowDevice_MultiPoint（10 points） | ~7500 | 3866 | 30 |
| GetShadowDevice | ~1070 | 848 | 6 |
| NotifySubscribers（10 subs） | ~2200 | 736 | 10 |

> **吞吐估算**：单点写 ~430k ops/sec（单核）；10 点位批次 ~130k ops/sec。

## 3. 并发读写压测

命令：

```bash
go test ./internal/core/ -run TestStress_ShadowCoreConcurrentReadWriteMetrics -v -count=1
```

| 指标 | 结果 |
|------|------|
| 时长 | 3s |
| 写 ops | 147,327（~49k ops/sec） |
| 读 ops | 2,031,153（~677k ops/sec） |
| 合计吞吐 | ~726k ops/sec |
| 影子设备数 | 50 |

配置：20 goroutine 并发读写（10 写 + 10 读），每设备 1 点位。

## 4. ARMv7 对齐验证

```bash
go test ./internal/core/ -run 'ARMv7|NotifyDelta|ResolvePublish' -count=1
```

- `TestShadowCore_ARMv7_VersionCounterAlignment`：`unsafe.Offsetof` 验证 8 字节对齐 + 16 goroutine 并发 Add/Load
- `TestShadowCore_NotifyDeltaOnly`：二次写入仅推送 1 个变更点位
- `TestShadowCore_ResolvePublishTarget_NoClone`：轻量解析 channel/device

> 在 macOS 上无法 `GOARCH=arm` 本地运行；生产验证请用 `GOOS=linux GOARCH=arm GOARM=7` 交叉编译后在目标板执行上述测试。

## 5. 与优化前对比（估算）

优化前主要开销来源（代码审查）：

| 热点 | 优化前 | 优化后 |
|------|--------|--------|
| WriteShadowPoint/CAS notify | 克隆全量 Points | Delta-only |
| ResolvePublishTarget | `GetShadowDevice` 深克隆 | RLock 读两个 string 字段 |
| notifySubscribers | 每订阅者 1 goroutine | 单 goroutine 同步扇出 |
| shadow ID | `fmt.Sprintf` | 字符串拼接 |

精确 before/after 需在优化前 commit 上重跑 benchmark；当前数字为 **优化后基线**，供 Q3 回归与 ARMv7 部署对照。

## 6. 终极优化方案（Q3 → Q4）

### Q3 已落地

1. ARMv7-safe atomic 版本计数
2. Delta notify + 浅拷贝
3. scratch map sync.Pool
4. ResolvePublishTarget 零克隆
5. 订阅 goroutine 收敛

### Q4 候选

| 项 | 触发条件 | 预期收益 |
|----|----------|----------|
| Notify worker pool | 写频 > 5k/s 且 goroutine 抖动 | 稳定 P99 延迟 |
| GetShadowDevice COW | 读频 >> 写频且点位 > 100 | 降低读 alloc |
| Ring buffer 批量 apply | 10k+ tag 单通道刷新 | 写锁持有时间 ↓ |
| ShadowIngress 挂载 | ScanEngine CPU 占用过高 | 批量合并写入 |
| 通信画像惰性更新 | profile 更新占写路径 > 5% | 写路径 ns/op ↓ |

## 7. 相关文件

| 文件 | 说明 |
|------|------|
| `internal/core/shadow_core.go` | 热路径实现 |
| `internal/core/shadow_pool.go` | sync.Pool + 浅拷贝 |
| `internal/core/shadow_core_armv7_test.go` | 对齐/基准/压测 |
| `docs/edge/6. 影子设备设计.md` §6.10 | 设计说明 |
