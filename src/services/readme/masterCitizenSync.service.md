# masterCitizenSync.service.js Documentation

## 1. File Overview

**File:** `masterCitizenSync.service.js`\
**Location:** `src/services/masterCitizenSync.service.js`

This service performs synchronization of citizen records from the Helper
database into the master citizen ward tables and maintains the
phone-number-to-ward mappings.

It supports:

``` text
Full citizen synchronization
Single-ward citizen synchronization
Ward registry mapping
Ward-number normalization
Ward-level reporting
Phone → ward mapping
Batch processing
Parallel ward/mapping synchronization
Sync status calculation
```

The main data flow is:

``` text
Helper Database
      ↓
Helper Citizens
      ↓
citizen.ward
      ↓
ACTUAL WARD NUMBER
      ↓
Master Ward Registry
      ↓
Dynamic Ward Table
```

In parallel:

``` text
citizen.phoneNumber
      ↓
master_citizen_map
      ↓
ward_id = ACTUAL WARD NUMBER
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
masterCitizenSync.repository
```

imported from:

``` text
../repositories/masterCitizenSync.repository
```

All database interaction is delegated to this repository.

------------------------------------------------------------------------

# 3. Configuration

The service defines:

``` text
BATCH_SIZE = 5000
```

This is the number of Helper citizen records requested per batch.

The service therefore processes large citizen datasets incrementally
rather than loading the entire Helper dataset into memory at once.

------------------------------------------------------------------------

# 4. validateRepository()

This internal function verifies that the repository exposes all
functions required by the synchronization service.

The required functions are:

``` text
getHelperCitizens
getAllWardMappings
bulkUpsertWardCitizens
syncCitizenWardMappings
normalizeWardNumber
```

------------------------------------------------------------------------

## Missing Repository Functions

The service collects every missing function.

If one or more are unavailable, it throws:

``` text
masterCitizenSync.repository is missing required functions: ...
```

This provides an explicit runtime/startup error instead of allowing an
undefined-function error to occur later.

------------------------------------------------------------------------

# 5. buildWardMap()

This internal function builds an in-memory lookup map from the master
ward registry.

It receives:

``` text
wardMappings
```

and returns:

``` text
Map
```

The lookup key is:

``` text
ACTUAL WARD NUMBER
```

not:

``` text
internal ward_id
```

------------------------------------------------------------------------

# 6. Ward Map Construction

For every ward mapping, the service converts:

``` text
ward.wardNo
```

using:

``` js
Number()
```

Only integer ward numbers are accepted.

Invalid ward numbers are skipped.

The map is populated as:

``` text
wardNo
    ↓
ward object
```

------------------------------------------------------------------------

# 7. Duplicate Ward Numbers

If the same actual ward number occurs more than once, the service does
not silently replace the existing mapping.

The first valid registry entry is retained:

``` text
First valid ward mapping
        ↓
Map entry retained
```

Later entries with the same ward number are ignored.

------------------------------------------------------------------------

# 8. createWardReport()

This internal function creates the initial synchronization report for a
ward.

The report contains:

``` text
wardId
wardNo
wardName
wardTableName
```

and initializes the ward synchronization counters:

``` text
sourceRecords = 0
processed = 0
insertedOrUpdated = 0
unmatchedWard = 0
failed = 0
```

------------------------------------------------------------------------

## Phone Mapping Counters

The report also initializes:

``` text
mappingReceived = 0
mappingValidPhones = 0
mappingInserted = 0
mappingSkippedExisting = 0
mappingSkippedInvalidPhone = 0
mappingFailed = 0
```

------------------------------------------------------------------------

## Initial Status

All statuses initially contain:

``` text
wardSyncStatus = NOT_STARTED
mappingSyncStatus = NOT_STARTED
status = NOT_STARTED
```

------------------------------------------------------------------------

# 9. finalizeWardStatus()

This internal function calculates the final status of a ward report.

It determines three levels:

``` text
Ward synchronization status
Mapping synchronization status
Overall status
```

------------------------------------------------------------------------

# 10. Ward Synchronization Status

A ward is marked:

``` text
SUCCESS
```

when:

``` text
failed === 0
unmatchedWard === 0
processed === sourceRecords
```

------------------------------------------------------------------------

## Partial Ward Status

A ward is marked:

``` text
PARTIAL
```

when:

``` text
processed > 0
```

but the full success condition is not satisfied.

------------------------------------------------------------------------

## Failed Ward Status

