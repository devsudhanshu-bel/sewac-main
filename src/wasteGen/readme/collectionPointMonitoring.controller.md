# collectionPointMonitoring.controller.js Documentation

## 1. File Overview

**File:** `collectionPointMonitoring.controller.js`\

The collection-point monitoring controller handles:

``` text
Collection Point Monitoring Data Retrieval
```

It uses:

``` text
collectionPointMonitoring.service
```

The controller method is:

``` text
getCollectionPointMonitoringController
```

------------------------------------------------------------------------

# 2. GET Collection Point Monitoring

The controller reads:

``` text
wardNo
date
```

from:

``` text
req.query
```

The values are passed to:

``` text
getCollectionPointMonitoring
```

in the service layer.

------------------------------------------------------------------------

# 3. Query Parameters

The controller expects:

``` text
wardNo
date
```

Example:

``` text
/api/collection-point-monitoring?wardNo=216&date=2026-08-17
```

------------------------------------------------------------------------

# 4. wardNo Validation

The controller validates that:

``` text
wardNo
```

is provided.

The following values are treated as missing:

``` text
undefined
null
""
```

If `wardNo` is missing, the controller returns:

``` text
HTTP 400
```

with:

``` json
{
  "success": false,
  "message": "wardNo is required"
}
```

------------------------------------------------------------------------

# 5. date Validation

The controller validates that:

``` text
date
```

is provided.

The following values are treated as missing:

``` text
undefined
null
""
```

If `date` is missing, the controller returns:

``` text
HTTP 400
```

with:

``` json
{
  "success": false,
  "message": "date is required"
}
```

------------------------------------------------------------------------

# 6. Service Call

After validation, the controller calls:

``` text
getCollectionPointMonitoring({
  wardNo,
  date
})
```

The service is imported from:

``` text
./collectionPointMonitoring.service
```

The controller therefore delegates the actual collection-point
monitoring data retrieval to the service layer.

------------------------------------------------------------------------

# 7. Successful Response

When the service completes successfully, the controller returns:

``` text
HTTP 200
```

with:

``` json
{
  "success": true,
  "message": "Collection point monitoring data retrieved successfully",
  "data": "..."
}
```

The actual structure of:

``` text
data
```

is determined by the service response and is not defined in this
controller file.

------------------------------------------------------------------------

# 8. Error Handling

The service call is wrapped inside:

``` text
try / catch
```

If an exception occurs, the controller logs:

``` text
COLLECTION POINT MONITORING CONTROLLER ERROR
```

and returns:

``` text
HTTP 500
```

with:

``` json
{
  "success": false,
  "message": "Failed to retrieve collection point monitoring data",
  "error": "..."
}
```

The `error` field is only populated when:

``` text
NODE_ENV === "development"
```

------------------------------------------------------------------------

# 9. Complete Controller Flow

``` text
Incoming Request
       ↓
Read wardNo + date
       ↓
Validate wardNo
       ↓
Validate date
       ↓
getCollectionPointMonitoring()
       ↓
+-----------------------+
|                       |
Success               Error
|                       |
↓                       ↓
HTTP 200              HTTP 500
+ data                Error message
```

------------------------------------------------------------------------

# 10. Export

The controller exports:

``` text
getCollectionPointMonitoringController
```

This function is consumed by the corresponding route file.

------------------------------------------------------------------------

# 11. Summary

`collectionPointMonitoring.controller.js` is responsible for validating
the required `wardNo` and `date` query parameters, invoking the
collection-point monitoring service, returning the retrieved data with a
success response, and handling service failures with an HTTP 500
response.
