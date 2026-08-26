# MasterTelemetryService.js — Master Telemetry Processing

This README explains the implementation of:

    src/telemetry/services/MasterTelemetryService.js

`MasterTelemetryService.js` is responsible for managing the **master telemetry buffer** and performing the core database processing of an incoming telemetry packet.

This service connects the previously documented layers:

    Telemetry Database
          |
          v
    SQL Query Factory
          |
          v
    TableManager
          |
          v
    HierarchyManager
          |
          v
    MasterTelemetryService
          |
          v
    Vehicle Telemetry Storage

The service has two important responsibilities:

1. Create a persistent master telemetry buffer record.
2. Process that buffered packet into the final telemetry hierarchy.

It also manages:

    COMPLETED
    FAILED
    CLEANUP

states for the master telemetry buffer.

---

# 1. File Location

The implementation is located at:

    src/telemetry/services/MasterTelemetryService.js

Its documentation is located at:

    src/telemetry/services/ReadMe/MasterTelemetryService.md

The service depends on:

    src/config/telemetryDb.js

    src/telemetry/queries/query.js

    src/telemetry/managers/HierarchyManager.js

---

# 2. Purpose of MasterTelemetryService

The Master Telemetry Service acts as the central database-processing service for an incoming telemetry packet.

The basic flow is:

    Incoming Telemetry Packet
            |
            v
    Create Master Buffer Record
            |
            v
    PROCESSING
            |
            v
    Calculate Packet Weight
            |
            v
    Update Vehicle Cumulative
            |
            v
    Update Master Buffer
            |
            v
    Insert Vehicle Telemetry
            |
            v
    Process Hierarchy
            |
            v
    COMPLETED

If the processing fails:

    Master Buffer
          |
          v
       FAILED

The master telemetry record therefore provides a persistent checkpoint between telemetry ingestion and final processing.

---

# 3. Why the Master Telemetry Buffer Exists

The master telemetry table acts as a buffer between:

    Incoming telemetry

and:

    Final telemetry storage

A packet is first stored in:

    master_telemetry

with:

    processing_status = 'PROCESSING'

The packet can then be processed into the dynamic telemetry hierarchy.

This is important because the master record survives independently from the final transaction.

Therefore, if final processing fails, the original telemetry packet is still available for investigation or retry.

---

# 4. Dependencies

The service imports:

    const telemetryDb =
      require("../../config/telemetryDb");

This is the telemetry database connection.

It also imports:

    const queries =
      require("../queries/query");

This provides all SQL statements required by the service.

Finally:

    const hierarchyManager =
      require("../managers/HierarchyManager");

This connects the service to the dynamic hierarchy layer.

The dependency structure is:

    MasterTelemetryService
            |
            +--> telemetryDb
            |
            +--> queries
            |
            +--> HierarchyManager

---

# 5. Date Normalization

Before the service writes timestamps to PostgreSQL, it uses:

    toRawDate()

This helper normalizes incoming date values.

The function accepts:

    Date objects
    Strings
    Other date-compatible values

and converts valid values into:

    ISO timestamp strings

---

# 6. toRawDate()

The function begins with:

    if (!value) {
      return null;
    }

Therefore, if no date was provided, the function returns:

    null

This allows optional timestamps to remain nullable.

---

# 7. Date Object Handling

If the supplied value is already a JavaScript `Date`:

    value instanceof Date

the service verifies that the date is valid.

If:

    Number.isNaN(value.getTime())

is true, the function returns:

    null

Otherwise, it converts the date using:

    value.toISOString()

---

# 8. String Date Handling

If the value is not already a `Date`, the service attempts:

    const parsed = new Date(value);

It then validates the result.

Invalid dates return:

    null

Valid dates are converted to:

    parsed.toISOString()

This ensures the database receives a consistent timestamp representation.

---

# 9. createBufferPacket()

The first major service operation is:

    createBufferPacket(packet)

Its responsibility is to create the master telemetry buffer record.

This operation happens using:

    telemetryDb

rather than a transaction object.

This is intentional.

---

# 10. Master Buffer Creation Outside the Final Transaction

The service explicitly creates the master buffer:

    outside final transaction.

This is one of the most important design decisions in the telemetry pipeline.

The master record is inserted before the final database processing transaction.

Therefore:

    Incoming Packet
          |
          v
    Master Buffer
          |
          v
    Final Transaction

If the final transaction fails and rolls back, the master buffer remains.

---

# 11. Why Failed Packets Survive

Suppose a telemetry packet arrives.

