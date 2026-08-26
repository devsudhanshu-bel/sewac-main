# citizenHistoricalDailyWorker.service.js Documentation

## 1. File Overview

**File:** `citizenHistoricalDailyWorker.service(1).js`

The Citizen Historical Daily Worker is the production processing engine for daily historical telemetry.

Its processing flow is:

```text
Day Table
   ↓
Vehicles
   ↓
Telemetry Records
   ↓
Processing State
   ↓
Historical Processor
   ↓
PROCESSED / FAILED
   ↓
Job Statistics
```

---

# 2. processDay()

The main method is:

```text
processDay(processingDate)
```

It obtains or creates a processing job for the supplied date.

---

# 3. Processing Job

The worker calls:

```text
historicalProcessingManager.getOrCreateJob(processingDate)
```

The job is then used to track:

```text
processing state
vehicle count
total records
processed records
failed records
skipped records
```

---

# 4. Completed Job Protection

If the job status is:

```text
COMPLETED
```

the worker immediately returns the existing job.

No additional telemetry processing occurs.

---

# 5. Start Job

For a new or incomplete job, the worker calls:

```text
startJob(job.job_id)
```

This marks the processing job as active.

---

# 6. Day Snapshot

The worker retrieves the day's telemetry snapshot through:

```text
telemetryDailyRepository.getDaySnapshot(processingDate)
```

The snapshot provides:

```text
dayTableName
dayTableExists
vehicles
```

---

# 7. Missing Day Table

If:

```text
dayTableExists === false
```

the worker:

```text
completes the job
returns the job summary
```

No telemetry records are processed.

---

# 8. Vehicle Discovery

The worker obtains:

```text
snapshot.vehicles
```

and updates the processing job with:

```text
vehicle count
```

---

# 9. Vehicle Processing

Each vehicle is processed individually.

The worker logs:

```text
vehicle_number
vehicle_table_name
```

---

# 10. Vehicle Table Validation

Before reading telemetry, the worker calls:

```text
vehicleTableExists(
  vehicle.vehicle_table_name
)
```

If the vehicle table does not exist:

```text
warning is logged
vehicle is skipped
```

Processing continues with the next vehicle.

---

# 11. Vehicle Record Count

For an existing vehicle table, the worker retrieves:

```text
getTelemetryCount(vehicle.vehicle_table_name)
```

The count is added to:

```text
totalRecords
```

---

# 12. Telemetry Retrieval

The worker reads telemetry records using:

```text
getTelemetryRecords(
  vehicle.vehicle_table_name
)
```

Each returned record is processed individually.

---

# 13. processTelemetryRecord()

The method:

```text
processTelemetryRecord(
  job,
  vehicle,
  telemetry,
  processingDate
)
```

handles a single telemetry record.

---

# 14. Processing Record Registration

The telemetry ID is:

```text
telemetry.id
```

The worker registers it through:

```text
historicalProcessingManager.registerRecord()
```

using:

```text
job_id
vehicle_table_name
telemetryId
```

---

# 15. Already Processed Records

If the processing record status is:

```text
PROCESSED
```

the worker:

```text
increments skipped count
returns SKIPPED
```

No duplicate historical processing occurs.

---

# 16. Start Record

For a record that requires processing:

```text
startRecord(processing_record_id)
```

marks the processing record as active.

---

# 17. Historical Processing

The actual historical transformation is delegated to:

```text
citizenHistoricalProcessor.processRecord(
  telemetry,
  processingDate
)
```

The worker does not implement the transformation itself.

---

# 18. Historical Table Detection

After successful processing, the worker attempts to identify the resulting historical table using:

```text
monthlyTableName
historicalTableName
tableName
```

in that priority order.

The selected value is passed to:

```text
completeRecord()
```

---

# 19. Successful Record Processing

After successful historical processing:

```text
completeRecord()
incrementProcessed()
```

are called.

The worker returns:

```json
{
  "status": "PROCESSED",
  "telemetryId": "...",
  "result": "..."
}
```

---

# 20. Failed Record Processing

If processing throws an error:

```text
failRecord()
incrementFailed()
```

are called.

The worker returns:

```json
{
  "status": "FAILED",
  "telemetryId": "...",
  "error": "..."
}
```

The failed record does not terminate processing of the remaining records.

---

# 21. Job Heartbeat

After each vehicle is processed, the worker calls:

```text
historicalProcessingManager.heartbeat(
  job.job_id
)
```

This keeps the processing job alive and records activity.

---

# 22. Total Record Update

After all vehicles are processed:

```text
updateTotalRecords(
  job.job_id,
  totalRecords
)
```

updates the total source-record count.

---

# 23. Completion Decision

The final job summary is inspected.

If:

```text
failed_records > 0
```

the job is marked:

```text
FAILED
```

Otherwise it is marked:

```text
COMPLETED
```

---

# 24. Final Result

The worker retrieves the final job summary using:

```text
getJobSummary(job.job_id)
```

and returns it.

---

# 25. safeStringify()

The helper:

```text
safeStringify(value)
```

serializes objects while converting:

```text
BigInt → String
```

It uses indentation of:

```text
2 spaces
```

for readable logging.

---

# 26. Complete Worker Flow

```text
processDay()
    ↓
Get/Create Job
    ↓
Completed?
 ├── Yes → Return existing job
 └── No
      ↓
   startJob()
      ↓
   getDaySnapshot()
      ↓
   Day table exists?
   ├── No → Complete job
   └── Yes
        ↓
     Discover vehicles
        ↓
     For each vehicle
        ↓
     Check vehicle table
        ↓
     Count telemetry
        ↓
     Read telemetry
        ↓
     Process each record
        ↓
     Heartbeat
        ↓
     Update total
        ↓
     Check failures
        ↓
  COMPLETE / FAILED
        ↓
   Final job summary
```

---

# 27. Responsibility Boundary

The worker is responsible for:

```text
Daily job orchestration
Vehicle discovery
Telemetry iteration
Processing-state management
Delegating record transformation
Success/failure tracking
Job statistics
```

The actual record transformation belongs to:

```text
citizenHistoricalProcessor
```

---

# 28. Summary

`citizenHistoricalDailyWorker.service.js` is the production orchestration engine for daily historical telemetry processing. It creates and manages processing jobs, discovers vehicles, reads telemetry, prevents already-processed records from being reprocessed, delegates each record to the historical processor, records success/failure state, updates job statistics, and determines the final job status.