If no records were successfully processed:

``` text
processed === 0
```

the ward is marked:

``` text
FAILED
```

------------------------------------------------------------------------

# 11. Mapping Synchronization Status

The phone-to-ward mapping status is:

``` text
SUCCESS
```

when:

``` text
mappingFailed === 0
```

It is:

``` text
PARTIAL
```

when:

``` text
mappingFailed > 0
mappingReceived > 0
```

Otherwise it is:

``` text
FAILED
```

------------------------------------------------------------------------

# 12. Overall Ward Status

The overall status is:

``` text
SUCCESS
```

when both:

``` text
wardSyncStatus = SUCCESS
mappingSyncStatus = SUCCESS
```

It is:

``` text
FAILED
```

when either synchronization component is:

``` text
FAILED
```

Otherwise it is:

``` text
PARTIAL
```

------------------------------------------------------------------------

# 13. syncAllCitizens()

This is the full master-citizen synchronization method.

The intended endpoint is:

``` text
POST /api/master-citizen/sync
```

The method synchronizes all Helper citizen records across their
corresponding master ward tables.

The full flow is:

``` text
Load Ward Registry
      ↓
Build Ward Map
      ↓
Read Helper Citizens in batches
      ↓
Normalize citizen.ward
      ↓
Resolve Actual Ward Number
      ↓
Group Citizens by Ward
      ↓
Parallel Sync
   ↙          ↘
Ward Table   Phone Mapping
   ↓             ↓
Upsert       master_citizen_map
      ↓
Finalize Ward Status
      ↓
Return Full Sync Report
```

------------------------------------------------------------------------

# 14. syncAllCitizens() --- Repository Validation

The service first calls:

``` js
validateRepository()
```

If the repository is missing a required function, synchronization stops
immediately.

------------------------------------------------------------------------

# 15. syncAllCitizens() --- Load Ward Registry

The service loads all ward mappings using:

``` js
repository.getAllWardMappings()
```

The returned mappings are used to build the in-memory:

``` text
wardMap
```

The service logs the number of loaded wards.

------------------------------------------------------------------------

# 16. No Ward Registry

If the ward registry is empty:

``` text
wardMappings.length === 0
```

the method returns an empty synchronization summary.

The result contains:

``` text
sourceRecords
processed
insertedOrUpdated
unmatchedWard
failed
batches

wardsDiscovered
wardsAttempted
wardsSuccessful
wardsFailed

wardsSynced
wardsFailedDetails

mappingReceived
mappingValidPhones
mappingInserted
mappingSkippedExisting
mappingSkippedInvalidPhone
mappingFailed

durationMs
```

All counters are zero.

------------------------------------------------------------------------

# 17. Global Sync Counters

The full synchronization initializes:

``` text
skip = 0
sourceRecords = 0
processed = 0
insertedOrUpdated = 0
unmatchedWard = 0
failed = 0
batches = 0
```

Phone mapping counters are initialized separately:

``` text
mappingReceived
mappingValidPhones
mappingInserted
mappingSkippedExisting
mappingSkippedInvalidPhone
mappingFailed
```

------------------------------------------------------------------------

# 18. Ward Reports

The service maintains:

``` text
wardReports
```

as a:

``` text
Map
```

The key is:

``` text
actual ward number
```

not:

``` text
ward_id
```

Each ward receives one report.

------------------------------------------------------------------------

# 19. Helper Citizen Batch Processing

The service repeatedly calls:

``` js
repository.getHelperCitizens(
  skip,
  BATCH_SIZE
)
```

with:

``` text
BATCH_SIZE = 5000
```

The flow is:

``` text
skip = 0
   ↓
Get 5000 citizens
   ↓
Process batch
   ↓
skip += citizens.length
   ↓
Get next batch
```

The loop terminates when no citizens are returned.

------------------------------------------------------------------------

# 20. Source Record Counter

For every non-empty batch:

``` text
sourceRecords += citizens.length
```

Therefore:

``` text
sourceRecords
```

represents the total number of Helper citizen records read.

The batch counter is also incremented:

``` text
batches++
```

------------------------------------------------------------------------

# 21. Normalize Source Ward

For every citizen, the service normalizes:

``` text
citizen.ward
```

using:

``` js
repository.normalizeWardNumber(
  citizen.ward
)
```

The resulting value represents the:

``` text
ACTUAL WARD NUMBER
```

------------------------------------------------------------------------

# 22. Invalid Ward

If normalization returns:

``` text
null
```

the citizen is treated as unmatched.

The service:

``` text
unmatchedWard++
```

logs the citizen ID, and skips the citizen.

The citizen is not added to a ward group.

------------------------------------------------------------------------

# 23. Ward Registry Lookup

For a valid normalized ward number, the service performs:

``` js
wardMap.get(wardNo)
```

The lookup is based on:

``` text
wardNo
```

not:

``` text
wardId
```

------------------------------------------------------------------------

# 24. Ward Not Found

If the actual ward number does not exist in the master ward registry:

``` text
unmatchedWard++
```

is incremented.

The citizen is skipped and is not synchronized.

------------------------------------------------------------------------

# 25. Ward Table Validation

The resolved ward must contain:

``` text
wardTableName
```

If missing:

``` text
unmatchedWard++
```

is incremented.

The citizen is not synchronized.

------------------------------------------------------------------------

# 26. Create Ward Report

When a valid ward is encountered for the first time, the service
creates:

``` js
createWardReport(ward)
```

and stores it in:

``` text
wardReports
```

using:

``` text
actual ward number
```

as the key.

------------------------------------------------------------------------

# 27. Ward Source Record Counter

For every valid citizen assigned to a ward:

``` text
report.sourceRecords++
```

This tracks the number of source records belonging to that ward.

------------------------------------------------------------------------

# 28. Remove Source-Only Ward Field

Before sending the citizen to the destination table, the service
removes:

``` text
ward
```

from the citizen object.

It uses object destructuring:

``` js
const {
  ward: _ward,
  ...citizenData
} = citizen;
```

Therefore the destination citizen data does not contain the source-only
`ward` field.

------------------------------------------------------------------------

# 29. Group Citizens by Ward

Citizens are grouped using:

``` text
citizensByWard
```

The group structure is:

``` text
wardNo
   ↓
{
  ward,
  citizens: []
}
```

Each citizen is added to the corresponding ward group.

------------------------------------------------------------------------

# 30. Process Ward Groups

After grouping the current batch, the service iterates through every
ward group.

For each group it extracts:

``` text
ward
wardCitizens
report
```

It then obtains:

``` text
actualWardNumber =
Number(ward.wardNo)
```

------------------------------------------------------------------------

# 31. Important Ward ID Rule

The service explicitly distinguishes:

``` text
ward.wardId
```

from:

``` text
ward.wardNo
```

The internal database ID:

``` text
wardId
```

is not used for the phone-to-ward mapping.

The actual municipal ward number:

``` text
wardNo
```

is passed to:

``` text
syncCitizenWardMappings()
```

Therefore:

``` text
Ward 216
    ↓
master_citizen_map.ward_id = 216
```

rather than the internal registry ID.

------------------------------------------------------------------------

# 32. Parallel Ward Synchronization

The service performs two operations in parallel using:

``` js
Promise.allSettled()
```

The two operations are:

``` text
bulkUpsertWardCitizens()
syncCitizenWardMappings()
```

This means the two synchronization paths are independent.

``` text
             Ward Citizens
                  ↓
          Promise.allSettled()
             ↙           ↘
     Ward Table       Phone Mapping
       Sync               Sync
```

One operation can fail without automatically preventing the other
operation from completing.

------------------------------------------------------------------------

# 33. Ward Table Synchronization

The service calls:

``` js
repository.bulkUpsertWardCitizens(
  ward.wardTableName,
  wardCitizens
)
```

This synchronizes the citizens into the dynamic ward table.

------------------------------------------------------------------------

# 34. Successful Ward Table Sync

When the promise is fulfilled, the service reads:

``` text
result.insertedOrUpdated
```

and converts it to a number.

The global counters are updated:

``` text
processed += wardCitizens.length
insertedOrUpdated += upserted
```

The ward report is updated similarly:

``` text
report.processed += wardCitizens.length
report.insertedOrUpdated += upserted
```

The ward synchronization status is initially marked:

``` text
SUCCESS
```

------------------------------------------------------------------------

# 35. Failed Ward Table Sync

If the ward-table synchronization promise is rejected:

``` text
failed += wardCitizens.length
report.failed += wardCitizens.length
```

The ward synchronization status becomes:

``` text
FAILED
```

The error is logged.

------------------------------------------------------------------------

# 36. Phone → Ward Mapping Synchronization

The second parallel operation is:

``` js
repository.syncCitizenWardMappings(
  wardCitizens,
  actualWardNumber
)
```

