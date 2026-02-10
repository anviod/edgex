# 北向配置 API (Northbound Configuration)

所有端点均需 JWT 认证。

## 1. 获取配置
获取所有北向配置（MQTT, OPC UA, SparkplugB, HTTP）。

*   **URL**: `/northbound/config`
*   **Method**: `GET`
*   **响应**: `NorthboundConfig` 对象。

## 2. 更新 MQTT 配置
创建或更新 MQTT 客户端配置。

*   **URL**: `/northbound/mqtt`
*   **Method**: `POST`
*   **请求体**: `MQTTConfig` 对象。

### 关键特性配置
*   **离线缓存 (Offline Cache)**:
    ```json
    "cache": {
      "enable": true,
      "max_count": 1000,
      "flush_interval": "1m"
    }
    ```
    *   启用后，当连接断开或发送失败时，数据将持久化到本地数据库 (bboltDB)。
    *   恢复连接后，按 FIFO 顺序重发，**发送成功后删除本地缓存**。

*   **事件上报 (Events)**:
    *   `device_status_topic`: 子设备上下线状态 (Payload: `{"event":"status", "status":"online" ...}`)
    *   `device_lifecycle_topic`: 子设备添加/移除事件 (Payload: `{"event":"add", "details":{...}}`)
    *   **触发机制**:
        *   **添加/移除**: 保存配置时，自动比较新旧配置的设备映射列表，差异部分触发事件。
        *   **上下线**: 实时监听设备连接状态变化触发。

## 3. 更新 HTTP 配置
创建或更新 HTTP 推送配置。

*   **URL**: `/northbound/http`
*   **Method**: `POST`
*   **请求体**: `HTTPConfig` 对象。
    ```json
    {
      "id": "http-01",
      "enable": true,
      "url": "http://remote-server:8080",
      "method": "POST",
      "data_endpoint": "/api/data",
      "device_event_endpoint": "/api/events",
      "headers": { "Authorization": "Bearer token" },
      "cache": { "enable": true, "max_count": 1000 }
    }
    ```

## 4. 删除 HTTP 配置
*   **URL**: `/northbound/http/:id`
*   **Method**: `DELETE`

## 5. 更新 OPC UA 配置
创建或更新 OPC UA 服务端配置。

*   **URL**: `/northbound/opcua`
*   **Method**: `POST`
*   **请求体**: `OPCUAConfig` 对象。

## 6. 获取运行时统计
*   MQTT: `/northbound/mqtt/:id/stats`
*   OPC UA: `/northbound/opcua/:id/stats`
