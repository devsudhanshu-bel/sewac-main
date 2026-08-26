# masterCitizenTables.js Documentation

## 1. File Overview

**File:** `masterCitizenTables(2).js`

This module manages dynamically generated PostgreSQL tables for the
Master Citizen hierarchy.

The hierarchy is:

``` text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

The module uses:

``` text
masterCitizenPrisma
```

for database operations.

------------------------------------------------------------------------

# 2. generateSafeName()

The helper:

``` text
generateSafeName(name)
```

converts a supplied name into a PostgreSQL-safe identifier.

The transformation:

``` text
lowercase
↓
trim
↓
replace non-alphanumeric characters with _
↓
remove leading/trailing _
```

Example:

``` text
Bangalore
    ↓
bangalore

East Zone
    ↓
east_zone

North Bangalore
    ↓
north_bangalore
```

If the resulting value is empty, the function throws:

``` text
Invalid name for table generation
```

------------------------------------------------------------------------

# 3. generateConstraintName()

The helper:

``` text
generateConstraintName(prefix, tableName)
```

creates a PostgreSQL constraint name from:

``` text
prefix
tableName
```

The generated name follows:

``` text
<prefix>_<safe_table_name>
```

PostgreSQL identifiers are limited to 63 characters, so values exceeding
this limit are truncated to:

``` text
63 characters
```

------------------------------------------------------------------------

# 4. generateCityTableName()

The helper:

``` text
generateCityTableName(cityName)
```

generates a dynamic City table name.

The normal format is:

``` text
<safe_city_name>_city
```

If the supplied name already ends with:

``` text
_city
```

the suffix is not added again.

------------------------------------------------------------------------

# 5. generateZoneTableName()

The helper:

``` text
generateZoneTableName(zoneName)
```

generates:

``` text
<safe_zone_name>_zone
```

If the supplied name already ends with:

``` text
_zone
```

the existing suffix is preserved.

------------------------------------------------------------------------

# 6. generateDivisionTableName()

The helper:

``` text
generateDivisionTableName(divisionName)
```

generates:

``` text
<safe_division_name>_division
```

If the supplied name already ends with:

``` text
_division
```

the suffix is not duplicated.

------------------------------------------------------------------------

# 7. generateWardTableName()

The helper:

``` text
generateWardTableName(wardName, wardNo)
```

generates a Ward table name.

If `wardName` is supplied, it is converted into a safe identifier.

If no ward name is supplied, the fallback is:

``` text
ward_<wardNo>
```

The final name always uses the:

``` text
ward_
```

prefix.

Examples:

``` text
Ward 25 → ward_25
JP Nagar → ward_jp_nagar
```

------------------------------------------------------------------------

# 8. validateTableName()

The helper:

``` text
validateTableName(tableName)
```

validates dynamic table names.

A valid name must:

``` text
be a string
start with a lowercase letter
contain only lowercase letters
contain numbers
contain underscores
```

The validation pattern is:

``` text
^[a-z][a-z0-9_]*$
```

Invalid names cause:

``` text
Invalid table name
```

to be thrown.

------------------------------------------------------------------------

# 9. tableExists()

The helper:

``` text
tableExists(tableName)
```

checks whether a table exists in the PostgreSQL `public` schema.

It first validates the table name and then queries:

``` text
information_schema.tables
```

The result is returned as a boolean.

------------------------------------------------------------------------

# 10. Hierarchy-Specific Table Checks

The module exposes:

``` text
cityTableExists()
zoneTableExists()
divisionTableExists()
wardTableExists()
```

Each delegates to:

``` text
tableExists()
```

Therefore all four functions use the same table-existence validation and
lookup logic.

------------------------------------------------------------------------

# 11. createCityTable()

The function:

``` text
createCityTable(tableName)
```

creates a dynamic City table if it does not already exist.

A City table contains the Zones belonging to that City.

The table defines:

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

# 12. City Table Structure

The City dynamic table contains:

  Column              Type / Definition
  ------------------- ------------------------------------------
  `zone_id`           `SERIAL PRIMARY KEY`
  `zone_name`         `VARCHAR(150) NOT NULL`
  `geo_boundary`      `JSONB`
  `total_divisions`   `INTEGER DEFAULT 0`
  `total_wards`       `INTEGER DEFAULT 0`
  `created_at`        `TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP`
  `zone_table_name`   `VARCHAR(150)`

The table name is validated before creation.

------------------------------------------------------------------------

# 13. createZoneTable()

The function:

``` text
createZoneTable(tableName)
```

creates a dynamic Zone table if it does not already exist.

A Zone table contains the Divisions belonging to that Zone.

The table defines:

``` text
division_id
division_name
geo_boundary
created_at
division_table_name
```

------------------------------------------------------------------------

# 14. Zone Table Structure

  Column                  Type / Definition
  ----------------------- ------------------------------------------
  `division_id`           `SERIAL PRIMARY KEY`
  `division_name`         `VARCHAR(150) NOT NULL`
  `geo_boundary`          `JSONB`
  `created_at`            `TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP`
  `division_table_name`   `VARCHAR(150)`

------------------------------------------------------------------------

# 15. createDivisionTable()

The function:

``` text
createDivisionTable(tableName)
```

creates a dynamic Division table if it does not already exist.

A Division table contains the Wards belonging to that Division.

The table defines:

``` text
ward_id
ward_no
ward_name
geo_boundary
created_at
ward_table_name
```

------------------------------------------------------------------------

# 16. Division Table Structure

  Column              Type / Definition
  ------------------- ------------------------------------------
  `ward_id`           `SERIAL PRIMARY KEY`
  `ward_no`           `INTEGER NOT NULL`
  `ward_name`         `VARCHAR(150) NOT NULL`
  `geo_boundary`      `JSONB`
  `created_at`        `TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP`
  `ward_table_name`   `VARCHAR(150)`

The function also creates a unique constraint on:

``` text
ward_no
```

The constraint name is generated using:

``` text
generateConstraintName("unique_ward_no", tableName)
```

------------------------------------------------------------------------

# 17. Ward Number Uniqueness

The Division table defines:

``` text
UNIQUE (ward_no)
```

This ensures that a ward number cannot be duplicated within the
corresponding Division table.

The generated constraint name is also kept within PostgreSQL's
63-character identifier limit.

------------------------------------------------------------------------

# 18. createWardTable()

The function:

``` text
createWardTable(tableName)
```

creates the actual citizen-data table associated with a Ward.

This is explicitly different from a Ward registry table.

The hierarchy is represented externally through:

``` text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

