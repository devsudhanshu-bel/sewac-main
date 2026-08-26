# HistoricalProcessingManager.js Documentation

## 1. File Overview

The Historical Processing Manager maintains processing metadata for the daily citizen historical pipeline.

It is responsible for:

```text
Processing date management
Historical processing jobs
Processing records
Retry handling
Heartbeat tracking
Progress counters
Failure tracking
Resume support
Duplicate prevention
```

It does not store telemetry data itself.

---

# 2. Processing Metadata

The manager maintains metadata describing:

```text
Which date is being processed
Whether processing is running
How many records exist
How many records were processed
How many records failed
How many records were skipped
Which individual telemetry records have been processed
```

---

# 3. normalizeProcessingDate()

Normalizes the processing date.

Supported inputs include:

```text
YYYY-MM-DD strings
Other parseable date strings
JavaScript Date objects
```

An invalid value throws an error.

For an already formatted:

```text
YYYY-MM-DD
```

string, the value is returned directly.

---

# 4. formatDate()

Converts a JavaScript Date into:

```text
YYYY-MM-DD
```

The method extracts:

```text
year
month
day
```

and pads month/day values to two digits.

---

# 5. initialize()

Creates the historical processing metadata tables if they do not already exist.

The tables are:

```text
historical_processing_jobs
historical_processing_records
```

---

# 6. historical_processing_jobs

The processing job table stores:

```text
job_id
processing_date
status
started_at
completed_at
last_heartbeat_at
total_vehicles
total_records
processed_records
failed_records
skipped_records
created_at
updated_at
```

---

# 7. Job Date Uniqueness

Each processing date is unique through:

```text
historical_processing_jobs_date_unique
```

Therefore only one processing job can exist for a given date.

---

# 8. historical_processing_records

Stores record-level processing metadata:

```text
processing_record_id
job_id
vehicle_table_name
telemetry_id
status
attempts
started_at
processed_at
failed_at
error_message
historical_table_name
created_at
updated_at
```

---

# 9. Record Uniqueness

Each telemetry record is uniquely identified within a job using:

```text
job_id
vehicle_table_name
telemetry_id
```

This prevents duplicate registration of the same source telemetry record.

---

# 10. Foreign Key

Each processing record references:

```text
historical_processing_jobs(job_id)
```

with:

```text
ON DELETE CASCADE
```

Deleting a job therefore removes its associated processing records.

---

# 11. Indexes

The manager creates indexes for:

```text
historical_processing_jobs.status
historical_processing_records.job_id
historical_processing_records.status
historical_processing_records.vehicle_table_name
```

These support job/status and vehicle-oriented lookups.

---

# 12. getJobByDate()

Retrieves the processing job for a normalized date.

Returns:

```text
job object
```

or:

```text
null
```

when no job exists.

---

# 13. createJob()

Creates a new processing job with:

```text
status = PENDING
```

The date is normalized before insertion.

The operation uses:

```text
ON CONFLICT (processing_date) DO NOTHING
```

If another process already created the job, the existing job is retrieved and returned.

---

# 14. resetFailedJobForRetry()

Resets a failed historical job for another attempt.

The job is changed to:

```text
PENDING
```

and aggregate counters are reset.

The manager does not:

```text
delete the job
delete historical telemetry
delete successfully processed records
```

---

# 15. Failed Record Retry

Records with:

```text
FAILED
PROCESSING
```

are reset to:

```text
PENDING
```

Their previous:

```text
attempts
```

count is intentionally preserved.

---

# 16. getJobById()

Retrieves a processing job using:

```text
job_id
```

Returns:

```text
job
```

or:

```text
null
```

---

# 17. getOrCreateJob()

Provides the main job lifecycle lookup.

Behavior:

```text
No Job
  ↓
Create PENDING Job
```

```text
COMPLETED
  ↓
Return Existing Job
```

```text
FAILED
  ↓
Reset for Retry
```

```text
RUNNING
  ↓
Return Existing Job
```

```text
PENDING
  ↓
Return Existing Job
```

---

# 18. startJob()

Changes the job status to:

```text
RUNNING
```

It also sets:

```text
started_at
last_heartbeat_at
updated_at
```

The original `started_at` is preserved when already populated.

---

# 19. heartbeat()

Updates:

```text
last_heartbeat_at
updated_at
```

This allows workers to demonstrate that processing is still active.

---

# 20. updateVehicleCount()

Updates:

```text
total_vehicles
```

for a job.

---

# 21. updateTotalRecords()

Updates:

```text
total_records
```

for a job.

---

# 22. completeJob()

Changes the job status to:

```text
COMPLETED
```

and records:

```text
completed_at
last_heartbeat_at
updated_at
```

---

# 23. failJob()

Changes the job status to:

```text
FAILED
```

and updates:

```text
last_heartbeat_at
updated_at
```

`completed_at` is cleared.

---

# 24. incrementProcessed()

Increments:

```text
processed_records
```

by:

```text
1
```

---

# 25. incrementFailed()

Increments:

```text
failed_records
```

by:

```text
1
```

---

# 26. incrementSkipped()

Increments:

```text
skipped_records
```

by:

```text
1
```

---

# 27. registerRecord()

Registers an individual telemetry record.

The identifying fields are:

```text
jobId
vehicleTableName
telemetryId
```

The initial status is:

```text
PENDING
```

Duplicate registration is prevented using:

```text
ON CONFLICT DO NOTHING
```

If the record already exists, the existing record is retrieved.

---

# 28. getRecord()

Retrieves a processing record using:

```text
jobId
vehicleTableName
telemetryId
```

Returns:

```text
record
```

or:

```text
null
```

---

# 29. startRecord()

Changes an individual record to:

```text
PROCESSING
```

and increments:

```text
attempts
```

It also sets:

```text
started_at
```

and clears previous failure information.

---

# 30. completeRecord()

Changes the record status to:

```text
PROCESSED
```

and records:

```text
processed_at
historical_table_name
```

Previous failure information is cleared.

---

# 31. failRecord()

Changes the record status to:

```text
FAILED
```

and stores:

```text
failed_at
error_message
```

---

# 32. getPendingRecords()

Retrieves records whose status is:

```text
PENDING
FAILED
```

The default limit is:

```text
100
```

The maximum limit is:

```text
1000
```

Records are ordered by:

```text
processing_record_id ASC
```

---

# 33. getJobSummary()

Returns the main processing metadata for a job:

```text
job_id
processing_date
status
total_vehicles
total_records
processed_records
failed_records
skipped_records
started_at
completed_at
last_heartbeat_at
created_at
updated_at
```

---

# 34. Job Lifecycle

```text
No Job
  ↓
PENDING
  ↓
RUNNING
  ↓
COMPLETED
```

Failure path:

```text
RUNNING
  ↓
FAILED
  ↓
PENDING
  ↓
RUNNING
  ↓
COMPLETED
```

Successfully processed records remain:

```text
PROCESSED
```

during retries.

---

# 35. Export

The module exports a single instantiated:

```text
HistoricalProcessingManager
```

---

# 36. Summary

`HistoricalProcessingManager.js` provides the state-management layer for historical processing. It creates and maintains processing jobs and individual telemetry-processing records, tracks progress and failures, provides heartbeats, prevents duplicate registration, supports retry/resume behavior, and preserves successfully processed records across failed-job retries.
