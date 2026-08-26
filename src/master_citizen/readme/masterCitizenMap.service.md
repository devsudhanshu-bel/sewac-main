# masterCitizenMap.service.js Documentation

## 1. File Overview

**File:** `masterCitizenMap.service.js`

The service implements the database logic for the Master Citizen geographic map.

The hierarchy is:

```text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
```

It uses:

```text
masterCitizenPrisma
```

for PostgreSQL queries.

---

# 2. validateTableName()

Validates dynamic PostgreSQL table names.

The accepted pattern is:

```text
^[a-z][a-z0-9_]*$
```

The table name must:

```text
be a string
begin with a lowercase letter
contain lowercase letters
contain numbers
contain underscores
```

Invalid names throw:

```text
Invalid table name
```

---

# 3. normalizeGeoBoundary()

Normalizes geographic boundary data.

When the value is:

```text
null
undefined
```

the function returns:

```text
null
```

When the value is a string, it attempts:

```text
JSON.parse()
```

If parsing fails:

```text
null
```

is returned.

Already-parsed values are returned directly.

---

# 4. tableExists()

Checks whether a specified table exists in:

```text
public
```

using:

```text
information_schema.tables
```

The table name is validated before the query.

The result is converted into a boolean.

---

# 5. getCityMapData()

The method:

```text
getCityMapData(cityId)
```

returns:

```text
City
+
Zones
```

It intentionally does not load:

```text
Divisions
Wards
Citizen Data
```

This keeps the initial map payload smaller.

---

# 6. City ID Validation

The service requires:

```text
cityId
```

It must be:

```text
an integer
greater than 0
```

Invalid input throws:

```text
Invalid city ID.
```

---

# 7. City Lookup

The service queries:

```text
city
```

for:

```text
city_id
city_name
geo_boundary
city_table_name
```

The requested city is limited to:

```text
one row
```

If the city does not exist:

```text
City with id X not found.
```

is thrown.

---

# 8. City Table Validation

The city's stored:

```text
city_table_name
```

is validated using:

```text
validateTableName()
```

The service then checks whether the table exists.

If it does not exist:

```text
City table "..." does not exist.
```

is thrown.

---

# 9. Zone Retrieval

Zones are loaded from the selected city table.

The query retrieves:

```text
zone_id
zone_name
geo_boundary
zone_table_name
total_divisions
total_wards
created_at
```

Only rows where:

```text
zone_name IS NOT NULL
```

are considered.

Zones are ordered by:

```text
zone_id ASC
```

---

# 10. Zone Formatting

Each zone is transformed into:

```text
id
zoneName
geoBoundary
zoneTableName
totalDivisions
totalWards
createdAt
```

Numeric values are converted using:

```text
Number()
```

Missing division and ward counts default to:

```text
0
```

---

# 11. Empty Zone Names

Zones whose name is:

```text
null
undefined
empty string
whitespace
```

are filtered out.

---

# 12. City Map Result

The service returns:

```json
{
  "city": {
    "id": "...",
    "cityName": "...",
    "geoBoundary": "...",
    "cityTableName": "..."
  },
  "zones": [],
  "summary": {
    "totalZones": 0,
    "totalDivisions": 0,
    "totalWards": 0
  }
}
```

The city-map summary deliberately reports:

```text
totalDivisions = 0
totalWards = 0
```

because those levels are not loaded by this operation.

---

# 13. getZoneDivisions()

The method:

```text
getZoneDivisions(zoneTableName)
```

loads divisions from one specific zone table.

The exact stored:

```text
zoneTableName
```

is used.

The service does not generate a division table name from the division name.

---

# 14. Zone Table Validation

The supplied zone table name must exist.

If missing:

```text
Zone table name is required.
```

If the table does not exist:

```text
Zone table "..." does not exist.
```

---

# 15. Division Retrieval

The selected zone table is queried for:

```text
division_id
division_name
geo_boundary
division_table_name
```

Only divisions with non-empty names are included.

Results are ordered by:

```text
division_id ASC
```

---

# 16. Division Formatting

Each division contains:

```text
id
divisionName
geoBoundary
divisionTableName
wards
```

The:

```text
wards
```

array is initially empty.

---

# 17. Division Table Resolution

If:

```text
division_table_name
```

is present, it is validated and used as the exact table name.

The service then checks whether the division table exists.

---

# 18. Ward Loading During Zone Request

When the division table exists, wards are loaded from that division table.

The selected fields are:

```text
ward_id
ward_name
geo_boundary
ward_table_name
```

Only non-empty ward names are included.

Results are ordered by:

```text
ward_id ASC
```

---

# 19. Ward Deduplication

A:

```text
Set
```

is used to prevent duplicate wards.

The deduplication key is:

```text
ward_id
```

or, when unavailable:

```text
ward_name
```

---

# 20. Ward Formatting

Each ward contains:

```text
id
wardName
geoBoundary
wardTableName
```

The ward table name is validated when present.

---

# 21. Zone Divisions Result

The service returns:

```json
{
  "success": true,
  "zoneTableName": "...",
  "totalDivisions": 0,
  "totalWards": 0,
  "divisions": []
}
```

`totalWards` is calculated by summing:

```text
division.wards.length
```

across all divisions.

---

# 22. getDivisionWards()

The method:

```text
getDivisionWards(divisionTableName)
```

loads wards from exactly one division table.

---

# 23. Division Table Validation

The method requires:

```text
divisionTableName
```

If missing:

```text
Division table name is required.
```

If the table does not exist:

```text
Division table "..." does not exist.
```

---

# 24. Direct Ward Retrieval

The division table is queried for:

```text
ward_id
ward_name
geo_boundary
ward_table_name
```

Only non-empty ward names are returned.

Results are ordered by:

```text
ward_id ASC
```

---

# 25. Ward Deduplication

The same `Set`-based strategy is used to avoid duplicate wards.

The key is:

```text
ward_id
```

or:

```text
ward_name
```

when the ID is unavailable.

---

# 26. Division Wards Result

The method returns:

```json
{
  "success": true,
  "divisionTableName": "...",
  "totalWards": 0,
  "wards": []
}
```

---

# 27. Complete Service Architecture

```text
getCityMapData()
       ↓
City
       ↓
City Table
       ↓
Zones

getZoneDivisions()
       ↓
Zone Table
       ↓
Divisions
       ↓
Division Tables
       ↓
Wards

getDivisionWards()
       ↓
Division Table
       ↓
Wards
```

---

# 28. Progressive Loading Design

The service deliberately supports progressive map loading:

```text
Initial Request
      ↓
City + Zones
```

Then:

```text
Selected Zone
      ↓
Divisions + Wards
```

Or directly:

```text
Selected Division
      ↓
Wards
```

This avoids unnecessarily loading the complete hierarchy during the initial city-map request.

---

# 29. Exports

The service exports:

```text
getCityMapData
getZoneDivisions
getDivisionWards
```

---

# 30. Summary

`masterCitizenMap.service.js` is the geographic map service for the Master Citizen system. It validates dynamic table names, normalizes GeoJSON boundaries, retrieves city and zone data, loads divisions and their wards from the exact stored hierarchy tables, removes duplicate wards, and supports progressive City → Zone → Division → Ward loading.
