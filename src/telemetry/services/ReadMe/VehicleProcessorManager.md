# VehicleProcessorManager.js — Vehicle-Level Telemetry Queue Processor

This README explains the implementation of:

    src/telemetry/services/VehicleProcessorManager.js

`VehicleProcessorManager.js` is responsible for the **vehicle-level telemetry queue architecture** of SEWAC.

It manages how telemetry packets are:

- Added to Redis queues
- Isolated by vehicle
- Processed in FIFO order
- Moved into a temporary processing queue
- Sent to the telemetry processing pipeline
- Acknowledged after successful database processing
- Requeued when a transient failure occurs
- Permanently discarded when a packet or vehicle is invalid
- Recovered after a server restart
- Monitored through queue statistics
- Flushed during controlled maintenance/testing

The manager ensures that telemetry packets belonging to different vehicles can be processed independently while preserving **strict FIFO ordering for each individual vehicle**.

---

# 1. File Location

The file being documented is:

```text
src/telemetry/services/VehicleProcessorManager.js
```

Its position in the telemetry architecture is:

```text
Incoming Telemetry
        |
        v
VehicleProcessorManager
        |
        v
Redis Vehicle Queue
        |
        v
Vehicle-Level FIFO Processor
        |
        v
insertTelemetryLog()
        |
        v
TelemetryPipelineService
        |
        v
MasterTelemetryService
        |
        v
MetadataManager / HierarchyManager
        |
        v
Telemetry Database
```

`VehicleProcessorManager.js` therefore sits between the **incoming telemetry ingestion layer** and the **database processing pipeline**.

---

# 2. Purpose of VehicleProcessorManager

The primary responsibility of this manager is to guarantee that telemetry processing happens **per vehicle**, rather than placing every telemetry packet into one global processing queue.

For example:

```text
Vehicle A
    |
    +--> telemetry_vehicle_queue:KA01AB1234
    |
    +--> Processor A
    |
    +--> FIFO processing


Vehicle B
    |
    +--> telemetry_vehicle_queue:KA01CD5678
    |
    +--> Processor B
    |
    +--> FIFO processing
```

This means:

```text
Vehicle A Packet 1
Vehicle A Packet 2
Vehicle A Packet 3
```

must be processed in exactly this order:

```text
Packet 1
   |
Packet 2
   |
Packet 3
```

while another vehicle can independently process:

```text
Vehicle B Packet 1
Vehicle B Packet 2
```

The processing of Vehicle A does not inherently block Vehicle B.

---

# 3. Core Design

The processor uses three primary Redis structures:

```text
telemetry_vehicle_queue:<vehicleId>
telemetry_vehicle_processing:<vehicleId>
telemetry_active_vehicles
```

Conceptually:

```text
Incoming Packet
       |
       v
Vehicle Queue
       |
       | BRPOPLPUSH
       v
Processing Queue
       |
       v
Telemetry Pipeline
       |
       +----------------------+
       |                      |
       v                      v
    SUCCESS                 FAILURE
       |                      |
       v                      v
Remove from             Retry / Discard
processing queue
```

The processing queue acts as a temporary durable location for the packet while the database processing is happening.

---

# 4. Redis Architecture

## 4.1 Vehicle Queue

The vehicle queue key is:

```text
telemetry_vehicle_queue:<vehicleId>
```

Example:

```text
telemetry_vehicle_queue:KA01AB1234
```

This queue contains telemetry packets waiting to be processed.

Packets are inserted using:

```javascript
await redis.lPush(queueKey, JSON.stringify(packet));
```

The processor removes packets using:

```javascript
await redis.brPopLPush(
  queueKey,
  processingKey,
  1,
);
```

This produces FIFO behavior.

---

# 5. Vehicle Processing Queue

The processing queue key is:

```text
telemetry_vehicle_processing:<vehicleId>
```

Example:

```text
telemetry_vehicle_processing:KA01AB1234
```

This queue contains packets that have already been taken from the main vehicle queue and are currently being processed.

The important architecture is:

```text
Vehicle Queue
      |
      | atomic move
      v
Processing Queue
      |
      v
Database Processing
```

The packet is therefore not immediately deleted from Redis when processing begins.

It remains recoverable until the database pipeline succeeds.

---

# 6. Active Vehicles Set

The manager maintains a Redis set:

```text
telemetry_active_vehicles
```

This set contains vehicle IDs that currently have packets waiting or being processed.

Example:

```text
telemetry_active_vehicles

KA01AB1234
KA01CD5678
KA01EF9012
```

The set is used for:

- Processor discovery
- Startup recovery
- Queue statistics
- Active vehicle tracking
- Cleanup

---

# 7. Local Processor State

The manager also maintains two in-memory maps.

## 7.1 activeProcessors

```javascript
const activeProcessors = new Map();
```

This tracks which vehicles currently have an active processor.

Example:

```text
Vehicle A -> true
Vehicle B -> true
Vehicle C -> true
```

The actual telemetry packets are **not** stored here.

Packets remain inside Redis.

The map only represents processor state.

---

## 7.2 processorClients

```javascript
const processorClients = new Map();
```

This stores the dedicated Redis blocking connection for each vehicle processor.

Conceptually:

```text
Vehicle A -> Redis Connection A
Vehicle B -> Redis Connection B
Vehicle C -> Redis Connection C
```

This is important because Redis blocking commands such as:

```text
BRPOPLPUSH
```

can block a connection while waiting for a packet.

A dedicated connection therefore prevents one vehicle from blocking another vehicle's processor.

---

# 8. Redis Key Constants

The manager defines:

```javascript
const VEHICLE_QUEUE_PREFIX = "telemetry_vehicle_queue:";

const VEHICLE_PROCESSING_PREFIX = "telemetry_vehicle_processing:";

const ACTIVE_VEHICLES_KEY = "telemetry_active_vehicles";
```

These constants establish the Redis naming convention.

---

# 9. Vehicle Queue Key Helper

The helper:

```javascript
function vehicleQueueKey(vehicleId) {
  return `${VEHICLE_QUEUE_PREFIX}${vehicleId}`;
}
```

converts a vehicle ID into its Redis queue key.

Example:

```javascript
vehicleQueueKey("KA01AB1234");
```

returns:

```text
telemetry_vehicle_queue:KA01AB1234
```

---

# 10. Vehicle Processing Key Helper

The helper:

```javascript
function vehicleProcessingKey(vehicleId) {
  return `${VEHICLE_PROCESSING_PREFIX}${vehicleId}`;
}
```

converts a vehicle ID into its processing queue key.

