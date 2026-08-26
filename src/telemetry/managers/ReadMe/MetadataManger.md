# MetadataManager.js — Telemetry Metadata and Hierarchy Management

This README explains the implementation of:

    src/telemetry/managers/MetadataManager.js

`MetadataManager.js` is responsible for managing the metadata and database relationships required by the SEWAC Telemetry hierarchy.

It sits below `HierarchyManager.js` and provides the actual operations required to:

- Create or ensure hierarchy tables
- Generate dynamic table names
- Resolve a vehicle to its ward
- Cache vehicle-to-ward mappings
- Create heartbeat tables
- Register vehicles inside day tables
- Register days inside weeks
- Register weeks inside months
- Register months inside years
- Register the complete telemetry hierarchy

The relationship with the previous manager is:

    HierarchyManager
          |
          v
    MetadataManager
          |
          v
    Table / SQL Operations
          |
          v
    PostgreSQL

---

# 1. File Location

The implementation is located at:

    src/telemetry/managers/MetadataManager.js

Its documentation is located at:

    src/telemetry/managers/ReadMe/MetadataManager.md

This file is called by:

    src/telemetry/managers/HierarchyManager.js

---

# 2. Purpose of MetadataManager

`MetadataManager` provides the lower-level operations required by `HierarchyManager`.

While `HierarchyManager` coordinates the overall process:

    DAY
      ↓
    HEARTBEAT
      ↓
    WEEK
      ↓
    MONTH
      ↓
    YEAR
      ↓
    REGISTER

`MetadataManager` actually performs the individual operations.

The relationship is:

    HierarchyManager.process()
             |
             +--> ensureDayTable()
             |
             +--> ensureHeartbeatTable()
             |
             +--> ensureWeekTable()
             |
             +--> ensureMonthTable()
             |
             +--> ensureYearTable()
             |
             +--> registerHierarchy()
                         |
                         +--> register vehicle
                         +--> register day
                         +--> register week
                         +--> register month

All of these operations are implemented by `MetadataManager`.

---

# 3. Database Dependencies

The file imports two database connections:

    const telemetryDb = require("../../config/telemetryDb");
    const mainDb = require("../../config/mainDb");

It also imports the SQL factory:

    const queries = require("../queries/query");

There are therefore three important database-related components:

    MetadataManager
          |
          +------------------+
          |                  |
          v                  v
      telemetryDb          mainDb
          |                  |
          |                  |
          v                  v
    Telemetry DB        Main Application DB

The SQL factory is then used for telemetry database operations:

    MetadataManager
          |
          v
       queries
          |
          v
    PostgreSQL

---

# 4. Why Two Databases Are Used

The Metadata Manager interacts with two different database contexts.

## Telemetry Database

The telemetry database contains the dynamically generated telemetry hierarchy.

It is accessed through:

    telemetryDb

The transaction object:

    tx

is also used for operations that are part of the telemetry transaction.

---

## Main Database

The main database contains vehicle master information.

It is accessed through:

    mainDb

The vehicle master table is queried to determine the ward associated with a vehicle.

The relationship is:

    Vehicle Number
          |
          v
    mainDb
          |
          v
    vehicle_master
          |
          v
    ward_no
          |
          v
    Telemetry Hierarchy

This allows the telemetry system to associate vehicle telemetry with the correct ward.

---

# 5. Vehicle → Ward Cache

The file creates:

    const vehicleWardCache = new Map();

This is an in-memory cache storing the relationship:

    Vehicle Number → Ward Number

For example:

    VEHICLE_001 → Ward 12
    VEHICLE_002 → Ward 7
    VEHICLE_003 → Ward 21

Once a vehicle's ward has been resolved, the value is stored in the cache.

This avoids repeatedly querying the main database for the same vehicle.

---

# 6. Vehicle Ward Promise Cache

The file also creates:

    const vehicleWardPromises = new Map();

This is different from the normal vehicle ward cache.

The purpose is to prevent duplicate simultaneous database requests for the same vehicle.

