# collectionPointMonitoring.routes.js Documentation

## 1. File Overview

**File:** `collectionPointMonitoring.routes.js`\

The collection-point monitoring router provides:

``` text
Collection Point Monitoring Data Retrieval
```

It uses:

``` text
collectionPointMonitoringController
```

------------------------------------------------------------------------

# 2. GET /

Calls:

``` text
getCollectionPointMonitoringController
```

The route is:

``` text
GET /
```

relative to the router's mount path.

The source provides the example:

``` text
GET /api/collection-point-monitoring?wardNo=216&date=2026-08-17
```

------------------------------------------------------------------------

# 3. Query Parameters

The documented query parameters are:

``` text
wardNo
date
```

Example:

``` text
/api/collection-point-monitoring
?wardNo=216
&date=2026-08-17
```

These parameters are processed by:

``` text
getCollectionPointMonitoringController
```

------------------------------------------------------------------------

# 4. Route Protection

No:

``` text
authMiddleware
checkPermission
```

is attached to this route in the provided route file.

------------------------------------------------------------------------

# 5. Complete Route Flow

``` text
GET /
  ↓
getCollectionPointMonitoringController
  ↓
Read wardNo + date
  ↓
Validate Parameters
  ↓
Collection Point Monitoring Service
  ↓
Response
```

------------------------------------------------------------------------

# 6. Endpoint Summary

  ------------------------------------------------------------------------------------------------
  Method            Endpoint          Controller                                 Query Parameters
  ----------------- ----------------- ------------------------------------------ -----------------
  GET               `/`               `getCollectionPointMonitoringController`   `wardNo`, `date`

  ------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 7. Summary

`collectionPointMonitoring.routes.js` is the collection-point monitoring
routing layer. It exposes a GET endpoint for retrieving monitoring data
and forwards the request to `getCollectionPointMonitoringController`,
with `wardNo` and `date` supplied as query parameters.
