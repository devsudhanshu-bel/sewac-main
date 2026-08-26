# telemetryController.js Documentation

## 1. File Overview

The Telemetry Controller accepts incoming vehicle telemetry and places validated telemetry jobs into the Redis scheduler queue.

Its flow is:

```text
HTTP Telemetry Request
        ↓
Validate Payload
        ↓
Citizen RFID Validation
        ↓
Create Scheduler Job
        ↓
Redis telemetry_queue
```

---

# 2. recordTelemetry()

The method reads telemetry values from:

```text
req.query
```

The supported fields are:

```text
rfidNumber
iotTimestamp
driverName
vehicleId
latitude
longitude
weight
firmwareVersion
unitNumber
remarks
errCode
```

---

# 3. Manual Telemetry Mode

A request is considered manual when:

```text
remarks === ""
```

and:

```text
rfidNumber starts with "E"
```

and:

```text
unitNumber === "SEWAC_01_UHF"
```

---

# 4. Automatic Telemetry Mode

A request is considered automatic when:

```text
remarks === "O"
```

and:

```text
rfidNumber does not start with "E"
```

and:

```text
unitNumber === "SEWAC_01_HF"
```

---

# 5. Payload Validation

A request is accepted only if it matches either:

```text
Manual Mode
```

or:

```text
Automatic Mode
```

Otherwise the controller returns:

```text
HTTP 400
```

with:

```text
Invalid telemetry payload. Check RFID format, unitNumber and remarks.
```

---

# 6. Required Fields

The controller requires:

```text
iotTimestamp
vehicleId
```

If either is missing:

```text
HTTP 400
```

with:

```text
Missing required telemetry fields
```

---

# 7. Manual RFID Validation

For non-automatic telemetry:

```text
rfidNumber
```

must start with:

```text
E
```

If not:

```text
HTTP 400
```

with:

```text
Valid UHF RFID is required for citizen collection.
```

---

# 8. Citizen RFID Cache Validation

Manual citizen telemetry must also exist in:

```text
citizenCache
```

If the RFID is not registered:

```text
HTTP 404
```

with:

```text
RFID not registered.
```

---

# 9. Telemetry Payload

After validation, the controller builds:

```text
rfidNumber
iotTimestamp
driverName
vehicleId
latitude
longitude
weight
firmwareVersion
unitNumber
remarks
errCode
```

---

# 10. Scheduler Job Creation

Every accepted HTTP request becomes a unique scheduler job.

The job structure is:

```json
{
  "queueId": "...",
  "payload": "..."
}
```

The queue ID is generated using:

```text
randomUUID()
```

---

# 11. Redis Queue

The job is pushed into:

```text
telemetry_queue
```

using:

```text
redisClient.lPush()
```

The current queue length is then obtained with:

```text
redisClient.lLen()
```

---

# 12. Successful Response

A successful request returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "status": "QUEUED",
  "message": "Telemetry accepted and queued successfully.",
  "queueLength": 0,
  "queueId": "...",
  "queuedTelemetry": "...",
  "cacheLookup": "..."
}
```

For automatic telemetry:

```text
cacheLookup = null
```

For manual telemetry, it reflects the citizen-cache lookup result.

---

# 13. Error Handling

Unexpected errors are logged and return:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

---

# 14. Complete Flow

```text
Incoming Telemetry
      ↓
Determine Manual / Automatic
      ↓
Validate Required Fields
      ↓
Manual?
 ├── Yes → Validate UHF RFID
 │          ↓
 │       Check citizenCache
 └── No
      ↓
Create UUID Job
      ↓
LPUSH telemetry_queue
      ↓
Read Queue Length
      ↓
Return QUEUED
```

---

# 15. Export

The controller exports:

```text
recordTelemetry
```

---

# 16. Summary

`telemetryController.js` is the telemetry ingestion controller. It validates manual and automatic telemetry modes, verifies citizen RFIDs for manual collection, creates a unique scheduler job for every accepted request, pushes the job into Redis `telemetry_queue`, and returns queue information to the client.
