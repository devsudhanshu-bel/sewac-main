# masterCitizenDivision.repository.js Documentation

## 1. File Overview

**File:** `masterCitizenDivision.repository.js`\
**Location:** `src/repositories/masterCitizenDivision.repository.js`

This repository provides the database-access layer for managing
divisions within a zone-specific physical table.

It handles:

``` text
City lookup by ID
Division creation
Division retrieval
Single-division retrieval
Division updates
Division deletion
Division physical-table-name registration
Zone division-counter interface
```

The repository uses Prisma for the city registry and Prisma raw SQL for
dynamically selected zone tables.

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
masterCitizenPrisma.city_table.findUnique()
```

and:

``` js
masterCitizenPrisma.$queryRawUnsafe()
```

------------------------------------------------------------------------

# 3. findCityById()

This function retrieves a city registry record using its city ID.

It receives:

``` text
cityId
```

The operation is:

``` js
masterCitizenPrisma.city_table.findUnique()
```

using:

``` text
city_id = cityId
```

The complete Prisma result is returned directly.

If no city exists with the supplied ID, Prisma returns:

``` text
null
```

------------------------------------------------------------------------

# 4. createDivision()

This function creates a division inside a specified zone table.

It receives:

``` text
zoneTableName
data
```

The zone table name identifies the physical table in which the division
record will be inserted.

The expected data fields are:

``` text
data.divisionName
data.geoBoundary
```

------------------------------------------------------------------------

# 5. createDivision() SQL

The repository executes an:

``` text
INSERT
```

against the dynamically selected:

``` text
zoneTableName
```

The inserted fields are:

``` text
division_name
geo_boundary
```

The geographic boundary is explicitly cast to:

``` text
JSONB
```

using:

``` sql
$2::jsonb
```

------------------------------------------------------------------------

# 6. Geo Boundary Handling

The supplied geographic boundary is converted using:

``` js
JSON.stringify(data.geoBoundary ?? null)
```

Therefore:

``` text
geoBoundary provided
    ↓
JSON.stringify()
    ↓
Store as JSONB
```

If the boundary is:

``` text
null
undefined
```

the expression uses:

``` text
null
```

before JSON serialization.

------------------------------------------------------------------------

# 7. createDivision() Returned Fields

The insert operation returns:

``` text
division_id
division_name
geo_boundary
created_at
division_table_name
```

The repository returns:

``` js
result[0]
```

Therefore the first inserted division record is returned.

------------------------------------------------------------------------

# 8. getDivisions()

This function retrieves all divisions from a specified zone table.

It receives:

``` text
zoneTableName
```

The query selects:

``` text
division_id
division_name
geo_boundary
created_at
division_table_name
```

------------------------------------------------------------------------

## Division Ordering

The records are ordered by:

``` text
division_id ASC
```

Therefore divisions are returned in ascending division-ID order.

------------------------------------------------------------------------

# 9. getDivision()

This function retrieves one division from a zone table.

It receives:

``` text
zoneTableName
divisionId
```

The query searches using:

``` text
division_id = $1
```

and limits the result to:

``` text
1 record
```

------------------------------------------------------------------------

## getDivision() Result

The function returns:

``` js
result[0] || null
```

Therefore:

``` text
Division found
    ↓
Return division

Division not found
    ↓
