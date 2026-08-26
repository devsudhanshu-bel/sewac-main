# citizenHistoricalProcessor.service.js Documentation

## 1. File Overview

**File:** `citizenHistoricalProcessor.service.js`\
**Location:** `src/services/citizenHistoricalProcessor.service.js`

This service processes citizen historical telemetry records and stores
the resolved historical data in the appropriate monthly telemetry table
while maintaining the yearly month index.

It handles:

``` text
Telemetry processing
GPS hierarchy resolution
Ward validation
Historical table selection
Historical record preparation
Monthly historical insertion
Duplicate handling
Yearly month-index updates
Monthly index creation
First-vehicle / first-record processing
```

The implemented flow is:

``` text
DAY TABLE
    ↓
VEHICLE TABLE
    ↓
TELEMETRY
    ↓
GPS RESOLVER
    ↓
CITY
    ↓
ZONE
    ↓
DIVISION
    ↓
WARD
    ↓
MONTHLY TELEMETRY TABLE
    ↓
YEARLY MONTH INDEX
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
citizenHistoricalRepository
telemetryDailyRepository
citizenHistoricalTelemetryResolver.service
```

The responsibilities are:

``` text
citizenHistoricalRepository
    ↓
Historical table names
Historical table existence
Historical record insertion
Yearly month-index updates
Monthly indexes

telemetryDailyRepository
    ↓
Daily table names
Daily table existence
Vehicles from day tables
Vehicle telemetry

citizenHistoricalTelemetryResolver
    ↓
GPS / telemetry hierarchy resolution
```

------------------------------------------------------------------------

# 3. Data Storage Model

The service follows two different historical storage roles.

## Monthly Table

The monthly table contains:

``` text
ACTUAL HISTORICAL TELEMETRY DATA
```

Historical telemetry records are inserted into this table.

------------------------------------------------------------------------

## Yearly Table

The yearly table is:

``` text
INDEX ONLY
```

The service does not insert telemetry records into the yearly table.

Instead, it updates the yearly month index using:

``` text
monthlyTable
recordDate
```

The architecture is:

``` text
Monthly Table
    =
Actual Historical Data

Yearly Table
    =
Monthly Index
```

------------------------------------------------------------------------

# 4. CitizenHistoricalProcessor

The service is implemented using:

``` js
class CitizenHistoricalProcessor
```

The class exposes two processing methods:

``` text
processRecord()
processFirstRecord()
```

A single instance of the processor is exported.

------------------------------------------------------------------------

# 5. processRecord()

This is the main historical telemetry-processing method.

It receives:

``` text
record
```

and processes one telemetry record through the complete historical
pipeline.

The major steps are:

``` text
Telemetry Record
    ↓
GPS Resolution
    ↓
Location Validation
    ↓
Ward Validation
    ↓
Telemetry Date
    ↓
Yearly Table
    ↓
Monthly Table
    ↓
Table Validation
    ↓
Historical Record Preparation
    ↓
Monthly Insert
    ↓
Yearly Index Update
    ↓
Monthly Indexes
    ↓
Success
```

------------------------------------------------------------------------

# 6. processRecord() --- Step 1: GPS Resolution

The first processing step resolves the telemetry record geographically.

The service calls:

``` js
telemetryResolver.resolveTelemetryRecord(record)
```

The resolver is expected to determine:

``` text
City
Zone
Division
Ward
```

------------------------------------------------------------------------

## GPS Resolution Failure

If:

``` text
resolved.matched
```

is false, processing stops.

The service logs:

``` text
GPS resolution failed
```

and returns:

``` json
{
  "processed": false,
  "reason": "...",
  "telemetryId": "..."
}
```

The reason is taken from:

``` text
resolved.reason
```

No historical database operation is performed after this failure.

------------------------------------------------------------------------

# 7. processRecord() --- Step 2: Get Location

After successful GPS resolution, the service obtains:

``` js
resolved.location
```

If the location object does not exist, processing stops.

The response is:

``` json
{
  "processed": false,
  "reason": "LOCATION_NOT_FOUND",
  "telemetryId": "..."
}
```

------------------------------------------------------------------------

## Location Hierarchy

The service extracts:

``` text
location.city
location.zone
location.division
location.ward
```

These values are subsequently used when constructing the historical
record and success response.

------------------------------------------------------------------------

# 8. processRecord() --- Step 3: Validate Ward

A ward is mandatory for historical storage.

The service requires:

``` text
ward
ward.wardNo
```

If the ward is missing, or `wardNo` is either:

``` text
undefined
null
```

processing stops.

The response is:

``` json
{
  "processed": false,
  "reason": "WARD_NOT_FOUND",
  "telemetryId": "...",
  "city": {},
  "zone": {},
  "division": {}
}
```

The already-resolved city, zone, and division are preserved in the
response.

------------------------------------------------------------------------

# 9. processRecord() --- Step 4: Telemetry Date

The historical processing date is determined from:

``` text
record.iotTimestamp
```

when it exists.

Otherwise the service uses:

``` text
new Date()
```

The implemented logic is:

``` text
iotTimestamp exists
    ↓
Use record.iotTimestamp

iotTimestamp missing
    ↓
Use current date/time
```

------------------------------------------------------------------------

## Invalid Telemetry Timestamp

The resulting date is validated using:

``` js
Number.isNaN(recordDate.getTime())
```

If invalid, the service throws:

``` text
Invalid telemetry timestamp: <timestamp>
```

This is an exception rather than a normal `processed: false` response.

------------------------------------------------------------------------

# 10. processRecord() --- Step 5: Yearly Table

The service obtains the yearly historical table name using:

``` js
citizenHistoricalRepository.getYearlyTableName(
  ward.wardNo,
  recordDate
)
```

The table name therefore depends on:

``` text
Ward Number
Telemetry Date
```

The resulting value is stored as:

``` text
yearlyTable
```

------------------------------------------------------------------------

# 11. processRecord() --- Step 6: Monthly Table

The service obtains the monthly historical telemetry table using:

``` js
citizenHistoricalRepository.getMonthlyTableName(
  ward.wardNo,
  recordDate
)
```

The monthly table therefore also depends on:

``` text
Ward Number
Telemetry Date
```

The resulting value is stored as:

``` text
monthlyTable
```

------------------------------------------------------------------------

# 12. processRecord() --- Step 7: Check Yearly Table

Before updating the yearly index, the service verifies that the yearly
table exists.

It calls:

``` js
citizenHistoricalRepository.tableExists(yearlyTable)
```

If the table does not exist, the service throws:

``` text
Historical yearly table does not exist: <yearlyTable>
```

Processing stops at this point.

------------------------------------------------------------------------

# 13. processRecord() --- Step 8: Check Monthly Table

The service then verifies the monthly telemetry table.

It calls:

``` js
citizenHistoricalRepository.tableExists(monthlyTable)
```

If the table does not exist, the service throws:

``` text
Historical monthly table does not exist: <monthlyTable>
```

Processing stops.

------------------------------------------------------------------------

# 14. processRecord() --- Step 9: Prepare Historical Record

The service constructs a new:

``` text
historicalRecord
```

containing telemetry, vehicle, GPS, geographic hierarchy, citizen,
waste, and additional information.

------------------------------------------------------------------------

## Telemetry Fields

The record contains:

``` text
telemetryId
iotTimestamp
receivedTimestamp
```

Values are copied from the source telemetry record.

------------------------------------------------------------------------

## Vehicle Fields

The record contains:

``` text
vehicleNumber
driverName
unitNumber
firmwareVersion
```

------------------------------------------------------------------------

## GPS Fields

The record contains:

``` text
latitude
longitude
```

------------------------------------------------------------------------

## Geographic Hierarchy Fields

The record contains:

``` text
cityId
zoneId
divisionId
wardId
wardNo
```

The service uses optional chaining and null defaults:

``` text
cityId → null when unavailable
zoneId → null when unavailable
divisionId → null when unavailable
wardId → null when unavailable
wardNo → null when unavailable
```

------------------------------------------------------------------------

## Citizen Fields

The record contains:

``` text
citizenId
rfidEpc
citizenContact
```

------------------------------------------------------------------------

## Waste Fields

The record contains:

``` text
wasteType
collectionType
wetWeight
dryWeight
otherWeight
cumulativeWeight
```

------------------------------------------------------------------------

## Other Fields

The record also contains:

``` text
remarks
errorCode
driverAction
```

------------------------------------------------------------------------

# 15. Historical Record Structure

The resulting historical record is organized into:

``` text
TELEMETRY
VEHICLE
GPS
HIERARCHY
CITIZEN
WASTE
OTHER
```

This record is then passed to the historical repository for insertion.

------------------------------------------------------------------------

# 16. processRecord() --- Step 10: Monthly Historical Insert

The historical record is inserted into the monthly telemetry table
using:

``` js
citizenHistoricalRepository.insertHistoricalRecord(
  monthlyTable,
  historicalRecord
)
```

The result is stored as:

``` text
monthlyResult
```

The monthly table is therefore the actual storage location for
historical telemetry.

