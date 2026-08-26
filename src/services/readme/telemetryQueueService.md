# telemetryQueueService.js Documentation

## 1. File Overview

**File:** `telemetryQueueService(20260826-120324).js`\
**Location:** Service layer for global telemetry dispatching.

This service implements the global telemetry queue and dispatcher layer.

It is responsible for:

``` text
Telemetry payload validation
AUTO / MANUAL collection classification
Citizen-cache lookup
Telemetry packet construction
Global Redis FIFO consumption
Global processing-queue handling
Vehicle FIFO routing
Global retry / requeue
Global processing-queue recovery
Vehicle processor recovery
Multiple dispatcher startup
```

The overall architecture is:

``` text
Telemetry HTTP Controller
        ↓
GLOBAL_QUEUE
"telemetry_queue"
        ↓
Global Dispatcher
        ↓
buildTelemetryPacket()
        ↓
vehicleProcessorManager.enqueue()
        ↓
Vehicle FIFO
        ↓
Vehicle Processor
```

The service uses:

``` text
4 global dispatchers
1 global telemetry queue
1 global processing queue
1 vehicle processor manager
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
Redis configuration
Citizen cache
VehicleProcessorManager
```

The Redis functions are imported from:

``` text
../config/redis
```

Specifically:

``` js
createDispatcherClient
getProducerClient
```

The citizen cache is imported from:

``` text
../config/citizenCache
```

The vehicle processor manager is imported from:

``` text
../telemetry/services/VehicleProcessorManager
```

------------------------------------------------------------------------

# 3. Dispatcher Configuration

The service defines:

``` text
DISPATCHER_COUNT = 4
```

Therefore four global telemetry dispatchers are started.

The global queue is:

``` text
telemetry_queue
```

The processing queue is:

``` text
telemetry_processing_queue
```

------------------------------------------------------------------------

# 4. GLOBAL_QUEUE

The service defines:

``` text
GLOBAL_QUEUE = "telemetry_queue"
```

This is the main global FIFO queue.

Telemetry packets enter this queue before being dispatched to individual
vehicle processors.

Conceptually:

``` text
Incoming Telemetry
        ↓
telemetry_queue
```

------------------------------------------------------------------------

# 5. GLOBAL_PROCESSING_QUEUE

The service defines:

``` text
GLOBAL_PROCESSING_QUEUE =
"telemetry_processing_queue"
```

This queue temporarily holds the packet currently being processed by a
dispatcher.

The flow is:

``` text
telemetry_queue
        ↓
telemetry_processing_queue
        ↓
Vehicle FIFO
```

This provides a temporary processing state between global queue
consumption and vehicle routing.

------------------------------------------------------------------------

# 6. buildTelemetryPacket()

This function converts an incoming telemetry payload into the
serializable packet consumed by the vehicle FIFO.

It receives:

``` text
payload
```

The function first validates that:

``` text
payload
```

exists and is an object.

If not, it throws:

``` text
Invalid telemetry payload.
```

------------------------------------------------------------------------

# 7. buildTelemetryPacket() Input Fields

The function extracts:

``` text
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

The default value for:

``` text
weight
```

is:

``` text
0
```

------------------------------------------------------------------------

# 8. Basic Telemetry Validation

The following fields are mandatory:

``` text
vehicleId
iotTimestamp
unitNumber
```

If:

``` text
vehicleId
```

is missing, the service throws:

``` text
Telemetry packet missing vehicleId.
```

If:

``` text
iotTimestamp
```

is missing:

``` text
Telemetry packet missing iotTimestamp.
```

If:

``` text
unitNumber
```

is missing:

``` text
Telemetry packet missing unitNumber.
```

------------------------------------------------------------------------

# 9. Collection Type Detection

The service determines whether the telemetry packet represents:

``` text
AUTO
```

or:

``` text
MANUAL
```

collection.

Two conditions are defined:

``` text
isManual
isAuto
```

------------------------------------------------------------------------

# 10. Manual Collection Detection

A packet is classified as:

``` text
MANUAL
```

when all of the following are true:

``` text
remarks === ""
rfidNumber is a string
rfidNumber starts with "E"
unitNumber === "SEWAC_01_UHF"
```

Conceptually:

``` text
Empty remarks
    +
