# Authentication API

## 1. Get System Info
Returns basic system information (name, software version).

*   **URL**: `/auth/system-info`
*   **Method**: `GET`
*   **Auth Required**: No

**Response**:
```json
{
  "code": "0",
  "data": {
    "name": "EdgeGateway-01",
    "softVer": "v1.0.0"
  }
}
```

## 2. Get Login Nonce
Obtain a random nonce for password encryption. Valid for 2 minutes. Rate limited (2 req/s).

*   **URL**: `/auth/nonce`
*   **Method**: `GET`
*   **Auth Required**: No

**Response**:
```json
{
  "code": "0",
  "data": {
    "nonce": "a1b2c3d4e5f6..."
  }
}
```

## 3. Login
Authenticate user. Supports local and LDAP login.

*   **URL**: `/auth/login`
*   **Method**: `POST`
*   **Auth Required**: No

**Request Body**:
```json
{
  "loginFlag": true,
  "loginType": "local", // "local" or "ldap"
  "data": {
    "username": "admin",
    "password": "<SHA256(raw_password + nonce)>", // Hex encoded string
    "nonce": "<nonce_from_previous_step>"
  }
}
```

**Response**:
```json
{
  "code": "0",
  "msg": "Success",
  "data": {
    "username": "admin",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "permissions": ["admin"]
  }
}
```

## 4. Logout
*   **URL**: `/auth/logout`
*   **Method**: `POST`
*   **Auth Required**: No (Client should discard token)

**Response**:
```json
{
  "code": "0",
  "msg": "Logged out"
}
```

## 5. Change Password
Change current user's password.

*   **URL**: `/auth/change-password`
*   **Method**: `POST`
*   **Auth Required**: Yes (JWT)

**Request Body**:
```json
{
  "oldPassword": "<SHA256(old_raw_password + nonce)>",
  "newPassword": "new_raw_password",
  "nonce": "<nonce_from_new_request>"
}
```

**Response**:
```json
{
  "code": "0",
  "msg": "密码修改成功"
}
```
