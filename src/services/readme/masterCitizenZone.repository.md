# masterCitizenZone.repository.js Documentation

## 1. File Overview

**File:** `masterCitizenZone.repository.js`\
**Location:** `src/repositories/masterCitizenZone.repository.js`

This repository provides database-access operations for managing zones
within a city-specific physical table.

It handles:

``` text
City lookup by ID
Zone creation
Zone retrieval
Single-zone retrieval
Zone updates
Zone deletion
```

The repository uses Prisma's raw SQL interface to operate on dynamically
selected city tables.

------------------------------------------------------------------------

## 2. Dependencies

The repository uses:

``` text
masterCitizenPrisma
```

imported from:

``` text
../config/masterCitizenPrisma
```

The Prisma client is used through:

``` js
masterCitizenPrisma.$queryRawUnsafe()
```

for dynamic SQL execution.

------------------------------------------------------------------------

# 3. findCityById()

This function retrieves a city registry record using its city ID.

It receives:

``` text
cityId
```

and queries:

``` text
city_table
```

using:

``` text
city_id = cityId
```

The Prisma operation is:

``` js
masterCitizenPrisma.city_table.findUnique()
```

The complete result is returned directly.

If the city does not exist, Prisma returns:

``` text
null
```

------------------------------------------------------------------------

# 4. createZone()

This function creates a zone inside a specified city table.

It receives:

``` text
cityTableName
data
```

The city table name identifies the physical table in which the zone
record will be inserted.

------------------------------------------------------------------------

## Zone Input

The service expects:

``` text
data.zoneName
data.geoBoundary
```

These values are mapped to:

``` text
zone_name
geo_boundary
```

------------------------------------------------------------------------

# 5. createZone() SQL

The repository executes an:

``` text
INSERT
```

against the dynamically selected city table.

The inserted fields are:

``` text
zone_name
geo_boundary
```

The geographic boundary is explicitly converted to JSONB using:

``` sql
$2::jsonb
```

The value supplied to the query is:

``` js
JSON.stringify(data.geoBoundary ?? null)
```

Therefore:

``` text
geoBoundary provided
    ↓
JSON.stringify(geoBoundary)

geoBoundary null / undefined
    ↓
JSON.stringify(null)
```

------------------------------------------------------------------------

# 6. createZone() Returned Fields

The SQL statement returns:

``` text
zone_id
zone_name
geo_boundary
total_divisions
total_wards
created_at
zone_table_name
```

The repository returns:

``` js
result[0]
```

Therefore the first inserted zone record is returned directly.

------------------------------------------------------------------------

# 7. getZones()

This function retrieves all zones from a specified city table.

It receives:

``` text
cityTableName
```

The query selects:

``` text
zone_id
zone_name
geo_boundary
total_divisions
total_wards
created_at
zone_table_name
```

------------------------------------------------------------------------

## Zone Ordering

The result is ordered by:

``` text
zone_id ASC
```

Therefore zones are returned in ascending zone-ID order.

------------------------------------------------------------------------

# 8. getZone()

This function retrieves one zone from a city table.

It receives:

``` text
cityTableName
zoneId
```

The query searches using:

``` text
zone_id = $1
```

and limits the result to:

``` text
1 record
```

------------------------------------------------------------------------

## getZone() Result

The selected fields are:

``` text
zone_id
zone_name
geo_boundary
total_divisions
total_wards
created_at
zone_table_name
```

The function returns:

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

------------------------------------------------------------------------

# 9. updateZone()

This function updates a zone within a specified city table.

It receives:

``` text
cityTableName
zoneId
data
```

The update is dynamically constructed based on the fields supplied in:

``` text
data
```

Supported fields are:

``` text
zoneName
geoBoundary
```

------------------------------------------------------------------------

# 10. updateZone() --- Zone Name

When:

``` text
data.zoneName !== undefined
```

the repository adds:

``` sql
zone_name = $parameter
```

and stores:

``` text
data.zoneName
```

as the value.

------------------------------------------------------------------------

# 11. updateZone() --- Geographic Boundary

When:

``` text
data.geoBoundary !== undefined
```

the repository adds:

``` sql
geo_boundary = $parameter::jsonb
```

The supplied value is converted using:

``` js
JSON.stringify(data.geoBoundary)
```

The database therefore stores the boundary as:

``` text
JSONB
```

------------------------------------------------------------------------

# 12. No Update Fields

If neither:

``` text
zoneName
```

nor:

``` text
geoBoundary
```

is supplied, the service throws:

``` text
No fields provided for update
```

No SQL update is executed in this case.

------------------------------------------------------------------------

# 13. updateZone() SQL Construction

The update fields are dynamically accumulated into:

``` text
fields
```

Values are accumulated into:

``` text
values
```

Parameter numbering is maintained using:

``` text
parameterIndex
```

The final query updates the specified zone using:

``` text
zone_id
```

The dynamically generated SQL therefore supports updating either:

``` text
zone_name
```

or:

``` text
geo_boundary
```

or both simultaneously.

------------------------------------------------------------------------

