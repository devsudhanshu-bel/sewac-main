# masterCitizenZone.service.js Documentation

## 1. File Overview

**File:** `masterCitizenZone.service.js`\
**Location:** `src/services/masterCitizenZone.service.js`

This service provides the business-logic layer for managing zones within
the master citizen geographic hierarchy:

``` text
City
  ↓
Zone
```

It coordinates:

``` text
City validation
Zone-name validation
Dynamic zone-table name generation
Physical zone-table collision checks
Zone registry creation
Physical zone-table creation
Zone table-name registration
Zone retrieval
Zone updates
Safe zone deletion
Rollback handling
```

The main creation flow is:

``` text
City ID + Zone Data
        ↓
Validate City ID
        ↓
Validate Zone Name
        ↓
Find City
        ↓
Validate City Table
        ↓
Generate Zone Table Name
        ↓
Check Physical Table Collision
        ↓
Create Zone Registry Record
        ↓
Create Physical Zone Table
        ↓
Update Zone Record
        ↓
Store Physical Zone Table Name
        ↓
Return Zone
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
masterCitizenZone.repository
masterCitizenTables utilities
masterCitizenPrisma
```

The repository is imported from:

``` text
./masterCitizenZone.repository
```

The table utilities are imported from:

``` text
../utils/masterCitizenTables
```

The utilities used are:

``` text
generateZoneTableName
createZoneTable
zoneTableExists
dropDynamicTable
```

The Prisma client is imported dynamically when direct SQL operations are
required:

``` text
../config/masterCitizenPrisma
```

------------------------------------------------------------------------

# 3. createZone()

This is the main zone-creation method.

It receives:

``` text
cityId
zoneName
geoBoundary
```

The method validates the city and zone name, ensures the city is
initialized, generates and validates the physical zone table name,
creates the zone registry record, creates the physical zone table,
stores its table name in the city table, and returns the completed zone
record.

------------------------------------------------------------------------

# 4. createZone() --- City ID Validation

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

# 5. createZone() --- Zone Name Validation

The service requires:

``` text
zoneName
```

to be a string.

If the value is missing or is not a string, it throws:

``` text
zoneName is required
```

The name is then normalized using:

``` js
zoneName.trim()
```

------------------------------------------------------------------------

## Empty Zone Name

If the trimmed zone name is empty, the service throws:

``` text
zoneName cannot be empty
```

The cleaned name is stored as:

``` text
cleanedZoneName
```

and is used for subsequent processing.

------------------------------------------------------------------------

# 6. createZone() --- Find City

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If no city exists, it throws:

``` text
City not found
```

------------------------------------------------------------------------

# 7. City Initialization Validation

The city must already have a physical city table.

The service checks:

``` text
city.city_table_name
```

If it is missing, the service throws:

``` text
City has not been initialized yet
```

The physical city table name is stored as:

``` text
cityTableName
```

------------------------------------------------------------------------

# 8. Zone Table Name Generation

The service generates the physical zone table name using:

``` js
generateZoneTableName(
  cleanedZoneName
)
```

The naming convention is delegated to:

``` text
masterCitizenTables
```

The implementation illustrates:

``` text
East Zone
    ↓
east_zone
```

The generated value is stored as:

``` text
zoneTableName
```

------------------------------------------------------------------------

# 9. Physical Zone Table Collision Check

Before creating the zone registry record, the service checks:

``` js
zoneTableExists(
  zoneTableName
)
```

If the table already exists, it throws:

``` text
Zone table "<zoneTableName>" already exists
```

This prevents a physical table-name collision.

------------------------------------------------------------------------

# 10. Zone Registry Creation

After validation succeeds, the service creates the logical zone record
inside the city's dynamic table using:

``` js
repository.createZone(
  cityTableName,
  {
    zoneName: cleanedZoneName,
    geoBoundary,
  }
)
```

The created record is stored as:

``` text
zone
```

At this stage, the logical zone record exists before the physical zone
table is created.

------------------------------------------------------------------------

# 11. Physical Zone Table Creation

The physical zone table is created inside a:

``` text
try / catch
```

block.

The service calls:

``` js
createZoneTable(
  zoneTableName
)
```

