# TelemetryPipelineService.js — Telemetry Processing Pipeline

This README explains the implementation of:

    src/telemetry/services/TelemetryPipelineService.js

`TelemetryPipelineService.js` is the **orchestration layer** of the SEWAC telemetry system.

It takes an incoming telemetry packet and coordinates the complete processing sequence between:

    Incoming Telemetry
            |
            v
    MasterTelemetryService
            |
            v
    MetadataManager
            |
            v
    TableManager
            |
            v
    Database Transaction
            |
            v
    Vehicle Telemetry
            |
            v
    Hierarchy
            |
            v
    COMPLETED / FAILED

Unlike `MasterTelemetryService`, which performs the actual database operations, the `TelemetryPipelineService` is responsible for deciding **when each operation happens and how failures are handled**.

---

# 1. File Location

The implementation is located at:

    src/telemetry/services/TelemetryPipelineService.js

Its documentation is located at:

    src/telemetry/services/ReadMe/TelemetryPipelineService.md

The service connects the following components:

    MasterTelemetryService
    TableManager
    MetadataManager
    telemetryDb

---

# 2. Purpose of TelemetryPipelineService

The main responsibility of this service is to coordinate the complete lifecycle of one telemetry packet.

The complete process is:

    Incoming Packet
          |
          v
    Create Master Buffer
          |
          v
    Validate Vehicle
          |
          v
    Create Dynamic Vehicle Table
          |
          v
    Execute Final Transaction
          |
          v
    Mark Master COMPLETED
          |
          v
    Cleanup Completed Buffer
          |
          v
        SUCCESS

If something fails:

    Incoming Packet
          |
          v
    Master Buffer
          |
          v
       FAILED
          |
          v
    VehicleProcessorManager
          |
          +--> Retry
          |
          +--> Do Not Retry

The pipeline therefore controls both **processing flow** and **failure classification**.

---

# 3. Dependencies

The service imports:

    const telemetryDb =
      require("../../config/telemetryDb");

This provides access to the telemetry PostgreSQL database and transaction system.

It also imports:

    const masterTelemetryService =
      require("./MasterTelemetryService");

This handles:

    Master Buffer Creation
    Packet Processing
    COMPLETED status
    FAILED status
    Buffer Cleanup

The service also imports:

    const tableManager =
      require("../managers/TableManager");

This handles dynamic vehicle table creation.

Finally:

    const metadataManager =
      require("../managers/MetadataManager");

This handles vehicle validation and vehicle-to-ward resolution.

The dependency structure is:

    TelemetryPipelineService
            |
            +--> telemetryDb
            |
            +--> MasterTelemetryService
            |
            +--> TableManager
            |
            +--> MetadataManager

---

# 4. The Main process() Method

The main method is:

    async process(packet)

It receives one complete telemetry packet.

The packet is then passed through the pipeline in a strict sequence.

The seven major stages are:

    STEP 1
    Create Master Buffer

    STEP 2
    Validate Vehicle

    STEP 3
    Create Dynamic Vehicle Table

    STEP 4
    Execute Final Transaction

    STEP 5
    Mark Master Completed

    STEP 6
    Cleanup Completed Buffer

    STEP 7
    Return Success

---

# 5. STEP 1 — Create Master Buffer First

The very first operation is:

    const masterTelemetryId =
      await masterTelemetryService.createBufferPacket(packet);

This creates a record in:

    master_telemetry

before any vehicle validation occurs.

This is a deliberate architectural decision.

---

# 6. Why the Master Buffer Is Created First

The service intentionally creates the master buffer **before validating the vehicle**.

This means even an invalid or unregistered vehicle produces a persistent master telemetry record.

The flow is:

    Incoming Packet
          |
          v
    master_telemetry
          |
          v
    Validate Vehicle

This provides a permanent record of rejected telemetry.

---

# 7. Rejected Vehicle Example

Suppose the incoming packet contains:

    vehicleNumber = "UNKNOWN123"

