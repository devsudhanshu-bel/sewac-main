# citizenHistorical.scheduler.js Documentation

## 1. File Overview

**File:** `citizenHistorical.scheduler.js`

The Citizen Historical Scheduler controls the automatic processing of
the previous day's telemetry.

Its responsibility is limited to:

``` text
WHEN processing should start
```

The actual historical processing is delegated to:

``` text
citizenHistoricalDailyWorker.processDay()
```

------------------------------------------------------------------------

# 2. Scheduler State

The scheduler maintains:

``` text
timer
isRunning
lastRun
lastResult
```

These values track:

  State          Purpose
  -------------- -------------------------------------
  `timer`        Stores the interval timer
  `isRunning`    Prevents concurrent processing
  `lastRun`      Records the latest execution time
  `lastResult`   Stores the latest processing result

------------------------------------------------------------------------

# 3. getPreviousDay()

The method:

``` text
getPreviousDay(date)
```

returns the date immediately before the supplied date.

If no date is supplied:

``` text
new Date()
```

is used.

Example:

``` text
August 10
   ↓
August 9
```

------------------------------------------------------------------------

# 4. formatDate()

The method:

``` text
formatDate(date)
```

converts a JavaScript Date into:

``` text
YYYY-MM-DD
```

Example:

``` text
2026-08-09
```

The method pads month and day values to two digits.

------------------------------------------------------------------------

# 5. run()

The main processing method is:

``` text
run(processingDate)
```

It starts historical processing for:

``` text
processingDate
```

or, when no date is supplied:

``` text
previous day
```

------------------------------------------------------------------------

# 6. Concurrent Processing Protection

Before processing begins, the scheduler checks:

``` text
isRunning
```

If processing is already running, it returns:

``` json
{
  "started": false,
  "reason": "ALREADY_RUNNING"
}
```

This prevents simultaneous historical processing executions.

------------------------------------------------------------------------

# 7. Processing Date

When `processingDate` is provided:

``` text
processingDate
      ↓
new Date(processingDate)
```

When it is not provided:

``` text
getPreviousDay()
```

is used.

The resulting date is formatted as:

``` text
YYYY-MM-DD
```

------------------------------------------------------------------------

# 8. Historical Worker

The scheduler delegates actual processing to:

``` text
citizenHistoricalDailyWorker.processDay(date)
```

The scheduler itself does not implement:

``` text
Telemetry processing
Historical table creation
Historical data movement
```

It only triggers the worker.

------------------------------------------------------------------------

# 9. Successful Processing

After the worker completes successfully:

``` text
lastRun
```

is updated.

The returned worker result is stored in:

``` text
lastResult
```

The method returns:

``` text
started: true
processingDate
result
```

------------------------------------------------------------------------

# 10. Processing Failure

If the worker throws an error:

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
started: true
processingDate
error
```

The scheduler then resets:

``` text
isRunning = false
```

through the `finally` block.

------------------------------------------------------------------------

# 11. start()

The method:

``` text
start()
```

starts the automatic scheduler.

If the scheduler has already been started:

``` text
timer
```

is already present and no second timer is created.

------------------------------------------------------------------------

# 12. Automatic Processing Time

The scheduler checks for:

``` text
00:05
```

every day.

The scheduler checks the current time every:

``` text
60 seconds
```

Therefore:

``` text
Every minute
      ↓
Check current hour/minute
      ↓
00:05?
      ↓
Run historical processing
```

------------------------------------------------------------------------

# 13. Immediate Schedule Check

When `start()` is called, the scheduler immediately executes:

``` text
checkSchedule()
```

before creating the interval.

This allows the scheduler to detect a matching scheduled time
immediately.

------------------------------------------------------------------------

# 14. checkSchedule()

The method:

``` text
checkSchedule()
```

reads:

``` text
hour
minute
```

from the current system time.

Processing starts only when:

``` text
hour === 0
minute === 5
```

Otherwise the method returns without processing.

------------------------------------------------------------------------

# 15. Duplicate Execution Prevention

The scheduler creates:

``` text
todayKey
```

from the current date.

It compares this with the date of:

``` text
lastRun
```

If both dates match, the scheduler returns without executing again.

This prevents repeated processing during the same scheduled day.

------------------------------------------------------------------------

# 16. stop()

The method:

``` text
stop()
```

clears the interval timer using:

``` text
clearInterval()
```

and resets:

``` text
timer = null
```

If no timer exists, the method simply returns.

------------------------------------------------------------------------

# 17. getStatus()

The method returns:

``` text
schedulerRunning
processingRunning
lastRun
lastResult
```

This provides the current scheduler and processing state.

------------------------------------------------------------------------

# 18. Complete Scheduler Flow

``` text
start()
  ↓
checkSchedule()
  ↓
Check current hour/minute
  ↓
00:05?
  ↓
Check lastRun
  ↓
Already executed today?
  ├── Yes → Return
  └── No
        ↓
      run()
        ↓
getPreviousDay()
        ↓
formatDate()
        ↓
citizenHistoricalDailyWorker.processDay()
        ↓
Store result
        ↓
Reset isRunning
```

------------------------------------------------------------------------

# 19. Responsibility Boundary

The scheduler is responsible for:

``` text
Scheduling
Date selection
Duplicate-run prevention
Execution state
Worker invocation
Result tracking
```

The scheduler is not responsible for the historical processing logic
itself.

That logic belongs to:

``` text
citizenHistoricalDailyWorker
```

------------------------------------------------------------------------

# 20. Export

The file exports a single scheduler instance:

``` text
new CitizenHistoricalScheduler()
```

This allows the application to use the same scheduler state throughout
the application lifecycle.

------------------------------------------------------------------------

# 21. Summary

`citizenHistorical.scheduler.js` provides the automatic scheduler for
daily citizen historical processing.

Its default behavior is:

``` text
Every day at 00:05
        ↓
Determine previous day
        ↓
Run citizenHistoricalDailyWorker.processDay()
        ↓
Store execution result
```

It also prevents concurrent and duplicate daily executions while
exposing scheduler status through `getStatus()`.
