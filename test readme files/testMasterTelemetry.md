# testMasterTelemetry.js Documentation

## 1. File Overview

This file is a direct telemetry pipeline test.

It initializes the telemetry database and sends one test telemetry record through:

```text
TelemetryPipelineService
```

---

# 2. Environment Initialization

The script first loads the application environment configuration.

It then imports:

```text
initializeTelemetryDB
telemetryPipelineService
```

---

# 3. Telemetry Database Initialization

Before processing the test record, the script executes:

```text
initializeTelemetryDB.initialize()
```

This ensures the telemetry database initialization process runs before the pipeline test.

---

# 4. Telemetry Pipeline

The test calls:

```text
telemetryPipelineService.process()
```

with a complete telemetry object.

---

# 5. Timestamp Data

The test supplies:

```text
iotTimestamp
receivedTimestamp
```

Both are generated from the current date/time.

---

# 6. Citizen and RFID Data

The test record includes:

```text
rfidEpc
citizenId
citizenContact
```

The configured test values identify a specific RFID/citizen combination.

---

# 7. Waste Data

The test provides:

```text
wasteType = WET
wetWeight = 5
dryWeight = 2
otherWeight = 0
cumulativeWeight = 7
```

---

# 8. GPS Data

The test supplies latitude and longitude values representing the test location.

---

# 9. Vehicle Data

The test vehicle fields are:

```text
vehicleNumber
driverName
unitNumber
firmwareVersion
```

---

# 10. Collection Data

The collection fields include:

```text
collectionType = Door
remarks = OK
errorCode = null
driverAction = Collected
```

---

# 11. Success Handling

When the pipeline completes successfully, the script prints:

```text
TEST PASSED
```

---

# 12. Failure Handling

If an exception occurs, the script prints:

```text
TEST FAILED
```

and logs the error.

---

# 13. Cleanup

The script terminates through:

```text
process.exit()
```

inside the `finally` block.

---

# 14. Execution Flow

```text
Load Environment
      ↓
Initialize Telemetry DB
      ↓
Build Test Telemetry
      ↓
TelemetryPipelineService.process()
      ↓
TEST PASSED / TEST FAILED
      ↓
Exit
```

---

# 15. Summary

`testMasterTelemetry.js` is a standalone integration-style test for the telemetry pipeline. It initializes telemetry database infrastructure, submits one representative telemetry record containing timestamps, RFID/citizen, waste, GPS, vehicle, and collection information, reports pass/fail status, and terminates after execution.