This maintains the:

``` text
phone → ward
```

mapping.

The mapping receives the:

``` text
ACTUAL WARD NUMBER
```

------------------------------------------------------------------------

# 37. Mapping Result Counters

A successful mapping operation can return:

``` text
received
validPhones
inserted
skippedExisting
skippedInvalidPhone
```

These values are added to both:

``` text
global counters
```

and:

``` text
ward report counters
```

------------------------------------------------------------------------

# 38. Mapping Counters

The mapping counters represent:

``` text
mappingReceived
    ↓
Number of mapping records received

mappingValidPhones
    ↓
Number of valid phone records

mappingInserted
    ↓
Number of newly inserted mappings

mappingSkippedExisting
    ↓
Mappings already present

mappingSkippedInvalidPhone
    ↓
Mappings rejected because phone numbers were invalid
```

------------------------------------------------------------------------

# 39. Mapping Failure

If the mapping operation is rejected:

``` text
mappingFailed += wardCitizens.length
report.mappingFailed += wardCitizens.length
```

The mapping status becomes:

``` text
FAILED
```

The error is logged.

------------------------------------------------------------------------

# 40. Ward Status Finalization

After both parallel operations finish, the service calls:

``` js
finalizeWardStatus(report)
```

This calculates:

``` text
wardSyncStatus
mappingSyncStatus
status
```

for the ward.

------------------------------------------------------------------------

# 41. Next Citizen Batch

After processing all ward groups in the batch, the service increments:

``` text
skip += citizens.length
```

and retrieves the next Helper citizen batch.

The process continues until:

``` text
getHelperCitizens()
```

returns an empty array.

------------------------------------------------------------------------

# 42. Final Ward Reports

After all batches are processed, every ward report is finalized again
using:

``` js
finalizeWardStatus(report)
```

This ensures the final status reflects the complete synchronization
result.

------------------------------------------------------------------------

# 43. Successful Wards

The service creates:

``` text
wardsSynced
```

by selecting reports where:

``` text
status === SUCCESS
```

------------------------------------------------------------------------

# 44. Failed / Partial Wards

The service creates:

``` text
wardsFailedDetails
```

from every report where:

``` text
status !== SUCCESS
```

Therefore the array contains both:

``` text
FAILED
PARTIAL
```

ward synchronization reports.

------------------------------------------------------------------------

# 45. syncAllCitizens() Final Summary

The returned object contains global synchronization metrics:

``` text
sourceRecords
processed
insertedOrUpdated
unmatchedWard
failed
batches
```

------------------------------------------------------------------------

# 46. Ward Summary

The returned object also contains:

``` text
wardsDiscovered
wardsAttempted
wardsSuccessful
wardsFailed
```

The service currently derives:

``` text
wardsDiscovered =
allWardReports.length

wardsAttempted =
allWardReports.length

wardsSuccessful =
wardsSynced.length

wardsFailed =
wardsFailedDetails.length
```

------------------------------------------------------------------------

# 47. Mapping Summary

The full sync result contains:

``` text
mappingReceived
mappingValidPhones
mappingInserted
mappingSkippedExisting
mappingSkippedInvalidPhone
mappingFailed
```

------------------------------------------------------------------------

# 48. Duration

The synchronization duration is calculated using:

``` text
Date.now() - startedAt
```

and returned as:

``` text
durationMs
```

------------------------------------------------------------------------

# 49. syncOneWard()

This method synchronizes citizens for one specific municipal ward.

The intended endpoint is:

``` text
POST /api/master-citizen/sync/ward/:wardNo
```

The input is:

``` text
ACTUAL WARD NUMBER
```

For example:

``` text
216
```

------------------------------------------------------------------------

# 50. syncOneWard() --- Repository Validation

The service first calls:

``` js
validateRepository()
```

This verifies that all required repository methods are available.

------------------------------------------------------------------------

# 51. syncOneWard() --- Ward Number Validation

The supplied ward number is converted using:

``` js
Number(wardNo)
```

The resulting value must be:

``` text
an integer
greater than 0
```

Otherwise the service throws:

``` text
Invalid ward number
```

------------------------------------------------------------------------

# 52. syncOneWard() --- Ward Registry Lookup

The service loads all ward mappings using:

``` js
repository.getAllWardMappings()
```

It then filters them using:

``` text
Number(item.wardNo) === targetWardNo
```

Again, the lookup uses:

``` text
ACTUAL WARD NUMBER
```

------------------------------------------------------------------------

