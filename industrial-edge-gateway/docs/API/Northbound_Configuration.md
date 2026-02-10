# Northbound Configuration API

All endpoints require JWT Authentication.

## 1. Get Configuration
Get all northbound configurations (MQTT, OPC UA, SparkplugB).

*   **URL**: `/northbound/config`
*   **Method**: `GET`
*   **Response**: `NorthboundConfig` object.

## 2. Update MQTT Configuration
Create or update an MQTT client configuration.

*   **URL**: `/northbound/mqtt`
*   **Method**: `POST`
*   **Request Body**: `MQTTConfig` object.

## 3. Update OPC UA Configuration
Create or update an OPC UA server configuration.

*   **URL**: `/northbound/opcua`
*   **Method**: `POST`
*   **Request Body**: `OPCUAConfig` object.

## 4. Get MQTT Stats
Get runtime statistics for a specific MQTT client.

*   **URL**: `/northbound/mqtt/:id/stats`
*   **Method**: `GET`

## 5. Get OPC UA Stats
Get runtime statistics for a specific OPC UA server.

*   **URL**: `/northbound/opcua/:id/stats`
*   **Method**: `GET`
