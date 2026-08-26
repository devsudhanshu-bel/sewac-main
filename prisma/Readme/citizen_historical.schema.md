# SEWAC Citizen Historical Database Schema

## 1. File Overview

**File:** `citizen_historical.schema.prisma`

This Prisma schema defines the database structures used by the **SEWAC
Citizen Historical Data Processing System**.

The schema contains:

``` text
Prisma Client configuration
PostgreSQL datasource configuration
Citizen history synchronization state
Vehicle daily ward tracking
Citizen history processing errors
```

The schema is designed around a historical-processing workflow where
telemetry is processed incrementally and operational state is retained
so that processing can safely resume after interruptions.

The high-level flow is:

``` text
Telemetry Processing Worker
          ↓
Processing Checkpoint
          ↓
Vehicle / Ward Tracking
          ↓
Historical Citizen Processing
          ↓
Processing Errors
          ↓
Retry / Reconciliation
```

------------------------------------------------------------------------

# 2. Prisma Client Configuration

The schema defines:

``` prisma
generator citizenHistoricalClient {
  provider = "prisma-client-js"
  output   = "../src/generated/citizenHistorical"
}
```

------------------------------------------------------------------------

## 2.1 Generator Name

The Prisma generator is named:

``` text
citizenHistoricalClient
```

This identifies the Prisma Client generated specifically for the citizen
historical database.

------------------------------------------------------------------------

## 2.2 Provider

The provider is:

``` text
prisma-client-js
```

This instructs Prisma to generate a JavaScript/Node.js client.

------------------------------------------------------------------------

## 2.3 Generated Client Output

The generated client is stored at:

``` text
../src/generated/citizenHistorical
```

The generation flow is:

``` text
citizen_historical.schema.prisma
        ↓
Prisma Generate
        ↓
../src/generated/citizenHistorical
        ↓
Citizen Historical Worker
```

------------------------------------------------------------------------

# 3. Database Configuration

The datasource is:

``` prisma
datasource db {
  provider = "postgresql"
  url      = env("CITIZEN_HISTORICAL_DATABASE_URL")
}
```

------------------------------------------------------------------------

## 3.1 Database Provider

The database uses:

``` text
PostgreSQL
```

------------------------------------------------------------------------

## 3.2 Connection URL

The connection string is loaded from:

``` text
CITIZEN_HISTORICAL_DATABASE_URL
```

Database credentials are therefore not hard-coded in the schema.

The connection flow is:

``` text
Historical Processing Worker
          ↓
CITIZEN_HISTORICAL_DATABASE_URL
          ↓
PostgreSQL Citizen Historical Database
```

------------------------------------------------------------------------

# 4. Schema Models

The schema defines three Prisma models:

``` text
CitizenHistorySyncState
VehicleDailyWardTracking
CitizenHistoryProcessingError
```

Their responsibilities are:

  -----------------------------------------------------------------------
  Model                               Responsibility
  ----------------------------------- -----------------------------------
  `CitizenHistorySyncState`           Stores the historical-processing
                                      checkpoint

  `VehicleDailyWardTracking`          Stores daily vehicle-to-ward
                                      movement information

  `CitizenHistoryProcessingError`     Stores packets that could not be
                                      processed
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 5. CitizenHistorySyncState Model

The model is:

``` prisma
model CitizenHistorySyncState {
```

This model stores the processing checkpoint for the historical data
worker.

Its purpose is to allow historical processing to resume safely after:

``` text
Server restart
Crash
Deployment
Database failure
```

The checkpoint records:

``` text
Last processed date
Last processed vehicle
Last processed telemetry ID
```

------------------------------------------------------------------------

# 6. CitizenHistorySyncState Primary Key

The field is:

``` prisma
id Int @id @default(autoincrement())
```

The identifier:

``` text
id
```

is the primary key.

It uses:

``` text
Int
```

and is automatically incremented.

------------------------------------------------------------------------

# 7. lastProcessedDate

The field is:

``` prisma
lastProcessedDate DateTime? @db.Date
```

This stores the most recent processing date checkpoint.

Important characteristics:

``` text
DateTime
Optional
PostgreSQL DATE
```

The:

``` text
@db.Date
```

mapping means only the calendar date is represented at the database
level.

------------------------------------------------------------------------

# 8. lastProcessedVehicle

The field is:

``` prisma
lastProcessedVehicle String?
```

It stores the vehicle at which historical processing last reached.

