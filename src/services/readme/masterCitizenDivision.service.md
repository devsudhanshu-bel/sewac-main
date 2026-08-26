# masterCitizenDivision.service.js Documentation

## 1. File Overview

**File:** `masterCitizenDivision.service(2).js`\
**Location:** `src/services/masterCitizenDivision.service(2).js`

This service provides the business-logic layer for managing divisions
within the geographic hierarchy:

``` text
City
  ↓
Zone
  ↓
Division
```

It coordinates:

``` text
City validation
Zone validation
Division-name validation
Dynamic division-table name generation
Physical division-table collision checks
Division registry creation
Physical division-table creation
Division table-name registration
City division-counter maintenance
Division retrieval
Division updates
Safe division deletion
Rollback handling
```

The main creation flow is:

``` text
City ID + Zone ID + Division Data
          ↓
       Validate IDs
          ↓
       Validate Division Name
          ↓
       Find City
          ↓
   Validate City Table
          ↓
       Find Zone
          ↓
   Validate Zone Table
          ↓
Generate Division Table Name
          ↓
Check Physical Table Collision
          ↓
Create Division Registry Record
          ↓
Create Physical Division Table
          ↓
Store Division Table Name
          ↓
Increment City's Total Divisions
          ↓
Return Division
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
masterCitizenDivision.repository
masterCitizenTables utilities
masterCitizenPrisma
```

The repository is imported from:

``` text
./masterCitizenDivision.repository
```

The table utilities are imported from:

``` text
../utils/masterCitizenTables
```

The utilities used are:

``` text
generateDivisionTableName
createDivisionTable
divisionTableExists
dropDynamicTable
```

The Prisma client is imported from:

``` text
../config/masterCitizenPrisma
```

------------------------------------------------------------------------

# 3. findZone()

This internal helper retrieves a zone from a city's physical city table.

It receives:

``` text
cityTableName
zoneId
```

The query selects:

``` text
zone_id
zone_name
zone_table_name
```

from:

``` text
cityTableName
```

using:

``` text
zone_id = $1
```

and:

``` text
LIMIT 1
```

------------------------------------------------------------------------

## findZone() Result

The helper returns:

``` js
result[0] || null
```

Therefore:

``` text
Zone found
    ↓
Return zone

Zone not found
    ↓
Return null
```

This helper is used internally by:

``` text
createDivision()
getDivisions()
getDivision()
updateDivision()
deleteDivision()
```

------------------------------------------------------------------------

# 4. createDivision()

This is the main division-creation method.

It receives:

``` text
cityId
zoneId
divisionName
geoBoundary
```

The method validates the parent city and zone, validates the division
name, generates the physical division table name, prevents physical
table collisions, creates the division registry record, creates the
physical division table, registers its table name, and increments the
city's division count.

------------------------------------------------------------------------

# 5. createDivision() --- City ID Validation

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

# 6. createDivision() --- Zone ID Validation

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

# 7. createDivision() --- Division Name Validation

The service requires:

``` text
divisionName
```

to be a string.

If the value is missing or is not a string, it throws:

``` text
divisionName is required
```

The name is then normalized using:

``` js
divisionName.trim()
```

------------------------------------------------------------------------

## Empty Division Name

If the trimmed division name becomes empty, the service throws:

``` text
divisionName cannot be empty
```

The cleaned value is stored as:

``` text
cleanedDivisionName
```

and is used for subsequent processing.

------------------------------------------------------------------------

# 8. createDivision() --- Find City

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If the city does not exist, it throws:

``` text
City not found
```

------------------------------------------------------------------------

# 9. City Initialization Validation

The city must already have a physical city table.

The service checks:

``` text
city.city_table_name
```

If it is missing, it throws:

``` text
City has not been initialized yet
```

The physical city table name is then used to locate the requested zone.

------------------------------------------------------------------------

# 10. createDivision() --- Find Zone

The service calls:

``` js
findZone(
  city.city_table_name,
  zoneId
)
```

If the zone does not exist, it throws:

``` text
Zone not found
```

------------------------------------------------------------------------

# 11. Zone Initialization Validation

The zone must contain:

``` text
zone_table_name
```

If missing, the service throws:

``` text
Zone has not been initialized yet
```

The physical zone table name is stored as:

``` text
zoneTableName
```

and is used as the registry table for the division.

------------------------------------------------------------------------

# 12. Division Table Name Generation

The physical division table name is generated using:

``` js
generateDivisionTableName(
  cleanedDivisionName
)
```

The naming convention is delegated to:

``` text
masterCitizenTables
```

Conceptually:

``` text
Division A
    ↓
division_a
```

The generated value is stored as:

``` text
divisionTableName
```

------------------------------------------------------------------------

# 13. Physical Division Table Collision Check

Before creating the division registry record, the service checks:

``` js
divisionTableExists(
  divisionTableName
)
```

If the table already exists, it throws:

``` text
Division table "<divisionTableName>" already exists
```

This prevents a physical table-name collision.

------------------------------------------------------------------------

# 14. Division Registry Creation

After all preliminary checks pass, the service creates the division
record using:

``` js
repository.createDivision(
  zoneTableName,
  {
    divisionName: cleanedDivisionName,
    geoBoundary,
  }
)
```

The created record is stored as:

``` text
division
```

At this point, the logical division registry record exists before the
physical division table is created.

------------------------------------------------------------------------

# 15. Physical Division Table Creation

Physical table creation is placed inside a:

``` text
try / catch
```

block.

The service calls:

``` js
createDivisionTable(
  divisionTableName
)
```

This creates the dedicated physical table for the division.

------------------------------------------------------------------------

# 16. Store Physical Division Table Name

After successful physical table creation, the service updates the
division registry using:

``` js
repository.updateDivisionTableName(
  zoneTableName,
  division.division_id,
  divisionTableName
)
```

This creates the relationship:

``` text
Logical Division
        ↕
division_table_name
        ↕
Physical Division Table
```

The updated record is stored as:

``` text
updatedDivision
```

------------------------------------------------------------------------

# 17. Increment City's Total Divisions

After successful physical table creation and table-name registration,
the service directly updates the parent city table.

It increments:

``` text
total_divisions
```

using:

``` sql
COALESCE(total_divisions, 0) + 1
```

The update is scoped using:

``` text
zone_id = zoneId
```

Therefore the division count is maintained at the city-table zone-record
level.

------------------------------------------------------------------------

# 18. createDivision() Success

After all creation operations succeed, the service returns:

``` text
updatedDivision
```

This is the division registry record after its physical table name has
been stored.

------------------------------------------------------------------------

# 19. createDivision() Rollback

If an operation inside the `try` block fails:

``` text
createDivisionTable()
updateDivisionTableName()
City total_divisions update
```

the service attempts to remove the already-created division registry
record.

It calls:

``` js
repository.deleteDivision(
  zoneTableName,
  division.division_id
)
```

------------------------------------------------------------------------

# 20. Rollback Failure Handling

If rollback itself fails, the service logs:

``` text
Division rollback failed:
```

along with the rollback error.

The original error is then re-thrown.

Therefore:

``` text
Original operation fails
        ↓
Attempt registry rollback
        ↓
Rollback succeeds or fails
        ↓
Original error is re-thrown
```

------------------------------------------------------------------------

# 21. createDivision() Complete Flow

``` text
Validate City ID
        ↓
Validate Zone ID
        ↓
Validate Division Name
        ↓
Find City
        ↓
City Initialized?
        ↓
Find Zone
        ↓
Zone Initialized?
        ↓
Generate Division Table Name
        ↓
Check Physical Table Collision
        ↓
Create Division Registry
        ↓
Create Physical Division Table
        ↓
Store Division Table Name
        ↓
Increment total_divisions
        ↓
Return Division
```

------------------------------------------------------------------------

# 22. getDivisions()

This method retrieves all divisions belonging to a specific city and
zone.

It receives:

``` text
cityId
zoneId
```

The service validates the city and zone hierarchy before delegating
retrieval to the repository.

------------------------------------------------------------------------

# 23. getDivisions() --- City Validation

The service calls:

``` js
repository.findCityById(cityId)
```

If the city does not exist:

``` text
City not found
```

If:

``` text
city.city_table_name
```

is missing:

``` text
City has not been initialized yet
```

------------------------------------------------------------------------

# 24. getDivisions() --- Zone Validation

The service locates the zone using:

``` js
findZone(
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

# 25. getDivisions() --- Repository Retrieval

After validation, the service calls:

``` js
repository.getDivisions(
  zone.zone_table_name
)
```

The repository result is returned directly.

The service does not apply additional filtering or transformation.

------------------------------------------------------------------------

# 26. getDivision()

This method retrieves a single division.

It receives:

``` text
cityId
zoneId
divisionId
```

The service validates the city and zone hierarchy before retrieving the
division.

------------------------------------------------------------------------

# 27. getDivision() --- City Validation

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If missing:

``` text
City not found
```

If the city has no physical city table:

``` text
City has not been initialized yet
```

------------------------------------------------------------------------

# 28. getDivision() --- Zone Validation

The service calls:

``` js
findZone(
  city.city_table_name,
  zoneId
)
```

If no zone exists:

``` text
Zone not found
```

Unlike `getDivisions()`, this method does not contain a separate
explicit check for:

``` text
zone.zone_table_name
```

before calling the division repository.

The source implementation therefore relies on the retrieved zone table
name at that point.

------------------------------------------------------------------------

# 29. getDivision() --- Division Retrieval

The service calls:

``` js
repository.getDivision(
  zone.zone_table_name,
  divisionId
)
```

If no division is returned, it throws:

``` text
Division not found
```

Otherwise the division is returned directly.

------------------------------------------------------------------------

# 30. updateDivision()

This method updates an existing division.

It receives:

``` text
cityId
zoneId
divisionId
data
```

Supported update fields are delegated to the repository:

``` text
divisionName
geoBoundary
```

------------------------------------------------------------------------

# 31. updateDivision() --- Find City

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If the city does not exist:

``` text
City not found
```

If the city is not initialized:

``` text
City has not been initialized yet
```

------------------------------------------------------------------------

# 32. updateDivision() --- Find Zone

The service locates the zone using:

``` js
findZone(
  city.city_table_name,
  zoneId
)
```

If no zone exists:

``` text
Zone not found
```

------------------------------------------------------------------------

# 33. updateDivision() --- Find Existing Division

Before updating, the service retrieves the existing division:

``` js
repository.getDivision(
  zone.zone_table_name,
  divisionId
)
```

If the division does not exist, it throws:

``` text
Division not found
```

This ensures the update targets an existing division.

------------------------------------------------------------------------

# 34. updateDivision() --- Division Name Validation

When:

``` text
data.divisionName !== undefined
```

the service requires the value to be:

``` text
a string
non-empty after trimming
```

Otherwise it throws:

``` text
divisionName must be a non-empty string
```

The service then normalizes the value:

``` js
data.divisionName =
  data.divisionName.trim()
```

------------------------------------------------------------------------

# 35. updateDivision() --- Repository Update

After validation, the service delegates the actual database update:

``` js
repository.updateDivision(
  zone.zone_table_name,
  divisionId,
  data
)
```

The repository result is returned directly.

The service does not regenerate or rename:

``` text
division_table_name
```

when the logical division name changes.

------------------------------------------------------------------------

# 36. Division Identifier and Table Name Rules

The service uses:

``` text
divisionId
```

to identify the division record during retrieval and update.

The physical table is separately referenced through:

``` text
division_table_name
```

A logical division-name update therefore does not imply a physical-table
rename.

------------------------------------------------------------------------

# 37. deleteDivision()

This method deletes a division while protecting existing data.

It receives:

``` text
cityId
zoneId
divisionId
```

The service validates the complete parent hierarchy before attempting
deletion.

------------------------------------------------------------------------

# 38. deleteDivision() --- City Validation

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If missing:

``` text
City not found
```

If the city has not been initialized:

``` text
City has not been initialized yet
```

------------------------------------------------------------------------

# 39. deleteDivision() --- Zone Validation

The service calls:

``` js
findZone(
  city.city_table_name,
  zoneId
)
```

If no zone exists:

``` text
Zone not found
```

------------------------------------------------------------------------

# 40. deleteDivision() --- Division Validation

The service retrieves the division using:

``` js
repository.getDivision(
  zone.zone_table_name,
  divisionId
)
```

If the division does not exist:

``` text
Division not found
```

------------------------------------------------------------------------

# 41. Physical Division Table Data Protection

If:

``` text
division.division_table_name
```

exists, the service checks the physical table's row count.

It executes:

``` sql
SELECT COUNT(*)::int AS count
FROM "<division_table_name>"
```

The resulting count is stored as:

``` text
rowCount
```

------------------------------------------------------------------------

# 42. Prevent Deletion When Data Exists

If:

``` text
rowCount > 0
```

the service throws:

``` text
Division cannot be deleted because it contains data
```

Therefore a division cannot be deleted when its physical table contains
records.

The implementation's comment specifically describes this data as:

``` text
Wards
```

because divisions contain ward records.

------------------------------------------------------------------------

# 43. Drop Empty Physical Division Table

If the physical division table exists and:

``` text
rowCount === 0
```

the service calls:

``` js
dropDynamicTable(
  division.division_table_name
)
```

The physical division table is therefore removed only when it is empty.

------------------------------------------------------------------------

# 44. Delete Division Registry Record

After safely handling the physical table, the service calls:

``` js
repository.deleteDivision(
  zone.zone_table_name,
  divisionId
)
```

This removes the logical division record from the zone table.

------------------------------------------------------------------------

# 45. Decrease City's Total Divisions

After successful deletion, the service decrements:

``` text
total_divisions
```

in the parent city table.

The SQL uses:

``` sql
GREATEST(
  COALESCE(total_divisions, 0) - 1,
  0
)
```

The update is scoped using:

``` text
zone_id = zoneId
```

Therefore the division counter cannot become negative.

------------------------------------------------------------------------

# 46. deleteDivision() Success Response

On successful deletion, the service returns:

``` json
{
  "division_id": divisionId,
  "deleted": true
}
```

------------------------------------------------------------------------

# 47. Division Lifecycle

The complete lifecycle is:

``` text
CREATE
  ↓
