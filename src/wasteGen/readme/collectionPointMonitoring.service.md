# collectionPointMonitoring.service.js Documentation

## 1. File Overview

**File:** `collectionPointMonitoring.service.js`

The collection-point monitoring service retrieves GPS-based monitoring
data for a specific ward and date.

The processing flow is:

``` text
Ward Number
      ↓
day_DDMMYYYY
      ↓
Vehicles belonging to ward
      ↓
vehicle_table_name
      ↓
Vehicle telemetry table
      ↓
latitude + longitude + complete row
```

The service uses the telemetry Prisma client.

------------------------------------------------------------------------

# 2. Telemetry Prisma Client

The service initializes a Prisma client with error logging enabled.

The client is used for raw SQL queries against:

``` text
Day Tables
Vehicle Telemetry Tables
```

------------------------------------------------------------------------

# 3. makeJsonSafe()

The helper:

``` text
makeJsonSafe(value)
```

converts database values into JSON-safe values.

It handles:

``` text
null / undefined
BigInt
Date
Number
String
Boolean
Array
Prisma Decimal-like values
Generic Objects
```

------------------------------------------------------------------------

# 4. BigInt Conversion

BigInt values are converted using:

``` text
value.toString()
```

Therefore:

``` text
BigInt → String
```

This preserves large database identifiers without losing numeric
precision.

------------------------------------------------------------------------

# 5. Date Conversion

JavaScript `Date` objects are converted using:

``` text
toISOString()
```

Therefore:

``` text
Date → ISO String
```

------------------------------------------------------------------------

# 6. Number Handling

Numbers are returned normally unless they are:

``` text
NaN
Infinity
-Infinity
```

Non-finite numbers are converted to:

``` text
null
```

------------------------------------------------------------------------

# 7. Array and Object Handling

Arrays are recursively processed using:

``` text
makeJsonSafe()
```

Objects are recursively traversed so nested database-specific values are
also converted safely.

------------------------------------------------------------------------

# 8. Decimal Handling

Objects exposing:

``` text
toNumber()
toString()
```

are treated as Decimal-like values and converted using:

``` text
toString()
```

The value is therefore preserved as a string.

------------------------------------------------------------------------

# 9. validateTableName()

The helper:

``` text
validateTableName(tableName)
```

validates dynamically generated PostgreSQL table names.

A valid table name must:

``` text
be a string
contain only letters
contain only numbers
contain underscores
```

The validation pattern is:

``` text
^[a-zA-Z0-9_]+$
```

Invalid table names cause an error.

------------------------------------------------------------------------

# 10. buildDayTableName()

The helper:

``` text
buildDayTableName(dateInput)
```

converts:

``` text
YYYY-MM-DD
```

into:

``` text
day_DDMMYYYY
```

Example:

``` text
2026-08-17
      ↓
day_17082026
```

The function validates both the format and the actual calendar date.

------------------------------------------------------------------------

# 11. getCollectionPointMonitoring()

The main service method is:

``` text
getCollectionPointMonitoring({
  wardNo,
  date
})
```

It requires:

``` text
wardNo
date
```

and performs the complete collection-point monitoring retrieval process.

------------------------------------------------------------------------

# 12. Ward Validation

The supplied ward number is converted using:

``` text
Number(wardNo)
```

It must produce an integer.

Otherwise the service throws:

``` text
Invalid ward number
```

------------------------------------------------------------------------

# 13. Day Table Construction

The supplied date is passed to:

``` text
buildDayTableName()
```

The resulting table name is then validated using:

``` text
validateTableName()
```

Example:

``` text
2026-08-17
      ↓
day_17082026
```

------------------------------------------------------------------------

# 14. Vehicle Lookup

The service queries the generated day table for:

``` text
vehicle_number
vehicle_table_name
ward_no
created_at
```

using:

``` text
WHERE ward_no = $1
```

Results are ordered by:

``` text
vehicle_number ASC
```

------------------------------------------------------------------------

# 15. Missing Day Table

If PostgreSQL returns:

``` text
42P01
```

for the day table, the service returns an empty monitoring result:

``` json
{
  "ward_id": 216,
  "date": "day_17082026",
  "vehicle_count": 0,
  "point_count": 0,
  "vehicles": {}
}
```

The values depend on the supplied request.

------------------------------------------------------------------------

# 16. Vehicle Processing

For each registered vehicle, the service obtains:

``` text
vehicle_number
vehicle_table_name
ward_no
created_at
```

The vehicle table name is then independently validated.

------------------------------------------------------------------------

# 17. Invalid Vehicle Table

If a vehicle table name fails validation, that vehicle receives:

``` text
point_count = 0
points = []
```

while retaining its:

``` text
vehicle_number
vehicle_table_name
ward_no
registered_at
```

Processing then continues with the remaining vehicles.

------------------------------------------------------------------------

# 18. Vehicle Telemetry Query

For every valid vehicle table, the service executes a query equivalent
to:

``` sql
SELECT *
FROM "vehicle_table_name"
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
ORDER BY id ASC;
```

This retrieves complete telemetry rows where both GPS coordinates are
present.

------------------------------------------------------------------------

# 19. Missing Vehicle Table

