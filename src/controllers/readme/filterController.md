# filterController.js Documentation

## 1. File Overview

The Filter Controller provides hierarchical geographic filter data using Prisma.

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

It uses a Prisma client generated for the zone database.

---

# 2. getCities()

Retrieves all cities from:

```text
city_table
```

Selected fields:

```text
city_id
city_name
```

The result is returned directly using:

```text
res.json(cities)
```

---

# 3. getZones()

Reads:

```text
req.params.cityId
```

and converts it to a number.

It queries:

```text
zone_table
```

with:

```text
city_id = Number(cityId)
```

Selected fields:

```text
zone_id
zone_name
```

---

# 4. getDivisions()

Reads:

```text
req.params.zoneId
```

and converts it to a number.

It queries:

```text
division_table
```

with:

```text
zone_id = Number(zoneId)
```

Selected fields:

```text
division_id
division_name
```

---

# 5. getWards()

Reads:

```text
req.params.divisionId
```

and converts it to a number.

It queries:

```text
ward_table
```

with:

```text
division_id = Number(divisionId)
```

Selected fields:

```text
ward_id
ward_no
ward_name
```

---

# 6. Hierarchical Flow

```text
getCities()
    ↓
getZones(cityId)
    ↓
getDivisions(zoneId)
    ↓
getWards(divisionId)
```

Each level uses the identifier from its parent level.

---

# 7. Response Format

The controller returns Prisma query results directly.

No additional:

```text
success
count
message
```

wrapper is added by this controller.

---

# 8. Exports

The controller exports:

```text
getCities
getZones
getDivisions
getWards
```

---

# 9. Summary

`filterController.js` provides the geographic filtering hierarchy for cities, zones, divisions, and wards. Each function performs a focused Prisma query and returns only the identifiers and names required for the corresponding filter level.
