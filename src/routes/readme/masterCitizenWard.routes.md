# masterCitizenWard.routes.js Documentation

## 1. File Overview

**File:** `masterCitizenWard.routes(2).js`\
**Location:** `src/routes/masterCitizenWard.routes.js`

The master-citizen ward router provides CRUD-style ward operations
within the hierarchy:

``` text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
```

It uses:

``` text
masterCitizenWard.controller
```

------------------------------------------------------------------------

# 2. POST /cities/:cityId/zones/:zoneId/divisions/:divisionId/wards

Calls:

``` text
controller.createWard
```

Full documented endpoint:

``` text
POST /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards
```

Path parameters:

``` text
cityId
zoneId
divisionId
```

This route creates a ward within the specified division.

------------------------------------------------------------------------

# 3. GET /cities/:cityId/zones/:zoneId/divisions/:divisionId/wards

Calls:

``` text
controller.getWards
```

Full documented endpoint:

``` text
GET /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards
```

Path parameters:

``` text
cityId
zoneId
divisionId
```

This route retrieves all wards under the specified division.

------------------------------------------------------------------------

# 4. GET /cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/no/:wardNo

Calls:

``` text
controller.getWard
```

Full documented endpoint:

``` text
GET /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/no/:wardNo
```

Path parameters:

``` text
cityId
zoneId
divisionId
wardNo
```

The route explicitly uses:

``` text
wardNo
```

as the SEWAC business identifier for retrieving a ward.

Example:

``` text
GET /api/master-citizen/cities/1/zones/1/divisions/1/wards/no/25
```

------------------------------------------------------------------------

# 5. PATCH /cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId

Calls:

``` text
controller.updateWard
```

Full documented endpoint:

``` text
PATCH /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId
```

Path parameters:

``` text
cityId
zoneId
divisionId
wardId
```

The route uses the internal:

``` text
wardId
```

for updates.

------------------------------------------------------------------------

# 6. DELETE /cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId

Calls:

``` text
controller.deleteWard
```

Full documented endpoint:

``` text
DELETE /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId
```

Path parameters:

``` text
cityId
zoneId
divisionId
wardId
```

The route uses the internal:

``` text
wardId
```

for deletion.

------------------------------------------------------------------------

# 7. Route Summary

  ------------------------------------------------------------------------------------------------------------------------------
  Method            Endpoint                                                                 Controller        Purpose
  ----------------- ------------------------------------------------------------------------ ----------------- -----------------
  POST              `/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards`              `createWard`      Create a ward

  GET               `/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards`              `getWards`        Get all wards

  GET               `/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/no/:wardNo`   `getWard`         Get one ward by
                                                                                                               ward number

  PATCH             `/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId`      `updateWard`      Update a ward

  DELETE            `/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId`      `deleteWard`      Delete a ward
  ------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 8. Ward Identifier Usage

The routes distinguish between:

``` text
wardNo
```

and:

``` text
wardId
```

The GET-by-number route uses:

``` text
wardNo
```

as the SEWAC business identifier.

The update and delete routes use:

``` text
wardId
```

as the internal identifier.

------------------------------------------------------------------------

# 9. Hierarchical Route Flow

``` text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

The parent hierarchy is preserved through:

``` text
cityId
zoneId
divisionId
```

------------------------------------------------------------------------

# 10. Authentication

No:

``` text
authMiddleware
checkPermission
```

is attached to these routes in the provided route file.

------------------------------------------------------------------------

# 11. Summary

`masterCitizenWard.routes(2).js` defines the ward-level master-citizen
routes. It supports creating, listing, retrieving, updating, and
deleting wards while preserving the City → Zone → Division → Ward
hierarchy. Ward retrieval uses the SEWAC business identifier `wardNo`,
while update and delete operations use the internal `wardId`.
