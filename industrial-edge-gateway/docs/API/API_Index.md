# Industrial Edge Gateway API Documentation

Welcome to the Industrial Edge Gateway API documentation. The API is RESTful and uses JSON for request and response bodies.

## Base URL

`http://<gateway-ip>:<port>/api`

Default port is usually 8080 or 9090 depending on configuration.

## Authentication

Most endpoints require JWT Authentication.
1. Call `GET /auth/nonce` to get a one-time nonce.
2. Call `POST /auth/login` with username and encrypted password (SHA256(password + nonce)).
3. Use the returned `token` in the `Authorization` header: `Bearer <token>`.

## Documentation Modules

*   [Authentication & User Management](Authentication.md)
*   [System Management](System_Management.md)
*   [Channel & Device Management (Southbound)](Channel_Device_Management.md)
*   [Edge Computing](Edge_Computing.md)
*   [Northbound Configuration](Northbound_Configuration.md)

## Common Response Format

Success:
```json
{
  "code": "0", // or HTTP 200 with data directly
  "msg": "Success",
  "data": { ... }
}
```

Error:
```json
{
  "code": "1", // or HTTP 4xx/5xx
  "error": "Error message description"
}
```
