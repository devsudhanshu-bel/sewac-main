# routeMapService.js Documentation

## 1. File Overview

**File:** `routeMapService.js`\
**Location:** Service layer for the live route-map functionality.

This service provides the business-logic layer for retrieving live
vehicle locations for a selected:

``` text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

It coordinates:

``` text
Input validation
Database identifier validation
City lookup
Zone lookup
Division lookup
Ward lookup
Vehicle-to-ward mapping
Today's telemetry-table mapping
Yesterday's telemetry fallback
Latest GPS retrieval
Telemetry timestamp validation
Vehicle live/inactive status
Haversine distance calculation
Nearest-vehicle sorting
Flutter response construction
```

The main flow is:

``` text
Person Latitude + Longitude
            +
City ID + Zone ID + Division ID + Ward ID
            ↓
      Validate Inputs
            ↓
   Resolve Selected Ward
            ↓
   Find Registered Vehicles
            ↓
 Resolve Today's Telemetry Tables
            ↓
 Resolve Yesterday's Fallback Tables
            ↓
      Get Latest GPS
            ↓
 Determine ACTIVE / INACTIVE
            ↓
 Calculate Haversine Distance
            ↓
      Sort Nearest First
            ↓
       Flutter Response
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
mainDb
masterCitizenPrisma
telemetryDb
```

The database clients are imported from:

``` text
../config/mainDb
../config/masterCitizenPrisma
../config/telemetryDb
```

The three databases have separate responsibilities:

``` text
masterCitizenPrisma
    ↓
Master Citizen geographic hierarchy

mainDb
    ↓
vehicle_master

telemetryDb
    ↓
Daily vehicle telemetry tables
```

------------------------------------------------------------------------

# 3. DATABASE IDENTIFIER SAFETY

The service defines:

``` js
IDENTIFIER_REGEX
```

using:

``` text
/^[A-Za-z_][A-Za-z0-9_]*$/
```

This validates dynamically supplied PostgreSQL identifiers.

A valid identifier must:

``` text
Start with a letter or underscore
Continue with letters, numbers, or underscores
```

------------------------------------------------------------------------

# 4. quoteIdentifier()

This helper safely validates and quotes a database identifier.

It receives:

``` text
identifier
```

The identifier must satisfy:

``` text
IDENTIFIER_REGEX
```

If it is not a string or does not match the identifier pattern, the
service throws:

``` text
Unsafe database identifier: <identifier>
```

------------------------------------------------------------------------

## quoteIdentifier() Result

For a valid identifier:

``` text
vehicle_table
```

the helper returns:

``` sql
"vehicle_table"
```

The function also escapes any double quotes before returning the
identifier.

This helper is used before dynamically interpolating:

``` text
City tables
Zone tables
Division tables
Telemetry day tables
Vehicle telemetry tables
```

------------------------------------------------------------------------

# 5. parsePositiveInteger()

This helper validates positive integer parameters.

It receives:

``` text
value
fieldName
```

It is used for:

``` text
cityId
zoneId
divisionId
wardId
```

------------------------------------------------------------------------

## Missing Positive Integer

If the value is:

``` text
undefined
null
empty string
```

the service throws:

``` text
latitude, longitude, cityId, zoneId, divisionId and wardId are required.
```

The error has:

``` text
statusCode = 400
```

------------------------------------------------------------------------

## Invalid Positive Integer

The value is converted using:

``` js
Number(value)
```

It must then satisfy:

``` text
Number.isInteger(parsed)
parsed > 0
```

Otherwise the service throws:

``` text
<fieldName> must be a positive integer
```

with:

``` text
statusCode = 400
```

------------------------------------------------------------------------

# 6. parseCoordinate()

This helper validates latitude and longitude values.

It receives:

``` text
value
fieldName
min
max
```

It first checks for:

``` text
undefined
null
empty string
```

and throws:

``` text
latitude, longitude, cityId, zoneId, divisionId and wardId are required.
```

with:

``` text
statusCode = 400
```

------------------------------------------------------------------------

## Coordinate Validation

The value is converted using:

``` js
Number(value)
```

The parsed value must satisfy:

``` text
Number.isFinite(parsed)
parsed >= min
parsed <= max
```

Otherwise the service throws:

``` text
Invalid latitude or longitude.
```

with:

``` text
statusCode = 400
```

------------------------------------------------------------------------

# 7. Coordinate Ranges

The live-route service uses:

## Latitude

``` text
-90 to 90
```

## Longitude

``` text
-180 to 180
```

Therefore the user's location is validated against the standard
geographic coordinate ranges.

------------------------------------------------------------------------

# 8. getDayTableName()

This helper generates the daily telemetry table name.

It receives:

``` text
date
```

The generated format is:

``` text
day_DDMMYYYY
```

For example:

``` text
24 August 2026
        ↓
