# 北向配置 API (Northbound Configuration)

所有端点均需 JWT 认证。

## 1. 获取配置
获取所有北向配置（MQTT, OPC UA, SparkplugB）。

*   **URL**: `/northbound/config`
*   **Method**: `GET`
*   **响应**: `NorthboundConfig` 对象。

## 2. 更新 MQTT 配置
创建或更新 MQTT 客户端配置。

*   **URL**: `/northbound/mqtt`
*   **Method**: `POST`
*   **请求体**: `MQTTConfig` 对象。

## 3. 更新 OPC UA 配置
创建或更新 OPC UA 服务端配置。

*   **URL**: `/northbound/opcua`
*   **Method**: `POST`
*   **请求体**: `OPCUAConfig` 对象。

## 4. 获取 MQTT 统计
获取特定 MQTT 客户端的运行时统计。

*   **URL**: `/northbound/mqtt/:id/stats`
*   **Method**: `GET`

## 5. 获取 OPC UA 统计
获取特定 OPC UA 服务端的运行时统计。

*   **URL**: `/northbound/opcua/:id/stats`
*   **Method**: `GET`
