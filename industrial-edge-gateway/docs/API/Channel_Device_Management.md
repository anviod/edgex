# Channel & Device Management (Southbound) API

All endpoints require JWT Authentication.

## Channels

### 1. Get Channels
*   **URL**: `/channels`
*   **Method**: `GET`
*   **Response**: Array of `Channel` objects.

### 2. Add Channel
*   **URL**: `/channels`
*   **Method**: `POST`
*   **Request Body**: `Channel` object.
    ```json
    {
      "id": "modbus-01",
      "name": "Modbus TCP Channel",
      "protocol": "modbus-tcp",
      "enable": true,
      "config": {
        "ip": "192.168.1.100",
        "port": 502
      }
    }
    ```

### 3. Get Channel Details
*   **URL**: `/channels/:channelId`
*   **Method**: `GET`

### 4. Update Channel
*   **URL**: `/channels/:channelId`
*   **Method**: `PUT`
*   **Request Body**: `Channel` object.

### 5. Delete Channel
*   **URL**: `/channels/:channelId`
*   **Method**: `DELETE`

### 6. Scan Channel
Trigger device discovery on a channel (e.g., BACnet WhoIs).

*   **URL**: `/channels/:channelId/scan`
*   **Method**: `POST`
*   **Request Body**: (Optional) Scan parameters.

## Devices

### 1. Get Channel Devices
*   **URL**: `/channels/:channelId/devices`
*   **Method**: `GET`

### 2. Add Device(s)
Supports adding a single device or an array of devices.

*   **URL**: `/channels/:channelId/devices`
*   **Method**: `POST`
*   **Request Body**: `Device` object or `[]Device`.
    ```json
    {
      "name": "Device 1",
      "interval": "1s",
      "enable": true,
      "config": { "slave_id": 1 }
    }
    ```

### 3. Update Device
*   **URL**: `/channels/:channelId/devices/:deviceId`
*   **Method**: `PUT`
*   **Request Body**: `Device` object.

### 4. Delete Device
*   **URL**: `/channels/:channelId/devices/:deviceId`
*   **Method**: `DELETE`

### 5. Bulk Delete Devices
*   **URL**: `/channels/:channelId/devices`
*   **Method**: `DELETE`
*   **Request Body**: `["deviceId1", "deviceId2"]`

### 6. Get Device History
Query historical data for a device.

*   **URL**: `/devices/:deviceId/history`
*   **Method**: `GET`
*   **Query Params**:
    *   `start`: Start time (RFC3339 or `YYYY-MM-DD HH:mm:ss`)
    *   `end`: End time
    *   `limit`: Record limit (default 100, if no time range)

## Points

### 1. Get Device Points
*   **URL**: `/channels/:channelId/devices/:deviceId/points`
*   **Method**: `GET`

### 2. Add Point
*   **URL**: `/channels/:channelId/devices/:deviceId/points`
*   **Method**: `POST`
*   **Request Body**: `Point` object.

### 3. Update Point
*   **URL**: `/channels/:channelId/devices/:deviceId/points/:pointId`
*   **Method**: `PUT`

### 4. Delete Point
*   **URL**: `/channels/:channelId/devices/:deviceId/points/:pointId`
*   **Method**: `DELETE`

### 5. Write Point Value
Write a value to a writable point.

*   **URL**: `/write`
*   **Method**: `POST`
*   **Request Body**:
    ```json
    {
      "channel_id": "ch1",
      "device_id": "dev1",
      "point_id": "p1",
      "value": 123
    }
    ```

### 6. Get Realtime Values
Get a snapshot of all latest values in memory.

*   **URL**: `/values/realtime`
*   **Method**: `GET`
