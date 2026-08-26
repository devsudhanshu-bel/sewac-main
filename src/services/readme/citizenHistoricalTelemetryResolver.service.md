# citizenHistoricalTelemetryResolver.service.js Documentation

## 1. File Overview

**File:** `citizenHistoricalTelemetryResolver.service.js`\
**Location:**
`src/services/citizenHistoricalTelemetryResolver.service.js`

This service reads individual telemetry records from the existing
telemetry database and resolves their GPS location through the citizen
historical geographic hierarchy.

The resolution flow is:

``` text
Telemetry
    ↓
GPS
    ↓
City
    ↓
Zone
    ↓
Division
    ↓
Ward
```

It handles:

``` text
Telemetry record validation
GPS extraction
GPS validation
GPS boundary resolution
Telemetry/location result construction
First telemetry record retrieval
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
telemetryDailyRepository
citizenHistoricalGpsResolver.service
```

The responsibilities are:

``` text
telemetryDailyRepository
    ↓
Read vehicle telemetry records

citizenHistoricalGpsResolver
    ↓
Resolve GPS coordinates
    ↓
City → Zone → Division → Ward
```

------------------------------------------------------------------------

# 3. Service Responsibility

This service is explicitly **read-only**.

It does not:

``` text
Modify telemetry
Modify vehicle tables
Modify day tables
Insert historical data
```

Its purpose is to read telemetry and attach the geographic location
resolved from its GPS coordinates.

------------------------------------------------------------------------

# 4. CitizenHistoricalTelemetryResolver Class

The service is implemented using:

``` js
class CitizenHistoricalTelemetryResolver
```

The class exposes two processing methods:

``` text
resolveTelemetryRecord()
resolveFirstTelemetryRecord()
```

A single instance of the class is exported.

------------------------------------------------------------------------

# 5. resolveTelemetryRecord()

This is the primary telemetry-resolution method.

It receives:

``` text
record
```

and resolves the record's GPS coordinates against the citizen historical
boundary hierarchy.

The main flow is:

``` text
Telemetry Record
      ↓
Validate Record
      ↓
Extract Latitude / Longitude
      ↓
Validate GPS
      ↓
GPS Resolver
      ↓
City
      ↓
Zone
      ↓
Division
      ↓
Ward
      ↓
Return Telemetry + Location
```

------------------------------------------------------------------------

# 6. resolveTelemetryRecord() --- Record Validation

The method requires a telemetry record.

If:

``` text
record
```

is missing or falsy, it throws:

``` text
Telemetry record is required
```

No GPS resolution is attempted.

------------------------------------------------------------------------

# 7. resolveTelemetryRecord() --- GPS Extraction

Latitude is extracted from:

``` text
record.latitude
```

Longitude is extracted from:

``` text
record.longitude
```

When a value exists, it is converted using:

``` js
Number()
```

When the source value is:

``` text
null
undefined
```

the corresponding value becomes:

``` text
null
```

------------------------------------------------------------------------

# 8. GPS Availability Validation

The service first checks whether either coordinate is:

``` text
null
```

If latitude or longitude is unavailable, the method returns:

``` json
{
  "matched": false,
  "reason": "GPS_NOT_AVAILABLE",
  "telemetry": {
    "id": "...",
    "vehicleNumber": "...",
    "rfidEpc": "...",
    "citizenId": "..."
  }
}
```

The telemetry section contains only the identifying fields needed for
this failure response.

------------------------------------------------------------------------

# 9. GPS Numeric Validation

After confirming that both coordinates exist, the service checks:

``` js
Number.isNaN(latitude)
Number.isNaN(longitude)
```

If either coordinate is not a valid number, the method returns:

``` json
{
  "matched": false,
  "reason": "INVALID_GPS",
  "telemetry": {
    "id": "...",
    "vehicleNumber": "...",
    "rfidEpc": "...",
    "citizenId": "..."
  }
}
```

------------------------------------------------------------------------

# 10. GPS Resolution

When the coordinates are valid, the service calls:

``` js
citizenHistoricalGpsResolver.resolve(
  latitude,
  longitude
)
```

The GPS resolver is responsible for determining the geographic
hierarchy.

The returned result is stored as:

``` text
boundaryResult
```

------------------------------------------------------------------------

# 11. Geographic Resolution

The downstream GPS resolver attempts to determine:

``` text
City
Zone
Division
Ward
```

The telemetry resolver does not perform the boundary calculations
itself.

Instead, it delegates the location resolution to:

``` text
citizenHistoricalGpsResolver
```

------------------------------------------------------------------------

# 12. Complete Telemetry Result

After GPS resolution, the service returns a structured result
containing:

``` text
matched
reason
telemetry
location
```

The `matched` field comes directly from:

``` text
boundaryResult.matched
```

The `reason` field is:

``` text
boundaryResult.reason
```

or:

``` text
null
```

when no reason is supplied.

------------------------------------------------------------------------

# 13. Telemetry Result Fields

