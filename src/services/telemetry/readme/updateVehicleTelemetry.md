# updateVehicleTelemetry.js Documentation

## 1. File Overview

**File:** `updateVehicleTelemetry.js`

This file defines an asynchronous helper function responsible for
inserting the latest vehicle GPS telemetry into the:

``` text
vehicle_telemetry
```

database table.

The service receives:

``` text
vehicleId
latitude
longitude
```

and creates a new telemetry record with the current server timestamp.

The execution flow is:

``` text
Vehicle ID
    +
Latitude
    +
Longitude
    ↓
INSERT INTO vehicle_telemetry
    ↓
recorded_at = NOW()
    ↓
Telemetry record stored
    ↓
"Vehicle telemetry updated."
```

------------------------------------------------------------------------

# 2. Dependency

The service imports:

``` js
const mainDb = require("../../config/mainDb");
```

Therefore database access is provided by:

``` text
../../config/mainDb
```

No other dependencies are used.

------------------------------------------------------------------------

# 3. updateVehicleTelemetry()

The main function is:

``` js
const updateVehicleTelemetry = async ({
  vehicleId,
  latitude,
  longitude,
}) => {
```

It is asynchronous and accepts a destructured object containing:

``` text
vehicleId
latitude
longitude
```

------------------------------------------------------------------------

# 4. Input Parameters

## vehicleId

Identifies the vehicle whose telemetry is being recorded.

It is inserted into:

``` text
vehicle_id
```

------------------------------------------------------------------------

## latitude

Represents the vehicle's latitude coordinate.

It is inserted into:

``` text
latitude
```

No explicit coordinate-range validation is performed in this function.

------------------------------------------------------------------------

## longitude

Represents the vehicle's longitude coordinate.

It is inserted into:

``` text
longitude
```

No explicit coordinate-range validation is performed in this function.

------------------------------------------------------------------------

# 5. Database Table

The function writes to:

``` text
vehicle_telemetry
```

The inserted columns are:

``` text
vehicle_id
latitude
longitude
recorded_at
```

------------------------------------------------------------------------

# 6. SQL Operation

The service executes an:

``` sql
INSERT
```

statement:

``` sql
INSERT INTO vehicle_telemetry
(
  vehicle_id,
  latitude,
  longitude,
  recorded_at
)
VALUES
(
  $1,
  $2,
  $3,
  NOW()
)
```

------------------------------------------------------------------------

# 7. Parameterized Query

The dynamic values are supplied separately through:

``` js
[
  vehicleId,
  latitude,
  longitude
]
```

The mappings are:

``` text
$1 → vehicleId
$2 → latitude
$3 → longitude
```

This uses a parameterized PostgreSQL query rather than directly
interpolating values into SQL.

------------------------------------------------------------------------

# 8. recorded_at Timestamp

The service does not receive a timestamp from the caller.

Instead, the database generates the timestamp using:

``` sql
NOW()
```

Therefore:

``` text
recorded_at
```

represents the database server's current timestamp at insertion time.

The flow is:

``` text
Function called
      ↓
Database INSERT
      ↓
NOW()
      ↓
recorded_at
```

------------------------------------------------------------------------

# 9. Telemetry Record

A successful operation creates a record conceptually equivalent to:

``` text
vehicle_id   = vehicleId
latitude     = latitude
longitude    = longitude
recorded_at  = current database time
```

------------------------------------------------------------------------

# 10. No Update of Existing Record

Despite the function name:

``` text
updateVehicleTelemetry
```

the current implementation performs:

``` text
INSERT
```

rather than:

``` text
UPDATE
```

Therefore every successful invocation creates a new row in:

``` text
vehicle_telemetry
```

It does not modify a previous telemetry record.

------------------------------------------------------------------------

# 11. Telemetry History

Because the function inserts a new row every time it is called, repeated
calls can create a telemetry history:

``` text
Vehicle A
   ↓
Latitude / Longitude #1
   ↓
Latitude / Longitude #2
   ↓
Latitude / Longitude #3
   ↓
...
```

Each record receives its own:

``` text
recorded_at
```

timestamp.

------------------------------------------------------------------------

# 12. Console Logging

After the database query succeeds, the function logs:

``` text
Vehicle telemetry updated.
```

This indicates that the insert operation completed without throwing an
error.

