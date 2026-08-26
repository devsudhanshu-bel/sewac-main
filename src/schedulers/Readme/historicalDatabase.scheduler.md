# historicalDatabase.scheduler.js Documentation

## 1. File Overview

**File:** `historicalDatabase.scheduler.js`

The Historical Archive Scheduler controls automatic execution of the
historical database archive operation.

Its responsibility is:

``` text
Determine WHEN archival should execute
```

The actual archive operation is delegated to:

``` text
archiveDate
```

from:

``` text
citizenHistoricalArchive.controller
```

------------------------------------------------------------------------

# 2. Archive Configuration

The scheduler uses:

``` text
ARCHIVE_CONFIG
```

with:

``` text
archiveDate
targetHour
targetMinute
```

The default configuration is:

``` text
archiveDate = null
targetHour = 14
targetMinute = 0
```

Therefore the production schedule is:

``` text
Every day
   ↓
02:00 PM IST
   ↓
Archive TODAY
```

------------------------------------------------------------------------

# 3. Fixed Archive Date

When:

``` text
archiveDate
```

is not `null`, the scheduler uses that exact date.

Example:

``` text
archiveDate: "2026-08-14"
```

This forces the scheduler to archive:

``` text
2026-08-14
```

instead of automatically selecting today's date.

------------------------------------------------------------------------

# 4. Configuration Validation

The constructor calls:

``` text
validateConfiguration()
```

The scheduler validates:

``` text
targetHour
targetMinute
archiveDate
```

------------------------------------------------------------------------

# 5. Hour Validation

`targetHour` must be:

``` text
integer
0–23
```

Invalid values cause an error.

------------------------------------------------------------------------

# 6. Minute Validation

`targetMinute` must be:

``` text
integer
0–59
```

Invalid values cause an error.

------------------------------------------------------------------------

# 7. Fixed Date Validation

When `archiveDate` is not `null`, it must:

``` text
be a string
match YYYY-MM-DD
represent a valid date
```

Invalid values cause an error.

------------------------------------------------------------------------

# 8. getISTDateTime()

The method:

``` text
getISTDateTime()
```

uses:

``` text
Asia/Kolkata
```

to obtain the current date and time.

It returns:

``` text
date
year
month
day
hour
minute
second
```

The returned date uses:

``` text
YYYY-MM-DD
```

format.

------------------------------------------------------------------------

# 9. getArchiveDate()

The method:

``` text
getArchiveDate(ist)
```

determines which date should be archived.

When:

``` text
ARCHIVE_DATE
```

is configured:

``` text
Use fixed archive date
```

Otherwise:

``` text
Use current IST date
```

Therefore:

``` text
archiveDate = null
        ↓
TODAY in IST
```

------------------------------------------------------------------------

# 10. run()

The main archive method is:

``` text
run(archiveDateValue)
```

It prevents concurrent execution using:

``` text
isRunning
```

If an archive operation is already running, it returns:

``` json
{
  "started": false,
  "reason": "ALREADY_RUNNING"
}
```

------------------------------------------------------------------------

# 11. Archive Date Selection

The archive date is selected using:

``` text
archiveDateValue
```

or:

``` text
getArchiveDate()
```

Therefore an explicitly supplied date has priority over the
configured/default date.

------------------------------------------------------------------------

# 12. Controller Integration

The scheduler creates an Express-like request:

``` json
{
  "body": {
    "date": "YYYY-MM-DD"
  }
}
```

and passes it to:

``` text
archiveDate(req, res)
```

This allows the scheduler to reuse the same archive controller logic
used by the API.

------------------------------------------------------------------------

# 13. Express-Like Response

The scheduler creates a response object supporting:

``` text
status(code)
json(data)
```

The controller's resulting:

``` text
HTTP status
response data
```

are captured by the scheduler.

------------------------------------------------------------------------

# 14. Successful Archive

When the controller returns a successful HTTP status:

``` text
200–299
```

the scheduler logs:

``` text
Archive date
HTTP status
Source database
Source day table
Vehicles archived
Records inserted
Duplicate records
Failed vehicles
```

The complete controller response is stored in:

``` text
lastResult
```