Example:

```javascript
vehicleProcessingKey("KA01AB1234");
```

returns:

```text
telemetry_vehicle_processing:KA01AB1234
```

---

# 11. Dedicated Blocking Redis Client

Each vehicle processor gets its own Redis connection.

The function responsible for this is:

```javascript
async function createProcessorClient(vehicleId)
```

The client is created using:

```javascript
const client = createClient({
  url: process.env.REDIS_URL,
});
```

An error listener is attached:

```javascript
client.on("error", (err) => {
  console.error(
    `❌ Vehicle Redis error [${vehicleId}]:`,
    err.message,
  );
});
```

The client then connects:

```javascript
await client.connect();
```

and is stored:

```javascript
processorClients.set(vehicleId, client);
```

Finally:

```javascript
return client;
```

---

# 12. Why Dedicated Redis Connections Are Required

Suppose:

```text
Vehicle A
Vehicle B
Vehicle C
```

are being processed simultaneously.

The architecture becomes:

```text
Vehicle A
   |
   +--> Redis Connection A
   |
   +--> BRPOPLPUSH

Vehicle B
   |
   +--> Redis Connection B
   |
   +--> BRPOPLPUSH

Vehicle C
   |
   +--> Redis Connection C
   |
   +--> BRPOPLPUSH
```

Without dedicated connections, a blocking Redis operation for one vehicle could interfere with processing for another vehicle.

The dedicated connections therefore provide **vehicle-level processing isolation**.

---

# 13. enqueue()

The main public entry point for adding telemetry packets is:

```javascript
async function enqueue(vehicleId, packet)
```

Its responsibility is to:

1. Validate the vehicle ID
2. Validate the packet
3. Ensure the packet contains a vehicle ID
4. Add the packet to the vehicle Redis queue
5. Mark the vehicle as active
6. Start a processor if one does not already exist

---

# 14. Vehicle ID Validation

The vehicle ID is normalized:

```javascript
const key = String(vehicleId || "").trim();
```

If the vehicle ID is missing:

```javascript
if (!key) {
  throw new Error("Cannot enqueue telemetry without vehicleId.");
}
```

This prevents invalid Redis keys and invalid queue ownership.

---

# 15. Packet Validation

The packet must be an object:

```javascript
if (!packet || typeof packet !== "object") {
  throw new Error(
    `Cannot enqueue invalid packet for vehicle ${key}.`,
  );
}
```

This prevents malformed values from entering Redis.

---

# 16. Packet Vehicle ID Validation

The packet itself must contain a vehicle ID:

```javascript
if (!packet.vehicleId) {
  throw new Error(
    `Telemetry packet has no vehicleId for queue ${key}.`,
  );
}
```

This prevents a packet from being stored without identifying the vehicle it belongs to.

---

# 17. Adding Packets to Redis

The producer Redis client is obtained using:

```javascript
const redis = getProducerClient();
```

The queue key is generated:

```javascript
const queueKey = vehicleQueueKey(key);
```

The packet is serialized:

```javascript
JSON.stringify(packet)
```

and inserted:

```javascript
await redis.lPush(
  queueKey,
  JSON.stringify(packet),
);
```

---

# 18. FIFO Ordering

The queue uses:

```text
LPUSH
```

for insertion and:

```text
RPOP
```

or:

```text
BRPOPLPUSH
```

for consumption.

Example:

```text
Packet 1 arrives
Packet 2 arrives
Packet 3 arrives
```

After LPUSH operations, Redis internally stores them so that processing from the opposite end results in:

```text
Packet 1
Packet 2
Packet 3
```

Therefore the processor maintains:

```text
Oldest packet first
        |
        v
Newest packet last
```

This is important because telemetry data for the same vehicle may depend on chronological ordering.

---

# 19. Marking a Vehicle Active

After the packet is inserted:

```javascript
await redis.sAdd(
  ACTIVE_VEHICLES_KEY,
  key,
);
```

The vehicle is added to:

```text
telemetry_active_vehicles
```

This allows the system to know which vehicles currently have telemetry work.

---

# 20. Starting the Processor

After enqueueing:

```javascript
startProcessor(key);
```

is called.

The processor is started asynchronously.

The enqueue operation itself does not directly process the packet.

---

# 21. startProcessor()

The function:

```javascript
function startProcessor(vehicleId)
```

ensures that only one active processor exists for a vehicle.

First it checks:

```javascript
if (activeProcessors.has(vehicleId)) {
  return;
}
```

If a processor already exists, nothing else is started.

This is critical for FIFO ordering.

---

# 22. Preventing Multiple Processors Per Vehicle

The architecture guarantees:

```text
Vehicle A
    |
    +--> Processor A
```

and prevents:

```text
Vehicle A
    |
    +--> Processor A
    +--> Processor A2
    +--> Processor A3
```

Multiple processors for the same vehicle could break strict ordering.

Therefore:

```javascript
activeProcessors.set(vehicleId, true);
```

is executed before starting processing.

---

# 23. Asynchronous Processor Lifecycle

The processor is launched with:

```javascript
processVehicle(vehicleId)
  .catch((err) => {
    console.error(
      `❌ Vehicle processor crashed [${vehicleId}]:`,
      err,
    );
  })
  .finally(async () => {
    await cleanupProcessor(vehicleId);
  });
```

The lifecycle is:

```text
startProcessor()
       |
       v
processVehicle()
       |
       +---- success / queue empty
       |
       +---- crash
       |
       v
cleanupProcessor()
```

---

# 24. processVehicle()

The main processing loop is:

```javascript
async function processVehicle(vehicleId)
```

It creates the vehicle-specific blocking Redis connection:

```javascript
const redis =
  await createProcessorClient(vehicleId);
```

Then it builds:

```javascript
const queueKey =
  vehicleQueueKey(vehicleId);

const processingKey =
  vehicleProcessingKey(vehicleId);
```

---

# 25. Vehicle FIFO Processing Loop

The processor enters:

```javascript
while (true)
```

and continuously waits for packets.

The central Redis operation is:

```javascript
const packetString =
  await redis.brPopLPush(
    queueKey,
    processingKey,
    1,
  );
```

The timeout is:

```text
1 second
```

---

# 26. Atomic Queue Movement

The operation:

```text
BRPOPLPUSH
```

moves the packet:

```text
vehicle queue
      |
      v
processing queue
```

as an atomic Redis operation.

Conceptually:

```text
telemetry_vehicle_queue:KA01AB1234
                    |
                    | BRPOPLPUSH
                    v
telemetry_vehicle_processing:KA01AB1234
```

