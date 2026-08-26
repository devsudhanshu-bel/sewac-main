# SEWAC Telemetry SQL Factory

This README explains the SQL factory used by the SEWAC Telemetry System.

The SQL factory is responsible for generating the SQL statements required to create, register, insert, update, maintain, and clean up telemetry-related database tables.

Unlike the Prisma schema, which describes the static `MasterTelemetry` model, this layer directly generates PostgreSQL SQL statements.

This is an important part of the SEWAC telemetry architecture because the system creates and works with telemetry tables dynamically.

---

# 1. Purpose of This File

The SQL factory provides reusable functions that return SQL queries.

Instead of writing SQL directly throughout the application, the telemetry services can call these functions and receive the appropriate SQL statement.

The general flow is:

    Telemetry Service
          |
          v
    SQL Factory
          |
          v
    SQL Query
          |
          v
    PostgreSQL
          |
          v
    Telemetry Tables

This keeps the SQL definitions centralized and makes the telemetry database operations easier to maintain.

---

# 2. Vehicle Telemetry Tables

## createVehicleTelemetryTable()

    createVehicleTelemetryTable(tableName)

This function dynamically generates the SQL required to create a vehicle-specific telemetry table.

The table name is provided dynamically through:

    tableName

The generated table contains the telemetry structure required for vehicle-level telemetry storage.

