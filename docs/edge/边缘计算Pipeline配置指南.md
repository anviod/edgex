# 边缘计算 Pipeline 配置指南

> **⚠️ 已归档：** 本文描述的是 **V2.2 Pipeline Worker / embedded 编译路径**，与当前生产代码 **不一致**。现行实现为 Go `EdgeComputeManager`（`internal/core/edge_compute_manager.go`），请改用：
>
> - [边缘计算基础功能](边缘计算基础功能.html) — 规则引擎与数据流转
> - [边缘计算规则帮助](边缘计算规则帮助.html) — 配置详解
> - [边缘计算 API](../API/Edge_Computing_CN.html)
>
> 下文仅作历史参考，**不应**作为新部署依据。

> **文档定位（历史）**：面向开发/运维的 **V2.2 Pipeline Worker 技术对照**——bbolt 字段、init 编译结构与 runtime 行为。

| 项 | 内容 |
|----|------|
| 版本 | V1.0 |
| 更新 | 2026-07-05 |
| 适用 Profile | **embedded（V2.2 PRIMARY）** 默认；gateway 差异见各节标注 |
| UI 对应 | `EdgeCompute.vue` · `EdgeComputeHelpDrawer.vue` · `model.EdgeRule` |
| 用户文档 | [边缘计算规则帮助](边缘计算规则帮助.md) |

---

## 一、基础概念

边缘计算规则由四部分组成：**数据源（Sources）**、**条件（Condition）**、**动作（Actions）** 与 **运行参数**（触发模式、检查频率、优先级）。

```text
Sources (t1, p1...)  →  Condition / Expression  →  Actions 链
         ↑                        ↑                      ↑
   ScanEngine 采集          Pipeline eval/match      control/stream/store
```

### 1.1 Sources（数据源）

- 每条 Source 绑定一个南向点位（通道 / 设备 / 测点），并赋予**别名**（如 `t1`、`p1`）。
- 别名在条件表达式与计算公式中引用。
- Pipeline 底层：`point_bindings` 表将 `channel_id/device_id/point_id` 编译为 `SourceIdx`（uint32），热路径无字符串。

| UI 字段 | bbolt 路径 | Pipeline 等价 |
|---------|-----------|---------------|
| `sources[].alias` | `EdgeRules` → `sources[].alias` | init 表达式解析；运行时 `InIdx[]` |
| `sources[].channel_id` 等 | 同上 | `point_bindings.ref` → `idx` |

### 1.2 Condition（条件）

- **布尔表达式**，条件为真时触发动作链（**Calculation 类型除外**）。
- 示例：`t1 > 80`、`bitget(v,3)==1`、`t1 > 80 && p1 < 10`。
- Pipeline：`RuleSlot.op` + `threshold`（init 预展开，runtime 整数比较）。

### 1.3 Actions（动作）

- 条件满足后按顺序执行的**动作链**。
- Pipeline：embedded 以单步 `ActionSlot` 为主；gateway 支持完整 `StepChain`（含 Delay、Check）。

### 1.4 触发模式（Trigger Mode）

| UI 值 | 说明 | Pipeline |
|-------|------|----------|
| **always**（始终触发） | 条件持续为真且通过频率门控时重复触发 | `RuleSlot.edge_trigger = false` |
| **on_change**（仅状态变化） | 仅 false→true 边沿触发，用于**告警去重** | `edge_trigger = true` + `Feedback.lastState` |

### 1.5 检查频率（Check Frequency）

- 可选：`1s`、`5s`、`1m` 等（UI 字段 `check_interval`）。
- 频率越高响应越快，CPU 占用越高。
- Pipeline：`allow()` 源级节流 + `RuleSlot.minInterval` 规则级节流。

### 1.6 优先级（Priority）

- 数值**越大优先级越高**；多规则同时命中时先执行高优先级。
- Pipeline：init 时 `RuleTable.slots` 按 priority **降序排列**，`Match()` 返回首条命中。

---

## 二、规则类型

### 2.1 Threshold（阈值触发）

**语义**：条件表达式为真 → 执行动作链。

**示例**：温度别名 `t1`，当 `t1 > 80` 时发送 MQTT 告警。

| 配置项 | 示例值 |
|--------|--------|
| type | `threshold` |
| sources | `[{alias:"t1", channel_id:"ch1", device_id:"dev1", point_id:"temp"}]` |
| condition | `t1 > 80` |
| check_interval | `5s` |
| trigger_mode | `on_change` |
| actions | `[{type:"mqtt", config:{topic:"alarm/temp"}}]` |

**Pipeline 映射**：

```text
EvalSlot[42]  = Passthrough
RuleSlot      = {sourceIdx:42, op:GT, threshold:80000, edge_trigger:true, minInterval:5s}
ActionSlot[3] = {kind:stream, topic:"alarm/temp"}
```

### 2.2 Calculation（公式计算）

**语义**：按公式计算派生值，**不触发** Condition 动作链；结果写入 PointCache / 影子点供其他规则或 UI 使用。

**示例**：摄氏转华氏 `t1*1.8+32`。