Return null
```

------------------------------------------------------------------------

# 10. updateDivision()

This function updates an existing division within a zone table.

It receives:

``` text
zoneTableName
divisionId
data
```

Supported update fields are:

``` text
divisionName
geoBoundary
```

------------------------------------------------------------------------

# 11. updateDivision() --- Division Name

When:

``` text
data.divisionName !== undefined
```

the repository adds:

``` sql
division_name = $parameter
```

and stores:

``` text
data.divisionName
```

as the value.

------------------------------------------------------------------------

# 12. updateDivision() --- Geographic Boundary

When:

``` text
data.geoBoundary !== undefined
```

the repository adds:

``` sql
geo_boundary = $parameter::jsonb
```

The value is converted using:

``` js
JSON.stringify(data.geoBoundary)
```

The database therefore stores the geographic boundary as:

``` text
JSONB
```

------------------------------------------------------------------------

# 13. Dynamic Update Construction

The update fields are accumulated in:

``` text
fields
```

Values are accumulated in:

``` text
values
```

Parameter numbering is tracked using:

``` text
parameterIndex
```

This allows either or both supported fields to be updated in a single
SQL statement.

------------------------------------------------------------------------

# 14. No Update Fields

If neither:

``` text
divisionName
```

nor:

``` text
geoBoundary
```

is supplied, the repository throws:

``` text
No fields provided for update
```

No SQL update is executed.

------------------------------------------------------------------------

# 15. Division ID Selection

After collecting the update values, the repository appends:

``` text
divisionId
```

to the SQL parameter list.

The final update condition is:

``` text
WHERE division_id = $parameterIndex
```

Therefore updates are always applied using the internal:

``` text
division_id
```

------------------------------------------------------------------------

# 16. updateDivision() Returned Fields

The update operation returns:

``` text
division_id
division_name
geo_boundary
created_at
division_table_name
```

The repository returns:

``` js
result[0] || null
```

Therefore:

``` text
Updated division found
    ↓
Return updated record

No matching division
    ↓
Return null
```

------------------------------------------------------------------------

# 17. Physical Division Table Name Preservation

The repository explicitly documents that updating:

``` text
division_name
```

does not change:

``` text
division_table_name
```

Therefore:

``` text
Logical division name
        ↓
Can change

Physical division table
        ↓
Remains unchanged
```

This separates the logical/display division name from the physical
database table identifier.

------------------------------------------------------------------------

# 18. deleteDivision()

This function deletes a division from a zone table.

It receives:

``` text
zoneTableName
divisionId
```

The deletion condition is:

``` text
division_id = $1
```

The SQL uses:

``` text
DELETE FROM
```

with:

``` text
RETURNING
```

to return the deleted record.

------------------------------------------------------------------------

# 19. deleteDivision() Returned Fields

The deleted division record contains:

``` text
division_id
division_name
geo_boundary
created_at
division_table_name
```

The repository returns:

``` js
result[0] || null
```

Therefore:

``` text
Division deleted
    ↓
Return deleted division

Division not found
    ↓
Return null
```

------------------------------------------------------------------------

# 20. updateDivisionTableName()

This function explicitly updates the physical table-name reference
stored against a division.

It receives:

``` text
zoneTableName
divisionId
tableName
```

The update sets:

``` text
division_table_name = tableName
```

for:

``` text
division_id = divisionId
```

------------------------------------------------------------------------

# 21. updateDivisionTableName() Returned Fields

The update returns:

``` text
division_id
division_name
geo_boundary
created_at
division_table_name
```

The function returns:

``` js
result[0] || null
```

Therefore:

``` text
Division found
    ↓
Return updated division

Division not found
    ↓
Return null
```

------------------------------------------------------------------------

# 22. updateZoneDivisionCount()

This function exists as an interface for updating the division count
associated with a zone.

It receives:

``` text
zoneTableName
totalDivisions
```

However, the current implementation is intentionally:

``` text
No-op
```

The source code explicitly states that:

``` text
total_divisions
```

lives in the:

``` text
City table
```

rather than the:

``` text
Zone table
```

Therefore this repository function does not perform any database
operation.

The division counter is expected to be updated by the service through
the parent City table.

------------------------------------------------------------------------

# 23. Division Counter Architecture

The implementation establishes:

``` text
City Table
    ↓
total_divisions
```

rather than:

``` text
Zone Table
    ↓
total_divisions
```

Therefore:

``` text
Division Repository
        ↓
updateZoneDivisionCount()
        ↓
No-op
```

and:

``` text
Division Service
        ↓
Parent City Table
        ↓
Update total_divisions
```

------------------------------------------------------------------------

# 24. Dynamic Zone Table Architecture

The repository operates on dynamically selected zone tables.

The hierarchy is:

``` text
City Registry
    ↓
city_table_name
    ↓
Physical City Table
    ↓
Zone
    ↓
zone_table_name
    ↓
Physical Zone Table
    ↓
