# masterCitizenZone.controller.js Documentation

## 1. File Overview

The Master Citizen Zone Controller manages zone-level CRUD operations.

It delegates business logic to:

```text
masterCitizenZone.service
```

The available operations are:

```text
Create Zone
Get All Zones
Get One Zone
Update Zone
Delete Zone
```

---

# 2. createZone()

Reads:

```text
cityId
```

from the route.

The request body provides:

```text
zoneName
geoBoundary
```

These are passed to:

```text
service.createZone()
```

---

# 3. Successful Zone Creation

Returns:

```text
HTTP 201
```

with:

```json
{
  "success": true,
  "message": "Zone created successfully",
  "data": "..."
}
```

---

# 4. createZone() Error Handling

Errors are logged and returned as:

```text
HTTP 400
```

with the service-provided error message.

---

# 5. getZones()

Reads:

```text
cityId
```

and calls:

```text
service.getZones(cityId)
```

---

# 6. Get All Zones Response

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
zones.length
```

---

# 7. getZone()

Reads:

```text
cityId
zoneId
```

and calls:

```text
service.getZone(cityId, zoneId)
```

---

# 8. Get One Zone Response

A successful lookup returns:

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

If:

```text
Zone not found
```

is thrown, the controller returns:

```text
HTTP 404
```

Other errors return:

```text
HTTP 400
```

---

# 9. updateZone()

Reads:

```text
cityId
zoneId
```

and accepts:

```text
zoneName
geoBoundary
```

from the request body.

The operation is delegated to:

```text
service.updateZone()
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
  "message": "Zone updated successfully",
  "data": "..."
}
```

A missing zone returns:

```text
HTTP 404
```

Other errors return:

```text
HTTP 400
```

---

# 11. deleteZone()

Reads:

```text
cityId
zoneId
```

and calls:

```text
service.deleteZone()
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
  "message": "Zone deleted successfully",
  "data": "..."
}
```

A missing zone returns:

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
cityId + Zone Data
  ↓
Service
  ↓
HTTP 201
```

```text
Get All
  ↓
cityId
  ↓
Service
  ↓
HTTP 200
```

```text
Get One
  ↓
cityId + zoneId
  ↓
Service
  ↓
HTTP 200 / 404 / 400
```

```text
Update
  ↓
cityId + zoneId + Zone Data
  ↓
Service
  ↓
HTTP 200 / 404 / 400
```

```text
Delete
  ↓
cityId + zoneId
  ↓
Service
  ↓
HTTP 200 / 404 / 400
```

---

# 14. Exports

The controller exports:

```text
createZone
getZones
getZone
updateZone
deleteZone
```

---

# 15. Summary

`masterCitizenZone.controller.js` is the zone-level HTTP controller for the Master Citizen geographic hierarchy. It delegates zone creation, retrieval, update, and deletion to the service layer, formats collection responses with counts, and distinguishes missing zones with HTTP 404 while returning HTTP 400 for other service errors.
