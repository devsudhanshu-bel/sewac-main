# masterCitizenDivision.routes.js Documentation

## 1. File Overview

**File:** `masterCitizenDivision.routes(2).js`\
**Location:** `src/routes/masterCitizenDivision.routes.js`

The master-citizen division router provides CRUD-style division
operations within the hierarchy:

``` text
City
 ↓
Zone
 ↓
Division
```

It uses:

``` text
masterCitizenDivision.controller
```

------------------------------------------------------------------------

# 2. POST /cities/:cityId/zones/:zoneId/divisions

Calls:

``` text
controller.createDivision
```

Full documented endpoint:

``` text
POST /api/master-citizen/cities/:cityId/zones/:zoneId/divisions
```

Path parameters:

``` text
cityId
zoneId
```

This route creates a division within the specified city and zone.

------------------------------------------------------------------------

# 3. GET /cities/:cityId/zones/:zoneId/divisions

Calls:

``` text
controller.getDivisions
```

Full documented endpoint:

``` text
GET /api/master-citizen/cities/:cityId/zones/:zoneId/divisions
```

Path parameters:

``` text
cityId
zoneId
```

This route retrieves divisions belonging to the specified city and zone.

------------------------------------------------------------------------

# 4. GET /cities/:cityId/zones/:zoneId/divisions/:divisionId

Calls:

``` text
controller.getDivision
```

Full documented endpoint:

``` text
GET /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
```

Path parameters:

``` text
cityId
zoneId
divisionId
```

This route retrieves one division.

------------------------------------------------------------------------

# 5. PATCH /cities/:cityId/zones/:zoneId/divisions/:divisionId

Calls:

``` text
controller.updateDivision
```

Full documented endpoint:

``` text
PATCH /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
```

Path parameters:

``` text
cityId
zoneId
divisionId
```

This route updates the specified division.

------------------------------------------------------------------------

# 6. DELETE /cities/:cityId/zones/:zoneId/divisions/:divisionId

Calls:

``` text
controller.deleteDivision
```

Full documented endpoint:

``` text
DELETE /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
```

Path parameters:

``` text
cityId
zoneId
divisionId
```

This route deletes the specified division.

------------------------------------------------------------------------

# 7. Route Summary

  --------------------------------------------------------------------------------------------------------------
  Method            Endpoint                                                Controller         Purpose
  ----------------- ------------------------------------------------------- ------------------ -----------------
  POST              `/cities/:cityId/zones/:zoneId/divisions`               `createDivision`   Create a division

  GET               `/cities/:cityId/zones/:zoneId/divisions`               `getDivisions`     Get divisions

  GET               `/cities/:cityId/zones/:zoneId/divisions/:divisionId`   `getDivision`      Get one division

  PATCH             `/cities/:cityId/zones/:zoneId/divisions/:divisionId`   `updateDivision`   Update a division

  DELETE            `/cities/:cityId/zones/:zoneId/divisions/:divisionId`   `deleteDivision`   Delete a division
  --------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 8. Hierarchical Route Flow

``` text
City
  ↓
Zone
  ↓
Division
```

The division routes preserve the parent hierarchy through:

``` text
cityId
zoneId
divisionId
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

# 10. Complete Route Flow

``` text
Master Citizen Division Router
              ↓
        City + Zone Context
              ↓
          Division
              ↓
+------+------+------+------+------+
|      |      |      |      |
POST   GET    GET    PATCH  DELETE
|      |      |      |      |
↓      ↓      ↓      ↓      ↓
create getAll getOne update delete
```

------------------------------------------------------------------------

# 11. Summary

`masterCitizenDivision.routes(2).js` defines the division-level
master-citizen routes. It supports creating, listing, retrieving,
updating, and deleting divisions while preserving the City → Zone →
Division hierarchy through the route parameters.
