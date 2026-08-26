# citizenHistoricalTable.service.js Documentation

## 1. File Overview

**File:** `citizenHistoricalTable.service.js`\
**Location:** `src/services/citizenHistoricalTable.service.js`

This service manages the preparation and archival of daily vehicle
telemetry into ward-specific historical monthly tables.

It handles:

``` text
SQL identifier validation
Day table name generation
Day table column discovery
Vehicle table column discovery
Vehicle table name resolution
Vehicle table structure validation
Historical table creation
Vehicle telemetry archival
Daily archival
Duplicate detection
Archive result reporting
```

The main archival flow is:

``` text
master_telemetry_db
        ↓
day_DDMMYYYY
        ↓
vehicle table name
        ↓
vehicle telemetry table
        ↓
ward number
        ↓
historical monthly table
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
telemetryDb
historicalDb
historicalTableRepository
```

The database connections are:

``` text
telemetryDb
    ↓
master telemetry database

historicalDb
    ↓
citizen historical database
```

The repository is responsible for historical-table-specific operations.

------------------------------------------------------------------------

## 3. Configuration

The service defines:

``` text
BATCH_SIZE = 500
```

The constant is declared in the service configuration.

The current implementation does not otherwise use `BATCH_SIZE` in the
archival queries.

------------------------------------------------------------------------

# 4. validateIdentifier()

This internal helper validates SQL identifiers before they are
interpolated into SQL statements.

The value must:

``` text
be a string
start with a letter
contain only letters, numbers, and underscores
```

The validation pattern is:

``` text
^[a-zA-Z][a-zA-Z0-9_]*$
```

If the identifier is invalid, the function throws:

``` text
Invalid SQL identifier: <value>
```

A valid identifier is returned unchanged.

This validation is applied to dynamically selected table names before
they are used in SQL.

------------------------------------------------------------------------

# 5. generateDayTableName()

This function generates the daily telemetry table name from a supplied
date.

It first converts the input using:

``` js
new Date(dateInput)
```

If the resulting date is invalid, it throws:

``` text
Invalid date
```

The date components are read using UTC:

``` text
UTC day
UTC month
UTC year
```

The resulting table name follows:

``` text
day_DDMMYYYY
```

For example:

``` text
day_26082026
```

------------------------------------------------------------------------

# 6. getDayTableColumns()

This function retrieves the column definitions of a daily telemetry
table.

It first validates:

``` text
dayTableName
```

using:

``` text
validateIdentifier()
```

It then queries:

``` text
information_schema.columns
```

for:

``` text
public schema
```

and the specified table.

The returned columns are ordered by:

``` text
ordinal_position ASC
```

The method returns the database column metadata directly.

------------------------------------------------------------------------

# 7. findVehicleTableColumn()

This helper determines which column in a day table contains the vehicle
table name.

It extracts all column names and checks them against the following
possible names:

``` text
vehicle_table_name
vehicleTableName
vehicle_table
vehicleTable
table_name
tablename
```

The first matching column is selected.

If none of the supported names are present, the function throws:

``` text
Could not find vehicle table name column. Available columns: ...
```

This allows the service to work with different naming conventions in the
source day table.

------------------------------------------------------------------------

# 8. getDayVehicles()

This function retrieves the vehicles represented in a daily telemetry
table.

It first validates:

``` text
dayTableName
```

Then it:

``` text
1. Reads the day-table columns.
2. Finds the vehicle-table-name column.
3. Validates required day-table columns.
4. Retrieves distinct vehicles.
```

------------------------------------------------------------------------

## Required Day Table Columns

The day table must contain:

``` text
vehicle_number
ward_no
```

If `vehicle_number` is missing, the service throws:

``` text
Day table "<table>" does not contain vehicle_number
```

If `ward_no` is missing, it throws:

``` text
Day table "<table>" does not contain ward_no
```

------------------------------------------------------------------------

## Vehicle Table Name

The service uses the vehicle table name already stored in the day table.

It does **not** construct a vehicle table name itself.

The selected column is returned as:

``` text
vehicle_table_name
```

------------------------------------------------------------------------

## Vehicle Selection

The SQL query selects:

``` text
vehicle_number
ward_no
vehicle_table_name
```

using:

``` text
DISTINCT
```

Rows with a null or blank vehicle table name are excluded.

Results are ordered by:

``` text
vehicle_number ASC
```

------------------------------------------------------------------------

# 9. sourceVehicleTableExists()

This function checks whether a source telemetry table exists.

The supplied table name is validated first.

It queries:

``` text
information_schema.tables
```

and requires:

``` text
table_schema = 'public'
table_type = 'BASE TABLE'
```

The function returns:

``` text
true
```

when the table exists.

Otherwise:

``` text
false
```

------------------------------------------------------------------------

# 10. getVehicleColumns()

This function retrieves the structure of a source vehicle telemetry
table.

It validates:

``` text
tableName
```

and queries:

``` text
information_schema.columns
```

for:

``` text
column_name
data_type
```

The results are ordered by:

``` text
ordinal_position ASC
```

------------------------------------------------------------------------

# 11. validateVehicleTableStructure()

This function validates that a source vehicle telemetry table contains
all required columns.

The required columns are:

``` text
id
iottimestamp
receivedtimestamp
rfidepc
citizenid
wastetype
latitude
longitude
wetweight
dryweight
otherweight
cumulativeweight
drivername
vehiclenumber
firmwareversion
unitnumber
collectiontype
remarks
errorcode
citizencontact
driveraction
```

The service compares these names against the actual source table
columns.

------------------------------------------------------------------------

## Missing Columns

If one or more required columns are missing, the service throws:

``` text
Vehicle table "<tableName>" is missing columns: ...
```

If all required columns are present, it returns:

``` text
true
```

------------------------------------------------------------------------

# 12. ensureHistoricalTables()

This function delegates historical-table creation/ensuring to:

``` js
historicalTableRepository.ensureWardHistoricalTables()
```

It supplies:

``` text
wardNo
month
year
```

The repository call is conditional.

If:

``` text
ensureWardHistoricalTables
```

exists on the repository, it is called.

Otherwise the function returns:

``` text
null
```

------------------------------------------------------------------------

# 13. archiveVehicle()

This is the main single-vehicle archival function.

It receives:

``` text
vehicleNumber
wardNo
vehicleTableName
sourceDayTable
month
year
```

Its flow is:

``` text
Validate identifiers
        ↓
Validate ward
        ↓
Check source vehicle table
        ↓
Validate source table structure
        ↓
Generate monthly historical table
        ↓
Check/create historical table
        ↓
Count source records
        ↓
Insert source telemetry
        ↓
Handle duplicates
        ↓
Return archive result
```

------------------------------------------------------------------------

# 14. archiveVehicle() --- Identifier Validation

The service validates:

``` text
vehicleTableName
sourceDayTable
```

using:

``` text
validateIdentifier()
```

Invalid identifiers cause an exception before SQL execution.

------------------------------------------------------------------------

# 15. archiveVehicle() --- Ward Validation

The ward number is converted using:

``` js
Number(wardNo)
```

The service requires the result to be:

``` text
an integer
greater than 0
```

If invalid, it throws:

``` text
Invalid ward number: <wardNo>
```

The month and year are also converted using:

``` js
Number(month)
Number(year)
```

------------------------------------------------------------------------

# 16. archiveVehicle() --- Source Vehicle Table

The service checks whether:

``` text
vehicleTableName
```

exists in:

``` text
master_telemetry_db
```

If it does not exist, it throws:

``` text
Vehicle table "<vehicleTableName>" does not exist in master_telemetry_db
```

------------------------------------------------------------------------

# 17. archiveVehicle() --- Source Structure Validation

After confirming that the source vehicle table exists, the service
calls:

``` text
validateVehicleTableStructure()
```

The source table must contain all required telemetry fields before
archival can continue.

------------------------------------------------------------------------

# 18. archiveVehicle() --- Historical Monthly Table

The monthly historical table name is generated using:

``` js
historicalTableRepository.generateMonthlyTableName(
  numericWard,
  numericMonth,
  numericYear
)
```

The resulting table name is stored as:

``` text
monthlyTableName
```

------------------------------------------------------------------------

## Ensure Historical Table Exists

The service checks:

``` js
historicalTableRepository.tableExists(
  monthlyTableName
)
```