The system first creates:

    master_telemetry
        processing_status = PROCESSING

Then final processing begins.

If processing succeeds:

    PROCESSING
        |
        v
    COMPLETED

If processing fails:

    PROCESSING
        |
        v
    FAILED

Because the master record was created outside the final transaction, the failed record is not removed by a transaction rollback.

This allows the system to preserve the original packet state.

---

# 12. Master Buffer SQL

The service calls:

    queries.insertMasterTelemetry()

The query inserts the telemetry packet into:

    master_telemetry

The values include:

    iotTimestamp
    receivedTimestamp
    rfidEpc
    citizenId
    wasteType
    latitude
    longitude
    wetWeight
    dryWeight
    otherWeight
    driverName
    vehicleNumber
    firmwareVersion
    unitNumber
    collectionType
    remarks
    errorCode
    citizenContact
    driverAction

The cumulative weight is initially handled separately.

---

# 13. Initial Processing Status

The master insert query creates the record with:

    processing_status = 'PROCESSING'

This means:

    "The packet has been received and stored,
     but final telemetry processing has not yet completed."

This status becomes the basis for later success and failure handling.

---

# 14. Master Telemetry ID

The insert query returns:

    id

The service converts it using:

    Number(result[0].id)

and stores it as:

    masterTelemetryId

This ID uniquely identifies the buffered telemetry packet.

The ID is then carried through the processing pipeline.

Conceptually:

    Packet
      |
      v
    master_telemetry
      |
      v
    masterTelemetryId
      |
      +--> Processing
      |
      +--> Completion
      |
      +--> Failure

---

# 15. processPacket()

The second major operation is:

    processPacket(
      tx,
      packet,
      vehicleTable,
      masterTelemetryId
    )

This method performs the actual final database processing.

It receives:

### tx

The active database transaction.

### packet

The incoming telemetry packet.

### vehicleTable

The dynamic vehicle telemetry table that should receive the telemetry.

### masterTelemetryId

The master buffer record associated with the packet.

---

# 16. Why processPacket Uses tx

Unlike `createBufferPacket()`, the final processing operations use:

    tx

This means the following operations participate in the same transaction:

    Vehicle cumulative update
    Master cumulative update
    Vehicle telemetry insert
    Hierarchy processing

This provides atomicity.

If one of these operations fails, the transaction can roll back.

---

# 17. Final Processing Sequence

The processing order is:

    Packet
      |
      v
    Calculate Current Weight
      |
      v
    Update Vehicle Cumulative
      |
      v
    Update Master Cumulative
      |
      v
    Insert Vehicle Telemetry
      |
      v
    Process Hierarchy
      |
      v
    Return Result

This sequence ensures that the cumulative weight stored in the vehicle telemetry record corresponds to the latest cumulative value.

---

# 18. Step 1 — Calculate Current Packet Weight

The service calculates:

    const currentWeight =
      Number(packet.wetWeight || 0) +
      Number(packet.dryWeight || 0) +
      Number(packet.otherWeight || 0);

Therefore:

    Current Weight =
        Wet Weight
        +
        Dry Weight
        +
        Other Weight

For example:

    wetWeight   = 10
    dryWeight   = 5
    otherWeight = 2

Then:

    currentWeight = 17

---

# 19. Why Missing Weight Values Become Zero

The calculation uses:

    || 0

Therefore a missing value does not produce an invalid arithmetic result.

For example:

    wetWeight   = 10
    dryWeight   = null
    otherWeight = 2

becomes:

    10 + 0 + 2

resulting in:

    12

This ensures cumulative calculations remain numeric.

---

# 20. Step 2 — Vehicle Cumulative Weight

The service then calls:

    queries.updateVehicleCumulative()

with:

    packet.vehicleNumber
    currentWeight

The cumulative table is:

    vehicle_cumulative

This table stores the accumulated waste weight for each vehicle.

The operation is effectively:

    Existing Vehicle Cumulative
              +
    Current Packet Weight
              |
              v
    New Vehicle Cumulative

---

# 21. Vehicle Cumulative Table

The cumulative table uses:

    vehicle_number

as its primary key.

It maintains:

    cumulative_weight

and:

    updated_at

The query uses:

    ON CONFLICT (vehicle_number)

to update an existing vehicle rather than creating duplicate vehicle records.

---

# 22. Cumulative Weight Result

The update query returns:

    cumulative_weight

The service converts the result to a JavaScript number:

    const cumulativeWeight =
      Number(
        cumulativeResult[0].cumulative_weight
      );

