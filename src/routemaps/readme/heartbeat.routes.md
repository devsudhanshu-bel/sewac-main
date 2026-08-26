# heartbeat.routes.js Documentation

## 1. File Overview

**File:** `heartbeat.routes.js`

The heartbeat router exposes endpoints for:

``` text
Heartbeat Write
Complete Heartbeat Data
Latest Heartbeat
```

It uses:

``` text
heartbeat.controller
```

------------------------------------------------------------------------

# 2. POST /heart-beat/lat+long

Calls:

``` text
saveHeartbeat
```

The documented API endpoint is:

``` text
POST /api/iot/heart-beat/lat+long
```

This route records a vehicle heartbeat.

------------------------------------------------------------------------

# 3. GET /heart-beat/lat+long

Calls:

``` text
saveHeartbeat
```

The documented API endpoint is:

``` text
GET /api/iot/heart-beat/lat+long
```

Example:

``` text
/api/iot/heart-beat/lat+long
?vehicleNumber=KA05AB1237
&latitude=12.9012345
&longitude=77.6534567
```

This GET route also records a heartbeat.

------------------------------------------------------------------------

# 4. GET /heart-beat/lat+long/data

Calls:

``` text
getHeartbeatData
```

The documented API endpoint is:

``` text
GET /api/iot/heart-beat/lat+long/data
```

Example:

``` text
/api/iot/heart-beat/lat+long/data
?vehicleNumber=KA05AB1237
```

This route retrieves heartbeat data.

The controller additionally supports:

``` text
start
end
limit
```

for time-range and limited recent-data retrieval.

------------------------------------------------------------------------

# 5. GET /heart-beat/lat+long/latest

Calls:

``` text
getLatestHeartbeat
```

The documented API endpoint is:

``` text
GET /api/iot/heart-beat/lat+long/latest
```

Example:

``` text
/api/iot/heart-beat/lat+long/latest
?vehicleNumber=KA05AB1237
```

This route retrieves the latest heartbeat.

------------------------------------------------------------------------

# 6. Route Summary

  ------------------------------------------------------------------------------------------
  Method            Endpoint                        Controller             Purpose
  ----------------- ------------------------------- ---------------------- -----------------
  POST              `/heart-beat/lat+long`          `saveHeartbeat`        Record heartbeat

  GET               `/heart-beat/lat+long`          `saveHeartbeat`        Record heartbeat

  GET               `/heart-beat/lat+long/data`     `getHeartbeatData`     Get heartbeat
                                                                           data

  GET               `/heart-beat/lat+long/latest`   `getLatestHeartbeat`   Get latest
                                                                           heartbeat
  ------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 7. Query Parameters

The heartbeat routes use:

``` text
vehicleNumber
vehicleId
latitude
longitude
start
end
limit
```

The exact parameters used depend on the controller operation.

------------------------------------------------------------------------

# 8. Authentication

No:

``` text
authMiddleware
checkPermission
```

is attached to these routes in the provided route file.

------------------------------------------------------------------------

# 9. Complete Route Flow

``` text
Heartbeat Router
       ↓
+------------------------------+
|              |               |
POST/GET      GET /data       GET /latest
write         read            live
|              |               |
↓              ↓               ↓
saveHeartbeat getHeartbeatData getLatestHeartbeat
```

------------------------------------------------------------------------

# 10. Summary

`heartbeat.routes.js` is the routing layer for vehicle heartbeat
operations. It provides POST and GET heartbeat-write endpoints, a
heartbeat-data retrieval endpoint, and a latest-heartbeat endpoint,
delegating all processing to the corresponding controller functions.
