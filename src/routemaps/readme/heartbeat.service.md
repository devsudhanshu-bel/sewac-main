# heartbeat.service.js Documentation

## 1. File Overview

**File:** `heartbeat.service.js`

The heartbeat service implements the database and business logic for
vehicle heartbeat operations.

It uses:

``` text
mainDb
```

for PostgreSQL queries.

The service handles:

``` text
Heartbeat Creation
Complete Heartbeat Retrieval
Latest Heartbeat Retrieval
Limited Heartbeat Retrieval
Time-Range Heartbeat Retrieval
```

------------------------------------------------------------------------

# 2. formatDateForTable()

The helper:

``` text
formatDateForTable(date)
```

converts:

``` text
YYYY-MM-DD
```

into:

``` text
DDMMYYYY
```

Example:

``` text
2026-08-23
      ↓
23082026
```

Invalid or missing input returns:

``` text
null
```

------------------------------------------------------------------------

# 3. tableExists()

The helper:

``` text
tableExists(tableName)
```

checks PostgreSQL's:

``` text
information_schema.tables
```

for a public table matching the supplied name.

It returns:

``` text
true
```

when the table exists and:

``` text
false
```

otherwise.

------------------------------------------------------------------------

# 4. getDayTable()

The service determines the current daily table using the current date.

The table format is:

``` text
day_DDMMYYYY
```

For example:

``` text
2026-08-23
      ↓
day_23082026
```

------------------------------------------------------------------------

# 5. getVehicleRegistration()

The service uses the daily table to find a vehicle's registration
information.

The registration data includes:

``` text
vehicle_table_name
ward_no
```

The vehicle is identified using:

``` text
vehicle_number
```

------------------------------------------------------------------------

# 6. Vehicle Registration Requirement

Heartbeat operations require the vehicle to be registered in the current
day's table.

If no registration is found, the service reports that the vehicle is:

``` text
not registered for today
```

The controller maps this condition to:

``` text
HTTP 404
```

------------------------------------------------------------------------

# 7. createHeartbeat()

The main write method is:

``` text
createHeartbeat(data)
```

It creates a heartbeat record for a vehicle.

The input supports the vehicle identifier and heartbeat telemetry values
supplied by the request.

------------------------------------------------------------------------

# 8. Heartbeat Data Validation

The service validates the required heartbeat information before
insertion.

Validation errors are surfaced to the controller, which maps messages
containing:

``` text
required
must be
between
```

to:

``` text
HTTP 400
```

------------------------------------------------------------------------

# 9. Heartbeat Table

Heartbeat data is stored in a dynamically determined heartbeat table
associated with the vehicle and current processing context.

The service returns the selected:

``` text
heartbeatTable
```

along with the inserted heartbeat result.

------------------------------------------------------------------------

# 10. Vehicle Table and Day Table Metadata

Heartbeat operations also track:

``` text
vehicleTable
dayTable
wardNo
```

These values are returned to the controller and exposed through the
response metadata.

------------------------------------------------------------------------

# 11. getAllHeartbeats()

The method:

``` text
getAllHeartbeats(vehicleNumber)
```

retrieves the complete heartbeat dataset for the specified vehicle.

The result contains:

``` text
count
data
heartbeatTable
dayTable
vehicleTable
wardNo
```

------------------------------------------------------------------------

# 12. getLatestHeartbeat()

The method:

``` text
getLatestHeartbeat(vehicleNumber)
```

retrieves the latest heartbeat record for the specified vehicle.

The result contains:

``` text
data
heartbeatTable
dayTable
vehicleTable
wardNo
```

------------------------------------------------------------------------

# 13. getLatestHeartbeats()

The method:

``` text
getLatestHeartbeats(vehicleNumber, limit)
```

retrieves a limited number of recent heartbeat records.

The result contains:

``` text
count
data
heartbeatTable
dayTable
vehicleTable
wardNo
```

------------------------------------------------------------------------

# 14. getHeartbeatsByTimeRange()

The method:

``` text
getHeartbeatsByTimeRange(
  vehicleNumber,
  start,
  end
)
```

retrieves heartbeat records within the supplied time range.

The result contains:

``` text
count
data
heartbeatTable
dayTable
vehicleTable
wardNo
```

------------------------------------------------------------------------

# 15. Heartbeat Retrieval Flow

``` text
vehicleNumber
      ↓
Determine day table
      ↓
Verify vehicle registration
      ↓
Determine heartbeat table
      ↓
Query heartbeat records
      ↓
Return data + metadata
```

------------------------------------------------------------------------

# 16. Limited Retrieval Flow

``` text
vehicleNumber + limit
        ↓
Vehicle Registration
        ↓
Heartbeat Table
        ↓
Latest N Records
        ↓
count + data + metadata
```

------------------------------------------------------------------------

# 17. Time-Range Retrieval Flow

``` text
vehicleNumber
      +
start
      +
end
      ↓
Vehicle Registration
      ↓
Heartbeat Table
      ↓
Time-Range Query
      ↓
count + data + metadata
```

------------------------------------------------------------------------

# 18. Complete Service Architecture

``` text
Heartbeat Service
       ↓
+-------------------------------+
|                               |
Write                         Read
|                               |
createHeartbeat        +--------+---------+
                       |        |         |
                    getAll   getLatest  range
                       |        |         |
                       +--------+---------+
                                ↓
                         Heartbeat Tables
                                ↓
                         PostgreSQL
```

------------------------------------------------------------------------

# 19. Database Relationship

The service operates through:

``` text
Current Day
    ↓
day_DDMMYYYY
    ↓
Vehicle Registration
    ↓
vehicle_table_name
    ↓
Heartbeat Data
```

The service uses the daily registration information to determine the
vehicle-specific database context.

------------------------------------------------------------------------

# 20. Response Metadata

Heartbeat service operations expose:

``` text
heartbeatTable
dayTable
vehicleTable
wardNo
```

This allows the controller response to identify the database context
used for the heartbeat operation.

------------------------------------------------------------------------

# 21. Summary

`heartbeat.service.js` is the core heartbeat data-access and
business-logic layer. It determines the current daily registration
context, verifies vehicle registration, identifies the appropriate
heartbeat and vehicle tables, creates heartbeat records, and provides
complete, latest, limited, and time-range heartbeat retrieval
operations.

The central architecture is:

``` text
Vehicle
  ↓
Daily Registration
  ↓
Vehicle Context
  ↓
Heartbeat Table
  ↓
Heartbeat Records
```
