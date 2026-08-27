# dashboardService.js Documentation

## 1. File Overview

The Dashboard Service provides frontend API functions for retrieving device information, behavior history, and risk history.

It uses:

```text
API_BASE_URL
sessionStorage
fetch()
```

## 2. getDevices()

The function retrieves the authentication token from:

```text
sessionStorage.getItem("token")
```

It sends:

```text
GET /api/devices/list
```

with:

```text
Authorization: Bearer <token>
```

The response is converted to JSON and returned.

The response data is also logged to the console using:

```text
DEVICES API:
```

## 3. getBehaviorHistory()

The function retrieves:

```text
token
```

from session storage and sends:

```text
GET /api/behavior/history
```

with:

```text
Authorization: Bearer <token>
```

The JSON response is returned directly.

## 4. getRiskHistory()

The function retrieves the authentication token from session storage and sends:

```text
GET /api/risk/history
```

with:

```text
Authorization: Bearer <token>
```

The JSON response is returned directly.

## 5. Endpoint Summary

| Function | Method | Endpoint | Authentication |
|---|---|---|---|
| `getDevices` | GET | `/api/devices/list` | Bearer token |
| `getBehaviorHistory` | GET | `/api/behavior/history` | Bearer token |
| `getRiskHistory` | GET | `/api/risk/history` | Bearer token |

## 6. Execution Flow

```text
Dashboard Component
        ↓
Dashboard Service Function
        ↓
Read token from sessionStorage
        ↓
Fetch API Endpoint
        ↓
Authorization Header
        ↓
JSON Response
        ↓
Return Data
```

## 7. Export

The module exports:

```text
getDevices
getBehaviorHistory
getRiskHistory
```

## 8. Summary

`dashboardService.js` acts as the frontend API layer for dashboard data. It retrieves registered devices, behavior history, and risk history using authenticated requests and returns the backend JSON responses to the dashboard component.
