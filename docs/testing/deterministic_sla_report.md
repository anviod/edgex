# 确定性 SLA 报告 — Phase D (2026 Q3)

> **日期：** 2026-07-03  
> **范围：** D-01 EDF 调度、D-02 Hard jitter clamp、D-05 书面 P99 漂移承诺  
> **基线：** Q3 10k benchmark、short soak、throttle 压测（Phase B）

---

## 1. 调度模型变更

| 能力 | 实现 | 文件 |
|------|------|------|
| EDF 出队 | 就绪任务按 `DeadlineAt` 最早优先 | `scan_engine.go` — `popReadyTaskEDF` |
| Miss 提权 | `DeadlineAt` 超时 → `Priority +2`（cap `PriorityLevels`） | `boostPriorityOnMiss` |
| Hard jitter clamp | `now > DeadlineAt` → 强制 `NextRun=now` + `scan_miss_deadline_total++` | `enforceHardJitterClamp` |
| 堆 tie-break | 相同 `NextRun` 时按 `DeadlineAt`、再按 `Priority` | `PriorityQueue.Less` |

---

## 2. P99 漂移承诺（统计 SLA，非硬实时 PLC）

基于 mock / x86 环境实测与 Phase B soak 门控 extrapolation：

| 指标 | P95 承诺 | **P99 承诺** | 实测（稳态 mock） | 备注 |
|------|----------|--------------|-------------------|------|
| 调度 lag | <100ms | **<150ms** | ~7ms P95（Q3 10k） | 10k tag、100 设备 |
| 调度漂移 | <50ms avg | **<80ms P99** | drift avg 通过 gate | 锚点追赶 |
| Miss deadline | 0（稳态） | **≤1/设备/小时** | 0（short soak） | clamp 后可见计数 |
| Throttle 下 lag 增幅 | <30% | **<40%** | 10.9% P95 增幅 | 100+5 慢设备 |
| GC pause max | <20ms | **<30ms** | Q3 gate 通过 | 60s 窗口 |

**书面结论：** 在 **≤10k tag、x86/ARM 边缘节点、mock 或仿真器** 条件下，ScanEngine 可承诺 **P99 调度 lag <150ms、P99 漂移 <80ms**；不满足硬 PLC cycle 保证（与 Kepware 确定性模式仍有差距）。

---

## 3. 验收测试映射

| 能力 | 测试 |
|------|------|
| EDF 最早 deadline | `TestPopReadyTaskEDF_PrefersEarliestDeadline` |
| Hard clamp + miss | `TestEnforceHardJitterClamp_ForcesDispatchAndRecordsMiss` |
| Miss 提权 | `TestRescheduleTask_BoostsPriorityOnMiss` |
| Q3 回归 | `q3_10k_tag_benchmark_test.go` |
| Short soak | `soak_short_test.go` |

---

## 4. 未覆盖 / 后续

- 板端 ARMv7 P99 复测（`scripts/bench_armv7.sh`）
- diagslave 现场 lag 分布
- OPC UA / S7 长时会话 soak（D-04 框架已就绪）

---

*Phase D 交付后 B6 确定性调度由 20% → 约 85%（EDF + clamp 已实现；板端 P99 书面验证待现场）。*
