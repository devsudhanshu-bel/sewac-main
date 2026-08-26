# telemetryDaily.repository.js Documentation

## 1. File Overview

The Telemetry Daily Repository provides access to daily telemetry tables and vehicle-specific telemetry tables.

Its primary purpose is to support daily historical processing.

The structure is:

```text
Processing Date
      ↓
Daily Table
      ↓
Vehicles
      ↓
Vehicle Telemetry Table
      ↓
Telemetry Batches
```

---

## 2. DEFAULT_BATCH_SIZE

The default telemetry batch size is:

```text
500
```

A maximum batch size of:

```text
5000
```

is enforced.

---

## 3. validateIdentifier()

Validates dynamic PostgreSQL identifiers using:

```text
^[a-zA-Z][a-zA-Z0-9_]*$
```

Invalid identifiers throw an error.

---

## 4. getDayTableName()

Generates daily table names in:

```text
day_DDMMYYYY
```

format.

Example:

```text
2026-08-14
      ↓
day_14082026
```

---

## 5. dayTableExists()

Checks whether the daily table for a supplied date exists.

The result contains:

```text
exists
tableName
```

---

## 6. getVehiclesFromDayTable()

Retrieves vehicles registered in the selected day's table.

The result contains:

```text
vehicle_number
vehicle_table_name
ward_no
created_at
```

Vehicles are ordered by:

```text
vehicle_number ASC
```

The ward number is read directly from the day table.

---

## 7. getVehicleTelemetry()

Reads a batch of telemetry records from a vehicle table.

Parameters:

```text
vehicleTableName
offset
limit
```

Default:

```text
offset = 0
limit = 500
```

---

## 8. Telemetry Fields

The returned records include:

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
createdAt
```

Records are ordered by:

```text
id ASC
```

---

## 9. Batch Validation

The offset must:

```text
be an integer
be >= 0
```

The limit must:

```text
be an integer
be > 0
be <= 5000
```

Invalid values throw errors.

---

## 10. getVehicleTelemetryAfterId()

Provides keyset-style pagination using:

```text
WHERE id > lastId
```

The records remain ordered by:

```text
id ASC
```

This is intended to be more efficient for large tables than repeatedly using large offsets.

---

## 11. Keyset Parameters

The method accepts:

```text
vehicleTableName
lastId
limit
```

Defaults:

```text
lastId = 0
limit = 500
```

The same maximum batch-size rule of:

```text
5000
```

is applied.

---

## 12. getVehicleRowCount()

Counts the number of telemetry rows in a vehicle table.

The PostgreSQL `BIGINT` result is converted into a JavaScript number.

---

## 13. Batch Processing Flow

```text
Processing Date
      ↓
getDayTableName()
      ↓
dayTableExists()
      ↓
getVehiclesFromDayTable()
      ↓
Vehicle Table
      ↓
getVehicleTelemetry()
      ↓
Process Batch
      ↓
Next Offset
```

For large tables, the alternative is:

```text
lastId
  ↓
getVehicleTelemetryAfterId()
  ↓
Next lastId
```

---

## 14. Role in Historical Processing

This repository acts as the source-data access layer for the daily historical worker.

The worker can use it to:

```text
identify the daily table
discover vehicles
read telemetry
process telemetry in batches
count source records
```

The repository only retrieves source telemetry; historical storage is handled by the historical database layer.

---

## 15. Exports

The repository exports:

```text
DEFAULT_BATCH_SIZE
validateIdentifier
getDayTableName
dayTableExists
getVehiclesFromDayTable
getVehicleTelemetry
getVehicleTelemetryAfterId
getVehicleRowCount
```

---

## 16. Summary

`telemetryDaily.repository.js` is the daily telemetry source repository. It identifies daily tables, discovers vehicles and their registered vehicle tables, retrieves telemetry in controlled batches, supports efficient keyset pagination, and provides vehicle-table record counts for daily historical processing.
