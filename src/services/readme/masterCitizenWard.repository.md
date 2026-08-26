# masterCitizenWard.repository.js Documentation

## 1. File Overview

**File:** `masterCitizenWard.repository.js`\
**Location:** `src/repositories/masterCitizenWard.repository.js`

This repository provides the database-access layer for managing wards
within a division-specific physical table.

It handles:

``` text
City lookup
Zone lookup
Division lookup
Ward creation
Ward retrieval
Ward lookup by ward number
Ward lookup by internal ward ID
Ward updates
Ward physical-table-name updates
Ward deletion
```

The repository uses Prisma for the city registry and Prisma raw SQL for
dynamically selected:

``` text
City tables
Division tables
```

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

Database operations use:

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

If no city exists with the supplied ID, the result is:

``` text
null
```

------------------------------------------------------------------------

# 4. findZone()

This function retrieves a zone from a dynamically selected city table.

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

# 5. findDivision()

This function retrieves a division from a dynamically selected zone
table.

It receives:

``` text
zoneTableName
divisionId
```

The query selects:

``` text
division_id
division_name
division_table_name
```

from:

``` text
zoneTableName
```

using:

``` text
division_id = $1
```

and:

``` text
LIMIT 1
```

------------------------------------------------------------------------

## findDivision() Result

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

# 6. createWard()

This function creates a new ward inside a division-specific physical
table.

It receives:

``` text
divisionTableName
data
```

The expected input fields are:

``` text
data.wardNo
data.wardName
data.geoBoundary
```

------------------------------------------------------------------------

# 7. createWard() SQL

The repository executes an:

``` text
INSERT
```

into the dynamically selected:

``` text
divisionTableName
```

The inserted fields are:

``` text
ward_no
ward_name
geo_boundary
```

The geographic boundary is explicitly cast to:

``` text
JSONB
```

using:

``` sql
$3::jsonb
```

------------------------------------------------------------------------

# 8. Geo Boundary Handling

The geographic boundary is converted using:

``` js
JSON.stringify(
  data.geoBoundary ?? null
)
```

Therefore:

``` text
geoBoundary provided
    ↓
Convert to JSON string
    ↓
Store as JSONB

geoBoundary null / undefined
    ↓
JSON.stringify(null)
    ↓
Store JSON null
```

------------------------------------------------------------------------

# 9. createWard() Returned Fields

The insert operation returns:

``` text
ward_id
ward_no
ward_name
geo_boundary
created_at
ward_table_name
```

The repository returns:

``` js
result[0]
```

The complete inserted ward record is therefore returned.

------------------------------------------------------------------------

# 10. getWards()

This function retrieves all wards from a division table.

It receives:

``` text
divisionTableName
```

The query selects:

``` text
ward_id
ward_no
ward_name
geo_boundary
created_at
ward_table_name
```

------------------------------------------------------------------------

## Ward Ordering

The result is ordered by:

``` text
ward_no ASC
```

Therefore wards are returned in ascending business ward-number order.

------------------------------------------------------------------------

# 11. getWardByNumber()

This function retrieves a single ward using its business-facing ward
number.

It receives:

``` text
divisionTableName
wardNo
```

The lookup condition is:

``` text
ward_no = $1
```

and the query uses:

``` text
LIMIT 1
```

------------------------------------------------------------------------

## Ward Number as Business Identifier

The repository explicitly treats:

``` text
ward_no
```

as the business identifier.

For example:

``` text
ward_no = 25
```

represents municipal ward number 25.

This lookup is intended for endpoints such as:

``` text
GET /wards/no/:wardNo
```

------------------------------------------------------------------------

# 12. getWardByNumber() Result

The function returns:

``` js
result[0] || null
```

Therefore:

``` text
Ward found
    ↓
Return ward

Ward not found
    ↓
Return null
```

------------------------------------------------------------------------

# 13. getWardById()

This function retrieves a ward using its internal database primary key.

It receives:

``` text
divisionTableName
wardId
```

The lookup condition is:

``` text
ward_id = $1
```

and the query uses:

``` text
LIMIT 1
```

------------------------------------------------------------------------

# 14. ward_id vs ward_no

The repository explicitly distinguishes:

``` text
ward_id
```

from:

``` text
ward_no
```

## ward_id

``` text
Internal database primary key
```

## ward_no

``` text
Business-facing municipal ward number
```

The repository therefore provides two separate lookup functions:

``` text
getWardByNumber()
        ↓
ward_no

getWardById()
        ↓
ward_id
```

The implementation comments indicate that:

``` text
PATCH
DELETE
```

use:

``` text
ward_id
```

------------------------------------------------------------------------

# 15. updateWard()

This function updates a ward using its internal:

``` text
ward_id
```

It receives:

``` text
divisionTableName
wardId
data
```

Supported update fields are:

``` text
wardNo
wardName
geoBoundary
```

------------------------------------------------------------------------

# 16. updateWard() --- Ward Number

When:

``` text
data.wardNo !== undefined
```

the repository adds:

``` sql
ward_no = $parameter
```

The supplied value is stored directly.

------------------------------------------------------------------------

# 17. updateWard() --- Ward Name

When:

``` text
data.wardName !== undefined
```

the repository adds:

``` sql
ward_name = $parameter
```

The supplied value is stored directly.

------------------------------------------------------------------------

# 18. updateWard() --- Geographic Boundary

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
JSON.stringify(
  data.geoBoundary
)
```

The database therefore stores the geographic boundary as:

``` text
JSONB
```

------------------------------------------------------------------------

# 19. Dynamic Update Construction

The repository constructs the update dynamically using:

``` text
fields
values
parameterIndex
```

For example, if only:

``` text
wardName
```

is supplied:

``` text
UPDATE
    ward_name = $1
```

If multiple supported fields are supplied, they are joined using:

``` text
,
```

The parameter numbering is incremented for every supplied field.

------------------------------------------------------------------------

# 20. No Update Fields

If no supported fields are supplied:

``` text
fields.length === 0
```

the repository throws:

``` text
No fields provided for update
```

No SQL update is executed.

------------------------------------------------------------------------

# 21. updateWard() Record Selection

After collecting the update parameters, the repository appends:

``` text
wardId
```

to the values array.

The update condition is:

``` text
WHERE ward_id = $parameterIndex
```

Therefore updates are always applied to the ward's internal primary key.

------------------------------------------------------------------------

# 22. updateWard() Returned Fields

The update returns:

``` text
ward_id
ward_no
ward_name
geo_boundary
created_at
ward_table_name
```

The repository returns:

``` js
result[0] || null
```

Therefore:

``` text
Updated ward found
    ↓
Return updated record

No matching ward
    ↓
Return null
```

------------------------------------------------------------------------

# 23. Physical Ward Table Name Preservation

Updating:

``` text
ward_no
ward_name
geo_boundary
```

does not automatically update:

``` text
ward_table_name
```

The physical table name therefore remains independent of the logical
ward attributes.

This allows the logical ward information to change without automatically
renaming the physical ward table.

------------------------------------------------------------------------

# 24. updateWardTableName()

This function explicitly updates the physical table-name reference
stored against a ward.

It receives:

``` text
divisionTableName
wardId
tableName
```

The update sets:

``` text
ward_table_name = tableName
```

for:

``` text
ward_id = wardId
```

------------------------------------------------------------------------

# 25. updateWardTableName() Returned Fields

The update returns:

``` text
ward_id
ward_no
ward_name
geo_boundary
created_at
ward_table_name
```

The function returns:

``` js
result[0] || null
```

Therefore the updated ward record is returned when found.

------------------------------------------------------------------------

# 26. deleteWard()

This function deletes a ward from a division table.

It receives:

``` text
divisionTableName
wardId
```

The deletion condition is:

``` text
ward_id = $1
```

The query uses:

``` text
DELETE FROM
```

and:

``` text
RETURNING
```

to return the deleted record.

------------------------------------------------------------------------

# 27. deleteWard() Returned Fields

The deleted record contains:

``` text
ward_id
ward_no
ward_name
geo_boundary
created_at
ward_table_name
```

The function returns:

``` js
result[0] || null
```

Therefore:

``` text
Ward deleted
    ↓
Return deleted ward

Ward not found
    ↓
Return null
```

------------------------------------------------------------------------

# 28. Dynamic Division Table Architecture

The repository does not operate on a single fixed ward table.

Instead, the division physical table is passed as:

``` text
divisionTableName
```

The hierarchy is:

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
Ward Records
```

Ward records are stored inside the physical division table associated
with their division.

------------------------------------------------------------------------

# 29. Ward Registry Relationship

Each ward record can store:

``` text
ward_table_name
```

This field identifies the physical table associated with that ward.

Therefore the logical registry relationship is:

``` text
Ward Registry Record
        ↕
ward_table_name
        ↕
Physical Ward Table
```

The repository itself does not create or drop that physical table. It
only stores and retrieves its table-name reference.

------------------------------------------------------------------------

# 30. SQL Parameterization

Normal values such as:

``` text
wardNo
wardName
wardId
geoBoundary
tableName
```

