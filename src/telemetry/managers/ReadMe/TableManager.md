# TableManager.js — Dynamic Vehicle Telemetry Table Management

This README explains the implementation of:

    src/telemetry/managers/TableManager.js

`TableManager.js` is responsible for managing the **physical vehicle telemetry tables** inside the SEWAC Telemetry Database.

This is the layer where the telemetry architecture moves from:

    Metadata / Hierarchy

into:

    Actual Vehicle Telemetry Tables

The manager specifically handles the creation of dynamic tables for individual vehicles and dates.

---

# 1. File Location

The implementation is located at:

    src/telemetry/managers/TableManager.js

Its documentation is located at:

    src/telemetry/managers/ReadMe/TableManager.md

The manager uses:

    src/telemetry/queries/query.js

for the SQL required to create the vehicle telemetry table.

---

# 2. Purpose of TableManager

The primary responsibility of `TableManager` is to ensure that the required vehicle telemetry table exists before telemetry data is inserted into it.

The table is dynamically generated using:

    Vehicle Number
          +
    Packet Date

The resulting table name follows the format:

    <vehicleNumber>_<DDMMYYYY>

For example:

    Vehicle Number:
        KA01AB1234

    Packet Date:
        26 August 2026

    Generated Table:
        KA01AB1234_26082026

This means each vehicle receives a separate telemetry table for each day.

---

# 3. Position in the Telemetry Architecture

The manager layer can now be understood as:

    HierarchyManager
          |
          v
    MetadataManager
          |
          v
    TableManager
          |
          v
    SQL Factory
          |
          v
    PostgreSQL

The responsibilities are separated.

### HierarchyManager

Coordinates the complete telemetry hierarchy.

### MetadataManager

Manages hierarchy metadata, table naming, vehicle-to-ward mapping, and hierarchy registration.

### TableManager

Ensures the physical vehicle telemetry table exists.

### SQL Factory

Provides the SQL used to create the table.

### PostgreSQL

Stores the actual dynamically created table.

---

# 4. Database Dependency

`TableManager.js` imports:

    const telemetryDb =
      require("../../config/telemetryDb");

This is the database connection used to create the physical vehicle telemetry tables.

It also imports:

    const queries =
      require("../queries/query");

The SQL factory provides:

    queries.createVehicleTelemetryTable()

Therefore:

    TableManager
          |
          +--> telemetryDb
          |
          +--> queries
                    |
                    v
            createVehicleTelemetryTable()
                    |
                    v
                PostgreSQL

---

# 5. Vehicle Table Creation Promise Cache

The file maintains:

    const vehicleTableCreationPromises = new Map();

This is an in-memory map used to coordinate concurrent table creation.

The key is:

    tableName

The value is:

    creationPromise

This prevents multiple workers or requests from simultaneously trying to create the same dynamic vehicle table.

---

# 6. Why Promise Coordination Is Required

Telemetry data can arrive concurrently.

For example, several telemetry packets may arrive at almost exactly the same time for:

    Vehicle:
        KA01AB1234

    Date:
        26 August 2026

All of them will generate:

    KA01AB1234_26082026

Without coordination, several workers could independently attempt:

    CREATE TABLE IF NOT EXISTS "KA01AB1234_26082026"

Although PostgreSQL safely handles `IF NOT EXISTS`, there is still unnecessary duplicate work.

The promise map prevents this at the application level.

---

# 7. Concurrent Creation Flow

Suppose three telemetry processing operations request the same table.

The first request performs:

    ensureVehicleTable()
          |
          v
    Table does not have
    an active creation promise
          |
          v
    Start table creation
          |
          v
    Store Promise in Map

The second and third requests see:

    vehicleTableCreationPromises.has(tableName)

and wait for the existing operation.

Conceptually:

    Request 1
       |
       +------> CREATE TABLE
       |             |
       |             v
       |          Promise
       |             ^
       |             |
    Request 2 -------+
       |
    Request 3 -------+

Only the first request performs the creation operation.

The other requests wait for the same promise.

---

# 8. Vehicle Table Name Generation

The method:

    getVehicleTableName(
      vehicleNumber,
      packetDate = new Date()
    )

generates the dynamic vehicle telemetry table name.