# 14. Zone Table Name Preservation

The repository intentionally does **not** update:

``` text
zone_table_name
```

when:

``` text
zone_name
```

changes.

The physical table name remains unchanged.

For example:

``` text
East Zone
    ↓
Eastern Zone
```

The display name can change while the physical table remains:

``` text
east_zone
```

This separates the logical zone name from its physical table identifier.

------------------------------------------------------------------------

# 15. updateZone() Returned Fields

The update query returns:

``` text
zone_id
zone_name
geo_boundary
total_divisions
total_wards
created_at
zone_table_name
```

The function returns:

``` js
result[0] || null
```

Therefore:

``` text
Updated zone found
    ↓
Return updated record

No matching zone
    ↓
Return null
```

------------------------------------------------------------------------

# 16. deleteZone()

This function deletes a zone from a specified city table.

It receives:

``` text
cityTableName
zoneId
```

The deletion condition is:

``` text
zone_id = $1
```

The SQL uses:

``` text
DELETE FROM
```

and returns the deleted record.

------------------------------------------------------------------------

# 17. deleteZone() Returned Fields

The deleted zone record contains:

``` text
zone_id
zone_name
geo_boundary
total_divisions
total_wards
created_at
zone_table_name
```

The function returns:

``` js
result[0] || null
```

Therefore:

``` text
Zone deleted
    ↓
Return deleted zone

Zone not found
    ↓
Return null
```

------------------------------------------------------------------------

# 18. Dynamic City Table Architecture

The repository does not operate on a single fixed zone table.

Instead, the city table name is supplied dynamically:

``` text
cityTableName
```

The architecture is:

``` text
city_table
    ↓
City Registry
    ↓
city_table_name
    ↓
Physical City Table
    ↓
Zones
```

Zone records are stored inside the physical city table associated with
the city.

------------------------------------------------------------------------

# 19. SQL Parameterization

Values such as:

``` text
zoneName
zoneId
geoBoundary
```

are supplied as SQL parameters:

``` text
$1
$2
$3
...
```

The city table name itself is interpolated into the SQL statement:

``` sql
"${cityTableName}"
```

because it represents a dynamic SQL identifier rather than a normal SQL
value.

------------------------------------------------------------------------

# 20. Database Operations

The repository provides:

  Function           Operation
  ------------------ ---------------------
  `findCityById()`   Prisma `findUnique`
  `createZone()`     SQL `INSERT`
  `getZones()`       SQL `SELECT`
  `getZone()`        SQL `SELECT`
  `updateZone()`     SQL `UPDATE`
  `deleteZone()`     SQL `DELETE`

------------------------------------------------------------------------

# 21. Read / Write Responsibilities

## Read Operations

``` text
findCityById()
getZones()
getZone()
```

## Write Operations

``` text
createZone()
updateZone()
deleteZone()
```

------------------------------------------------------------------------

# 22. Error Handling

The repository does not contain explicit:

``` text
try / catch
```

blocks.

Errors from:

``` text
Prisma
PostgreSQL
Dynamic SQL
Database constraints
```

are therefore allowed to propagate to the calling service/controller.

The repository does explicitly throw:

``` text
No fields provided for update
```

when an update request contains no supported fields.

------------------------------------------------------------------------

# 23. Result Handling

The repository returns raw database results with minimal processing.

The main result patterns are:

``` text
findUnique()
    ↓
Record or null

SELECT many
    ↓
Array

INSERT
    ↓
First inserted record

UPDATE
    ↓
Updated record or null

DELETE
    ↓
Deleted record or null
```

------------------------------------------------------------------------

# 24. Architecture

``` text
Service / Controller
        ↓
masterCitizenZone.repository
        │
        ├── masterCitizenPrisma
        │       ↓
        │   city_table
        │
        └── $queryRawUnsafe()
                ↓
        Dynamic City Table
                ↓
              Zones
```

For zone creation:

``` text
City Table Name
      ↓
createZone()
      ↓
INSERT zone
      ↓
Return Zone
```

For zone retrieval:

``` text
City Table Name
      ↓
getZones() / getZone()
      ↓
SELECT
      ↓
Zone Records
```

------------------------------------------------------------------------

# 25. Exported Functions

The repository exports:

``` text
findCityById
createZone
getZones
getZone
updateZone
deleteZone
```

------------------------------------------------------------------------

# 26. Summary

`masterCitizenZone.repository.js` is the database-access layer for zone
management inside city-specific physical tables.

It provides:

``` text
City lookup
Zone creation
Zone listing
Single-zone retrieval
Zone updates
Zone deletion
```

The repository stores zone information using:

``` text
zone_id
zone_name
geo_boundary
total_divisions
total_wards
created_at
zone_table_name
```

Geographic boundaries are stored as PostgreSQL:

``` text
JSONB
```

The repository intentionally keeps:

``` text
zone_name
```

separate from:

``` text
zone_table_name
```

so a display-name change does not rename the underlying physical table.

All dynamic city-table operations are executed through Prisma's raw SQL
interface, while ordinary values are supplied through SQL parameters.