If the table does not exist, it creates it using:

``` js
historicalTableRepository.createMonthlyHistoryTable(
  monthlyTableName
)
```

------------------------------------------------------------------------

# 19. archiveVehicle() --- Source Record Count

Before inserting the telemetry, the service counts all rows in the
source vehicle table:

``` sql
SELECT COUNT(*)::BIGINT AS count
```

The result is converted to a JavaScript number and stored as:

``` text
sourceRecords
```

------------------------------------------------------------------------

# 20. archiveVehicle() --- Historical Insert

The service inserts telemetry into the monthly historical table.

The insert explicitly maps source fields to historical fields.

The source database fields include:

``` text
id
iottimestamp
receivedtimestamp
rfidepc
citizenid
wastetype
latitude
longitude
wetweight
dryweight
otherweight
cumulativeweight
drivername
firmwareversion
unitnumber
collectiontype
remarks
errorcode
citizencontact
driveraction
```

The historical columns include:

``` text
source_telemetry_id
source_vehicle_table
vehicle_number
ward_no
iot_timestamp
received_timestamp
rfid_epc
citizen_id
waste_type
latitude
longitude
wet_weight
dry_weight
other_weight
cumulative_weight
driver_name
firmware_version
unit_number
collection_type
remarks
error_code
citizen_contact
driver_action
source_day_table
archived_at
```

------------------------------------------------------------------------

# 21. Additional Archive Metadata

The archival insert also stores:

``` text
source_vehicle_table
vehicle_number
ward_no
source_day_table
archived_at
```

The archive timestamp is generated by the database using:

``` text
NOW()
```

------------------------------------------------------------------------

# 22. Duplicate Handling

The insert uses the conflict target:

``` text
source_vehicle_table
source_telemetry_id
```

with:

``` text
ON CONFLICT DO NOTHING
```

Therefore an already archived telemetry record is not inserted again.

The number of newly inserted records is:

``` text
insertResult.length
```

The number of duplicates is calculated as:

``` text
sourceRecords - inserted
```

with a lower bound of zero.

------------------------------------------------------------------------

# 23. archiveVehicle() Return Value

The function returns:

``` json
{
  "vehicleNumber": "...",
  "vehicleTableName": "...",
  "wardNo": 0,
  "sourceDatabase": "master_telemetry_db",
  "sourceDayTable": "...",
  "historicalMonthTable": "...",
  "sourceRecords": 0,
  "inserted": 0,
  "duplicates": 0,
  "archived": true
}
```

The `archived` flag is true when:

``` text
at least one record was inserted
```

or:

``` text
the source contains zero records
```

------------------------------------------------------------------------

# 24. archiveDay()

This function archives all vehicles represented in a specified daily
telemetry table.

It receives:

``` text
dateInput
```

and determines:

``` text
day
month
year
monthName
sourceDayTable
```

------------------------------------------------------------------------

# 25. archiveDay() --- Date Validation

The supplied date is converted using:

``` js
new Date(dateInput)
```

If invalid, the service throws:

``` text
Invalid archive date
```

The day, month, and year are obtained using UTC date components.

------------------------------------------------------------------------

# 26. archiveDay() --- Source Day Table

The source daily table is generated as:

``` text
day_DDMMYYYY
```

For example:

``` text
day_26082026
```

The month component is padded to two digits.

------------------------------------------------------------------------

# 27. archiveDay() --- Month Name

The service obtains the month name from:

``` text
historicalTableRepository.MONTH_NAMES
```

using:

``` text
month - 1
```

The resulting value is stored as:

``` text
monthName
```

------------------------------------------------------------------------

# 28. archiveDay() --- Day Table Existence

Before processing vehicles, the service verifies that the source day
table exists in:

``` text
master_telemetry_db
```

If it does not exist, it throws:

``` text
Day table "<sourceDayTable>" does not exist in master_telemetry_db
```

------------------------------------------------------------------------

# 29. archiveDay() --- Read Vehicles

The service retrieves vehicles using:

``` js
getDayVehicles(sourceDayTable)
```

The returned list contains distinct vehicle entries with:

``` text
vehicle_number
ward_no
vehicle_table_name
```

------------------------------------------------------------------------

# 30. archiveDay() --- Process Every Vehicle