The method extracts:

    DD
    MM
    YYYY

from the supplied packet date.

The format is:

    <vehicleNumber>_<DDMMYYYY>

---

# 9. Day Component

The day is generated using:

    const dd =
      String(packetDate.getDate())
        .padStart(2, "0");

This guarantees that single-digit days contain a leading zero.

For example:

    1

becomes:

    01

Therefore:

    1 August 2026

uses:

    01

instead of:

    1

---

# 10. Month Component

The month is generated using:

    const mm =
      String(packetDate.getMonth() + 1)
        .padStart(2, "0");

JavaScript months are zero-indexed.

Therefore:

    January = 0
    February = 1
    ...
    December = 11

The code adds:

    + 1

to convert the JavaScript month index into the normal calendar month.

For example:

    August

becomes:

    08

---

# 11. Year Component

The year is obtained using:

    const yyyy =
      packetDate.getFullYear();

For example:

    2026

remains:

    2026

---

# 12. Final Vehicle Table Name

The final table name is created using:

    return `${vehicleNumber}_${dd}${mm}${yyyy}`;

Therefore:

    Vehicle:
        KA01AB1234

    Date:
        26/08/2026

produces:

    KA01AB1234_26082026

This naming scheme allows the system to identify both:

    Which vehicle

and:

    Which day

the table represents.

---

# 13. Daily Vehicle Telemetry Architecture

Because the date is part of the table name, the architecture effectively creates:

    Vehicle A
        |
        +--> Vehicle A + Day 1
        +--> Vehicle A + Day 2
        +--> Vehicle A + Day 3
        +--> ...

For example:

    KA01AB1234_24082026
    KA01AB1234_25082026
    KA01AB1234_26082026

This keeps daily vehicle telemetry separated into individual physical tables.

---

# 14. ensureVehicleTable()

The primary method is:

    async ensureVehicleTable(
      vehicleNumber,
      packetDate = new Date()
    )

Its responsibility is simple:

    Make sure the correct vehicle telemetry table exists.

It performs the following sequence:

    1. Generate table name
    2. Check whether creation is already running
    3. Wait if another operation is creating it
    4. Otherwise start table creation
    5. Store the creation promise
    6. Execute the SQL
    7. Remove the promise
    8. Return the table name

---

# 15. Step 1 — Generate Table Name

The first operation is:

    const tableName =
      this.getVehicleTableName(
        vehicleNumber,
        packetDate
      );

This converts the vehicle and packet date into the physical PostgreSQL table name.

Example:

    vehicleNumber:
        KA01AB1234

    packetDate:
        26/08/2026

Result:

    KA01AB1234_26082026

---

# 16. Step 2 — Check Existing Creation Promise

The manager then checks:

    if (
      vehicleTableCreationPromises.has(tableName)
    )

This asks:

    "Is another operation already creating this table?"

If the answer is yes, the manager does not create another promise.

Instead, it waits:

    await vehicleTableCreationPromises.get(
      tableName
    );

After the existing operation completes, it returns:

    tableName

---

# 17. Why Waiting Is Important

The waiting mechanism creates synchronization between concurrent telemetry operations.

Without it:

    Request A
        |
        +--> Create Table

    Request B
        |
        +--> Create Table

    Request C
        |
        +--> Create Table

With the promise cache:

    Request A
        |
        +--> Create Table
        |
        +--> Promise
               ^
               |
    Request B --+
               |
    Request C --+

This means the application performs one creation operation and allows the other requests to reuse its result.

---

# 18. Step 3 — PostgreSQL Is the Source of Truth