# 53. Ward Not Found

If no registry entry matches the requested ward number, the service
throws:

``` text
Ward number <targetWardNo> not found
```

------------------------------------------------------------------------

# 54. Duplicate Ward Number

If multiple registry entries match the same ward number, the service
throws:

``` text
Multiple wards found with ward number <targetWardNo>. Ward number must be unique.
```

Therefore single-ward synchronization requires actual ward-number
uniqueness.

------------------------------------------------------------------------

# 55. Ward Table Validation

The selected ward must contain:

``` text
wardTableName
```

If missing, the service throws:

``` text
Ward number <targetWardNo> does not have an initialized ward table
```

------------------------------------------------------------------------

# 56. Single-Ward Counters

The method initializes:

``` text
skip
sourceRecords
processed
unmatchedWard
batches
insertedOrUpdated
```

and mapping counters:

``` text
mappingReceived
mappingValidPhones
mappingInserted
mappingSkippedExisting
mappingSkippedInvalidPhone
mappingFailed
```

------------------------------------------------------------------------

# 57. Read Helper Data for Single Ward

The service still reads Helper citizens in batches of:

``` text
5000
```

using:

``` js
repository.getHelperCitizens(
  skip,
  BATCH_SIZE
)
```

It does not request a ward-filtered query directly from the repository.

Instead, it reads each batch and filters the records in memory.

------------------------------------------------------------------------

# 58. Filter Target Ward

For every batch, the service selects only citizens where:

``` js
repository.normalizeWardNumber(
  citizen.ward
) === targetWardNo
```

The source-only:

``` text
ward
```

field is then removed from each selected citizen.

------------------------------------------------------------------------

# 59. Empty Target-Ward Batch

If a batch contains no citizens belonging to the requested ward:

``` text
wardCitizens.length === 0
```

the service simply advances:

``` text
skip += citizens.length
```

and continues to the next batch.

No synchronization operation is performed for that batch.

------------------------------------------------------------------------

# 60. Single-Ward Parallel Sync

When target-ward citizens exist, the service performs:

``` js
Promise.allSettled([
  repository.bulkUpsertWardCitizens(...),
  repository.syncCitizenWardMappings(...)
])
```

The two synchronization paths therefore execute in parallel.

------------------------------------------------------------------------

# 61. Single-Ward Table Sync Result

If the ward-table operation succeeds:

``` text
processed += wardCitizens.length
```

and:

``` text
insertedOrUpdated += result.insertedOrUpdated
```

If it fails:

``` text
unmatchedWard += wardCitizens.length
```

The error is logged.

------------------------------------------------------------------------

# 62. Single-Ward Mapping Result

If phone-to-ward mapping succeeds, the service accumulates:

``` text
mappingReceived
mappingValidPhones
mappingInserted
mappingSkippedExisting
mappingSkippedInvalidPhone
```

If it fails:

``` text
mappingFailed += wardCitizens.length
```

The mapping error is logged.

------------------------------------------------------------------------

# 63. Single-Ward Status

The ward synchronization status is calculated as:

``` text
SUCCESS
```

when:

``` text
unmatchedWard === 0
processed === sourceRecords
```

It is:

``` text
PARTIAL
```

when:

``` text
processed > 0
```

Otherwise:

``` text
FAILED
```

------------------------------------------------------------------------

# 64. Single-Ward Mapping Status

Mapping status is:

``` text
SUCCESS
```

when:

``` text
mappingFailed === 0
```

It is:

``` text
PARTIAL
```

when:

``` text
mappingFailed > 0
mappingReceived > 0
```

Otherwise:

``` text
FAILED
```

------------------------------------------------------------------------

# 65. Single-Ward Overall Status

The final status is:

``` text
SUCCESS
```

when both synchronization components succeed.

It is:

``` text
FAILED
```

when either component fails.

Otherwise it is:

``` text
PARTIAL
```

------------------------------------------------------------------------

# 66. syncOneWard() Result

The returned object contains:

``` text
wardId
wardNo
wardName
wardTableName
```

plus:

``` text
sourceRecords
processed
insertedOrUpdated
unmatchedWard
failed
batches
```

and:

``` text
mappingReceived
mappingValidPhones
mappingInserted
mappingSkippedExisting
mappingSkippedInvalidPhone
mappingFailed
```

The final statuses are:

``` text
wardSyncStatus
mappingSyncStatus
status
```

and the execution duration:

``` text
durationMs
```

