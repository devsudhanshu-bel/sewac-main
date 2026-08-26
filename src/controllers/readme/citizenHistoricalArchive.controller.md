# citizenHistoricalArchive.controller.js Documentation

## 1. File Overview

The Citizen Historical Archive Controller manages archival of telemetry from the daily master telemetry database into the citizen historical database.

The architecture is:

```text
master_telemetry_db
        ↓
Daily Table
        ↓
Vehicle Tables
        ↓
Historical Archive
        ↓
Citizen Historical Database
```

It uses:

```text
telemetryDb
historicalDb
citizenHistoricalTable.repository
```

---

# 2. BATCH_SIZE

Historical telemetry is archived using batches of:

```text
500 records
```

This controls how many source telemetry records are read during each batch.

---

# 3. MONTH_NAMES

The controller defines the twelve calendar month names:

```text
January
February
March
April
May
June
July
August
September
October
November
December
```

These are used while building date information and archive metadata.

---

# 4. validateIdentifier()

Validates dynamic SQL identifiers.

The accepted format is:

```text
^[a-zA-Z][a-zA-Z0-9_]*$
```

Invalid identifiers throw:

```text
Invalid SQL identifier
```

---

# 5. quoteIdentifier()

Validates an identifier and wraps it in PostgreSQL identifier quotes.

This is used for dynamically selected table names.

---

# 6. normalizeDate()

Normalizes an input date into a JavaScript Date containing the relevant calendar date.

Supported inputs include:

```text
Date object
YYYY-MM-DD string
Other parseable date strings
```

Invalid dates throw an error.

For:

```text
YYYY-MM-DD
```

the method performs explicit calendar validation.

---

# 7. getDateInformation()

Converts a date into:

```text
day
month
year
monthString
dayString
dayTable
monthName
```

The daily table format is:

```text
day_DDMMYYYY
```

Example:

```text
2026-08-14
      ↓
day_14082026
```

---

# 8. tableExists()

Checks whether a PostgreSQL public base table exists.

It uses:

```text
information_schema.tables
```

and supports either:

```text
telemetryDb
```

or:

```text
historicalDb
```

depending on the operation.

---

# 9. getVehiclesFromDayTable()

Reads vehicle registrations from the daily source table.

The selected fields are:

```text
vehicle_number
vehicle_table_name
ward_no
```

The important design rule is:

```text
vehicle_table_name
```

is read directly from the day table.

The controller does not construct vehicle table names.

---

# 10. getVehicleTableColumns()

Retrieves the schema of a source vehicle table.

The returned fields include:

```text
column_name
data_type
ordinal_position
```

---

# 11. validateVehicleTable()

Validates that a source vehicle table exists and contains all required telemetry columns.

Required columns include:

```text
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

If required columns are missing, an error is thrown listing the missing fields.

---

# 12. ensureHistoricalTables()

Ensures the required historical tables exist for:

```text
ward
month
year
```

It delegates table creation and registration to:

```text
historicalTableRepository.ensureWardHistoricalTables()
```

The resulting structure is:

```text
ward_{wardNo}_{year}
```

for the yearly index and:

```text
ward_{wardNo}_{MMYYYY}
```

for the monthly historical table.

---

# 13. getHistoricalTableColumns()

Retrieves the schema of a historical destination table.

The returned fields include:

```text
column_name
data_type
ordinal_position
```

---

# 14. validateHistoricalTable()

Validates that the historical destination table exists and contains the required archive columns.

The required fields include:

```text
historical_id
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

Missing columns result in an error.

---

# 15. insertHistoricalBatch()

Reads a batch from the source vehicle table in:

```text
master_telemetry_db
```

and inserts the records into the historical database.

Source fields include:

```text
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

---

# 16. Cross-Database Architecture

The source and destination are separate database connections:

```text
telemetryDb
    ↓
master_telemetry_db

historicalDb
    ↓
citizen historical database
```

Because the databases are separate, the archive process:

```text
reads from telemetryDb
```

and then:

```text
writes to historicalDb
```

rather than performing a cross-database SQL join.

---

# 17. Duplicate Protection

Historical insertion uses:

```text
ON CONFLICT
(
  source_vehicle_table,
  source_telemetry_id
)
DO NOTHING
```

This makes archival idempotent.

Already archived telemetry is therefore not inserted again.

---

# 18. getVehicleRowCount()

Counts all records in a source vehicle table.

The PostgreSQL count is converted into a JavaScript number.

---

# 19. archiveVehicle()

Archives one vehicle's telemetry for a specific month/year and ward.

The sequence is:

```text
Validate Ward
      ↓
Validate Vehicle Table
      ↓
Ensure Historical Tables
      ↓
Validate Destination
      ↓
Count Source Records
      ↓
Read Batches
      ↓
Insert Historical Records
      ↓