The vehicle may not exist in:

    vehicle_master

The system still first creates:

    master_telemetry
        processing_status = PROCESSING

Only after that does validation occur.

If validation fails:

    processing_status
          |
          v
       FAILED

The rejected packet is therefore not silently discarded.

---

# 8. Master Telemetry ID

The result of:

    createBufferPacket()

is:

    masterTelemetryId

This ID identifies the master buffer record throughout the rest of the pipeline.

The identifier flows through:

    createBufferPacket()
          |
          v
    masterTelemetryId
          |
          +--> processPacket()
          |
          +--> markFailed()
          |
          +--> markCompleted()
          |
          +--> cleanup lifecycle

---

# 9. STEP 2 — Validate Vehicle

After the master buffer exists, the pipeline validates the vehicle:

    await metadataManager.getVehicleWard(
      packet.vehicleNumber
    );

This checks the main database table:

    vehicle_master

The lookup is effectively:

    vehicle_id
          |
          v
       ward_no

The vehicle must be registered and have a valid ward.

---

# 10. Why Validation Happens Before Table Creation

The system intentionally validates the vehicle before creating its dynamic telemetry table.

The sequence is:

    Validate Vehicle
          |
          v
    Vehicle Registered?
          |
       YES
          |
          v
    Create Vehicle Table

This prevents invalid vehicle IDs from creating unnecessary telemetry tables.

---

# 11. Vehicle Validation Cache

The validation is performed through:

    MetadataManager

which maintains a vehicle-to-ward cache.

Therefore repeated packets for the same vehicle do not necessarily require repeated database lookups.

Conceptually:

    Vehicle Number
          |
          v
    MetadataManager
          |
          +--> Cache Hit
          |       |
          |       v
          |     Ward
          |
          +--> Cache Miss
                  |
                  v
              vehicle_master
                  |
                  v
                ward_no

This improves processing efficiency for high-frequency telemetry packets.

---

# 12. Permanent Unregistered Vehicle Error

If the vehicle does not exist, `MetadataManager` throws:

    UNREGISTERED_VEHICLE

The pipeline checks:

    error.code === "UNREGISTERED_VEHICLE"

This is treated as a **permanent error**.

A permanent error means the packet should not simply be retried because the underlying problem is not temporary.

---

# 13. Unregistered Vehicle Handling

When an unregistered vehicle is detected:

    Vehicle Validation
          |
          v
    UNREGISTERED_VEHICLE
          |
          v
    markFailed(masterTelemetryId)
          |
          v
    Throw Original Error

The master record is therefore changed to:

    FAILED

---

# 14. Why the Original Error Is Re-thrown

The pipeline deliberately does:

    throw error;

instead of creating a new generic error.

This is important because the next layer:

    VehicleProcessorManager

uses the error code to determine whether the packet should be retried.

The information flow is:

    MetadataManager
          |
          v
    UNREGISTERED_VEHICLE
          |
          v
    TelemetryPipelineService
          |
          v
    VehicleProcessorManager
          |
          v
    Do NOT Retry

---

# 15. Transient Database Errors

Not every vehicle lookup failure means the vehicle is unregistered.

For example, the lookup may fail because of:

    Database connection issue
    Temporary database failure
    Network problem
    PostgreSQL availability issue

These errors do not receive:

    UNREGISTERED_VEHICLE

Instead, the pipeline treats them as transient failures.

The master record is marked:

    FAILED

and the original error is re-thrown.

---

# 16. Permanent vs Transient Failure

The pipeline therefore distinguishes two categories:

### Permanent

    UNREGISTERED_VEHICLE

Result:

    FAILED
    No Retry

### Transient

    Database / Processing Error

Result:

    FAILED
    Retry Allowed

This distinction is extremely important to the telemetry processing system.

---

# 17. STEP 3 — Create Dynamic Vehicle Table

Only after vehicle validation succeeds does the pipeline call:

    tableManager.ensureVehicleTable(
      packet.vehicleNumber,
      packet.receivedTimestamp || new Date()
    );