For a normal GPS-resolution result, the telemetry object contains:

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
vehicleNumber
driverName
collectionType
```

The values are read directly from the source telemetry record, except:

``` text
latitude
longitude
```

which use the normalized numeric values created during GPS extraction.

------------------------------------------------------------------------

# 14. Location Result

When:

``` text
boundaryResult.matched === true
```

the service constructs:

``` text
location
```

containing:

``` text
city
zone
division
ward
```

Each hierarchy object comes directly from the boundary resolver:

``` text
boundaryResult.city
boundaryResult.zone
boundaryResult.division
boundaryResult.ward
```

------------------------------------------------------------------------

# 15. Unmatched Location

When the boundary resolver does not match the GPS coordinate:

``` text
boundaryResult.matched === false
```

the telemetry resolver returns:

``` text
location: null
```

The `matched` and `reason` values are preserved from the boundary
resolver.

This allows callers to distinguish GPS/data failures from successful
geographic resolution.

------------------------------------------------------------------------

# 16. resolveTelemetryRecord() Result Flow

The result flow is:

``` text
Telemetry Record
      ↓
GPS Available?
   ↙          ↘
 NO            YES
 ↓              ↓
GPS_NOT_      Convert GPS
AVAILABLE        ↓
             Valid Number?
             ↙          ↘
           NO            YES
           ↓              ↓
       INVALID_GPS    GPS Resolver
                          ↓
                    Boundary Result
                          ↓
                 Telemetry + Location
```

------------------------------------------------------------------------

# 17. resolveFirstTelemetryRecord()

This method reads the first telemetry record from a specified vehicle
table and resolves it.

It receives:

``` text
vehicleTableName
```

The method calls:

``` js
telemetryDailyRepository.getVehicleTelemetry(
  vehicleTableName,
  0,
  1
)
```

The parameters are:

``` text
offset = 0
limit = 1
```

Therefore only one telemetry record is requested.

------------------------------------------------------------------------

# 18. No Telemetry Records

If the vehicle table contains no returned telemetry records, the method
returns:

``` json
{
  "matched": false,
  "reason": "NO_TELEMETRY_RECORDS",
  "telemetry": null,
  "location": null
}
```

No GPS resolution is attempted.

------------------------------------------------------------------------

# 19. First Telemetry Resolution

When a record exists, the service selects:

``` js
records[0]
```

and delegates it to:

``` js
resolveTelemetryRecord(records[0])
```

Therefore the first-record method reuses the complete
telemetry-resolution logic instead of duplicating it.

------------------------------------------------------------------------

# 20. resolveFirstTelemetryRecord() Flow

The method follows:

``` text
Vehicle Table Name
        ↓
getVehicleTelemetry()
        ↓
Offset 0 / Limit 1
        ↓
Records Found?
     ↙        ↘
   NO          YES
   ↓            ↓
Return       records[0]
Failure          ↓
          resolveTelemetryRecord()
                 ↓
          GPS Resolution
                 ↓
          Telemetry + Location
```

------------------------------------------------------------------------

# 21. Read-Only Architecture

The service's role in the historical pipeline is:

``` text
Existing Telemetry Database
          ↓
telemetryDailyRepository
          ↓
Telemetry Record
          ↓
citizenHistoricalTelemetryResolver
          ↓
citizenHistoricalGpsResolver
          ↓
City → Zone → Division → Ward
```

No write operation is performed by this service.

------------------------------------------------------------------------

# 22. Relationship With GPS Resolver

The service delegates geographic resolution to:

``` text
citizenHistoricalGpsResolver.service
```

The responsibilities are separated as follows:

``` text
Telemetry Resolver
    ↓
Read telemetry
    ↓
Extract GPS
    ↓
Validate GPS
    ↓
Pass GPS to GPS Resolver

GPS Resolver
    ↓
Load/use boundary cache
    ↓
Resolve GPS
    ↓
City → Zone → Division → Ward
```

This keeps telemetry parsing separate from geographic boundary
processing.

------------------------------------------------------------------------

# 23. Relationship With Daily Telemetry Repository

The service uses:

``` text
telemetryDailyRepository.getVehicleTelemetry()
```

only for reading telemetry.

For first-record resolution, it requests:

``` text
offset = 0
limit = 1
```

The service does not directly access the database.

------------------------------------------------------------------------

# 24. Error / Result Handling

The service uses both exceptions and structured result objects.

## Exceptions

A missing telemetry record object causes:

``` text
Telemetry record is required
```

to be thrown.

------------------------------------------------------------------------

## Structured Results

Expected data-resolution failures return:

``` text
matched: false
```

with reasons including:

``` text
GPS_NOT_AVAILABLE
INVALID_GPS
NO_TELEMETRY_RECORDS
```

Geographic boundary-resolution reasons from the GPS resolver are also
preserved through:

``` text
boundaryResult.reason
```

------------------------------------------------------------------------

# 25. Export

The module exports a single instance:

``` js
module.exports =
  new CitizenHistoricalTelemetryResolver();
```

Consumers therefore share the same resolver instance.

------------------------------------------------------------------------

# 26. Available Methods

The exported resolver provides:

``` text
resolveTelemetryRecord()
resolveFirstTelemetryRecord()
```

------------------------------------------------------------------------

# 27. Summary

`citizenHistoricalTelemetryResolver.service.js` is the read-only
telemetry-to-location resolution layer for the citizen historical
pipeline.

It reads one telemetry record, extracts and validates its GPS
coordinates, delegates geographic resolution to
`citizenHistoricalGpsResolver`, and returns the telemetry information
together with the resolved:

``` text
City
Zone
Division
Ward
```

It also provides `resolveFirstTelemetryRecord()` for retrieving and
resolving the first telemetry record from a vehicle table.

The service does not modify telemetry, vehicle tables, day tables, or
historical data. Its sole responsibility is to combine telemetry
information with GPS-based geographic resolution.