are supplied through SQL parameters:

``` text
$1
$2
$3
...
```

The dynamic:

``` text
divisionTableName
```

is interpolated into the SQL statement because it is a database
identifier.

------------------------------------------------------------------------

# 31. Database Operations

The repository provides:

  Function                  Operation
  ------------------------- ---------------------
  `findCityById()`          Prisma `findUnique`
  `findZone()`              SQL `SELECT`
  `findDivision()`          SQL `SELECT`
  `createWard()`            SQL `INSERT`
  `getWards()`              SQL `SELECT`
  `getWardByNumber()`       SQL `SELECT`
  `getWardById()`           SQL `SELECT`
  `updateWard()`            SQL `UPDATE`
  `updateWardTableName()`   SQL `UPDATE`
  `deleteWard()`            SQL `DELETE`

------------------------------------------------------------------------

# 32. Read / Write Responsibilities

## Read Operations

``` text
findCityById()
findZone()
findDivision()
getWards()
getWardByNumber()
getWardById()
```

## Write Operations

``` text
createWard()
updateWard()
updateWardTableName()
deleteWard()
```

------------------------------------------------------------------------

# 33. Error Handling

The repository does not use explicit:

``` text
try / catch
```

blocks.

Database errors therefore propagate to the calling service/controller.

The repository explicitly throws:

``` text
No fields provided for update
```

when `updateWard()` receives no supported update fields.

Other failures may originate from:

``` text
Prisma
PostgreSQL
Dynamic SQL
Database constraints
```

and are not transformed by this repository.

------------------------------------------------------------------------

# 34. Result Handling

The repository follows these result patterns:

``` text
findCityById()
    ↓
Record or null

findZone()
    ↓
Record or null

findDivision()
    ↓
Record or null

getWards()
    ↓
Array of wards

createWard()
    ↓
Inserted ward

getWardByNumber()
    ↓
Ward or null

getWardById()
    ↓
Ward or null

updateWard()
    ↓
Updated ward or null

updateWardTableName()
    ↓
Updated ward or null

deleteWard()
    ↓
Deleted ward or null
```

------------------------------------------------------------------------

# 35. Architecture

``` text
Service / Controller
        ↓
masterCitizenWard.repository
        │
        └── masterCitizenPrisma
                │
                ├── city_table
                │
                └── $queryRawUnsafe()
                        ↓
                Dynamic City / Division Tables
                        ↓
                      Wards
```

------------------------------------------------------------------------

# 36. Geographic Lookup Flow

The repository supports hierarchical lookup:

``` text
City ID
  ↓
findCityById()
  ↓
City Table Name
  ↓
findZone()
  ↓
Zone Table Name
  ↓
findDivision()
  ↓
Division Table Name
  ↓
Ward Operations
```

This allows callers to validate the complete:

``` text
City → Zone → Division → Ward
```

hierarchy before performing ward operations.

------------------------------------------------------------------------

# 37. Ward Identification Model

The repository supports two identifiers for wards:

``` text
ward_id
ward_no
```

The distinction is:

``` text
ward_id
    ↓
Internal database identifier

ward_no
    ↓
Business / municipal ward number
```

Retrieval supports both:

``` text
getWardByNumber()
getWardById()
```

while updates and deletion use:

``` text
ward_id
```

------------------------------------------------------------------------

# 38. Exported Functions

The repository exports:

``` text
findCityById
findZone
findDivision

createWard

getWards

getWardByNumber
getWardById

updateWard
updateWardTableName

deleteWard
```

------------------------------------------------------------------------

# 39. Summary

`masterCitizenWard.repository.js` is the database-access layer for ward
management within the master citizen geographic hierarchy.

It supports:

``` text
City lookup
Zone lookup
Division lookup
Ward creation
Ward listing
Ward lookup by business number
Ward lookup by internal ID
Ward updates
Physical ward-table-name updates
Ward deletion
```

The repository distinguishes clearly between:

``` text
ward_id
```

and:

``` text
ward_no
```

where:

``` text
ward_id
    =
internal database primary key

ward_no
    =
business-facing municipal ward number
```

Ward records are stored inside dynamic division-specific physical
tables, and each ward can maintain its associated:

``` text
ward_table_name
```

reference.

Geographic boundaries are stored as PostgreSQL:

``` text
JSONB
```

and the repository uses parameterized SQL values while dynamically
selecting the division table through its supplied table name.

Overall architecture:

``` text
City
  ↓
Zone
  ↓
Division
  ↓
Division Physical Table
  ↓
Ward Registry
  ↓
Ward Physical Table Reference
```
