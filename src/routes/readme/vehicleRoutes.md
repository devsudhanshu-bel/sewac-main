# vehicleRoutes.js Documentation

## 1. File Overview

**File:** `vehicleRoutes(9).js`\
**Location:** `src/routes/vehicleRoutes.js`

The vehicle router provides:

``` text
Vehicle Summary
Average Weight by Zone
Vehicle Listing
Vehicle Lookup
Vehicle Creation
Vehicle Update
Vehicle Deletion
```

It uses:

``` text
vehicleController
```

The file imports authentication and permission middleware, but the
currently declared vehicle routes do not attach those middleware
functions.

------------------------------------------------------------------------

# 2. GET /summary

Calls:

``` text
getVehicleSummary
```

This route retrieves the vehicle summary.

------------------------------------------------------------------------

# 3. GET /average-weight-by-zone

Calls:

``` text
getAverageWeightByZone
```

The route is:

``` text
GET /average-weight-by-zone
```

The file provides an example query parameter:

``` text
date
```

Example:

``` text
/api/vehicles/average-weight-by-zone?date=2026-08-24
```

------------------------------------------------------------------------

# 4. GET /

Calls:

``` text
getAllVehicles
```

This route retrieves all vehicles.

------------------------------------------------------------------------

# 5. GET /:vehicleId

Calls:

``` text
getVehicleById
```

Path parameter:

``` text
vehicleId
```

This route retrieves a vehicle by its ID.

------------------------------------------------------------------------

# 6. POST /

Calls:

``` text
createVehicle
```

This route creates a vehicle.

------------------------------------------------------------------------

# 7. PUT /:vehicleId

Calls:

``` text
updateVehicle
```

Path parameter:

``` text
vehicleId
```

This route updates the specified vehicle.

------------------------------------------------------------------------

# 8. DELETE /:vehicleId

Calls:

``` text
deleteVehicle
```

Path parameter:

``` text
vehicleId
```

This route deletes the specified vehicle.

------------------------------------------------------------------------

# 9. Route Summary

  ------------------------------------------------------------------------------------------
  Method            Endpoint                    Controller                 Purpose
  ----------------- --------------------------- -------------------------- -----------------
  GET               `/summary`                  `getVehicleSummary`        Get vehicle
                                                                           summary

  GET               `/average-weight-by-zone`   `getAverageWeightByZone`   Get average
                                                                           weight by zone

  GET               `/`                         `getAllVehicles`           Get all vehicles

  GET               `/:vehicleId`               `getVehicleById`           Get one vehicle

  POST              `/`                         `createVehicle`            Create a vehicle

  PUT               `/:vehicleId`               `updateVehicle`            Update a vehicle

  DELETE            `/:vehicleId`               `deleteVehicle`            Delete a vehicle
  ------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 10. Route Ordering

The static routes:

``` text
/summary
/average-weight-by-zone
```

are declared before:

``` text
/:vehicleId
```

This preserves their intended matching behavior and prevents those
static paths from being interpreted as vehicle IDs.

------------------------------------------------------------------------

# 11. Authentication

The file imports:

``` text
authMiddleware
checkPermission
```

and documents vehicle permissions in comments.

However, neither middleware is attached to the route declarations shown
in the supplied file.

Therefore this route file does not explicitly enforce authentication or
permissions on these endpoints.

------------------------------------------------------------------------

# 12. Complete Route Flow

``` text
Vehicle Router
      ↓
+-------------------------------+
|       |        |       |      |
summary avg-zone  /     /:id   mutations
  |       |       |       |       |
  ↓       ↓       ↓       ↓       ↓
Summary  Zone   All   By ID   Create/Update/Delete
```

------------------------------------------------------------------------

# 13. Endpoint Summary

  Method   Endpoint                    Purpose
  -------- --------------------------- ------------------------
  GET      `/summary`                  Vehicle summary
  GET      `/average-weight-by-zone`   Average weight by zone
  GET      `/`                         List all vehicles
  GET      `/:vehicleId`               Get vehicle by ID
  POST     `/`                         Create vehicle
  PUT      `/:vehicleId`               Update vehicle
  DELETE   `/:vehicleId`               Delete vehicle

------------------------------------------------------------------------

# 14. Summary

`vehicleRoutes(9).js` is the vehicle management routing layer. It
provides vehicle summary and zone-weight analytics together with
complete vehicle listing, lookup, creation, update, and deletion
endpoints. The static analytics routes are declared before
`/:vehicleId`, while the imported authentication and permission
middleware are not attached to the route definitions in the supplied
file.
