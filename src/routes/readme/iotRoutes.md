# iotRoutes.js Documentation

## 1. File Overview

**File:** `iotRoutes.js`\
**Location:** `src/routes/iotRoutes.js`

The IoT router provides the telemetry-recording endpoint.

It uses:

``` text
telemetryController
```

The controller method is:

``` text
recordTelemetry
```

------------------------------------------------------------------------

# 2. GET /telemetry/record

Calls:

``` text
recordTelemetry
```

The route is:

``` text
GET /telemetry/record
```

The endpoint delegates the incoming telemetry request directly to:

``` text
telemetryController.recordTelemetry
```

------------------------------------------------------------------------

# 3. Authentication

This route does not explicitly use:

``` text
authMiddleware
```

Therefore no authentication middleware is attached to the route in this
file.

------------------------------------------------------------------------

# 4. Complete Route Flow

``` text
GET /telemetry/record
          ↓
recordTelemetry
          ↓
Telemetry Processing
```

------------------------------------------------------------------------

# 5. Endpoint Summary

  Method   Endpoint              Purpose
  -------- --------------------- ----------------------
  GET      `/telemetry/record`   Record IoT telemetry

------------------------------------------------------------------------

# 6. Summary

`iotRoutes.js` is the IoT telemetry routing layer. It exposes a GET
endpoint at `/telemetry/record` and forwards the request directly to
`recordTelemetry`. The route file itself does not define authentication,
validation, or telemetry-processing logic.
