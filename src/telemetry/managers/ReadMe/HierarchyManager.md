# HierarchyManager.js — Telemetry Hierarchy Processing

This README explains the responsibility and execution flow of:

    src/telemetry/managers/HierarchyManager.js

`HierarchyManager.js` is responsible for coordinating the creation and registration of the complete SEWAC telemetry table hierarchy for a telemetry packet.

It acts as an orchestration layer.

It does not directly contain the SQL required to create the tables.

Instead, it delegates the actual metadata and table-management operations to:

    MetadataManager.js

The overall relationship is:

    Telemetry Packet
          |
          v
    HierarchyManager
          |
          v
    MetadataManager
          |
          v
    Dynamic Tables + Metadata
          |
          v
    Complete Telemetry Hierarchy

---

# 1. File Location

The implementation is located at:

    src/telemetry/managers/HierarchyManager.js

Its corresponding documentation is:

    src/telemetry/managers/ReadMe/HierarchyManager.md

---

# 2. Purpose of HierarchyManager

The main responsibility of `HierarchyManager` is to make sure that all required levels of the telemetry hierarchy exist for a particular telemetry packet.

The hierarchy consists of:

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
      v
    VEHICLE
      |
      +----------------+
      |                |
      v                v
    TELEMETRY       HEARTBEAT

For every telemetry packet, the manager coordinates the creation or retrieval of:

    Day Table
    Heartbeat Table
    Week Table
    Month Table
    Year Table

It then registers these tables together with the vehicle information.

---

# 3. Dependency

`HierarchyManager.js` imports:

    const metadataManager = require("./MetadataManager");

This means `HierarchyManager` depends on `MetadataManager` to perform the actual table and metadata operations.

The separation of responsibilities is important.

`HierarchyManager` decides:

    WHAT needs to be processed
    IN WHAT sequence it should be processed

`MetadataManager` handles:

    HOW the individual hierarchy elements are ensured
    HOW they are registered

Therefore:

    HierarchyManager
          |
          | orchestration
          v
    MetadataManager
          |
          | table / metadata operations
          v
    PostgreSQL

---

# 4. Hierarchy Processing Method

The main method in the class is:

    async process(tx, packetDate, vehicleNumber, vehicleTable)

This method performs the complete hierarchy processing operation.

It receives four important parameters.

---

## 4.1 tx

    tx

represents the database transaction being used for the hierarchy operation.

The same transaction is passed to every `MetadataManager` operation.

This is important because all hierarchy-related operations should participate in the same database transaction.

Conceptually:

    Transaction
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
        |
        +--> Registration

If the surrounding transaction fails, the database can roll back the related operations together.

---

## 4.2 packetDate

    packetDate

represents the date associated with the telemetry packet.

The date is used to determine which:

    Day
    Week
    Month
    Year

tables are required.

For example, the same `packetDate` is passed to:

    ensureDayTable()
    ensureWeekTable()
    ensureMonthTable()
    ensureYearTable()

This ensures that all time-based hierarchy levels correspond to the same telemetry event.

---

## 4.3 vehicleNumber

    vehicleNumber

identifies the vehicle associated with the telemetry packet.

It is used when creating or locating the vehicle-specific heartbeat table.

The vehicle number is also passed to the final hierarchy registration step.

---

## 4.4 vehicleTable

    vehicleTable

represents the vehicle telemetry table associated with the packet.

This table is registered into the day-level hierarchy along with the heartbeat table.

The relationship is therefore:

    Vehicle
       |
       +--> vehicleTable
       |
       +--> heartbeatTable

---

# 5. Processing Sequence

The `process()` method follows a deliberate sequence:

    1. Day Table
    2. Heartbeat Table
    3. Week Table
    4. Month Table
    5. Year Table
    6. Register Complete Hierarchy
    7. Return Hierarchy

The implementation therefore acts as a coordinator for the complete hierarchy.

---

# 6. Step 1 — Ensure Day Table

The first operation is:

    const dayTable =
      await metadataManager.ensureDayTable(
        tx,
        packetDate
      );

The `packetDate` determines which day table is required.

The result is stored in:

    dayTable

Conceptually:

    packetDate
        |
        v
    ensureDayTable()
        |
        v
    Day Table

The Day Table represents the daily level of the telemetry hierarchy.

It is also the level where vehicle telemetry and heartbeat table references are registered.

---

# 7. Why the Day Table Is Important

The day table acts as the connection between a particular day and the vehicles operating on that day.

