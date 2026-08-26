# heartbeatController.js Documentation

## 1. File Overview

The Heartbeat Controller records live vehicle heartbeat information.

The heartbeat request contains:

```text
Vehicle ID
Latitude
Longitude
```

The controller stores the heartbeat in a daily vehicle-specific heartbeat table and emits a Socket.IO live update after successful insertion.

---

# 2. recordHeartbeat()

The controller is:

```text
recordHeartbeat(req, res)
```

The vehicle identifier is read from:

```text
req.params.vehicleId
```

Coordinates are read from:

```text
req.query.latitude
req.query.longitude
```

---

# 3. Vehicle ID Validation

The vehicle ID is trimmed and converted to a string.

If it is empty, the controller returns:

```text
HTTP 400
```

with:

```json
{
  "success": false,
  "message": "Vehicle ID is required."
}
```

---

# 4. Latitude Validation

Latitude must be:

```text
finite
>= -90
<= 90
```

Invalid latitude returns:

```text
HTTP 400
```

with:

```text
Valid latitude is required.
```

---

# 5. Longitude Validation

Longitude must be:

```text
finite
>= -180
<= 180
```

Invalid longitude returns:

```text
HTTP 400
```

with:

```text
Valid longitude is required.
```

---

# 6. Vehicle Master Validation

The controller calls:

```text
metadataManager.getVehicleWard(vehicleId)
```

This validates the vehicle against the vehicle metadata and obtains its ward number.

---

# 7. Heartbeat Table

The controller generates the daily heartbeat table using:

```text
metadataManager.getHeartbeatTableName(
  vehicleId,
  today
)
```

The current date is used.

---

# 8. Heartbeat Table Creation

The generated table is created using:

```text
queries.createHeartbeatTable(heartbeatTable)
```

through:

```text
telemetryDb.$executeRawUnsafe()
```

---

# 9. Heartbeat Insertion

The heartbeat is inserted using:

```text
queries.insertHeartbeat(heartbeatTable)
```

with:

```text
latitude
longitude
```

The inserted record is taken from:

```text
result[0]
```

---

# 10. Socket.IO Live Update

After successful database insertion, the controller retrieves:

```text
req.app.get("io")
```

If Socket.IO is available, it emits:

```text
vehicle:heartbeat
```

The event contains:

```text
vehicleId
vehicleNumber
wardNo
latitude
longitude
timestamp
heartbeatTable
```

The socket event is deliberately emitted only after successful persistence.

---

# 11. Successful Response

The controller returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "status": "RECORDED",
  "message": "Vehicle heartbeat recorded successfully.",
  "vehicleId": "...",
  "wardNo": "...",
  "heartbeatTable": "...",
  "data": {
    "id": "...",
    "latitude": "...",
    "longitude": "...",
    "created_at": "..."
  }
}
```

The database ID is converted to a string.

---

# 12. Unregistered Vehicle

If the underlying error has:

```text
error.code === "UNREGISTERED_VEHICLE"
```

the controller returns:

```text
HTTP 404
```

with:

```json
{
  "success": false,
  "status": "FAILED",
  "message": "...",
  "vehicleId": "..."
}
```

---

# 13. General Error Handling

Other errors are logged and return:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "status": "FAILED",
  "message": "..."
}
```

---

# 14. Complete Flow

```text
Heartbeat Request
      ↓
Validate Vehicle ID
      ↓
Validate Latitude
      ↓
Validate Longitude
      ↓
Get Vehicle Ward
      ↓
Generate Daily Heartbeat Table
      ↓
Create Table
      ↓
Insert Heartbeat
      ↓
Emit vehicle:heartbeat
      ↓
Return 200
```

---

# 15. Exports

The controller exports:

```text
recordHeartbeat
```

---

# 16. Summary

`heartbeatController.js` records vehicle GPS heartbeat data in the telemetry database, validates the vehicle and coordinates, creates the appropriate daily heartbeat table, persists the heartbeat, broadcasts the successful heartbeat through Socket.IO, and returns structured success or failure responses.