RFID starts with E
    +
UHF unit
    ↓
MANUAL
```

------------------------------------------------------------------------

# 11. Automatic Collection Detection

A packet is classified as:

``` text
AUTO
```

when all of the following are true:

``` text
remarks === "O"
rfidNumber is a string
rfidNumber does NOT start with "E"
unitNumber === "SEWAC_01_HF"
```

Conceptually:

``` text
remarks = O
    +
RFID does not start with E
    +
HF unit
    ↓
AUTO
```

------------------------------------------------------------------------

# 12. Invalid Collection Type

If the packet matches neither:

``` text
AUTO
```

nor:

``` text
MANUAL
```

the service throws:

``` text
Invalid telemetry payload.
```

Therefore the telemetry collection mode must satisfy one of the two
explicitly supported patterns.

------------------------------------------------------------------------

# 13. Packet Working Variables

The service initializes:

``` text
citizenId = null
citizenContact = null

wasteType = "MIXED"

wetWeightKg = 0
dryWeightKg = 0
otherWeightKg = 0

driverAction = 0
```

It also prepares:

``` text
finalRemarks
finalCollectionType
finalRfidNumber
```

These values are populated according to the collection mode.

------------------------------------------------------------------------

# 14. AUTO Telemetry Processing

For AUTO telemetry:

``` text
finalRemarks = "O"
finalCollectionType = "AUTO"
finalRfidNumber = rfidNumber
```

The incoming weight is assigned to:

``` text
otherWeightKg
```

using:

``` js
Number(weight)
```

The driver action becomes:

``` text
driverAction = 1
```

------------------------------------------------------------------------

# 15. AUTO Packet Weight Mapping

AUTO collection does not assign the weight to:

``` text
wetWeightKg
```

or:

``` text
dryWeightKg
```

Instead:

``` text
weight
    ↓
otherWeightKg
```

Therefore the AUTO packet contains:

``` text
wetWeightKg = 0
dryWeightKg = 0
otherWeightKg = weight
```

------------------------------------------------------------------------

# 16. MANUAL Telemetry Processing

For MANUAL telemetry, the service retrieves citizen information from:

``` text
citizenCache
```

using:

``` text
rfidNumber
```

The lookup is:

``` js
citizenCache.get(rfidNumber)
```

------------------------------------------------------------------------

# 17. Citizen Cache Validation

If no cached citizen data exists, the service throws:

``` text
Citizen not found for RFID: <rfidNumber>
```

Therefore MANUAL telemetry requires an existing citizen-cache entry.

------------------------------------------------------------------------

# 18. Citizen Data Extraction

From the cached data, the service extracts:

``` text
cachedData.citizen.id
cachedData.citizen.contactNumber
cachedData.wasteType
```

These become:

``` text
citizenId
citizenContact
wasteType
```

------------------------------------------------------------------------

# 19. Manual Waste-Type Mapping

The service maps the cached:

``` text
wasteType
```

to the final telemetry remark.

If:

``` text
wasteType === "WET"
```

then:

``` text
finalRemarks = "W"
```

Otherwise:

``` text
finalRemarks = "D"
```

Therefore the implementation supports:

``` text
WET
    ↓
W

Non-WET
    ↓
D
```

------------------------------------------------------------------------

# 20. Manual Collection Type

For MANUAL telemetry:

``` text
finalCollectionType = "MANUAL"
```

and:

``` text
finalRfidNumber = rfidNumber
```

------------------------------------------------------------------------

# 21. Manual Weight Mapping

If:

``` text
wasteType === "WET"
```

the weight is assigned to:

``` text
wetWeightKg
```

using:

``` js
Number(weight)
```

Otherwise the weight is assigned to:

``` text
dryWeightKg
```

Therefore:

``` text
WET
    ↓
wetWeightKg

Non-WET
    ↓