This allows the worker to retain a more granular checkpoint than the
processing date alone.

Conceptually:

``` text
Processing Date
      +
Processing Vehicle
      ↓
Resume Position
```

------------------------------------------------------------------------

# 9. lastProcessedTelemetryId

The field is:

``` prisma
lastProcessedTelemetryId BigInt?
```

It stores the last telemetry record identifier processed by the
historical worker.

`BigInt` is used for compatibility with potentially large telemetry IDs.

The checkpoint therefore contains three levels of progress information:

``` text
lastProcessedDate
        +
lastProcessedVehicle
        +
lastProcessedTelemetryId
```

------------------------------------------------------------------------

# 10. updatedAt

The field is:

``` prisma
updatedAt DateTime @updatedAt
```

Prisma automatically updates this field whenever the record is updated.

It therefore indicates when the synchronization checkpoint was most
recently modified.

------------------------------------------------------------------------

# 11. CitizenHistorySyncState Table Mapping

The model uses:

``` prisma
@@map("citizen_history_sync_state")
```

Therefore:

``` text
Prisma Model
CitizenHistorySyncState
        ↓
PostgreSQL Table
citizen_history_sync_state
```

------------------------------------------------------------------------

# 12. Sync-State Architecture

The synchronization checkpoint can be represented as:

``` text
Historical Worker
       ↓
Process Telemetry
       ↓
Update Checkpoint
       ↓
lastProcessedDate
lastProcessedVehicle
lastProcessedTelemetryId
       ↓
Worker Restart
       ↓
Resume From Checkpoint
```

The schema stores the checkpoint information but does not itself
implement the worker's resume algorithm.

------------------------------------------------------------------------

# 13. VehicleDailyWardTracking Model

The model is:

``` prisma
model VehicleDailyWardTracking {
```

This model stores the ward movement of vehicles for a particular
processing day.

The schema comment describes this as an:

``` text
Operational / index table
```

Detailed historical telemetry is intended to live separately in:

``` text
Monthly Ward tables
```

------------------------------------------------------------------------

# 14. VehicleDailyWardTracking Primary Key

The field is:

``` prisma
id BigInt @id @default(autoincrement())
```

The identifier uses:

``` text
BigInt
```

and is the primary key.

It is automatically generated using:

``` text
autoincrement()
```

------------------------------------------------------------------------

# 15. trackingDate

The field is:

``` prisma
trackingDate DateTime @db.Date
```

This represents the calendar day for which the vehicle's ward movement
is being tracked.

The database representation is:

``` text
PostgreSQL DATE
```

rather than a full timestamp.

------------------------------------------------------------------------

# 16. vehicleNumber

The field is:

``` prisma
vehicleNumber String
```

This identifies the vehicle associated with the daily ward-tracking
record.

Unlike many telemetry fields, this field is required.

------------------------------------------------------------------------

# 17. Administrative Hierarchy

The vehicle tracking model stores:

``` text
cityId
zoneId
divisionId
wardId
wardNo
```

The fields are:

``` prisma
cityId     Int?
zoneId     Int?
divisionId Int?
wardId     Int?
wardNo     Int?
```

All are optional.

------------------------------------------------------------------------

# 18. cityId

The field is:

``` prisma
cityId Int?
```

It stores the city identifier associated with the vehicle's tracking
segment.

------------------------------------------------------------------------

# 19. zoneId

The field is:

``` prisma
zoneId Int?
```

It stores the zone identifier associated with the tracking segment.

------------------------------------------------------------------------

# 20. divisionId

The field is:

``` prisma
divisionId Int?
```

It stores the division identifier associated with the tracking segment.

------------------------------------------------------------------------

# 21. wardId

The field is:

``` prisma
wardId Int?
```

It stores the ward identifier associated with the tracking segment.

------------------------------------------------------------------------

# 22. wardNo

The field is:

``` prisma
wardNo Int?
```

It stores the ward number associated with the tracking segment.

The schema therefore retains both:

``` text
wardId
wardNo
```

for the operational ward information.

------------------------------------------------------------------------

# 23. Vehicle Movement Segment

The model contains:

``` prisma
firstSeenAt DateTime
lastSeenAt  DateTime
```

These fields define the observed time interval for the vehicle's
movement segment.

------------------------------------------------------------------------

# 24. firstSeenAt

The field:

``` prisma
firstSeenAt DateTime
```

