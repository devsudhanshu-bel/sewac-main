# masterCitizenWard.service.js Documentation

## 1. File Overview

**File:** `masterCitizenWard.service.js`\
**Location:** `src/services/masterCitizenWard.service.js`

This service provides the business-logic layer for managing wards within
the geographic hierarchy:

``` text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

It coordinates:

``` text
City validation
Zone validation
Division validation
Ward-number validation
Ward-name validation
Dynamic ward-table generation
Physical ward-table collision checks
Duplicate ward-number checks
Ward registry creation
Physical ward-table creation
Ward table-name registration
Zone ward counters
Ward retrieval
Ward updates
Safe ward deletion
Rollback handling
```

The main creation flow is:

``` text
City ID + Zone ID + Division ID + Ward Data
                    ↓
                Validate IDs
                    ↓
                Find City
                    ↓
              Validate City Table
                    ↓
                Find Zone
                    ↓
              Validate Zone Table
                    ↓
              Find Division
                    ↓
            Validate Division Table
                    ↓
        Generate Ward Table Name
                    ↓
        Check Physical Table Collision
                    ↓
        Check Duplicate Ward Number
                    ↓
          Create Ward Registry Record
                    ↓
          Create Physical Ward Table
                    ↓
          Store Ward Table Name
                    ↓
          Increment Zone Ward Count
                    ↓
              Return Ward
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
masterCitizenWard.repository
masterCitizenTables utilities
masterCitizenPrisma
```

The repository is imported from:

``` text
./masterCitizenWard.repository
```

The table utilities are imported from:

``` text
../utils/masterCitizenTables
```

The Prisma client is imported from:

``` text
../config/masterCitizenPrisma
```

The table utilities used are:

``` text
generateWardTableName
createWardTable
wardTableExists
dropDynamicTable
```

------------------------------------------------------------------------

# 3. createWard()

This is the main ward-creation method.

It receives:

``` text
cityId
zoneId
divisionId
wardNo
wardName
geoBoundary
```

The method validates the complete geographic hierarchy, prevents
duplicate ward numbers within the division, creates the ward registry
record, creates the physical ward table, stores the physical table name,
and increments the zone's ward counter.

------------------------------------------------------------------------

# 4. createWard() --- City ID Validation

The service requires:

``` text
cityId
```

to be an integer.

It checks:

``` js
Number.isInteger(cityId)
```

If invalid, it throws:

``` text
Invalid city ID
```

------------------------------------------------------------------------

# 5. createWard() --- Zone ID Validation

The service requires:

``` text
zoneId
```

to be an integer.

If invalid, it throws:

``` text
Invalid zone ID
```

------------------------------------------------------------------------

# 6. createWard() --- Division ID Validation

The service requires:

``` text
divisionId
```

to be an integer.

If invalid, it throws:

``` text
Invalid division ID
```

------------------------------------------------------------------------

# 7. createWard() --- Ward Number Validation

The service requires:

``` text
wardNo
```

to be:

``` text
an integer
greater than 0
```

If the validation fails, it throws:

``` text
wardNo must be a positive integer
```

Therefore zero and negative ward numbers are rejected.

------------------------------------------------------------------------

# 8. createWard() --- Ward Name Validation

The service requires:

``` text
wardName
```

to be a non-empty string.

If missing or not a string, it throws:

``` text
wardName is required
```

The name is then normalized using:

``` js
wardName.trim()
```

------------------------------------------------------------------------

## Empty Ward Name

If the trimmed name becomes empty, the service throws:

``` text
wardName cannot be empty
```

The cleaned ward name is used for subsequent processing.

------------------------------------------------------------------------

# 9. createWard() --- Find City

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If no city exists, it throws:

``` text
City not found
```

------------------------------------------------------------------------

# 10. City Initialization Validation

The city must contain:

``` text
city_table_name
```

If missing, the service throws:

``` text
City has not been initialized yet
```

The physical city table name is then used to locate the requested zone.

------------------------------------------------------------------------

# 11. createWard() --- Find Zone

The service calls:

``` js
repository.findZone(
  city.city_table_name,
  zoneId
)
```

If the zone does not exist, it throws:

``` text
Zone not found
```

------------------------------------------------------------------------

# 12. Zone Initialization Validation

The zone must contain:

``` text
zone_table_name
```

If missing, the service throws:

``` text
Zone has not been initialized yet
```

The physical zone table name is then used to locate the division.

------------------------------------------------------------------------

# 13. createWard() --- Find Division

The service calls:

``` js
repository.findDivision(
  zone.zone_table_name,
  divisionId
)
```

If the division does not exist, it throws:

``` text
Division not found
```

------------------------------------------------------------------------

# 14. Division Initialization Validation

The division must contain:

``` text
division_table_name
```

If missing, the service throws:

``` text
Division has not been initialized yet
```

The physical division table becomes the registry location for the ward.

------------------------------------------------------------------------

# 15. Ward Table Name Generation

The physical ward table name is generated using:

``` js
generateWardTableName(
  cleanedWardName,
  wardNo
)
```

The generation logic is delegated to:

``` text
masterCitizenTables
```

The service therefore does not manually construct the physical table
name.

The generated value is stored as:

``` text
wardTableName
```

------------------------------------------------------------------------

# 16. Physical Ward Table Collision Check

Before creating the ward registry record, the service checks:

``` js
wardTableExists(
  wardTableName
)
```

If the physical table already exists, it throws:

``` text
Ward table "<wardTableName>" already exists
```

This prevents a physical table-name collision.

------------------------------------------------------------------------

# 17. Duplicate Ward Number Check

The service retrieves all wards belonging to the division:

``` js
repository.getWards(
  division.division_table_name
)
```

It then searches for an existing ward where:

``` js
Number(ward.ward_no) === wardNo
```

If a matching ward exists, it throws:

``` text
Ward number <wardNo> already exists in this division
```

Therefore:

``` text
ward_no
```

must be unique within a division.

------------------------------------------------------------------------

# 18. Ward Registry Creation

After all validation and collision checks pass, the service creates the
logical ward record using:

``` js
repository.createWard(
  division.division_table_name,
  {
    wardNo,
    wardName: cleanedWardName,
    geoBoundary,
  }
)
```

The created record is stored as:

``` text
ward
```

At this point, the logical ward registry record exists before the
physical ward table is created.

------------------------------------------------------------------------

# 19. Physical Ward Table Creation

The physical table creation occurs inside a:

``` text
try / catch
```

block.

The service calls:

``` js
createWardTable(
  wardTableName
)
```

This creates the dedicated physical table for the ward.

------------------------------------------------------------------------

# 20. Store Physical Ward Table Name

After successful physical table creation, the service updates the ward
registry:

``` js
repository.updateWardTableName(
  division.division_table_name,
  ward.ward_id,
  wardTableName
)
```

This associates:

``` text
Logical Ward
        ↕
