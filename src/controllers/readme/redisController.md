# redisController.js Documentation

## 1. File Overview

The Redis Controller provides operational APIs for monitoring and managing telemetry scheduler queues.

It interacts with:

```text
Redis
VehicleProcessorManager
```

The available operations are:

```text
Telemetry Queue Status
Vehicle Processor Status
Flush Telemetry Queues
```

---

# 2. getTelemetryQueueStatus()

Retrieves the current queue sizes.

The Redis producer client is obtained through:

```text
getProducerClient()
```

---

# 3. Redis Queue Metrics

The controller reads:

```text
telemetry_queue
```

using:

```text
redis.lLen()
```

It also reads:

```text
telemetry_processing_queue
```

using:

```text
redis.lLen()
```

---

# 4. Vehicle Queue Metrics

Vehicle-specific queue totals are obtained through:

```text
vehicleProcessorManager.getQueueTotals()
```

---

# 5. Queue Status Response

A successful response returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "telemetry_queue": 0,
  "telemetry_processing_queue": 0,
  "vehicle_queues": "..."
}
```

---

# 6. getVehicleProcessorStatus()

Returns the current vehicle processor state.

It obtains:

```text
activeVehicles
```

through:

```text
vehicleProcessorManager.getActiveVehicleCount()
```

and detailed processor statistics through:

```text
vehicleProcessorManager.getStats()
```

---

# 7. Vehicle Processor Response

Successful requests return:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "activeVehicles": 0,
  "processors": "..."
}
```

---

# 8. flushTelemetryQueues()

Captures the queue lengths before flushing:

```text
telemetry_queue
telemetry_processing_queue
```

It then deletes both Redis queues:

```text
redis.del(
  "telemetry_queue",
  "telemetry_processing_queue"
)
```

---

# 9. Vehicle Processor Flush

After clearing Redis queues, the controller calls:

```text
vehicleProcessorManager.flush()
```

This clears the vehicle-level processor queues.

---

# 10. Flush Response

The controller retrieves the vehicle queue totals after flushing.

A successful response returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "All telemetry scheduler queues flushed successfully.",
  "before": {
    "telemetry_queue": 0,
    "telemetry_processing_queue": 0
  },
  "after": {
    "telemetry_queue": 0,
    "telemetry_processing_queue": 0,
    "vehicle_queues": "..."
  }
}
```

---

# 11. Error Handling

All three operations use:

```text
try / catch
```

Unexpected failures are logged and return:

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

# 12. Complete Flow

Queue status:

```text
Redis
 ↓
Read Queue Lengths
 ↓
VehicleProcessorManager
 ↓
Return Status
```

Processor status:

```text
VehicleProcessorManager
 ↓
Active Vehicle Count
 ↓
Processor Statistics
 ↓
Return Status
```

Flush:

```text
Read Before Counts
 ↓
Delete Redis Queues
 ↓
Flush Vehicle Processors
 ↓
Read After Counts
 ↓
Return Result
```

---

# 13. Exports

The controller exports:

```text
flushTelemetryQueues
getTelemetryQueueStatus
getVehicleProcessorStatus
```

---

# 14. Summary

`redisController.js` is the telemetry scheduler operations controller. It exposes queue monitoring, vehicle processor monitoring, and queue-flushing functionality by coordinating Redis and `VehicleProcessorManager`.