------------------------------------------------------------------------

# 67. syncAllCitizens() vs syncOneWard()

  -------------------------------------------------------------------------
  Feature                 `syncAllCitizens()`      `syncOneWard()`
  ----------------------- ------------------------ ------------------------
  Scope                   All wards                One actual ward number

  Ward lookup             In-memory ward map       Direct filtering of
                                                   registry

  Batch size              5000                     5000

  Citizen grouping        Groups by ward           Filters target ward

  Ward table sync         Yes                      Yes

  Phone mapping           Yes                      Yes

  Parallel operations     `Promise.allSettled()`   `Promise.allSettled()`

  Ward reports            Detailed per-ward        Single final report
                          reports                  

  Duration                Returned                 Returned
  -------------------------------------------------------------------------

------------------------------------------------------------------------

# 68. Important Ward Number Rule

The most important mapping rule in this service is:

``` text
ward.wardId
    =
internal database identifier

ward.wardNo
    =
actual municipal ward number
```

For:

``` text
master_citizen_map.ward_id
```

the service passes:

``` text
ward.wardNo
```

not:

``` text
ward.wardId
```

This rule is explicitly applied in both:

``` text
syncAllCitizens()
syncOneWard()
```

------------------------------------------------------------------------

# 69. Synchronization Architecture

``` text
Helper Citizen Data
        ↓
normalizeWardNumber()
        ↓
Actual Ward Number
        ↓
Master Ward Registry
        ↓
Dynamic Ward Table
```

In parallel:

``` text
Citizen Phone Number
        ↓
syncCitizenWardMappings()
        ↓
master_citizen_map
        ↓
ward_id = Actual Ward Number
```

------------------------------------------------------------------------

# 70. Batch Architecture

The service processes Helper citizens incrementally:

``` text
Helper Database
      ↓
5000 records
      ↓
Process
      ↓
skip += batch size
      ↓
5000 records
      ↓
Process
      ↓
...
      ↓
No records
      ↓
Finish
```

This design prevents the entire Helper citizen dataset from being loaded
at once.

------------------------------------------------------------------------

# 71. Failure Isolation

For each ward group, the two synchronization operations use:

``` text
Promise.allSettled()
```

Therefore:

``` text
Ward Table Sync Failure
```

does not automatically prevent:

``` text
Phone Mapping Sync
```

from completing.

Similarly:

``` text
Phone Mapping Failure
```

does not automatically cancel:

``` text
Ward Table Sync
```

------------------------------------------------------------------------

# 72. Logging

The service logs major synchronization events including:

``` text
Full sync started
Ward registry loaded
Batch processing
Ward table synchronization
Phone → ward mapping
Mapping failures
Ward synchronization failures
Full sync completed
Source records
Processed records
Inserted/updated records
Unmatched wards
Failed records
Successful wards
Failed/partial wards
Duration
```

------------------------------------------------------------------------

# 73. Exported Functions

The service exports:

``` text
syncAllCitizens
syncOneWard
buildWardMap
```

The following functions remain internal:

``` text
validateRepository
createWardReport
finalizeWardStatus
```

------------------------------------------------------------------------

# 74. Summary

`masterCitizenSync.service.js` is the orchestration layer for
synchronizing citizen records from the Helper database into the master
citizen ward structure.

Its two primary operations are:

``` text
syncAllCitizens()
syncOneWard()
```

Both use batches of:

``` text
5000 citizens
```

and both synchronize two independent destinations in parallel:

``` text
Helper Citizens
      ↓
Dynamic Ward Table

Helper Citizen Phone
      ↓
master_citizen_map
```

The service consistently resolves wards using the:

``` text
ACTUAL MUNICIPAL WARD NUMBER
```

rather than the internal ward database ID.

For example:

``` text
wardId = 3
wardNo = 216
```

the mapping uses:

``` text
ward_id = 216
```

not:

``` text
ward_id = 3
```

The service also produces detailed ward-level synchronization reports
with:

``` text
SUCCESS
PARTIAL
FAILED
```

statuses for both ward-table synchronization and phone-to-ward mapping.

Overall architecture:

``` text
                  Helper Database
                         ↓
                  Citizen Records
                         ↓
                 normalizeWardNumber
                         ↓
                  Actual Ward Number
                         ↓
              Master Ward Registry
                    ↙         ↘
                   ↓           ↓
          Dynamic Ward Table   master_citizen_map
                   ↓           ↓
             Citizen Data   Phone → Ward
```
