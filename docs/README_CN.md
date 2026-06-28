# Industrial Edge Gateway

[文档站点](https://anviod.github.io/edgex/) | [English](#english)

Industrial Edge Gateway（边缘网关）是一款轻量级工业边缘计算网关，连接工业现场设备（南向）与云端/上层应用（北向），并提供本地边缘计算能力。后端采用 Go，管理界面采用 Vue 3 + Vuetify。

<div align="center">
  <img src="./img/dataMain_CN.svg" width="100%">
</div>

## 项目概述

网关面向工业现场部署，支持多协议南向采集、北向数据共享、规则引擎与可视化运维。核心数据路径遵循 Q3 架构：

```text
config.db → ChannelManager → ScanEngine → ExecutionLayer → Driver.ReadPoints
                                    ↓
                              ShadowCore (SoT)
                                    ↓
                         ShadowBridge → DataPipeline
                                    ↓
              WebSocket / EdgeCompute / Northbound / 历史值
```

| 组件 | 职责 |
| :--- | :--- |
| **ChannelManager** | 通道与驱动生命周期管理；通道断连时同通道设备标记 Offline |
| **ScanEngine** | 按 Scan Class（fast/normal/slow）调度采集；驱动仅实现 ReadPoints/WritePoint |
| **ShadowCore** | 影子设备真源（SoT），WAL 持久化，UI 与北向读 Shadow |
| **ConnectionManager** | 统一连接状态机、指数退避、冷却期与采集健康检测 |

**北向协议**：MQTT、Sparkplug B、OPC UA Server、edgeOS(MQTT/NATS)。

**近期进展**（2026-06）：ScanEngine 重构已落地；新增 SNMP、IEC 104、DL/T645、Mitsubishi SLMP、Profinet IO、KNXnet/IP 驱动注册；通道设备状态跟踪；文档站点全面更新。

---

## 部署流程

### 1. 环境要求

| 项目 | 最低 | 推荐 |
| :--- | :--- | :--- |
| 内存 | 128MB | 512MB+ |
| 存储 | 1GB | 4GB+ |
| CPU | 单核 | 双核+ |
| Go（源码编译） | 1.25+ | — |
| Node.js（前端编译） | 16+ | — |

支持 Linux / Windows，架构：x86_64、ARMv7、ARM64。

### 2. 编译后端

```bash
git clone https://github.com/anviod/edgex.git
cd edgex
go mod tidy

# 推荐：静态编译，无 CGO 依赖
CGO_ENABLED=0 go build -o edgex ./cmd/main.go
```

### 3. 编译前端（可选，生产环境推荐）

前端源码位于仓库 `ui/`，构建产物由后端托管 `ui/dist`：

```bash
cd ui
npm install
npm run build
cd ..
```

### 4. 目录与配置

| 路径 | 说明 |
| :--- | :--- |
| `data/` | 运行时数据目录；`config.db` 存储配置（首次启动为空则进入安装向导） |
| `logs/` | 运行日志（默认 `logs/gateway.edgex.log`） |
| `conf/` | 遗留 YAML 配置，用于一次性迁移（`-conf` 参数指定，默认 `./conf`） |

首次启动若 `data/config.db` 不存在，网关以安装模式启动，通过 Web UI 完成初始化。

### 5. 启动服务

```bash
# 默认配置目录 ./conf，HTTP 端口见 server 配置（常见 8080/8082）
./edgex

# 指定遗留 YAML 迁移目录
./edgex -conf ./conf/
```

访问 `http://localhost:<port>` 进入管理界面。默认账号见安装向导或 `conf/users.yaml`。

### 6. Docker 部署（可选）

```bash
docker pull anviod/edgex:latest

docker run -d \
  --name edgex \
  -p 8082:8082 \
  -p 47808:47808/udp \
  -v /path/to/data:/opt/edgex/data \
  --restart unless-stopped \
  anviod/edgex:latest
```

### 7. 生产部署参考

- **systemd 服务、防火墙端口、配置初始化**：见 [用户手册 — 部署流程](guide/USER_MANUAL.md#部署流程)
- **EdgeOS 集成与北向通道**：见 [EdgeOS 快速入门](deployment/edgeos-quickstart.md)
- **多从站 Modbus 配置**：见 [多从站快速入门](deployment/QUICK_START_MULTI_SLAVE.md)
- **完整部署文档索引**：[deployment/](deployment/index.md) | [GitHub Pages 部署指南](https://anviod.github.io/edgex/deployment/)

---

## 南向驱动开发进度

> 注册来源：`cmd/main.go` 空白导入 · 测试日期：2026-06-27 · `CGO_ENABLED=0`

| 协议 | 注册名 | 状态 | 读 | 写 | 扫描/发现 | 单元测试 | 文档 |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| Modbus TCP/RTU/RTU-over-TCP | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` | 生产就绪 | 是 | 是 | — | 33 项 / 27% | [Modbus 优化](drivers/MODBUS_OPTIMIZATION.md) |
| Modbus Simple | `modbus-*-simple` | 生产就绪 | 是 | 是 | — | 同上 | 同上 |
| BACnet IP | `bacnet-ip` | 生产就绪 | 是 | 是 | Scan + ScanObjects | 80+ 项 / 59% | [BACnet 设计说明](drivers/BACnet_设计说明.md) |
| OPC UA Client | `opc-ua` | 生产就绪 | 是 | 是 | Scan + ScanObjects | 25 项 / 40% | [OPC UA 设计](drivers/OPC_UA_Design.md) |
| Siemens S7 | `s7` | 生产就绪 | 是 | 是 | — | 52 项 / 42% | [S7 协议](drivers/PLC_S7.md) |
| EtherNet/IP (ODVA) | `ethernet-ip` | 生产就绪 | 是 | 是 | — | 57 项 / 30% | [EIP 实现方案](drivers/EtherNet_IP驱动真实通信实现方案.md) |
| Omron FINS (TCP/UDP) | `omron-fins` | 生产就绪 | 是 | 是 | — | 6 项 / 25% | [FINS 协议](drivers/PLC_FINS.md) |
| SNMP v2c/v3 | `snmp` | 生产就绪 | 是 | 是 | ScanObjects | 15 项 / 34% | [SNMP 驱动](drivers/SNMP.md) |
| IEC 60870-5-104 | `iec60870-5-104` | M1 已交付 | 是 | 单点遥控 | — | 8 项 / 23% | [ICE104 开发计划](TODO/ICE104/采集驱动ICE104开发.md) |
| DL/T645-2007 | `dlt645` | 已实现 | 是 | 是 | — | 17 项 | [DL/T645 驱动](drivers/DLT645.md) |
| Mitsubishi SLMP (MC) | `mitsubishi-slmp` | 生产就绪 | 是 | 是 | — | 7 项 | [三菱 MC 驱动](drivers/PLC_MITSUBISHI.md) |
| Profinet IO | `profinet-io` | 已实现 | 是 | 是 | — | 6 项 | [Profinet IO 驱动](drivers/PLC_Profinet_IO.md) |
| KNXnet/IP | `knxnet-ip` | 生产就绪 | 是 | 是 | 网关发现 | 10 项 | [设备驱动](drivers/index.md) |

**状态说明**

| 状态 | 含义 |
| :--- | :--- |
| 生产就绪 | 协议栈完整，具备现场联调与单元/场景测试覆盖 |
| M1 已交付 | 核心功能可用，后续里程碑（M2）待完成 |
| 已实现 | 代码已实现并通过单元测试，待现场设备联调验收 |

**ICE104 M1 范围**：TCP 链路、TESTFR/STARTDT、总召唤读、自发上报缓存、单点遥控。M2 待办：时钟同步、遥脉召唤、双点遥控/设定值、S 帧窗口、模拟器联调报告。

**DL/T645 / Profinet IO**：协议读写与连接管理已实现；单元测试以 Mock 链路/模拟器为主，现场设备联调验收进行中。

驱动开发规范与 Q3 架构约束：[TODO/index.md](TODO/index.md)

---

## 用户手册

完整操作指南：[guide/USER_MANUAL.md](guide/USER_MANUAL.md)  
在线阅读：[https://anviod.github.io/edgex/guide/USER_MANUAL.html](https://anviod.github.io/edgex/guide/USER_MANUAL.html)

手册主要章节：

| 章节 | 内容 |
| :--- | :--- |
| 安装指南 | 系统要求、二进制/Docker/源码三种安装方式 |
| 部署流程 | 环境准备、防火墙、配置目录、systemd 服务、健康检查 |
| 南向采集 | 通道配置、设备发现、点位扫描、Modbus/BACnet/OPC UA/S7 等 12 种协议操作 |
| 北向数据共享 | MQTT、Sparkplug B、OPC UA Server、edgeOS 通道配置 |
| 边缘计算 | 规则引擎、表达式语法、Read-Modify-Write、工作流编排 |
| 系统管理 | 用户认证、LDAP/AD、日志查询与导出 |
| 故障排查 | 连接异常、采集质量、常见错误处理 |

---

## 测试状态

```bash
# 全量测试（推荐无 CGO 环境）
CGO_ENABLED=0 go test ./...

# 驱动包专项
CGO_ENABLED=0 go test ./internal/driver/... -count=1 -cover

# 核心包专项
CGO_ENABLED=0 go test ./internal/core/... -count=1 -cover
```

**2026-06-27 测试结果**：`CGO_ENABLED=0 go test ./...` 全部通过。驱动包汇总覆盖率约 12–59%（因协议而异）；`internal/core/...` 覆盖率 47.9%。

详细报告：[南向驱动测试报告](testing/南向驱动测试报告.md) | [GitHub Pages](https://anviod.github.io/edgex/testing/南向驱动测试报告.html)

---

## 文档索引

| 类别 | 链接 |
| :--- | :--- |
| 文档站点（GitHub Pages） | [https://anviod.github.io/edgex/](https://anviod.github.io/edgex/) |
| 驱动文档 | [drivers/](drivers/index.md) |
| 部署指南 | [deployment/](deployment/index.md) |
| 架构设计 | [architecture/](architecture/index.md) |
| 开发计划 / TODO | [TODO/](TODO/index.md) |
| Q3 南向采集优化方案 | [[TODO]边缘计算南向采集优化方案2026第三季度.md]([TODO]边缘计算南向采集优化方案2026第三季度.md) |
| 测试验证 | [testing/](testing/index.md) |
| 运维参考 | [operations/](operations/index.md) |

---

## 快速开始（开发）

```bash
go mod tidy
go run cmd/main.go          # 后端，默认 -conf ./conf
cd ui && npm install && npm run build && cd ..   # 前端（可选）
```

默认管理端口取决于 `server` 配置；BACnet 需开放 UDP 47808。

---

## 主要特性摘要

- **智能采集优化**：RTT/MTU 自适应、Gap 合并批量读、设备画像、Illegal Address 24h 冷却（Modbus）
- **连接管理**：统一 ConnectionManager 状态机，指数退避，采集健康检测，低频补偿探测
- **边缘计算**：expr 规则引擎，位运算增强，RMW 写，Sequence/Delay/Check 工作流
- **可视化管理**：Vue 3 管理 UI，通道 TCP 链路监控，点位批量操作，JWT + LDAP/AD
- **轻量部署**：单二进制，CGO_ENABLED=0 静态编译，128MB 内存可运行

---

## License

Mozilla Public License 2.0 (MPL-2.0)

---

## English

Industrial Edge Gateway is a lightweight edge computing gateway for industrial IoT. It connects southbound field devices (Modbus, BACnet, OPC UA, S7, EtherNet/IP, FINS, SNMP, IEC 104, DL/T645, Mitsubishi MC, Profinet IO, KNXnet/IP) to northbound systems (MQTT, Sparkplug B, OPC UA Server) with local rule-based edge computing.

- **Documentation**: [https://anviod.github.io/edgex/](https://anviod.github.io/edgex/)
- **User Manual**: [USER_MANUAL](guide/USER_MANUAL.md)
- **Build**: `CGO_ENABLED=0 go build -o edgex ./cmd/main.go`
- **Tests**: `CGO_ENABLED=0 go test ./...`
- **Driver matrix**: See [drivers/index.md](drivers/index.md) for the full southbound driver status table.