Consider multiple telemetry packets arriving at nearly the same time for:

    VEHICLE_001

Without this mechanism, several requests could independently execute:

    SELECT ward_no
    FROM vehicle_master
    WHERE vehicle_id = 'VEHICLE_001'

Instead, the first request creates a lookup promise.

Other requests can wait for the same promise.

Conceptually:

    Request 1
        |
        +----> Database Lookup
        |
        +----> Promise
                 ^
                 |
    Request 2 ----+
                 |
    Request 3 ----+

This reduces duplicate database lookups during concurrent telemetry processing.

---

# 7. UnregisteredVehicleError

The file defines a custom error:

    class UnregisteredVehicleError extends Error

This error represents a permanent vehicle validation failure.

The constructor receives:

    vehicleNumber

and optionally:

    reason

The default reason is:

    Vehicle not registered

The resulting error contains:

    name
    code
    vehicleNumber
    isPermanent

The code is:

    UNREGISTERED_VEHICLE

and:

    isPermanent = true

This allows the telemetry pipeline to distinguish an invalid/unregistered vehicle from a temporary database or network error.

---

# 8. Why Permanent Errors Matter

A telemetry packet associated with an unregistered vehicle should not necessarily be retried indefinitely.

The distinction is:

    Temporary Error
          |
          v
       Retry may work

versus:

    Unregistered Vehicle
          |
          v
       Permanent Error
          |
          v
       Retry will not
       fix registration

The custom error communicates this distinction to the higher-level telemetry processing system.

---

# 9. Generic Table Creation

The first major method is:

    async ensureTable(tx, tableName, createQuery)

This method provides a reusable mechanism for creating a table.

It receives:

    tx
    tableName
    createQuery

It then executes:

    await tx.$executeRawUnsafe(
      createQuery(tableName)
    );

The SQL factory function is supplied as:

    createQuery

For example:

    queries.createDayTable

or:

    queries.createWeekTable

or:

    queries.createMonthTable

or:

    queries.createYearTable

The method then logs:

    Hierarchy table ready: <tableName>

and returns:

    tableName

This avoids repeating the same table-creation logic for every hierarchy level.

---

# 10. Generic Table Creation Flow

The architecture becomes:

    ensureDayTable()
          |
          v
    ensureTable()
          |
          v
    queries.createDayTable()
          |
          v
    PostgreSQL

The same pattern is used for:

    Day
    Heartbeat
    Week
    Month
    Year

This is an important abstraction in the telemetry architecture.

---

# 11. Vehicle Ward Lookup

The method:

    async getVehicleWard(vehicleNumber)

resolves a vehicle number into its ward number.

The lookup follows several stages.

The overall flow is:

    Vehicle Number
          |
          v
    Validate Input
          |
          v
    Check Ward Cache
          |
          v
    Check Pending Promise
          |
          v
    Query vehicle_master
          |
          v
    Cache Result
          |
          v
    Return Ward

---

# 12. Vehicle ID Normalization

The vehicle number is normalized using:

    const key = String(vehicleNumber || "").trim();

This ensures that the lookup key is always represented as a string and removes unnecessary whitespace.

For example:

    " VEHICLE_001 "

becomes:

    "VEHICLE_001"

If the resulting value is empty, the method throws:

    UnregisteredVehicleError

with the reason:

    Invalid vehicle ID

---

# 13. Ward Cache Lookup

Before querying the main database, the method checks:

    vehicleWardCache.has(key)

If the vehicle already exists in the cache, the cached ward is used.

This avoids another database query.

The flow is:

    getVehicleWard()
          |
          v
    Cache contains vehicle?
          |
       +--+--+
       |     |
      YES    NO
       |     |
       v     v
    Return  Continue
    Ward

If the cache contains `null` or `undefined`, the vehicle is treated as unregistered.

---

# 14. Pending Lookup Detection

If the vehicle is not in the completed cache, the manager checks:

    vehicleWardPromises.has(key)