day_24082026
```

The service builds the value using:

``` text
day_
DD
MM
YYYY
```

------------------------------------------------------------------------

# 9. getSelectedWard()

This function resolves the complete:

``` text
City → Zone → Division → Ward
```

hierarchy.

It receives:

``` text
cityId
zoneId
divisionId
wardId
```

It validates all four IDs before querying the hierarchy.

------------------------------------------------------------------------

# 10. getSelectedWard() --- City

The service calls:

``` js
masterCitizenPrisma.city_table.findUnique()
```

using:

``` text
city_id = selectedCityId
```

If the city does not exist, it throws:

``` text
City not found
```

with:

``` text
statusCode = 400
```

------------------------------------------------------------------------

# 11. City Dynamic Table Validation

The city must contain:

``` text
city_table_name
```

If missing, the service throws:

``` text
City has no dynamic table registered
```

The city table name is passed through:

``` text
quoteIdentifier()
```

before being used in raw SQL.

------------------------------------------------------------------------

# 12. getSelectedWard() --- Zone

The service queries the city dynamic table for:

``` text
zone_id
zone_name
zone_table_name
```

using:

``` text
zone_id = selectedZoneId
```

and:

``` text
LIMIT 1
```

If no zone exists:

``` text
Zone not found in selected city
```

------------------------------------------------------------------------

# 13. Zone Dynamic Table Validation

The selected zone must contain:

``` text
zone_table_name
```

If missing, the service throws:

``` text
Selected zone has no dynamic table registered
```

The zone table name is then safely quoted.

------------------------------------------------------------------------

# 14. getSelectedWard() --- Division

The service queries the zone dynamic table for:

``` text
division_id
division_name
division_table_name
```

using:

``` text
division_id = selectedDivisionId
```

and:

``` text
LIMIT 1
```

If no division exists:

``` text
Division not found in selected zone
```

------------------------------------------------------------------------

# 15. Division Dynamic Table Validation

The selected division must contain:

``` text
division_table_name
```

If missing, the service throws:

``` text
Selected division has no dynamic table registered
```

The division table name is safely quoted.

------------------------------------------------------------------------

# 16. getSelectedWard() --- Ward Lookup

The service queries the division table for:

``` text
ward_id
ward_no
ward_name
ward_table_name
```

The lookup accepts either:

``` text
ward_id
```

or:

``` text
ward_no
```

using:

``` sql
WHERE ward_id = $1
   OR ward_no = $1
```

The result is ordered so that an exact:

``` text
ward_id
```

match is preferred.

------------------------------------------------------------------------

# 17. Ward Identifier Compatibility

The service explicitly accounts for two possible ward identifiers:

``` text
ward_id
ward_no
```

The incoming:

``` text
wardId
```

may therefore match either field.

The preference is:

``` text
ward_id match
    ↓
Higher priority

ward_no match
    ↓