This becomes the cumulative value for the current packet.

---

# 23. Step 3 — Update Master Telemetry Cumulative

The service then updates the master buffer using:

    queries.updateMasterTelemetryCumulative()

with:

    cumulativeWeight
    masterTelemetryId

This means the master telemetry record now contains the cumulative weight associated with the packet.

The relationship becomes:

    masterTelemetryId
          |
          v
    master_telemetry
          |
          +--> cumulativeWeight

---

# 24. Why the Master Buffer Is Updated

The master buffer initially stores the raw packet.

The cumulative value is determined during processing.

Therefore:

    Initial Buffer
        |
        +--> Raw telemetry fields
        |
        +--> processing_status = PROCESSING
        |
        v
    Processing
        |
        v
    Calculate cumulative
        |
        v
    Update master record

The master record therefore becomes a useful representation of the processed packet state.

---

# 25. Step 4 — Insert Vehicle Telemetry

The service then calls:

    queries.insertVehicleTelemetry(
      vehicleTable
    );

The dynamic table name is supplied to the SQL factory.

The telemetry packet is then inserted into that specific vehicle/date table.

For example:

    vehicleTable:

        KA01AB1234_26082026

The packet is inserted into:

    KA01AB1234_26082026

---

# 26. Vehicle Telemetry Data

The insertion includes:

    iotTimestamp
    receivedTimestamp
    rfidEpc
    citizenId
    wasteType
    latitude
    longitude
    wetWeight
    dryWeight
    otherWeight
    cumulativeWeight
    driverName
    vehicleNumber
    firmwareVersion
    unitNumber
    collectionType
    remarks
    errorCode
    citizenContact
    driverAction

The important difference is that:

    cumulativeWeight

is now the calculated vehicle cumulative value.

---

# 27. Relationship Between Master and Vehicle Table

The packet therefore exists in two important places.

First:

    master_telemetry

Second:

    Dynamic Vehicle Telemetry Table

For example:

    master_telemetry
          |
          +--> id = 2399
          |
          v
    Vehicle:
        KA01AB1234
          |
          v
    KA01AB1234_26082026

The master record acts as the processing buffer and the vehicle table acts as the final daily telemetry storage location.

---

# 28. Step 5 — Process Hierarchy

After inserting the vehicle telemetry, the service calls:

    hierarchyManager.process(
      tx,
      packet.receivedTimestamp || new Date(),
      packet.vehicleNumber,
      vehicleTable
    );

This transfers responsibility to the hierarchy layer.

The hierarchy manager then ensures:

    Day Table
    Heartbeat Table
    Week Table
    Month Table
    Year Table

and registers the appropriate relationships.

---

# 29. Hierarchy Processing

The hierarchy operation can be represented as:

    Vehicle Telemetry
          |
          v
    HierarchyManager
          |
          +--> Day
          |
          +--> Heartbeat
          |
          +--> Week
          |
          +--> Month
          |
          +--> Year

The manager also connects the vehicle to the relevant day table.

---

# 30. Why Hierarchy Processing Happens Here

The service already knows:

    packet.receivedTimestamp
    packet.vehicleNumber
    vehicleTable

These are the key pieces of information required to connect the packet's physical telemetry table to the date-based hierarchy.

Therefore the service acts as the bridge between:

    Telemetry Processing

and:

    Telemetry Hierarchy

---

# 31. Hierarchy Result

The hierarchy manager returns:

    dayTable
    weekTable
    monthTable
    yearTable
    heartbeatTable

The service logs this result:

    Hierarchy Updated

This confirms that the hierarchy associated with the telemetry packet has been prepared.

---

# 32. processPacket() Return Value

After all processing succeeds, the service returns:

    {
      vehicleTable,
      cumulativeWeight,
      masterTelemetryId
    }

This gives the caller the three important processing results:

### Vehicle Table

The final dynamic telemetry table.

### Cumulative Weight

The updated vehicle cumulative weight.

### Master Telemetry ID

The persistent master buffer identifier.

---

# 33. Successful Processing

A successful packet therefore follows:

    Master Buffer
        |
        | PROCESSING
        v
    Calculate Weight
        |
        v
    Update Vehicle Cumulative
        |
        v
    Update Master Cumulative
        |
        v
    Insert Vehicle Telemetry
        |
        v
    Process Hierarchy
        |
        v
    Processing Complete

The service itself does not directly mark the master record as completed inside `processPacket()`.

That responsibility is handled separately.

---

# 34. markCompleted()

The service provides:

    markCompleted(
      masterTelemetryId
    )

