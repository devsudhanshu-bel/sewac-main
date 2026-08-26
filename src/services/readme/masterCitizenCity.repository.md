# masterCitizenCity.repository.js Documentation

## 1. File Overview

**File:** `masterCitizenCity.repository.js`\
**Location:** `src/repositories/masterCitizenCity.repository.js`

This repository provides database access functions for the city master
table.

It handles:

``` text
City creation
City lookup by ID
City lookup by name
City table-name update
City deletion
Retrieval of all cities
```

The repository uses Prisma for all database operations.

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

The Prisma client is used to access:

``` text
city_table
```

------------------------------------------------------------------------

# 3. createCity()

This function creates a new city record.

It receives:

``` text
data
```

The following input fields are read:

``` text
data.cityName
data.geoBoundary
```

The Prisma operation is:

``` js
masterCitizenPrisma.city_table.create()
```

------------------------------------------------------------------------

## City Fields

The repository maps the input values to database fields as follows:

``` text
data.cityName
    ↓
city_name

data.geoBoundary
    ↓
geo_boundary
```

------------------------------------------------------------------------

## Geo Boundary Handling

The geographic boundary is assigned using:

``` js
data.geoBoundary || null
```

Therefore:

``` text
geoBoundary provided
    ↓
Store supplied value

geoBoundary falsy / unavailable
    ↓
Store null
```

The created city record returned by Prisma is returned directly.

------------------------------------------------------------------------

# 4. findCityById()

This function retrieves a single city using its city ID.

It receives:

``` text
cityId
```

The repository performs:

``` js
masterCitizenPrisma.city_table.findUnique()
```

using:

``` text
city_id = cityId
```

The complete Prisma result is returned unchanged.

If no city matches the supplied ID, Prisma returns:

``` text
null
```

The repository itself does not convert this into an error.

------------------------------------------------------------------------

# 5. findCityByName()

This function retrieves a single city using its city name.

It receives:

``` text
cityName
```

The repository performs:

``` js
masterCitizenPrisma.city_table.findUnique()
```

using:

``` text
city_name = cityName
```

The complete result is returned unchanged.

If no city matches the supplied name, the Prisma result is:

``` text
null
```

------------------------------------------------------------------------

# 6. updateCityTableName()

This function updates the table-name field associated with a city.

It receives:

``` text
cityId
tableName
```

The repository performs:

``` js
masterCitizenPrisma.city_table.update()
```

using:

``` text
city_id = cityId
```

The field updated is:

``` text
city_table_name
```

The supplied:

``` text
tableName
```

is stored as the new value.

------------------------------------------------------------------------

# 7. updateCityTableName() Data Flow

The update mapping is:

``` text
cityId
   ↓
city_table.city_id
   ↓
Locate City
   ↓
tableName
   ↓
city_table.city_table_name
```

The updated city record returned by Prisma is returned directly.

------------------------------------------------------------------------

# 8. deleteCity()

This function deletes a city record.

It receives:

``` text
cityId
```

The repository performs:

``` js
masterCitizenPrisma.city_table.delete()
```

using:

``` text
city_id = cityId
```

The deleted record returned by Prisma is returned directly.

The repository does not perform any additional validation before
deletion.

------------------------------------------------------------------------

# 9. getAllCities()

This function retrieves all city records.

It performs:

``` js
masterCitizenPrisma.city_table.findMany()
```

against:

``` text
city_table
```

The records are ordered by:

``` text
city_id ASC
```

Therefore cities are returned in ascending city-ID order.

------------------------------------------------------------------------

# 10. Database Operations

The repository provides the following database operations:

  Function                  Prisma Operation   Database Field
  ------------------------- ------------------ ----------------
  `createCity()`            `create`           `city_table`
  `findCityById()`          `findUnique`       `city_id`
  `findCityByName()`        `findUnique`       `city_name`
  `updateCityTableName()`   `update`           `city_id`
  `deleteCity()`            `delete`           `city_id`
  `getAllCities()`          `findMany`         `city_table`

------------------------------------------------------------------------

# 11. Read / Write Responsibilities

The repository performs both read and write operations.

## Read Operations

``` text
findCityById()
findCityByName()
getAllCities()
```

## Write Operations

``` text
createCity()
updateCityTableName()
deleteCity()
```

------------------------------------------------------------------------

# 12. Error Handling

The repository does not contain explicit:

``` text
try / catch
```

blocks.

Prisma errors therefore propagate to the calling service/controller
layer.

Examples of possible underlying Prisma failures include:

``` text
Record not found for update/delete
Unique constraint violation
Database connection errors
Schema/database errors
```

The repository itself does not transform these errors.

------------------------------------------------------------------------

# 13. Result Handling

All functions return the result of the corresponding Prisma operation
directly.

The repository does not:

``` text
Transform records
Paginate results
Construct HTTP responses
Apply business rules
```

Its responsibility is database access.

------------------------------------------------------------------------

# 14. Architecture

``` text
Service / Controller
        ↓
masterCitizenCity.repository
        ↓
masterCitizenPrisma
        ↓
city_table
```

For city creation:

``` text
City Data
    ↓
createCity()
    ↓
Prisma create()
    ↓
city_table
```

For city lookup:

``` text
City ID / Name
    ↓
findCityById() / findCityByName()
    ↓
Prisma findUnique()
    ↓
city_table
```

For city listing:

``` text
getAllCities()
    ↓
Prisma findMany()
    ↓
city_id ASC
    ↓
All Cities
```

------------------------------------------------------------------------

# 15. Exported Functions

The repository exports:

``` text
createCity
findCityById
findCityByName
updateCityTableName
deleteCity
getAllCities
```

------------------------------------------------------------------------

# 16. Summary

`masterCitizenCity.repository.js` is the Prisma repository layer for the
`city_table`.

It provides CRUD-style database access for cities:

``` text
Create
Read by ID
Read by Name
Update Table Name
Delete
Read All
```

The repository maps application-level city data to the database fields:

``` text
cityName
    ↓
city_name

geoBoundary
    ↓
geo_boundary

tableName
    ↓
city_table_name
```

All database operations are delegated directly to `masterCitizenPrisma`,
with Prisma results and errors passed through to the calling layer.