------------------------------------------------------------------------

# 15. Archive Error Response

If the controller returns a non-success status, the scheduler records:

``` text
HTTP status
Response data
```

as an archive error.

The scheduler itself does not treat the controller response as a thrown
exception.

------------------------------------------------------------------------

# 16. Archive Failure

If the controller invocation itself throws an exception:

``` text
lastResult
```

is set to:

``` json
{
  "status": "FAILED",
  "error": "..."
}
```

The method returns:

``` text
started
processingDate
error
```

The processing state is then reset in:

``` text
finally
```

------------------------------------------------------------------------

# 17. start()

The method:

``` text
start()
```

starts the automatic archive scheduler.

If the scheduler has already been started:

``` text
timer
```

is present and another scheduler is not created.

------------------------------------------------------------------------

# 18. Automatic Schedule

The configured production schedule is:

``` text
14:00 IST
```

The scheduler checks the time every:

``` text
10 seconds
```

The flow is:

``` text
Every 10 seconds
      ↓
Read current IST time
      ↓
Hour = 14?
      ↓
Minute = 00?
      ↓
Run archive
```

------------------------------------------------------------------------

# 19. Immediate Schedule Check

When the scheduler starts, it immediately calls:

``` text
checkSchedule()
```

before establishing the recurring interval.

------------------------------------------------------------------------

# 20. checkSchedule()

The method checks:

``` text
now.hour
now.minute
```

against:

``` text
TARGET_HOUR
TARGET_MINUTE
```

If either value does not match, the method returns.

------------------------------------------------------------------------

# 21. Duplicate Execution Prevention

The scheduler stores:

``` text
lastRun
```

and compares its IST date with the current execution date.

If the scheduler has already run on the current day:

``` text
return
```

This prevents multiple archive executions during the same scheduled
minute because the scheduler checks every 10 seconds.

------------------------------------------------------------------------

# 22. stop()

The method:

``` text
stop()
```

clears the scheduler interval using:

``` text
clearInterval()
```

and sets:

``` text
timer = null
```

------------------------------------------------------------------------

# 23. getStatus()

The status method returns:

``` text
schedulerRunning
processingRunning
currentIST
scheduledTime
archiveTarget
timezone
lastRun
lastResult
```

The timezone is explicitly:

``` text
Asia/Kolkata
```

------------------------------------------------------------------------

# 24. Complete Scheduler Flow

``` text
start()
  ↓
checkSchedule()
  ↓
Read current IST time
  ↓
Target hour/minute reached?
  ↓
Check lastRun
  ↓
Already executed today?
  ├── Yes → Return
  └── No
        ↓
Determine archive date
        ↓
Build request body
        ↓
archiveDate(req, res)
        ↓
Capture HTTP status + response
        ↓
Store result
        ↓
Reset isRunning
```

------------------------------------------------------------------------

# 25. Archive Data Flow

The scheduler passes:

``` text
date
```

to the archive controller.

The controller response may contain:

``` text
sourceDatabase
sourceDayTable
archivedVehicles
archivedRecords
duplicateRecords
failedVehicles
```

The scheduler logs and stores these results.

------------------------------------------------------------------------

# 26. Responsibility Boundary

The scheduler is responsible for:

``` text
Schedule configuration
IST time handling
Archive date selection
Configuration validation
Duplicate-run prevention
Execution state
Controller invocation
Result tracking
```

The actual archival logic belongs to:

``` text
citizenHistoricalArchive.controller
```

------------------------------------------------------------------------

# 27. Export

The file exports a single instance:

``` text
new HistoricalArchiveScheduler()
```

This preserves scheduler state across the application.

------------------------------------------------------------------------

# 28. Summary

`historicalDatabase.scheduler.js` provides the automatic historical
database archival scheduler.

Its configured production behavior is:

``` text
Every day at 02:00 PM IST
        ↓
Determine today's archive date
        ↓
Call archiveDate()
        ↓
Archive historical data
        ↓
Capture archive result
```

It uses a 10-second schedule check, explicitly handles IST through
`Asia/Kolkata`, prevents concurrent and duplicate daily executions, and
exposes the current scheduler state through `getStatus()`.