stores the first observed timestamp for the vehicle's tracking segment.

------------------------------------------------------------------------

# 25. lastSeenAt

The field:

``` prisma
lastSeenAt DateTime
```

stores the last observed timestamp for the vehicle's tracking segment.

Together:

``` text
firstSeenAt
      ↓
Vehicle present in segment
      ↓
lastSeenAt
```

This provides an operational time window for the vehicle's presence in
the associated ward.

------------------------------------------------------------------------

# 26. packetCount

The field is:

``` prisma
packetCount Int @default(0)
```

This stores the number of telemetry packets associated with the tracking
segment.

The default is:

``` text
0
```

Therefore a newly created tracking record starts with:

``` text
packetCount = 0
```

unless another value is supplied.

------------------------------------------------------------------------

# 27. VehicleDailyWardTracking Audit Timestamps

The model contains:

``` prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

------------------------------------------------------------------------

## createdAt

Stores when the tracking record was created.

The default is:

``` text
now()
```

------------------------------------------------------------------------

## updatedAt

Automatically records when the tracking record was last updated.

Prisma manages this field using:

``` text
@updatedAt
```

------------------------------------------------------------------------

# 28. VehicleDailyWardTracking Indexes

The model defines four indexes:

``` prisma
@@index([trackingDate])
@@index([vehicleNumber])
@@index([trackingDate, vehicleNumber])
@@index([trackingDate, wardNo])
```

These indexes support common historical and operational lookup patterns.

------------------------------------------------------------------------

# 29. Index: trackingDate

The index:

``` prisma
@@index([trackingDate])
```

optimizes queries that filter or search by:

``` text
trackingDate
```

------------------------------------------------------------------------

# 30. Index: vehicleNumber

The index:

``` prisma
@@index([vehicleNumber])
```

optimizes queries that filter by:

``` text
vehicleNumber
```

------------------------------------------------------------------------

# 31. Composite Index: trackingDate + vehicleNumber

The index:

``` prisma
@@index([trackingDate, vehicleNumber])
```

supports queries using the combination:

``` text
trackingDate
+
vehicleNumber
```

This is useful for locating a specific vehicle's tracking information
for a particular day.

------------------------------------------------------------------------

# 32. Composite Index: trackingDate + wardNo

The index:

``` prisma
@@index([trackingDate, wardNo])
```

supports queries using:

``` text
trackingDate
+
wardNo
```

This is useful for day-based ward-level vehicle tracking.

------------------------------------------------------------------------

# 33. VehicleDailyWardTracking Table Mapping

The model uses:

``` prisma
@@map("vehicle_daily_ward_tracking")
```

Therefore:

``` text
Prisma Model
VehicleDailyWardTracking
        ↓
PostgreSQL Table
vehicle_daily_ward_tracking
```

------------------------------------------------------------------------

# 34. Vehicle Daily Ward Tracking Architecture

The model represents a daily operational index:

``` text
Date
 +
Vehicle
 +
Administrative Location
 +
First Seen
 +
Last Seen
 +
Packet Count
        ↓
Vehicle Daily Ward Tracking
```

Example conceptual records:

``` text
2026-08-09
KA01AB1234
Ward 174

2026-08-09
KA01AB1234
Ward 175

