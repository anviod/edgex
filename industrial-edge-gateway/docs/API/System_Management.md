# System Management API

All endpoints require JWT Authentication.

## 1. Dashboard Summary
Get overview of system status, channels, northbound status, and resource usage.

*   **URL**: `/dashboard/summary`
*   **Method**: `GET`

**Response**:
```json
{
  "channels": [ ... ],
  "northbound": [ ... ],
  "edge_rules": { ... },
  "system": {
    "cpu_usage": 12.5,
    "memory_usage": 512,
    "disk_usage": 45.5,
    "goroutines": 120
  }
}
```

## 2. Get System Configuration
Get full system configuration including Network, Time, HA, and LDAP settings.

*   **URL**: `/system`
*   **Method**: `GET`

**Response**: `SystemConfig` object (see `internal/model/system.go`).

## 3. Update System Configuration
Update system configuration.

*   **URL**: `/system`
*   **Method**: `PUT`

**Request Body**: `SystemConfig` object.

**Response**:
```json
{
  "status": "success",
  "message": "System configuration updated"
}
```

## 4. Restart System
Triggers a system restart (gateway process exit).

*   **URL**: `/system/restart`
*   **Method**: `POST`

**Response**:
```json
{
  "status": "success",
  "message": "System is restarting..."
}
```

## 5. Network Interfaces
Get list of available network interfaces.

*   **URL**: `/system/network/interfaces`
*   **Method**: `GET`

**Response**: Array of `NetworkInterface` objects.

## 6. Network Routes
Get list of static routes.

*   **URL**: `/system/network/routes`
*   **Method**: `GET`

**Response**: Array of `StaticRoute` objects.