dryWeightKg
```

------------------------------------------------------------------------

# 22. Manual Driver Action

MANUAL telemetry sets:

``` text
driverAction = 0
```

Therefore:

``` text
AUTO
    ↓
driverAction = 1

MANUAL
    ↓
driverAction = 0
```

------------------------------------------------------------------------

# 23. Serializable Telemetry Packet

The function returns a plain serializable object.

The packet contains:

``` text
rfidNumber
iotTimestamp
driverName
vehicleId
latitude
longitude
wetWeightKg
dryWeightKg
otherWeightKg
cumulativeWeightKg
firmwareVersion
unitNumber
collectionType
remarks
driverAction
errCode
citizenId
citizenContact
wasteType
```

The service explicitly documents that this object is what enters the
vehicle FIFO.

It contains:

``` text
No functions
No callbacks
No execute()
```

------------------------------------------------------------------------

# 24. cumulativeWeightKg

Every newly built telemetry packet initializes:

``` text
cumulativeWeightKg = 0
```

The queue service itself does not calculate cumulative weight.

It therefore passes:

``` text
0
```

to the downstream vehicle processor.

------------------------------------------------------------------------

# 25. processTelemetryQueue()

This function processes one packet from the global telemetry queue.

It receives:

``` text
dispatcherId
redis
```

The function performs:

``` text
Global FIFO → Processing Queue
→ JSON parsing
→ Job unwrapping
→ Packet building
→ Vehicle FIFO routing
→ Global acknowledgement
```

------------------------------------------------------------------------

# 26. Atomic Global FIFO Movement

The service uses:

``` js
redis.blMove()
```

to move one packet from:

``` text
GLOBAL_QUEUE
```

to:

``` text
GLOBAL_PROCESSING_QUEUE
```

The operation is:

``` text
RIGHT
    ↓
LEFT
```

with:

``` text
timeout = 0
```

The resulting flow is:

``` text
telemetry_queue
        ↓
telemetry_processing_queue
```

------------------------------------------------------------------------

# 27. Blocking Queue Behavior

The timeout value:

``` text
0
```

means the Redis operation can wait for an item rather than immediately
returning when the queue is empty.

However, the function checks:

``` text
if (!payloadString)
```

and returns:

``` text
false
```

when no payload is available.

------------------------------------------------------------------------

# 28. JSON Parsing

The moved value is expected to be JSON.

The service calls:

``` js
JSON.parse(payloadString)
```

inside a:

``` text
try / catch
```

block.

------------------------------------------------------------------------

# 29. Invalid Telemetry JSON

If JSON parsing fails, the service logs:

``` text
❌ Invalid telemetry JSON:
```

and removes one occurrence of the invalid payload from:

``` text
telemetry_processing_queue
```

using:

``` js
redis.lRem(
  GLOBAL_PROCESSING_QUEUE,
  1,
  payloadString
)
```

It then returns:

``` text
true
```

The invalid packet is therefore discarded rather than requeued.

------------------------------------------------------------------------

# 30. Queued Job Structure

The HTTP controller can store a wrapper object:

``` json
{
  "jobId": "...",
  "payload": {
    "...": "telemetry"
  }
}
```

The service detects this structure.

It checks whether:

``` text
payload.payload
```

exists and is an object.

If so, the service treats the outer object as:

``` text
job
```

and the inner object as:

``` text
telemetryPayload
```

------------------------------------------------------------------------

# 31. Legacy Payload Support

If the queued payload does not contain:

``` text
payload.payload
```

the service treats the complete parsed object as:

``` text
telemetryPayload
```

This provides compatibility with a legacy direct-payload format.

Conceptually:

``` text
Wrapped job
    ↓
job.payload

Legacy direct payload
    ↓