The packet therefore remains inside Redis while the database processing is happening.

---

# 27. Why the Processing Queue Exists

Without a processing queue:

```text
Redis Queue
    |
    v
Remove packet
    |
    v
Database processing
```

If the server crashes after the packet is removed but before database processing succeeds, the packet could be lost.

With the processing queue:

```text
Main Queue
    |
    v
Processing Queue
    |
    v
Database
```

If the server crashes during processing, the packet remains recoverable.

---

# 28. Empty Queue Handling

If:

```javascript
packetString
```

is empty:

```javascript
if (!packetString) {
  break;
}
```

the processor exits its loop.

This means the vehicle currently has no packets waiting.

The processor then moves into:

```text
cleanupProcessor()
```

---

# 29. Packet JSON Parsing

The packet is stored in Redis as JSON.

Therefore it must be parsed:

```javascript
packet = JSON.parse(packetString);
```

The parsing operation is protected:

```javascript
try {
  packet = JSON.parse(packetString);
} catch (parseError) {
```

If parsing fails, the packet is considered permanently invalid.

---

# 30. Invalid JSON Handling

Invalid JSON cannot be successfully processed by the telemetry pipeline.

Therefore:

```javascript
await redis.lRem(
  processingKey,
  1,
  packetString,
);
```

removes the malformed packet from the processing queue.

The packet is then discarded:

```text
Invalid JSON
     |
     v
Remove from processing queue
     |
     v
Discard
```

It is intentionally not requeued.

---

# 31. Telemetry Pipeline Processing

Valid packets are sent to:

```javascript
await insertTelemetryLog(packet);
```

This is the bridge from Redis queue processing into the actual SEWAC telemetry database pipeline.

The architecture becomes:

```text
VehicleProcessorManager
        |
        v
insertTelemetryLog(packet)
        |
        v
TelemetryPipelineService
        |
        v
MasterTelemetryService
        |
        v
Telemetry Database
```

---

# 32. Successful Processing

If:

```javascript
await insertTelemetryLog(packet);
```

completes successfully, the packet has successfully passed through the telemetry processing pipeline.

The processing copy is then removed:

```javascript
await redis.lRem(
  processingKey,
  1,
  packetString,
);
```

The packet is therefore acknowledged.

---

# 33. ACK Behavior

The success flow is:

```text
Redis Vehicle Queue
        |
        v
Processing Queue
        |
        v
Telemetry Pipeline
        |
        v
Database Transaction
        |
        v
SUCCESS
        |
        v
Remove Processing Copy
        |
        v
ACK
```

The processor logs:

```text
✅ ACK vehicle <vehicleId>
```

The packet no longer needs to exist in Redis.

---

# 34. Failure Classification

When telemetry processing fails:

```javascript
catch (err)
```

the manager determines whether the error is:

1. Permanent vehicle failure
2. Permanent malformed-packet failure
3. Transient or unknown failure

The handling strategy differs for each category.

---

# 35. Permanent Unregistered Vehicle Failure

The telemetry pipeline can throw:

```text
UNREGISTERED_VEHICLE
```

This means the vehicle is not valid for telemetry processing.

For example:

```text
vehicle_master
      |
      +--> vehicle_id not found
```

or:

```text
vehicle_master
      |
      +--> ward_no missing
```

These packets must not be retried.

---

# 36. Unregistered Vehicle Handling

The processor checks:

```javascript
if (
  err &&
  err.code === "UNREGISTERED_VEHICLE"
)
```

The packet is removed:

```javascript
await redis.lRem(
  processingKey,
  1,
  packetString,
);
```

The packet is then permanently discarded.

No:

```javascript
rPush()
```

is performed.

---

# 37. Why Unregistered Vehicles Are Not Requeued

Retrying an unregistered vehicle would create an infinite retry loop:

```text
Packet
  |
  v
Vehicle validation
  |
  v
UNREGISTERED
  |
  v
Retry
  |
  v
Vehicle validation
  |
  v
UNREGISTERED
  |
  v
Retry
  |
  v
...
```

Therefore:

```text
UNREGISTERED_VEHICLE
        |
        v
Permanent failure
        |
        v
Remove packet
        |
        v
Do NOT requeue
```

The telemetry pipeline has already marked the corresponding master telemetry record as failed.

---

# 38. Invalid Telemetry Packet Handling

The manager also recognizes:

```javascript
INVALID_TELEMETRY_PACKET
```

and:

```javascript
INVALID_PACKET
```

as permanent failures.

These errors represent packets whose structure is invalid and therefore cannot be successfully processed through retry.

The packet is removed:

```javascript
await redis.lRem(
  processingKey,
  1,
  packetString,
);
```

and discarded.

---

# 39. Transient Failure Handling

All other failures are considered retryable.

Examples include:

```text
PostgreSQL temporary failure
Redis/network failure
Transaction timeout
Connection failure
Temporary infrastructure failure
```

These packets should not be permanently discarded.

Instead, they are returned to the vehicle queue.

---

# 40. Requeue Strategy

The packet is placed back into the right side of the FIFO queue:

```javascript
await redis.rPush(
  queueKey,
  packetString,
);
```

Then the processing copy is removed:

```javascript
await redis.lRem(
  processingKey,
  1,
  packetString,
);
```

The flow becomes:

```text
Processing Queue
       |
       v
Transient Failure
       |
       v
RPush to Vehicle Queue
       |
       v
Remove Processing Copy
       |
       v
Retry
```

---

# 41. Why Requeue Uses RPUSH

The manager uses:

```javascript
rPush()
```

instead of:

```javascript
lPush()
```

because the vehicle queue is designed around FIFO processing.

The failed packet is placed at the right side of the queue so that packets already waiting ahead of it retain their ordering.

The intended architecture is:

```text
Older packet
      |
      v
Failed packet
      |
      v
Newer packets
```

The retry mechanism therefore avoids moving the failed packet ahead of packets that were already queued before it.

---

# 42. Requeue Failure

The requeue itself is protected:

```javascript
try {
  await redis.rPush(
    queueKey,
    packetString,
  );

  await redis.lRem(
    processingKey,
    1,
    packetString,
  );
} catch (requeueError) {
```

If Redis cannot requeue the packet, the manager does not pretend that recovery succeeded.

Instead, the packet is intentionally left in:

```text
telemetry_vehicle_processing:<vehicleId>
```

This makes the packet recoverable during startup recovery.

---

# 43. Recovery After Requeue Failure

The architecture is therefore:

```text
Processing Queue
       |
       v
Requeue Attempt
       |
       +---- SUCCESS
       |       |
       |       v
       |   Back to Queue
       |
       +---- FAILURE
               |
               v
        Remain Processing Queue
               |
               v
        Startup Recovery
```

This prevents silent packet loss.

---

# 44. Retry Backoff

After a transient failure, the processor waits:

```javascript
await new Promise(
  (resolve) => setTimeout(resolve, 100),
);
```

The delay is:

```text
100 milliseconds
```

This prevents an immediate hot retry loop.

Without a delay:

```text
FAIL
 |
RETRY
 |
FAIL
 |
RETRY
 |
FAIL
 |
RETRY
```

could produce unnecessary CPU and database pressure.

---

# 45. Vehicle-Level Isolation

The architecture provides vehicle-level isolation.

For example:

```text
Vehicle A
    |
    +--> Processor A
    |
    +--> Database processing fails


Vehicle B
    |
    +--> Processor B
    |
    +--> Continues processing
```

A failure in Vehicle A does not inherently stop Vehicle B or Vehicle C from being processed.

This is one of the primary reasons for maintaining independent vehicle processors.

---

# 46. cleanupProcessor()

When a processor exits, the following function is called:

```javascript
async function cleanupProcessor(vehicleId)
```

The first action is:

```javascript
activeProcessors.delete(vehicleId);
```

This removes the local active processor state.

---

# 47. Checking for Remaining Packets

The cleanup function checks:

```javascript
const queued =
  await redis.lLen(
    vehicleQueueKey(vehicleId),
  );

const processing =
  await redis.lLen(
    vehicleProcessingKey(vehicleId),
  );
```

This determines whether packets remain.

---

# 48. Processor Restart During Cleanup

If either queue contains packets:

```javascript
if (queued > 0 || processing > 0) {
  startProcessor(vehicleId);

  return;
}
```

the processor is restarted.

This protects against packets appearing while the processor is shutting down.

The architecture becomes:

```text
Processor stopping
       |
       v
Check Redis
       |
       +---- Packets remain
       |          |
       |          v
       |      Restart processor
       |
       +---- No packets
                  |
                  v
              Cleanup
```

---

# 49. Removing Inactive Vehicles

If no packets remain:

```javascript
await redis.sRem(
  ACTIVE_VEHICLES_KEY,
  vehicleId,
);
```

The vehicle is removed from:

```text
telemetry_active_vehicles
```

This means the vehicle is no longer considered active.

---

# 50. Closing the Dedicated Redis Connection

The dedicated processor connection is retrieved:

```javascript
const client =
  processorClients.get(vehicleId);
```

If it exists, it is removed from the local map:

```javascript
processorClients.delete(vehicleId);
```

Then it is closed:

```javascript
await client.quit();
```

This prevents unnecessary Redis connections from remaining open after the processor has finished.

---

# 51. Startup Recovery

The manager provides:

```javascript
async function recover()
```

This function is intended to run during server startup.

Its purpose is to recover packets that were inside a processing queue when the server stopped.

---

# 52. Why Recovery Is Required

Consider:

```text
Vehicle A
   |
   v
Processing Queue
   |
   v
Database Processing
   |
   X
Server crashes
```

The packet may still exist in:

```text
telemetry_vehicle_processing:VehicleA
```

If nothing recovered it, the packet could remain stranded.

The recovery process returns it to the normal vehicle queue.

---

# 53. Finding Active Vehicles During Recovery

The manager retrieves:

```javascript
const vehicles =
  await redis.sMembers(
    ACTIVE_VEHICLES_KEY,
  );
```

This gives the vehicles that were active before shutdown.

Example:

```text
[
  "KA01AB1234",
  "KA01CD5678",
  "KA01EF9012"
]
```

---

# 54. Recovering Processing Packets

For every active vehicle:

```javascript
while (true) {
  const packet =
    await redis.rPop(processingKey);

  if (!packet) {
    break;
  }

  await redis.rPush(
    queueKey,
    packet,
  );
}
```

The processing queue is drained back into the normal vehicle queue.

Conceptually:

```text
Processing Queue
       |
       | RPOP
       v
Vehicle Queue
       |
       v
Normal Processing
```

---

# 55. Recovery Ordering

Recovery uses:

```text
RPOP
```

from the processing queue and:

```text
RPUSH
```

into the vehicle queue.

This is intended to preserve packet ordering during recovery.

The recovery sequence is therefore:

```text
Processing Queue
       |
       v
Oldest recoverable packet
       |
       v
Vehicle Queue
```

Packets are returned to the normal FIFO processing path.

---

# 56. Starting Processors After Recovery

After recovery, the manager checks:

```javascript
const remaining =
  await redis.lLen(queueKey);
```

If packets remain:

```javascript
if (remaining > 0) {
  startProcessor(vehicleId);
}
```

The vehicle processor is restarted.

---

# 57. Removing Empty Vehicles During Recovery

If no packets remain:

```javascript
await redis.sRem(
  ACTIVE_VEHICLES_KEY,
  vehicleId,
);
```

The vehicle is removed from the active set.

This keeps the Redis state clean.

---

# 58. Recovery Flow

The complete startup recovery sequence is:

```text
Server Startup
      |
      v
recover()
      |
      v
Read telemetry_active_vehicles
      |
      v
For each vehicle
      |
      v
Inspect processing queue
      |
      v
Move processing packets
back into vehicle queue
      |
      v
Check remaining queue
      |
      +------------------+
      |                  |
      v                  v
Packets remain       No packets
      |                  |
      v                  v
Start processor     Remove active
                    vehicle
```

---

# 59. getStats()

The manager provides:

```javascript
async function getStats()
```

This method returns detailed queue statistics for every active vehicle.

It first retrieves:

```javascript
const vehicles =
  await redis.sMembers(
    ACTIVE_VEHICLES_KEY,
  );
```

Then it builds a statistics object.

---

# 60. Per-Vehicle Statistics

Each vehicle receives:

```javascript
stats[vehicleId] = {
  queued: ...,
  processing: ...,
  processorActive: ...,
};
```

The values mean:

### queued

Number of packets waiting in:

```text
telemetry_vehicle_queue:<vehicleId>
```

### processing

Number of packets currently in:

```text
telemetry_vehicle_processing:<vehicleId>
```

### processorActive

Whether an in-memory processor currently exists for that vehicle.

---

# 61. Example getStats() Result

The structure can look conceptually like:

```javascript
{
  "KA01AB1234": {
    queued: 5,
    processing: 1,
    processorActive: true
  },

  "KA01CD5678": {
    queued: 2,
    processing: 1,
    processorActive: true
  }
}
```

