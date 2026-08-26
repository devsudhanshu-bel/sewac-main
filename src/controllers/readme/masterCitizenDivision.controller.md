# masterCitizenDivision.controller.js Documentation

## 1. File Overview

The Master Citizen Division Controller manages division-level CRUD operations.

It delegates business logic to:

```text
masterCitizenDivision.service
```

The available operations are:

```text
Create Division
Get All Divisions
Get One Division
Update Division
Delete Division
```

---

# 2. createDivision()

Reads:

```text
cityId
zoneId
```

from route parameters.

The request body provides:

```text
divisionName
geoBoundary
```

These values are passed to:

```text
service.createDivision()
```

---

# 3. Successful Division Creation

A successful creation returns:

```text
HTTP 201
```

with:

```json
{
  "success": true,
  "message": "Division created successfully",
  "data": "..."
}
```

---

# 4. createDivision() Error Handling

Errors are logged and returned as:

```text
HTTP 400
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

---

# 5. getDivisions()

Reads:

```text
cityId
zoneId
```

from route parameters.

Calls:

```text
service.getDivisions(cityId, zoneId)
```

---

# 6. Get All Divisions Response

Successful requests return:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

The count is:

```text
divisions.length
```

---

# 7. getDivision()

Reads:

```text
cityId
zoneId
divisionId
```

and passes them to:

```text
service.getDivision()
```

---

# 8. Get One Division Response

A successful request returns:

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

If the service throws:

```text
Division not found
```

the controller returns:

```text
HTTP 404
```

Other errors return:

```text
HTTP 400
```

---

# 9. updateDivision()

Reads:

```text
cityId
zoneId
divisionId
```

and accepts:

```text
divisionName
geoBoundary
```

from the request body.

The update is delegated to:

```text
service.updateDivision()
```

---

# 10. Update Response

Successful updates return:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "Division updated successfully",
  "data": "..."
}
```

`Division not found` returns:

```text
HTTP 404
```

Other errors return:

```text
HTTP 400
```

---

# 11. deleteDivision()

Reads:

```text
cityId
zoneId
divisionId
```

and calls:

```text
service.deleteDivision()
```

---

# 12. Delete Response

Successful deletion returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "Division deleted successfully",
  "data": "..."
}
```

A missing division returns:

```text
HTTP 404
```

Other errors return:

```text
HTTP 400
```

---

# 13. Controller Flow

```text
Create
  ↓
Read cityId + zoneId + body
  ↓
Service
  ↓
HTTP 201
```

```text
Read
  ↓
Read hierarchy identifiers
  ↓
Service
  ↓
HTTP 200 / 404 / 400
```

```text
Update
  ↓
Read identifiers + body
  ↓
Service
  ↓
HTTP 200 / 404 / 400
```

```text
Delete
  ↓
Read identifiers
  ↓
Service
  ↓
HTTP 200 / 404 / 400
```

---

# 14. Exports

The controller exports:

```text
createDivision
getDivisions
getDivision
updateDivision
deleteDivision
```

---

# 15. Summary

`masterCitizenDivision.controller.js` is the HTTP controller for division management within the Master Citizen hierarchy. It delegates all database/business operations to the division service and standardizes create, read, update, and delete responses while distinguishing missing divisions with HTTP 404.
