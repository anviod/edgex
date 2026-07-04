# test/ 目录说明

本目录存放**联调脚本、抓包样本、驱动手工测试笔记**及配置归档。运行时网关以数据库为配置源（`internal/config` → `data/config.db`），下列文件**不直接被 `go test` 加载**，供文档引用、手工联调或导入参考。

## 目录结构

| 路径 | 说明 |
|------|------|
| [`legacy/`](legacy/README.md) | 已废弃配置格式与全量快照归档 |
| [`manual/`](manual/README.md) | 驱动联调/验收笔记（BACnet、EtherNet/IP 等） |
| `verify_bacnet.go` | BACnet API 联调脚本 |
| `test_api.sh` | HTTP API 冒烟脚本 |
| `test_ethernet-ip.py` · `ethernet_ip_server_v3.py` | EtherNet/IP 模拟器与联调脚本 |
| `ice104-python-server/` | IEC 104 Python 模拟从站 |
| `slave1_points.json` | Modbus 从站 1 点位 JSON 样本 |
| `*.pcap` · `*.pcapng` | BACnet 发现/Who-Is 抓包样本 |
| `上位机监控表PLC.csv` | S7/PLC 点位导入样本 |

> **说明**：根目录曾有的 v2 示例 YAML（`config_v2_three_level.yaml`、`config_multi_slave.yaml`、`channels.yaml`）已移除，避免与 `docs/deployment/` 及 `conf/` 示例重复。现行 schema 与片段见下方「配置参考」；历史全量见 `legacy/`。

## 配置参考（v2 三级架构）

运行时以 **`data/config.db`** 为准；下列为文档与联调用的参考来源，非 CI 依赖。

