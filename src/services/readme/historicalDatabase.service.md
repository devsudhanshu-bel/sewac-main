# historicalDatabase.service.js Documentation

## 1. File Overview

**File:** `historicalDatabase.service.js`\
**Location:** `src/services/historicalDatabase.service.js`

This service manages the archival of telemetry records for one
processing date from the master telemetry database into the citizen
historical database.

It handles:

``` text
Processing-date validation
Day-table resolution
Vehicle discovery
Ward validation
Yearly historical table creation
Monthly historical table creation
Monthly table registration
Vehicle telemetry pagination
Historical record insertion
Duplicate tracking
Daily archive summary
```

The main flow is:

``` text
Processing Date
      ↓
Day Table
      ↓
Vehicles
      ↓
Ward Number
      ↓
Yearly Index Table
      ↓
Monthly Historical Table
      ↓
Vehicle Telemetry
      ↓
Historical Record Insert
      ↓
Archive Summary
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
telemetryDailyRepository
historicalRepository
```

The telemetry repository is imported from:

``` text
../repositories/telemetryDaily.repository
```

The historical repository is imported from:

``` text
../repositories/citizenHistoricalTable.repository
```

------------------------------------------------------------------------

# 3. HistoricalArchiveService

The service is implemented using:

``` js
class HistoricalArchiveService
```

The class exposes:

``` text
archiveDate()
```

A single instance of the service is exported.

------------------------------------------------------------------------

# 4. archiveDate()

This is the main historical archival method.

It receives:

``` text
processingDate
```

The processing date can be either:

``` text
JavaScript Date
```

or:

``` text
a value accepted by new Date()
```

The method archives telemetry for the specified date.

------------------------------------------------------------------------

# 5. archiveDate() --- Processing Date

The service determines the date using:

``` js
processingDate instanceof Date
  ? processingDate
  : new Date(processingDate)
```

Therefore:

``` text
Date object
    ↓
Use directly

Other date value
    ↓
Convert using new Date()
```

------------------------------------------------------------------------

# 6. Invalid Processing Date

The service validates the resulting date using:

``` js
Number.isNaN(date.getTime())
```

If invalid, it throws:

``` text
Invalid processing date
```

No archival operations are performed after this validation failure.

------------------------------------------------------------------------

# 7. Date Values

After validating the date, the service extracts:

``` text
year
month
monthName
```

The year is obtained using:

``` js
date.getFullYear()
```

The month is obtained using:

``` js
date.getMonth() + 1
```

The month name is retrieved from:

``` text
historicalRepository.MONTH_NAMES
```

using:

``` text
month - 1
```

------------------------------------------------------------------------

# 8. Day Table Name

The source daily telemetry table is determined using:

``` js
telemetryDailyRepository.getDayTableName(date)
```

The resulting table name is stored as:

``` text
dayTableName
```

This table belongs to:

``` text
master_telemetry_db
```

------------------------------------------------------------------------

# 9. Get Day Table Vehicles

The service retrieves all vehicles associated with the processing date
using:

``` js
telemetryDailyRepository.getVehiclesFromDayTable(date)
```

The returned vehicle objects provide information used by the archive
process, including:

``` text
vehicle_number
vehicle_table_name
ward_no
```

------------------------------------------------------------------------

# 10. No Vehicles

If:

``` text
vehicles.length === 0
```

the service returns a successful empty archive result.

The response contains:

``` json
{
  "success": true,
  "sourceDatabase": "master_telemetry_db",
  "sourceDayTable": "...",
  "year": 2026,
  "month": 8,
  "monthName": "...",
  "archivedVehicles": 0,
  "archivedRecords": 0,
  "duplicateRecords": 0,
  "vehicles": []
}
```

No historical tables are created when there are no vehicles.

------------------------------------------------------------------------

# 11. Archive Counters

When vehicles are available, the service initializes:

``` text
archivedVehicles = 0
archivedRecords = 0
duplicateRecords = 0
```

It also creates:

``` text
vehicleResults = []
```

This array stores the individual result for every vehicle encountered.

------------------------------------------------------------------------

# 12. Vehicle Processing

The service processes every vehicle using:

``` js
for (const vehicle of vehicles)
```

For each vehicle it extracts:

``` text
vehicleNumber
vehicleTableName
wardNo
```

The ward number is normalized using:

``` js
Number(vehicle.ward_no)
```

------------------------------------------------------------------------

# 13. Missing Vehicle Table Name

If:

``` text
vehicleTableName
```

is missing, the vehicle is not archived.

The service adds:

``` json
{
  "vehicleNumber": "...",
  "vehicleTableName": null,
  "wardNo": 0,
  "archived": false,
  "reason": "VEHICLE_TABLE_NAME_MISSING"
}
```

to:

``` text
vehicleResults
```

The service then continues with the next vehicle.

------------------------------------------------------------------------

# 14. Ward Number Validation

The service requires the normalized ward number to satisfy:

``` text
Number.isInteger(wardNo)
wardNo > 0
```

