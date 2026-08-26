# telemetryRoutes.js Documentation

## 1. File Overview

**File:** `telemetryRoutes(3).js`\
**Location:** `src/routes/telemetryRoutes.js`

The telemetry router provides the telemetry-recording endpoint.

It uses:

``` text
authMiddleware
checkPermission
telemetryController
```

------------------------------------------------------------------------

# 2. GET /record

Calls:

``` text
recordTelemetry
```

The route is:

``` text
GET /record
```

Protected by:

``` text
authMiddleware
checkPermission("logs")
```

------------------------------------------------------------------------

# 3. Route Protection

The request passes through:

``` text
authMiddleware
      ↓
checkPermission("logs")
      ↓
recordTelemetry
```

The required permission is:

``` text
logs
```

------------------------------------------------------------------------

# 4. Complete Route Flow

``` text
GET /record
     ↓
authMiddleware
     ↓
checkPermission("logs")
     ↓
recordTelemetry
     ↓
Telemetry Processing
```

------------------------------------------------------------------------

# 5. Endpoint Summary

  Method   Endpoint    Permission   Controller
  -------- ----------- ------------ -------------------
  GET      `/record`   `logs`       `recordTelemetry`

------------------------------------------------------------------------

# 6. Summary

`telemetryRoutes(3).js` is the protected telemetry routing layer. It
exposes `/record` and requires authentication together with the `logs`
permission before delegating the request to `recordTelemetry`.