payload
```

------------------------------------------------------------------------

# 32. Job ID

For wrapped jobs:

``` text
jobId
```

is extracted from:

``` text
job.jobId
```

If no job wrapper exists:

``` text
jobId = null
```

The service logs:

``` text
Job: <jobId>
```

or:

``` text
Job: legacy
```

------------------------------------------------------------------------

# 33. New Telemetry Logging

Before processing, the service logs:

``` text
========== NEW TELEMETRY ==========
```

It also logs:

``` text
Job
Vehicle
```

using:

``` text
jobId
telemetryPayload.vehicleId
```

------------------------------------------------------------------------

# 34. Packet Construction

The service calls:

``` js
buildTelemetryPacket(
  telemetryPayload
)
```

The resulting packet is stored as:

``` text
packet
```

If packet construction fails, processing enters the dispatch-error path.

------------------------------------------------------------------------

# 35. Vehicle ID Normalization

After packet construction:

``` js
String(packet.vehicleId)
```

is used to create:

``` text
vehicleId
```

This ensures the downstream vehicle FIFO receives a string vehicle
identifier.

------------------------------------------------------------------------

# 36. Vehicle FIFO Routing

The packet is routed using:

``` js
vehicleProcessorManager.enqueue(
  vehicleId,
  packet
)
```

Therefore the global dispatcher does not directly process vehicle
telemetry.

Instead:

``` text
Global Queue
    ↓
Dispatcher
    ↓
VehicleProcessorManager
    ↓
Vehicle-specific FIFO
```

------------------------------------------------------------------------

# 37. Vehicle Queue Responsibility

The service comments explicitly identify the destination as:

``` text
telemetry_vehicle_queue:<vehicle>
```

The global packet is therefore transferred into a vehicle-specific
queue.

The global processing copy can then be safely removed.

------------------------------------------------------------------------

# 38. Global Acknowledgement

After successful vehicle FIFO routing, the service executes:

``` js
redis.lRem(
  GLOBAL_PROCESSING_QUEUE,
  1,
  payloadString
)
```

This removes the temporary processing copy.

The sequence is:

``` text
telemetry_queue
      ↓
telemetry_processing_queue
      ↓
vehicle queue
      ↓
Remove processing copy
```

------------------------------------------------------------------------

# 39. Successful Dispatch

After successful routing, the service logs:

``` text
📦 Routed vehicle <vehicleId>
```

and returns:

``` text
true
```

------------------------------------------------------------------------

# 40. Dispatch Error Handling

If packet construction or vehicle routing throws an error, the service
logs:

``` text
========== DISPATCH ERROR ==========
```

followed by the error.

It then attempts global retry.

------------------------------------------------------------------------

# 41. Global Retry

The service first removes the packet from:

``` text
telemetry_processing_queue
```

using:

``` js
redis.lRem()
```

It then re-adds the original payload to:

``` text
telemetry_queue
```

using:

``` js
redis.rPush()
```

The flow is:

``` text
processing queue
      ↓
remove failed packet
      ↓
global queue
      ↓
retry later
```

------------------------------------------------------------------------

# 42. Retry Failure

If requeueing itself fails, the service logs:

``` text
❌ FAILED TO REQUEUE PACKET:
```

along with the retry error.

The function still returns:

``` text
true
```

------------------------------------------------------------------------

# 43. Global Retry Semantics

The service retries failures caused by:

``` text
Packet construction
Vehicle FIFO enqueue
```

The retry preserves:

``` text
payloadString
```

rather than reconstructing the original HTTP request.

This means the original queued job structure remains intact.

------------------------------------------------------------------------

# 44. recoverProcessingQueue()

This function recovers packets left inside:

``` text
telemetry_processing_queue
```

after an interruption or dispatcher failure.

It obtains the producer Redis client using:

``` js
getProducerClient()
```

------------------------------------------------------------------------

# 45. Global Recovery Flow

The function repeatedly executes:

``` js
redis.lMove(
  GLOBAL_PROCESSING_QUEUE,
  GLOBAL_QUEUE,
  "RIGHT",
  "LEFT"
)
```

Therefore:

``` text
telemetry_processing_queue
        ↓
