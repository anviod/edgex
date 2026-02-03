# 快速开始 - 多从属设备轮询

## 5 分钟快速开始

### 1️⃣ 配置文件

创建 `config.yaml`：

```yaml
server:
  port: 8080
storage:
  path: "gateway.db"

devices:
  - id: "gateway-1"
    name: "Modbus TCP Gateway"
    protocol: "modbus-tcp"
    interval: 2s
    enable: true
    config:
      url: "tcp://127.0.0.1:502"
    
    slaves:
      - slave_id: 1
        enable: true
        points:
          - id: "temp1"
            address: "40001"
            datatype: "int16"
            readwrite: "RW"
            scale: 0.1
            offset: 0
      
      - slave_id: 6
        enable: true
        points:
          - id: "temp6"
            address: "40001"
            datatype: "int16"
            readwrite: "RW"
            scale: 0.1
            offset: 0
```

### 2️⃣ 编译

```bash
cd industrial-edge-gateway
go build ./cmd/main.go
```

### 3️⃣ 运行

```bash
./main -config config.yaml
```

### 4️⃣ 查看日志

```
Device gateway-1 using multi-slave mode (2 slaves)
Switched to slave_id: 1
Switched to slave_id: 6
```

## 配置对比

### 旧格式（单设备）

```yaml
devices:
  - id: "dev1"
    config:
      slave_id: 1
    points:
      - id: "p1"
        address: "40001"
```

### 新格式（多从属）

```yaml
devices:
  - id: "dev1"
    config:
      # 移除 slave_id
    slaves:
      - slave_id: 1
        points:
          - id: "p1"
            address: "40001"
      - slave_id: 6
        points:
          - id: "p2"
            address: "40001"
```

## 关键参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `slaves` | 从属设备列表 | `[]` |
| `slave_id` | Modbus Unit ID | `1`, `6`, `10` |
| `enable` | 启用/禁用该 Slave | `true`, `false` |
| `points` | 该 Slave 的点位列表 | `[]` |

## 性能

- **连接**：1 个 TCP 连接处理所有 Slave
- **请求**：使用批量读取（18 个点位 → 2-5 次请求）
- **吞吐量**：3-9 倍性能提升

## 常见场景

### 场景1：多个温度传感器

```yaml
slaves:
  - slave_id: 1
    points:
      - id: "temp1"
        address: "40001"
        scale: 0.1
  - slave_id: 2
    points:
      - id: "temp2"
        address: "40001"
        scale: 0.1
```

### 场景2：混合设备

```yaml
slaves:
  - slave_id: 1  # 温度传感器
    points:
      - id: "temp"
        address: "40001"
      - id: "humidity"
        address: "40002"
  
  - slave_id: 10  # 压力表
    points:
      - id: "pressure"
        address: "40001"
```

### 场景3：有条件的启用

```yaml
slaves:
  - slave_id: 1
    enable: true  # 启用
    points: [...]
  
  - slave_id: 6
    enable: false  # 禁用（跳过）
    points: [...]
```

## 故障排查

### 问题：数据为 0

**原因**：Scale 和 Offset 配置错误

**解决**：
```yaml
scale: 1.0    # 不要设置为 0
offset: 0     # 如需偏移才设置
```

### 问题：连接失败

**原因**：URL 或 Slave ID 错误

**检查清单**：
- URL 格式：`tcp://IP:PORT`
- 端口号：通常 502 或 1502
- Slave ID：设备实际的 ID

### 问题：某个 Slave 无法读取

**解决**：
- 检查 `enable` 是否为 `true`
- 验证设备在线
- 查看日志中的具体错误

## 下一步

- 查看完整文档：`MULTI_SLAVE_GUIDE.md`
- 理解批量优化：`MODBUS_OPTIMIZATION.md`
- 了解状态管理：`STATE_MACHINE_API.md`

---

**Happy coding!** 🚀