Fallback
```

------------------------------------------------------------------------

# 18. Ward Not Found

If no matching ward exists, the service throws:

``` text
Ward not found in selected division
```

------------------------------------------------------------------------

# 19. Ward Number Validation

After retrieving the ward, the service converts:

``` text
ward.ward_no
```

to a number.

The resulting value must be an integer.

If not, it throws:

``` text
Selected ward has an invalid ward number
```

The normalized value is stored as:

``` text
wardNo
```

------------------------------------------------------------------------

# 20. getSelectedWard() Return Value

The helper returns:

``` text
cityId
cityName
zoneId
zoneName
divisionId
divisionName
wardId
wardNo
wardName
wardTableName
masterWardId
```

The values represent the complete selected hierarchy.

------------------------------------------------------------------------

# 21. masterWardId

The returned:

``` text
masterWardId
```

is created from:

``` js
Number(ward.ward_id)
```

This preserves the actual Master Citizen ward primary-key value even
when the requested:

``` text
wardId
```

was matched using:

``` text
ward_no
```

------------------------------------------------------------------------

# 22. getVehicleTablesForWard()

This function retrieves vehicles registered for the selected ward and
resolves today's telemetry table mappings.

It receives:

``` text
date
ward
```

------------------------------------------------------------------------

# 23. Vehicle-to-Ward Mapping

Vehicles are retrieved from:

``` text
vehicle_master
```

using:

``` sql
WHERE ward_no = $1
```

The authoritative vehicle-to-ward mapping is:

``` text
ward_no
```

The service does not additionally require textual matches for:

``` text
city
zone
division
ward
```

------------------------------------------------------------------------

# 24. Vehicle Master Fields

The query retrieves:

``` text
vehicle_id
vehicle_type
city
zone
division
ward
ward_no
```

The returned vehicle objects contain:

``` text
vehicleNumber
vehicleType
wardNo
vehicleTableName
```

------------------------------------------------------------------------

# 25. Vehicle Number Normalization

The vehicle number is converted to a trimmed string:

``` js
String(row.vehicle_id).trim()
```

If the database value is:

``` text
null
undefined
```

the service stores:

``` text
vehicleNumber = null
```

------------------------------------------------------------------------

# 26. Vehicle Type

The vehicle type is returned from:

``` text
vehicle_type
```

If missing, it becomes:

``` text
null
```

------------------------------------------------------------------------

# 27. Vehicle Ward Number

If:

``` text
row.ward_no
```

exists, it is converted to:

``` text
Number(row.ward_no)
```

Otherwise the selected ward's:

``` text
ward.wardNo
```

is used.

------------------------------------------------------------------------

# 28. No Vehicles Registered

If no vehicle exists in:

``` text
vehicle_master
```

for the selected:

``` text
ward_no
```

the function returns:

``` text
[]
```

------------------------------------------------------------------------

# 29. Today's Telemetry Table

The service generates today's telemetry table using:

``` js
getDayTableName(date)
```

For example:

``` text
24 August 2026
        ↓
day_24082026
```

The generated identifier is safely quoted.

------------------------------------------------------------------------

# 30. Today's Vehicle Telemetry Mapping

The service queries the daily telemetry table for:

``` text
vehicle_number
vehicle_table_name
ward_no
```

using:

``` text
ward_no = selected ward number
```

and requiring:

``` text
vehicle_number IS NOT NULL
vehicle_table_name IS NOT NULL
```

------------------------------------------------------------------------

# 31. Telemetry Mapping Validation

A telemetry mapping is accepted only when:

``` text
vehicle_number exists
vehicle_table_name is a string
vehicle_table_name matches IDENTIFIER_REGEX
```

Invalid mappings are ignored.

The accepted mappings are stored in:

``` text
mappingByVehicle
```

using:

``` text
vehicleNumber
    ↓
vehicleTableName
```

------------------------------------------------------------------------

# 32. Missing Today's Telemetry Table

If today's telemetry table does not exist, PostgreSQL can return:

``` text
42P01
```

The service treats this as:

``` text
No telemetry mapping for today
```

and continues without throwing.

Other database errors are propagated.

------------------------------------------------------------------------

# 33. Keep All Registered Vehicles

The service intentionally keeps every vehicle from:

``` text
vehicle_master
```

even when it has no telemetry mapping for today.

Therefore:

``` text
Registered Vehicle
        ↓
No telemetry
        ↓