Conceptually:

    DAY TABLE
        |
        +--> Vehicle A
        |      |
        |      +--> Telemetry Table
        |      +--> Heartbeat Table
        |
        +--> Vehicle B
               |
               +--> Telemetry Table
               +--> Heartbeat Table

The `HierarchyManager` obtains this table first because the vehicle-level registration eventually belongs to this daily hierarchy.

---

# 8. Step 2 — Ensure Heartbeat Table

The second operation is:

    const heartbeatTable =
      await metadataManager.ensureHeartbeatTable(
        tx,
        vehicleNumber,
        packetDate
      );

This creates or retrieves the heartbeat table associated with the vehicle and packet date.

The inputs are:

    tx
    vehicleNumber
    packetDate

The result is stored in:

    heartbeatTable

Conceptually:

    Vehicle Number
          +
    Packet Date
          |
          v
    ensureHeartbeatTable()
          |
          v
    Vehicle Heartbeat Table

This allows heartbeat information to be stored separately from the main waste telemetry data.

---

# 9. Step 3 — Ensure Week Table

The third operation is:

    const weekTable =
      await metadataManager.ensureWeekTable(
        tx,
        packetDate
      );

The packet date determines the appropriate week table.

The result is stored in:

    weekTable

The hierarchy is therefore beginning to take shape:

    WEEK
      |
      v
    DAY
      |
      v
    VEHICLE

The `HierarchyManager` does not calculate the table itself.

It delegates that responsibility to:

    metadataManager.ensureWeekTable()

---

# 10. Step 4 — Ensure Month Table

The fourth operation is:

    const monthTable =
      await metadataManager.ensureMonthTable(
        tx,
        packetDate
      );

The packet date is again used to determine the appropriate month.

The result is stored in:

    monthTable

The hierarchy now contains:

    MONTH
      |
      v
    WEEK
      |
      v
    DAY

The manager is progressively building the complete time hierarchy required for the packet.

---

# 11. Step 5 — Ensure Year Table

The fifth operation is:

    const yearTable =
      await metadataManager.ensureYearTable(
        tx,
        packetDate
      );

The packet date determines the appropriate year table.

The result is stored in:

    yearTable

The complete time hierarchy is now represented as:

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

---

# 12. Step 6 — Register Complete Hierarchy

After all required hierarchy components have been ensured, the manager performs:

    await metadataManager.registerHierarchy(tx, {
      dayTable,
      weekTable,
      monthTable,
      yearTable,
      vehicleNumber,
      vehicleTable,
      heartbeatTable,
    });

This is the point where the individual pieces are connected.

The manager sends the complete hierarchy information to:

    MetadataManager

The registration object contains:

    dayTable
    weekTable
    monthTable
    yearTable
    vehicleNumber
    vehicleTable
    heartbeatTable

This allows the metadata layer to establish the relationships between the different levels.

---

# 13. Complete Registration Relationship

The registration can conceptually be represented as:

    YEAR
      |
      +--> yearTable
              |
              v
            MONTH
              |
              +--> monthTable
                      |
                      v
                     WEEK
                      |
                      +--> weekTable
                              |
                              v
                              DAY
                              |
                              +--> dayTable
                                      |
                                      +--> vehicleNumber
                                      |
                                      +--> vehicleTable
                                      |
                                      +--> heartbeatTable

The exact table names and database operations are handled by the lower-level manager.

`HierarchyManager` simply gathers the required information and sends it to the registration operation.

---

# 14. Step 7 — Return Hierarchy

After registration succeeds, the method returns:

    return {
      dayTable,
      weekTable,
      monthTable,
      yearTable,
      heartbeatTable,
    };

This gives the caller the resulting hierarchy information.

The returned object contains:

    dayTable
    weekTable
    monthTable
    yearTable
    heartbeatTable

Notice that `vehicleTable` is not returned.

It is used as part of the registration process, while the returned object represents the hierarchy tables that were ensured during this operation.

---

# 15. Complete Execution Flow

The complete method can be understood as:

    process(
        tx,
        packetDate,
        vehicleNumber,
        vehicleTable
    )
            |
            v
    ensureDayTable()
            |
            v
    dayTable
            |
            v
    ensureHeartbeatTable()
            |
            v
    heartbeatTable
            |
            v
    ensureWeekTable()
            |
            v
    weekTable
            |
            v
    ensureMonthTable()
            |
            v
    monthTable
            |
            v
    ensureYearTable()
            |
            v
    yearTable
            |
            v
    registerHierarchy()
            |
            v
    Return hierarchy