This means another request may already be performing the database lookup.

If so, the current request waits for:

    vehicleWardPromises.get(key)

This prevents multiple simultaneous lookups for the same vehicle.

---

# 15. Main Database Lookup

If there is no cached value and no pending lookup, a new lookup is created.

The main database query is:

    SELECT ward_no
    FROM vehicle_master
    WHERE vehicle_id = $1
    LIMIT 1;

The parameter supplied is:

    key

Therefore:

    vehicleNumber
          |
          v
    vehicle_master
          |
          v
    ward_no

---

# 16. Vehicle Not Found

If the query returns no rows:

    result.rows.length === 0

the manager stores:

    vehicleWardCache.set(key, null);

and logs the vehicle as unregistered.

The lookup returns:

    null

The calling logic then converts this into:

    UnregisteredVehicleError

This ensures that an unknown vehicle is treated consistently.

---

# 17. Vehicle Without Ward

A vehicle can also exist in `vehicle_master` but have no `ward_no`.

The manager checks:

    wardNo === null || wardNo === undefined

If the ward is missing, the vehicle is treated as invalid for telemetry hierarchy registration.

The cache stores:

    null

and the method eventually throws:

    UnregisteredVehicleError

This prevents telemetry from being registered into a hierarchy without a valid ward.

---

# 18. Successful Vehicle Ward Lookup

When a valid ward is found:

    vehicleWardCache.set(
      key,
      Number(wardNo)
    );

The ward is converted to a number and cached.

The method returns:

    Number(wardNo)

The resulting relationship is:

    vehicleNumber
          |
          v
    vehicle_master
          |
          v
       ward_no
          |
          v
    Number(wardNo)
          |
          v
    Telemetry Metadata

---

# 19. Promise Cleanup

The lookup promise is stored in:

    vehicleWardPromises

After the lookup completes, the manager executes:

    vehicleWardPromises.delete(key);

This happens inside the `finally` block.

Therefore, the promise cache only exists while the lookup is in progress.

The completed result remains in:

    vehicleWardCache

The two structures therefore have different purposes:

    vehicleWardCache
        |
        +--> Completed lookup results

    vehicleWardPromises
        |
        +--> Currently running lookups

---

# 20. Day Table Name

The method:

    getDayTableName(date = new Date())

generates the name of a day table.

The format is:

    day_DDMMYYYY

For example, a date corresponding to 26 August 2026 would produce:

    day_26082026

The generated format is:

    day_<DD><MM><YYYY>

This provides a deterministic table name based on the calendar date.

---

# 21. Ensure Day Table

The method:

    ensureDayTable(tx, date)

first generates the table name:

    const tableName = this.getDayTableName(date);

It then calls:

    this.ensureTable(
      tx,
      tableName,
      queries.createDayTable
    );

After creating or confirming the table, it also executes:

    queries.addDayHeartbeatColumn(tableName)

This ensures that the day table contains the heartbeat table reference column.

The complete flow is:

    Date
      |
      v
    getDayTableName()
      |
      v
    day_DDMMYYYY
      |
      v
    createDayTable()
      |
      v
    addDayHeartbeatColumn()
      |
      v
    Return Day Table Name

---

# 22. Heartbeat Table Name

The method:

    getHeartbeatTableName(vehicleNumber, date)

generates a vehicle-specific heartbeat table name.

The format is:

    <vehicleNumber>_HBDDMMYYYY

For example:

    VEHICLE_001_HB26082026

The vehicle number is first cleaned using:

    String(vehicleNumber || "").trim();

The date components are then added to the name.

This ensures that heartbeat tables are separated by:

    Vehicle
    +
    Date

---

# 23. Ensure Heartbeat Table

The method:

    ensureHeartbeatTable(
      tx,
      vehicleNumber,
      date
    )

generates the heartbeat table name and passes it to:

    ensureTable()

using:

    queries.createHeartbeatTable

