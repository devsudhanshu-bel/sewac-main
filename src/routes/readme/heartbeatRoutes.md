# heartbeatRoutes.js Documentation

## 1. File Overview

**File:** `heartbeatRoutes(2).js`\
**Location:** `src/routes/heartbeatRoutes.js`

The heartbeat router provides the vehicle heartbeat endpoint.

It uses:

``` text
heartbeatController
```

The controller method is:

``` text
recordHeartbeat
```

------------------------------------------------------------------------

# 2. GET /heart-beat/:vehicleId

Calls:

``` text
recordHeartbeat
```

The route is:

``` text
GET /heart-beat/:vehicleId
```

Path parameter:

``` text
vehicleId
```

Example:

``` text
/api/iot/heart-beat/KA05AB1237
```

------------------------------------------------------------------------

# 3. Query Parameters

The example in the route file shows:

``` text
latitude
longitude
```

Example:

``` text
/api/iot/heart-beat/KA05AB1237
?latitude=12.902313
&longitude=77.654855
```

These values are passed through the request to:

``` text
recordHeartbeat
```

The route file itself does not implement their processing.

------------------------------------------------------------------------

# 4. Authentication

This route does not explicitly use:

``` text
authMiddleware
```

Therefore no authentication middleware is attached to the route in this
file.

------------------------------------------------------------------------

# 5. Complete Route Flow

``` text
GET /heart-beat/:vehicleId
          ↓
recordHeartbeat
          ↓
Vehicle Heartbeat Processing
```

------------------------------------------------------------------------

# 6. Endpoint Summary

  Method   Endpoint                   Purpose
  -------- -------------------------- --------------------------
  GET      `/heart-beat/:vehicleId`   Record vehicle heartbeat

------------------------------------------------------------------------

# 7. Summary

`heartbeatRoutes(2).js` is the vehicle heartbeat routing layer. It
exposes a GET endpoint containing the vehicle ID in the path and
forwards the request directly to `recordHeartbeat`. The route file also
documents latitude and longitude as query parameters.