This creates or verifies the dynamic vehicle telemetry table.

For example:

    Vehicle:
        KA01AB1234

    Date:
        26/08/2026

may produce:

    KA01AB1234_26082026

---

# 18. Why TableManager Is Called Here

The pipeline does not contain SQL for dynamic table creation.

Instead, it delegates the operation to:

    TableManager

The responsibility separation is:

    TelemetryPipelineService
            |
            | "I need a vehicle table"
            v
       TableManager
            |
            | "I will ensure it exists"
            v
    PostgreSQL

This keeps orchestration separate from table-management logic.

---

# 19. Dynamic Vehicle Table

The resulting table name is stored as:

    vehicleTable

The pipeline then passes this table name to the final processing stage.

The flow is:

    Vehicle Number
          |
          v
    TableManager
          |
          v
    vehicleTable
          |
          v
    MasterTelemetryService
          |
          v
    Insert Telemetry

---

# 20. STEP 4 — Final Database Transaction

After:

    Master Buffer Created
    Vehicle Validated
    Vehicle Table Ready

the pipeline begins the final database transaction.

It uses:

    telemetryDb.$transaction()

The transaction receives:

    tx

which is passed into:

    masterTelemetryService.processPacket()

---

# 21. What Happens Inside the Transaction

The transaction contains the actual final telemetry processing.

It performs:

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

All of these operations are coordinated through:

    MasterTelemetryService

and:

    HierarchyManager

---

# 22. Transaction Atomicity

The transaction provides atomic processing.

Conceptually:

    BEGIN TRANSACTION
          |
          +--> Vehicle Cumulative
          |
          +--> Master Cumulative
          |
          +--> Vehicle Telemetry
          |
          +--> Hierarchy
          |
    COMMIT

If any operation fails:

    BEGIN TRANSACTION
          |
          +--> Operation 1
          |
          +--> Operation 2
          |
          +--> FAILURE
          |
       ROLLBACK

This prevents partially processed telemetry from being committed.

---

# 23. Transaction Configuration

The transaction is configured with:

    maxWait: 10000

and:

    timeout: 10000

These values are in milliseconds.

Therefore:

    maxWait = 10 seconds

and:

    timeout = 10 seconds

The transaction must obtain a transaction slot within the configured wait time and complete within the configured execution timeout.

---

# 24. Transaction Failure

If the transaction throws an error, the pipeline enters its failure handler.

The master telemetry record is then marked:

    FAILED

using:

    masterTelemetryService.markFailed(
      masterTelemetryId
    );

The original transaction error is then re-thrown.

---

# 25. Why the Master Record Survives Transaction Failure

This is where the architecture becomes important.

The master buffer was created **before** the final transaction.

Therefore:

    Master Buffer
          |
          | outside transaction
          v
    Final Transaction
          |
          +--> FAILURE
          |
          v
       ROLLBACK

The rollback does not remove the master buffer.

The pipeline can therefore safely execute:

    markFailed(masterTelemetryId)

after the rollback.

---

# 26. Failure Flow

The transaction failure flow is:

    Final Transaction
          |
          v
        ERROR
          |
          v
    Transaction Rollback
          |
          v
    markFailed()
          |
          v
    FAILED
          |
          v
    throw error
          |
          v
    VehicleProcessorManager

The next layer decides whether the packet should be retried.

---

# 27. STEP 5 — Mark Master Buffer Completed

If the transaction succeeds, the pipeline proceeds to:

    masterTelemetryService.markCompleted(
      masterTelemetryId
    );

The master telemetry status changes:

    PROCESSING
          |
          v
    COMPLETED

This confirms that the final database transaction successfully committed.

---

# 28. Why Completion Happens After the Transaction

The order is intentional.

The pipeline does **not** mark the master record as completed before the transaction.

Instead:

    Transaction
        |
        v
    COMMIT
        |
        v
    markCompleted()