------------------------------------------------------------------------

# 13. Error Handling

The function does not contain an explicit:

``` text
try / catch
```

block.

Therefore if:

``` js
mainDb.query()
```

fails, the database error propagates to the caller.

The success message is reached only after the awaited database query
completes successfully.

------------------------------------------------------------------------

# 14. Return Value

The function does not explicitly return:

``` text
rows
```

or the inserted telemetry record.

After:

``` js
await mainDb.query(...)
```

the function logs the success message and reaches the end.

Therefore the successful resolved value is:

``` text
undefined
```

------------------------------------------------------------------------

# 15. Database Interaction

This service uses:

``` text
mainDb
```

and writes to:

``` text
vehicle_telemetry
```

It does not directly interact with:

``` text
Prisma
Redis
Telemetry Queue
Master Citizen
Vehicle Master
```

------------------------------------------------------------------------

# 16. Validation Scope

The current function does not explicitly validate:

``` text
vehicleId
latitude
longitude
```

There are no checks for:

``` text
Missing vehicle ID
Invalid latitude
Invalid longitude
Latitude range
Longitude range
```

Any such validation must therefore be handled by:

``` text
Caller
Database constraints
Downstream logic
```

if present elsewhere.

------------------------------------------------------------------------

# 17. Complete Field Mapping

The function maps:

``` text
vehicleId
    ↓
vehicle_id

latitude
    ↓
latitude

longitude
    ↓
longitude

Database NOW()
    ↓
recorded_at
```

------------------------------------------------------------------------

# 18. Complete Execution Flow

``` text
updateVehicleTelemetry({
    vehicleId,
    latitude,
    longitude
})
        ↓
mainDb.query()
        ↓
INSERT INTO vehicle_telemetry
        ↓
vehicle_id = vehicleId
        ↓
latitude = latitude
        ↓
longitude = longitude
        ↓
recorded_at = NOW()
        ↓
Database insert succeeds
        ↓
"Vehicle telemetry updated."
        ↓
undefined
```

------------------------------------------------------------------------

# 19. Architectural Role

This file functions as a simple:

``` text
Vehicle Telemetry Persistence Helper
```

Its responsibility is narrowly focused on storing a vehicle's GPS
location.

The function does not calculate:

``` text
Distance
Route
Live status
Vehicle activity
Telemetry history
```

It only persists:

``` text
Vehicle ID
Latitude
Longitude
Timestamp
```

------------------------------------------------------------------------

# 20. Important Implementation Detail

The timestamp is generated by PostgreSQL:

``` sql
NOW()
```

rather than JavaScript.

Therefore the timestamp used for:

``` text
recorded_at
```

comes from the database server at insertion time.

------------------------------------------------------------------------

# 21. Important Implementation Detail

The function uses an:

``` text
INSERT
```

for every call.

Therefore the table can retain multiple historical locations for the
same vehicle.

Conceptually:

``` text
vehicle_id = KA05AB1237
recorded_at = 10:00
latitude = ...
longitude = ...

vehicle_id = KA05AB1237
recorded_at = 10:05
latitude = ...
longitude = ...

vehicle_id = KA05AB1237
recorded_at = 10:10
latitude = ...
longitude = ...
```

------------------------------------------------------------------------

# 22. Export

The function is exported using:

``` js
module.exports = updateVehicleTelemetry;
```

Other modules can import and invoke it directly.

------------------------------------------------------------------------

# 23. Summary

`updateVehicleTelemetry.js` is a lightweight database persistence helper
for vehicle GPS telemetry.

Its core responsibility is:

``` text
Receive vehicleId
Receive latitude
Receive longitude
        ↓
Insert into vehicle_telemetry
        ↓
Use database NOW() for recorded_at
        ↓
Log success
```

The inserted fields are:

``` text
vehicle_id
latitude
longitude
recorded_at
```

The function performs an:

``` text
INSERT
```

rather than an actual row update, so every invocation creates a new
telemetry record.

It does not currently implement:

``` text
Coordinate validation
Vehicle validation
Distance calculation
Live status
Route tracking
Telemetry aggregation
```

Overall:

``` text
Vehicle GPS Input
      ↓
updateVehicleTelemetry()
      ↓
mainDb
      ↓
vehicle_telemetry
      ↓
Historical GPS Record
```