ward_table_name
        ↕
Physical Ward Table
```

The updated record is stored as:

``` text
updatedWard
```

------------------------------------------------------------------------

# 21. Update Zone Ward Counter

After successful physical table creation and table-name registration,
the service increments:

``` text
total_wards
```

for the corresponding zone.

The SQL operation is:

``` sql
COALESCE(total_wards, 0) + 1
```

and is applied using:

``` text
zone_id = zoneId
```

Therefore the zone-level ward counter is maintained automatically.

------------------------------------------------------------------------

# 22. createWard() Success

After all creation steps succeed, the service returns:

``` text
updatedWard
```

The returned value is the ward record after its physical table name has
been stored.

------------------------------------------------------------------------

# 23. createWard() Rollback

If any operation inside the `try` block fails:

``` text
createWardTable()
updateWardTableName()
zone ward-counter update
```

the service attempts to remove the previously created registry record.

It calls:

``` js
repository.deleteWard(
  division.division_table_name,
  ward.ward_id
)
```

------------------------------------------------------------------------

# 24. Rollback Failure Handling

If the rollback itself fails, the service logs:

``` text
Ward rollback failed:
```

together with the rollback error.

The original error is then re-thrown.

Therefore a rollback failure does not replace the original creation
error.

------------------------------------------------------------------------

# 25. createWard() Complete Flow

``` text
Validate City ID
        ↓
Validate Zone ID
        ↓
Validate Division ID
        ↓
Validate Ward Number
        ↓
Validate Ward Name
        ↓
Find City
        ↓
City Initialized?
        ↓
Find Zone
        ↓
Zone Initialized?
        ↓
Find Division
        ↓
Division Initialized?
        ↓
Generate Ward Table Name
        ↓
Check Physical Table Collision
        ↓
Check Duplicate Ward Number
        ↓
Create Ward Registry
        ↓
Create Physical Ward Table
        ↓
Store Ward Table Name
        ↓
Increment total_wards
        ↓