telemetry_queue
```

Packets are moved back into the global queue.

------------------------------------------------------------------------

# 46. Recovery Loop

The recovery process continues until:

``` text
lMove()
```

returns no packet.

The loop then exits.

For every recovered packet, the service logs:

``` text
Recovered one telemetry packet.
```

------------------------------------------------------------------------

# 47. Recovery Completion

After all processing-queue packets have been moved, the service logs:

``` text
Telemetry recovery completed.
```

The function does not return a processed-packet count.

------------------------------------------------------------------------

# 48. startDispatcher()

This function starts one global telemetry dispatcher.

It receives:

``` text
dispatcherId
```

The service logs:

``` text
Telemetry Dispatcher <dispatcherId> starting...
```

------------------------------------------------------------------------

# 49. Dispatcher Redis Client

The dispatcher obtains its Redis client using:

``` js
createDispatcherClient(
  dispatcherId
)
```

This creates the Redis connection associated with the dispatcher.

After connection creation, it logs:

``` text
Telemetry Dispatcher <dispatcherId> started
```

------------------------------------------------------------------------

# 50. Dispatcher Processing Loop

Each dispatcher continuously executes:

``` js
processTelemetryQueue(
  dispatcherId,
  redis
)
```

inside:

``` text
while (true)
```

------------------------------------------------------------------------

# 51. Empty Queue Behavior

If:

``` text
processTelemetryQueue()
```

returns:

``` text
false
```

the dispatcher waits:

``` text
5 milliseconds
```

using:

``` js
setTimeout(resolve, 5)
```

and then continues.

------------------------------------------------------------------------

# 52. Dispatcher Error Handling

If an unexpected error escapes the processing function, the dispatcher
logs:

``` text
Dispatcher <dispatcherId> error:
```

It then waits:

``` text
100 milliseconds
```

before continuing.

This prevents a transient dispatcher error from immediately terminating
the processing loop.

------------------------------------------------------------------------

# 53. Dispatcher Connection Cleanup

The dispatcher uses:

``` text
finally
```

to close its Redis connection.

It calls:

``` js
redis.quit()
```

If connection closure fails, it logs:

``` text
Failed to close Dispatcher <dispatcherId> Redis connection:
```

------------------------------------------------------------------------

# 54. Multiple Dispatcher Architecture

The service starts:

``` text
DISPATCHER_COUNT = 4
```

dispatchers.

The startup loop runs:

``` text
i = 1
i = 2
i = 3
i = 4
```

and creates:

``` text
startDispatcher(1)
startDispatcher(2)
startDispatcher(3)
startDispatcher(4)
```

------------------------------------------------------------------------

# 55. Dispatcher Concurrency

The dispatcher promises are stored in:

``` text
dispatchers
```

and executed using:

``` js
Promise.all(dispatchers)
```

Therefore the four dispatchers run concurrently.

Conceptually:

``` text
                telemetry_queue
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Dispatcher 1   Dispatcher 2   Dispatcher 3
        ↓              ↓              ↓
        └──────────── Dispatcher 4 ───┘
                       ↓
            VehicleProcessorManager
```

------------------------------------------------------------------------

# 56. Startup Sequence

The service does not immediately start dispatchers.

Startup follows:

``` text
1. Global Recovery
        ↓
2. Vehicle Recovery
        ↓
3. Start 4 Dispatchers
```

This ordering is explicitly implemented in the startup function.

------------------------------------------------------------------------

# 57. Global Recovery First

The service calls:

``` js
recoverProcessingQueue()
```

before starting any dispatcher.

This ensures packets stranded in:

``` text
telemetry_processing_queue
```

are moved back to:

``` text
telemetry_queue
```

before normal processing resumes.

------------------------------------------------------------------------

# 58. Vehicle Recovery Second

After global recovery, the service calls:

``` js
vehicleProcessorManager.recover()
```

This delegates recovery of vehicle-specific processing state to the
vehicle processor manager.

The detailed implementation of:

``` text
vehicleProcessorManager.recover()
```

is not contained in this service file.

------------------------------------------------------------------------

# 59. Dispatcher Startup Third

Only after both recovery stages succeed does the service start:

``` text
4 dispatchers
```

using:

``` text
startDispatcher()
```

------------------------------------------------------------------------

# 60. Startup Failure Handling

The startup function is wrapped in:

``` text
try / catch
```

If startup fails, the service logs:

``` text
❌ Telemetry dispatcher startup failed:
```

along with the error.

------------------------------------------------------------------------

# 61. Automatic Startup

The service invokes its startup function immediately:

``` js
(async function startDispatchers() {
  ...
})();
```

Therefore importing/executing this service starts the telemetry
dispatcher system automatically.

------------------------------------------------------------------------

# 62. End-to-End Telemetry Flow

The complete flow is:

``` text
Incoming Telemetry
        ↓