If a vehicle telemetry table does not exist and PostgreSQL returns:

``` text
42P01
```

the service creates an empty result for that vehicle:

``` text
point_count = 0
points = []
```

and continues with the next vehicle.

------------------------------------------------------------------------

# 20. GPS Coordinate Processing

For every telemetry row:

``` text
latitude
longitude
```

are converted using:

``` text
Number()
```

Both values must be finite numbers.

Rows with invalid coordinates are discarded.

------------------------------------------------------------------------

# 21. Complete Telemetry Data

Each valid telemetry row is passed through:

``` text
makeJsonSafe(row)
```

The source explicitly identifies fields such as:

``` text
id
iotTimestamp
receivedTimestamp
rfidEpc
citizenId
wasteType
latitude
longitude
wetWeight
dryWeight
otherWeight
cumulativeWeight
driverName
vehicleNumber
firmwareVersion
unitNumber
collectionType
remarks
errorCode
citizenContact
driverAction
created_at
```

and any additional columns present in the queried table.

------------------------------------------------------------------------

# 22. GPS Point Structure

Each valid telemetry row becomes a point containing:

``` text
latitude
longitude
data
```

Conceptually:

``` json
{
  "latitude": "...",
  "longitude": "...",
  "data": "complete JSON-safe telemetry row"
}
```

------------------------------------------------------------------------

# 23. Point Counting

For each vehicle:

``` text
point_count = points.length
```

The service also maintains:

``` text
totalPointCount
```

which is the sum of valid GPS points across all processed vehicles.

------------------------------------------------------------------------

# 24. Vehicle Response Structure

Each vehicle is stored using its vehicle number as the response key.

Each entry contains:

``` text
vehicle_number
vehicle_table_name
ward_no
registered_at
point_count
points
```

------------------------------------------------------------------------

# 25. Final Response

The final response structure is:

``` json
{
  "ward_id": "...",
  "date": "...",
  "vehicle_count": "...",
  "point_count": "...",
  "vehicles": {}
}
```

The `vehicle_count` is calculated from the number of vehicle entries in
the response object.

------------------------------------------------------------------------

# 26. Final JSON Safety Pass

Before returning, the complete response is passed through:

``` text
makeJsonSafe(response)
```

This ensures that database-specific values such as:

``` text
BigInt
Date
Decimal-like values
```

cannot escape into the JSON response in an unsupported form.

------------------------------------------------------------------------

# 27. Error Handling

Missing dynamic tables are handled specifically through PostgreSQL error
code:

``` text
42P01
```

The service handles:

``` text
Missing day table
Missing vehicle table
```

by returning empty results and continuing where appropriate.

Other errors are re-thrown.

------------------------------------------------------------------------

# 28. Database Query Strategy

The service uses raw SQL for dynamic table queries.

Dynamic table names are validated before being inserted into SQL.

The ward value itself is passed as a SQL parameter:

``` text
WHERE ward_no = $1
```

This separates the dynamic identifier validation from the parameterized
ward filter.

------------------------------------------------------------------------

# 29. Vehicle Processing Resilience

A problem with one vehicle does not necessarily stop the complete
monitoring operation.

For example:

``` text
Invalid vehicle table
      ↓
Empty vehicle result
      ↓
Continue next vehicle
```

and:

``` text
Missing vehicle table
      ↓
Empty vehicle result
      ↓
Continue next vehicle
```

------------------------------------------------------------------------

# 30. Complete Service Flow

``` text
wardNo + date
      ↓
Validate ward
      ↓
Build day_DDMMYYYY
      ↓
Validate day table
      ↓
Query vehicles for ward
      ↓
For each vehicle
      ↓
Validate vehicle table
      ↓
Query complete telemetry rows
      ↓
Require latitude + longitude
      ↓
Convert coordinates
      ↓
Discard invalid coordinates
      ↓
makeJsonSafe(row)
      ↓
Build vehicle points
      ↓
Calculate counts
      ↓
Final makeJsonSafe()
      ↓
Return response
```

------------------------------------------------------------------------

# 31. Data Architecture

The service follows:

``` text
Ward
 ↓
Day Table
 ↓
Vehicle Registry
 ↓
Vehicle Telemetry Table
 ↓
Telemetry Rows
 ↓
Valid GPS Points
 ↓
Vehicle-wise Monitoring Data
```

The final response preserves both:

``` text
Vehicle-level information
```

and:

``` text
Complete telemetry-row information
```

------------------------------------------------------------------------

# 32. Summary

`collectionPointMonitoring.service.js` implements the collection-point
monitoring data retrieval layer.

It:

``` text
Validates the ward
Validates the requested date
Builds the dynamic day table name
Finds vehicles belonging to the ward
Validates vehicle telemetry table names
Retrieves complete telemetry rows with GPS coordinates
Converts database-specific values into JSON-safe values
Builds vehicle-wise GPS point collections
Counts vehicles and points
Handles missing day/vehicle tables gracefully
Returns the final monitoring structure
```

The central flow is:

``` text
Ward + Date
     ↓
Day Table
     ↓
Ward Vehicles
     ↓
Vehicle Telemetry Tables
     ↓
Valid GPS Telemetry
     ↓
Vehicle-wise Monitoring Data
```
