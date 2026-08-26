# citizenHistoricalBoundary.repository.js Documentation

## 1. File Overview

**File:** `citizenHistoricalBoundary.repository.js`

The repository retrieves the complete geographic boundary hierarchy used for historical GPS resolution.

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

---

# 2. validateIdentifier()

Validates dynamic PostgreSQL identifiers before they are interpolated into SQL.

A valid identifier must:

```text
be a string
start with a letter
contain letters, numbers, or underscores
```

The validation pattern is:

```text
^[a-zA-Z][a-zA-Z0-9_]*$
```

Invalid identifiers throw an error.

---

# 3. getAllCities()

Retrieves all cities from:

```text
city_table
```

The selected fields are:

```text
city_id
city_name
geo_boundary
city_table_name
```

Results are ordered by:

```text
city_id ASC
```

---

# 4. getZonesForCity()

Receives:

```text
cityTableName
```

The city table is queried for:

```text
zone_id
zone_name
geo_boundary
zone_table_name
```

Results are ordered by:

```text
zone_id ASC
```

---

# 5. getDivisionsForZone()

Receives:

```text
zoneTableName
```

The zone table is queried for:

```text
division_id
division_name
geo_boundary
division_table_name
```

Results are ordered by:

```text
division_id ASC
```

---

# 6. getWardsForDivision()

Receives:

```text
divisionTableName
```

The division table is queried for:

```text
ward_id
ward_no
ward_name
geo_boundary
ward_table_name
```

Results are ordered by:

```text
ward_no ASC
```

---

# 7. getCompleteBoundaryHierarchy()

Builds the complete hierarchy in memory.

The processing starts with:

```text
Cities
```

For every city:

```text
Zones
```

are loaded.

For every zone:

```text
Divisions
```

are loaded.

For every division:

```text
Wards
```

are loaded.

---

# 8. City Hierarchy Entry

Each city entry contains:

```text
cityId
cityName
cityBoundary
cityTableName
zones
```

---

# 9. Zone Hierarchy Entry

Each zone entry contains:

```text
zoneId
zoneName
zoneBoundary
zoneTableName
divisions
```

---

# 10. Division Hierarchy Entry

Each division entry contains:

```text
divisionId
divisionName
divisionBoundary
divisionTableName
wards
```

---

# 11. Ward Hierarchy Entry

Each ward entry contains:

```text
wardId
wardNo
wardName
wardBoundary
wardTableName
```

---

# 12. Missing Table References

If a city, zone, or division does not contain its corresponding table name, the hierarchy entry is still retained.

Processing then continues without loading the missing child level.

---

# 13. Complete Boundary Flow

```text
getAllCities()
      ↓
For each City
      ↓
getZonesForCity()
      ↓
For each Zone
      ↓
getDivisionsForZone()
      ↓
For each Division
      ↓
getWardsForDivision()
      ↓
Complete In-Memory Hierarchy
```

---

# 14. Use Case

The complete hierarchy is intended to support in-memory GPS boundary resolution.

Instead of querying the database for every telemetry packet:

```text
Load boundaries once
       ↓
Keep hierarchy in memory
       ↓
Resolve many GPS points
```

---

# 15. Exports

The repository exports:

```text
validateIdentifier
getAllCities
getZonesForCity
getDivisionsForZone
getWardsForDivision
getCompleteBoundaryHierarchy
```

---

# 16. Summary

`citizenHistoricalBoundary.repository.js` provides the geographic boundary repository for the historical processing system. It retrieves city, zone, division, and ward boundaries and assembles them into a complete hierarchical in-memory structure suitable for resolving large numbers of telemetry GPS points.