HTTP Controller
        ↓
telemetry_queue
        ↓
Global Dispatcher
        ↓
BLMOVE
        ↓
telemetry_processing_queue
        ↓
JSON Parse
        ↓
Unwrap Job
        ↓
buildTelemetryPacket()
        ↓
AUTO / MANUAL Classification
        ↓
Citizen Cache if MANUAL
        ↓
Serializable Packet
        ↓
vehicleProcessorManager.enqueue()
        ↓
Vehicle-specific FIFO
        ↓
Remove global processing copy
```

------------------------------------------------------------------------

# 63. Failed Packet Flow

If dispatch fails:

``` text
telemetry_processing_queue
        ↓
Dispatch Error
        ↓
Remove Processing Copy
        ↓
RPUSH to telemetry_queue
        ↓
Retry
```

------------------------------------------------------------------------

# 64. Invalid JSON Flow

If the queued payload is invalid JSON:

``` text
telemetry_processing_queue
        ↓
JSON.parse() fails
        ↓
Log Invalid JSON
        ↓
Remove packet
        ↓
Discard
```

Unlike normal dispatch failures, invalid JSON is not requeued.

------------------------------------------------------------------------

# 65. Recovery Flow

If the process crashes while packets remain in the processing queue:

``` text
Process Restart
      ↓
recoverProcessingQueue()
      ↓
telemetry_processing_queue
      ↓
telemetry_queue
      ↓
vehicleProcessorManager.recover()
      ↓
Start Dispatchers
```

------------------------------------------------------------------------

# 66. AUTO vs MANUAL Flow

## AUTO

``` text
remarks = "O"
RFID does not start with E
unitNumber = SEWAC_01_HF
        ↓
AUTO
        ↓
otherWeightKg = weight
driverAction = 1
citizenId = null
```

## MANUAL

``` text
remarks = ""
RFID starts with E
unitNumber = SEWAC_01_UHF
        ↓
MANUAL
        ↓
Citizen Cache Lookup
        ↓
WET → wetWeightKg
DRY → dryWeightKg
        ↓
driverAction = 0
```

------------------------------------------------------------------------

# 67. Telemetry Packet Transformation

The service transforms the original payload into:

``` text
Normalized Telemetry Packet
```

The transformation includes:

``` text
vehicleId → String(vehicleId)
weight → wet/dry/other weight
collection type → AUTO / MANUAL
remarks → normalized collection remark
citizen information → cache-derived values
driver action → 0 / 1
cumulative weight → 0
```

------------------------------------------------------------------------

# 68. Queue Responsibility Separation

The architecture separates:

``` text
Global Queue
```

from:

``` text
Vehicle Queue
```

The global queue is responsible for:

``` text
Receiving telemetry
Global dispatch
Global retry
Global recovery
```

The vehicle queue is responsible for:

``` text
Vehicle-specific ordered processing
```

The actual vehicle-processing implementation belongs to:

``` text
VehicleProcessorManager
```

and is not implemented in this service.

------------------------------------------------------------------------

# 69. Redis Queue Lifecycle

A packet can move through:

``` text
telemetry_queue
        ↓
telemetry_processing_queue
        ↓
telemetry_vehicle_queue:<vehicle>
```

On failure:

``` text
telemetry_processing_queue
        ↓
telemetry_queue
```

On process recovery:

``` text
telemetry_processing_queue
        ↓