Divisions
```

Division records are stored inside the physical zone table associated
with their zone.

------------------------------------------------------------------------

# 25. SQL Parameterization

Normal SQL values such as:

``` text
divisionId
divisionName
geoBoundary
tableName
```

are supplied through PostgreSQL parameters:

``` text
$1
$2
$3
...
```

The dynamic:

``` text
zoneTableName
```

is interpolated into the SQL statement because it represents a database
identifier.

------------------------------------------------------------------------

# 26. Database Operations

The repository provides:

  Function                      Operation
  ----------------------------- ---------------------
  `findCityById()`              Prisma `findUnique`
  `createDivision()`            SQL `INSERT`
  `getDivisions()`              SQL `SELECT`
  `getDivision()`               SQL `SELECT`
  `updateDivision()`            SQL `UPDATE`
  `deleteDivision()`            SQL `DELETE`
  `updateDivisionTableName()`   SQL `UPDATE`
  `updateZoneDivisionCount()`   No-op

------------------------------------------------------------------------

# 27. Read / Write Responsibilities

## Read Operations

``` text
findCityById()
getDivisions()
getDivision()
```

## Write Operations

``` text
createDivision()
updateDivision()
deleteDivision()
updateDivisionTableName()
```

The following function currently performs no database write:

``` text
updateZoneDivisionCount()
```

------------------------------------------------------------------------

# 28. Error Handling

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

therefore propagate to the calling service/controller.

The repository explicitly throws:

``` text
No fields provided for update
```

when `updateDivision()` receives no supported update fields.

------------------------------------------------------------------------

# 29. Result Handling

The repository follows these result patterns:

``` text
findCityById()
    ↓
Record or null

createDivision()
    ↓
Inserted division

getDivisions()
    ↓
Array of divisions

getDivision()
    ↓
Division or null

updateDivision()
    ↓
Updated division or null

deleteDivision()
    ↓
Deleted division or null

updateDivisionTableName()
    ↓
Updated division or null

updateZoneDivisionCount()
    ↓
No return value / undefined
```

------------------------------------------------------------------------

# 30. Architecture

``` text
Service / Controller
        ↓
masterCitizenDivision.repository
        ↓
masterCitizenPrisma
        │
        ├── city_table
        │
        └── $queryRawUnsafe()
                ↓
        Dynamic Zone Table
                ↓
             Divisions
```

------------------------------------------------------------------------

# 31. Geographic Hierarchy Support

The repository provides the city lookup required to resolve the parent
hierarchy.

The conceptual hierarchy is:

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
```

The repository itself does not retrieve zones. The zone table name is
supplied by the calling service.

------------------------------------------------------------------------

# 32. Division Registry Relationship

Each division record contains:

``` text
division_table_name
```

This identifies the physical table associated with that division.

The relationship is:

``` text
Division Registry Record
        ↕
division_table_name
        ↕
Physical Division Table
```

The repository provides:

``` text
updateDivisionTableName()
```

to store this physical-table reference.

------------------------------------------------------------------------

# 33. Exported Functions

The repository exports:

``` text
findCityById

createDivision
getDivisions
getDivision
updateDivision
deleteDivision

updateDivisionTableName
updateZoneDivisionCount
```

------------------------------------------------------------------------

# 34. Summary

`masterCitizenDivision.repository.js` is the database-access layer for
division management within the master citizen geographic hierarchy.

It provides:

``` text
City lookup
Division creation
Division listing
Single-division retrieval
Division updates
Division deletion
Physical division-table-name registration
Division-counter interface
```

Division records contain:

``` text
division_id
division_name
geo_boundary
created_at
division_table_name
```

Geographic boundaries are stored as PostgreSQL:

``` text
JSONB
```

The repository intentionally keeps:

``` text
division_name
```

separate from:

``` text
division_table_name
```

so changing the logical division name does not automatically rename the
physical division table.

The repository also establishes an important counter architecture:

``` text
total_divisions
```

is stored in the parent:

``` text
City table
```

rather than in the Zone table. Consequently, `updateZoneDivisionCount()`
is currently a no-op, with the service responsible for updating the
parent City counter.

Overall architecture:

``` text
City Registry
    ↓
city_table_name
    ↓
Physical City Table
    ↓
Zone
    ↓
zone_table_name
    ↓
Physical Zone Table
    ↓
Division Registry
    ↓
division_table_name
```
