# wasteGeneratorRoutes.js Documentation

## 1. File Overview

**File:** `wasteGeneratorRoutes(20260826-131221).js`\
**Location:** `src/routes/wasteGeneratorRoutes.js`

The waste-generator router provides:

``` text
Waste Generator Listing
Map Data
Summary
Directory
GVP Trend
Individual Waste Generator
Waste Generator Update
```

It uses:

``` text
wasteGeneratorController
authMiddleware
```

The file also imports:

``` text
checkPermission
checkTemporaryPermission
```

but they are not attached to the route declarations shown.

------------------------------------------------------------------------

# 2. GET /

Calls:

``` text
wasteGeneratorController.getAllWasteGenerators
```

This route retrieves all waste generators.

------------------------------------------------------------------------

# 3. GET /map

Calls:

``` text
wasteGeneratorController.getMap
```

Protected by:

``` text
authMiddleware
```

The route documents the following query parameters:

``` text
date
cityId
zoneId
divisionId
wardId
```

Example:

``` text
/api/waste-generators/map
?date=2026-08-17
&cityId=1
&zoneId=4
&divisionId=5
&wardId=216
```

------------------------------------------------------------------------

# 4. GET /summary

Calls:

``` text
wasteGeneratorController.getSummary
```

Protected by:

``` text
authMiddleware
```

This route retrieves waste-generator summary data.

------------------------------------------------------------------------

# 5. GET /directory

Calls:

``` text
wasteGeneratorController.getDirectory
```

Protected by:

``` text
authMiddleware
```

This route provides the waste-generator directory.

------------------------------------------------------------------------

# 6. GET /gvp-trend

Calls:

``` text
wasteGeneratorController.getGVPTrend
```

Protected by:

``` text
authMiddleware
```

This route provides GVP trend data.

------------------------------------------------------------------------

# 7. GET /:phoneNumber

Calls:

``` text
wasteGeneratorController.getWasteGeneratorByPhone
```

Path parameter:

``` text
phoneNumber
```

This route retrieves one waste generator by phone number.

The route is intentionally declared after:

``` text
/map
/summary
/directory
/gvp-trend
```

------------------------------------------------------------------------

# 8. PUT /:phoneNumber

Calls:

``` text
wasteGeneratorController.updateWasteGenerator
```

Path parameter:

``` text
phoneNumber
```

Protected by:

``` text
authMiddleware
```

This route updates the waste generator associated with the supplied
phone number.

------------------------------------------------------------------------

# 9. Route Ordering

The static routes:

``` text
/map
/summary
/directory
/gvp-trend
```

are declared before:

``` text
/:phoneNumber
```

The source explicitly notes that `/map` must remain before
`/:phoneNumber`.

This ensures the static endpoint is matched as:

``` text
/map
```

rather than being interpreted as:

``` text
phoneNumber = "map"
```

------------------------------------------------------------------------

# 10. Route Protection

  Method   Endpoint          Authentication
  -------- ----------------- ------------------
  GET      `/`               None attached
  GET      `/map`            `authMiddleware`
  GET      `/summary`        `authMiddleware`
  GET      `/directory`      `authMiddleware`
  GET      `/gvp-trend`      `authMiddleware`
  GET      `/:phoneNumber`   None attached
  PUT      `/:phoneNumber`   `authMiddleware`

The imported:

``` text
checkPermission
checkTemporaryPermission
```

middleware functions are not attached to the routes in the supplied
file.

------------------------------------------------------------------------

# 11. Route Summary

  ----------------------------------------------------------------------------------
  Method            Endpoint          Controller                   Purpose
  ----------------- ----------------- ---------------------------- -----------------
  GET               `/`               `getAllWasteGenerators`      Get all waste
                                                                   generators

  GET               `/map`            `getMap`                     Get map data

  GET               `/summary`        `getSummary`                 Get summary

  GET               `/directory`      `getDirectory`               Get directory

  GET               `/gvp-trend`      `getGVPTrend`                Get GVP trend

  GET               `/:phoneNumber`   `getWasteGeneratorByPhone`   Get one waste
                                                                   generator

  PUT               `/:phoneNumber`   `updateWasteGenerator`       Update a waste
                                                                   generator
  ----------------------------------------------------------------------------------

------------------------------------------------------------------------

# 12. Complete Route Flow

``` text
Waste Generator Router
          ↓
+--------------------------------+
|        |       |       |       |
/map   /summary /directory /gvp-trend
 |        |       |       |
 ↓        ↓       ↓       ↓
getMap  getSummary getDirectory getGVPTrend
          |
          +-----------------------+
                                  ↓
                         /:phoneNumber
                                  ↓
                    getWasteGeneratorByPhone
                                  |
                                  ↓
                         PUT /:phoneNumber
                                  ↓
                    updateWasteGenerator
```

------------------------------------------------------------------------

# 13. Endpoint Summary

  Method   Endpoint          Purpose
  -------- ----------------- -------------------------------------
  GET      `/`               List all waste generators
  GET      `/map`            Get waste-generator map data
  GET      `/summary`        Get summary data
  GET      `/directory`      Get waste-generator directory
  GET      `/gvp-trend`      Get GVP trend
  GET      `/:phoneNumber`   Get waste generator by phone number
  PUT      `/:phoneNumber`   Update waste generator

------------------------------------------------------------------------

# 14. Summary

`wasteGeneratorRoutes(20260826-131221).js` is the waste-generator
routing layer. It provides listing, map, summary, directory, GVP-trend,
lookup, and update endpoints. Authentication is explicitly applied to
the map, summary, directory, GVP-trend, and update routes, while the
static routes are deliberately declared before `/:phoneNumber` to
preserve correct Express route matching.
