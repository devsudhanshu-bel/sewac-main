# routeMap.routes.js Documentation

## 1. File Overview

**File:** `routeMap.routes.js`\
**Location:** `src/routes/routeMap.routes.js`

The route-map router provides the live vehicle map endpoint.

It uses:

``` text
authMiddleware
routeMapController
```

------------------------------------------------------------------------

# 2. GET /live

Calls:

``` text
getLiveRouteMap
```

The route is:

``` text
GET /live
```

and is protected by:

``` text
authMiddleware
```

------------------------------------------------------------------------

# 3. Query Parameters

The route documents the following query parameters:

``` text
latitude
longitude
cityId
zoneId
divisionId
wardId
```

These parameters are supplied to the live route-map request.

The route itself does not implement their processing.

------------------------------------------------------------------------

# 4. Route Protection

The endpoint requires:

``` text
Authentication
```

through:

``` text
authMiddleware
```

No explicit:

``` text
checkPermission
```

middleware is attached to this route.

------------------------------------------------------------------------

# 5. Complete Route Flow

``` text
GET /live
    ↓
authMiddleware
    ↓
getLiveRouteMap
    ↓
Live Vehicle Route Map
```

------------------------------------------------------------------------

# 6. Endpoint Summary

  Method   Endpoint   Middleware         Controller
  -------- ---------- ------------------ -------------------
  GET      `/live`    `authMiddleware`   `getLiveRouteMap`

------------------------------------------------------------------------

# 7. Summary

`routeMap.routes.js` is the protected live vehicle map routing layer. It
exposes `/live`, accepts location and administrative filter parameters,
and forwards the request to `getLiveRouteMap` after authentication.
