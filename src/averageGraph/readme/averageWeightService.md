# averageWeightService.js Documentation

## 1. File Overview

The Average Weight Service calculates zone-wise average waste weight for a selected date.

Its data flow is:

```text
Date
 ↓
Daily Vehicle Table
 ↓
Vehicle Number + Telemetry Table
 ↓
vehicle_master
 ↓
Zone
 ↓
Telemetry Weight
 ↓
Zone-wise Aggregation
 ↓
Average Weight Graph
```

---

# 2. Database

The service uses:

```text
mainDb
```

from:

```text
mainDb configuration
```

for PostgreSQL queries.

---

# 3. validateDate()

Validates that a date:

```text
exists
matches YYYY-MM-DD
is parseable as a date
```

Missing date throws:

```text
Date is required
```

Incorrect format throws:

```text
date must be in YYYY-MM-DD format
```

Invalid dates throw:

```text
Invalid date
```

---

# 4. getDayTableName()

Converts:

```text
YYYY-MM-DD
```

into the daily table format:

```text
day_DDMMYYYY
```

Example:

```text
2026-08-23
      ↓
day_23082026
```

---

# 5. isSafeIdentifier()

Validates dynamic table identifiers.

The accepted pattern is:

```text
^[a-zA-Z0-9_]+$
```

Unsafe identifiers are rejected before dynamic table access.

---

# 6. tableExists()

Checks whether a public PostgreSQL table exists using:

```text
information_schema.tables
```

Unsafe identifiers immediately return:

```text
false
```

---

# 7. getVehicleMaster()

Retrieves:

```text
vehicle_id
city
zone
division
ward
```

from:

```text
vehicle_master
```

This data provides the vehicle-to-zone mapping.

---

# 8. getAverageWeightGraph()

The main service method receives:

```text
date
```

---

# 9. Database Connection Logging

The method queries:

```text
current_database()
current_schema()
```

and logs the active database connection information.

---

# 10. Date Processing

The date is validated and converted into:

```text
day_DDMMYYYY
```

The generated daily table is then checked.

---

# 11. Missing Daily Table

If the daily table does not exist, the service returns:

```json
{
  "message": "No daily vehicle table found for <date>",
  "data": []
}
```

---

# 12. Daily Vehicle Data

The daily table provides:

```text
vehicle_number
vehicle_table_name
ward_no
```

If the table exists but contains no records, the service returns an empty result with a corresponding message.

---

# 13. Vehicle Master Data

The service retrieves all vehicle master records.

If:

```text
vehicle_master
```

contains no vehicles, the service returns:

```text
vehicle_master contains no vehicle data
```

with:

```text
data: []
```

---

# 14. Vehicle Lookup

A Map is created using:

```text
vehicle_id
```

as the lookup key.

Vehicle identifiers are normalized using:

```text
String(...).trim()
```

---

# 15. Telemetry Grouping

Daily vehicles are grouped by:

```text
vehicle_table_name
```

Before grouping, each record must have:

```text
vehicle number
telemetry table name
safe telemetry table identifier
```

The vehicle must also exist in:

```text
vehicle_master
```

---

# 16. Vehicle Master as Source of Truth

The service uses:

```text
vehicle_master.zone
```

as the source of truth for zone assignment.

The `ward_no` from the daily table is not used for the final zone aggregation.

---

# 17. No Matching Vehicles

If no daily vehicles match the vehicle master data, the service returns:

```text
No vehicles from the daily table were found in vehicle_master
```

with:

```text
data: []
```

---

# 18. Telemetry Table Validation

Each telemetry table is checked using:

```text
tableExists()
```

If a table does not exist, it is skipped and a warning is logged.

---

# 19. Telemetry Query

For each valid telemetry table, the service selects:

```text
vehiclenumber
receivedtimestamp
wetweight
dryweight
otherweight
```

and filters records using:

```text
DATE(receivedtimestamp) = requested date
```

---

# 20. Telemetry Vehicle Matching

Each telemetry row is matched against the vehicles associated with its telemetry table.

Rows without a valid vehicle match are skipped.

---

# 21. Zone Aggregation

Each zone stores:

```text
zoneId
zoneName
wasteGenerated
vehicles
```

The vehicle collection is a:

```text
Set
```

so a vehicle is counted only once for:

```text
vehiclesRunning
```

within its zone.

---

# 22. Weight Calculation

For every telemetry row:

```text
wetweight
+
dryweight
+
otherweight
```

is calculated.

The result is:

```text
totalWeight
```

---

# 23. Waste Generated

The calculated total weight is added to:

```text
zoneData.wasteGenerated
```

Only finite numeric totals are accepted.

---

# 24. No Telemetry Data

If no zones contain telemetry data, the service returns:

```text
No telemetry weight data found for <date>
```

with:

```text
data: []
```

---

# 25. Graph Data

For each zone, the service calculates:

```text
zoneId
zoneName
wasteGenerated
vehiclesRunning
averageWaste
```

---

# 26. Average Waste Calculation

The average is calculated as:

```text
wasteGenerated / vehiclesRunning
```

and rounded to:

```text
2 decimal places
```

If no vehicles are running,:

```text
averageWaste = 0
```

---

# 27. Waste Generated Rounding

The total zone waste is rounded to:

```text
2 decimal places
```

before being returned.

---

# 28. Zone Sorting

Final graph data is sorted alphabetically by:

```text
zoneName
```

using:

```text
localeCompare()
```

---

# 29. Successful Response

The service returns:

```json
{
  "message": "Average weight graph data fetched successfully",
  "data": []
}
```

The `data` array contains one entry per aggregated zone.

---

# 30. Complete Processing Flow

```text
date
 ↓
Validate Date
 ↓
Generate day_DDMMYYYY
 ↓
Check Daily Table
 ↓
Read Daily Vehicles
 ↓
Read vehicle_master
 ↓
Match Vehicles
 ↓
Group by Telemetry Table
 ↓
Read Date-Specific Telemetry
 ↓
Match Vehicle
 ↓
Read vehicle_master Zone
 ↓
Calculate:
wet + dry + other
 ↓
Aggregate by Zone
 ↓
Count Unique Running Vehicles
 ↓
Calculate Average
 ↓
Sort Zones
 ↓
Return Graph Data
```

---

# 31. Export

The service exports:

```text
getAverageWeightGraph
```

---

# 32. Summary

`averageWeightService.js` generates zone-wise average-weight graph data for a requested date. It validates the date, derives the daily vehicle table, maps daily vehicles to `vehicle_master`, uses `vehicle_master.zone` as the authoritative zone assignment, reads date-specific telemetry from each vehicle table, sums wet/dry/other weights, counts unique running vehicles, calculates average waste per running vehicle, sorts the zones, and returns the resulting graph dataset.
