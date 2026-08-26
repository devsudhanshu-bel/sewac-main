# historicalDatabase.routes.js Documentation

## 1. File Overview

**File:** `historicalDatabase.routes.js`\
**Location:** `src/routes/historicalDatabase.routes.js`

The historical database router provides endpoints for archiving
telemetry data.

It uses:

``` text
citizenHistoricalArchive.controller
```

The available operations are:

``` text
Archive Today
Archive Specific Date
```

------------------------------------------------------------------------

# 2. POST /archive-today

Calls:

``` text
archiveToday
```

The route is:

``` text
POST /archive-today
```

The route comment documents the processing flow as:

``` text
master_telemetry_db
      ↓
day_DDMMYYYY
      ↓
vehicle_table_name
      ↓
vehicle table
      ↓
ward historical monthly table
```

This endpoint triggers the archive operation for the current day.

------------------------------------------------------------------------

# 3. POST /archive

Calls:

``` text
archiveDate
```

The route is:

``` text
POST /archive
```

The documented request body is:

``` json
{
  "date": "2026-08-14"
}
```

This endpoint triggers archival processing for a specific date.

------------------------------------------------------------------------

# 4. Archive Operations

  Method   Endpoint           Controller
  -------- ------------------ ----------------
  POST     `/archive-today`   `archiveToday`
  POST     `/archive`         `archiveDate`

------------------------------------------------------------------------

# 5. Complete Route Flow

``` text
Historical Database Router
          ↓
+-----------------------------+
|                             |
POST /archive-today       POST /archive
|                             |
↓                             ↓
archiveToday             archiveDate
|                             |
+-------------+---------------+
              ↓
      Historical Archiving
              ↓
        Ward Historical
        Monthly Tables
```

------------------------------------------------------------------------

# 6. Archive Data Flow

The route documentation describes the archive-today flow as:

``` text
master_telemetry_db
      ↓
day_DDMMYYYY
      ↓
vehicle_table_name
      ↓
vehicle table
      ↓
ward historical monthly table
```

------------------------------------------------------------------------

# 7. Authentication

No:

``` text
authMiddleware
```

is attached to either route in this file.

The route file therefore does not explicitly enforce authentication.

------------------------------------------------------------------------

# 8. Endpoint Summary

  Method   Endpoint           Purpose
  -------- ------------------ ----------------------------------------
  POST     `/archive-today`   Archive today's telemetry
  POST     `/archive`         Archive telemetry for a specified date

------------------------------------------------------------------------

# 9. Summary

`historicalDatabase.routes.js` is the historical telemetry archival
routing layer. It provides separate endpoints for archiving today's data
and archiving data for a specified date, delegating both operations to
the historical archive controller.
