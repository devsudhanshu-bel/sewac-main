# heartbeat.controller.js Documentation

## 1. File Overview

**File:** `heartbeat.controller.js`

The heartbeat controller handles HTTP requests for:

``` text
Heartbeat Creation
Complete Heartbeat Data Retrieval
Latest Heartbeat Retrieval
```

It delegates database and telemetry operations to:

``` text
heartbeat.service
```

------------------------------------------------------------------------

# 2. saveHeartbeat()

The common write handler is:

``` text
saveHeartbeat(req, res)
```

Both:

``` text
POST /heart-beat/lat+long
GET /heart-beat/lat+long
```

use this same controller function.

------------------------------------------------------------------------

# 3. Request Data Handling

The controller reads:

``` text
req.body
req.query
```

and merges them into:

``` text
data
```

The merge order is:

``` text
query
  ↓
body
```

Therefore POST body values take priority over query parameters when the
same field is supplied.

------------------------------------------------------------------------

# 4. Create Heartbeat

The controller calls:

``` text
heartbeatService.createHeartbeat(data)
```

The service result contains:

``` text
heartbeat
heartbeatTable
dayTable
vehicleTable
wardNo
```

------------------------------------------------------------------------

# 5. Successful Heartbeat Response

A successful heartbeat creation returns:

``` text
HTTP 201
```

with:

``` json
{
  "success": true,
  "message": "Heartbeat recorded successfully.",
  "data": "...",
  "meta": {
    "vehicleNumber": "...",
    "heartbeatTable": "...",
    "dayTable": "...",
    "vehicleTable": "...",
    "wardNo": "..."
  }
}
```

The vehicle number is taken from:

``` text
vehicleNumber
```

or:

``` text
vehicleId
```

------------------------------------------------------------------------

# 6. Heartbeat Write Error Handling

If the vehicle is not registered for the current day, the controller
returns:

``` text
HTTP 404
```

For validation-related messages containing:

``` text
required
must be
between
```

the controller returns:

``` text
HTTP 400
```

Other failures return:

``` text
HTTP 500
```

with:

``` text
Failed to record heartbeat.
```

and the error message.

------------------------------------------------------------------------

# 7. getHeartbeatData()

The method:

``` text
getHeartbeatData(req, res)
```

retrieves heartbeat records for a vehicle.

It accepts:

``` text
vehicleNumber
vehicleId
start
end
limit
```

from the query string.

------------------------------------------------------------------------

# 8. Vehicle Identifier

The final vehicle identifier is selected as:

``` text
vehicleNumber || vehicleId
```

If neither is provided, the controller returns:

``` text
HTTP 400
```

with:

``` json
{
  "success": false,
  "message": "vehicleNumber is required."
}
```

------------------------------------------------------------------------

# 9. Time Range Retrieval

When both:

``` text
start
end
```

are supplied, the controller calls:

``` text
heartbeatService.getHeartbeatsByTimeRange(
  finalVehicleNumber,
  start,
  end
)
```

The response includes:

``` text
vehicleNumber
count
data
meta
```

------------------------------------------------------------------------

# 10. Limited Recent Data

When:

``` text
limit
```

is supplied, the controller calls:

``` text
heartbeatService.getLatestHeartbeats(
  finalVehicleNumber,
  limit
)
```

The response includes:

``` text
vehicleNumber
count
data
meta
```

------------------------------------------------------------------------

# 11. Complete Heartbeat Data

When neither a time range nor a limit is supplied, the controller calls:

``` text
heartbeatService.getAllHeartbeats(
  finalVehicleNumber
)
```

The complete heartbeat data is returned with:

``` text
vehicleNumber
count
data
meta
```

------------------------------------------------------------------------

# 12. Heartbeat Data Metadata

The metadata returned by the retrieval operations contains:

``` text
heartbeatTable
dayTable
vehicleTable
wardNo
```

------------------------------------------------------------------------

# 13. getHeartbeatData() Error Handling

If the vehicle is not registered for today:

``` text
HTTP 404
```

is returned.

Other retrieval errors return:

``` text
HTTP 500
```

with:

``` text
Failed to fetch heartbeat data.
```

------------------------------------------------------------------------

# 14. getLatestHeartbeat()

The method:

``` text
getLatestHeartbeat(req, res)
```

retrieves the latest heartbeat for a vehicle.

It accepts:

``` text
vehicleNumber
vehicleId
```

from the query.

The final identifier is:

``` text
vehicleNumber || vehicleId
```

------------------------------------------------------------------------

# 15. Latest Heartbeat Validation

If no vehicle identifier is supplied:

``` text
HTTP 400
```

is returned with:

``` json
{
  "success": false,
  "message": "vehicleNumber is required."
}
```

------------------------------------------------------------------------

# 16. Latest Heartbeat Service Call

The controller calls:

``` text
heartbeatService.getLatestHeartbeat(
  finalVehicleNumber
)
```

------------------------------------------------------------------------

# 17. Latest Heartbeat Response

A successful request returns:

``` text
HTTP 200
```

with:

``` text
success
vehicleNumber
data
meta
```

The metadata contains:

``` text
heartbeatTable
dayTable
vehicleTable
wardNo
```

------------------------------------------------------------------------

# 18. Latest Heartbeat Error Handling

Unexpected errors return:

``` text
HTTP 500
```

with:

``` text
Failed to fetch latest heartbeat.
```

and the error message.

------------------------------------------------------------------------

# 19. Complete Controller Flow

``` text
Heartbeat Request
       ↓
+-------------------------+
|                         |
Write                   Read
|                         |
↓                         ↓
saveHeartbeat       getHeartbeatData
|                         |
↓                    +----+----+
createHeartbeat      |    |    |
                     |    |    |
                  range limit all
                     |    |    |
                     +----+----+
                          ↓
                   Heartbeat Data
                          ↑
                    getLatestHeartbeat
```

------------------------------------------------------------------------

# 20. Exports

The controller exports:

``` text
saveHeartbeat
getHeartbeatData
getLatestHeartbeat
```

------------------------------------------------------------------------

# 21. Summary

`heartbeat.controller.js` is the HTTP controller layer for vehicle
heartbeat operations. It supports heartbeat writes through both POST and
GET requests, complete/time-range/limited heartbeat retrieval, and
latest-heartbeat retrieval. It performs request validation, delegates
processing to the heartbeat service, constructs structured responses,
and maps common failures to appropriate HTTP status codes.
