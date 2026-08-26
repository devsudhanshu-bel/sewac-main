# wasteGeneratorController.js Documentation

## 1. File Overview

The Waste Generator Controller provides APIs for waste-generator management, summaries, directories, trends, and telemetry maps.

It delegates business logic to:

```text
wasteGeneratorService
```

The controller also initializes Prisma clients for:

```text
Helper Database
SEWAC Database
```

---

# 2. getAllWasteGenerators()

Reads geographic and date filters:

```text
cityId
zoneId
divisionId
wardId
date
```

It passes the complete query object to:

```text
wasteGeneratorService.getAllWasteGenerators()
```

---

# 3. All Waste Generators Response

Successful requests return:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "data": "..."
}
```

Errors return:

```text
HTTP 500
```

---

# 4. getWasteGeneratorByPhone()

Reads:

```text
req.params.phoneNumber
```

and passes it to:

```text
wasteGeneratorService.getWasteGeneratorByPhone()
```

A successful lookup returns:

```text
HTTP 200
```

---

# 5. Waste Generator Not Found / Lookup Error

The controller returns:

```text
HTTP 404
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

---

# 6. getSummary()

Accepts:

```text
date
cityId
zoneId
divisionId
wardId
```

and passes them to:

```text
wasteGeneratorService.getSummary()
```

The result is returned with:

```text
HTTP 200
```

---

# 7. getDirectory()

Supports directory parameters:

```text
page
limit
cityId
zoneId
divisionId
wardId
search
date
```

Defaults are:

```text
page = 1
limit = 10
```

The controller passes these values to:

```text
wasteGeneratorService.getAllWasteGenerators()
```

---

# 8. Directory Response

Successful directory requests return:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "data": "..."
}
```

---

# 9. createWasteGenerator()

Passes:

```text
req.body
```

and:

```text
req
```

to:

```text
wasteGeneratorService.createWasteGenerator()
```

---

# 10. Create Response

Successful creation returns:

```text
HTTP 201
```

with:

```json
{
  "success": true,
  "data": "..."
}
```

Creation errors return:

```text
HTTP 400
```

---

# 11. updateWasteGenerator()

Reads:

```text
req.params.phoneNumber
```

and passes:

```text
phoneNumber
req.body
req
```

to:

```text
wasteGeneratorService.updateWasteGenerator()
```

Successful updates return:

```text
HTTP 200
```

Errors return:

```text
HTTP 400
```

---

# 12. deleteWasteGenerator()

Uses:

```text
req.params.phoneNumber
```

and delegates to:

```text
wasteGeneratorService.deleteWasteGenerator()
```

Successful deletion returns:

```text
HTTP 200
```

Errors return:

```text
HTTP 400
```

---

# 13. getGVPTrend()

Accepts:

```text
date
cityId
zoneId
divisionId
wardId
```

and calls:

```text
wasteGeneratorService.getGVPTrend()
```

The result is returned with:

```text
HTTP 200
```

---

# 14. GVP Trend Error Handling

Unexpected errors return:

```text
HTTP 500
```

with the underlying error message.

---

# 15. getMap()

Provides the waste-generator telemetry map.

Required query parameters are:

```text
date
cityId
zoneId
divisionId
wardId
```

---

# 16. Map Parameter Validation

If any required map parameter is missing, the controller returns:

```text
HTTP 400
```

with:

```text
date, cityId, zoneId, divisionId and wardId are required
```

The service is not called when validation fails.

---

# 17. Map Service Call

Valid map requests call:

```text
wasteGeneratorService.getWasteGeneratorMap()
```

with:

```text
date
cityId
zoneId
divisionId
wardId
```

---

# 18. Map Response

Successful requests return:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "data": "..."
}
```

Unexpected errors return:

```text
HTTP 500
```

---

# 19. Complete Flow

```text
Waste Generator Request
       ↓
Read Query / Params / Body
       ↓
Validate where required
       ↓
wasteGeneratorService
       ↓
Return Data
```

Map:

```text
Date + City + Zone + Division + Ward
       ↓
Validate all required values
       ↓
getWasteGeneratorMap()
       ↓
Map Data
```

---

# 20. Exports

The controller exports:

```text
getAllWasteGenerators
getWasteGeneratorByPhone
getSummary
getDirectory
createWasteGenerator
updateWasteGenerator
deleteWasteGenerator
getGVPTrend
getMap
```

---

# 21. Summary

`wasteGeneratorController.js` is the HTTP controller for waste-generator data. It supports filtered waste-generator retrieval, individual phone-based lookup, summaries, paginated/searchable directory access, create/update/delete operations, GVP generation trends, and telemetry map data while delegating business logic to `wasteGeneratorService`.