This prevents the system from reporting a packet as completed when its final telemetry operations have not actually committed.

---

# 29. Completion Status Failure

There is an important edge case.

The final transaction may succeed, but:

    markCompleted()

itself may fail.

The pipeline logs:

    Transaction succeeded but COMPLETED
    status update failed

and throws the status error.

It deliberately does **not** call:

    markFailed()

because the actual telemetry transaction has already committed.

This distinction prevents the system from incorrectly claiming that the telemetry database transaction failed.

---

# 30. Transaction Success vs Status Update Failure

These are two different conditions.

### Transaction Failure

    Final Transaction
          |
          v
        FAILED
          |
          v
    markFailed()

### Transaction Success but Status Update Failure

    Final Transaction
          |
          v
       COMMITTED
          |
          v
    markCompleted()
          |
          v
        ERROR

The second case is not equivalent to a transaction rollback.

---

# 31. STEP 6 — Cleanup Completed Buffer

Once the master record has been successfully marked:

    COMPLETED

the pipeline calls:

    masterTelemetryService.cleanupCompletedBuffer();

This removes eligible completed records from the master buffer.

The master telemetry table therefore acts as a controlled processing buffer rather than an ever-growing permanent store.

---

# 32. Why Cleanup Happens After Completion

The order is:

    Process
      |
      v
    Commit
      |
      v
    COMPLETED
      |
      v
    Cleanup

A packet is therefore not eligible for normal completed-buffer cleanup until the system has successfully processed it and marked it completed.

---

# 33. STEP 7 — Successful Completion

After all stages succeed, the service logs:

    TELEMETRY PIPELINE COMPLETED

and returns:

    result

The result originates from:

    masterTelemetryService.processPacket()

and contains:

    vehicleTable
    cumulativeWeight
    masterTelemetryId

---

# 34. Complete Pipeline

The entire service can be represented as:

    INCOMING TELEMETRY
            |
            v
    createBufferPacket()
            |
            v
    MASTER TELEMETRY
       PROCESSING
            |
            v
    Validate Vehicle
            |
       +----+----+
       |         |
    INVALID    VALID
       |         |
       v         v
    FAILED   Create Vehicle Table
                 |
                 v
          Final Transaction
                 |
          +------+------+
          |             |
       SUCCESS        FAILURE
          |             |
          v             v
    COMMIT           ROLLBACK
          |             |
          v             v
    COMPLETED        FAILED
          |
          v
       CLEANUP
          |
          v
       SUCCESS

---

# 35. Relationship With MasterTelemetryService

The relationship between these two services is:

    TelemetryPipelineService
            |
            | coordinates
            v
    MasterTelemetryService
            |
            +--> createBufferPacket()
            |
            +--> processPacket()
            |
            +--> markCompleted()
            |
            +--> markFailed()
            |
            +--> cleanupCompletedBuffer()

The important distinction is:

### TelemetryPipelineService

Controls:

    WHEN operations happen

### MasterTelemetryService

Controls:

    WHAT database processing happens

Therefore:

    Pipeline = Orchestration

    Master Service = Processing

---

# 36. Relationship With MetadataManager

The pipeline uses:

    metadataManager.getVehicleWard()

before creating the dynamic vehicle table.

The sequence is:

    Packet
      |
      v
    MetadataManager
      |
      v
    vehicle_master
      |
      v
    Vehicle + Ward Validation
      |
      v
    TableManager

This ensures the dynamic telemetry system only creates vehicle tables for registered vehicles.

---

# 37. Relationship With TableManager

After validation:

    TelemetryPipelineService
            |
            v
       TableManager
            |
            v
    ensureVehicleTable()
            |
            v
    Dynamic Vehicle Table
            |
            v
    MasterTelemetryService

The pipeline therefore ensures the physical storage destination exists before final telemetry processing begins.

---

# 38. Relationship With HierarchyManager

The pipeline itself does not directly call:

    HierarchyManager

