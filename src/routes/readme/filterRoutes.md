# filterRoutes.js Documentation

## 1. File Overview

**File:** `filterRoutes(2).js`\
**Location:** `src/routes/filterRoutes.js`

The filter router provides shared hierarchical geographic filters.

It uses:

``` text
authMiddleware
checkPermission
filterController
```

The hierarchy is:

``` text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
```

------------------------------------------------------------------------

# 2. GET /cities

Calls:

``` text
filterController.getCities
```

Protected by:

``` text
authMiddleware
checkPermission("overview")
```

This route retrieves the available cities.

------------------------------------------------------------------------

# 3. GET /zones/:cityId

Calls:

``` text
filterController.getZones
```

Protected by:

``` text
authMiddleware
checkPermission("overview")
```

Path parameter:

``` text
cityId
```

The selected city is used to retrieve its zones.

------------------------------------------------------------------------

# 4. GET /divisions/:zoneId

Calls:

``` text
filterController.getDivisions
```

Protected by:

``` text
authMiddleware
checkPermission("overview")
```

Path parameter:

``` text
zoneId
```

The selected zone is used to retrieve its divisions.

------------------------------------------------------------------------

# 5. GET /wards/:divisionId

Calls:

``` text
filterController.getWards
```

Protected by:

``` text
authMiddleware
checkPermission("overview")
```

Path parameter:

``` text
divisionId
```

The selected division is used to retrieve its wards.

------------------------------------------------------------------------

# 6. Route Protection

All filter routes require:

``` text
Authentication
+
"overview" Permission
```

  Method   Endpoint               Controller
  -------- ---------------------- ----------------
  GET      `/cities`              `getCities`
  GET      `/zones/:cityId`       `getZones`
  GET      `/divisions/:zoneId`   `getDivisions`
  GET      `/wards/:divisionId`   `getWards`

------------------------------------------------------------------------

# 7. Complete Route Flow

``` text
Filter Router
      ↓
authMiddleware
      ↓
checkPermission("overview")
      ↓
filterController
      ↓
City → Zone → Division → Ward
```

------------------------------------------------------------------------

# 8. Endpoint Summary

  Method   Endpoint               Purpose
  -------- ---------------------- --------------------------
  GET      `/cities`              Get cities
  GET      `/zones/:cityId`       Get zones for a city
  GET      `/divisions/:zoneId`   Get divisions for a zone
  GET      `/wards/:divisionId`   Get wards for a division

------------------------------------------------------------------------

# 9. Summary

`filterRoutes(2).js` is the shared hierarchical filter routing layer. It
exposes protected endpoints for navigating the City → Zone → Division →
Ward hierarchy and requires the `overview` permission for every route.