2026-08-09
KA05CD5678
Ward 178
```

The schema comment describes these as vehicle ward-movement segments for
a processing day.

------------------------------------------------------------------------

# 35. CitizenHistoryProcessingError Model

The model is:

``` prisma
model CitizenHistoryProcessingError {
```

This model stores telemetry packets that could not be processed
successfully.

The schema identifies examples such as:

``` text
Invalid GPS
GPS outside city
Ward boundary not found
RFID not found
Citizen not found
Historical table creation failure
Historical insert failure
```

These records support later:

``` text
Retry
Reconciliation
Investigation
```

------------------------------------------------------------------------

# 36. CitizenHistoryProcessingError Primary Key

The field is:

``` prisma
id BigInt @id @default(autoincrement())
```

It uses:

``` text
BigInt
```

and is the primary key.

The identifier is automatically generated.

------------------------------------------------------------------------

# 37. telemetryId

The field is:

``` prisma
telemetryId BigInt?
```

It stores the source telemetry record identifier when available.

This provides a link back to the source telemetry event at the
identifier level.

The field is optional because an error may not always have a
corresponding telemetry ID available.

------------------------------------------------------------------------

# 38. processingDate

The field is:

``` prisma
processingDate DateTime @db.Date
```

It stores the calendar date associated with the historical-processing
attempt.

The database representation is:

``` text
PostgreSQL DATE
```

------------------------------------------------------------------------

# 39. vehicleNumber

The field is:

``` prisma
vehicleNumber String?
```

It stores the vehicle associated with the failed processing operation
when available.

The field is optional.

------------------------------------------------------------------------

# 40. Error GPS Coordinates

The model stores:

``` prisma
latitude  Decimal? @db.Decimal(10, 7)
longitude Decimal? @db.Decimal(10, 7)
```

These fields preserve the location information associated with the
failed telemetry packet when available.

Both coordinates use:

``` text
Decimal(10,7)
```

------------------------------------------------------------------------

# 41. Error RFID

The field is:

``` prisma
rfidEpc String?
```

It stores the RFID EPC associated with the processing error when
available.

This can help investigate errors related to RFID resolution.

------------------------------------------------------------------------

# 42. Error Classification

The model contains:

``` prisma
errorType String
```

This identifies the category/type of processing failure.

The field is required.

The schema itself does not define an enum for error types.

Therefore the application determines the permitted error-type values.

------------------------------------------------------------------------

# 43. Error Message

The field is:

``` prisma
errorMessage String
```

This stores the detailed message associated with the processing failure.

The field is required.

Conceptually:

``` text
errorType
    +
errorMessage
    ↓
Processing Failure Description
```

------------------------------------------------------------------------

# 44. retryCount

The field is:

``` prisma
retryCount Int @default(0)
```

It tracks how many retry attempts have been associated with the
processing error.

The initial default is:

``` text
0
```

This supports a retry/reconciliation workflow.

Conceptually:

``` text
Processing Error
      ↓
retryCount = 0
      ↓
Retry
      ↓
retryCount = 1
      ↓
Retry
      ↓
retryCount = 2
```

The schema stores the counter but does not define the retry algorithm.

------------------------------------------------------------------------

# 45. resolved

The field is:

``` prisma
resolved Boolean @default(false)
```

It indicates whether the processing error has been resolved.

The default is:

``` text
false
```

Therefore a newly created error begins as:

``` text
resolved = false
```

Conceptually:

``` text
Processing Error
      ↓
resolved = false
      ↓
Retry / Reconciliation
      ↓
resolved = true
```

The actual resolution logic is outside the Prisma schema.

------------------------------------------------------------------------

# 46. Error Audit Timestamps

The model contains:

``` prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

------------------------------------------------------------------------

## createdAt

Records when the processing-error record was created.

The default is:

``` text
now()
```

------------------------------------------------------------------------

## updatedAt

Automatically records when the error record was last updated.

Prisma manages this field using:

``` text
@updatedAt
```

------------------------------------------------------------------------

# 47. CitizenHistoryProcessingError Indexes

The model defines four indexes:

``` prisma
@@index([processingDate])
@@index([telemetryId])
@@index([vehicleNumber])
@@index([resolved])
```

These indexes support common error-processing queries.

------------------------------------------------------------------------

# 48. Index: processingDate

The index:

``` prisma
@@index([processingDate])
```

supports lookup and filtering by:

``` text
processingDate
```

This is useful when reviewing processing failures for a particular
historical day.

------------------------------------------------------------------------

# 49. Index: telemetryId

The index:

``` prisma
@@index([telemetryId])
```

supports lookup of errors associated with a particular telemetry record.

------------------------------------------------------------------------

# 50. Index: vehicleNumber

The index:

``` prisma
@@index([vehicleNumber])
```

supports vehicle-specific error investigation.

------------------------------------------------------------------------

# 51. Index: resolved

The index:

``` prisma
@@index([resolved])
```

supports filtering errors by:

``` text
resolved = true
```

or:

``` text
resolved = false
```

This is particularly useful for finding unresolved processing failures.

------------------------------------------------------------------------

# 52. CitizenHistoryProcessingError Table Mapping

The model uses:

``` prisma
@@map("citizen_history_processing_errors")
```

Therefore:

``` text
Prisma Model
CitizenHistoryProcessingError
        ↓
PostgreSQL Table
citizen_history_processing_errors
```

------------------------------------------------------------------------

# 53. Error Processing Architecture

The error-processing model supports:

``` text
Telemetry Packet
      ↓
Historical Processing
      ↓
Processing Failure
      ↓
CitizenHistoryProcessingError
      ↓
retryCount
      ↓
Retry / Reconciliation
      ↓
resolved
```

The schema provides the persistent state required for this workflow.

------------------------------------------------------------------------

# 54. Complete Schema Model Relationship

The three models work together conceptually as:

``` text
                    Historical Worker
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
 CitizenHistory     VehicleDailyWard   CitizenHistory
 SyncState          Tracking           ProcessingError
          |                |                |
          v                v                v
 Processing          Daily Vehicle      Failed Packet
 Checkpoint          Ward Movement      Tracking
          |                |                |
          +----------------+----------------+
                           |
                           v
                   Historical Processing
```

There are no explicit Prisma `@relation` declarations between these
models in the provided schema.

------------------------------------------------------------------------

# 55. Historical Processing Checkpoint Flow

The synchronization state provides:

``` text
lastProcessedDate
lastProcessedVehicle
lastProcessedTelemetryId
```

The conceptual checkpoint flow is:

``` text
Worker Starts
      ↓
Read Sync State
      ↓
Determine Resume Position
      ↓
Process Telemetry
      ↓
Update Sync State
      ↓
Continue
```

This allows the worker to preserve processing progress.

------------------------------------------------------------------------

# 56. Daily Vehicle Ward Flow

The vehicle tracking model provides:

``` text
trackingDate
vehicleNumber
cityId
zoneId
divisionId
wardId
wardNo
firstSeenAt
lastSeenAt
packetCount
```

The conceptual flow is:

``` text
Vehicle Telemetry
      ↓
Ward Resolution
      ↓
Daily Vehicle Movement
      ↓
vehicle_daily_ward_tracking
```

------------------------------------------------------------------------

# 57. Processing Error Flow

Failed packets can be represented using:

``` text
telemetryId
processingDate
vehicleNumber
latitude
longitude
rfidEpc
errorType
errorMessage
retryCount
resolved
```

The conceptual flow is:

``` text
Telemetry
    ↓
Historical Processing
    ↓
Failure
    ↓
Error Record
    ↓
Retry
    ↓
Resolved / Unresolved
```

------------------------------------------------------------------------

# 58. Data Type Distribution

The schema uses:

``` text
Int
BigInt
DateTime
String
Decimal
Boolean
```

The general organization is:

``` text
Identifiers
    ↓
Int / BigInt

Dates / Timestamps
    ↓
DateTime

Text
    ↓
String

Coordinates
    ↓
Decimal(10,7)

Boolean State
    ↓
Boolean
```

------------------------------------------------------------------------

# 59. PostgreSQL Date Precision

The following fields explicitly use:

``` text
@db.Date
```

They are:

``` text
lastProcessedDate
trackingDate
processingDate
```

These fields represent calendar dates rather than full timestamp
precision.

------------------------------------------------------------------------

# 60. Coordinate Precision

The processing-error model stores:

``` text
latitude
longitude
```

using:

``` text
Decimal(10,7)
```

This matches the seven-decimal-place coordinate representation used by
the SEWAC telemetry schema.

------------------------------------------------------------------------

# 61. Required and Optional Fields

## CitizenHistorySyncState

Required:

``` text
id
updatedAt
```

Optional:

``` text
lastProcessedDate
lastProcessedVehicle
lastProcessedTelemetryId
```

------------------------------------------------------------------------

## VehicleDailyWardTracking

Required:

``` text
id
trackingDate
vehicleNumber
firstSeenAt
lastSeenAt
packetCount
createdAt
updatedAt
```

Optional:

``` text
cityId
zoneId
divisionId
wardId
wardNo
```

------------------------------------------------------------------------

## CitizenHistoryProcessingError

Required:

``` text
id
processingDate
errorType
errorMessage
retryCount
resolved
createdAt
updatedAt
```

Optional:

``` text
telemetryId
vehicleNumber
latitude
longitude
rfidEpc
```

------------------------------------------------------------------------

# 62. Default Values

The schema defines the following defaults:

``` text
CitizenHistorySyncState
    id → autoincrement()

VehicleDailyWardTracking
    id → autoincrement()
    packetCount → 0
    createdAt → now()

CitizenHistoryProcessingError
    id → autoincrement()
    retryCount → 0
    resolved → false
    createdAt → now()
```

`updatedAt` fields use:

``` text
@updatedAt
```

------------------------------------------------------------------------

# 63. Indexing Strategy

The schema indexes operational lookup fields rather than defining
additional relational constraints.

Vehicle tracking indexes:

``` text
trackingDate
vehicleNumber
trackingDate + vehicleNumber
trackingDate + wardNo
```

Processing error indexes:

``` text
processingDate
telemetryId
vehicleNumber
resolved
```

These support the two major operational query patterns:

``` text
Daily Vehicle / Ward Tracking
```

and:

``` text
Processing Error Investigation / Retry
```

------------------------------------------------------------------------

# 64. Database Table Mapping Summary

  -------------------------------------------------------------------------
  Prisma Model                        PostgreSQL Table
  ----------------------------------- -------------------------------------
  `CitizenHistorySyncState`           `citizen_history_sync_state`

  `VehicleDailyWardTracking`          `vehicle_daily_ward_tracking`

  `CitizenHistoryProcessingError`     `citizen_history_processing_errors`
  -------------------------------------------------------------------------

------------------------------------------------------------------------

# 65. Complete Architecture

``` text
                 Citizen Historical Database
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
 Sync State          Daily Ward          Processing Errors
        |              Tracking                |
        v                  v                  v
 Resume Point        Vehicle Movement     Failed Packets
        |                  |                  |
        +------------------+------------------+
                           |
                           v
                  Historical Worker
                           |
                           v
                    Historical Data
```

------------------------------------------------------------------------

# 66. Important Implementation Detail

`CitizenHistorySyncState` is specifically designed as a processing
checkpoint.

The schema comment states that it allows the worker to resume safely
after:

``` text
Server restart
Crash
Deployment
Database failure
```

The schema stores the checkpoint state, while the actual resume logic is
implemented by the historical worker.

------------------------------------------------------------------------

# 67. Important Implementation Detail

`VehicleDailyWardTracking` is described as an:

``` text
Operational / index table
```

It stores daily vehicle movement information rather than the detailed
historical telemetry itself.

The schema comment indicates that detailed historical telemetry is
intended to reside in:

``` text
Monthly Ward tables
```

------------------------------------------------------------------------

# 68. Important Implementation Detail

`CitizenHistoryProcessingError` is designed for failed
historical-processing packets.

The schema explicitly identifies failure categories such as:

``` text
Invalid GPS
GPS outside city
Ward boundary not found
RFID not found
Citizen not found
Historical table creation failure
Historical insert failure
```

These values are examples from the schema documentation; the Prisma
model itself does not constrain `errorType` to an enum.

------------------------------------------------------------------------

# 69. Important Implementation Detail

The schema does not define explicit Prisma relationships between:

``` text
CitizenHistorySyncState
VehicleDailyWardTracking
CitizenHistoryProcessingError
```

or to external models such as:

``` text
Citizen
Vehicle
Telemetry
City
Zone
Division
Ward
```

The relevant identifiers are stored directly as scalar fields.

------------------------------------------------------------------------

# 70. Important Implementation Detail

The schema does not implement:

``` text
Retry logic
Reconciliation logic
Ward resolution
GPS validation
Citizen resolution
Historical table creation
Historical telemetry insertion
```

It only defines the persistent structures required to support those
operations.

------------------------------------------------------------------------

# 71. Summary

`citizen_historical.schema(3).prisma` defines the PostgreSQL/Prisma data
structures supporting SEWAC's citizen historical-processing workflow.

The schema contains three core models:

``` text
CitizenHistorySyncState
VehicleDailyWardTracking
CitizenHistoryProcessingError
```

Their responsibilities are:

``` text
CitizenHistorySyncState
        ↓
Processing checkpoint / resume state

VehicleDailyWardTracking
        ↓
Daily vehicle-to-ward movement index

CitizenHistoryProcessingError
        ↓
Failed packet tracking / retry / reconciliation
```

The database connection is:

``` text
CITIZEN_HISTORICAL_DATABASE_URL
```

and the generated Prisma Client is:

``` text
../src/generated/citizenHistorical
```

The overall historical-processing architecture is:

``` text
Telemetry
    ↓
Historical Worker
    ↓
Sync Checkpoint
    ↓
Ward / Vehicle Tracking
    ↓
Historical Processing
    ↓
Success
    OR
Processing Error
    ↓
Retry / Reconciliation
```

The schema therefore provides the persistent state and operational
indexing required for reliable historical citizen-data processing while
leaving the actual worker logic and historical-data processing
implementation to the application layer.
