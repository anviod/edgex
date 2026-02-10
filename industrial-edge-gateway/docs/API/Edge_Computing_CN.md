# 边缘计算 API (Edge Computing)

所有端点均需 JWT 认证。

## 规则 (Rules)

### 1. 获取边缘规则
*   **URL**: `/edge/rules`
*   **Method**: `GET`
*   **响应**: `EdgeRule` 对象数组。

### 2. 创建或更新边缘规则 (Upsert)
创建或更新一条边缘规则。

*   **URL**: `/edge/rules`
*   **Method**: `POST`
*   **请求体**: `EdgeRule` 对象 (参考 `internal/model/types.go`)。

### 3. 删除边缘规则
*   **URL**: `/edge/rules/:id`
*   **Method**: `DELETE`

### 4. 获取规则状态
获取所有规则的运行时状态（如最后触发时间、状态、错误计数）。

*   **URL**: `/edge/states`
*   **Method**: `GET`
*   **响应**: `RuleRuntimeState` 对象数组。

### 5. 获取窗口数据
获取窗口规则中缓存的数据。

*   **URL**: `/edge/rules/:id/window`
*   **Method**: `GET`

## 指标与日志 (Metrics & Logs)

### 1. 获取指标
获取边缘引擎执行指标。

*   **URL**: `/edge/metrics`
*   **Method**: `GET`

### 2. 获取失败动作缓存
获取执行失败并等待重试的动作列表。

*   **URL**: `/edge/cache`
*   **Method**: `GET`

### 3. 获取执行日志
查询历史执行日志。

*   **URL**: `/edge-compute/logs`
*   **Method**: `GET`
*   **查询参数**:
    *   `rule_id`: 按规则 ID 筛选
    *   `start`: 开始时间 (`YYYY-MM-DD HH:mm`)
    *   `end`: 结束时间 (`YYYY-MM-DD HH:mm`)

### 4. 导出日志
导出日志为 CSV 格式。

*   **URL**: `/edge-compute/logs/export`
*   **Method**: `GET`
*   **查询参数**: 同上。

## 辅助 (Helper)

### 1. 获取共享源
获取被多个规则共享/使用的点位源列表。

*   **URL**: `/edge/shared-sources`
*   **Method**: `GET`

## 动作配置指南 (Action Configuration)

在定义规则动作时，建议通过 ID 引用已创建的北向配置，以复用连接和缓存策略。

### MQTT 推送 (mqtt)
*   **type**: `mqtt`
*   **config**:
    *   `mqtt_config_id`: **(推荐)** 引用北向 MQTT 配置的 ID。
    *   `topic`: 推送主题 (可选)。
    *   `send_strategy`: `batch` (批量) 或 `single` (单点)。

### HTTP 推送 (http)
*   **type**: `http`
*   **config**:
    *   `http_config_id`: **(推荐)** 引用北向 HTTP 配置的 ID。
    *   `body`: 消息体模板 (支持 `${var}` 替换)。