The flow is:

    Vehicle + Date
          |
          v
    getHeartbeatTableName()
          |
          v
    Vehicle Heartbeat Table Name
          |
          v
    createHeartbeatTable()
          |
          v
    Return Table Name

---

# 24. Register Vehicle in Day Table

The method:

    registerVehicleInDayTable(
      tx,
      dayTable,
      vehicleNumber,
      vehicleTable,
      heartbeatTable
    )

connects a vehicle to the day hierarchy.

Before registration, the manager resolves the vehicle's ward:

    const wardNo =
      await this.getVehicleWard(vehicleNumber);

The result is:

    vehicleNumber → wardNo

The manager then executes:

    queries.registerVehicleInDayTable(dayTable)

with:

    vehicleNumber
    vehicleTable
    heartbeatTable
    wardNo

This establishes the relationship between the vehicle and its daily telemetry structures.

---

# 25. Vehicle → Day Relationship

The resulting structure is:

    Day Table
        |
        +--> vehicle_number
        |
        +--> vehicle_table_name
        |
        +--> vehicle_table_name_hb
        |
        +--> ward_no

This allows the day table to act as a registry for vehicles operating on that day.

The important relationship is:

    Vehicle
       |
       +--> Telemetry Table
       |
       +--> Heartbeat Table
       |
       +--> Ward

---

# 26. Week Table Name

The method:

    getWeekTableName(date = new Date())

generates a weekly table name.

The format is:

    week_<weekNumber>_<year>

For example:

    week_35_2026

The week number is calculated using the date and the beginning of the year.

The implementation calculates:

    year
    start of year
    number of elapsed days
    week number

The resulting name is deterministic for the supplied date.

---

# 27. Ensure Week Table

The method:

    ensureWeekTable(tx, date)

generates the week table name and passes it to:

    ensureTable()

using:

    queries.createWeekTable

The result is the week table name.

---

# 28. Month Table Name

The method:

    getMonthTableName(date = new Date())

generates:

    month_<MM><YYYY>

For example:

    month_082026

The month and year are extracted from the supplied date.

---

# 29. Ensure Month Table

The method:

    ensureMonthTable(tx, date)

creates or confirms the required month table.

It uses:

    queries.createMonthTable

through:

    ensureTable()

The result is the generated month table name.

---

# 30. Year Table Name

The method:

    getYearTableName(date = new Date())

generates:

    year_<YYYY>

For example:

    year_2026

The year is taken directly from:

    date.getFullYear()

---

# 31. Ensure Year Table

The method:

    ensureYearTable(tx, date)

creates or confirms the year table using:

    queries.createYearTable

through the generic:

    ensureTable()

operation.

The result is the generated year table name.

---

# 32. Time Hierarchy

The naming methods collectively produce the telemetry time hierarchy:

    year_2026
        |
        +--> month_082026
                |
                +--> week_35_2026
                        |
                        +--> day_26082026

The exact table names depend on the date supplied to the manager.

This is how the application translates a telemetry packet date into physical PostgreSQL table names.

---

# 33. Register Month in Year

The method:

    registerMonthInYearTable(
      tx,
      yearTable,
      monthTable
    )

connects a month table to its year table.

It executes:

    queries.registerMonthInYearTable(yearTable)

with:

    monthTable

The relationship is:

    Year Table
        |
        +--> Month Table

---

# 34. Register Week in Month

The method:

    registerWeekInMonthTable(
      tx,
      monthTable,
      weekTable
    )

connects a week table to its month table.

The relationship is:

    Month Table
        |
        +--> Week Table

The actual SQL is provided by:

    queries.registerWeekInMonthTable()

---

# 35. Register Day in Week

The method:

    registerDayInWeekTable(
      tx,
      weekTable,
      dayTable
    )

connects a day table to its week table.

The relationship is:

    Week Table
        |
        +--> Day Table

The SQL is provided by:

    queries.registerDayInWeekTable()

---

# 36. Complete Hierarchy Registration

The most important method in the manager is:

    registerHierarchy()

