# citizenService.js Documentation

## 1. File Overview

**File:** `citizenService.js`\
**Location:** `src/services/citizenService.js`

This service provides the business-logic layer for retrieving citizen
records from the master citizen database.

It handles:

``` text
Citizen search
Citizen retrieval
Case-insensitive name search
Phone-number search
Wet RFID serial-number search
Dry RFID serial-number search
Citizen result ordering
Retrieval of all citizens
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
prisma
```

imported from:

``` text
../config/prisma
```

The Prisma client is used to access:

``` text
master_citizen_data
```

------------------------------------------------------------------------

# 3. searchCitizen()

This function searches the citizen master data using a supplied query.

It receives:

``` text
query
```

The query is normalized using:

``` js
query.trim()
```

The normalized value is stored as:

``` text
normalizedQuery
```

The service logs the received normalized query.

------------------------------------------------------------------------

# 4. Search Criteria

The search uses Prisma's:

``` text
OR
```

condition.

A citizen record matches when the normalized query matches **any** of
the following fields:

``` text
personName
phoneNumber
wetSlno
drySlno
```

------------------------------------------------------------------------

## Person Name

The service searches:

``` text
personName
```

using:

``` text
contains
```

with:

``` text
mode: "insensitive"
```

Therefore the name search is:

``` text
partial
case-insensitive
```

------------------------------------------------------------------------

## Phone Number

The service compares:

``` text
phoneNumber
```

directly against:

``` text
normalizedQuery
```

The query is not configured with `contains` for this field.

Therefore the phone-number condition requires the field to equal the
normalized query.

------------------------------------------------------------------------

## Wet RFID Serial Number

The service searches:

``` text
wetSlno
```

using:

``` text
contains
```

The search is therefore based on a partial match.

------------------------------------------------------------------------

## Dry RFID Serial Number

The service searches:

``` text
drySlno
```

using:

``` text
contains
```

The search is therefore based on a partial match.

------------------------------------------------------------------------

# 5. searchCitizen() Query Structure

The logical search condition is:

``` text
personName contains query
        OR
phoneNumber equals query
        OR
wetSlno contains query
        OR
drySlno contains query
```

The Prisma query operates against:

``` text
master_citizen_data
```

------------------------------------------------------------------------

# 6. Search Result Ordering

Search results are ordered by:

``` text
id
```

in descending order:

``` text
id DESC
```

Therefore newer/higher-ID records are returned first according to the
table's `id` values.

------------------------------------------------------------------------

# 7. searchCitizen() Result

The function returns the complete result returned by:

``` js
prisma.master_citizen_data.findMany()
```

No additional transformation, pagination, or field selection is
performed.

The returned records therefore contain the fields provided by the Prisma
model/query.

------------------------------------------------------------------------

# 8. Search Logging

The service logs:

``` text
SERVICE RECEIVED QUERY
RESULT COUNT
RESULT
FIRST RECORD FULL
```

The complete result array is serialized for the `RESULT` log.

The first returned record is also logged separately.

These logs are for service-level debugging/inspection.

------------------------------------------------------------------------

# 9. getAllCitizens()

This function retrieves all records from:

``` text
master_citizen_data
```

It does not accept any parameters.

The query uses:

``` js
findMany()
```

with ordering:

``` text
id DESC
```

------------------------------------------------------------------------

# 10. getAllCitizens() Result

The complete result returned by Prisma is returned directly.

There is no:

``` text
pagination
filtering
search condition
field transformation
```

applied by the service.

------------------------------------------------------------------------

# 11. Database Operations

The service performs two read operations.

## Search

``` text
prisma.master_citizen_data.findMany()
```

with an `OR` search condition.

## Retrieve All

``` text
prisma.master_citizen_data.findMany()
```

without a `where` condition.

Both operations order results by:

``` text
id DESC
```

------------------------------------------------------------------------

# 12. Architecture

``` text
Controller
    ↓
citizenService
    ↓
Prisma
    ↓
master_citizen_data
```

For search:

``` text
Search Query
    ↓
trim()
    ↓
Name / Phone / Wet RFID / Dry RFID
    ↓
master_citizen_data
    ↓
id DESC
    ↓
Citizen Results
```

For complete retrieval:

``` text
getAllCitizens()
    ↓
master_citizen_data
    ↓
id DESC
    ↓
All Citizen Records
```

------------------------------------------------------------------------

# 13. Exported Functions

The service exports:

``` text
searchCitizen
getAllCitizens
```

------------------------------------------------------------------------

# 14. Error Handling

The service does not contain explicit `try/catch` blocks.

Errors from:

``` text
query.trim()
Prisma
Database operations
```

are therefore allowed to propagate to the calling layer.

The service itself does not construct HTTP responses or HTTP status
codes.

------------------------------------------------------------------------

# 15. Summary

`citizenService.js` is the citizen-data retrieval service for the
`master_citizen_data` table.

It provides two operations:

``` text
searchCitizen()
getAllCitizens()
```

`searchCitizen()` performs an OR-based search across:

``` text
personName
phoneNumber
wetSlno
drySlno
```

with case-insensitive partial matching for `personName`, exact matching
for `phoneNumber`, and partial matching for both RFID serial-number
fields.

`getAllCitizens()` retrieves every citizen record.

Both operations return records ordered by:

``` text
id DESC
```

The service is read-only and delegates database access to Prisma.
