# Industrial Edge Gateway

Industrial Edge Gateway 是一个轻量级的工业边缘计算网关，旨在连接工业现场设备（南向）与云端/上层应用（北向），并提供本地边缘计算能力。项目采用 Go 语言开发后端，Vue 3 开发前端管理界面。

## ✨ 主要特性

### 🔌 南向采集协议 (Southbound)

| 协议 | 状态 | 说明 |
| :--- | :--- | :--- |
| **Modbus TCP / RTU / RTU Over TCP** | ✅ 已实现 | 完整支持，基于 `simonvetter/modbus` |
| **BACnet IP** | ✅ 已实现 | 支持设备发现 (Who-Is/I-Am) 和点位读写 |
| **OPC UA Client** | 🚧 模拟中 | 目前为模拟实现，尚未对接真实 PLC |
| **Siemens S7** | 🚧 模拟中 | 支持 S7-200Smart/1200/1500 等 (模拟) |
| **EtherNet/IP (ODVA)** | 🚧 模拟中 | 模拟实现 |
| **Mitsubishi MELSEC (SLMP)** | 🚧 模拟中 | 模拟实现 |
| **Omron FINS (TCP/UDP)** | 🚧 模拟中 | 模拟实现 |
| **DL/T645-2007** | 🚧 模拟中 | 模拟实现 |

### ☁️ 北向上报协议 (Northbound)

| 协议 | 状态 | 说明 |
| :--- | :--- | :--- |
| **MQTT** | ✅ 已实现 | 支持自定义 Topic、Payload 模板 |
| **Sparkplug B** | ✅ 已实现 | 支持 NBIRTH, NDEATH, DDATA 消息规范 |
| **OPC UA Server** | 🚧 开发中 | 目前为 Mock 实现，仅提供基础结构 |

### 🧠 边缘计算 & 管理

*   **规则引擎**: 内置轻量级规则引擎，支持 `expr` 表达式进行逻辑判断和联动控制。
*   **可视化管理**:
    *   基于 Vue 3 + Vuetify 的现代化 UI。
    *   **登录安全**: 支持 JWT 认证、登录倒计时保护。
    *   **视图切换**: 通道列表支持卡片/列表视图切换。
    *   **暗色模式**: 深度适配的暗色主题 UI。
*   **配置管理**: 采用模块化 YAML 配置 (`conf/` 目录)，支持热重载（部分）。
*   **离线支持**: 前端依赖已优化，支持完全离线局域网运行。

## 🛠️ 技术栈

*   **后端**: Go 1.25+
    *   Web 框架: [Fiber](https://github.com/gofiber/fiber)
    *   MQTT: [Paho MQTT](https://github.com/eclipse/paho.mqtt.golang)
    *   Modbus: [simonvetter/modbus](https://github.com/simonvetter/modbus)
    *   表达式引擎: [expr](https://github.com/expr-lang/expr)
*   **前端**: Vue 3
    *   构建工具: Vite
    *   UI 库: Vuetify 3
    *   路由: Vue Router 4
    *   HTTP 客户端: Axios (带自动 Token 注入)

## 🚀 快速开始

### 前置要求
*   [Go](https://go.dev/dl/) 1.25+
*   [Node.js](https://nodejs.org/) 16+ (仅用于编译前端)

### 1. 启动后端

后端支持通过 `-conf` 参数指定配置目录（默认为 `./conf`）。

```bash
# 获取依赖
go mod tidy

# 运行网关
go run cmd/main.go

# 或者指定配置目录
go run cmd/main.go -conf ./my_conf/
```

### 2. 编译前端

前端代码位于 `ui/` 目录下。生产环境构建后，后端会自动托管 `ui/dist` 静态资源。

```bash
cd ui

# 安装依赖 (建议使用 npm 或 pnpm)
npm install

# 编译生产环境代码
npm run build
```

访问 `http://localhost:8082` (默认端口) 即可进入管理界面。
默认账号见 `conf/users.yaml` (通常为 admin/admin123)。

## ⚙️ 配置结构

配置文件已拆分为模块化 YAML 文件，位于 `conf/` 目录：

*   `server.yaml`: HTTP 服务器端口、静态资源路径
*   `channels.yaml`: 南向通道及设备配置
*   `northbound.yaml`: 北向 MQTT/SparkplugB 配置
*   `edge_rules.yaml`: 边缘计算规则配置
*   `system.yaml`: 系统级网络配置
*   `users.yaml`: 用户账号管理
*   `storage.yaml`: 数据库路径配置

## 📅 TODO / Roadmap

### 核心驱动完善
- [ ] **OPC UA Client**: 对接 `gopcua/opcua` 实现真实读写。
- [ ] **Siemens S7**: 实现 S7 协议的真实 TCP 通信。
- [ ] **EtherNet/IP**: 实现 CIP/EIP 协议栈。
- [ ] **其他驱动**: 逐步替换 Mitsubishi, Omron, DL/T645 的模拟实现。

### 北向增强
- [ ] **OPC UA Server**: 实现完整的 Address Space 和 Subscription 支持。
- [ ] **HTTP Push**: 支持通过 HTTP POST 推送数据到第三方 HTTP 服务器。

### 系统功能
- [ ] **真实系统监控**: 替换 Dashboard 中的模拟 CPU/内存数据为真实系统调用 (如 `gopsutil`)。
- [ ] **日志持久化**: 提供基于文件的日志查看和下载功能。
- [ ] **数据存储**: 增强时序数据存储能力（目前仅存储配置和少量状态）。

## 📄 License

Mozilla Public License 2.0 (MPL-2.0)