This creates the dedicated physical table for the zone.

------------------------------------------------------------------------

# 12. Zone Record Update

After the physical table is created, the service calls:

``` js
repository.updateZone(
  cityTableName,
  zone.zone_id,
  {
    zoneName: cleanedZoneName,
    geoBoundary,
  }
)
```

The returned value is stored as:

``` text
updatedZone
```

The repository update itself does not set the physical table name
because the repository's `updateZone()` supports:

``` text
zoneName
geoBoundary
```

The service therefore performs a separate SQL update for:

``` text
zone_table_name
```

------------------------------------------------------------------------

# 13. Store Physical Zone Table Name

The service directly updates the city's dynamic table using:

``` js
masterCitizenPrisma.$queryRawUnsafe()
```

The SQL sets:

``` text
zone_table_name = zoneTableName
```

for:

``` text
zone_id = zone.zone_id
```

The returned fields are:

``` text
zone_id
zone_name
geo_boundary
total_divisions
total_wards
created_at
zone_table_name
```

The service returns:

``` js
result[0]
```

as the final zone record.

------------------------------------------------------------------------

# 14. createZone() Complete Flow

``` text
Validate City ID
        ↓
Validate Zone Name
        ↓
Find City
        ↓
City Initialized?
        ↓
Generate Zone Table Name
        ↓
Check Physical Table Collision
        ↓
Create Zone Registry Record
        ↓
Create Physical Zone Table
        ↓
Update Zone Registry
        ↓
Store zone_table_name
        ↓
Return Zone
```

------------------------------------------------------------------------

# 15. createZone() Rollback

If any operation inside the `try` block fails:

``` text
createZoneTable()
repository.updateZone()
zone_table_name update
```

the service attempts to delete the already-created zone registry record.

It calls:

``` js
repository.deleteZone(
  cityTableName,
  zone.zone_id
)
```

------------------------------------------------------------------------

# 16. Rollback Failure Handling

If the rollback itself fails, the service logs:

``` text
Zone rollback failed:
```

along with the rollback error.

The original error is then re-thrown.

Therefore:

``` text
Original creation error
        ↓
Attempt rollback
        ↓
Rollback succeeds or fails
        ↓
Original error remains the thrown error
```

------------------------------------------------------------------------

# 17. getZones()

This method retrieves all zones belonging to a city.

It receives:

``` text
cityId
```

------------------------------------------------------------------------

# 18. getZones() --- City ID Validation

The service requires:

``` text
cityId
```

to be an integer.

If invalid, it throws:

``` text
Invalid city ID
```

------------------------------------------------------------------------

# 19. getZones() --- City Validation

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If the city does not exist:

``` text
City not found
```

If the city does not have:

``` text
city_table_name
```

the service throws:

``` text
City has not been initialized yet
```

------------------------------------------------------------------------

# 20. getZones() --- Repository Retrieval

After validation, the service calls:

``` js
repository.getZones(
  city.city_table_name
)
```

The repository result is returned directly.

The service performs no additional filtering or transformation.

------------------------------------------------------------------------

# 21. getZone()

This method retrieves one zone from a city.

It receives:

``` text
cityId
zoneId
```

------------------------------------------------------------------------

# 22. getZone() --- ID Validation

The service requires both:

``` text
cityId
zoneId
```

to be integers.

Invalid values result in:

``` text
Invalid city ID
```

or:

``` text
Invalid zone ID
```

respectively.

------------------------------------------------------------------------

# 23. getZone() --- City Validation

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If missing:

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

# 24. getZone() --- Zone Retrieval

The service calls:

``` js
repository.getZone(
  city.city_table_name,
  zoneId
)
```

If no zone is returned, it throws:

``` text
Zone not found
```

Otherwise the zone is returned directly.

------------------------------------------------------------------------

# 25. updateZone()

This method updates an existing zone.

It receives:

``` text
cityId
zoneId
data
```

Supported update fields are:

``` text
zoneName
geoBoundary
```

------------------------------------------------------------------------

# 26. updateZone() --- ID Validation

The service requires:

``` text
cityId
zoneId
```

to be integers.

Invalid values result in:

``` text
Invalid city ID
Invalid zone ID
```