Still returned
```

Its:

``` text
vehicleTableName
```

becomes:

``` text
null
```

------------------------------------------------------------------------

# 34. addYesterdayTelemetryMappings()

This function provides yesterday's telemetry-table fallback.

It receives:

``` text
vehicleTables
wardNo
```

It calculates:

``` text
yesterday
```

and generates:

``` text
day_DDMMYYYY
```

for the previous date.

------------------------------------------------------------------------

# 35. Yesterday Vehicle Mapping

The service queries yesterday's telemetry table for:

``` text
vehicle_number
vehicle_table_name
ward_no
```

using:

``` text
ward_no = wardNo
```

Only vehicles already known from:

``` text
vehicleTables
```

are accepted.

------------------------------------------------------------------------

# 36. Yesterday Mapping Conditions

A yesterday mapping is accepted only when:

``` text
vehicle_number exists
vehicle is already registered
vehicle_table_name is a valid identifier
```

The resulting mapping is stored as:

``` text
mappingByVehicle
```

------------------------------------------------------------------------

# 37. additionalVehicleTableName

If yesterday's telemetry table differs from today's mapping, the service
adds:

``` text
additionalVehicleTableName
```

to the vehicle object.

This allows the live-GPS lookup to search both:

``` text
Today's telemetry table
```

and:

``` text
Yesterday's telemetry table
```

------------------------------------------------------------------------

# 38. Missing Yesterday Table

If yesterday's telemetry table does not exist:

``` text
42P01
```

the service simply returns the existing vehicle mappings.

Other database errors are propagated.

------------------------------------------------------------------------

# 39. calculateDistanceKm()

This function calculates the geographic distance between two coordinate
pairs.

It receives:

``` text
latitude1
longitude1
latitude2
longitude2
```

The calculation uses the:

``` text
Haversine formula
```

------------------------------------------------------------------------

# 40. Earth Radius

The service uses:

``` text
6371 km
```

as the Earth's radius.

------------------------------------------------------------------------

# 41. Haversine Calculation

The calculation converts degrees to radians and computes:

``` text
dLatitude
dLongitude
lat1
lat2
```

Then:

``` text
a
```

is calculated using:

``` text
sin²(dLatitude / 2)
+
cos(lat1)
×
cos(lat2)
×
sin²(dLongitude / 2)
```

Then:

``` text
c = 2 × atan2(sqrt(a), sqrt(1-a))
```

Finally:

``` text
distance = Earth Radius × c
```

------------------------------------------------------------------------

# 42. Distance Precision

The calculated distance is rounded to:

``` text
2 decimal places
```

and returned as:

``` text
Number(...)
```

The unit is:

``` text
km
```

------------------------------------------------------------------------

# 43. getLatestVehiclePositions()

This function retrieves the latest GPS position for each registered
vehicle.

It receives:

``` text
vehicleTables
```

------------------------------------------------------------------------

# 44. Inactivity Threshold

The service defines:

``` text
now
```

and:

``` text
inactivityLimit
```

The inactivity limit is:

``` text
30 minutes before now
```

Therefore:

``` text
Telemetry within last 30 minutes
    ↓
ACTIVE

Telemetry older than 30 minutes
    ↓
INACTIVE
```

------------------------------------------------------------------------

# 45. Vehicle Without Vehicle Number

If:

``` text
vehicle.vehicleNumber
```

is missing, the vehicle is skipped.

It is not added to the live-position results.

------------------------------------------------------------------------

# 46. Current + Fallback Telemetry Tables

For each vehicle, the service builds:

``` text
vehicleTableName
additionalVehicleTableName
```

It removes:

``` text
null values
invalid identifiers
duplicate table names
```

The resulting list contains the telemetry tables that will be searched.

------------------------------------------------------------------------

# 47. Latest GPS Lookup

For every telemetry table, the service queries:

``` text
id
latitude
longitude
vehicleNumber
iottimestamp
driverName
unitNumber
```

It requires:

``` text
latitude IS NOT NULL
longitude IS NOT NULL
```

and orders by:

``` text
iottimestamp DESC NULLS LAST
id DESC
```

with:

``` text
LIMIT 1
```

------------------------------------------------------------------------

# 48. Telemetry Timestamp Column

The service explicitly uses:

``` text
iottimestamp
```

as the telemetry timestamp.

It does not use:

``` text
receivedTimestamp
```

The implementation explicitly documents this distinction.

------------------------------------------------------------------------

# 49. GPS Validation

The latest latitude and longitude are converted to numbers.

They must satisfy:

``` text
latitude:
-90 to 90

