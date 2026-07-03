# 南向采集 TODO 规划索引（2026 Q3 架构对齐）

| 项 | 内容 |
|----|------|
| 版本 | V1.1 |
| 更新 | 2026-06-27 |
| 架构基线 | [边缘计算南向采集优化方案2026第三季度.md](../[TODO]边缘计算南向采集优化方案2026第三季度.html) |
| 总览 | [边缘网关架构设计总览.md](../edge/边缘网关架构设计总览.html) |

---

## 1. 新架构约束（所有 TODO 文档必须对齐）

> **工程铁律：** 任何性能优化不得以牺牲稳定性为代价；任何架构优化不得增加系统恢复复杂度。

> 战略文档：[开发原则与验收标准](../DEVELOPMENT_PRINCIPLES.html) · [分阶段路线图](../ROADMAP.html) · [版本发布门禁](../RELEASE_GATE.html)

```text
config.db → ChannelManager → ScanEngine → ExecutionLayer → Driver.ReadPoints
                                    ↓
                              ShadowCore (SoT)
                                    ↓
                         ShadowBridge → DataPipeline
                                    ↓
              WebSocket / EdgeCompute / Northbound / values 历史
```

| 模块 | 路径 | 驱动开发者需知 |
|------|------|----------------|
| 通道与驱动生命周期 | `internal/core/channel_manager.go` | 每通道一个 Driver 实例；连接失败时 `markChannelDevicesOffline` |
| 设备有效状态 | `internal/core/channel_device_state.go` | 通道链路 Down → 同通道设备 API 显示 Offline |
| 采集调度 | `internal/core/scan_engine.go` | 驱动仅实现 `ReadPoints`/`WritePoint`，不自行定时采集 |
| Scan Class | `internal/model/scan_class.go` | 点位 `scan_class`: fast/normal/slow |
| 执行层 | `internal/core/execution_layer.go` | 串行/并行/限流由 ScanEngine 控制 |
| 影子真源 | `internal/core/shadow_core.go` | 采集结果经 ScanEngine 写入 Shadow，UI 读 Shadow |
| 诊断 | `internal/server/diagnostics_handler.go` | 设备 RTT/MTU/Gap/scan_tasks 可观测 |
| 驱动接口 | `internal/driver/interface.go` | 统一 `Init/Connect/ReadPoints/WritePoint/Health` |

**驱动开发 checklist**：

1. `driver.RegisterDriver("<protocol-id>", ...)` 于 `init()`
2. 在 `cmd/main.go` 空白导入驱动包
3. 前端 `ui/src/utils/protocolLabel.js` + `channelHelpProtocols.js` 注册协议
4. 单元测试：`decoder_test.go` + 驱动注册测试
5. 不在驱动内启动独立采集 goroutine（Subscribe 模式除外，且需与 ScanEngine 周期读兼容）

---

## 2. 驱动 TODO 状态

| 协议 | 文档 | 协议 ID | 后端 | 前端帮助 | 优先级 | 状态 |
|------|------|---------|------|----------|--------|------|
| IEC 60870-5-104 | [ICE104/采集驱动ICE104开发.md](./ICE104/采集驱动ICE104开发.html) | `iec60870-5-104` | ✅ | ✅ | P0 | **M1 已交付** |
| Omron FINS | [Omron FINS TCP/采集驱动Omron FINS TCP开发.md](./Omron%20FINS%20TCP/采集驱动Omron%20FINS%20TCP开发.html) | `omron-fins` | ✅ | ✅ | — | 已完成 |
| SNMP | [SNMP/SNMP采集驱动开发.md](./SNMP/SNMP采集驱动开发.html) | `snmp` | ✅ | ✅ | P1 | **v2c/v3 已交付** |
| DL/T 645-2007 | [DLT-645-2007/DL-T-645-2007驱动开发.md](./DLT-645-2007/DL-T-645-2007驱动开发.html) | `dlt645` | 🟡 | ✅ | P2 | 模拟实现 |
| Modbus / OPC UA / S7 / BACnet / EIP | — | 各现有 ID | ✅ | ✅ | — | 已完成 |

**ICE104 M1 范围**（2026-06-27）：TCP 链路、TESTFR/STARTDT、总召唤读、自发上报缓存、单点遥控、decoder/transport 单测。

**ICE104 M2 待办**：时钟同步、遥脉召唤、双点遥控/设定值、S 帧窗口完整实现、模拟器联调报告。

---

## 3. 平台 TODO 状态

| 主题 | 文档 | 状态 |
|------|------|------|
| ScanEngine 重构 | [ScanEngine重构方案.md](./ScanEngine重构方案.html) | ✅ 已落地 |
| ScanEngine 测试 | [ScanEngine重构测试报告.md](./ScanEngine重构测试报告.html) | ✅ |
| 通道设备状态 | Q3 §6.1 A2 + `channel_device_state.go` | ✅ |
| 联机测试 | [联机测试方案.md](./联机测试方案.html) | 进行中 |
| libp2p 同步 | [基于go-libp2p 同步通信规划方案.md](./基于go-libp2p%20同步通信规划方案.html) | 规划中 |
| 双向通信测试 | [南向北向双向通信测试报告.md](./南向北向双向通信测试报告.html) | 部分完成 |

---

## 4. 分期建议（Q3 后）

| 阶段 | 时间 | 目标 |
|------|------|------|
| **M1** | 已完成 | 统一数据面 + Scan Class + 通道设备状态 |
| **M2** | 2026 Q4 | ICE104 M2 + SNMP 联机压测 + 1w Tag 压测报告 |
| **M3** | 2026 Q4 | Store & Forward 联调 + libp2p 同步 MVP |

---

## 5. 验收标准（驱动类 TODO）

| 项 | 标准 |
|----|------|
| 编译 | `go test ./internal/driver/...` 通过 |
| 注册 | `driver.GetDriver("<id>")` 非 nil |
| 采集闭环 | ScanEngine 周期读 → Shadow → Pipeline 四路一致 |
| 通道状态 | 通道断连后同通道设备 Offline |
| UI | 协议可选、帮助文档可打开 |
| 文档 | TODO 文档 §2 架构图与本文 §1 一致 |

---

*维护：架构组 | 下次审查：ICE104 M2 完成时*
