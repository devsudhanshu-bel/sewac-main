# historicalDatabase.repository.js Documentation

## 1. File Overview

The Historical Database Repository provides database operations for the citizen historical processing pipeline.

It connects:

```text
Telemetry Database
        ↓
Daily Vehicle Tables
        ↓
Historical Database
        ↓
Year / Month Historical Tables
```

The repository handles source telemetry discovery, historical table creation, monthly registration, historical insertion, and record counting.

---

## 2. MONTH_NAMES

Defines the twelve calendar month names used when registering monthly historical tables.

---

## 3. validateIdentifier()

Validates dynamic PostgreSQL table names before they are interpolated into SQL.

The accepted identifier pattern is:

```text
^[a-zA-Z][a-zA-Z0-9_]*$
```

Invalid identifiers throw an error.

---

## 4. getDayTableName()

Generates the daily telemetry table name:

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

## 5. getYearTableName()

Generates the yearly historical index table:

```text
ward_{wardNo}_{year}
```

Example:

```text
ward_174_2026
```

---

## 6. getMonthTableName()

Generates the monthly historical table:

```text
ward_{wardNo}_{MMYYYY}
```

Example:

```text
ward_174_082026
```

---

## 7. tableExists()

Checks whether a table exists in the PostgreSQL `public` schema.

It uses:

```text
information_schema.tables
```

and returns a boolean.

---

## 8. getVehiclesFromDayTable()

Reads the daily table for a supplied date.

The selected fields are:

```text
vehicle_number
vehicle_table_name
ward_no
```

The important design rule is that:

```text
ward_no
```

comes directly from the day table.

No GPS lookup or additional geographic resolution is performed here.

---

## 9. getVehicleTelemetry()

Reads telemetry from the vehicle-specific source table.

The selected telemetry fields include:

```text
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

Records are ordered by:

```text
id ASC
```

---

## 10. createYearTable()

Creates the yearly historical index table.

The table contains:

```text
month_number
month_name
month_table_name
created_at
```

The month number is the primary key.

The yearly table stores month references rather than the actual telemetry records.

---

## 11. createMonthTable()

Creates the monthly historical telemetry table.

The table contains:

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
archived_at
```

A unique constraint prevents duplicate source records using:

```text
source_vehicle_table
source_telemetry_id
```

---

## 12. registerMonthInYear()

Registers a monthly historical table inside its yearly index.

It stores:

```text
month_number
month_name
month_table_name
```

If the month already exists, `ON CONFLICT` updates the month information.

---

## 13. insertHistoricalRecord()

Inserts a telemetry record into the historical monthly table.

The source telemetry information is preserved through:

```text
source_telemetry_id
source_vehicle_table
```

The insertion uses:

```text
ON CONFLICT (
  source_vehicle_table,
  source_telemetry_id
)
DO NOTHING
```

This provides duplicate protection.

---

## 14. Historical Insert Result

The method returns:

```json
{
  "inserted": true,
  "record": "..."
}
```

when a record is inserted.

If the source record already exists:

```json
{
  "inserted": false,
  "record": null
}
```

---

## 15. getHistoricalCount()

Counts records in a historical table and converts PostgreSQL's `BIGINT` result into a JavaScript number.

---

## 16. Complete Flow

```text
Processing Date
      ↓
day_DDMMYYYY
      ↓
Vehicles + Ward Numbers
      ↓
Vehicle Telemetry
      ↓
Determine Ward / Month
      ↓
Create Year Table
      ↓
Create Month Table
      ↓
Register Month
      ↓
Insert Historical Telemetry
      ↓
Duplicate Protection
```

---

## 17. Exports

The repository exports:

```text
getDayTableName
getYearTableName
getMonthTableName
getVehiclesFromDayTable
getVehicleTelemetry
createYearTable
createMonthTable
registerMonthInYear
insertHistoricalRecord
getHistoricalCount
```

---

## 18. Summary

`historicalDatabase.repository.js` is the historical database access layer. It discovers source vehicles and telemetry from daily/vehicle tables, creates yearly and monthly historical structures, registers month indexes, inserts historical telemetry with duplicate protection, and provides historical record counts.