This calls:

    queries.markMasterTelemetryCompleted()

The master record is then updated:

    processing_status = 'COMPLETED'

This represents successful processing.

The lifecycle becomes:

    PROCESSING
          |
          v
      COMPLETED

---

# 35. Why Completion Is Separate

Completion is intentionally separated from the final transaction processing.

The service first performs all required processing.

Only after the surrounding processing workflow confirms success should the master record be marked:

    COMPLETED

This creates a clear distinction between:

    "Processing operations completed"

and:

    "Master buffer officially marked completed."

---

# 36. markFailed()

The service also provides:

    markFailed(
      masterTelemetryId
    )

This calls:

    queries.markMasterTelemetryFailed()

and updates:

    processing_status = 'FAILED'

The lifecycle becomes:

    PROCESSING
          |
          v
        FAILED

This allows failed packets to remain visible in the master buffer.

---

# 37. Why Failed Records Are Preserved

A failed master telemetry record is valuable for:

    Debugging
    Monitoring
    Retry processing
    Failure analysis
    Operational auditing

Instead of deleting the packet after a processing error, the system preserves the record with:

    processing_status = FAILED

This provides traceability.

---

# 38. Master Telemetry Lifecycle

The complete lifecycle is:

    Incoming Packet
          |
          v
    createBufferPacket()
          |
          v
    PROCESSING
          |
          v
    processPacket()
        /     \
      SUCCESS  FAILURE
        |         |
        v         v
    COMPLETED   FAILED

This is one of the most important concepts in the telemetry service architecture.

---

# 39. cleanupCompletedBuffer()

The final major operation is:

    cleanupCompletedBuffer()

This calls:

    queries.cleanupCompletedMasterTelemetry()

The cleanup query removes old completed master telemetry records when the master buffer reaches its configured threshold.

The query is designed to delete completed records in batches rather than attempting to remove the entire buffer at once.

---

# 40. Why Cleanup Is Required

The master telemetry table is primarily a processing buffer.

If completed records were never removed, the table would continuously grow.

The architecture therefore follows:

    Receive
       |
       v
    Buffer
       |
       v
    Process
       |
       v
    Complete
       |
       v
    Retain temporarily
       |
       v
    Cleanup

This prevents the master buffer from growing indefinitely.

---

# 41. Cleanup Result

The cleanup query returns the number of deleted records.

The service logs:

    Master telemetry cleanup |
    deleted=<count>

and returns that value to the caller.

This allows the higher-level service or scheduled job to know how many records were removed.

---

# 42. MasterTelemetryService Responsibilities

The service can therefore be summarized as having five major responsibilities:

    1. BUFFER
       |
       +--> Store incoming telemetry

    2. PROCESS
       |
       +--> Calculate and persist telemetry

    3. CUMULATIVE
       |
       +--> Maintain vehicle cumulative weight

    4. STATUS
       |
       +--> COMPLETED / FAILED

    5. CLEANUP
       |
       +--> Remove old completed buffer records

---

# 43. Complete Service Flow

The complete Master Telemetry Service can be visualized as:

    Incoming Packet
          |
          v
    createBufferPacket()
          |
          v
    master_telemetry
          |
          | PROCESSING
          v
    processPacket()
          |
          +--> Calculate Weight
          |
          +--> Update Vehicle Cumulative
          |
          +--> Update Master Cumulative
          |
          +--> Insert Vehicle Telemetry
          |
          +--> Process Hierarchy
          |
          v
    Processing Result
          |
       +--+--+
       |     |
    Success Failure
       |     |
       v     v
    COMPLETED
             FAILED
       |
       v
    Cleanup Later

---

# 44. Connection to TableManager

`MasterTelemetryService` does not create the vehicle table itself.

The vehicle table is expected to already be available through the table-management layer.

The relationship is:

    TableManager
         |
         +--> Ensures vehicle table exists
         |
         v
    vehicleTable
         |
         v
    MasterTelemetryService
         |
         +--> Inserts telemetry

This keeps table creation separate from packet processing.

---

# 45. Connection to HierarchyManager

The service also does not directly create:

    day tables
    week tables
    month tables
    year tables
    heartbeat tables

Instead:

    MasterTelemetryService
            |
            v
    HierarchyManager
            |
            v
    MetadataManager
            |
            v
    Hierarchy Tables

This separation keeps the service focused on telemetry processing.

---

# 46. Connection to Query Factory

Every major database operation is delegated to:

    src/telemetry/queries/query.js