This is useful for monitoring the telemetry processing system.

---

# 62. getQueueTotals()

The manager also provides:

```javascript
async function getQueueTotals()
```

This returns system-wide queue totals.

It calculates:

```text
activeVehicles
queued
processing
```

---

# 63. Queue Total Structure

The returned object is:

```javascript
return {
  activeVehicles: vehicles.length,

  queued,

  processing,
};
```

For example:

```javascript
{
  activeVehicles: 12,
  queued: 84,
  processing: 12
}
```

This gives an overview of the current telemetry workload.

---

# 64. getActiveVehicleCount()

The manager exports:

```javascript
getActiveVehicleCount: () =>
  activeProcessors.size
```

This returns the number of currently active local vehicle processors.

It measures:

```text
Number of active processors
```

rather than the total number of vehicles known to the system.

---

# 65. flush()

The manager provides:

```javascript
async function flush()
```

This function is intended for:

```text
Controlled maintenance
Testing
Development
Queue reset
```

It should not be treated as a normal telemetry-processing operation.

---

# 66. What flush() Removes

The function first gets all active vehicles:

```javascript
const vehicles =
  await redis.sMembers(
    ACTIVE_VEHICLES_KEY,
  );
```

For every vehicle it deletes:

```text
telemetry_vehicle_queue:<vehicleId>
```

and:

```text
telemetry_vehicle_processing:<vehicleId>
```

Finally it deletes:

```text
telemetry_active_vehicles
```

---

# 67. Closing Processor Connections During Flush

After Redis queue deletion, the function loops through:

```javascript
processorClients
```

and closes each dedicated connection:

```javascript
await client.quit();
```

Then:

```javascript
processorClients.clear();

activeProcessors.clear();
```

The local processor state is reset.

---

# 68. Complete Failure Model

The manager implements three major failure categories.

## Permanent vehicle failure

```text
UNREGISTERED_VEHICLE
```

Action:

```text
Remove packet
Do NOT retry
```

---

## Permanent packet failure

```text
INVALID_TELEMETRY_PACKET
INVALID_PACKET
Invalid JSON
```

Action:

```text
Remove packet
Do NOT retry
```

---

## Transient failure

Examples:

```text
Database unavailable
Network failure
Redis temporary failure
Transaction timeout
Infrastructure error
```

Action:

```text
Requeue packet
Retry later
```

---

# 69. Complete Packet Lifecycle

The complete lifecycle of one packet is:

```text
Incoming Telemetry
        |
        v
enqueue(vehicleId, packet)
        |
        v
LPUSH
        |
        v
Vehicle Queue
        |
        v
BRPOPLPUSH
        |
        v
Processing Queue
        |
        v
JSON Parse
        |
        +------------------------+
        |                        |
        v                        v
Invalid JSON                Valid JSON
        |                        |
        v                        v
Discard                 insertTelemetryLog()
                                 |
                                 v
                       Telemetry Pipeline
                                 |
                                 v
                         Database Processing
                                 |
                  +--------------+--------------+
                  |                             |
                  v                             v
               SUCCESS                       FAILURE
                  |                             |
                  v                             v
          Remove processing            Classify failure
                  |                             |
                  v                +------------+------------+
                 ACK               |            |            |
                                   v            v            v
                              Unregistered   Invalid     Transient
                                   |            |            |
                                   v            v            v
                                Discard      Discard      Requeue
```

---

# 70. Complete Vehicle-Level Architecture

For multiple vehicles:

```text
                         Redis
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      Vehicle A        Vehicle B        Vehicle C
          |                |                |
          v                v                v
   Queue A            Queue B            Queue C
          |                |                |
          v                v                v
   Processor A       Processor B       Processor C
          |                |                |
          v                v                v
   Pipeline A        Pipeline B        Pipeline C
          |                |                |
          v                v                v
     Database          Database          Database
```

Each vehicle has an independent processing path.

---

# 71. Interaction With TelemetryPipelineService

`VehicleProcessorManager.js` does not directly implement the complete database transaction.

Instead, it delegates packet processing:

```javascript
await insertTelemetryLog(packet);
```

That call enters the telemetry processing architecture.

The relationship is:

```text
VehicleProcessorManager
        |
        v
insertTelemetryLog()
        |
        v
TelemetryPipelineService
        |
        v
MasterTelemetryService
        |
        v
HierarchyManager
        |
        v
Telemetry Database
```

---

# 72. Interaction With MasterTelemetryService

The `MasterTelemetryService` is responsible for the master telemetry buffer and final database processing.

The vehicle processor does not directly manage:

```text
master_telemetry
vehicle cumulative
vehicle telemetry
hierarchy tables
completion status
failure status
```

Instead, it delegates those responsibilities to the telemetry pipeline.

---

# 73. Interaction With MetadataManager

Vehicle validation is handled deeper inside the pipeline.

The `MetadataManager` performs vehicle-to-ward resolution.

Conceptually:

```text
Vehicle ID
    |
    v
vehicle_master
    |
    v
ward_no
```

If the vehicle is not registered or does not have a valid ward, the pipeline can return:

```text
UNREGISTERED_VEHICLE
```

The vehicle processor then permanently discards the packet.

---

# 74. Interaction With TableManager

Dynamic vehicle table creation is also handled deeper in the pipeline.

The manager is responsible for creating the vehicle-specific telemetry table before final packet insertion.

The relationship is:

```text
VehicleProcessorManager
        |
        v
TelemetryPipelineService
        |
        v
TableManager
        |
        v
Dynamic Vehicle Table
```

---

# 75. Interaction With HierarchyManager

The hierarchy is created and registered after vehicle telemetry processing.

The deeper hierarchy is:

```text
Day
 |
 v
Week
 |
 v
Month
 |
 v
Year
```

The vehicle processor does not directly create these tables.

It only initiates the complete telemetry processing pipeline.

---

# 76. Reliability Model

The manager is designed around the principle:

```text
A packet should not disappear simply because
the application temporarily failed.
```

This is achieved through:

```text
Main Queue
     |
     v
Processing Queue
     |
     v
Database Processing
```

and:

```text
Transient Failure
     |
     v
Requeue
```

and:

```text
Server Restart
     |
     v
Recovery
```

---

# 77. Exactly-Once Intent

The queue architecture is designed to provide strong processing reliability.

The sequence:

```text
Move to processing queue
        |
        v
Process database transaction
        |
        v
Remove processing copy
```

ensures that the packet remains recoverable until successful processing is complete.

The database transaction itself is responsible for maintaining atomic database changes.