Division Registry
  +
Physical Division Table
  ↓
READ
  ↓
UPDATE
  ↓
DELETE
```

Deletion is protected:

``` text
Physical Division Table Contains Records
        ↓
   DELETE BLOCKED

Physical Division Table Empty
        ↓
Drop Physical Table
        ↓
Delete Division Registry
        ↓
Decrease total_divisions
```

------------------------------------------------------------------------

# 48. Geographic Hierarchy

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
Physical Division Table
```

The table references are:

``` text
city_table_name
zone_table_name
division_table_name
```

------------------------------------------------------------------------

# 49. Dynamic Table Architecture

Each division receives a physical table generated by:

``` js
generateDivisionTableName(
  cleanedDivisionName
)
```

The generated name is stored in:

``` text
division_table_name
```

The relationship is therefore:

``` text
Logical Division Record
        ↕
division_table_name
        ↕
Physical Division Table
```

------------------------------------------------------------------------

# 50. City Division Counter Management

The service maintains:

``` text
total_divisions
```

inside the parent city's physical table.

On successful creation:

``` text
total_divisions + 1
```

On successful deletion:

``` text
total_divisions - 1
```

The counter uses:

``` text
COALESCE
```

when incrementing and:

``` text
GREATEST
```

when decrementing.

The minimum value is therefore:

``` text
0
```

------------------------------------------------------------------------

# 51. Repository Interaction

The service uses the division repository for:

``` text
findCityById()
createDivision()
updateDivisionTableName()
deleteDivision()
getDivisions()
getDivision()
updateDivision()
```

It uses the table utilities for:

``` text
generateDivisionTableName()
createDivisionTable()
divisionTableExists()
dropDynamicTable()
```

It uses Prisma directly for:

``` text
Finding zones inside city tables
Checking physical division-table row counts
Incrementing total_divisions
Decrementing total_divisions
```

------------------------------------------------------------------------

# 52. Error Handling

The service explicitly throws:

``` text
Invalid city ID
Invalid zone ID
divisionName is required
divisionName cannot be empty
City not found
City has not been initialized yet
Zone not found
Zone has not been initialized yet
Division table already exists
Division not found
divisionName must be a non-empty string
Division cannot be deleted because it contains data
```

Creation also contains rollback handling when post-registry operations
fail.

------------------------------------------------------------------------

# 53. Important Implementation Detail

The service performs division-counter maintenance directly through:

``` js
masterCitizenPrisma.$queryRawUnsafe()
```

rather than through:

``` text
repository.updateZoneDivisionCount()
```

The parent city table is updated using:

``` text
zone_id
```

This matches the repository architecture in which:

``` text
total_divisions
```

is stored in the city table rather than the zone table.

------------------------------------------------------------------------

# 54. Exported Functions

The service exports:

``` text
createDivision
getDivisions
getDivision
updateDivision
deleteDivision
```

The following helper remains internal:

``` text
findZone
```

------------------------------------------------------------------------

# 55. Architecture

``` text
Controller
    ↓
masterCitizenDivision.service
    │
    ├── masterCitizenDivision.repository
    │       ↓
    │   Division Registry
    │
    ├── masterCitizenTables
    │       ↓
    │   Physical Division Table
    │
    └── masterCitizenPrisma
            ↓
      City / Zone / Table Operations
```

------------------------------------------------------------------------

# 56. Summary

`masterCitizenDivision.service(2).js` is the business-logic layer
responsible for managing divisions within the:

``` text
City → Zone → Division
```

geographic hierarchy.

Its creation process coordinates:

``` text
City validation
Zone validation
Division-name validation
Physical table-name generation
Physical table collision prevention
Division registry creation
Physical division-table creation
Division table-name registration
City division-counter maintenance
```

Its update process validates the parent hierarchy and the division name
before delegating the database update to the repository.

Its deletion process is intentionally protective:

``` text
Physical Division Table Contains Data
        ↓
Deletion Blocked

Physical Division Table Empty
        ↓
Physical Table Dropped
        ↓
Division Registry Deleted
        ↓
City total_divisions Decremented
```

The service maintains the division counter in the parent city table:

``` text
Create Division
    ↓
total_divisions + 1

Delete Division
    ↓
total_divisions - 1
    ↓
minimum = 0
```

Overall architecture:

``` text
City
  ↓
City Physical Table
  ↓
Zone
  ↓
Zone Physical Table
  ↓
Division Registry
  ↓
Physical Division Table
  ↓
Ward Records
```

The service therefore coordinates the logical division registry, its
dedicated physical table, the parent city division counter, and deletion
protection for divisions containing data.