If this validation fails, the vehicle is not archived.

The result contains:

``` json
{
  "vehicleNumber": "...",
  "vehicleTableName": "...",
  "wardNo": 0,
  "archived": false,
  "reason": "WARD_NO_MISSING_OR_INVALID"
}
```

The service then continues to the next vehicle.

------------------------------------------------------------------------

# 15. Historical Table Names

For a valid vehicle, the service generates two historical table names.

## Yearly Table

``` js
historicalRepository.generateYearlyIndexTableName(
  wardNo,
  year
)
```

The resulting value is:

``` text
yearlyTableName
```

------------------------------------------------------------------------

## Monthly Table

``` js
historicalRepository.generateMonthlyTableName(
  wardNo,
  month,
  year
)
```

The resulting value is:

``` text
monthlyTableName
```

------------------------------------------------------------------------

# 16. Historical Table Architecture

The service uses:

``` text
Ward + Year
    ↓
Yearly Historical Index Table
```

and:

``` text
Ward + Month + Year
    ↓
Monthly Historical Table
```

The monthly table stores the actual historical telemetry records.

The yearly table is used as the yearly index structure.

------------------------------------------------------------------------

# 17. Ensure Yearly Table

The service checks whether the yearly table exists:

``` js
historicalRepository.tableExists(
  yearlyTableName
)
```

If it does not exist, it creates the table using:

``` js
historicalRepository.createYearlyIndexTable(
  yearlyTableName
)
```

------------------------------------------------------------------------

# 18. Ensure Monthly Table

The service checks whether the monthly historical table exists:

``` js
historicalRepository.tableExists(
  monthlyTableName
)
```

If it does not exist, it creates the table using:

``` js
historicalRepository.createMonthlyHistoryTable(
  monthlyTableName
)
```

------------------------------------------------------------------------

# 19. Register Monthly Table

After ensuring the historical tables exist, the service registers the
monthly table in the yearly index.

It calls:

``` js
historicalRepository.registerMonthlyTable(
  yearlyTableName,
  month,
  monthName,
  monthlyTableName
)
```

The registration therefore associates:

``` text
Yearly Table
    ↓
Month
    ↓
Month Name
    ↓
Monthly Table Name
```

------------------------------------------------------------------------

# 20. Vehicle Telemetry Processing

The service reads telemetry records from the vehicle table using
pagination based on the source telemetry ID.

It initializes:

``` text
lastId = 0
sourceRecords = 0
inserted = 0
duplicates = 0
```

------------------------------------------------------------------------

# 21. Batch Retrieval

Telemetry is retrieved using:

``` js
telemetryDailyRepository.getVehicleTelemetryAfterId(
  vehicleTableName,
  lastId,
  500
)
```

The batch size is:

``` text
500 records
```

The query therefore processes telemetry in ID-based batches.

------------------------------------------------------------------------

# 22. Empty Batch

When:

``` text
records.length === 0
```

the batch-processing loop stops.

The service proceeds to the next processing stage.

------------------------------------------------------------------------

# 23. Source Record Count

For every retrieved batch:

``` js
sourceRecords += records.length
```

Therefore:

``` text
sourceRecords
```

represents the total number of source telemetry records read for that
vehicle.

------------------------------------------------------------------------

# 24. Historical Record Insertion

Every telemetry record in the retrieved batch is passed to:

``` js
historicalRepository.insertHistoricalRecord()
```

The method receives:

``` json
{
  "record": {},
  "wardNo": 0,
  "vehicleTableName": "...",
  "sourceDayTable": "..."
}
```

The historical repository is responsible for performing the actual
historical insertion.

------------------------------------------------------------------------

# 25. Insert Result

The result from:

``` text
insertHistoricalRecord()
```

is checked using:

``` text
result.inserted
```

If:

``` text
result.inserted === true
```

the service increments:

``` text
inserted
```

Otherwise it increments:

``` text
duplicates
```

Therefore the service treats a non-inserted result as a duplicate for
its archive counters.

------------------------------------------------------------------------

# 26. Pagination Progress

After every telemetry record, the service advances:

``` text
lastId
```

using the source telemetry record's ID:

``` js
lastId = Number(record.id)
```

This is important because the next query requests records after the
latest processed source ID.

The pagination flow is:

``` text
lastId = 0
    ↓
Get up to 500 records
    ↓
Process records
    ↓
lastId = latest source record.id
    ↓
Get next 500 records
    ↓
Continue
```

------------------------------------------------------------------------

# 27. Batch Safety Condition

After processing a batch, the service checks:

``` text
records.length < 500
```

If true, the loop stops.

If exactly 500 records were returned, the service requests another batch
using the updated:

``` text
lastId
```

------------------------------------------------------------------------

# 28. Vehicle Archive Counters

After all telemetry for a vehicle has been processed:

``` text
archivedVehicles
```

is incremented by one.

The service adds:

``` text
inserted
```

to:

``` text
archivedRecords
```

and:

``` text
duplicates
```

to:

``` text
duplicateRecords
```

------------------------------------------------------------------------