It receives:

    dayTable
    weekTable
    monthTable
    yearTable
    vehicleNumber
    vehicleTable
    heartbeatTable

It then performs the registrations in order.

---

# 37. Registration Order

The exact sequence is:

    1. Vehicle → Day

    2. Day → Week

    3. Week → Month

    4. Month → Year

This creates the complete hierarchy.

The implementation performs:

    registerVehicleInDayTable()

then:

    registerDayInWeekTable()

then:

    registerWeekInMonthTable()

then:

    registerMonthInYearTable()

---

# 38. Complete Hierarchy

After registration, the conceptual structure is:

    YEAR
      |
      +--> MONTH
              |
              +--> WEEK
                      |
                      +--> DAY
                              |
                              +--> VEHICLE
                                      |
                                      +--> TELEMETRY
                                      |
                                      +--> HEARTBEAT
                                      |
                                      +--> WARD

This is the central dynamic hierarchy managed by the telemetry metadata layer.

---

# 39. Transaction Consistency

Every registration operation receives:

    tx

This means the operations can participate in the same database transaction.

The hierarchy registration can therefore be treated as one logical database operation:

    BEGIN
       |
       +--> Vehicle → Day
       |
       +--> Day → Week
       |
       +--> Week → Month
       |
       +--> Month → Year
       |
    COMMIT

The transaction itself is supplied by the caller, typically the higher-level telemetry processing flow.

---

# 40. Returned Hierarchy

After registration, `registerHierarchy()` returns:

    {
      dayTable,
      weekTable,
      monthTable,
      yearTable,
      heartbeatTable
    }

This allows the caller to continue processing using the resolved table names.

The returned information represents the tables required for the telemetry hierarchy.

---

# 41. Relationship With HierarchyManager

The relationship between the two managers is:

    HierarchyManager
          |
          | process()
          v
    MetadataManager
          |
          +--> ensureDayTable()
          +--> ensureHeartbeatTable()
          +--> ensureWeekTable()
          +--> ensureMonthTable()
          +--> ensureYearTable()
          |
          +--> registerHierarchy()
                     |
                     +--> Vehicle → Day
                     +--> Day → Week
                     +--> Week → Month
                     +--> Month → Year

Therefore, `HierarchyManager` coordinates the workflow while `MetadataManager` performs the underlying hierarchy operations.

---

# 42. Relationship With SQL Factory

`MetadataManager` relies heavily on:

    src/telemetry/queries/query.js

The SQL factory provides the actual SQL operations.

For example:

    queries.createDayTable
    queries.createHeartbeatTable
    queries.createWeekTable
    queries.createMonthTable
    queries.createYearTable

and:

    queries.registerVehicleInDayTable
    queries.registerDayInWeekTable
    queries.registerWeekInMonthTable
    queries.registerMonthInYearTable

The architecture is:

    MetadataManager
          |
          v
    queries/query.js
          |
          v
    SQL
          |
          v
    PostgreSQL

---

# 43. Main Database vs Telemetry Database

One of the most important architectural details in this manager is the separation between:

    mainDb

and:

    telemetryDb / tx

The main database is used for authoritative vehicle information:

    mainDb
       |
       v
    vehicle_master
       |
       v
    ward_no

The telemetry database is used for:

    Day Tables
    Week Tables
    Month Tables
    Year Tables
    Vehicle Telemetry
    Heartbeat
    Hierarchy Registration

This separation allows the telemetry system to use the main application database as the source of vehicle metadata while maintaining telemetry data in its dedicated database.

---

# 44. MetadataManager Responsibilities

The complete responsibility of `MetadataManager` can be summarized as:

    TABLE NAMING
        |
        +--> Day
        +--> Heartbeat
        +--> Week
        +--> Month
        +--> Year

    TABLE CREATION
        |
        +--> Ensure required tables exist

    VEHICLE METADATA
        |
        +--> Vehicle → Ward lookup
        +--> Cache vehicle → ward

    HIERARCHY REGISTRATION
        |
        +--> Vehicle → Day
        +--> Day → Week
        +--> Week → Month
        +--> Month → Year

    ERROR HANDLING
        |
        +--> UnregisteredVehicleError

