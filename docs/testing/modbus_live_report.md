# Modbus 联机验证报告（仿真器）

> **日期：** 2026-07-02  
> **环境：** darwin/amd64，Go 1.26，内置 Modbus TCP 仿真器（`internal/testutil/modbus/simulator.go`）  
> **说明：** 现场 diagslave 不可用时，以仿真器 + 真实 `ModbusDriver` 作为 B-10 联机替代验证。

## 1. 测试范围

| 用例 | 文件 | 验证点 |
|------|------|--------|
| 真实驱动 ScanEngine 采集 | `modbus_protocol_test.go` | 3 从站 200ms 周期，TasksSucceeded ≥ 3 |
| 可变延迟隔离 | 同上 | 慢从站 3s 延迟不阻塞快从站 2s 内完成 |
| 7 从站串行故障传播 | 同上 | slave-6 离线，6/7 健康；CB 不拖死 peer |
| CB 离线/恢复循环 | `TestModbusProtocol_CBRecoveryCycles` | 3 轮 block/unblock，channel 保持采集 |

## 2. 执行命令

```bash
go test ./internal/integration/... -run 'TestModbusProtocol' -count=1 -timeout=5m
```

## 3. 结果摘要（2026-07-02）

| 指标 | 阈值（联机/仿真） | 实测 |
|------|-------------------|------|
| 快从站读取 | Quality=Good，<2s | ✅ 通过 |
| 慢从站延迟 | ≥2s 或 timeout | ✅ 通过（3s 注入） |
| 串行 7 从站健康比 | ≥6/7 online 等效 | ✅ succeeded≥3，healthy slave Good |
| CB 循环后采集 | channel 不 Offline | ✅ succeeded≥10 |
| timeout 比例 | <5%（长时） | 未跑 1h；短测 0% |

## 4. 与 diagslave 差异

- 仿真器支持 per-slave 延迟注入、`BlockSlave`、holding 寄存器种子
- 无真实 RS485/TCP 物理层抖动；**发版前建议在目标网关 + diagslave 复验**
- 框架与 `ModbusDriver` 路径与生产一致（Init → ReadPoints → ScanEngine serial queue）

## 5. 相关文件

- `internal/testutil/modbus/simulator.go`
- `internal/integration/modbus_protocol_test.go`
- `docs/TODO/SLA评估.md` B-10