# 29. Vehicle Result

A successfully processed vehicle produces:

``` json
{
  "vehicleNumber": "...",
  "vehicleTableName": "...",
  "wardNo": 0,
  "sourceDatabase": "master_telemetry_db",
  "sourceDayTable": "...",
  "historicalYearTable": "...",
  "historicalMonthTable": "...",
  "sourceRecords": 0,
  "inserted": 0,
  "duplicates": 0,
  "archived": true
}
```

This object is appended to:

``` text
vehicleResults
```

------------------------------------------------------------------------

# 30. Complete Archive Result

After all vehicles have been processed, the service returns:

``` json
{
  "success": true,
  "sourceDatabase": "master_telemetry_db",
  "sourceDayTable": "...",
  "year": 2026,
  "month": 8,
  "monthName": "...",
  "archivedVehicles": 0,
  "archivedRecords": 0,
  "duplicateRecords": 0,
  "vehicles": []
}
```

The `vehicles` array contains the individual result for every vehicle,
including vehicles that were skipped because of missing or invalid
information.

------------------------------------------------------------------------

# 31. Complete Processing Flow

The complete method flow is:

``` text
Processing Date
      ↓
Validate Date
      ↓
Get Year / Month / Month Name
      ↓
Get Day Table Name
      ↓
Get Vehicles
      ↓
Vehicles Found?
   ↙          ↘
 NO            YES
 ↓              ↓
Return        Process Vehicle
Empty             ↓
              Vehicle Table Name?
              ↙             ↘
            NO               YES
            ↓                 ↓
         Skip              Validate Ward
                              ↓
                         Generate Tables
                              ↓
                       Ensure Yearly Table
                              ↓
                      Ensure Monthly Table
                              ↓
                       Register Monthly
                              ↓
                      Read Telemetry
                              ↓
                       500-record batches
                              ↓
                    Insert Historical Records
                              ↓
                     Count Duplicates
                              ↓
                    Advance Source ID
                              ↓
                       Next Vehicle
                              ↓
                       Archive Summary
```

------------------------------------------------------------------------

# 32. Database Architecture

The service connects two logical database layers through repositories:

``` text
master_telemetry_db
        ↓
Day Table
        ↓
Vehicle Table
        ↓
Telemetry Records
        ↓
historicalRepository
        ↓
Citizen Historical Database
        ↓
Yearly Index Table
        ↓
Monthly Historical Table
```

The service itself does not execute SQL directly.

Database operations are delegated to the repositories.

------------------------------------------------------------------------

# 33. Repository Interaction

The telemetry repository provides:

``` text
getDayTableName()
getVehiclesFromDayTable()
getVehicleTelemetryAfterId()
```

The historical repository provides:

``` text
MONTH_NAMES
generateYearlyIndexTableName()
generateMonthlyTableName()
tableExists()
createYearlyIndexTable()
createMonthlyHistoryTable()
registerMonthlyTable()
insertHistoricalRecord()
```

------------------------------------------------------------------------

# 34. Duplicate Handling

Duplicate detection is delegated to:

``` text
historicalRepository.insertHistoricalRecord()
```

The service interprets:

``` text
result.inserted === true
```

as a newly inserted historical record.

When the result does not indicate insertion, the service increments:

``` text
duplicates
```

The service therefore does not independently query for duplicates.

------------------------------------------------------------------------

# 35. Vehicle-Level Failure Handling

The service explicitly handles:

``` text
missing vehicle table name
invalid/missing ward number
```

by recording a failed vehicle result and continuing to the next vehicle.

It does not wrap the remaining repository operations for each vehicle in
a local `try/catch`.

Therefore errors thrown by repository operations during those stages can
propagate out of `archiveDate()`.

------------------------------------------------------------------------

# 36. Export

The module exports a single instance:

``` js
module.exports =
  new HistoricalArchiveService();
```

Consumers therefore use the same service instance.

------------------------------------------------------------------------

# 37. Available Methods

The exported service provides:

``` text
archiveDate()
```

------------------------------------------------------------------------

# 38. Summary

`historicalDatabase.service.js` is the date-level historical archival
orchestrator.

It takes one processing date, identifies the corresponding daily
telemetry table, retrieves all vehicles, validates their ward and
vehicle-table information, creates or verifies the appropriate yearly
and monthly historical tables, registers the monthly table in the yearly
index, and archives telemetry records in batches of 500.

The telemetry pagination mechanism uses:

``` text
source telemetry ID
```

rather than offset pagination:

``` text
lastId → getVehicleTelemetryAfterId() → next lastId
```

The service tracks:

``` text
archived vehicles
archived records
duplicates
```

and returns both an overall archive summary and individual vehicle-level
results.

The overall architecture is:

``` text
Processing Date
      ↓
master_telemetry_db
      ↓
day_DDMMYYYY
      ↓
Vehicle Tables
      ↓
500-record ID-based batches
      ↓
Historical Repository
      ↓
Ward Yearly Index
      ↓
Ward Monthly Historical Table
```