Return Ward
```

------------------------------------------------------------------------

# 26. getWards()

This method retrieves all wards belonging to a specified division.

It receives:

``` text
cityId
zoneId
divisionId
```

The service validates the complete hierarchy before delegating the
actual retrieval to the repository.

------------------------------------------------------------------------

# 27. getWards() --- City Validation

The service calls:

``` js
repository.findCityById(cityId)
```

If the city does not exist:

``` text
City not found
```

If the city has no:

``` text
city_table_name
```

the service throws:

``` text
City has not been initialized yet
```

------------------------------------------------------------------------

# 28. getWards() --- Zone Validation

The service calls:

``` js
repository.findZone(
  city.city_table_name,
  zoneId
)
```

If the zone does not exist:

``` text
Zone not found
```

If:

``` text
zone.zone_table_name
```

is missing:

``` text
Zone has not been initialized yet
```

------------------------------------------------------------------------

# 29. getWards() --- Division Validation

The service calls:

``` js
repository.findDivision(
  zone.zone_table_name,
  divisionId
)
```

If the division does not exist:

``` text
Division not found
```

If:

``` text
division.division_table_name
```

is missing:

``` text
Division has not been initialized yet
```

------------------------------------------------------------------------

# 30. getWards() --- Repository Retrieval

After validation, the service calls:

``` js
repository.getWards(
  division.division_table_name
)
```

The repository result is returned directly.

The service performs no additional filtering or transformation.

------------------------------------------------------------------------

# 31. getWard()

This method retrieves one ward using its business-facing:

``` text
wardNo
```

It receives:

``` text
cityId
zoneId
divisionId
wardNo
```

------------------------------------------------------------------------

# 32. getWard() --- Ward Number Validation

The service requires:

``` text
wardNo
```

to be:

``` text
an integer
greater than 0
```

If invalid, it throws:

``` text
Invalid ward number
```

------------------------------------------------------------------------

# 33. getWard() --- Geographic Hierarchy Validation

The service validates:

``` text
City
Zone
Division
```

using the same sequence as `getWards()`.

The possible errors are:

``` text
City not found
City has not been initialized yet
Zone not found
Zone has not been initialized yet
Division not found
Division has not been initialized yet
```

------------------------------------------------------------------------

# 34. getWard() --- Ward Lookup

The service calls:

``` js
repository.getWardByNumber(
  division.division_table_name,
  wardNo
)
```

The lookup is explicitly performed using:

``` text
ward_no
```

not:

``` text
ward_id
```

------------------------------------------------------------------------

# 35. Ward Not Found

If the repository returns no ward, the service throws:

``` text
Ward not found
```

Otherwise the ward record is returned.

------------------------------------------------------------------------

# 36. updateWard()

This method updates an existing ward.

It receives:

``` text
cityId
zoneId
divisionId
wardId
data
```

The update operation uses:

``` text
ward_id
```

as the primary identifier.

This is explicitly different from `getWard()`, which uses:

``` text
wardNo
```

------------------------------------------------------------------------

# 37. updateWard() --- Ward ID Validation

The service requires:

``` text
wardId
```

to be:

``` text
an integer
greater than 0
```

If invalid, it throws:

``` text
Invalid ward ID
```

------------------------------------------------------------------------

# 38. updateWard() --- Hierarchy Validation

The service validates:

``` text
City
Zone
Division
```

before modifying the ward.

Possible errors are:

``` text
City not found
City has not been initialized yet
Zone not found
Zone has not been initialized yet
Division not found
Division has not been initialized yet
```

------------------------------------------------------------------------

# 39. Find Current Ward by ID

Before updating, the service retrieves the current ward using:

``` js
repository.getWardById(
  division.division_table_name,
  wardId
)
```

This is important because PATCH/update operations use:

``` text
ward_id
```

If the ward does not exist, the service throws:

``` text
Ward not found
```

------------------------------------------------------------------------

# 40. updateWard() --- Ward Number Validation

If:

``` text
data.wardNo
```

is supplied, it must be:

``` text
an integer
greater than 0
```

Otherwise the service throws:

``` text
wardNo must be a positive integer
```

------------------------------------------------------------------------

# 41. Duplicate Ward Number During Update

If a new:

``` text
wardNo
```

is supplied, the service searches for an existing ward using:

``` js
repository.getWardByNumber(
  division.division_table_name,
  data.wardNo
)
```

If a matching ward exists, the service compares:

``` text
existingWard.ward_id
```

with:

``` text
wardId
```

------------------------------------------------------------------------

## Same Ward Number

If:

``` text
existingWard.ward_id === wardId
```

the update is allowed.

This means a ward can retain its current ward number.

------------------------------------------------------------------------

## Another Ward Owns the Number

If:

``` text
existingWard.ward_id !== wardId
```

the service throws:

``` text
Ward number <wardNo> already exists
```

Therefore ward numbers remain unique within a division.

------------------------------------------------------------------------

# 42. updateWard() --- Ward Name Validation

If:

``` text
data.wardName
```

is supplied, it must be:

``` text
a string
non-empty after trimming
```

Otherwise the service throws:

``` text
wardName must be a non-empty string
```

The service then normalizes the value using:

``` js
data.wardName =
  data.wardName.trim()