Calculate Duplicates
      ↓
Return Vehicle Result
```

---

# 20. archiveVehicle() Result

The result contains:

```text
vehicleNumber
vehicleTableName
wardNo
sourceDatabase
sourceDayTable
historicalYearTable
historicalMonthTable
sourceRecords
inserted
duplicates
archived
```

---

# 21. archiveDate()

The main archive operation is:

```text
archiveDate(dateInput)
```

It:

```text
normalizes the date
↓
generates day table
↓
checks the day table
↓
loads vehicles
↓
reads ward numbers
↓
archives each vehicle
```

No boundary lookup is performed.

The ward number is taken directly from:

```text
ward_no
```

in the daily source table.

---

# 22. Missing Day Table

If the daily source table does not exist, the result contains:

```text
success: false
reason: DAY_TABLE_NOT_FOUND
```

with:

```text
archivedVehicles: 0
archivedRecords: 0
duplicateRecords: 0
vehicles: []
```

---

# 23. No Vehicles

If the daily table exists but contains no vehicles, the result contains:

```text
success: false
reason: NO_VEHICLES
```

No vehicle archival is performed.

---

# 24. Vehicle Processing

Every vehicle from the day table is processed independently.

The controller validates:

```text
vehicle_table_name
ward_no
```

before attempting archival.

Invalid or missing vehicle information is added to:

```text
failedVehicles
```

---

# 25. Failed Vehicle Handling

If an individual vehicle fails during archival, the failure is recorded and processing continues with the remaining vehicles.

A failed vehicle result contains:

```text
vehicleNumber
vehicleTableName
wardNo
archived: false
error
```

---

# 26. Archive Totals

The final archive operation tracks:

```text
archivedVehicles
archivedRecords
duplicateRecords
failedVehicles
```

These totals are returned with the vehicle-level results.

---

# 27. archiveToday()

The controller operation:

```text
archiveToday(req, res)
```

archives telemetry for the current date.

---

# 28. archiveToday() Responses

If the daily table is missing:

```text
HTTP 404
```

If no vehicles are found:

```text
HTTP 404
```

For a successful archive:

```text
HTTP 200
```

Unexpected errors return:

```text
HTTP 500
```

---

# 29. archiveSpecificDate()

The controller operation:

```text
archiveSpecificDate(req, res)
```

archives telemetry for a date supplied in:

```text
req.body.date
```

Expected format:

```text
YYYY-MM-DD
```

---

# 30. Date Validation

The specific-date endpoint requires:

```text
date
```

If missing:

```text
HTTP 400
```

If the format is not:

```text
YYYY-MM-DD
```

the controller also returns:

```text
HTTP 400
```

---

# 31. Specific-Date Responses

Missing day table:

```text
HTTP 404
```

No vehicles:

```text
HTTP 404
```

Successful archive:

```text
HTTP 200
```

Unexpected errors:

```text
HTTP 500
```

---

# 32. testConnections()

The method:

```text
testConnections(req, res)
```

tests both database connections.

It queries:

```text
current_database()
current_schema()
```

from:

```text
telemetryDb
historicalDb
```

---

# 33. Telemetry Connection Information

The response reports:

```text
database
schema
expectedDatabase
todayTable
todayTableExists
```

The expected source database is:

```text
master_telemetry_db
```

---

# 34. Historical Connection Information

The historical connection response reports:

```text
database
schema
```

---

# 35. testConnections() Response

A successful connection test returns:

```text
HTTP 200
```

Unexpected database failures return:

```text
HTTP 500
```

with:

```text
Database connection test failed.
```

---

# 36. Complete Archive Flow

```text
Archive Date
     ↓
Normalize Date
     ↓
Generate day_DDMMYYYY
     ↓
Check Day Table
     ↓
Read Vehicles
     ↓
Read vehicle_table_name + ward_no
     ↓
For Each Vehicle
     ↓
Validate Source Table
     ↓
Ensure Historical Ward Tables
     ↓
Validate Destination
     ↓
Count Source Records
     ↓
Read 500-record Batches
     ↓
Insert into Monthly Historical Table
     ↓
Skip Duplicates
     ↓
Aggregate Results
     ↓
Return Archive Summary
```

---

# 37. Exports

The controller exports:

```text
archiveToday
archiveDate
testConnections
```

The exported `archiveDate` property maps to:

```text
archiveSpecificDate
```

---

# 38. Summary

`citizenHistoricalArchive.controller.js` is the historical telemetry archival controller. It moves records from the daily and vehicle-specific tables in `master_telemetry_db` into ward-based monthly historical tables. It validates source and destination schemas, archives records in batches of 500, prevents duplicates using source telemetry identity, preserves the ward number from the daily table, supports today's archive and specific-date archive operations, and exposes a database connection test endpoint.