| 来源 | 用途 |
|------|------|
| [三级架构快速入门](../docs/deployment/QUICK_START_THREE_LEVEL.md) | v2 `channels` → `devices` → `points` 标准说明与 API 示例 |
| [多从站指南](../docs/deployment/MULTI_SLAVE_GUIDE.md) | 同通道多 `slave_id` 配置与 `BatchAddModbusSlaves` |
| [产品说明 — 配置结构](../docs/guide/产品说明.md#配置结构) | BACnet 等通道 YAML 片段 |
| `legacy/config_full_snapshot.yaml.bak` | 联调网关配置导出备份（全量 v2 快照，非 schema 模板） |
| `legacy/config_multi_slave_legacy.yaml` | 2026-01 `devices` + `slaves:` 嵌套格式（已废弃） |

### v2 schema 要点

```yaml
channels:                          # 第一级：采集通道（驱动 + 连接参数）
  - id: "modbus-tcp-1"
    protocol: "modbus-tcp"
    config:
      url: "tcp://127.0.0.1:502"
    devices:                       # 第二级：从站/设备（每 slave_id 一个 Device）
      - id: "slave-1"
        interval: 5s
        config:
          slave_id: 1              # Modbus Unit ID
        points:                    # 第三级：点位
          - id: "dev1_temp"
            address: "40001"
            datatype: "int16"
```

采集由 **ScanEngine** 按 Device `interval` 调度；同通道多从站通过 `config.slave_id` + 驱动内 `SetSlaveID` 实现。

## Legacy 归档

已废弃的 `devices` + `slaves:` 嵌套格式及全量配置快照见 [`legacy/`](legacy/README.md)：

| 文件 | 说明 |
|------|------|
| `legacy/config_multi_slave_legacy.yaml` | 原 2026-01 多从站嵌套格式 |
| `legacy/config_full_snapshot.yaml.bak` | 联调/手工测试时的网关配置导出备份 |

**请勿用于新部署或 CI。**

## 常用 `go test` 命令

### 南向采集通道回归（2026-07-04 门禁）

与 [南向采集通道回归验证测试方案](../docs/testing/南向采集通道回归验证测试方案.md) §五 一致；日志输出至 `docs/testing/_run_logs/`：

```bash
# Week1 自动化 gate（按序执行）
CGO_ENABLED=0 go test ./internal/core/... -short -count=1
CGO_ENABLED=0 go test ./internal/driver/... -short -count=1
CGO_ENABLED=0 go test ./internal/integration/... -short -count=1
make test-soak-short          # SOAK_DURATION=30 可覆盖
make bench-q3
make bench-g007
```

| 命令 | 2026-07-04 结果 | 说明 |
|------|-----------------|------|
| core `-short` | ✅ PASS | ScanEngine / ShadowCore |
| driver `-short` | ⚠️ FAIL（根包 1 用例） | 子包全 PASS |
| integration `-short` | ✅ PASS | 集成冒烟 |
| `make test-soak-short` | ✅ PASS | 五 gate |
| `make bench-q3` | ✅ PASS | 10k tag deadline |
| `make bench-g007` | ⚠️ WARN | ≥950 设备/秒边界 |

联机回归（A–G）步骤与排期见方案 §八；资产见本目录 `manual/` 与 `legacy/`。

默认 CI 友好包（与用户验收命令一致）：

```bash
# 核心 + BACnet + SNMP + 配置（-short 跳过长跑/压测）
CGO_ENABLED=0 go test ./internal/core/... \
  ./internal/driver/bacnet/... \
  ./internal/driver/snmp/... \
  ./internal/config/... \
  -short -count=1
```

Makefile 目标（`make` 在仓库根目录）：

| 命令 | 说明 |
|------|------|
| `make test-short` | `internal/core` + `internal/integration`，`-short` |
| `make test` | 同上，含长跑用例（无 `-short`） |
| `make test-soak-short` | Soak 短门控（默认 ~30s，`SOAK_DURATION` 可覆盖） |
| `make test-soak` | 完整 Soak（`-tags=soak`，默认 1h，`timeout=2h`） |
| `make bench-q3` | 万 Tag Q3 压测（`TestQ3_TenThousandTagBenchmark`） |

其他常用片段：

```bash
# 全仓（macOS 上 internal/server、internal/sync 等可能因 TLS 链接失败）
CGO_ENABLED=0 go test ./... -short -count=1

# 仅集成层短测
CGO_ENABLED=0 go test ./internal/integration/... -short -count=1

# Q3 万 Tag 基准（非 short）
CGO_ENABLED=0 go test ./internal/core/ -run TestQ3_TenThousandTagBenchmark -count=1 -timeout=15m
```

## 相关文档

- [测试验证索引](../docs/testing/index.md) — SLA 压测、Soak、南向驱动验收报告
- [三级架构快速入门](../docs/deployment/QUICK_START_THREE_LEVEL.md)
- [多从站指南](../docs/deployment/MULTI_SLAVE_GUIDE.md)
- [南向驱动矩阵](../docs/drivers/index.md)

## 测试维护原则

CI 与本地 `go test ./...` 以**现行实现**为准。测试腐化时按下列规则处理，勿留占位或重复：

| 情况 | 处理 |
|------|------|
| 永久 `t.Skip` / 空函数体占位 | **删除** |
| 同包重复测试函数名 | **合并**或删弱版，保留更有价值的断言 |
| 测试已移除的 production 符号 | **删除**或改测 ScanEngine / 驱动现行路径 |
| `coverage_test.go` 断言与实现不一致 | **以实现为准更新断言**，或删无效 case |
| 引用 legacy 配置（`devices` + `slaves:` 等） | 改用 v2 示例，或归档至 `test/legacy/` |
| 驱动 `//go:build manual` | **保留**，供手工联调，不参与默认 CI |

**macOS 链接失败（`SecTrustCopyCertificateChain`）**：Go 工具链与 macOS SDK 版本不匹配所致，非业务代码问题。升级 Go / Xcode Command Line Tools，或在 Linux CI 上跑全量测试；`internal/server`、`internal/sync` 等依赖 TLS 的包在旧 macOS 上可能无法链接。