```

------------------------------------------------------------------------

# 43. updateWard() --- Repository Update

After validation, the service delegates the actual update:

``` js
repository.updateWard(
  division.division_table_name,
  wardId,
  data
)
```

If the repository returns no updated ward, the service throws:

``` text
Ward not found
```

Otherwise the updated ward is returned.

------------------------------------------------------------------------

# 44. Ward Identifier Rules

The service intentionally uses different identifiers for different
operations:

``` text
GET one ward
    ↓
wardNo

PATCH / update
    ↓
wardId
```

This distinction is explicitly documented in the implementation.

Conceptually:

``` text
ward_id
    =
internal database identifier

ward_no
    =
municipal/business ward number
```

------------------------------------------------------------------------

# 45. deleteWard()

This method deletes a ward while protecting citizen data.

It receives:

``` text
cityId
zoneId
divisionId
wardId
```

Deletion is based on:

``` text
ward_id
```

------------------------------------------------------------------------

# 46. deleteWard() --- Ward ID Validation

The service requires:

``` text
wardId
```

to be:

``` text
an integer
greater than 0
```

If invalid:

``` text
Invalid ward ID
```

------------------------------------------------------------------------

# 47. deleteWard() --- Hierarchy Validation

The service verifies:

``` text
City exists
City is initialized
Zone exists
Zone is initialized
Division exists
Division is initialized
```

The corresponding errors are:

``` text
City not found
City has not been initialized yet
Zone not found
Zone has not been initialized yet
Division not found
Division has not been initialized yet
```

------------------------------------------------------------------------

# 48. Find Ward by ID

The service explicitly retrieves the ward using:

``` js
repository.getWardById(
  division.division_table_name,
  wardId
)
```

The implementation explicitly states:

``` text
DELETE uses ward_id.
Do NOT use getWardByNumber() here.
```

If no ward exists:

``` text
Ward not found
```

------------------------------------------------------------------------

# 49. Physical Ward Table Check

If the ward has:

``` text
ward_table_name
```

the service queries the physical table:

``` sql
SELECT COUNT(*)::int AS count
FROM "<ward_table_name>"
```

This determines how many records exist in the physical ward table.

------------------------------------------------------------------------

# 50. Citizen Data Protection

If:

``` text
rowCount > 0
```

the service prevents deletion.

It throws:

``` text
Ward cannot be deleted because it contains citizen data
```

Therefore a ward containing citizen records cannot be deleted.

This is a deliberate data-protection rule.

------------------------------------------------------------------------

# 51. Drop Empty Physical Ward Table

If the physical ward table exists and contains:

``` text
0 rows
```

the service calls:

``` js
dropDynamicTable(
  ward.ward_table_name
)
```

The physical table is therefore removed only when it is empty.

------------------------------------------------------------------------

# 52. Delete Ward Registry Record

After the physical table is safely handled, the service deletes the
logical ward record:

``` js
repository.deleteWard(
  division.division_table_name,
  ward.ward_id
)
```

This removes the ward from the division registry.

------------------------------------------------------------------------

# 53. Update Zone Ward Counter

After successful deletion, the service decrements:

``` text
total_wards
```

for the corresponding zone.

The SQL uses:

``` sql
GREATEST(
  COALESCE(total_wards, 0) - 1,
  0
)
```

Therefore the counter cannot become negative.

------------------------------------------------------------------------

# 54. deleteWard() Success Response

The method returns:

``` json
{
  "ward_id": "...",
  "ward_no": "...",
  "deleted": true
}
```

The returned values correspond to the ward that was successfully
removed.

------------------------------------------------------------------------

# 55. Ward Lifecycle

The complete ward lifecycle is:

``` text
CREATE
  ↓
Ward Registry
  +
Physical Ward Table
  ↓
READ
  ↓
UPDATE
  ↓
DELETE
```

Deletion is protected:

``` text
Physical Table Empty
        ↓
      DELETE

Physical Table Contains Citizen Data
        ↓
   BLOCK DELETE
```

------------------------------------------------------------------------

# 56. Geographic Hierarchy

The service operates within:

``` text
City
  ↓
City Physical Table
  ↓
Zone
  ↓
Zone Physical Table
  ↓