If no creation promise exists, the manager creates a new promise:

    const creationPromise = (async () => {

The actual database operation is:

    await telemetryDb.$executeRawUnsafe(
      queries.createVehicleTelemetryTable(
        tableName
      )
    );

The SQL factory receives the dynamically generated table name.

The factory generates the corresponding:

    CREATE TABLE IF NOT EXISTS

statement.

---

# 19. CREATE TABLE IF NOT EXISTS

The SQL factory uses:

    CREATE TABLE IF NOT EXISTS

This is important because PostgreSQL remains the final source of truth.

Even if:

    the application cache does not know about a table

but:

    PostgreSQL already contains the table

the operation remains safe.

The architecture therefore uses two layers of protection:

    Application-Level Protection
            |
            v
    Promise Cache
            |
            v
    Database-Level Protection
            |
            v
    CREATE TABLE IF NOT EXISTS

---

# 20. Application Cache vs Database Source of Truth

The promise map is not treated as permanent database state.

It only exists during an active creation operation.

PostgreSQL remains authoritative.

This distinction is important:

    vehicleTableCreationPromises
            |
            +--> Temporary synchronization

    PostgreSQL
            |
            +--> Permanent table state

The application cache therefore does not replace database validation.

---

# 21. Successful Table Creation

When the table creation succeeds, the manager logs:

    Dynamic Vehicle Table Ready: <tableName>

For example:

    Dynamic Vehicle Table Ready:
    KA01AB1234_26082026

The operation then completes.

---

# 22. Promise Cleanup

The creation operation contains:

    finally {
      vehicleTableCreationPromises.delete(
        tableName
      );
    }

This is extremely important.

Whether table creation succeeds or fails, the promise is removed.

Therefore, the map does not retain stale promises.

The lifecycle is:

    Start
      |
      v
    Add Promise
      |
      v
    Execute CREATE TABLE
      |
      v
    Success / Failure
      |
      v
    Delete Promise
      |
      v
    Finish

---

# 23. Why finally Is Used

Using:

    finally

ensures cleanup happens even if PostgreSQL throws an error.

Without `finally`, a failed operation could potentially leave an old rejected promise in the map.

Future requests could then incorrectly wait on that stale operation.

The implementation avoids that by always executing:

    vehicleTableCreationPromises.delete(
      tableName
    );

---

# 24. Await Creation

After storing the promise:

    vehicleTableCreationPromises.set(
      tableName,
      creationPromise
    );

the manager waits for it:

    await creationPromise;

This guarantees that when `ensureVehicleTable()` returns, the physical table creation operation has completed.

---

# 25. Return Value

The method finally returns:

    return tableName;

This means the caller receives the exact physical table name that is ready for telemetry insertion.

For example:

    KA01AB1234_26082026

The caller can then use that name for subsequent telemetry operations.

---

# 26. Complete Execution Flow

The complete process is:

    ensureVehicleTable(
        vehicleNumber,
        packetDate
    )
            |
            v
    Generate Table Name
            |
            v
    <vehicle>_<DDMMYYYY>
            |
            v
    Is creation already running?
          /       \
        YES        NO
        |           |
        v           v
      Wait       Create Promise
        |           |
        |           v
        |       Execute SQL
        |           |
        |           v
        |       PostgreSQL
        |           |
        |           v
        |       Delete Promise
        |           |
        +-----+-----+
              |
              v
        Return Table Name

---

# 27. Relationship With Query Factory

The manager does not contain the SQL definition of the vehicle telemetry table.

Instead, it calls:

    queries.createVehicleTelemetryTable(
      tableName
    );

The SQL factory is responsible for generating the SQL.

This keeps the architecture separated:

    TableManager
          |
          | table name
          v
    SQL Factory
          |
          | CREATE TABLE SQL
          v
    PostgreSQL

To understand the actual schema of the dynamically created vehicle telemetry tables, refer back to:

    src/telemetry/queries/ReadMe/query.md

That documentation explains the SQL factory and the structure of the tables it creates.

---

# 28. Relationship With MetadataManager

`TableManager` sits underneath the metadata and hierarchy layers.

Conceptually:

    HierarchyManager
          |
          v
    MetadataManager
          |
          v
    TableManager
          |
          v
    Dynamic Vehicle Table
          |
          v
    PostgreSQL

`MetadataManager` handles the hierarchy and metadata relationships.

`TableManager` handles the physical vehicle telemetry table.

This distinction is important.

---

# 29. Vehicle Telemetry vs Heartbeat

The telemetry architecture separates:

    Vehicle Telemetry

from:

    Vehicle Heartbeat

The vehicle telemetry table is managed by:

    TableManager

The heartbeat table is managed through:

    MetadataManager

The relationship is:

    Vehicle
       |
       +----------------------+
       |                      |
       v                      v
    Telemetry              Heartbeat
       |                      |
       v                      v
    TableManager         MetadataManager

This keeps the two types of vehicle data logically separated.

---

# 30. Dynamic Table Hierarchy

At this point, the entire physical hierarchy can be visualized as:

    YEAR
      |
      v
    MONTH
      |
      v
    WEEK
      |
      v
    DAY
      |
      +-------------------------+
      |                         |
      v                         v
    VEHICLE                 HEARTBEAT
      |
      v
    VEHICLE TELEMETRY TABLE

The `TableManager` is responsible specifically for the final:

    VEHICLE → TELEMETRY TABLE

layer.

---

# 31. Example

Suppose the telemetry system receives a packet from:

    Vehicle:
        KA01AB1234

on:

    Date:
        26 August 2026

`TableManager` generates:

    KA01AB1234_26082026

It then checks whether another worker is currently creating that table.

If not, it executes the SQL factory:

    queries.createVehicleTelemetryTable(
      "KA01AB1234_26082026"
    );

PostgreSQL then ensures that the table exists.

The manager returns:

    KA01AB1234_26082026

The telemetry processing pipeline can then use that table for the packet's telemetry data.

---

# 32. Concurrency Protection

There are two levels of concurrency protection in this design.

### Level 1 — Application

The map:

    vehicleTableCreationPromises

prevents duplicate simultaneous creation work inside the application process.

### Level 2 — Database

The SQL uses:

    CREATE TABLE IF NOT EXISTS

which allows PostgreSQL to safely handle cases where the table already exists.

Therefore:

    Application
        |
        v
    Promise Coordination
        |
        v
    PostgreSQL
        |
        v
    IF NOT EXISTS

Both levels work together.

---

# 33. Important Design Principle

The promise cache should not be interpreted as permanent knowledge that a table exists.

It only means:

    "A table creation operation for this table
     is currently in progress."

Once that operation completes:

    vehicleTableCreationPromises.delete(tableName)

The map no longer contains the entry.

If the table is needed later, PostgreSQL remains the authoritative source.

---

# 34. Error Behaviour

If the PostgreSQL table creation fails:

    telemetryDb.$executeRawUnsafe(...)

throws an error.

The `finally` block still removes the creation promise.

The error is then propagated to the caller because the creation promise is awaited.

Therefore:

    PostgreSQL Error
          |
          v
    creationPromise rejects
          |
          v
    Promise removed
          |
          v
    Error propagated
          |
          v
    Higher-Level Telemetry Handler

The manager does not silently hide database errors.

---

# 35. Responsibilities of TableManager

The complete responsibility of `TableManager.js` can be summarized as:

    TABLE NAMING
        |
        +--> Vehicle + Date

    TABLE CREATION
        |
        +--> Dynamic Vehicle Telemetry Table

    CONCURRENCY CONTROL
        |
        +--> Promise-based creation coordination

    DATABASE SAFETY
        |
        +--> CREATE TABLE IF NOT EXISTS

    CLEANUP
        |
        +--> Remove completed creation promises

    OUTPUT
        |
        +--> Return ready table name

---

# 36. What TableManager Does Not Do

`TableManager.js` does not:

- Resolve the vehicle's ward
- Manage day/week/month/year hierarchy
- Register vehicles into day tables
- Register days into weeks
- Register weeks into months
- Register months into years
- Process telemetry packets
- Insert telemetry records

Those responsibilities belong to other layers.

The Table Manager focuses specifically on:

    Ensuring the physical vehicle telemetry table exists.

---

# 37. Manager Layer Relationship

The three managers can now be understood together.

    HierarchyManager
            |
            | Coordinates
            v
    MetadataManager
            |
            | Manages metadata / hierarchy
            v
    TableManager
            |
            | Creates physical vehicle table
            v
    SQL Factory
            |
            v
    PostgreSQL

More specifically:

    HierarchyManager
        |
        +--> Day
        +--> Heartbeat
        +--> Week
        +--> Month
        +--> Year
        |
        v
    MetadataManager
        |
        +--> Vehicle → Ward
        +--> Hierarchy Registration
        |
        v
    TableManager
        |
        +--> Vehicle Telemetry Table
        |
        v
    PostgreSQL

---

# 38. Complete Telemetry Table Structure

The resulting architecture can therefore be represented as:

    year_YYYY
        |
        +--> month_MMYYYY
                |
                +--> week_WW_YYYY
                        |
                        +--> day_DDMMYYYY
                                |
                                +--> vehicle_number
                                        |
                                        +--> vehicle telemetry table
                                        |
                                        +--> heartbeat table
                                        |
                                        +--> ward information

The exact metadata relationships are maintained by `MetadataManager`, while the physical vehicle telemetry table is created by `TableManager`.

---

# 39. Why Dynamic Tables Are Used

The system does not store every vehicle's telemetry in one continuously growing vehicle table.

Instead, it dynamically creates tables based on:

    Vehicle
       +
    Date

For example:

    VEHICLE_A_25082026
    VEHICLE_A_26082026

and:

    VEHICLE_B_25082026
    VEHICLE_B_26082026

This creates a partition-like organization at the application table level.

The higher-level hierarchy then provides access to those tables through:

    Year
      |
      Month
        |
        Week
          |
          Day
            |
            Vehicle

---

# 40. Final Architecture

The telemetry architecture now becomes:

    telemetry.schema.prisma
            |
            v
    queries/query.js
            |
            v
    initializeTelemetryDB.js
            |
            v
    HierarchyManager.js
            |
            v
    MetadataManager.js
            |
            v
    TableManager.js
            |
            v
    Dynamic Vehicle Telemetry Tables
            |
            v
    PostgreSQL
            |
            v
    Telemetry Services
            |
            v
    Complete Telemetry Pipeline

Each layer has a distinct responsibility.

---

# 41. Summary

`TableManager.js` is the physical dynamic-table creation layer of the SEWAC Telemetry architecture.

Its primary operation is:

    ensureVehicleTable()

The process is:

    Vehicle Number
          +
    Packet Date
          |
          v
    Generate Table Name
          |
          v
    Check Creation Promise
          |
          v
    Coordinate Concurrent Requests
          |
          v
    Execute CREATE TABLE IF NOT EXISTS
          |
          v
    PostgreSQL
          |
          v
    Return Table Name

The manager therefore provides a safe and concurrency-aware mechanism for creating the daily telemetry table belonging to a specific vehicle.

---

# 42. Next Step

The **manager layer** is now fully understood:

    src/telemetry/managers/

        HierarchyManager.js
              |
              v
        MetadataManager.js
              |
              v
        TableManager.js

These managers are responsible for creating, maintaining, and registering the dynamic telemetry hierarchy and the physical vehicle telemetry tables.

The next part of the telemetry architecture is the **service layer**.

Continue to:

    src/telemetry/services/

Inside this directory, the telemetry processing logic is divided across the following services:

    src/telemetry/services/

        ReadMe/
            |
            +--> MasterTelemetryService.md
            +--> TelemetryPipelineService.md
            +--> VehicleProcessorManager.md

        MasterTelemetryService.js
        TelemetryPipelineService.js
        VehicleProcessorManager.js

Read the service documentation in the following order:

---

## 1. MasterTelemetryService.js

Continue first to:

    src/telemetry/services/ReadMe/MasterTelemetryService.md

This file explains the role of the **Master Telemetry Service** and how incoming telemetry is initially handled through the master telemetry layer.

---

## 2. TelemetryPipelineService.js

After understanding the master telemetry service, continue to:

    src/telemetry/services/ReadMe/TelemetryPipelineService.md

This file explains how telemetry moves through the processing pipeline and how the different telemetry components are coordinated.

---

## 3. VehicleProcessorManager.js

Finally, continue to:

    src/telemetry/services/ReadMe/VehicleProcessorManager.md

This file explains how individual vehicle telemetry is processed, including the connection between the incoming packet, the dynamically generated vehicle table, the hierarchy, and the final telemetry storage process.

---

# Documentation Chain

The documentation path now continues as:

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
    Complete Telemetry Processing Pipeline

The **service layer is the next major stage** because this is where the database foundation and dynamic table hierarchy become part of the actual telemetry-processing workflow.

Continue with:

    src/telemetry/services/ReadMe/MasterTelemetryService.md

to begin understanding how telemetry enters and moves through the service layer.