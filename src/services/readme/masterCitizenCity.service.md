# masterCitizenCity.service.js Documentation

## 1. File Overview

**File:** `masterCitizenCity.service.js`\
**Location:** `src/services/masterCitizenCity.service.js`

This service provides the business-logic layer for creating and
retrieving city records and their associated physical city tables.

It handles:

``` text
City-name validation
Duplicate city validation
Dynamic city-table name generation
Dynamic city-table existence checks
City registry creation
Physical city-table creation
City registry update
Rollback on table-creation failure
Single-city retrieval
All-city retrieval
```

The main creation flow is:

``` text
City Input
    ↓
Validate City Name
    ↓
Check Existing City
    ↓
Generate City Table Name
    ↓
Check Physical Table
    ↓
Create City Registry Record
    ↓
Create Physical City Table
    ↓
Store Physical Table Name
    ↓
Return Updated City
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
masterCitizenCity.repository
masterCitizenTables utilities
```

The repository is imported from:

``` text
./masterCitizenCity.repository
```

The table utilities are imported from:

``` text
../utils/masterCitizenTables
```

The utility functions used are:

``` text
generateCityTableName
createCityTable
cityTableExists
```

------------------------------------------------------------------------

# 3. createCity()

This is the main city-creation method.

It receives an object containing:

``` text
cityName
geoBoundary
```

The method validates the city name, checks for duplicate records and
physical tables, creates the city registry record, creates the
corresponding physical city table, and stores the generated table name
in the city record.

------------------------------------------------------------------------

# 4. createCity() --- City Name Validation

The service first checks:

``` js
if (!cityName || typeof cityName !== "string")
```

If the condition is true, it throws:

``` text
cityName is required
```

Therefore a valid city name must be supplied as a string.

------------------------------------------------------------------------

# 5. City Name Cleaning

After validation, the service trims whitespace:

``` js
const cleanedCityName = cityName.trim();
```

The cleaned value is used for all subsequent city-name operations.

------------------------------------------------------------------------

## Empty City Name

If trimming produces an empty string, the service throws:

``` text
cityName cannot be empty
```

This prevents creation using a whitespace-only city name.

------------------------------------------------------------------------

# 6. Existing City Validation

The service checks whether a city with the cleaned name already exists.

It calls:

``` js
repository.findCityByName(cleanedCityName)
```

If a matching city exists, the service throws:

``` text
City already exists
```

No dynamic table is created when a duplicate city is detected.

------------------------------------------------------------------------

# 7. City Table Name Generation

After confirming that the city does not already exist, the service
generates the physical city table name using:

``` js
generateCityTableName(cleanedCityName)
```

The resulting value is stored as:

``` text
cityTableName
```

The exact naming convention is delegated to:

``` text
masterCitizenTables
```

The service itself does not construct the table name manually.

------------------------------------------------------------------------

# 8. Physical City Table Existence Check

The service checks whether the generated physical table already exists.

It calls:

``` js
cityTableExists(cityTableName)
```

If the table already exists, it throws:

``` text
Generated city table "<cityTableName>" already exists
```

This prevents the service from attempting to create a duplicate physical
table.

------------------------------------------------------------------------

# 9. City Registry Record Creation

After all preliminary checks pass, the service creates the city record
using:

``` js
repository.createCity({
  cityName: cleanedCityName,
  geoBoundary,
})
```

The repository creates the city registry record.

The returned record is stored as:

``` text
city
```

At this point, the registry record exists before the physical city table
is created.

------------------------------------------------------------------------

# 10. Physical City Table Creation

The physical city table is created using:

``` js
createCityTable(cityTableName)
```

This operation is placed inside a:

``` text
try / catch
```

block.

The service therefore treats physical table creation and registry
completion as one logical operation.

------------------------------------------------------------------------

# 11. Store Physical Table Name

After successful physical table creation, the service updates the city
registry record using:

``` js
repository.updateCityTableName(
  city.city_id,
  cityTableName
)
```

This stores the physical table name against the newly created city
record.

The updated city record is stored as:

``` text
updatedCity
```

and returned.

------------------------------------------------------------------------

# 12. City Creation Data Flow

The complete creation sequence is:

``` text
cityName + geoBoundary
        ↓
Validate cityName
        ↓
Trim cityName
        ↓
Find existing city
        ↓
Generate city table name
        ↓
Check table existence
        ↓
Create city registry record
        ↓
Create physical city table
        ↓
Update city_table_name
        ↓
Return updated city
```

------------------------------------------------------------------------

# 13. Rollback on Physical Table Failure

The service contains rollback logic for failures after the city registry
record has been created.

If:

``` text
createCityTable()
```

or:

``` text
updateCityTableName()
```

fails inside the `try` block, the service executes:

``` js
repository.deleteCity(city.city_id)
```

This removes the city registry record.

The original error is then re-thrown.

------------------------------------------------------------------------

# 14. Rollback Architecture

The rollback mechanism prevents the system from being left with a
partially configured city.

The intended sequence is:

``` text
Create City Registry
        ↓
Create Physical Table
        ↓
Update Registry With Table Name
```

If the later operation fails:

``` text
Delete City Registry
        ↓
Re-throw Original Error
```

Therefore the service attempts to avoid retaining a city record without
its completed physical-table configuration.

------------------------------------------------------------------------

# 15. Important Rollback Scope

The rollback is only executed for errors occurring inside the `try`
block.

The earlier validation operations:

``` text
findCityByName()
cityTableExists()
```

occur before the city record is created and therefore do not require
rollback.

------------------------------------------------------------------------

# 16. getCity()

This method retrieves a single city using:

``` text
cityId
```

It delegates the lookup to:

``` js
repository.findCityById(cityId)
```

------------------------------------------------------------------------

## City Not Found

If the repository returns no city, the service throws:

``` text
City not found
```

Otherwise the retrieved city is returned unchanged.

------------------------------------------------------------------------

# 17. getCities()

This method retrieves all city records.

It delegates directly to:

``` js
repository.getAllCities()
```

The result from the repository is returned unchanged.

The service itself does not apply additional filtering, pagination, or
transformation.

------------------------------------------------------------------------

# 18. Repository Interaction

The service uses the city repository for:

``` text
findCityByName()
createCity()
updateCityTableName()
deleteCity()
findCityById()
getAllCities()
```

The service uses the city-table utilities for:

``` text
generateCityTableName()
cityTableExists()
createCityTable()
```

------------------------------------------------------------------------

# 19. Business Rules

The service implements the following rules.

## City Name

``` text
Required
Must be a string
Cannot be empty after trimming
```

## Duplicate City

``` text
A city with the same cleaned name cannot be created.
```

## Physical City Table

``` text
The generated city table must not already exist.
```

## Creation Consistency

``` text
A city registry record is removed if physical table creation
or table-name registration fails.
```

## Retrieval

``` text
A requested city must exist.
```

------------------------------------------------------------------------

# 20. Error Handling

The service uses explicit business-rule errors for:

``` text
cityName is required
cityName cannot be empty
City already exists
Generated city table already exists
City not found
```

The physical-table creation/update section uses:

``` text
try / catch
```

to perform rollback before rethrowing the original error.

Errors from repository and utility functions are otherwise allowed to
propagate.

------------------------------------------------------------------------

# 21. Architecture

``` text
Controller
    ↓
masterCitizenCity.service
    │
    ├── masterCitizenCity.repository
    │       ↓
    │   city_table
    │
    └── masterCitizenTables
            ↓
      Physical City Table
```

For creation:

``` text
City Request
    ↓
Service Validation
    ↓
City Repository
    ↓
city_table
    ↓
Table Utility
    ↓
Physical City Table
    ↓
Update city_table_name
```

------------------------------------------------------------------------

# 22. Exported Functions

The service exports:

``` text
createCity
getCity
getCities
```

------------------------------------------------------------------------

# 23. Summary

`masterCitizenCity.service.js` is the business-logic layer for managing
cities in the master citizen geographic structure.

Its most important responsibility is coordinating the relationship
between:

``` text
City Registry Record
        ↕
Physical City Table
```

During creation, it validates and cleans the city name, prevents
duplicate city records, generates the physical table name, prevents
physical table-name collisions, creates the city registry record,
creates the physical table, and finally stores the physical table name
in the registry.

If physical table creation or final registry update fails, the service
removes the city registry record and rethrows the original error.

For retrieval, it provides:

``` text
getCity()
getCities()
```

with the service converting a missing single-city lookup into a
`City not found` error.