Instead, the call happens through:

    MasterTelemetryService
            |
            v
    HierarchyManager
            |
            v
    MetadataManager
            |
            v
    Day / Week / Month / Year

Therefore the complete dependency chain becomes:

    TelemetryPipelineService
            |
            v
    MasterTelemetryService
            |
            v
    HierarchyManager
            |
            v
    MetadataManager

---

# 39. Complete Dependency Graph

The service architecture can be visualized as:

    TelemetryPipelineService
             |
       +-----+-----+----------------+
       |           |                |
       v           v                v
    Metadata   TableManager   MasterTelemetryService
    Manager                         |
       |                            |
       v                            +--> Queries
    vehicle_master                  |
                                    v
                              HierarchyManager
                                    |
                                    v
                              MetadataManager

The pipeline is therefore the coordinator connecting all major telemetry components.

---

# 40. Retry Architecture

One of the most important responsibilities of this service is preserving error information for the next layer.

The pipeline does not itself decide whether a packet should be retried.

Instead, it throws the original error.

The next layer:

    VehicleProcessorManager

interprets the error.

The logic is:

    Pipeline Error
          |
          v
    VehicleProcessorManager
          |
       +--+--+
       |     |
    Permanent Transient
       |       |
       v       v
    No Retry  Retry

This keeps retry policy separate from pipeline orchestration.

---

# 41. Permanent Failure Example

Example:

    vehicleNumber = "UNKNOWN123"

Flow:

    createBufferPacket()
          |
          v
    Validate Vehicle
          |
          v
    UNREGISTERED_VEHICLE
          |
          v
    markFailed()
          |
          v
    throw error
          |
          v
    VehicleProcessorManager
          |
          v
       NO RETRY

No vehicle telemetry table is created.

---

# 42. Transient Failure Example

Suppose:

    vehicle_master

cannot be reached temporarily.

Flow:

    createBufferPacket()
          |
          v
    Vehicle Validation
          |
          v
    Database Error
          |
          v
    markFailed()
          |
          v
    throw error
          |
          v
    VehicleProcessorManager
          |
          v
        RETRY

The distinction prevents permanent invalid packets from being retried indefinitely.

---

# 43. Why Vehicle Validation Happens Before Table Creation

Consider what would happen if table creation happened first.

An unknown vehicle could create:

    UNKNOWN123_26082026

before the system discovers that the vehicle is not registered.

That would create unnecessary database objects.

The current architecture prevents this:

    MASTER BUFFER
          |
          v
    VALIDATE VEHICLE
          |
          v
    CREATE TABLE

This is safer and cleaner.

---

# 44. Why Master Buffer Creation Happens Before Validation

The opposite decision is intentional.

The system wants rejected packets to remain observable.

Therefore:

    CREATE MASTER BUFFER
          |
          v
    VALIDATE VEHICLE

The architecture deliberately treats:

    Master Buffer

as the permanent entry checkpoint for telemetry processing.

---

# 45. The Two Important Ordering Rules

The service is built around two critical ordering rules.

### Rule 1

Master buffer first:

    Buffer
      |
      v
    Validation

This guarantees rejected packets are recorded.

### Rule 2

Vehicle table after validation:

    Validation
      |
      v
    Vehicle Table

This prevents unregistered vehicles from creating dynamic tables.

Together:

    Packet
      |
      v
    MASTER BUFFER
      |
      v
    VEHICLE VALIDATION
      |
      v
    VEHICLE TABLE
      |
      v
    FINAL PROCESSING

---

# 46. Complete Telemetry Lifecycle

A successful packet follows:

    1. Receive Packet
            |
            v
    2. Create Master Buffer
            |
            v
    3. Validate Vehicle
            |
            v
    4. Ensure Vehicle Table
            |
            v
    5. Start Transaction
            |
            v
    6. Calculate Cumulative
            |
            v
    7. Insert Vehicle Telemetry
            |
            v
    8. Update Hierarchy
            |
            v
    9. Commit Transaction
            |
            v
    10. Mark COMPLETED
            |
            v
    11. Cleanup
            |
            v
    12. Return Success