telemetry_queue
```

------------------------------------------------------------------------

# 70. Error Handling

The service explicitly handles:

``` text
Invalid telemetry payload
Missing vehicleId
Missing iotTimestamp
Missing unitNumber
Invalid collection type
Citizen not found for RFID
Invalid telemetry JSON
Dispatch failure
Requeue failure
Dispatcher processing errors
Redis connection-close errors
Global recovery errors
Startup errors
```

Different failures have different behavior.

------------------------------------------------------------------------

# 71. Failure Behavior Summary

  Failure                           Behavior
  --------------------------------- ------------------------------
  Invalid payload object            Throw
  Missing vehicle ID                Throw
  Missing timestamp                 Throw
  Missing unit number               Throw
  Invalid AUTO/MANUAL combination   Throw
  MANUAL citizen missing            Throw
  Invalid JSON                      Remove from processing queue
  Packet dispatch failure           Requeue globally
  Requeue failure                   Log
  Dispatcher loop error             Log + 100 ms delay
  Redis quit failure                Log
  Startup failure                   Log

------------------------------------------------------------------------

# 72. Exported Functions

The service exports:

``` text
processTelemetryQueue
recoverProcessingQueue
```

The following functions remain internal:

``` text
buildTelemetryPacket
startDispatcher
```

The startup process is executed automatically when the file is loaded.

------------------------------------------------------------------------

# 73. Architecture

``` text
                    Telemetry Producer
                           ↓
                    telemetry_queue
                           ↓
             ┌─────────────┴─────────────┐
             │                           │
        Dispatcher 1                Dispatcher 2
             │                           │
        Dispatcher 3                Dispatcher 4
             │                           │
             └─────────────┬─────────────┘
                           ↓
               telemetry_processing_queue
                           ↓
                buildTelemetryPacket()
                           ↓
              VehicleProcessorManager
                           ↓
              Vehicle-specific FIFO
                           ↓
                 Vehicle Processor
```

------------------------------------------------------------------------

# 74. Summary

`telemetryQueueService(20260826-120324).js` is the global
telemetry-dispatch layer responsible for converting incoming telemetry
into normalized packets and routing those packets into vehicle-specific
processing queues.

Its major responsibilities are:

``` text
Telemetry validation
AUTO / MANUAL classification
Citizen-cache resolution
Packet normalization
Global FIFO consumption
Processing-queue tracking
Vehicle FIFO routing
Global retry
Global recovery
Dispatcher lifecycle
```

The telemetry packet supports two collection modes:

``` text
AUTO
    ↓
SEWAC_01_HF
    ↓
otherWeightKg
    ↓
driverAction = 1

MANUAL
    ↓
SEWAC_01_UHF
    ↓
Citizen Cache
    ↓
WET → wetWeightKg
DRY → dryWeightKg
    ↓
driverAction = 0
```

The global queue architecture is:

``` text
telemetry_queue
        ↓
telemetry_processing_queue
        ↓
vehicleProcessorManager
        ↓
vehicle-specific FIFO
```

The service uses:

``` text
4 concurrent global dispatchers
```

and performs recovery before normal processing:

``` text
Global Queue Recovery
        ↓
Vehicle Processor Recovery
        ↓
Dispatcher Startup
```

A successful packet is acknowledged globally only after it has been
successfully routed into the vehicle FIFO.

A dispatch failure causes:

``` text
processing queue
        ↓
global requeue
        ↓
retry
```

while invalid JSON is discarded after removal from the processing queue.

Overall architecture:

``` text
                 TELEMETRY INPUT
                       ↓
              telemetry_queue
                       ↓
              Global Dispatchers
                 × 4 Workers
                       ↓
         telemetry_processing_queue
                       ↓
          buildTelemetryPacket()
                       ↓
              Normalize Payload
                       ↓
        VehicleProcessorManager
                       ↓
        Vehicle-Specific FIFO
                       ↓
             Vehicle Processor
                       ↓
             Telemetry Storage
```

The service therefore acts as the bridge between the global telemetry
ingestion layer and the vehicle-specific processing architecture, while
providing packet validation, normalization, retry handling, and crash
recovery.