The SQL structure is:

    CREATE TABLE IF NOT EXISTS "<tableName>" (
        id BIGSERIAL PRIMARY KEY,
        iotTimestamp TIMESTAMP,
        receivedTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rfidEpc VARCHAR(100),
        citizenId INTEGER,
        wasteType VARCHAR(20),
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        wetWeight DECIMAL(10,2),
        dryWeight DECIMAL(10,2),
        otherWeight DECIMAL(10,2),
        cumulativeWeight DECIMAL(10,2),
        driverName VARCHAR(100),
        vehicleNumber VARCHAR(30),
        firmwareVersion VARCHAR(50),
        unitNumber VARCHAR(50),
        collectionType VARCHAR(30),
        remarks TEXT,
        errorCode VARCHAR(20),
        citizenContact VARCHAR(30),
        driverAction VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

The important point is that the table name is not hard-coded.

For example, the application can generate:

    createVehicleTelemetryTable("vehicle_123")

which creates:

    vehicle_123

The same factory can therefore be used for multiple vehicles.

---

# 3. Master Telemetry Buffer

## insertMasterTelemetry()

    insertMasterTelemetry()

This function generates the SQL used to insert incoming telemetry into the central `master_telemetry` table.

The master table acts as a temporary processing buffer before the telemetry is distributed into the appropriate dynamic tables.

The insertion flow is:

    Incoming Telemetry
          |
          v
    master_telemetry
          |
          v
    Processing
          |
          v
    Vehicle / Time Tables

The query uses PostgreSQL positional parameters:

    $1
    $2
    $3
    ...
    $20

This allows the actual values to be supplied separately from the SQL query.

The record is initially marked:

    PROCESSING

This allows the system to track whether the telemetry event has been successfully processed.

The query returns the generated telemetry ID:

    RETURNING id;

That ID can then be used by later processing steps.

---

# 4. Master Cumulative Weight Update

## updateMasterTelemetryCumulative()

    updateMasterTelemetryCumulative()

This generates the SQL used to update the cumulative weight of a master telemetry record.

The query performs:

    UPDATE master_telemetry
    SET "cumulativeWeight" = $1
    WHERE id = $2;

The parameters represent:

    $1 -> cumulative weight
    $2 -> telemetry record ID

This allows cumulative weight to be calculated or updated after the initial telemetry record has been inserted.

---

# 5. Vehicle Telemetry Insert

## insertVehicleTelemetry()

    insertVehicleTelemetry(tableName)

This generates the SQL required to insert a telemetry record into a dynamically selected vehicle telemetry table.

The table name is provided dynamically:

    tableName

The query inserts:

- IoT timestamp
- Received timestamp
- RFID EPC
- Citizen ID
- Waste type
- Latitude
- Longitude
- Wet weight
- Dry weight
- Other weight
- Cumulative weight
- Driver name
- Vehicle number
- Firmware version
- Unit number
- Collection type
- Remarks
- Error code
- Citizen contact
- Driver action

The values are passed using positional parameters:

    $1
    $2
    ...
    $20

This allows the same SQL factory function to work with different vehicle telemetry tables.

---

# 6. Day Table

## createDayTable()

    createDayTable(tableName)

This creates a dynamically named day-level registry table.

The table stores information about the vehicle telemetry tables associated with a particular day.

The structure contains:

    vehicle_number

The vehicle number acts as the primary key.

It also stores:

    vehicle_table_name

and:

    vehicle_table_name_hb

These fields point to the vehicle's telemetry and heartbeat tables.

The table also stores:

    ward_no

and:

    created_at

The relationship can be understood as:

    Day Table
        |
        +--> Vehicle Number
        |
        +--> Vehicle Telemetry Table
        |
        +--> Vehicle Heartbeat Table
        |
        +--> Ward Number

---

# 7. Day Heartbeat Column

## addDayHeartbeatColumn()

    addDayHeartbeatColumn(tableName)

This function adds the vehicle heartbeat table reference to an existing day table if the column does not already exist.

It uses:

    ADD COLUMN IF NOT EXISTS

This makes the operation safe to run multiple times.

The column added is:

    vehicle_table_name_hb VARCHAR(100)

This allows older day tables to be upgraded without requiring them to be recreated.

---

# 8. Register Vehicle in Day Table

## registerVehicleInDayTable()

    registerVehicleInDayTable(tableName)

This registers a vehicle inside the appropriate day table.

The values inserted are:

    vehicle_number
    vehicle_table_name
    vehicle_table_name_hb
    ward_no

The query uses:

    ON CONFLICT (vehicle_number)

If the vehicle already exists, the record is updated instead of producing a duplicate.

The update replaces:

    vehicle_table_name
    vehicle_table_name_hb
    ward_no

This makes the day table act as a registry of the vehicles operating on that day.

Conceptually:

    Day Table
        |
        +--> Vehicle A
        |       |
        |       +--> Telemetry Table
        |       +--> Heartbeat Table
        |
        +--> Vehicle B
                |
                +--> Telemetry Table
                +--> Heartbeat Table

---

# 9. Daily Vehicle Heartbeat Table

## createHeartbeatTable()

    createHeartbeatTable(tableName)

This dynamically creates a heartbeat table for a vehicle.

The heartbeat table stores the latest or historical GPS heartbeat information generated by the vehicle.

The table contains:

    id
    latitude
    longitude
    created_at

The primary key is:

    id BIGSERIAL PRIMARY KEY

The GPS fields are required:

    latitude DECIMAL(10,7) NOT NULL
    longitude DECIMAL(10,7) NOT NULL

The timestamp is automatically generated:

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

The heartbeat table therefore represents vehicle location activity independently from waste telemetry.

---

# 10. Insert Heartbeat

## insertHeartbeat()

    insertHeartbeat(tableName)

This generates the SQL required to insert a heartbeat into a dynamically selected heartbeat table.

The values supplied are:

    latitude
    longitude

The query returns:

    id
    latitude
    longitude
    created_at

This allows the application to immediately receive the inserted heartbeat information.

The flow is:

    Vehicle
       |
       v
    GPS Heartbeat
       |
       +--> Latitude
       |
       +--> Longitude
       |
       v
    Vehicle Heartbeat Table

---

# 11. Week Table

## createWeekTable()

    createWeekTable(tableName)

This creates a weekly registry table.

The weekly table contains:

    day_table_name

and:

    created_at

The `day_table_name` acts as the primary key.

The purpose of this table is to maintain references to the day-level tables belonging to a particular week.

Conceptually:

    Week Table
        |
        +--> Day Table 1
        |
        +--> Day Table 2
        |
        +--> Day Table 3
        |
        +--> ...
        |
        +--> Day Table 7

---

# 12. Register Day in Week Table

## registerDayInWeekTable()

    registerDayInWeekTable(tableName)

This registers a day table inside a week table.

The query inserts:

    day_table_name

If the day table already exists, the query does nothing:

    ON CONFLICT (day_table_name)
    DO NOTHING;

This prevents duplicate day-table registrations.

---

# 13. Month Table

## createMonthTable()

    createMonthTable(tableName)

This creates a monthly registry table.

The monthly table contains:

    week_table_name

and:

    created_at

The week table name acts as the primary key.

The purpose is to maintain references to the weekly tables belonging to a month.

Conceptually:

    Month Table
        |
        +--> Week Table 1
        |
        +--> Week Table 2
        |
        +--> Week Table 3
        |
        +--> Week Table 4
        |
        +--> Week Table 5

---

# 14. Register Week in Month Table

## registerWeekInMonthTable()

    registerWeekInMonthTable(tableName)

This registers a weekly table inside the appropriate month table.

The query inserts:

    week_table_name

If the week is already registered, nothing happens:

    ON CONFLICT (week_table_name)
    DO NOTHING;

This prevents duplicate registrations.

---

# 15. Year Table

## createYearTable()

    createYearTable(tableName)

This creates a yearly registry table.

The yearly table contains:

    month_table_name

and:

    created_at

The month table name acts as the primary key.

The purpose is to maintain references to the monthly tables belonging to a year.

Conceptually:

    Year Table
        |
        +--> Month Table 1
        |
        +--> Month Table 2
        |
        +--> Month Table 3
        |
        +--> ...
        |
        +--> Month Table 12

---

# 16. Register Month in Year Table

## registerMonthInYearTable()

    registerMonthInYearTable(tableName)

This registers a monthly table inside the appropriate year table.

The query inserts:

    month_table_name

If the month is already registered, the query does nothing:

    ON CONFLICT (month_table_name)
    DO NOTHING;

This prevents duplicate month registrations.

---

# 17. Hierarchical Telemetry Table Structure

The day, week, month, and year tables together create a hierarchy for organizing dynamically generated telemetry tables.

The structure can be understood as:

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

This is one of the most important concepts in the SEWAC telemetry database.

The system does not rely only on one massive telemetry table for every operation.

Instead, it maintains a hierarchy of dynamically created tables and registry tables.

---

# 18. Vehicle Cumulative Table

## createVehicleCumulativeTable()

    createVehicleCumulativeTable()

This creates the global `vehicle_cumulative` table.

The table stores the cumulative waste weight for each vehicle.

Its structure is:

    vehicle_number VARCHAR(50) PRIMARY KEY

    cumulative_weight DECIMAL(12,2)
    NOT NULL DEFAULT 0

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Each vehicle has one cumulative record.

Conceptually:

    Vehicle
       |
       v
    vehicle_cumulative
       |
       +--> cumulative_weight

---

# 19. Update Vehicle Cumulative Weight

## updateVehicleCumulative()

    updateVehicleCumulative()

This generates the SQL used to update the cumulative weight associated with a vehicle.

The query uses:

    INSERT ... ON CONFLICT ... DO UPDATE

This means the function can handle both cases:

### Vehicle does not exist

A new record is created.

### Vehicle already exists

The new weight is added to the existing cumulative weight.

The calculation is:

    existing cumulative weight
            +
    new cumulative weight
            =
    updated cumulative weight

The query returns the updated cumulative value.

This allows the system to maintain a running cumulative waste total for each vehicle.

---

# 20. Master Telemetry Processing Status

## addMasterTelemetryStatusColumn()

    addMasterTelemetryStatusColumn()

This adds the processing status column to the `master_telemetry` table if it does not already exist.

The column is:

    processing_status VARCHAR(20)
    DEFAULT 'COMPLETED'

This column is important because `master_telemetry` acts as a processing buffer.

Telemetry records can therefore move through states such as:

    PROCESSING
        |
        +------> COMPLETED
        |
        +------> FAILED

---

# 21. Master Telemetry Cumulative Column

## addMasterTelemetryCumulativeColumn()

    addMasterTelemetryCumulativeColumn()

This ensures that the `master_telemetry` table contains:

    "cumulativeWeight" DECIMAL(10,2)

The column is added only if it does not already exist.

This provides compatibility with existing databases where the cumulative weight column may not have existed when the table was initially created.

---

# 22. Master Telemetry Status Index

## createMasterTelemetryStatusIndex()

    createMasterTelemetryStatusIndex()

This creates an index on:

    processing_status
    "receivedTimestamp"

The index is named:

    idx_master_telemetry_status_received

This improves queries that need to find telemetry records based on processing status and reception time.

This is particularly useful for the telemetry processing pipeline.

For example, the system may need to efficiently find:

    PROCESSING records
    ordered by receivedTimestamp

The index helps PostgreSQL locate these records more efficiently.

---

# 23. Mark Telemetry as Completed

## markMasterTelemetryCompleted()

    markMasterTelemetryCompleted()

This generates the SQL used to mark a telemetry record as successfully processed.

The query performs:

    UPDATE master_telemetry
    SET processing_status = 'COMPLETED'
    WHERE id = $1;

The supplied parameter is the telemetry record ID.

The processing flow becomes:

    Telemetry
        |
        v
    PROCESSING
        |
        v
    Successfully distributed
        |
        v
    COMPLETED

---

# 24. Mark Telemetry as Failed

## markMasterTelemetryFailed()

    markMasterTelemetryFailed()

This generates the SQL used to mark a telemetry record as failed.

The query performs:

    UPDATE master_telemetry
    SET processing_status = 'FAILED'
    WHERE id = $1;

This allows failed telemetry records to remain in the master buffer for investigation or later handling.

The flow becomes:

    Telemetry
        |
        v
    PROCESSING
        |
        v
    Processing Failure
        |
        v
    FAILED

---

# 25. Master Telemetry Cleanup

## cleanupCompletedMasterTelemetry()

    cleanupCompletedMasterTelemetry()

This generates the SQL responsible for cleaning up successfully processed telemetry records from the master buffer.

The query selects completed records:

    processing_status = 'COMPLETED'

and orders them by:

    receivedTimestamp ASC
    id ASC

This means the oldest completed records are removed first.

The cleanup removes up to:

    1000 records

at a time.

However, cleanup only occurs when the master telemetry table contains at least:

    2000 records

This prevents the system from continuously deleting records when the buffer is small.

The purpose is to keep the master telemetry table from growing indefinitely while still retaining a reasonable processing buffer.

The concept is:

    master_telemetry
          |
          v
    Record Count >= 2000?
          |
       +--+--+
       |     |
      No    Yes
       |     |
       v     v
      Keep  Cleanup
             |
             v
      Oldest COMPLETED
        records
             |
             v
        Delete up to
          1000 rows

---

# 26. Complete Telemetry Processing Flow

The complete processing concept can be understood as:

    IoT Device
        |
        v
    Telemetry Packet
        |
        v
    master_telemetry
        |
        v
    PROCESSING
        |
        +-----------------------+
        |                       |
        v                       v
    Vehicle Telemetry      Cumulative
        |                   Processing
        |                       |
        v                       v
    Dynamic Vehicle       Vehicle Cumulative
       Table                   Table
        |
        v
    Mark COMPLETED
        |
        v
    Master Buffer Cleanup

If processing fails:

    master_telemetry
        |
        v
    PROCESSING
        |
        v
    Processing Error
        |
        v
    FAILED

---

# 27. Dynamic Table Hierarchy

The SQL factory supports a multi-level telemetry structure:

    YEAR TABLE
        |
        v
    MONTH TABLE
        |
        v
    WEEK TABLE
        |
        v
    DAY TABLE
        |
        v
    VEHICLE TABLE
        |
        +------------------+
        |                  |
        v                  v
    TELEMETRY           HEARTBEAT

The registry tables maintain references to the dynamically generated tables.

For example:

    Year
      |
      +--> Month
              |
              +--> Week
                      |
                      +--> Day
                              |
                              +--> Vehicle
                                      |
                                      +--> Telemetry
                                      |
                                      +--> Heartbeat

This structure allows the system to organize telemetry according to time and vehicle.

---

# 28. Why Dynamic Table Names Are Used

Several functions in this file receive:

    tableName

instead of using a fixed table name.

For example:

    createVehicleTelemetryTable(tableName)

    insertVehicleTelemetry(tableName)

    createDayTable(tableName)

    createHeartbeatTable(tableName)

    insertHeartbeat(tableName)

    createWeekTable(tableName)

    createMonthTable(tableName)

    createYearTable(tableName)

The application therefore determines the correct table name based on the telemetry context.

This enables the telemetry system to dynamically create and access tables for different:

- Years
- Months
- Weeks
- Days
- Vehicles

The SQL factory only generates the SQL.

The logic that determines **which table name should be used and when the table should be created** belongs to the query/service layer.

---

# 29. SQL Factory vs Query Layer

This distinction is important.

The SQL factory defines:

    WHAT SQL should be executed

The query layer defines:

    WHEN the SQL should be executed
    WHICH table should be used
    WHICH parameters should be supplied
    HOW the operations are connected

Therefore:

    SQL Factory
        |
        | Generates SQL
        v
    Query Layer
        |
        | Executes SQL
        v
    PostgreSQL

The SQL factory should not be confused with the telemetry service itself.

---

# 30. SQL Parameters

Most insert and update queries use PostgreSQL positional parameters.

For example:

    $1
    $2
    $3

This means the values are supplied separately when the query is executed.

For example:

    $1 -> vehicle number
    $2 -> cumulative weight

This approach keeps values separate from the SQL statement and allows the database driver to safely bind the parameters.

The factory therefore defines the SQL structure while the query/service layer supplies the actual data.

---

# 31. ON CONFLICT Usage

Several registry and cumulative operations use PostgreSQL's:

    ON CONFLICT

mechanism.

For example:

    ON CONFLICT (vehicle_number)
    DO UPDATE SET ...

or:

    ON CONFLICT (day_table_name)
    DO NOTHING;

This prevents duplicate registrations and allows existing records to be updated where appropriate.

The behaviour differs depending on the purpose of the table.

### Vehicle Registry

Existing vehicle information is updated.

### Day Registry

Existing day registrations are ignored.

### Week Registry

Existing week registrations are ignored.

### Month Registry

Existing month registrations are ignored.

### Vehicle Cumulative

Existing cumulative weight is incremented.

---

# 32. SQL Factory Functions

The file exports the following functions:

    createVehicleTelemetryTable
    insertMasterTelemetry
    updateMasterTelemetryCumulative
    insertVehicleTelemetry

    createDayTable
    addDayHeartbeatColumn
    createHeartbeatTable
    insertHeartbeat

    createWeekTable
    createMonthTable
    createYearTable

    registerVehicleInDayTable
    registerDayInWeekTable
    registerWeekInMonthTable
    registerMonthInYearTable

    createVehicleCumulativeTable
    updateVehicleCumulative

    addMasterTelemetryStatusColumn
    addMasterTelemetryCumulativeColumn
    createMasterTelemetryStatusIndex

    markMasterTelemetryCompleted
    markMasterTelemetryFailed
    cleanupCompletedMasterTelemetry

These functions form the SQL building blocks used by the telemetry query layer.

---

# 33. Final Architecture

The complete relationship between this SQL factory and the telemetry system is:

    IoT / Vehicle Device
            |
            v
    Telemetry Processing
            |
            v
    Master Telemetry Buffer
    master_telemetry
            |
            v
    Query / Service Layer
            |
            v
    SQL Factory
            |
            +-------------------------------+
            |                               |
            v                               v
    Dynamic Table Creation          Dynamic Data Insertion
            |                               |
            v                               v
       YEAR / MONTH /                VEHICLE TELEMETRY
       WEEK / DAY                    HEARTBEAT
            |                               |
            +---------------+---------------+
                            |
                            v
                    Vehicle Cumulative
                            |
                            v
                    Processing Status
                            |
                +-----------+-----------+
                |                       |
                v                       v
            COMPLETED                 FAILED
                |
                v
        Master Buffer Cleanup

---

# 34. Important Next Step

This file explains **what SQL statements are available** to the SEWAC telemetry system.

It does not explain the complete execution flow.

To understand how the application:

- Determines table names
- Creates year tables
- Creates month tables
- Creates week tables
- Creates day tables
- Creates vehicle telemetry tables
- Creates heartbeat tables
- Registers vehicles
- Registers days
- Registers weeks
- Registers months
- Inserts telemetry
- Processes cumulative weights
- Marks telemetry as completed or failed
- Cleans the master buffer

continue to the next README:

    src/telemetry/queries/ReadMe/query.md

That README explains the **query layer** that uses this SQL factory and connects all of these SQL operations together.

The documentation chain is:

    Telemetry Schema
          |
          v
    SQL Factory
          |
          v
    src/telemetry/initialize/ReadMe/initializeTelemetryDb.md
          |
          v
    Query Execution & Dynamic Table Management
          |
          v
    Telemetry Processing