longitude:
-180 to 180
```

Invalid coordinates are ignored.

------------------------------------------------------------------------

# 50. Telemetry Timestamp Handling

If:

``` text
iottimestamp
```

is valid, it is converted into a JavaScript:

``` text
Date
```

If the timestamp is valid, the service keeps the newest telemetry point
across all candidate tables.

------------------------------------------------------------------------

# 51. Missing Telemetry Timestamp

If coordinates are valid but:

``` text
iottimestamp
```

is missing or invalid, the service still accepts the GPS point.

The timestamp is stored as:

``` text
null
```

Such a point can therefore still be returned.

------------------------------------------------------------------------

# 52. Selecting the Newest Point

When multiple telemetry tables are searched, the service compares their
timestamps.

The newest valid telemetry point is retained:

``` text
Latest timestamp
        ↓
latest
```

Therefore yesterday's fallback can still provide a position if it is the
best available valid point.

------------------------------------------------------------------------

# 53. Missing Telemetry Table During GPS Lookup

If a vehicle telemetry table does not exist:

``` text
42P01
```

the service skips that table.

It continues searching any other available telemetry table.

------------------------------------------------------------------------

# 54. Live Telemetry Error Logging

For other telemetry database errors, the service logs:

``` text
Live map telemetry error for <vehicleTableName>:
```

along with the actual database error.

This prevents real database errors from being silently hidden.

------------------------------------------------------------------------

# 55. Vehicle With No GPS

If no valid GPS point is found, the service returns:

``` text
vehicleId
latitude = null
longitude = null
distance = null
distanceUnit = "km"
status = "INACTIVE"
lastUpdated = null
```

If a vehicle type exists, it is also included.

------------------------------------------------------------------------

# 56. Vehicle Status

When valid telemetry exists, the initial status is:

``` text
ACTIVE
```

If the telemetry timestamp is older than:

``` text
30 minutes
```

the status becomes:

``` text
INACTIVE
```

------------------------------------------------------------------------

# 57. Live Vehicle Response

A vehicle with valid telemetry returns:

``` text
vehicleId
latitude
longitude
distance
distanceUnit
status
lastUpdated
vehicleType
```

The distance is initially:

``` text
null
```

because it is calculated later using the user's location.

------------------------------------------------------------------------

# 58. getLiveRouteMap()

This is the main exported service function.

It receives:

``` text
latitude
longitude
cityId
zoneId
divisionId
wardId
```

It returns the complete live route-map response.

------------------------------------------------------------------------

# 59. getLiveRouteMap() --- Person Location

The user's latitude is validated using:

``` js
parseCoordinate(
  latitude,
  "latitude",
  -90,
  90
)
```

The user's longitude is validated using:

``` js
parseCoordinate(
  longitude,
  "longitude",
  -180,
  180
)
```

The normalized values are stored as:

``` text
personLatitude
personLongitude
```

------------------------------------------------------------------------

# 60. getLiveRouteMap() --- Hierarchy Validation

The service resolves the selected geographic hierarchy using:

``` js
getSelectedWard({
  cityId,
  zoneId,
  divisionId,
  wardId,
})
```

This validates:

``` text
City
Zone
Division
Ward
```

before vehicle retrieval begins.

------------------------------------------------------------------------

# 61. getLiveRouteMap() --- Today's Vehicles

The service retrieves registered vehicles using:

``` js
getVehicleTablesForWard(
  new Date(),
  ward
)
```

This resolves today's vehicle telemetry mappings.

------------------------------------------------------------------------

# 62. getLiveRouteMap() --- Yesterday Fallback

The service then calls:

``` js
addYesterdayTelemetryMappings(
  vehicleTables,
  ward.wardNo
)
```

This adds yesterday's telemetry table reference when necessary.

------------------------------------------------------------------------

# 63. getLiveRouteMap() --- Latest GPS

The service calls:

``` js
getLatestVehiclePositions(
  vehicleTables
)
```

This returns the latest valid GPS information and live status for the
registered vehicles.

------------------------------------------------------------------------

# 64. getLiveRouteMap() --- Distance Calculation

Each vehicle with valid coordinates is processed using:

``` js
calculateDistanceKm(
  personLatitude,
  personLongitude,
  vehicle.latitude,
  vehicle.longitude
)
```

The resulting value is assigned to:

``` text
distance
```

and:

``` text
distanceUnit = "km"
```

------------------------------------------------------------------------

# 65. No GPS Distance Handling

If a vehicle has:

``` text
latitude = null
longitude = null
```

the service ensures:

``` text
distance = null
status = INACTIVE
lastUpdated = null
```

Therefore vehicles without GPS remain visible but are treated as
inactive.

------------------------------------------------------------------------

# 66. Vehicle Sorting

After distance calculation, vehicles are sorted:

``` text
nearest → farthest
```

The comparison is:

``` text
distance ascending
```

Vehicles with:

``` text
distance = null
```

are moved to the end.

------------------------------------------------------------------------

# 67. Flutter Response

The service returns:

``` text
personLocation
filters
vehicles
```

The structure is:

``` json
{
  "personLocation": {
    "latitude": "...",
    "longitude": "..."
  },
  "filters": {
    "cityId": "...",
    "zoneId": "...",
    "divisionId": "...",
    "wardId": "..."
  },
  "vehicles": []
}
```

------------------------------------------------------------------------

# 68. personLocation

The response contains:

``` text
latitude
longitude
```

representing the user's current location.

------------------------------------------------------------------------

# 69. filters

The response contains:

``` text
cityId
zoneId
divisionId
wardId
```

These values come from the resolved selected ward hierarchy.

------------------------------------------------------------------------

# 70. vehicles

The response contains the sorted vehicle list.

Each vehicle can contain:

``` text
vehicleId
latitude
longitude
distance
distanceUnit
status
lastUpdated
vehicleType
```

Vehicles without GPS contain null location and distance values.

------------------------------------------------------------------------

# 71. Database Responsibilities

The service uses three database connections.

## masterCitizenPrisma

Used for:

``` text
City lookup
Zone lookup
Division lookup
Ward lookup
```

## mainDb

Used for:

``` text
vehicle_master
```

## telemetryDb

Used for:

``` text
Daily telemetry tables
Vehicle telemetry tables
GPS records
```

------------------------------------------------------------------------

# 72. Geographic Data Flow

``` text
cityId
   ↓