---

# 47. What This Service Does Not Do

`TelemetryPipelineService.js` intentionally does not directly implement:

    SQL table definitions

    Vehicle cumulative SQL

    Vehicle telemetry insertion SQL

    Hierarchy table creation

    Ward lookup SQL

    Retry scheduling

Instead, it delegates those responsibilities.

This keeps the architecture modular.

---

# 48. Separation of Responsibilities

The telemetry architecture can now be understood as:

    QUERY LAYER
        |
        +--> SQL definitions

    INITIALIZATION LAYER
        |
        +--> Database preparation

    MANAGER LAYER
        |
        +--> Dynamic tables
        +--> Metadata
        +--> Hierarchy

    SERVICE LAYER
        |
        +--> Processing
        +--> Orchestration
        +--> Failure handling

    PROCESSOR LAYER
        |
        +--> Retry / worker control

Each layer has a different responsibility.

---

# 49. Master Buffer State Machine

The master buffer lifecycle can be represented as:

                  Incoming Packet
                        |
                        v
                  +-----------+
                  | PROCESSING|
                  +-----------+
                        |
             +----------+----------+
             |                     |
             v                     v
        Successful              Failure
             |                     |
             v                     v
       +-----------+          +---------+
       | COMPLETED |          | FAILED  |
       +-----------+          +---------+
             |
             v
          Cleanup

An unregistered vehicle follows the failure branch immediately after validation.

---

# 50. Why This Is the Pipeline Orchestrator

`TelemetryPipelineService.js` is effectively the **traffic controller** for telemetry.

It determines:

    What happens first?
    What happens next?
    What must happen before table creation?
    What belongs inside the transaction?
    What happens after commit?
    Which errors are permanent?
    Which errors should reach the retry layer?

The individual managers and services perform the work, while this service controls the sequence.

---

# 51. Final Architecture

At this point, the telemetry architecture is:

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
    Complete Telemetry Processing

The pipeline service is the central orchestration point between the managers and the processing services.

---

# 52. Summary

`TelemetryPipelineService.js` coordinates the complete processing lifecycle of an incoming telemetry packet.

Its core responsibilities are:

    1. Create the master telemetry buffer.

    2. Validate the vehicle.

    3. Reject unregistered vehicles before
       creating dynamic vehicle tables.

    4. Ensure the correct vehicle telemetry table exists.

    5. Execute final telemetry processing
       inside a database transaction.

    6. Mark successfully processed packets
       as COMPLETED.

    7. Mark failed packets as FAILED.

    8. Preserve the original error so the
       processor layer can determine retry behavior.

    9. Clean up completed master buffer records.

The most important architectural flow is:

    INCOMING PACKET
          |
          v
    MASTER BUFFER
          |
          v
    VEHICLE VALIDATION
          |
          v
    DYNAMIC VEHICLE TABLE
          |
          v
    FINAL TRANSACTION
          |
          +--> Cumulative
          |
          +--> Vehicle Telemetry
          |
          +--> Hierarchy
          |
          v
       COMMIT
          |
          v
      COMPLETED
          |
          v
       CLEANUP

The pipeline therefore connects the previously documented database and manager layers to the final vehicle-processing stage.

---

# 53. Next Step

The **Telemetry Pipeline Service** is now understood.

Continue to:

    src/telemetry/services/ReadMe/VehicleProcessorManager.md

The next file explains the **VehicleProcessorManager**, which sits above the telemetry pipeline and controls the processing of vehicle telemetry packets, including:

    packet processing
          |
          v
    TelemetryPipelineService
          |
          v
    success / failure handling
          |
          v
    retry decisions
          |
          v
    worker-level telemetry flow

This is the next step required to understand how incoming telemetry is actually managed from the processor/worker level into the database pipeline.

Continue with:

    src/telemetry/services/ReadMe/VehicleProcessorManager.md