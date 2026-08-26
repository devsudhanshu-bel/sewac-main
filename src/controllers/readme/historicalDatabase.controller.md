# historicalDatabase.controller.js Documentation

## 1. File Overview

The Historical Database Controller archives telemetry from:

```text
master_telemetry_db
```

into the citizen historical database.

The archival hierarchy is:

```text
Requested Date
      ↓
day_DDMMYYYY
      ↓
Vehicle Table
      ↓
Ward
      ↓
Monthly Historical Table
```

Records are processed in batches.

---

# 2. BATCH_SIZE

The configured archive batch size is:

```text
500 records
```

---

# 3. Date Table Convention

Daily source tables use:

```text
day_DDMMYYYY
```

Example:

```text
day_14082026
```

The controller explicitly uses UTC calendar components when generating date information.

---

# 4. validateIdentifier()

Validates dynamic SQL identifiers using:

```text
^[a-zA-Z][a-zA-Z0-9_]*$
```

Invalid identifiers throw an error.

This validation is used before dynamic table names are interpolated into SQL.

---

# 5. normalizeDate()

Supports:

```text
Date objects
YYYY-MM-DD strings
Other parseable date strings
```

For `YYYY-MM-DD`, explicit UTC calendar validation is performed.

Invalid dates throw an error.

---

# 6. getDateInformation()

Returns:

```text
date
day
month
year
monthString
dayString
dayTable
monthName
```

The daily table name is:

```text
day_DDMMYYYY
```

---

# 7. getVehiclesFromDayTable()

The controller reads vehicle information directly from the daily table.

Required columns:

```text
vehicle_number
ward_no
```

The vehicle table-name column is detected from possible names including:

```text
vehicle_table_name
vehicleTableName
vehicle_table
vehicleTable
table_name
tablename
```

The controller does not construct vehicle table names.

It selects distinct:

```text
vehicle_number
ward_no
vehicle_table_name
```

---

# 8. Source Vehicle Validation

The controller checks that the source vehicle table exists in:

```text
master_telemetry_db
```

It also validates required telemetry columns.

Required source fields include:

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

# 9. Historical Table Creation

The controller generates:

```text
yearly index table
monthly historical table
```

using the historical table repository.

It creates the yearly table if missing and creates the monthly table if missing.

The monthly table is registered in the yearly index.

---

# 10. Historical Table Validation

The destination table must contain:

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

---

# 11. insertHistoricalBatch()

Reads source records from the selected vehicle table and inserts them into the historical database.

The insertion maps telemetry fields explicitly into historical fields.

Duplicate protection uses:

```text
source_vehicle_table
source_telemetry_id
```

with:

```text
ON CONFLICT DO NOTHING
```

---

# 12. archiveVehicle()

Archives one vehicle.

Flow:

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
Insert 500-record Batches
      ↓
Calculate Duplicates
      ↓
Return Result
```

---

# 13. archiveDate()

Archives all vehicles found in a selected daily table.

It:

```text
checks the day table
reads distinct vehicles
reads ward numbers
validates each source vehicle table
archives each vehicle
tracks failures
aggregates totals
```

---

# 14. Missing Day Table

If the daily table does not exist:

```text
reason = DAY_TABLE_NOT_FOUND
```

and no vehicles are archived.

---

# 15. No Vehicles

If the daily table contains no vehicles:

```text
reason = NO_VEHICLES
```

is returned.

---

# 16. Failed Vehicles

Individual vehicle failures are collected in:

```text
failedVehicles
```

so that one failed vehicle does not prevent the remaining vehicles from being processed.

---

# 17. Archive Totals

The final result tracks:

```text
archivedVehicles
archivedRecords
duplicateRecords
failedVehicles
vehicles
```

---

# 18. archiveToday()

Archives the current date.

Missing source table and empty vehicle cases return:

```text
HTTP 404
```

Successful archival returns:

```text
HTTP 200
```

Unexpected errors return:

```text
HTTP 500
```

---

# 19. archiveSpecificDate()

Reads:

```text
req.body.date
```

The required format is:

```text
YYYY-MM-DD
```

Missing or invalid date format returns:

```text
HTTP 400
```

Missing daily table or no vehicles returns:

```text
HTTP 404
```

Successful archival returns:

```text
HTTP 200
```

---

# 20. testConnections()

Tests both:

```text
telemetryDb
historicalDb
```

using:

```text
current_database()
current_schema()
```

It also checks whether today's daily telemetry table exists.

---

# 21. Exports

The controller exports:

```text
archiveToday
archiveDate
testConnections
```

The exported `archiveDate` maps to:

```text
archiveSpecificDate
```

---

# 22. Summary

`historicalDatabase.controller.js` performs batch-based telemetry archival from daily vehicle tables in `master_telemetry_db` into ward/month historical tables. It validates SQL identifiers and table structures, creates/registers historical tables when necessary, prevents duplicate archival, supports current-date and specific-date operations, records failed vehicles independently, and exposes database connection diagnostics.