city_table
   ↓
city_table_name
   ↓
Zone
   ↓
zone_table_name
   ↓
Division
   ↓
division_table_name
   ↓
Ward
```

The service then uses:

``` text
ward_no
```

to resolve registered vehicles.

------------------------------------------------------------------------

# 73. Vehicle Data Flow

``` text
Selected Ward
      ↓
ward_no
      ↓
vehicle_master
      ↓
Registered Vehicles
      ↓
Today's day_DDMMYYYY
      ↓
vehicle_table_name
      ↓
Yesterday fallback
      ↓
Latest GPS
```

------------------------------------------------------------------------

# 74. Live Status Flow

``` text
Latest GPS found?
      │
      ├── NO
      │    ↓
      │  INACTIVE
      │
      └── YES
           ↓
      Timestamp exists?
           │
           ├── NO
           │    ↓
           │  ACTIVE
           │
           └── YES
                ↓
       Timestamp within 30 min?
                │
                ├── YES → ACTIVE
                │
                └── NO  → INACTIVE
```

------------------------------------------------------------------------

# 75. Distance Flow

``` text
User Location
      +
Vehicle GPS
      ↓
Haversine Formula
      ↓
Distance in KM
      ↓
Round to 2 decimals
      ↓
Sort Ascending
```

------------------------------------------------------------------------

# 76. Missing-Data Behavior

The service intentionally keeps registered vehicles even when telemetry
is unavailable.

Therefore:

``` text
Vehicle registered
        ↓
Telemetry unavailable
        ↓
Vehicle still returned
        ↓
