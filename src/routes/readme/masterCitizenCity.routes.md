# masterCitizenCity.routes.js Documentation

## 1. File Overview

**File:** `masterCitizenCity.routes(2).js`\
**Location:** `src/routes/masterCitizenCity.routes.js`

The master-citizen city router provides CRUD-style city operations.

It uses:

``` text
masterCitizenCity.controller
```

The available operations are:

``` text
Create City
Get All Cities
Get One City
```

------------------------------------------------------------------------

# 2. POST /cities

Calls:

``` text
controller.createCity
```

Full documented endpoint:

``` text
POST /api/master-citizen/cities
```

This route creates a new city.

------------------------------------------------------------------------

# 3. GET /cities

Calls:

``` text
controller.getCities
```

Full documented endpoint:

``` text
GET /api/master-citizen/cities
```

This route retrieves all cities.

------------------------------------------------------------------------

# 4. GET /cities/:cityId

Calls:

``` text
controller.getCity
```

Full documented endpoint:

``` text
GET /api/master-citizen/cities/:cityId
```

Path parameter:

``` text
cityId
```

This route retrieves one city.

------------------------------------------------------------------------

# 5. Route Summary

  Method   Endpoint            Controller     Purpose
  -------- ------------------- -------------- ----------------
  POST     `/cities`           `createCity`   Create a city
  GET      `/cities`           `getCities`    Get all cities
  GET      `/cities/:cityId`   `getCity`      Get one city

------------------------------------------------------------------------

# 6. Complete Route Flow

``` text
Master Citizen City Router
          ↓
+------------------------------+
|              |               |
POST /cities  GET /cities   GET /cities/:cityId
|              |               |
↓              ↓               ↓
createCity   getCities       getCity
```

------------------------------------------------------------------------

# 7. Authentication

No:

``` text
authMiddleware
checkPermission
```

is attached to these routes in the provided route file.

------------------------------------------------------------------------

# 8. Summary

`masterCitizenCity.routes(2).js` defines the city-level master-citizen
routes for creating cities, retrieving all cities, and retrieving an
individual city by `cityId`.
