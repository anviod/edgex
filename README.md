# Industrial Edge Gateway

Industrial Edge Gateway 是一个轻量级的工业边缘计算网关，旨在连接工业现场设备（南向）与云端/上层应用（北向），并提供本地边缘计算能力。项目采用 Go 语言开发后端，Vue 3 开发前端管理界面。

## ✨ 主要特性

*   **多协议采集（南向）**
    *   Modbus TCP / RTU / RTU Over TCP
    *   BACnet IP
    *   OPC UA
    *   Siemens S7 (S7-200Smart, S7-1200, S7-1500, S7-300, S7-400)
    *   EtherNet/IP (ODVA)
    *   Mitsubishi MELSEC (SLMP)
    *   Omron FINS (TCP/UDP)
    *   DL/T645-2007 (电表协议, 支持 Serial/TCP)
*   **多协议上报（北向）**
    *   MQTT (支持自定义 Topic 和 Payload)
    *   Sparkplug B
    *   OPC UA Server
*   **边缘计算**
    *   内置规则引擎，支持本地逻辑控制
    *   支持数据过滤、告警触发、联动控制
*   **可视化管理**
    *   基于 Web 的仪表盘，实时监控设备状态
    *   可视化配置通道、设备、点位及规则
    *   系统资源监控（CPU、内存、磁盘、协程）
*   **数据持久化**
    *   基于 BoltDB 的本地数据存储
    *   配置文件支持 YAML 格式

## 🛠️ 技术栈

*   **后端**: Go 1.25+
    *   Web 框架: [Fiber](https://github.com/gofiber/fiber)
    *   MQTT 客户端: [Paho MQTT](https://github.com/eclipse/paho.mqtt.golang)
    *   Modbus 库: [simonvetter/modbus](https://github.com/simonvetter/modbus)
*   **前端**: Vue 3
    *   构建工具: Vite
    *   UI 组件库: Vuetify
    *   路由: Vue Router

## 🚀 快速开始

### 前置要求
*   [Go](https://go.dev/dl/) 1.25 或更高版本
*   [Node.js](https://nodejs.org/) 16+ (用于编译前端)

### 1. 启动后端

```bash
# 获取依赖
go mod tidy

# 运行网关 (默认加载当前目录下的 config.yaml)
go run cmd/main.go

# 或者指定配置文件路径
go run cmd/main.go -config /path/to/your/config.yaml
```

### 2. 编译前端

前端代码位于 `ui/` 目录下。后端服务器会自动托管编译后的静态文件。

```bash
cd ui

# 安装依赖
npm install

# 编译生产环境代码
npm run build
```

编译完成后，访问 `http://localhost:8082` (默认端口) 即可进入管理界面。

## ⚙️ 配置说明

主要配置文件为 `config.yaml`，包含以下主要部分：

*   **server**: HTTP 服务器端口配置
*   **storage**: 本地数据库路径
*   **channels**: 南向采集通道配置（协议、连接参数）
*   **northbound**: 北向上传配置（MQTT、OPC UA、Sparkplug B）

示例片段：

```yaml
server:
    port: 8082

channels:
    - id: modbus-tcp-1
      name: Modbus TCP 设备
      protocol: modbus-tcp
      enable: true
      config:
        url: tcp://192.168.1.100:502
        timeout: 2000

northbound:
    mqtt:
        - id: mqtt-cloud
          enable: true
          broker: tcp://broker.emqx.io:1883
          topic: gateway/uplink
```

## 📂 项目结构

```
industrial-edge-gateway/
├── cmd/                # 程序入口
├── internal/           # 核心代码
│   ├── config/         # 配置管理
│   ├── core/           # 核心逻辑 (Channel/Device Manager, Pipeline)
│   ├── driver/         # 南向协议驱动实现
│   ├── model/          # 数据模型定义
│   ├── northbound/     # 北向协议实现
│   ├── server/         # HTTP API 服务器
│   └── storage/        # 持久化存储
├── ui/                 # 前端 Vue 项目源码
├── config.yaml         # 配置文件
└── go.mod              # Go 模块定义
```

## 📝 开发指南

1.  **添加新驱动**: 在 `internal/driver/` 下实现 `Driver` 接口，并在 `cmd/main.go` 中导入。
2.  **前端调试**: 在 `ui/` 目录下运行 `npm run dev` 启动开发服务器。

## 📄 License

本软件采用 **Mozilla Public License 2.0 (MPL-2.0)** 进行许可。

*   ✅ **商业使用**: 您可以免费在商业产品中使用本软件。
*   ✅ **分发**: 您可以自由复制和分发本软件。
*   ✅ **修改**: 您可以修改本软件的源代码。
*   ⚠️ **开源义务**: 如果您修改了本项目的**源代码文件**，您必须在分发时基于 MPL-2.0 协议公开这些修改后的源代码。
*   ℹ️ **链接例外**: 如果您只是将本项目作为库进行链接（Link），或仅仅是调用本软件的接口，而没有修改本项目本身的源代码，您的主程序代码**不需要**开源。

详细协议内容请参阅 [LICENSE](LICENSE) 文件或访问 [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/)。