The citizen table itself therefore does not duplicate those hierarchy
fields in every citizen record.

------------------------------------------------------------------------

# 19. Ward Citizen Table Structure

The Ward citizen table contains:

  Column                  Definition
  ----------------------- ------------------------------------------
  `id`                    `SERIAL PRIMARY KEY`
  `phoneNumber`           `TEXT`
  `area`                  `TEXT`
  `wasteGeneratorTypes`   `TEXT`
  `houseNumber`           `TEXT`
  `floorNumber`           `TEXT`
  `householdType`         `TEXT`
  `personName`            `TEXT`
  `contactNumber`         `TEXT`
  `numberOfPeople`        `TEXT`
  `buildingPhoto`         `TEXT`
  `createdAt`             `TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`
  `updatedAt`             `TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`
  `dryRFID`               `TEXT`
  `drySlno`               `TEXT`
  `wetRFID`               `TEXT`
  `wetSlno`               `TEXT`
  `lat`                   `NUMERIC(10,8)`
  `lng`                   `NUMERIC(11,8)`

------------------------------------------------------------------------

# 20. dropDynamicTable()

The function:

``` text
dropDynamicTable(tableName)
```

deletes a dynamic table using:

``` text
DROP TABLE IF EXISTS
```

The table name is validated before the operation.

If the table does not exist, the SQL operation does not fail because:

``` text
IF EXISTS
```

is used.

------------------------------------------------------------------------

# 21. Dynamic Table Lifecycle

The module supports the following lifecycle:

``` text
Generate Safe Name
       ↓
Validate Table Name
       ↓
Check Table Existence
       ↓
Create Dynamic Table
       ↓
Use Table
       ↓
Drop Dynamic Table
```

------------------------------------------------------------------------

# 22. Hierarchical Table Architecture

The complete dynamic-table architecture is:

``` text
City Table
   ↓
Zone Table
   ↓
Division Table
   ↓
Ward Table
   ↓
Citizen Records
```

The table-name references stored by the hierarchy are:

``` text
zone_table_name
division_table_name
ward_table_name
```

------------------------------------------------------------------------

# 23. Raw SQL Usage

The module uses Prisma raw SQL methods:

``` text
$queryRawUnsafe()
$executeRawUnsafe()
```

Raw SQL is used because table names are dynamically generated.

Before dynamic identifiers are used, the module validates them using:

``` text
validateTableName()
```

------------------------------------------------------------------------

# 24. Complete Module Flow

``` text
City / Zone / Division / Ward Name
             ↓
       generateSafeName()
             ↓
      Generate Table Name
             ↓
       validateTableName()
             ↓
        tableExists()
             ↓
       Create Dynamic Table
             ↓
       Store Hierarchy Data
             ↓
        Ward Citizen Data
```

------------------------------------------------------------------------

# 25. Exported Functions

The module exports:

``` text
generateSafeName
generateCityTableName
generateZoneTableName
generateDivisionTableName
generateWardTableName
generateConstraintName
validateTableName
tableExists
cityTableExists
zoneTableExists
divisionTableExists
wardTableExists
createCityTable
createZoneTable
createDivisionTable
createWardTable
dropDynamicTable
```

------------------------------------------------------------------------

# 26. Summary

`masterCitizenTables(2).js` provides the dynamic PostgreSQL
table-management layer for the Master Citizen hierarchy.

It is responsible for:

``` text
Generating safe table names
Generating constraint names
Validating dynamic identifiers
Checking table existence
Creating City tables
Creating Zone tables
Creating Division tables
Creating Ward citizen tables
Dropping dynamic tables
```

The central architecture is:

``` text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
 ↓
Citizen Data
```

with each hierarchy level represented through dynamically generated
PostgreSQL tables.
