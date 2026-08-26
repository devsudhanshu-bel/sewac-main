# masterCitizenSync.job.js Documentation

## 1. File Overview

**File:** `masterCitizenSync.job.js`

The Master Citizen Sync Job provides the automatic weekly scheduler for synchronizing citizen data.

It delegates the actual synchronization work to:

```text
masterCitizenSync.service
```

The job is responsible for:

```text
Scheduling
Overlap prevention
Sync execution
Execution logging
Result reporting
Error handling
```

---

# 2. Scheduler Library

The job uses:

```text
node-cron
```

to schedule the weekly synchronization.

---

# 3. Sync Service

The actual synchronization operation is delegated to:

```text
service.syncAllCitizens()
```

The job does not implement the citizen synchronization logic itself.

---

# 4. Schedule

The configured cron expression is:

```text
0 2 * * 0
```

This means:

```text
Every Sunday
at 2:00 AM
```

The scheduler explicitly uses:

```text
Asia/Kolkata
```

as its timezone.

Therefore the scheduled execution time is:

```text
Every Sunday at 2:00 AM IST
```

---

# 5. syncRunning State

The job maintains:

```text
syncRunning
```

as an in-memory boolean flag.

Initial state:

```text
false
```

It is used to prevent multiple synchronization operations from running simultaneously.

---

# 6. Overlapping Sync Prevention

Before starting a scheduled sync, the job checks:

```text
syncRunning
```

If it is already:

```text
true
```

the scheduled execution is skipped.

The job logs:

```text
Master Citizen sync already running. Skipping this scheduled run.
```

This prevents overlapping weekly synchronization jobs.

---

# 7. Starting the Sync

When no sync is currently running:

```text
syncRunning = true
```

is set before the service is called.

The start time is recorded using:

```text
Date.now()
```

This is later used to calculate the total execution duration.

---

# 8. Sync Execution

The job calls:

```text
service.syncAllCitizens()
```

and waits for the asynchronous operation to complete.

The result is stored in:

```text
result
```

---

# 9. Successful Sync Result

After successful synchronization, the job logs the following result information:

```text
sourceRecords
processed
insertedOrUpdated
unmatchedWard
failed
batches
durationMs
```

It also calculates an additional total duration using:

```text
Date.now() - startedAt
```

---

# 10. Sync Statistics

The reported statistics represent:

| Field | Purpose |
|---|---|
| `sourceRecords` | Number of source records handled by the sync |
| `processed` | Number of processed records |
| `insertedOrUpdated` | Number of inserted or updated records |
| `unmatchedWard` | Records that could not be matched to a ward |
| `failed` | Failed records |
| `batches` | Number of synchronization batches |
| `durationMs` | Duration reported by the sync service |

The exact calculation of these values is performed by:

```text
masterCitizenSync.service
```

---

# 11. Start Time Logging

When execution begins, the job logs:

```text
new Date().toISOString()
```

This records the execution start timestamp in ISO format.

---

# 12. Failure Handling

If:

```text
service.syncAllCitizens()
```

throws an error, the job catches it.

It logs:

```text
AUTOMATIC MASTER CITIZEN WEEKLY SYNC FAILED
```

along with the error object.

The scheduler itself does not rethrow the error.

---

# 13. finally Block

Whether synchronization:

```text
succeeds
```

or:

```text
fails
```

the job executes:

```text
syncRunning = false
```

inside the `finally` block.

This allows the next scheduled weekly execution to run normally.

---

# 14. startMasterCitizenWeeklySync()

The exported function:

```text
startMasterCitizenWeeklySync()
```

starts the weekly scheduler.

It logs:

```text
MASTER CITIZEN WEEKLY SYNC SCHEDULER STARTED
Schedule: Every Sunday at 2:00 AM IST
```

---

# 15. Cron Registration

The scheduler is registered using:

```text
cron.schedule()
```

with:

```text
0 2 * * 0
```

and:

```text
{
  timezone: "Asia/Kolkata"
}
```

---

# 16. Complete Scheduler Flow

```text
Application Starts
        ↓
startMasterCitizenWeeklySync()
        ↓
Register node-cron schedule
        ↓
Every Sunday at 02:00 IST
        ↓
Check syncRunning
        ↓
Already running?
   ├── Yes → Skip execution
   └── No
        ↓
syncRunning = true
        ↓
Record start time
        ↓
service.syncAllCitizens()
        ↓
+----------------------+
|                      |
Success              Error
|                      |
↓                      ↓
Log statistics       Log failure
|                      |
+----------+-----------+
           ↓
syncRunning = false
```

---

# 17. Responsibility Boundary

The job is responsible for:

```text
Weekly scheduling
Timezone configuration
Concurrent execution prevention
Execution timing
Logging
Service invocation
Failure handling
```

The job is not responsible for:

```text
Citizen retrieval
Ward mapping
Citizen database updates
Batch processing logic
```

Those operations belong to:

```text
masterCitizenSync.service
```

---

# 18. Export

The file exports:

```text
startMasterCitizenWeeklySync
```

This function must be called by the application startup/bootstrap process to register the scheduled job.

---

# 19. Summary

`masterCitizenSync.job.js` provides the automated weekly scheduler for Master Citizen synchronization.

Its configured behavior is:

```text
Every Sunday at 2:00 AM IST
        ↓
Check for existing sync
        ↓
Prevent overlap
        ↓
Run syncAllCitizens()
        ↓
Log synchronization statistics
        ↓
Reset running state
```

The scheduling layer remains separate from the actual synchronization service, keeping scheduling and citizen-data processing responsibilities isolated.
