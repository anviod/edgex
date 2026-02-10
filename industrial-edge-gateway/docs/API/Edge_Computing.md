# Edge Computing API

All endpoints require JWT Authentication.

## Rules

### 1. Get Edge Rules
*   **URL**: `/edge/rules`
*   **Method**: `GET`
*   **Response**: Array of `EdgeRule` objects.

### 2. Upsert Edge Rule
Create or update an edge rule.

*   **URL**: `/edge/rules`
*   **Method**: `POST`
*   **Request Body**: `EdgeRule` object (see `internal/model/types.go`).

### 3. Delete Edge Rule
*   **URL**: `/edge/rules/:id`
*   **Method**: `DELETE`

### 4. Get Rule States
Get runtime state of all rules (last trigger time, status, error count).

*   **URL**: `/edge/states`
*   **Method**: `GET`
*   **Response**: Array of `RuleRuntimeState` objects.

### 5. Get Window Data
Get data buffered in a window rule.

*   **URL**: `/edge/rules/:id/window`
*   **Method**: `GET`

## Metrics & Logs

### 1. Get Metrics
Get execution metrics for the edge engine.

*   **URL**: `/edge/metrics`
*   **Method**: `GET`

### 2. Get Failed Actions Cache
Get list of actions that failed to execute (and are pending retry).

*   **URL**: `/edge/cache`
*   **Method**: `GET`

### 3. Get Execution Logs
Query historical execution logs.

*   **URL**: `/edge-compute/logs`
*   **Method**: `GET`
*   **Query Params**:
    *   `rule_id`: Filter by Rule ID
    *   `start`: Start time (`YYYY-MM-DD HH:mm`)
    *   `end`: End time (`YYYY-MM-DD HH:mm`)

### 4. Export Logs
Export logs as CSV.

*   **URL**: `/edge-compute/logs/export`
*   **Method**: `GET`
*   **Query Params**: Same as above.

## Helper

### 1. Get Shared Sources
Get a list of point sources that are shared/used across multiple rules.

*   **URL**: `/edge/shared-sources`
*   **Method**: `GET`