------------------------------------------------------------------------

# 27. updateZone() --- Update Data Validation

At least one of:

``` text
zoneName
geoBoundary
```

must be supplied.

If both are:

``` text
undefined
```

the service throws:

``` text
Provide zoneName or geoBoundary
```

------------------------------------------------------------------------

# 28. updateZone() --- Zone Name Validation

When:

``` text
data.zoneName
```

is provided, it must be:

``` text
a string
non-empty after trimming
```

Otherwise the service throws:

``` text
zoneName must be a non-empty string
```

The supplied name is normalized using:

``` js
data.zoneName.trim()
```

------------------------------------------------------------------------

# 29. updateZone() --- Find City

The service retrieves the city using:

``` js
repository.findCityById(cityId)
```

If the city does not exist:

``` text
City not found
```

If the city has no physical table:

``` text
City has not been initialized yet
```

------------------------------------------------------------------------

# 30. updateZone() --- Find Existing Zone

Before performing the update, the service calls:

``` js
repository.getZone(
  city.city_table_name,
  zoneId
)
```

If the zone does not exist, it throws:

``` text
Zone not found
```

This ensures the update targets an existing zone.

------------------------------------------------------------------------

# 31. updateZone() --- Build Update Data

The service creates:

``` text
updateData
```

Only supplied fields are copied into it.

If:

``` text
data.zoneName !== undefined
```

then:

``` text
updateData.zoneName =
  data.zoneName.trim()
```

If:

``` text
data.geoBoundary !== undefined
```

then:

``` text
updateData.geoBoundary =
  data.geoBoundary
```

------------------------------------------------------------------------

# 32. updateZone() --- Repository Update

The service delegates the final update to:

``` js
repository.updateZone(
  city.city_table_name,
  zoneId,
  updateData
)
```

The repository result is returned directly.

The service does not regenerate or rename:

``` text
zone_table_name
```

when the logical zone name changes.

------------------------------------------------------------------------

# 33. Physical Zone Table Name During Update

A zone-name update affects:

``` text
zone_name
```

but does not automatically change:

``` text
zone_table_name
```

Therefore:

``` text
Logical zone name
        ↓
Can be updated

Physical zone table
        ↓
Remains associated with the existing table name
```

This keeps logical naming separate from physical database identifiers.

------------------------------------------------------------------------

# 34. deleteZone()

This method deletes a zone while protecting existing data.

It receives:

``` text
cityId
zoneId
```

------------------------------------------------------------------------

# 35. deleteZone() --- ID Validation

The service requires:

``` text
cityId
zoneId
```

to be integers.

Invalid values result in:

``` text
Invalid city ID
Invalid zone ID
```

------------------------------------------------------------------------

# 36. deleteZone() --- City Validation

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

# 37. deleteZone() --- Zone Validation

The service retrieves the zone using:

``` js
repository.getZone(
  city.city_table_name,
  zoneId
)
```

If the zone does not exist:

``` text
Zone not found
```

------------------------------------------------------------------------

# 38. Physical Zone Table Check

If:

``` text
zone.zone_table_name
```

exists, the service checks the number of rows in the physical zone
table.

It executes:

``` sql
SELECT COUNT(*)::int AS count
FROM "<zone_table_name>"
```

The resulting count is stored as:

``` text
rowCount
```

------------------------------------------------------------------------

# 39. Prevent Deletion When Data Exists

If:

``` text
rowCount > 0
```

the service throws:

``` text
Zone cannot be deleted because it contains data
```

Therefore a zone cannot currently be deleted when its physical table
contains records.

The implementation notes that this becomes particularly important once:

``` text
Divisions
```

are stored inside the zone table.

------------------------------------------------------------------------

# 40. Drop Empty Physical Zone Table

If the physical zone table exists and:

``` text
rowCount === 0
```

the service calls:

``` js
dropDynamicTable(
  zone.zone_table_name
)
```

The physical zone table is therefore dropped only when it is empty.

------------------------------------------------------------------------

# 41. Delete Zone Registry Record

After the physical table has been safely handled, the service calls:

``` js
repository.deleteZone(
  city.city_table_name,
  zoneId
)
```