---

# 45. Overall Metadata Flow

The complete flow can be understood as:

    Telemetry Packet
          |
          v
    Vehicle Number + Date
          |
          +----------------------+
          |                      |
          v                      v
    Vehicle Master          Date Processing
          |                      |
          v                      |
       Ward No                   |
          |                      |
          +----------+-----------+
                     |
                     v
              MetadataManager
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
                     v
              Register Hierarchy
                     |
                     v
                PostgreSQL

---

# 46. Why This Layer Is Important

Without `MetadataManager`, the telemetry processing system would need to directly handle:

- Table naming
- Table creation
- Vehicle validation
- Ward lookup
- Caching
- Hierarchy registration
- SQL query selection

By centralizing these responsibilities, the telemetry architecture remains separated into logical layers.

The result is:

    Service Layer
        |
        v
    Hierarchy Management
        |
        v
    Metadata Management
        |
        v
    SQL Factory
        |
        v
    Database

---

# 47. Export

At the end of the file, the manager is instantiated:

    const metadataManager = new MetadataManager();

The custom error is attached to the exported manager:

    metadataManager.UnregisteredVehicleError =
      UnregisteredVehicleError;

Finally:

    module.exports = metadataManager;

Therefore, other parts of the application receive the manager instance directly.

They can use methods such as:

    metadataManager.ensureDayTable()

    metadataManager.ensureWeekTable()

    metadataManager.ensureMonthTable()

    metadataManager.ensureYearTable()

    metadataManager.registerHierarchy()

and can also access:

    metadataManager.UnregisteredVehicleError

---

# 48. Complete Metadata Architecture

The role of `MetadataManager.js` in the complete telemetry architecture is:

    Telemetry Packet
            |
            v
    HierarchyManager
            |
            v
    MetadataManager
            |
            +----------------------+
            |                      |
            v                      v
        mainDb               telemetryDb
            |                      |
            v                      v
    vehicle_master          Dynamic Tables
            |                      |
            v                      |
        ward_no                    |
            |                      |
            +----------+-----------+
                       |
                       v
                Hierarchy Registry
                       |
                       v
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
                 +-----+-----+
                 |           |
                 v           v
             TELEMETRY   HEARTBEAT

---

# 49. Summary

`MetadataManager.js` is the layer responsible for translating telemetry information into the metadata and table relationships required by the SEWAC telemetry hierarchy.

Its major responsibilities are:

    1. Generate dynamic table names

    2. Ensure hierarchy tables exist

    3. Resolve vehicle → ward information

    4. Cache vehicle → ward lookups

    5. Prevent duplicate concurrent vehicle lookups

    6. Validate registered vehicles

    7. Register vehicles inside day tables

    8. Register days inside week tables

    9. Register weeks inside month tables

    10. Register months inside year tables

    11. Return the completed hierarchy

The central hierarchy is:

    YEAR
      ↓
    MONTH
      ↓
    WEEK
      ↓
    DAY
      ↓
    VEHICLE
      ├── TELEMETRY
      └── HEARTBEAT

---

# 50. Next Step

The next layer to understand is the **physical table-management layer**.

Continue to:

    src/telemetry/managers/ReadMe/TableManager.md

`TableManager.md` explains how the telemetry system manages the actual database tables underneath the metadata and hierarchy layers.

The documentation chain is now:

    telemetry.schema.prisma
            |
            v
    queries/ReadMe/query.md
            |
            v
    initialize/ReadMe/initializeTelemetryDB.md
            |
            v
    managers/ReadMe/HierarchyManager.md
            |
            v
    managers/ReadMe/MetadataManager.md
            |
            v
    managers/ReadMe/TableManager.md
            |
            v
    services/
            |
            v
    Complete Telemetry Pipeline