The Redis processor therefore acts as the durable delivery mechanism around the database pipeline.

---

# 78. Processor Isolation Summary

The manager provides:

```text
One Vehicle
     |
     +--> One Active Processor
     |
     +--> One Dedicated Blocking Redis Connection
     |
     +--> One FIFO Queue
     |
     +--> One Processing Queue
```

This gives SEWAC vehicle-level telemetry isolation.

---

# 79. Complete Public API

The module exports:

```javascript
module.exports = {
  enqueue,

  recover,

  getStats,

  getQueueTotals,

  getActiveVehicleCount: () =>
    activeProcessors.size,

  flush,
};
```

The public API therefore consists of:

| Method | Purpose |
|---|---|
| `enqueue(vehicleId, packet)` | Add telemetry packet to the vehicle queue |
| `recover()` | Recover packets after server restart |
| `getStats()` | Return detailed per-vehicle queue statistics |
| `getQueueTotals()` | Return global queue totals |
| `getActiveVehicleCount()` | Return active processor count |
| `flush()` | Clear all vehicle queues for controlled maintenance/testing |

---

# 80. End-to-End Telemetry Processing

The complete SEWAC telemetry architecture now becomes:

```text
Incoming Telemetry
        |
        v
VehicleProcessorManager
        |
        v
Redis Vehicle Queue
        |
        v
Vehicle Processor
        |
        v
insertTelemetryLog()
        |
        v
TelemetryPipelineService
        |
        +-------------------------+
        |                         |
        v                         v
Vehicle Validation          Vehicle Table
        |                         |
        +------------+------------+
                     |
                     v
          MasterTelemetryService
                     |
                     v
             Database Transaction
                     |
          +----------+----------+
          |                     |
          v                     v
Vehicle Telemetry          Cumulative Data
          |
          v
HierarchyManager
          |
          v
Day
 |
 v
Week
 |
 v
Month
 |
 v
Year
```

---

# 81. Failure and Recovery Architecture

The complete reliability model is:

```text
                     Telemetry Packet
                            |
                            v
                       Redis Queue
                            |
                            v
                   Processing Queue
                            |
                            v
                    Database Pipeline
                            |
              +-------------+-------------+
              |                           |
              v                           v
           SUCCESS                      FAILURE
              |                           |
              v                           v
       Remove Processing           Classify Failure
              |                           |
              v                +----------+----------+
             ACK               |                     |
                               v                     v
                         Permanent              Transient
                               |                     |
                               v                     v
                           Discard                Requeue
                                                     |
                                                     v
                                                  Retry
```

If the application crashes:

```text
Server Crash
     |
     v
Processing Queue remains in Redis
     |
     v
Server Restart
     |
     v
recover()
     |
     v
Move packets back to vehicle queues
     |
     v
Restart processors
     |
     v
Continue processing
```

---

# 82. Important Architectural Guarantees

`VehicleProcessorManager.js` establishes the following guarantees:

### Vehicle isolation

Different vehicles have independent processors.

### FIFO ordering

Packets for the same vehicle are processed in queue order.

### Durable queue storage

Packets remain in Redis rather than only in application memory.

### Processing recoverability

Packets remain in a processing queue until successful completion.

### Permanent failure handling

Known permanent failures are removed and never endlessly retried.

### Transient failure retry

Temporary failures are returned to the queue.

### Startup recovery

Packets stranded during server shutdown can be recovered.

### Processor cleanup

Idle vehicle processors release their Redis connections.

### Queue observability

Queue depth and processor status can be queried.

---

# 83. Complete VehicleProcessorManager.js Implementation

The complete implementation documented by this README is:

```javascript
const { createClient } = require("redis");
const { getProducerClient } = require("../../config/redis");
const insertTelemetryLog = require("../../services/telemetry/insertTelemetryLog");

// =====================================================
// REDIS KEYS
// =====================================================

const VEHICLE_QUEUE_PREFIX = "telemetry_vehicle_queue:";

const VEHICLE_PROCESSING_PREFIX = "telemetry_vehicle_processing:";

const ACTIVE_VEHICLES_KEY = "telemetry_active_vehicles";

// =====================================================
// PROCESSOR STATE
// =====================================================
//
// activeProcessors:
//     Tracks which vehicles currently have an
//     active processor.
//
// processorClients:
//     Dedicated Redis blocking connection for
//     each vehicle processor.
//
// Packets themselves are NEVER stored here.
// Packets remain inside Redis.
//
// =====================================================

const activeProcessors = new Map();

const processorClients = new Map();

// =====================================================
// KEY HELPERS
// =====================================================

function vehicleQueueKey(vehicleId) {
  return `${VEHICLE_QUEUE_PREFIX}${vehicleId}`;
}

function vehicleProcessingKey(vehicleId) {
  return `${VEHICLE_PROCESSING_PREFIX}${vehicleId}`;
}

// =====================================================
// CREATE DEDICATED BLOCKING REDIS CLIENT
// =====================================================
//
// Every vehicle processor gets its own Redis connection.
//
// Vehicle A → Redis connection A
// Vehicle B → Redis connection B
// Vehicle C → Redis connection C
//
// This prevents BRPOPLPUSH/BRPOP blocking operations
// for one vehicle from affecting another vehicle.
//
// =====================================================

async function createProcessorClient(vehicleId) {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => {
    console.error(`❌ Vehicle Redis error [${vehicleId}]:`, err.message);
  });

  await client.connect();

  processorClients.set(vehicleId, client);

  return client;
}

// =====================================================
// ENQUEUE
// =====================================================

async function enqueue(vehicleId, packet) {
  const key = String(vehicleId || "").trim();

  // ---------------------------------------------------
  // Validate vehicle ID
  // ---------------------------------------------------

  if (!key) {
    throw new Error("Cannot enqueue telemetry without vehicleId.");
  }

  // ---------------------------------------------------
  // Validate packet
  // ---------------------------------------------------

  if (!packet || typeof packet !== "object") {
    throw new Error(`Cannot enqueue invalid packet for vehicle ${key}.`);
  }

  // ---------------------------------------------------
  // Ensure packet vehicle ID exists
  // ---------------------------------------------------

  if (!packet.vehicleId) {
    throw new Error(`Telemetry packet has no vehicleId for queue ${key}.`);
  }

  const redis = getProducerClient();

  const queueKey = vehicleQueueKey(key);

  // ---------------------------------------------------
  // Store packet durably in Redis.
  //
  // LPUSH + RPOP/BRPOPLPUSH gives FIFO ordering.
  // ---------------------------------------------------

  await redis.lPush(queueKey, JSON.stringify(packet));

  // ---------------------------------------------------
  // Mark vehicle active
  // ---------------------------------------------------

  await redis.sAdd(ACTIVE_VEHICLES_KEY, key);

  // ---------------------------------------------------
  // Start processor if necessary
  // ---------------------------------------------------

  startProcessor(key);
}

// =====================================================
// START PROCESSOR
// =====================================================

function startProcessor(vehicleId) {
  // ---------------------------------------------------
  // Already running
  // ---------------------------------------------------

  if (activeProcessors.has(vehicleId)) {
    return;
  }

  // ---------------------------------------------------
  // Mark active
  // ---------------------------------------------------

  activeProcessors.set(vehicleId, true);

  // ---------------------------------------------------
  // Start asynchronous processor
  // ---------------------------------------------------

  processVehicle(vehicleId)
    .catch((err) => {
      console.error(`❌ Vehicle processor crashed [${vehicleId}]:`, err);
    })

    .finally(async () => {
      await cleanupProcessor(vehicleId);
    });
}

// =====================================================
// PROCESS ONE VEHICLE FIFO
// =====================================================

async function processVehicle(vehicleId) {
  // ---------------------------------------------------
  // Dedicated Redis connection
  // ---------------------------------------------------

  const redis = await createProcessorClient(vehicleId);

  const queueKey = vehicleQueueKey(vehicleId);

  const processingKey = vehicleProcessingKey(vehicleId);

  console.log(`Processing vehicle ${vehicleId}`);

  // ===================================================
  // VEHICLE FIFO LOOP
  // ===================================================

  while (true) {
    // -------------------------------------------------
    // ATOMIC MOVE
    //
    // vehicle queue
    //       ↓
    // processing queue
    //
    // The packet remains recoverable until processing
    // succeeds.
    // -------------------------------------------------

    const packetString = await redis.brPopLPush(queueKey, processingKey, 1);

    // -------------------------------------------------
    // Queue became empty.
    // -------------------------------------------------

    if (!packetString) {
      break;
    }

    let packet;

    // =================================================
    // PARSE PACKET
    // =================================================

    try {
      packet = JSON.parse(packetString);
    } catch (parseError) {
      // ------------------------------------------------
      // Invalid JSON is a permanent packet failure.
      //
      // There is no point retrying malformed data.
      // ------------------------------------------------

      console.error(`❌ Invalid packet JSON [${vehicleId}]`, parseError);

      await redis.lRem(processingKey, 1, packetString);

      console.error(`🚫 Invalid packet discarded [${vehicleId}]`);

      continue;
    }

    // =================================================
    // PROCESS PACKET
    // =================================================

    try {
      // ------------------------------------------------
      // Send packet through complete telemetry pipeline.
      // ------------------------------------------------

      await insertTelemetryLog(packet);

      // ------------------------------------------------
      // SUCCESS
      //
      // Database transaction has completed successfully.
      // Remove packet from processing queue.
      // ------------------------------------------------

      await redis.lRem(processingKey, 1, packetString);

      console.log(`✅ ACK vehicle ${vehicleId}`);
    } catch (err) {
      console.error(`❌ Vehicle processing failed [${vehicleId}]:`, err);

      // =================================================
      // PERMANENT FAILURE
      // =================================================
      //
      // Vehicle is not registered in vehicle_master
      // or has invalid/missing ward information.
      //
      // THIS PACKET MUST NEVER BE REQUEUED.
      //
      // It has already been marked FAILED by the
      // telemetry pipeline.
      //
      // =================================================

      if (err && err.code === "UNREGISTERED_VEHICLE") {
        // -----------------------------------------------
        // Remove packet from processing queue.
        // -----------------------------------------------

        await redis.lRem(processingKey, 1, packetString);

        // -----------------------------------------------
        // DO NOT LPUSH / RPUSH
        //
        // This is intentional.
        // -----------------------------------------------

        console.error(
          `🚫 Permanent vehicle failure — packet discarded, NOT requeued [${vehicleId}]`,
        );

        // -----------------------------------------------
        // Continue to next packet.
        // -----------------------------------------------

        continue;
      }

      // =================================================
      // OTHER PERMANENT MALFORMED-PACKET FAILURES
      // =================================================
      //
      // These are optional safety cases.
      //
      // If packet structure is clearly invalid, there
      // is no value in retrying indefinitely.
      //
      // =================================================

      if (
        err &&
        (err.code === "INVALID_TELEMETRY_PACKET" ||
          err.code === "INVALID_PACKET")
      ) {
        await redis.lRem(processingKey, 1, packetString);

        console.error(`🚫 Invalid telemetry packet discarded [${vehicleId}]`);

        continue;
      }

      // =================================================
      // TRANSIENT / UNKNOWN FAILURE
      // =================================================
      //
      // Examples:
      //
      // PostgreSQL temporary failure
      // Redis/network issue
      // transaction timeout
      // connection failure
      // temporary infrastructure issue
      //
      // These remain retryable.
      //
      // =================================================

      try {
        // ------------------------------------------------
        // Put packet back at the RIGHT side of the FIFO.
        //
        // Original packet gets priority over newer
        // packets so ordering is preserved.
        // ------------------------------------------------

        await redis.rPush(queueKey, packetString);

        // ------------------------------------------------
        // Remove processing copy.
        // ------------------------------------------------

        await redis.lRem(processingKey, 1, packetString);

        console.log(`♻️ Packet requeued [${vehicleId}]`);
      } catch (requeueError) {
        // ------------------------------------------------
        // If requeue itself fails, DO NOT pretend that
        // the packet was recovered.
        // ------------------------------------------------

        console.error(
          `❌ Failed to requeue packet [${vehicleId}]:`,
          requeueError,
        );

        // ------------------------------------------------
        // Leave the packet in processing queue.
        //
        // Startup recovery can recover it later.
        // ------------------------------------------------
      }

      // -------------------------------------------------
      // Small backoff prevents a permanent transient
      // failure from producing a hot retry loop.
      // -------------------------------------------------

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

// =====================================================
// CLEANUP PROCESSOR
// =====================================================

async function cleanupProcessor(vehicleId) {
  // ---------------------------------------------------
  // Remove local processor state
  // ---------------------------------------------------

  activeProcessors.delete(vehicleId);

  const redis = getProducerClient();

  try {
    const queued = await redis.lLen(vehicleQueueKey(vehicleId));

    const processing = await redis.lLen(vehicleProcessingKey(vehicleId));

    // -------------------------------------------------
    // If packets appeared while processor was shutting
    // down, restart the processor.
    // -------------------------------------------------

    if (queued > 0 || processing > 0) {
      startProcessor(vehicleId);

      return;
    }

    // -------------------------------------------------
    // No packets remain.
    //
    // Vehicle is no longer active.
    // -------------------------------------------------

    await redis.sRem(ACTIVE_VEHICLES_KEY, vehicleId);
  } catch (err) {
    console.error(`❌ Processor cleanup failed [${vehicleId}]:`, err);
  } finally {
    // -------------------------------------------------
    // Close dedicated processor Redis connection.
    // -------------------------------------------------

    const client = processorClients.get(vehicleId);

    if (client) {
      processorClients.delete(vehicleId);

      try {
        await client.quit();
      } catch (err) {
        console.error(
          `Redis processor disconnect failed [${vehicleId}]:`,
          err.message,
        );
      }
    }
  }
}

// =====================================================
// RECOVERY
// =====================================================
//
// Called during server startup.
//
// Any packet that was inside a vehicle's processing
// queue when the server stopped is returned to that
// vehicle's FIFO queue.
//
// =====================================================

async function recover() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  console.log(`Recovering ${vehicles.length} active vehicle processors...`);

  for (const vehicleId of vehicles) {
    const queueKey = vehicleQueueKey(vehicleId);

    const processingKey = vehicleProcessingKey(vehicleId);

    // -------------------------------------------------
    // Move processing packets back into FIFO.
    //
    // rPop + rPush preserves packet ordering during
    // recovery.
    // -------------------------------------------------

    while (true) {
      const packet = await redis.rPop(processingKey);

      if (!packet) {
        break;
      }

      await redis.rPush(queueKey, packet);

      console.log(`Recovered vehicle packet [${vehicleId}]`);
    }

    // -------------------------------------------------
    // Check remaining queue
    // -------------------------------------------------

    const remaining = await redis.lLen(queueKey);

    if (remaining > 0) {
      startProcessor(vehicleId);
    } else {
      await redis.sRem(ACTIVE_VEHICLES_KEY, vehicleId);
    }
  }

  console.log("Vehicle processor recovery completed.");
}

// =====================================================
// STATUS
// =====================================================

async function getStats() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  const stats = {};

  for (const vehicleId of vehicles) {
    stats[vehicleId] = {
      queued: await redis.lLen(vehicleQueueKey(vehicleId)),

      processing: await redis.lLen(vehicleProcessingKey(vehicleId)),

      processorActive: activeProcessors.has(vehicleId),
    };
  }

  return stats;
}

// =====================================================
// QUEUE TOTALS
// =====================================================

async function getQueueTotals() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  let queued = 0;

  let processing = 0;

  for (const vehicleId of vehicles) {
    queued += await redis.lLen(vehicleQueueKey(vehicleId));

    processing += await redis.lLen(vehicleProcessingKey(vehicleId));
  }

  return {
    activeVehicles: vehicles.length,

    queued,

    processing,
  };
}

// =====================================================
// FLUSH ALL VEHICLE QUEUES
// =====================================================
//
// Intended for controlled maintenance/testing only.
//
// This clears:
//   telemetry_vehicle_queue:*
//   telemetry_vehicle_processing:*
//   telemetry_active_vehicles
//
// =====================================================

async function flush() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  for (const vehicleId of vehicles) {
    await redis.del(vehicleQueueKey(vehicleId));

    await redis.del(vehicleProcessingKey(vehicleId));
  }

  await redis.del(ACTIVE_VEHICLES_KEY);

  // ---------------------------------------------------
  // Close dedicated processor clients
  // ---------------------------------------------------

  for (const [vehicleId, client] of processorClients) {
    try {
      await client.quit();
    } catch (err) {
      console.error(
        `Processor Redis close failed [${vehicleId}]:`,
        err.message,
      );
    }
  }

  processorClients.clear();

  activeProcessors.clear();
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  enqueue,

  recover,

  getStats,

  getQueueTotals,

  getActiveVehicleCount: () => activeProcessors.size,

  flush,
};
```

