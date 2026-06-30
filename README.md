# Industrial Edge Gateway

[中文文档站点](https://anviod.github.io/edgex/) | [English](#english)

Industrial Edge Gateway（工业边缘网关）是一款轻量级工业边缘计算网关软件，面向制造、能源、楼宇等现场部署。后端采用 Go，管理界面采用 Vue 3 + Vuetify。

## 产品概览

Industrial Edge Gateway 部署在工业现场，核心任务是打通 OT 设备与 IT 系统之间的数据通道，实现：

- **海量设备连接与数据接入**：通过 12 种南向工业协议驱动，统一采集 PLC、DCS、表计、楼宇控制器及网络设备数据；ScanEngine 调度内核负责采集任务编排，写入 ShadowCore 影子设备实时快照。
- **边缘智能处理与联动**：在靠近数据源的边缘端，基于 expr 规则引擎完成逻辑判断、位运算、读-改-写（RMW）及 Sequence/Delay/Check 工作流编排；**虚拟影子设备**（Virtual Shadow Engine）从多台真实设备选点映射或公式聚合，生成派生虚拟点位，实现本地联动控制与跨设备指标汇总，减轻上行带宽压力。
- **多系统无缝集成**：通过 MQTT、Sparkplug B、OPC UA Server 及 EdgeOS（MQTT/NATS）等北向通道，将处理后的数据对接云平台、SCADA 与企业应用，并支持反向写控。


## 产品优势

### 丰富的工业协议支持

内置 12 种南向驱动，覆盖 Modbus、BACnet、OPC UA、Siemens S7、EtherNet/IP、Omron FINS、SNMP、IEC 60870-5-104、DL/T645、Mitsubishi SLMP、Profinet IO、KNXnet/IP 等主流工业协议。支持设备发现、对象扫描与批量点位注册，满足 PLC、表计、楼宇与电力等场景的异构接入需求。完整驱动矩阵见 [南向驱动文档](docs/drivers/index.md)。

### 低延迟数据采集与处理

ScanEngine 以 10ms Tick 驱动优先级队列调度，ExecutionLayer 按 Serial / Parallel / Limited 模式隔离执行；ShadowCore 以纯内存快照作为数据真源（SoT），UI、边缘计算与北向接口统一从影子设备读取，缩短数据流转路径。WebSocket 实时推送点位变化，支持通道级 TCP 链路监控。

### 轻量灵活部署

单二进制交付，`CGO_ENABLED=0` 静态编译，无运行时依赖；最低 128MB 内存、1GB 存储即可运行，支持 x86_64、ARMv7、ARM64。可选 Docker 镜像部署，适合树莓派、工业网关、虚拟机及嵌入式设备。

### 边缘规则与联动控制

内置轻量级 expr 规则引擎，扩展工业位操作语法（`v.N` / `v.bit.N`、bitget/bitset 等），支持寄存器 RMW 写保护其他位状态。规则可编排 Sequence（序列）、Delay（延时）、Check（条件检查）等工作流，配套规则运行日志查询与 CSV 导出。

### 虚拟影子设备

Virtual Shadow Engine 从多台真实设备选点拼积木：直接映射来源点位，或通过公式计算生成新的虚拟点位；结果写入 ShadowCore，供边缘计算规则、北向接口与 UI 实时查询统一消费。数据路径为 **南向采集 → 真实影子设备 → Virtual Shadow Engine → 虚拟影子设备 → 边缘计算 / 北向 / UI**；真实点位更新后，引擎解析依赖图并增量重算，写入 `virtual-{id}` 影子。

支持 **直接映射**（1:1 转发真实点位值，适合跨设备汇聚、点位整理与北向暴露）与 **公式计算**（引用 `channel_id.device_id.point_id` 格式来源，支持 `+ - * /` 与括号，用于跨设备求和/平均、倍率换算等派生指标）。积木编辑器支持批量映射、公式模板与依赖引用自动解析。典型场景：跨设备流量汇总、多路温度平均供越限规则、分散点位统一 MQTT/OPC UA 上报、工程单位换算。

### 智能采集优化

基于设备画像的自适应采集：RTT 管理器（EWMA 动态超时）、MTU 管理器（批量读包大小探测）、Gap 优化器（请求间隔调节）及 Modbus Illegal Address 24h 冷却。统一 ConnectionManager 提供指数退避重连、采集健康检测与低频补偿探测，提升总线通信效率与稳定性。

### 北向平台集成

支持 MQTT（自定义 Topic/Payload 模板）、Sparkplug B（NBIRTH/NDEATH/DDATA）、OPC UA Server（双向读写互通）及 EdgeOS 北向通道，便于对接 EMQX、Ignition、云平台及自建数据中心。

## 功能一览

| 功能 | 描述 | 功能清单 |
| :--- | :--- | :--- |
| **数据采集** | 南向通道与设备管理，多协议统一接入，ScanEngine 调度采集并写入影子设备 | 12 种协议驱动 · 通道/设备 CRUD · 设备/对象扫描 · ScanEngine 调度 · ShadowCore 快照 · 通道 TCP 监控 · ConnectionManager 重连 |
| **数据上报** | 将影子设备数据转发至云平台或上层系统，支持反向控制 | MQTT · Sparkplug B · OPC UA Server · EdgeOS（MQTT/NATS） · Topic/Payload 映射 · 反向写控 |
| **虚拟影子设备** | Virtual Shadow Engine 从多台真实设备选点，直接映射或公式计算生成派生虚拟点位 | 直接映射 · 公式计算 · 积木编辑器 · 依赖图增量重算 · 跨通道聚合 · 北向/UI 统一暴露 |
| **边缘计算** | 基于 expr 规则的本地联动与位操作，减少无效上行 | expr 表达式 · 位运算增强 · RMW 写 · Sequence/Delay/Check 工作流 · 规则日志 |
| **系统管理** | Web 可视化运维与配置管理 | Vue 3 管理 UI · JWT / LDAP/AD · 安装向导 · config.db 配置 · 日志查询/导出 · WebSocket 实时数据 |

## 系统架构

<div align="center">
  <img src="./docs/img/dataScanEngineCN.svg" width="100%" alt="Edgex V2.0 架构 · ScanEngine引擎">
</div>

> **Edgex V2.0 架构 · ScanEngine 统一调度**：12 种南向驱动经 ScanEngine 写入真实影子设备快照，Virtual Shadow Engine 生成虚拟影子设备，再联通边缘计算与北向接口。

网关面向工业现场部署，支持多协议南向采集、北向数据共享、规则引擎与可视化运维。核心数据路径遵循 **调度驱动架构**（ScanEngine 内核）：

```text
config.db → ChannelManager → ScanEngine（10ms Tick · PriorityQueue）
                                    ↓ dispatch
                              ExecutionLayer（Serial / Parallel / Limited）
                                    ↓
                              Driver.ReadPoints（纯执行 · ConnectionManager 重连）
                                    ↓
                              ShadowCore (SoT) — 真实影子设备
                                    ↓
                         Virtual Shadow Engine → 虚拟影子设备
                                    ↓
                         ShadowBridge → DataPipeline
                                    ↓
              WebSocket / EdgeCompute / Northbound / 历史值
```

| 组件 | 职责 |
| :--- | :--- |
| **ChannelManager** | 通道/设备 CRUD、驱动生命周期、`ScanEngineAdapter` 任务注册 |
| **ScanEngine** | 内核调度器：时间/资源/执行/状态闭环；Scan Class（fast/normal/slow） |
| **ExecutionLayer** | SerialQueueManager 硬隔离 + Parallel 三层背压 + Limited 低并发 |
| **ShadowCore** | 影子设备真源（SoT），纯内存运行时快照，承载真实与虚拟影子设备，UI 与北向统一读 Shadow |
| **Virtual Shadow Engine** | 跨设备点位映射与公式计算，依赖图增量重算，写入 `virtual-{id}` 虚拟影子设备 |
| **ConnectionManager** | 唯一 dial Owner：EnsureConnected / ScheduleReconnect / single-flight |

**北向协议**：MQTT、Sparkplug B、OPC UA Server、edgeOS(MQTT/NATS)。

**近期进展**（2026-06）：ScanEngine **调度驱动内核**已落地（ExecutionLayer + ResourceController + 调度闭环）；CollectionScheduler/deviceLoop 已移除；Modbus/DLT645 重连已统一至 ConnectionManager。

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
| [GoReleaser](https://goreleaser.com/) v2 | 最新版 | 一键多平台打包 |

支持 Linux / Windows，架构：x86_64、ARMv7、ARM64。

### 2. 编译方式

#### 一键多平台打包（推荐）

项目使用 [GoReleaser](https://goreleaser.com/)（`.goreleaser.yml`）统一构建前端与后端，并生成分平台安装包。GoReleaser 内置 nfpm，用于生成 `.deb` 包，无需单独安装 nfpm。

```bash
# 安装 GoReleaser（任选其一）
go install github.com/goreleaser/goreleaser/v2@latest
# 或 brew install goreleaser

# 在仓库根目录执行：清理 dist/ 并构建（snapshot 模式，不发布 GitHub Release）
goreleaser release --snapshot --clean
```

**构建流水线**（`before.hooks`）：

1. `go mod tidy` — 整理 Go 依赖  
2. `npm run build --prefix ./ui` — 构建 Vue 前端至 `ui/dist/`

**交叉编译目标**（`CGO_ENABLED=0`，入口 `./cmd/main.go`，二进制名 `edgex`）：

| 平台 | 架构 |
| :--- | :--- |
| Linux | amd64、arm64、arm/v7 |
| Windows | amd64（不含 arm/arm64） |

**产物目录** `./dist/`：

| 类型 | 说明 |
| :--- | :--- |
| **tar.gz** | `edgex-{version}-{os}-{arch}.tar.gz`，含二进制、`conf/`、`scripts/`、`edgex.service`、`edgex.sh`、`ui/dist/` 等 |
| **deb** | `edgex-v{version}-{arch}.deb`，安装至 `/usr/local/bin/edgex`，含 systemd 单元与前端静态资源 |
| **SHA256SUMS** | 各产物校验和 |

版本信息通过 ldflags 注入：`Version`、`BuildTime`、`CommitID`（snapshot 模式下版本号为 snapshot 标识）。

> **snapshot vs 正式发布**：`--snapshot` 仅本地/CI 构建，不上传 Release。推送 `v*` 标签并执行 `goreleaser release`（无 `--snapshot`）时，按配置创建 **draft** GitHub Release（`release.draft: true`）。

#### 手动编译（开发 / 单平台）

```bash
git clone https://github.com/anviod/edgex.git
cd edgex
go mod tidy

# 后端：静态编译，无 CGO 依赖
CGO_ENABLED=0 go build -o edgex ./cmd/main.go

# 前端（生产环境推荐，产物由后端托管 ui/dist）
cd ui && npm install && npm run build && cd ..
```

### 3. 目录与配置

| 路径 | 说明 |
| :--- | :--- |
| `data/` | 运行时数据目录；`config.db` 存储配置（首次启动为空则进入安装向导） |
| `logs/` | 运行日志（默认 `logs/gateway.edgex.log`） |
| `conf/` | 遗留 YAML 配置，用于一次性迁移（`-conf` 参数指定，默认 `./conf`） |

首次启动若 `data/config.db` 不存在，网关以安装模式启动，通过 Web UI 完成初始化。

### 4. 启动服务

```bash
# 默认配置目录 ./conf，HTTP 端口见 server 配置（常见 8080/8082）
./edgex

# 指定遗留 YAML 迁移目录
./edgex -conf ./conf/
```

访问 `http://localhost:<port>` 进入管理界面。默认账号见安装向导或 `conf/users.yaml`。

### 5. Docker 部署（可选）

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

### 6. 生产部署参考

- **systemd 服务、防火墙端口、配置初始化**：见 [用户手册 — 部署流程](docs/guide/USER_MANUAL.md#部署流程)
- **EdgeOS 集成与北向通道**：见 [EdgeOS 快速入门](docs/deployment/edgeos-quickstart.md)
- **多从站 Modbus 配置**：见 [多从站快速入门](docs/deployment/QUICK_START_MULTI_SLAVE.md)
- **完整部署文档索引**：[docs/deployment/](docs/deployment/index.md) | [GitHub Pages 部署指南](https://anviod.github.io/edgex/deployment/)

---

## 南向驱动开发进度

> 注册来源：`cmd/main.go` 空白导入 · 测试日期：2026-06-27 · `CGO_ENABLED=0`

| 协议 | 注册名 | 状态 | 读 | 写 | 扫描/发现 | 单元测试 | 文档 |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| Modbus TCP/RTU/RTU-over-TCP | `modbus-tcp`, `modbus-rtu`, `modbus-rtu-over-tcp` | 生产就绪 | 是 | 是 | — | 33 项 / 27% | [Modbus 优化](docs/drivers/MODBUS_OPTIMIZATION.md) |
| BACnet IP | `bacnet-ip` | 生产就绪 | 是 | 是 | Scan + ScanObjects | 80+ 项 / 59% | [BACnet 设计说明](docs/drivers/BACnet_设计说明.md) |
| OPC UA Client | `opc-ua` | 生产就绪 | 是 | 是 | Scan + ScanObjects | 25 项 / 40% | [OPC UA 设计](docs/drivers/OPC_UA_Design.md) |
| Siemens S7 | `s7` | 生产就绪 | 是 | 是 | — | 52 项 / 42% | [S7 协议](docs/drivers/PLC_S7.md) |
| EtherNet/IP (ODVA) | `ethernet-ip` | 生产就绪 | 是 | 是 | — | 60 项 / 30% | [EIP 实现方案](docs/drivers/EtherNet_IP驱动真实通信实现方案.md) |
| Omron FINS (TCP/UDP) | `omron-fins` | 生产就绪 | 是 | 是 | — | 12 项 / 31% | [FINS 协议](docs/drivers/PLC_FINS.md) |
| SNMP v2c/v3 | `snmp` | 生产就绪 | 是 | 是 | ScanObjects | 22 项 / 45% | [SNMP 驱动](docs/drivers/SNMP.md) |
| IEC 60870-5-104 | `iec60870-5-104` | M1 已交付 | 是 | 单点遥控 | — | 16 项 / 45% | [ICE104 开发计划](docs/TODO/ICE104/采集驱动ICE104开发.md) |
| DL/T645-2007 | `dlt645` | 已实现 | 是 | 是 | — | 24 项 / 71% | [DL/T645 驱动](docs/drivers/DLT645.md) |
| Mitsubishi SLMP (MC) | `mitsubishi-slmp` | 生产就绪 | 是 | 是 | — | 13 项 / 57% | [三菱 MC 驱动](docs/drivers/PLC_MITSUBISHI.md) |
| Profinet IO | `profinet-io` | 已实现 | 是 | 是 | — | 11 项 / 49% | [Profinet IO](docs/drivers/PLC_Profinet_IO.md) |
| KNXnet/IP | `knxnet-ip` | 生产就绪 | 是 | 是 | 网关发现 | 13 项 / 67% | [设备驱动](docs/drivers/index.md) |

**状态说明**

| 状态 | 含义 |
| :--- | :--- |
| 生产就绪 | 协议栈完整，具备现场联调与单元/场景测试覆盖 |
| M1 已交付 | 核心功能可用，后续里程碑（M2）待完成 |
| 已实现 | 代码已实现并通过单元测试，待现场设备联调验收 |

**ICE104 M1 范围**：TCP 链路、TESTFR/STARTDT、总召唤读、自发上报缓存、单点遥控。M2 待办：时钟同步、遥脉召唤、双点遥控/设定值、S 帧窗口、模拟器联调报告。

**DL/T645 / Profinet IO**：协议读写与连接管理已实现；单元测试以 Mock 链路/模拟器为主，现场设备联调验收进行中。

驱动开发规范与 Q3 架构约束：[docs/TODO/index.md](docs/TODO/index.md)

---

## 用户手册

完整操作指南：[docs/guide/USER_MANUAL.md](docs/guide/USER_MANUAL.md)  
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

**2026-06-28 测试结果**：`CGO_ENABLED=0 go test ./internal/driver/... ./internal/core/... ./internal/integration/...` 全部通过。12 个南向驱动生产路径均使用真实协议栈；驱动包覆盖率约 27–70%；`internal/core/...` 覆盖率 48.0%。

详细报告：[南向驱动测试报告](docs/testing/南向驱动测试报告.md) | [GitHub Pages](https://anviod.github.io/edgex/testing/南向驱动测试报告.html)

---

## 文档索引

| 类别 | 链接 |
| :--- | :--- |
| 文档站点（GitHub Pages） | [https://anviod.github.io/edgex/](https://anviod.github.io/edgex/) |
| 驱动文档 | [docs/drivers/](docs/drivers/index.md) |
| 部署指南 | [docs/deployment/](docs/deployment/index.md) |
| 架构设计 | [docs/architecture/](docs/architecture/index.md) |
| 开发计划 / TODO | [docs/TODO/](docs/TODO/index.md) |
| Q3 南向采集优化方案 | [docs/[TODO]边缘计算南向采集优化方案2026第三季度.md](docs/[TODO]边缘计算南向采集优化方案2026第三季度.md) |
| 测试验证 | [docs/testing/](docs/testing/index.md) |
| 运维参考 | [docs/operations/](docs/operations/index.md) |

---

## 快速开始（开发）

```bash
go mod tidy
go run cmd/main.go          # 后端，默认 -conf ./conf
cd ui && npm install && npm run build && cd ..   # 前端（可选）
```

默认管理端口取决于 `server` 配置；BACnet 需开放 UDP 47808。

---

## 相关文档

- **产品说明**：[docs/guide/产品说明.md](docs/guide/产品说明.md) · [在线阅读](https://anviod.github.io/edgex/guide/%E4%BA%A7%E5%93%81%E8%AF%B4%E6%98%8E.html)
- **用户手册**：[docs/guide/USER_MANUAL.md](docs/guide/USER_MANUAL.md)

---

## License

Mozilla Public License 2.0 (MPL-2.0)

---

## English

Industrial Edge Gateway is a lightweight edge computing gateway for industrial IoT. It connects southbound field devices (12 protocols: Modbus, BACnet, OPC UA, S7, EtherNet/IP, FINS, SNMP, IEC 104, DL/T645, Mitsubishi MC, Profinet IO, KNXnet/IP) to northbound systems (MQTT, Sparkplug B, OPC UA Server, EdgeOS) with local rule-based edge computing (expr, RMW, workflows).

**Product overview**: mass device connectivity · edge rule processing · multi-system integration.

- **Documentation**: [https://anviod.github.io/edgex/](https://anviod.github.io/edgex/)
- **Product Guide (中文)**: [产品说明](https://anviod.github.io/edgex/guide/%E4%BA%A7%E5%93%81%E8%AF%B4%E6%98%8E.html)
- **User Manual**: [USER_MANUAL](docs/guide/USER_MANUAL.md)
- **Build**: `CGO_ENABLED=0 go build -o edgex ./cmd/main.go`
- **Tests**: `CGO_ENABLED=0 go test ./...`
- **Driver matrix**: See [docs/drivers/index.md](docs/drivers/index.md)
