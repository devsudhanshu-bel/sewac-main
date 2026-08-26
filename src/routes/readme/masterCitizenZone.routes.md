# masterCitizenZone.routes.js Documentation

## 1. File Overview

**File:** `masterCitizenZone.routes(2).js`\
**Location:** `src/routes/masterCitizenZone.routes.js`

The master-citizen zone router provides CRUD-style zone operations
within the hierarchy:

``` text
City
 ↓
Zone
```

It uses:

``` text
masterCitizenZone.controller
```

------------------------------------------------------------------------

# 2. POST /cities/:cityId/zones

Calls:

``` text
controller.createZone
```

Full documented endpoint:

``` text
POST /api/master-citizen/cities/:cityId/zones
```

Path parameter:

``` text
cityId
```

This route creates a zone within the specified city.

------------------------------------------------------------------------

# 3. GET /cities/:cityId/zones

Calls:

``` text
controller.getZones
```

Full documented endpoint:

``` text
GET /api/master-citizen/cities/:cityId/zones
```

Path parameter:

``` text
cityId
```

This route retrieves all zones belonging to the specified city.

------------------------------------------------------------------------

# 4. GET /cities/:cityId/zones/:zoneId

Calls:

``` text
controller.getZone
```

Full documented endpoint:

``` text
GET /api/master-citizen/cities/:cityId/zones/:zoneId
```

Path parameters:

``` text
cityId
zoneId
```

This route retrieves one zone.

------------------------------------------------------------------------

# 5. PATCH /cities/:cityId/zones/:zoneId

Calls:

``` text
controller.updateZone
```

Full documented endpoint:

``` text
PATCH /api/master-citizen/cities/:cityId/zones/:zoneId
```

Path parameters:

``` text
cityId
zoneId
```

This route updates the specified zone.

------------------------------------------------------------------------

# 6. DELETE /cities/:cityId/zones/:zoneId

Calls:

``` text
controller.deleteZone
```

Full documented endpoint:

``` text
DELETE /api/master-citizen/cities/:cityId/zones/:zoneId
```

Path parameters:

``` text
cityId
zoneId
```

This route deletes the specified zone.

------------------------------------------------------------------------

# 7. Route Summary

  ---------------------------------------------------------------------------------------
  Method            Endpoint                          Controller        Purpose
  ----------------- --------------------------------- ----------------- -----------------
  POST              `/cities/:cityId/zones`           `createZone`      Create a zone

  GET               `/cities/:cityId/zones`           `getZones`        Get zones

  GET               `/cities/:cityId/zones/:zoneId`   `getZone`         Get one zone

  PATCH             `/cities/:cityId/zones/:zoneId`   `updateZone`      Update a zone

  DELETE            `/cities/:cityId/zones/:zoneId`   `deleteZone`      Delete a zone
  ---------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 8. Hierarchical Route Flow

``` text
City
  ↓
Zone
```

The city context is preserved through:

``` text
cityId
```

and individual zones are identified using:

``` text
zoneId
```

------------------------------------------------------------------------

# 9. Authentication

No:

``` text
authMiddleware
checkPermission
```

is attached to these routes in the provided route file.

------------------------------------------------------------------------

# 10. Summary

`masterCitizenZone.routes(2).js` defines the zone-level master-citizen
routes. It supports creating, listing, retrieving, updating, and
deleting zones while preserving the City → Zone hierarchy through
`cityId` and `zoneId`.
