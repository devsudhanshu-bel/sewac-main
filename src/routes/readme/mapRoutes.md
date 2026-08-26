# mapRoutes.js Documentation

## 1. File Overview

**File:** `mapRoutes.js`\
**Location:** `src/routes/mapRoutes.js`

The map router provides the map-data endpoint.

It uses:

``` text
authMiddleware
checkPermission
mapController
```

------------------------------------------------------------------------

# 2. GET /

Calls:

``` text
mapController.getMapData
```

Protected by:

``` text
authMiddleware
checkPermission("overview")
```

The endpoint is intended for overview-level map access.

------------------------------------------------------------------------

# 3. Route Protection

The route requires:

``` text
Authentication
+
"overview" Permission
```

  Method   Endpoint   Permission   Controller
  -------- ---------- ------------ --------------
  GET      `/`        `overview`   `getMapData`

------------------------------------------------------------------------

# 4. Complete Route Flow

``` text
GET /
  ↓
authMiddleware
  ↓
checkPermission("overview")
  ↓
mapController.getMapData
  ↓
Map Data
```

------------------------------------------------------------------------

# 5. Endpoint Summary

  Method   Endpoint   Purpose
  -------- ---------- --------------
  GET      `/`        Get map data

------------------------------------------------------------------------

# 6. Summary

`mapRoutes.js` is the protected map routing layer. It exposes the root
GET endpoint for map data and requires authentication together with the
`overview` permission before calling `mapController.getMapData`.