The service loops through every vehicle:

``` js
for (const vehicle of vehicles)
```

For each vehicle it calls:

``` js
archiveVehicle()
```

using:

``` text
vehicle.vehicle_number
vehicle.ward_no
vehicle.vehicle_table_name
sourceDayTable
month
year
```

------------------------------------------------------------------------

# 31. Per-Vehicle Failure Handling

Each vehicle archival operation has its own:

``` text
try / catch
```

If one vehicle fails, the error is recorded in the results array.

The failure object contains:

``` json
{
  "vehicleNumber": "...",
  "vehicleTableName": "...",
  "wardNo": 0,
  "archived": false,
  "error": "..."
}
```

The service therefore continues processing the remaining vehicles
instead of aborting the entire day archive because of one vehicle
failure.

------------------------------------------------------------------------

# 32. Archive Counters

During daily archival, the service maintains:

``` text
archivedVehicles
archivedRecords
duplicateRecords
```

------------------------------------------------------------------------

## archivedVehicles

Incremented when:

``` text
result.archived === true
```

------------------------------------------------------------------------

## archivedRecords

Increased by:

``` text
result.inserted
```

for every successfully processed vehicle.

------------------------------------------------------------------------

## duplicateRecords

Increased by:

``` text
result.duplicates
```

for every successfully processed vehicle.

------------------------------------------------------------------------

# 33. archiveDay() Return Value

The successful daily archive returns:

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

The `vehicles` array contains the individual vehicle archival results.

------------------------------------------------------------------------

# 34. Complete Daily Archive Flow

The complete flow is:

``` text
Date Input
    ↓
Validate Date
    ↓
Generate day_DDMMYYYY
    ↓
Check Day Table
    ↓
Read Vehicles
    ↓
For Each Vehicle
    ↓
Validate Vehicle Table
    ↓
Check Vehicle Table Exists
    ↓
Validate Vehicle Structure
    ↓
Generate Ward Monthly Table
    ↓
Create Monthly Table if Needed
    ↓
Count Source Records
    ↓
Insert Historical Records
    ↓
Skip Existing Records
    ↓
Record Vehicle Result
    ↓
Continue Next Vehicle
    ↓
Return Daily Archive Summary
```

------------------------------------------------------------------------

# 35. Database Architecture

The service operates across two databases:

``` text
master_telemetry_db
        │
        ├── day_DDMMYYYY
        │       ↓
        │   vehicle_table_name
        │       ↓
        └── vehicle telemetry table
                │
                │
                ↓
      citizen historical database
                │
                └── ward monthly table
```

The source database is represented in the returned results as:

``` text
master_telemetry_db
```

------------------------------------------------------------------------

# 36. Important Table Naming Rule

The service intentionally uses the vehicle table name already stored in
the daily table.

It does not construct vehicle table names itself.

The daily table therefore acts as the mapping layer:

``` text
Day Table
    ↓
vehicle_number
ward_no
vehicle_table_name
    ↓
Actual Vehicle Telemetry Table
```

------------------------------------------------------------------------

# 37. Exported Functions

The service exports:

``` text
generateDayTableName
getDayVehicles
archiveVehicle
archiveDay
```

The following helpers remain internal and are not exported:

``` text
validateIdentifier
getDayTableColumns
findVehicleTableColumn
sourceVehicleTableExists
getVehicleColumns
validateVehicleTableStructure
ensureHistoricalTables
```

------------------------------------------------------------------------

# 38. Summary

`citizenHistoricalTable.service.js` is the daily telemetry archival
layer between the master telemetry database and the citizen historical
database.

It identifies the appropriate day table, reads the vehicles and their
stored vehicle-table mappings, validates each source table, determines
the ward-specific monthly historical table, and explicitly maps source
telemetry fields into historical columns.

The service uses:

``` text
ON CONFLICT DO NOTHING
```

to prevent duplicate historical telemetry.

For daily archival, each vehicle is processed independently so a failure
in one vehicle does not prevent other vehicles from being archived.

The resulting architecture is:

``` text
master_telemetry_db
    ↓
day_DDMMYYYY
    ↓
vehicle table
    ↓
vehicle telemetry
    ↓
ward number
    ↓
citizen historical monthly table
```
