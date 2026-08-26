# routeMapRepository.js Documentation

## 1. File Overview

The Route Map Repository retrieves telemetry required to build vehicle route maps for a selected date and ward.

The database flow is:

```text
Date
 ↓
Daily Table
 ↓
Selected Ward
 ↓
Vehicle Table Names
 ↓
Complete Vehicle Telemetry
 ↓
GPS Points
```

---

## 2. IDENTIFIER_REGEX

Dynamic database identifiers are validated using:

```text
^[A-Za-z_][A-Za-z0-9_]*$
```

This prevents unsafe table identifiers from being interpolated into SQL.

---

## 3. quoteIdentifier()

Safely converts a validated database identifier into a quoted PostgreSQL identifier.

It rejects unsafe values before they can be used in dynamic SQL.

---

## 4. tableExists()

Checks whether a public PostgreSQL base table exists.

It uses:

```text
information_schema.tables
```

and returns:

```text
true
```

or:

```text
false
```

---

## 5. getDayTableName()

Converts a date in:

```text
YYYY-MM-DD
```

format into:

```text
day_DDMMYYYY
```

Example:

```text
2026-08-16
      ↓
day_16082026
```

---

## 6. getVehiclesForWard()

Reads the selected day's table and retrieves vehicles assigned to the requested ward.

The query filters using:

```text
ward_no
```

and requires:

```text
vehicle_table_name
```

to be non-null and non-empty.

Returned fields are:

```text
vehicle_number
vehicle_table_name
ward_no
```

Vehicles are ordered by:

```text
vehicle_number ASC
```

---

## 7. Vehicle Table Resolution

The repository does not construct vehicle table names itself.

Instead it uses:

```text
vehicle_table_name
```

already stored in the day table.

This keeps vehicle-table resolution tied to the daily registration data.

---

## 8. getVehicleTelemetry()

Retrieves the complete telemetry row from a vehicle table using:

```sql
SELECT *
```

Records are chronologically ordered by:

```text
iottimestamp ASC NULLS LAST
```

with:

```text
id ASC
```

as the secondary ordering field.

---

## 9. GPS Filtering

After retrieving telemetry, the repository filters records so that only records with usable:

```text
latitude
longitude
```

are retained.

Both values must convert to finite numbers.

---

## 10. getRouteData()

The main route-data method accepts:

```text
date
wardNo
```

It then performs the following sequence:

```text
Generate Day Table
        ↓
Find Ward Vehicles
        ↓
Read Every Vehicle Table
        ↓
Read Complete Telemetry
        ↓
Filter GPS Points
        ↓
Build Vehicle Route Data
```

---

## 11. Missing Day Table

If the daily table does not exist, the method returns:

```json
{
  "success": false,
  "reason": "DAY_TABLE_NOT_FOUND",
  "date": "...",
  "wardNo": "...",
  "dayTable": "...",
  "vehicles": []
}
```

---

## 12. No Vehicles

If the day table exists but contains no vehicles for the selected ward, the method returns:

```json
{
  "success": true,
  "reason": "NO_VEHICLES",
  "date": "...",
  "wardNo": "...",
  "dayTable": "...",
  "vehicles": []
}
```

---

## 13. Vehicle Route Object

Each vehicle returned by the method contains:

```text
vehicleNumber
vehicleTableName
wardNo
totalRecords
gpsPoints
points
```

where:

```text
totalRecords = complete telemetry count
gpsPoints = telemetry records with valid GPS coordinates
points = GPS-capable telemetry records
```

---

## 14. Complete Route Response

A successful route response contains:

```text
success
date
wardNo
dayTable
totalVehicles
vehicles
```

---

## 15. Complete Flow

```text
getRouteData()
      ↓
getDayTableName()
      ↓
getVehiclesForWard()
      ↓
For Each Vehicle
      ↓
getVehicleTelemetry()
      ↓
SELECT *
      ↓
GPS Coordinate Validation
      ↓
Vehicle Route Object
      ↓
Complete Route Response
```

---

## 16. Export

The repository exports:

```text
getRouteData
```

---

## 17. Summary

`routeMapRepository.js` is the route-data access layer. It resolves the appropriate daily table, finds vehicles belonging to a selected ward, retrieves complete telemetry from each registered vehicle table, filters records to usable GPS coordinates, and returns the structured data required to render vehicle routes.
