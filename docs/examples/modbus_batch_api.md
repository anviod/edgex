---
layout: default
---

# Modbus 批量创建设备与寄存器区块 API

## 1. 批量创建从站设备（7 台 × 200 寄存器）

```http
POST /api/channels/{channelId}/devices/batch-modbus
Content-Type: application/json
token: <JWT>
```

```json
{
  "slave_start": 1,
  "slave_end": 7,
  "reg_start": 0,
  "reg_end": 199,
  "interval": "1s",
  "datatype": "int16",
  "readwrite": "R",
  "register_type": "holding",
  "function_code": 3
}
```

响应示例：

```json
{
  "created": 7,
  "devices": [ ... ]
}
```

每台设备自动生成 `hr_0` … `hr_199` 保持寄存器点位（功能码 0x03）。

## 2. 单设备批量生成寄存器区块

```http
POST /api/channels/{channelId}/devices/{deviceId}/points/generate-registers
Content-Type: application/json
token: <JWT>
```

```json
{
  "start": 0,
  "end": 199,
  "datatype": "int16",
  "readwrite": "R",
  "register_type": "holding",
  "function_code": 3,
  "mode": "merge"
}
```

- `mode: merge` — 保留同 ID 现有点位配置，补充新区间
- `mode: replace` — 仅保留本次区间生成的点位

`register_type` 可选值：`holding`（0x03）、`input`（0x04）、`coil`（0x01）、`discrete`（0x02）。未传 `function_code` 时按寄存器类型自动推断。

生成点位 ID 前缀：`hr_` / `ir_` / `coil_` / `di_`。

## 3. 单设备创建（带 auto_points_range）

```http
POST /api/channels/{channelId}/devices
```

```json
{
  "name": "Modbus 从站 1",
  "enable": true,
  "interval": "1s",
  "config": {
    "slave_id": 1,
    "auto_points_range": "0-199",
    "auto_points_datatype": "int16",
    "auto_points_readwrite": "R",
    "auto_points_register_type": "holding",
    "auto_points_function_code": 3
  }
}
```

## UI 入口

- **设备列表** → 「批量新增从站」：调用 `batch-modbus` API
- **新增/编辑设备** → 「寄存器区块」：创建设备时自动生成点位
- **点位列表** → 「批量创建寄存器」：对已有设备追加/替换寄存器区块