---

# 84. Telemetry Architecture Position

At this point, the telemetry processing chain can be understood as:

```text
telemetry.schema.prisma
        |
        v
queries/query.js
        |
        v
initialize/initializeTelemetryDB.js
        |
        v
managers/
        |
        +--> HierarchyManager.js
        +--> MetadataManager.js
        +--> TableManager.js
        |
        v
services/
        |
        +--> MasterTelemetryService.js
        +--> TelemetryPipelineService.js
        +--> VehicleProcessorManager.js
        |
        v
Redis Vehicle Queues
        |
        v
Complete Telemetry Processing Pipeline
```

`VehicleProcessorManager.js` is the component that provides the **vehicle-level queue and processing layer** around the database telemetry pipeline.

---

# 85. Next File

The next file in the documentation chain is:

    src/telemetry/services/MasterTelemetryService.js

Continue to:

    src/telemetry/services/ReadMe/

and open:

    MasterTelemetryService.md

The next document explains how a packet that has been accepted by the vehicle processor enters the **master telemetry buffer**, is processed through the database transaction, updates vehicle cumulative telemetry, inserts vehicle telemetry, and triggers the hierarchy processing.

The documentation chain continues:

    VehicleProcessorManager.js
            |
            v
    MasterTelemetryService.js
            |
            v
    TelemetryPipelineService.js
            |
            v
    Complete Telemetry Database Processing

After reading `MasterTelemetryService.md`, continue to:

    src/telemetry/services/ReadMe/

and open:

    TelemetryPipelineService.md

This document explains how the **MasterTelemetryService** is orchestrated into the complete telemetry processing pipeline, including:

- Creation of the master telemetry buffer
- Vehicle validation before dynamic table creation
- Handling of unregistered vehicles
- Dynamic vehicle table creation
- Database transaction processing
- Vehicle cumulative telemetry updates
- Vehicle telemetry insertion
- Telemetry hierarchy processing
- Transaction failure handling
- Master telemetry failure status handling
- Master telemetry completion status
- Completed buffer cleanup
- Final telemetry pipeline completion

The service-layer documentation therefore continues as:

    VehicleProcessorManager.js
            |
            v
    MasterTelemetryService.js
            |
            v
    TelemetryPipelineService.js
            |
            v
    Complete Telemetry Processing

The next document to read is:

    src/telemetry/services/ReadMe/TelemetryPipelineService.md

This completes the transition from the **vehicle-level processor** into the **master telemetry service** and then into the **complete telemetry database processing pipeline**.