| 配置项 | 示例值 |
|--------|--------|
| type | `calculation` |
| expression | `t1*1.8+32` |
| sources | `[{alias:"t1", ...}]` |

**Pipeline 映射**：`EvalSlot{EvalFormula, InIdx:[42], Coef:[1000,1800,32000]}`（定点 scale=1000），无 `RuleSlot` 动作触发。

### 2.3 Window（窗口聚合）

**语义**：在时间窗口或计数窗口内做 avg / min / max / sum / count 聚合，聚合结果参与条件判断或作为派生值。

| 配置项 | 示例值 |
|--------|--------|
| type | `window` |
| window.type | `sliding` / `tumbling` |
| window.size | `10s` 或 `100`（计数） |
| window.aggr_func | `avg` |

**Pipeline 映射**：`EvalSlot{EvalWindowAvg, WindowN:10, buf:[10]int32}`，init 分配固定环形缓冲；runtime inline 累加，**无 runtime 队列**。

### 2.4 State（状态防抖）

**语义**：条件需**持续满足**指定时长，或**连续满足**指定次数，才触发动作（debounce / sustain）。

| 配置项 | 示例值 |
|--------|--------|
| type | `state` |
| condition | `t1 > 80` |
| state.duration | `30s` |
| state.count | `5`（可选，与 duration 二选一或组合） |

**Pipeline 映射**：`EvalSlot` debounce counter + 满足后 `RuleSlot.match()`；计数与计时在 Worker 内联，状态存于 slot 字段（非 map）。

---

## 三、表达式语法

| 符号 / 函数 | 含义 | Pipeline 编译 |
|------------|------|---------------|
| `v` / `value` | 当前触发点位的值 | `ev.Raw` 或 `PointCache.Load(idx)` |
| `t1`, `p1` | Source 别名 | `InIdx[]` 绑定点索引 |
| `bitget(v, n)` | 取第 n 位（0-based） | `EvalBitGet` opcode |
| `bitset(v, n)` | 置位 | `EvalBitSet` |
| `bitclr(v, n)` | 清位 | `EvalBitClr` |
| `bitand(a, b)` | 按位与 | `EvalBitAnd` |
| `bitor(a, b)` | 按位或 | `EvalBitOr` |
| 比较 / 逻辑 | `>`, `<`, `==`, `&&`, `\|\|` | 编译为 `RuleSlot.op` 或多段 Eval |

**示例**：

| 表达式 | 用途 | 编译结果 |
|--------|------|----------|
| `bitget(v,3)==1` | 第 4 位为 1 报警 | BitGet + `opEq, threshold:1` |
| `t1*1.8+32` | 温标转换 | 定点公式 EvalSlot |
| `t1 > 80 && p1 < 100` | 双条件 | 多源 Eval + 复合 RuleSlot（或 gateway expr） |

> **embedded 限制**：无法静态展开的复杂表达式请在 init 报错，或改用 **Gateway Profile**。

---

## 四、动作类型

| 动作 type | 说明 | Pipeline Execute | embedded |
|-----------|------|------------------|----------|
| **log** | 写入本地日志 / 分钟摘要 | `store` → bblot | ✅ |
| **device_control** / **command** | 南向写点 / 设备控制 | `control` → WritePoint | ✅ |
| **mqtt** | MQTT 北向推送 | `stream` | ✅ |
| **http** | HTTP 推送 | `stream` | ✅ |
| **database** | 写入本地 bbolt / 数据库 | `store` | ✅ |
| **sequence** | 嵌套子动作序列 | `StepChain` 预展开 | 🟡 简化 |
| **delay** | 步骤间等待 | StepChain.delay_ms | 🟡 ms 级 busy-wait |
| **check** | 读点校验，失败走 On Fail | StepChain.check + on_fail | ❌ gateway only |

**Execute 三类型汇总**：

- **control** — 南向设备控制
- **stream** — MQTT / HTTP / WebSocket 北向
- **store** — 日志 / bblot / 本地持久化

---

## 五、配置示例

### 5.1 阈值告警（Threshold + MQTT）

**场景**：温度别名 `t1`，每 5 秒检查；`t1 > 80` 且状态从正常变为告警时，MQTT 推送。

```json
{
  "id": "rule-temp-alarm",
  "name": "高温告警",
  "type": "threshold",
  "enable": true,
  "priority": 10,
  "check_interval": "5s",
  "trigger_mode": "on_change",
  "sources": [
    { "alias": "t1", "channel_id": "ch1", "device_id": "dev1", "point_id": "temp" }
  ],
  "condition": "t1 > 80",
  "actions": [
    { "type": "mqtt", "config": { "topic": "factory/alarm/temp", "payload": "HIGH_TEMP" } }
  ]
}
```

**Pipeline 执行链**：

```text
ScanEngine → RingEvent{idx=42, raw=85000}
  → allow(5s) ✓
  → eval passthrough → 85000
  → match(85000 > 80000) ✓ + edge(on_change) ✓
  → execute stream(MQTT)
  → feedback lastState=ALARM
```

### 5.2 公式计算（Calculation）

