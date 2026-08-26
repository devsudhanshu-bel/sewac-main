# masterCitizenMap.routes.js Documentation

## 1. File Overview

**File:** `masterCitizenMap.routes.js`

The router exposes the Master Citizen geographic map APIs.

The available hierarchy is:

```text
City
 ↓
Zones
 ↓
Divisions
 ↓
Wards
```

---

# 2. GET /map/city/:cityId

Calls:

```text
getCityMapDataController
```

The documented endpoint is:

```text
GET /api/master-citizen/map/city/:cityId
```

The route parameter is:

```text
cityId
```

This endpoint returns:

```text
City
└── Zones
```

It intentionally does not load divisions and wards in the initial city-map request.

---

# 3. GET /map/zone/:zoneTableName/divisions

Calls:

```text
getZoneDivisionsController
```

The documented endpoint is:

```text
GET /api/master-citizen/map/zone/:zoneTableName/divisions
```

The route parameter is:

```text
zoneTableName
```

The exact zone table identifies which zone's divisions are loaded.

---

# 4. GET /map/division/:divisionTableName/wards

Calls:

```text
getDivisionWardsController
```

The documented endpoint is:

```text
GET /api/master-citizen/map/division/:divisionTableName/wards
```

The route parameter is:

```text
divisionTableName
```

This returns wards belonging to the selected division table.

---

# 5. Route Summary

| Method | Endpoint | Controller | Purpose |
|---|---|---|---|
| GET | `/map/city/:cityId` | `getCityMapDataController` | Get city and zones |
| GET | `/map/zone/:zoneTableName/divisions` | `getZoneDivisionsController` | Get zone divisions and associated wards |
| GET | `/map/division/:divisionTableName/wards` | `getDivisionWardsController` | Get division wards |

---

# 6. Hierarchical Loading

The routes implement a progressively loaded hierarchy:

```text
City Request
     ↓
City + Zones
     ↓
Zone Request
     ↓
Selected Zone + Divisions
     ↓
Division Request
     ↓
Selected Division + Wards
```

This avoids loading the entire geographic hierarchy in the initial city request.

---

# 7. Authentication / Authorization

No authentication or permission middleware is attached directly to these routes in the provided route file.

---

# 8. Export

The router is exported as:

```text
router
```

---

# 9. Summary

`masterCitizenMap.routes.js` provides three GET endpoints for progressively loading the Master Citizen geographic hierarchy. The first endpoint loads a city and its zones, the second loads divisions for a selected zone, and the third loads wards for a selected division.