------------------------------------------------------------------------

# 17. Duplicate Handling

The repository result may indicate:

``` text
inserted
duplicate
```

------------------------------------------------------------------------

## Successful Insert

When:

``` text
monthlyResult.inserted
```

is true, the service logs:

``` text
Monthly historical record inserted.
```

------------------------------------------------------------------------

## Duplicate Record

When:

``` text
monthlyResult.duplicate
```

is true, the service logs:

``` text
Monthly historical record already exists.
```

It also logs the telemetry ID being skipped.

The processor does not treat the duplicate as a failed processing
operation.

------------------------------------------------------------------------

# 18. processRecord() --- Step 11: Update Yearly Month Index

After the monthly operation, the service updates the yearly month index.

It calls:

``` js
citizenHistoricalRepository.updateYearlyMonthIndex(
  yearlyTable,
  monthlyTable,
  recordDate
)
```

The result is stored as:

``` text
yearlyIndex
```

------------------------------------------------------------------------

## Important Yearly Table Rule

The service explicitly does **not** insert telemetry into the yearly
table.

The yearly table is used only as a monthly index.

The relationship is:

``` text
Yearly Table
    ↓
Points to / indexes
    ↓
Monthly Historical Table
```

------------------------------------------------------------------------

# 19. processRecord() --- Step 12: Ensure Monthly Indexes

After updating the yearly index, the service calls:

``` js
citizenHistoricalRepository.ensureMonthlyIndexes(
  monthlyTable
)
```

This ensures the required indexes exist for the monthly historical
table.

------------------------------------------------------------------------

# 20. processRecord() --- Step 13: Success Response

When processing completes, the service returns:

``` json
{
  "processed": true,
  "duplicate": false,
  "telemetryId": "...",
  "city": {},
  "zone": {},
  "division": {},
  "ward": {},
  "yearlyTable": "...",
  "monthlyTable": "...",
  "monthlyRecord": {},
  "yearlyIndex": {}
}
```

The actual values are taken from the resolved location and repository
results.

The `duplicate` field is populated from:

``` text
monthlyResult.duplicate
```

------------------------------------------------------------------------

# 21. processRecord() Complete Flow

The complete processing sequence is:

``` text
Telemetry Record
       ↓
resolveTelemetryRecord()
       ↓
GPS Matched?
   ↙          ↘
 NO            YES
 ↓              ↓
Return       Get Location
Failure          ↓
              Ward Valid?
             ↙          ↘
           NO            YES
           ↓              ↓
        Return        Get Date
        Failure           ↓
                    Get Yearly Table
                           ↓
                   Get Monthly Table
                           ↓
                   Check Yearly Table
                           ↓
                  Check Monthly Table
                           ↓
                 Prepare Historical Record
                           ↓
                Insert Monthly Record
                           ↓
                 Handle Duplicate
                           ↓
                Update Yearly Index
                           ↓
                Ensure Monthly Indexes
                           ↓
                       Success
```

------------------------------------------------------------------------

# 22. processFirstRecord()

This method processes the first telemetry record of the first vehicle
for a specified date.

It receives:

``` text
date
```

Its purpose is to locate the first available telemetry record through
the daily telemetry structure and pass that record into:

``` js
processRecord()
```

------------------------------------------------------------------------

# 23. processFirstRecord() --- Step 1: Day Table

The service obtains the day table name using:

``` js
telemetryDailyRepository.getDayTableName(date)
```

The resulting value is stored as:

``` text
dayTable
```

------------------------------------------------------------------------

# 24. processFirstRecord() --- Step 2: Check Day Table

The service checks whether the day table exists:

``` js
telemetryDailyRepository.dayTableExists(dayTable)
```

If it does not exist, the method returns:

``` json
{
  "processed": false,
  "reason": "DAY_TABLE_NOT_FOUND",
  "dayTable": "..."
}
```

------------------------------------------------------------------------

# 25. processFirstRecord() --- Step 3: Get Vehicles

When the day table exists, the service retrieves vehicles using:

``` js
telemetryDailyRepository.getVehiclesFromDayTable(
  dayTable
)
```

If no vehicles are found, the method returns:

``` json
{
  "processed": false,
  "reason": "NO_VEHICLES",
  "dayTable": "..."
}
```

------------------------------------------------------------------------

# 26. processFirstRecord() --- Step 4: Select First Vehicle

The service selects:

``` js
vehicles[0]
```

as the first vehicle.

It determines the vehicle table name using either:

``` text
vehicle.vehicleTableName
```

or:

``` text
vehicle.vehicle_table_name
```