```json
{
  "id": "rule-temp-f",
  "type": "calculation",
  "expression": "t1*1.8+32",
  "sources": [{ "alias": "t1", "channel_id": "ch1", "device_id": "dev1", "point_id": "temp" }]
}
```

结果写入 PointCache，供 UI 或其它规则读取；**无动作触发**。

### 5.3 顺序联动（Sequence · Gateway）

```json
{
  "id": "rule-start-seq",
  "type": "threshold",
  "condition": "t1 > 50",
  "actions": [
    {
      "type": "sequence",
      "config": {
        "steps": [
          { "type": "device_control", "config": { "point_id": "valve1", "value": 1 } },
          { "type": "delay", "config": { "duration": "2s" } },
          { "type": "check", "config": { "point_id": "pressure1", "condition": "> 100" } },
          { "type": "device_control", "config": { "point_id": "pump1", "value": 1 } }
        ],
        "on_fail": [{ "type": "device_control", "config": { "point_id": "valve1", "value": 0 } }]
      }
    }
  ]
}
```

**embedded**：建议拆为多条独立规则；**gateway**：完整 `StepChain` + On Fail rollback。

### 5.4 批量控制（Batch Control）

多条 **device_control** 动作或 Sequence 内多写点：

```json
{
  "actions": [
    { "type": "device_control", "config": { "device_id": "dev1", "point_id": "relay1", "value": 1 } },
    { "type": "device_control", "config": { "device_id": "dev1", "point_id": "relay2", "value": 1 } }
  ]
}
```

Pipeline：init 展开为 `StepChain` 两步 `control`；Executor 按 channel 串行写，失败 counter 统计不阻塞 Worker。

### 5.5 位运算告警（Bitwise）

```json
{
  "type": "threshold",
  "condition": "bitget(v,3)==1",
  "sources": [{ "alias": "v", "channel_id": "ch1", "device_id": "plc1", "point_id": "status_reg" }],
  "trigger_mode": "on_change",
  "actions": [{ "type": "log", "config": { "message": "bit3 alarm" } }]
}
```

Pipeline：`EvalBitGet{n:3}` → `RuleSlot{eq,1}` → `store`（bblot）。

---

## 六、最佳实践

| 实践 | 说明 | Pipeline 建议 |
|------|------|---------------|
| **一规则一职责** | 每条规则只做一件事 | 1 UI 规则 → 1 RuleSlot + 1 actionIdx |
| **告警去重** | 使用 `on_change` 触发模式 | `edge_trigger=true` |
| **防抖** | State 类型或 duration/count | `EvalSlot` debounce；避免 always + 短 interval |
| **复杂联动** | Sequence + Check + On Fail | Gateway Profile；embedded 拆规则 |
| **性能** | 非紧急规则用较长 check_interval | `5s` / `1m` 降低 `allow()` 频率 |
| **优先级** | 安全联锁设高 priority | init 排序保证先匹配 |

---

## 七、Profile 对照

| 能力 | embedded（V2.2 PRIMARY） | gateway（V2.1 可选） |
|------|-------------------------|---------------------|
| Threshold / Calculation / Window / State | ✅ 预展开 | ✅ + expr 富表达 |
| MQTT / HTTP / Control / Log | ✅ 三类型 Execute | ✅ 七种 Step |
| Sequence / Delay / Check | 🟡 简化 | ✅ 完整 StepChain |
| Rollback / SES 闭环 | ❌ | ✅ |
| 配置存储 | bbolt `config.db` | 同左 + Intent 诊断 |
| 热路径 | 零 expr · 零堆分配 | Intent 对象流 |

---

## 八、配置存储与 reload

| Bucket | 用途 |
|--------|------|
| `EdgeRules` | UI 读写的用户规则 JSON（1.x 兼容） |
| `point_bindings` | 点位 ref → SourceIdx |
| `pipeline_rules` | init 编译后的 RuleSlot（可由编译器自动生成） |
| `pipeline_actions` | ActionSlot / StepChain |
| `pipeline_stats` | 运行时 counter 快照 |

**配置变更流程**：API 写入 bbolt → Worker 暂停 → init 重新编译表 → 恢复。**热路径不读 bbolt**。

---

## 附录：交叉引用

- [边缘计算规则帮助](边缘计算规则帮助.md) — **官方用户帮助**（UI 文案 + Pipeline 侧栏注释）
- [边缘计算优化升级 2.0 §8](../TODO/边缘计算优化升级2.0.md#8-功能对齐规则配置语义--pipeline-worker-映射) — 完整映射表
- [ARMv7工业控制内核 Go 参考实现 §6.3](../TODO/ARMv7工业控制内核 Go 参考实现.md) — RuleTable 预展开与 Go 结构
- [数据源与输出动作设计 §1.0](../architecture/数据源与输出动作设计.md) — 嵌入式 Profile
- `internal/model/types.go` — `EdgeRule` · `RuleAction` 结构定义
- `ui/src/views/EdgeCompute.vue` — 规则管理 UI

---

*维护：架构组 | 与 EdgeCompute UI 字段同步更新*