Division
  ↓
Division Physical Table
  ↓
Ward
  ↓
Physical Ward Table
```

The corresponding table references are:

``` text
city_table_name
zone_table_name
division_table_name
ward_table_name
```

------------------------------------------------------------------------

# 57. Dynamic Table Architecture

Every ward receives a physical table generated by:

``` js
generateWardTableName(
  cleanedWardName,
  wardNo
)
```

The generated physical table name is stored in:

``` text
ward_table_name
```

This creates the relationship:

``` text
Logical Ward Record
        ↕
ward_table_name
        ↕
Physical Ward Table
```

------------------------------------------------------------------------

# 58. Zone Counter Management

The service maintains:

``` text
total_wards
```

at the zone level.

On successful ward creation:

``` text
total_wards + 1
```

On successful ward deletion:

``` text
total_wards - 1
```

with:

``` text
minimum = 0
```

The counter update is scoped using:

``` text
zone_id
```

------------------------------------------------------------------------

# 59. Ward Number Uniqueness

Ward numbers are enforced as unique within a division.

During creation:

``` text
getWards()
    ↓
Search existing ward_no
    ↓
Reject duplicate
```

During update:

``` text
getWardByNumber()
    ↓
Compare existing ward_id
    ↓
Allow same ward
    OR
Reject another ward's number
```

Therefore:

``` text
Same ward retaining ward_no
    ↓
Allowed

Another ward already using ward_no
    ↓
Rejected
```

------------------------------------------------------------------------

# 60. Repository Interaction

The service uses the ward repository for:

``` text
findCityById()
findZone()
findDivision()

createWard()
getWards()
getWardByNumber()
getWardById()
updateWard()
updateWardTableName()
deleteWard()
```

It uses the table utilities for:

``` text
generateWardTableName()
createWardTable()
wardTableExists()
dropDynamicTable()
```

It uses Prisma directly for:

``` text
Checking physical ward-table row count
Incrementing zone total_wards
Decrementing zone total_wards
```

------------------------------------------------------------------------

# 61. Error Handling

The service explicitly validates and throws errors for:

``` text
Invalid city ID
Invalid zone ID
Invalid division ID
wardNo must be a positive integer
wardName is required
wardName cannot be empty
City not found
City has not been initialized yet
Zone not found
Zone has not been initialized yet
Division not found
Division has not been initialized yet
Ward table already exists
Ward number already exists in this division
Invalid ward number
Invalid ward ID
Ward not found
wardName must be a non-empty string
Ward number already exists
Ward cannot be deleted because it contains citizen data
```

Creation also includes rollback handling when post-registry operations
fail.

------------------------------------------------------------------------

# 62. Exported Functions

The service exports:

``` text
createWard
getWards
getWard
updateWard
deleteWard
```

------------------------------------------------------------------------

# 63. Architecture

``` text
Controller
    ↓
masterCitizenWard.service
    │
    ├── masterCitizenWard.repository
    │       ↓
    │   Ward Registry
    │
    ├── masterCitizenTables
    │       ↓
    │   Physical Ward Tables
    │
    └── masterCitizenPrisma
            ↓
      Zone Ward Counter
```

------------------------------------------------------------------------

# 64. Summary

`masterCitizenWard.service.js` is the business-logic layer responsible
for managing wards within the:

``` text
City → Zone → Division → Ward
```

geographic hierarchy.

Its creation process coordinates:

``` text
ID validation
Ward-number validation
Ward-name validation
Hierarchy validation
Physical table-name generation
Physical table collision checking
Duplicate ward-number checking
Ward registry creation
Physical ward-table creation
Table-name registration
Zone ward-counter maintenance
```

Its update process explicitly separates:

``` text
ward_id
```

from:

``` text
ward_no
```

where:

``` text
ward_id
    =
internal database identifier

ward_no
    =
municipal/business ward number
```

Therefore:

``` text
GET
    ↓
wardNo

PATCH
    ↓
wardId

DELETE
    ↓
wardId
```

Ward-number uniqueness is enforced within each division.

The deletion process is intentionally protective:

``` text
Ward physical table contains citizen data
        ↓
Deletion blocked

Ward physical table is empty
        ↓
Physical table dropped
        ↓
Registry record deleted
        ↓
Zone total_wards decremented
```

Overall architecture:

``` text
City
  ↓
Zone
  ↓
Division
  ↓
Ward Registry
  ↓
Physical Ward Table
  ↓
Citizen Data
```

The service therefore coordinates both the logical ward registry and the
dedicated physical ward table while maintaining the zone-level ward
count and protecting existing citizen data.