This provides compatibility with both naming forms.

------------------------------------------------------------------------

## Missing Vehicle Table

If no vehicle table name is available, the method returns:

``` json
{
  "processed": false,
  "reason": "VEHICLE_TABLE_NOT_FOUND",
  "dayTable": "...",
  "vehicle": {}
}
```

------------------------------------------------------------------------

# 27. processFirstRecord() --- Step 5: Get First Telemetry

The service retrieves telemetry from the selected vehicle table using:

``` js
telemetryDailyRepository.getVehicleTelemetry(
  vehicleTableName,
  0,
  1
)
```

The parameters indicate that the service requests:

``` text
offset = 0
limit = 1
```

Therefore only the first telemetry record is requested.

------------------------------------------------------------------------

## No Telemetry

If no telemetry records are returned, the method returns:

``` json
{
  "processed": false,
  "reason": "NO_TELEMETRY_RECORDS",
  "dayTable": "...",
  "vehicle": {}
}
```

------------------------------------------------------------------------

# 28. processFirstRecord() --- Step 6: Process Telemetry

When a telemetry record is available, the service selects:

``` js
records[0]
```

and passes it to:

``` js
this.processRecord(records[0])
```

Therefore `processFirstRecord()` does not duplicate the historical
processing logic.

It acts as a discovery/selection flow that eventually delegates to
`processRecord()`.

------------------------------------------------------------------------

# 29. processFirstRecord() Complete Flow

The method follows:

``` text
Date
 ↓
Get Day Table
 ↓
Day Table Exists?
 ↓
Get Vehicles
 ↓
Vehicles Available?
 ↓
Select First Vehicle
 ↓
Get Vehicle Table Name
 ↓
Get First Telemetry Record
 ↓
Telemetry Available?
 ↓
processRecord()
 ↓
Historical Processing
```

------------------------------------------------------------------------

# 30. Error Handling

The service uses two types of failure handling.

## Structured Failure Results

Expected processing failures return:

``` text
processed: false
```

with reasons such as:

``` text
GPS resolution failure
LOCATION_NOT_FOUND
WARD_NOT_FOUND
DAY_TABLE_NOT_FOUND
NO_VEHICLES
VEHICLE_TABLE_NOT_FOUND
NO_TELEMETRY_RECORDS
```

------------------------------------------------------------------------

## Thrown Errors

The service throws errors for invalid or missing infrastructure/data
conditions such as:

``` text
Invalid telemetry timestamp
Historical yearly table does not exist
Historical monthly table does not exist
```

These errors are not converted into `processed: false` responses inside
the processor.

------------------------------------------------------------------------

# 31. Repository Interaction

The service interacts with the historical repository for:

``` text
getYearlyTableName()
getMonthlyTableName()
tableExists()
insertHistoricalRecord()
updateYearlyMonthIndex()
ensureMonthlyIndexes()
```

It interacts with the daily telemetry repository for:

``` text
getDayTableName()
dayTableExists()
getVehiclesFromDayTable()
getVehicleTelemetry()
```

It interacts with the telemetry resolver for:

``` text
resolveTelemetryRecord()
```

------------------------------------------------------------------------

# 32. Architecture

``` text
Daily Telemetry Repository
        ↓
     Day Table
        ↓
   Vehicle Table
        ↓
    Telemetry
        ↓
Telemetry Resolver
        ↓
      City
        ↓
      Zone
        ↓
    Division
        ↓
      Ward
        ↓
Historical Repository
        ↓
Monthly Historical Table
        ↓
Yearly Month Index
```

------------------------------------------------------------------------

# 33. Export

The module exports a single instance:

``` js
module.exports =
  new CitizenHistoricalProcessor();
```

Consumers therefore use the same processor instance.

------------------------------------------------------------------------

# 34. Available Methods

The exported processor provides:

``` text
processRecord()
processFirstRecord()
```

------------------------------------------------------------------------

# 35. Summary

`citizenHistoricalProcessor.service.js` is the main processing layer for
moving telemetry into the citizen historical data structure.

For an individual telemetry record, it resolves the GPS hierarchy,
validates the ward, determines the appropriate yearly and monthly
historical tables, prepares the complete historical record, inserts it
into the monthly table, updates the yearly month index, and ensures the
monthly indexes.

The service treats:

``` text
MONTHLY TABLE = ACTUAL HISTORICAL TELEMETRY
YEARLY TABLE = MONTH INDEX ONLY
```

It also provides `processFirstRecord()`, which locates the first vehicle
and first telemetry record for a day and delegates that record to the
main `processRecord()` pipeline.