This removes the logical zone registry record from the city's dynamic
table.

------------------------------------------------------------------------

# 42. deleteZone() Success Response

After successful deletion, the service returns:

``` json
{
  "zone_id": zoneId,
  "deleted": true
}
```

------------------------------------------------------------------------

# 43. Zone Lifecycle

The complete lifecycle is:

``` text
CREATE
  ↓
Zone Registry Record
  +
Physical Zone Table
  ↓
READ
  ↓
UPDATE
  ↓
DELETE
```

Deletion is protected:

``` text
Physical Zone Table Contains Data
        ↓
   DELETE BLOCKED

Physical Zone Table Empty
        ↓
Drop Physical Table
        ↓
Delete Zone Registry
```

------------------------------------------------------------------------

# 44. Geographic Hierarchy

This service manages the first level below a city:

``` text
City
  ↓
Zone
```

The physical-table relationship is:

``` text
City Registry
    ↓
city_table_name
    ↓
Physical City Table
    ↓
Zone Registry Record
    ↓
zone_table_name
    ↓
Physical Zone Table
```

------------------------------------------------------------------------

# 45. Dynamic Table Architecture

The physical zone table name is generated using:

``` js
generateZoneTableName(
  cleanedZoneName
)
```

and stored in:

``` text
zone_table_name
```

The logical and physical structures are therefore connected through:

``` text
Zone Record
    ↕
zone_table_name
    ↕
Physical Zone Table
```

------------------------------------------------------------------------

# 46. Repository Interaction

The service uses the zone repository for:

``` text
findCityById()
createZone()
updateZone()
getZones()
getZone()
deleteZone()
```

It uses the table utilities for:

``` text
generateZoneTableName()
createZoneTable()
zoneTableExists()
dropDynamicTable()
```

It uses Prisma directly for:

``` text
Updating zone_table_name
Checking physical zone-table row counts
```

------------------------------------------------------------------------

# 47. Error Handling

The service explicitly validates and throws errors for:

``` text
Invalid city ID
zoneName is required
zoneName cannot be empty
City not found
City has not been initialized yet
Zone table already exists
Invalid zone ID
Zone not found
Provide zoneName or geoBoundary
zoneName must be a non-empty string
Zone cannot be deleted because it contains data
```

The creation operation additionally includes rollback handling if
post-registry operations fail.

------------------------------------------------------------------------

# 48. Exported Functions

The service exports:

``` text
createZone
getZones
getZone
updateZone
deleteZone
```

------------------------------------------------------------------------

# 49. Architecture

``` text
Controller
    ↓
masterCitizenZone.service
    │
    ├── masterCitizenZone.repository
    │       ↓
    │   Zone Registry
    │
    ├── masterCitizenTables
    │       ↓
    │   Physical Zone Table
    │
    └── masterCitizenPrisma
            ↓
      Dynamic SQL Operations
```

------------------------------------------------------------------------

# 50. Summary

`masterCitizenZone.service.js` is the business-logic layer responsible
for managing zones within the master citizen geographic hierarchy.

Its main responsibilities are:

``` text
City validation
Zone validation
Physical zone-table generation
Physical table collision prevention
Zone registry creation
Physical zone-table creation
Zone table-name registration
Zone retrieval
Zone updates
Safe zone deletion
Rollback handling
```

During creation, the service first creates the logical zone registry
record and then creates its physical zone table. Once the physical table
is successfully created, the service stores its name in:

``` text
zone_table_name
```

The service uses a separate direct SQL operation to update this
physical-table reference because the repository's normal `updateZone()`
operation only updates:

``` text
zone_name
geo_boundary
```

During deletion, the service protects data by checking the physical zone
table first:

``` text
Zone table contains records
        ↓
Deletion blocked

Zone table is empty
        ↓
Physical table dropped
        ↓
Zone registry deleted
```

Unlike the ward and division services, this implementation does not
maintain a separate zone counter in the city table.

Overall architecture:

``` text
City
  ↓
Physical City Table
  ↓
Zone Registry
  ↓
Physical Zone Table
  ↓
Future Division Data
```

The service therefore coordinates the logical zone registry and its
dynamic physical table while preventing accidental deletion of zones
that already contain data.
