# masterCitizenMap.controller.js Documentation

## 1. File Overview

**File:** `masterCitizenMap.controller.js`

The controller handles HTTP requests for the Master Citizen geographic map APIs.

It provides:

```text
City Map
Zone → Divisions
Division → Wards
```

The controller delegates the actual database and map processing to:

```text
masterCitizenMap.service
```

---

# 2. getCityMapDataController()

Handles requests for:

```text
City Map Data
```

The city identifier is read from:

```text
req.params.cityId
```

The value is passed to:

```text
getCityMapData(cityId)
```

---

# 3. City Map Response

A successful request returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "city": "...",
  "summary": "...",
  "zones": "..."
}
```

The city response contains the city information, summary statistics, and zones.

The controller does not directly load divisions or wards.

---

# 4. City Map Error Handling

Errors are caught and returned using:

```text
error.status || 500
```

The response contains:

```json
{
  "success": false,
  "message": "..."
}
```

If the service does not provide an error message, the fallback is:

```text
Failed to fetch city map data.
```

---

# 5. getZoneDivisionsController()

Handles requests for:

```text
Zone Divisions
```

The zone table name is read from:

```text
req.params.zoneTableName
```

It is passed to:

```text
getZoneDivisions(zoneTableName)
```

---

# 6. Zone Divisions Response

A successful request returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "zoneTableName": "...",
  "totalDivisions": "...",
  "totalWards": "...",
  "divisions": "..."
}
```

The service may load the wards belonging to each division while building this response.

---

# 7. Zone Divisions Error Handling

Errors return:

```text
error.status || 500
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

The fallback message is:

```text
Failed to fetch zone divisions.
```

---

# 8. getDivisionWardsController()

Handles requests for:

```text
Division Wards
```

The division table name is read from:

```text
req.params.divisionTableName
```

It is passed to:

```text
getDivisionWards(divisionTableName)
```

---

# 9. Division Wards Response

A successful request returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "divisionTableName": "...",
  "totalWards": "...",
  "wards": "..."
}
```

---

# 10. Division Wards Error Handling

Errors return:

```text
error.status || 500
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

The fallback message is:

```text
Failed to fetch division wards.
```

---

# 11. Controller Flow

```text
Request
  ↓
Read route parameter
  ↓
Call masterCitizenMap service
  ↓
Receive data
  ↓
Build HTTP response
```

For errors:

```text
Service Error
     ↓
Controller catch
     ↓
HTTP error response
```

---

# 12. Exports

The controller exports:

```text
getCityMapDataController
getZoneDivisionsController
getDivisionWardsController
```

---

# 13. Summary

`masterCitizenMap.controller.js` is the HTTP controller layer for the Master Citizen map functionality. It accepts city, zone-table, and division-table route parameters, delegates processing to the map service, formats successful responses, and converts service errors into structured HTTP error responses.
