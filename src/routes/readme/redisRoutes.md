# redisRoutes.js Documentation

## 1. File Overview

**File:** `redisRoutes(1).js`\
**Location:** `src/routes/redisRoutes.js`

The Redis router provides endpoints for:

``` text
Telemetry Queue Status
Telemetry Queue Flush
Vehicle Processor Status
```

It uses:

``` text
redisController
```

------------------------------------------------------------------------

# 2. GET /telemetry/status

Calls:

``` text
getTelemetryQueueStatus
```

This route retrieves the current telemetry queue status.

------------------------------------------------------------------------

# 3. DELETE /telemetry/flush

Calls:

``` text
flushTelemetryQueues
```

This route flushes the telemetry queues.

------------------------------------------------------------------------

# 4. GET /telemetry/processors

Calls:

``` text
getVehicleProcessorStatus
```

This route retrieves the vehicle processor status.

------------------------------------------------------------------------

# 5. Route Summary

  -------------------------------------------------------------------------------------------
  Method            Endpoint                  Controller                    Purpose
  ----------------- ------------------------- ----------------------------- -----------------
  GET               `/telemetry/status`       `getTelemetryQueueStatus`     Get telemetry
                                                                            queue status

  DELETE            `/telemetry/flush`        `flushTelemetryQueues`        Flush telemetry
                                                                            queues

  GET               `/telemetry/processors`   `getVehicleProcessorStatus`   Get vehicle
                                                                            processor status
  -------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 6. Authentication

No:

``` text
authMiddleware
checkPermission
```

is attached to these routes in the provided route file.

------------------------------------------------------------------------

# 7. Complete Route Flow

``` text
Redis Router
      ↓
+--------------------------+
|            |             |
GET status  DELETE flush  GET processors
|            |             |
↓            ↓             ↓
Queue       Flush        Processor
Status      Queues       Status
```

------------------------------------------------------------------------

# 8. Summary

`redisRoutes(1).js` is the Redis/telemetry processing monitoring route
layer. It provides queue-status, queue-flush, and
vehicle-processor-status endpoints and delegates each operation directly
to the corresponding Redis controller method.