GPS = null
Distance = null
Status = INACTIVE
```

This allows the Flutter map to distinguish:

``` text
Vehicle does not exist
```

from:

``` text
Vehicle exists but has no current GPS
```

------------------------------------------------------------------------

# 77. Error Handling

The service creates explicit HTTP-style errors with:

``` text
statusCode = 400
```

for validation and hierarchy failures.

Explicit errors include:

``` text
Unsafe database identifier
latitude, longitude, cityId, zoneId, divisionId and wardId are required.
<fieldName> must be a positive integer
Invalid latitude or longitude.
City not found
City has no dynamic table registered
Zone not found in selected city
Selected zone has no dynamic table registered
Division not found in selected zone
Selected division has no dynamic table registered
Ward not found in selected division
Selected ward has an invalid ward number
```

Telemetry table-not-found errors:

``` text
42P01
```

are intentionally handled as missing telemetry tables.

Other database errors are either:

``` text
propagated
```

or, during live telemetry lookup:

``` text
logged and skipped
```

------------------------------------------------------------------------

# 78. Important Vehicle Mapping Rule

The implementation explicitly treats:

``` text
vehicle_master.ward_no
```

as the authoritative vehicle-to-ward mapping.

It does not require matching:

``` text
city
zone
division
ward
```

text fields.

This avoids mismatches between textual vehicle-master fields and the
Master Citizen geographic hierarchy.

------------------------------------------------------------------------

# 79. Important Ward Mapping Rule

The incoming:

``` text
wardId
```

is compatible with both:

``` text
ward_id
ward_no
```

The service prioritizes:

``` text
ward_id
```

when both could match.

It also separately exposes:

``` text
masterWardId
```

and:

``` text
wardNo
```

in the resolved ward object.

------------------------------------------------------------------------

# 80. Important Telemetry Timestamp Rule

The service explicitly uses:

``` text
iottimestamp
```

for determining the latest telemetry.

It does not use:

``` text
receivedTimestamp
```

This is important for:

``` text
latest-point selection
ACTIVE / INACTIVE determination
lastUpdated
```

------------------------------------------------------------------------

# 81. Important 30-Minute Activity Rule

The vehicle is considered:

``` text
ACTIVE
```

when its latest telemetry timestamp is not older than:

``` text
30 minutes
```

If it is older:

``` text
INACTIVE
```

A vehicle with no valid telemetry is also:

``` text
INACTIVE
```

------------------------------------------------------------------------

# 82. Exported Functions

The service exports:

``` text
getLiveRouteMap
```

The following functions remain internal:

``` text
quoteIdentifier
parsePositiveInteger
parseCoordinate
getDayTableName
getSelectedWard
getVehicleTablesForWard
addYesterdayTelemetryMappings
calculateDistanceKm
getLatestVehiclePositions
```

------------------------------------------------------------------------

# 83. Architecture

``` text
Flutter Frontend
        ↓
getLiveRouteMap()
        │
        ├── Input Parsers
        │
        ├── masterCitizenPrisma
        │       ↓
        │   City → Zone → Division → Ward
        │
        ├── mainDb
        │       ↓
        │   vehicle_master
        │
        └── telemetryDb
                ↓
        Daily Telemetry Tables
                ↓
          Latest GPS Position
                ↓
          ACTIVE / INACTIVE
                ↓
        Haversine Distance
                ↓
        Nearest-First Sorting
                ↓
          Flutter Response
```

------------------------------------------------------------------------

# 84. Summary

`routeMapService.js` is the live route-map business-logic layer that
combines Master Citizen geographic data, registered vehicle information,
and telemetry GPS data.

Its main responsibility is to determine:

``` text
Which vehicles belong to the selected ward?
Where are those vehicles?
Are they currently active?
How far are they from the user?
```

The complete process is:

``` text
User Coordinates
        +
City / Zone / Division / Ward
        ↓
Validate Coordinates and IDs
        ↓
Resolve Master Citizen Ward
        ↓
Use ward_no to find vehicles
        ↓
Resolve today's telemetry tables
        ↓
Resolve yesterday's fallback tables
        ↓
Find latest GPS using iottimestamp
        ↓
Determine ACTIVE / INACTIVE
        ↓
Calculate Haversine distance
        ↓
Sort nearest first
        ↓
Return Flutter response
```

The service deliberately keeps all registered vehicles in the response
even when telemetry is unavailable.

The resulting behavior is:

``` text
GPS available + recent
        ↓
ACTIVE

GPS available + older than 30 min
        ↓
INACTIVE

No GPS
        ↓
INACTIVE
latitude = null
longitude = null
distance = null
```

The geographic hierarchy is resolved through:

``` text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

while vehicle mapping is based on:

``` text
vehicle_master.ward_no
```

and live telemetry is resolved through:

``` text
day_DDMMYYYY
        ↓
vehicle_table_name
        ↓
iottimestamp
        ↓
latitude / longitude
```

The final output is optimized for the Flutter frontend:

``` text
personLocation
filters
vehicles
```

with vehicles ordered from:

``` text
nearest → farthest
```

based on Haversine distance in kilometers.