The service does not hard-code the SQL.

It calls query factory methods such as:

    insertMasterTelemetry()

    updateVehicleCumulative()

    updateMasterTelemetryCumulative()

    insertVehicleTelemetry()

    markMasterTelemetryCompleted()

    markMasterTelemetryFailed()

    cleanupCompletedMasterTelemetry()

Therefore:

    MasterTelemetryService
            |
            v
        query.js
            |
            v
        PostgreSQL

---

# 47. Transaction Boundary

The architecture intentionally separates:

    Buffer Creation

from:

    Final Processing

The boundary is:

    telemetryDb
        |
        v
    createBufferPacket()
        |
        | persistent buffer
        v
    ----------------------------
        FINAL TRANSACTION
    ----------------------------
        |
        +--> cumulative
        |
        +--> master update
        |
        +--> vehicle insert
        |
        +--> hierarchy
        |
    ----------------------------

This is important for failure recovery.

---

# 48. Example Processing

Suppose a packet contains:

    Vehicle:
        KA01AB1234

    Wet:
        10 kg

    Dry:
        5 kg

    Other:
        2 kg

The service calculates:

    Current Packet Weight
        =
    10 + 5 + 2
        =
    17 kg

If the vehicle previously had:

    250 kg

the new cumulative becomes:

    267 kg

The master telemetry record is updated with:

    cumulativeWeight = 267

The vehicle table receives:

    wetWeight = 10
    dryWeight = 5
    otherWeight = 2
    cumulativeWeight = 267

The hierarchy is then updated for the packet's date and vehicle.

---

# 49. Important Architectural Principle

The Master Telemetry Service does not represent just one database table.

It represents the **processing boundary of a telemetry packet**.

The packet travels through:

    MASTER BUFFER
          |
          v
    CUMULATIVE PROCESSING
          |
          v
    VEHICLE TELEMETRY
          |
          v
    HIERARCHY
          |
          v
    STATUS

This makes the service one of the central components of the telemetry architecture.

---

# 50. Error and Recovery Model

If processing fails after the master buffer is created:

    master_telemetry
        |
        +--> packet remains stored
        |
        +--> status can become FAILED

The final transaction can roll back:

    cumulative update
    master cumulative update
    vehicle telemetry insertion
    hierarchy updates

while the original master buffer remains available.

This creates a separation between:

    Original Packet Preservation

and:

    Final Database Processing

---

# 51. Complete Telemetry Architecture So Far

The documentation chain now represents:

    telemetry.schema.prisma
            |
            v
    queries/query.js
            |
            v
    initializeTelemetryDB.js
            |
            v
    managers/
            |
            +--> HierarchyManager.js
            |
            +--> MetadataManager.js
            |
            +--> TableManager.js
            |
            v
    services/
            |
            +--> MasterTelemetryService.js
            |
            +--> TelemetryPipelineService.js
            |
            +--> VehicleProcessorManager.js
            |
            v
    Complete Telemetry Pipeline

The Master Telemetry Service is the first major service in this chain.

---

# 52. Summary

`MasterTelemetryService.js` is responsible for managing the complete lifecycle of a telemetry packet at the database-processing level.

Its primary functions are:

    createBufferPacket()
        |
        +--> Create persistent master buffer

    processPacket()
        |
        +--> Process packet inside transaction

    markCompleted()
        |
        +--> Mark successful processing

    markFailed()
        |
        +--> Mark failed processing

    cleanupCompletedBuffer()
        |
        +--> Remove old completed buffer records

The central processing sequence is:

    PACKET
      |
      v
    MASTER BUFFER
      |
      v
    CURRENT WEIGHT
      |
      v
    VEHICLE CUMULATIVE
      |
      v
    MASTER CUMULATIVE
      |
      v
    VEHICLE TELEMETRY
      |
      v
    HIERARCHY
      |
      v
    COMPLETED / FAILED

This service therefore forms the core bridge between the telemetry packet and the dynamically structured telemetry database.

---

# 53. Next Step

The **Master Telemetry Service** is now understood.

Continue to:

    src/telemetry/services/ReadMe/TelemetryPipelineService.md

The next file explains the **Telemetry Pipeline Service**, which coordinates the broader telemetry-processing workflow and connects the master telemetry service with the vehicle-processing layer.

Follow the documentation chain:

    MasterTelemetryService.js
            |
            v
    TelemetryPipelineService.js
            |
            v
    VehicleProcessorManager.js

Continue with:

    src/telemetry/services/ReadMe/TelemetryPipelineService.md