# citizenHistoricalDailyWorker.service.js Documentation

## 1. File Overview

**File:** `citizenHistoricalDailyWorker.service.js`\
**Location:** `src/services/citizenHistoricalDailyWorker.service.js`

This service is responsible only for triggering the existing daily
historical telemetry archive process.

It handles:

``` text
Current date calculation
Date formatting
Historical archive triggering
Archive result reporting
Archive failure handling
```

It does **not** independently process historical citizen data or perform
boundary resolution.

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
archiveDate
```

imported from:

``` text
../controllers/historicalDatabase.controller
```

The actual historical archive logic remains inside:

``` text
historicalDatabase.controller
```

The worker delegates the archive operation to:

``` js
archiveDate()
```

------------------------------------------------------------------------

# 3. Worker Responsibility

The worker is intentionally limited to triggering the existing
historical archive pipeline.

It does not:

``` text
Process citizen GPS
Resolve citizen boundaries
Lookup ward boundaries
Process citizen historical data
Create another historical pipeline
```

The worker therefore acts as a scheduling/service layer around the
existing archive controller.

------------------------------------------------------------------------

# 4. Historical Archive Flow

The implemented flow is:

``` text
Scheduler
    ↓
Daily Worker
    ↓
historicalDatabase.controller
    ↓
archiveDate()
    ↓
master_telemetry_db
    ↓
day_DDMMYYYY
    ↓
vehicle_table_name
    ↓
actual vehicle telemetry table
    ↓
ward_no
    ↓
citizen historical database
```

The worker itself does not duplicate the archive logic represented by
the controller.

------------------------------------------------------------------------

# 5. getToday()

This function returns the current date with the time reset to midnight.

It creates:

``` js
new Date()
```

and then constructs a new date using:

``` text
current year
current month
current day
```

The resulting value represents:

``` text
Today at 00:00:00
```

The function does not return a formatted string.

It returns a JavaScript `Date` object.

------------------------------------------------------------------------

# 6. formatDate()

This function converts a JavaScript `Date` object into:

``` text
YYYY-MM-DD
```

The year is obtained using:

``` js
date.getFullYear()
```

The month is converted to a two-digit value:

``` text
01 → 12
```

The day is also converted to a two-digit value:

``` text
01 → 31
```

The final format is:

``` text
YYYY-MM-DD
```

For example:

``` text
2026-08-26
```

------------------------------------------------------------------------

# 7. processDay()

This is the main worker function.

It accepts:

``` text
processingDate
```

The parameter defaults to:

``` text
null
```

When no processing date is supplied, the worker uses:

``` text
getToday()
```

Therefore:

``` text
processDay()
```

archives the current day.

A specific date can also be supplied:

``` text
processDay(date)
```

------------------------------------------------------------------------

# 8. Processing Date Resolution

The service determines the processing date using:

``` js
processingDate
  ? new Date(processingDate)
  : getToday()
```

Therefore:

``` text
processingDate supplied
        ↓
Convert supplied value to Date

processingDate not supplied
        ↓
Use today's date
```

------------------------------------------------------------------------

# 9. Invalid Date Handling

After creating the processing date, the service checks:

``` js
date.getTime()
```

using:

``` js
Number.isNaN()
```

If the date is invalid, the function throws:

``` text
Invalid processing date.
```

No archive operation is started when the processing date is invalid.

------------------------------------------------------------------------

# 10. Archive Date Formatting

Once the processing date has been validated, it is converted using:

``` js
formatDate(date)
```

The resulting value is stored as:

``` text
formattedDate
```

This formatted date is passed to the archive controller.

------------------------------------------------------------------------

# 11. Archive Trigger

The worker calls:

``` js
archiveDate(formattedDate)
```

This is the central operation performed by the worker.

The worker does not implement the archive logic itself.

Instead:

``` text
processDay()
    ↓
archiveDate(formattedDate)
```

The returned value is stored as:

``` text
result
```

------------------------------------------------------------------------

# 12. Successful Archive

When `archiveDate()` completes successfully, the worker logs:

``` text
DAILY HISTORICAL ARCHIVE COMPLETED
```

It reports:

``` text
Date
Vehicles archived
Records inserted
Duplicates
Failed vehicles
```

The implementation uses safe defaults for numeric result values:

``` js
result.archivedVehicles ?? 0
result.archivedRecords ?? 0
result.duplicateRecords ?? 0
```

For failed vehicles, it reports:

``` js
result.failedVehicles?.length ?? 0
```

Therefore, missing result fields do not cause the success logging itself
to fail.

------------------------------------------------------------------------

# 13. Successful processDay() Response

On successful completion, the worker returns:

``` json
{
  "status": "COMPLETED",
  "processingDate": "YYYY-MM-DD",
  "result": {}
}
```

The complete result returned by:

``` js
archiveDate()
```

is preserved under:

``` text
result
```

------------------------------------------------------------------------

# 14. Archive Failure Handling

The archive operation is wrapped in:

``` text
try / catch
```

If `archiveDate()` throws an error, the worker:

1.  Logs the archive failure.
2.  Logs the processing date.
3.  Logs the error message.
4.  Returns a failure object.

The error is therefore handled by the worker rather than being
re-thrown.

------------------------------------------------------------------------

# 15. Failed processDay() Response

When the archive operation fails, the service returns:

``` json
{
  "status": "FAILED",
  "processingDate": "YYYY-MM-DD",
  "error": "..."
}
```

The error field contains:

``` text
error.message
```

------------------------------------------------------------------------

# 16. Logging

The worker provides console logging for both successful and failed
archive executions.

The success output includes:

``` text
SEWAC DAILY HISTORICAL ARCHIVE WORKER
Archive target
Mode
Date
Vehicles archived
Records inserted
Duplicates
Failed vehicles
```

The failure output includes:

``` text
DAILY HISTORICAL ARCHIVE FAILED
Date
Error
```

------------------------------------------------------------------------

# 17. Date Processing Flow

The date-processing sequence is:

``` text
processDay(processingDate)
        ↓
Is processingDate supplied?
        ↓
   ┌────┴────┐
   │         │
  YES        NO
   │         │
new Date()  getToday()
   │         │
   └────┬────┘
        ↓
Validate Date
        ↓
formatDate()
        ↓
YYYY-MM-DD
        ↓
archiveDate()
```

------------------------------------------------------------------------

# 18. Architecture

``` text
Scheduler
    ↓
citizenHistoricalDailyWorker
    │
    └── processDay()
            ↓
       formatDate()
            ↓
       archiveDate()
            ↓
historicalDatabase.controller
            ↓
Historical Archive Pipeline
```

The worker acts as a lightweight trigger and reporting layer rather than
implementing a second archival system.

------------------------------------------------------------------------

# 19. Exported Functions

The service exports:

``` text
processDay
getToday
formatDate
```

There are no additional internal helper functions in this service.

------------------------------------------------------------------------

# 20. Summary

`citizenHistoricalDailyWorker.service.js` is a lightweight daily worker
responsible for triggering the existing historical telemetry archive.

It determines the processing date, validates and formats it as
`YYYY-MM-DD`, passes it to `archiveDate()`, logs the archive outcome,
and returns a structured success or failure response.

The worker intentionally does not duplicate historical processing, GPS
processing, boundary resolution, or ward lookup logic. Those
responsibilities remain outside this service.
