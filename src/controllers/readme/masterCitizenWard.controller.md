# masterCitizenWard.controller.js Documentation

## 1. File Overview

The Master Citizen Ward Controller manages ward-level CRUD operations.

It delegates business logic to:

```text
masterCitizenWard.service
```

The available operations are:

```text
Create Ward
Get All Wards
Get One Ward
Update Ward
Delete Ward
```

---

# 2. createWard()

Reads hierarchy identifiers:

```text
cityId
zoneId
divisionId
```

from route parameters.

The request body provides:

```text
wardNo
wardName
geoBoundary
```

`wardNo` is converted to a number before being passed to the service.

---

# 3. Successful Ward Creation

Returns:

```text
HTTP 201
```

with:

```json
{
  "success": true,
  "message": "Ward created successfully",
  "data": "..."
}
```

---

# 4. createWard() Error Handling

Errors are logged and return:

```text
HTTP 400
```

with the service error message.

---

# 5. getWards()

Reads:

```text
cityId
zoneId
divisionId
```

and calls:

```text
service.getWards()
```

---

# 6. Get All Wards Response

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

---

# 7. getWard()

The single-ward lookup uses:

```text
cityId
zoneId
divisionId
wardNo
```

The route uses:

```text
wardNo
```

rather than:

```text
wardId
```

---

# 8. Ward Number Validation

The controller validates that:

```text
cityId
zoneId
divisionId
wardNo
```

are all integers.

Invalid identifiers return:

```text
HTTP 400
```

with:

```text
Invalid city ID, zone ID, division ID or ward number
```

---

# 9. Get One Ward Response

A successful lookup returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "Ward fetched successfully",
  "data": "..."
}
```

If:

```text
Ward not found
```

is thrown, the response is:

```text
HTTP 404
```

Other errors return:

```text
HTTP 400
```

---

# 10. updateWard()

The update operation uses the internal:

```text
wardId
```

from the route.

It also reads:

```text
cityId
zoneId
divisionId
```

The request body may contain:

```text
wardNo
wardName
geoBoundary
```

---

# 11. Optional Ward Number Update

If:

```text
wardNo !== undefined
```

the controller converts it using:

```text
Number(wardNo)
```

Otherwise:

```text
wardNo
```

is passed as:

```text
undefined
```

allowing the service to handle the update semantics.

---

# 12. Update Response

Successful updates return:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "Ward updated successfully",
  "data": "..."
}
```

A missing ward returns:

```text
HTTP 404
```

Other errors return:

```text
HTTP 400
```

---

# 13. deleteWard()

Deletion uses:

```text
wardId
```

along with:

```text
cityId
zoneId
divisionId
```

The operation is delegated to:

```text
service.deleteWard()
```

---

# 14. Delete Response

Successful deletion returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "Ward deleted successfully",
  "data": "..."
}
```

A missing ward returns:

```text
HTTP 404
```

Other errors return:

```text
HTTP 400
```

---

# 15. Identifier Strategy

The controller intentionally uses two different ward identifiers:

```text
wardNo
```

for the public single-ward lookup.

And:

```text
wardId
```

for update/delete operations.

This distinction is explicitly maintained in the controller.

---

# 16. Controller Flow

```text
Create
  ↓
Hierarchy IDs + Ward Data
  ↓
Service
  ↓
HTTP 201
```

```text
Get All
  ↓
Hierarchy IDs
  ↓
Service
  ↓
HTTP 200
```

```text
Get One
  ↓
Hierarchy IDs + wardNo
  ↓
Validate
  ↓
Service
  ↓
HTTP 200 / 404 / 400
```

```text
Update / Delete
  ↓
Hierarchy IDs + wardId
  ↓
Service
  ↓
HTTP 200 / 404 / 400
```

---

# 17. Exports

The controller exports:

```text
createWard
getWards
getWard
updateWard
deleteWard
```

---

# 18. Summary

`masterCitizenWard.controller.js` is the ward-level controller for the Master Citizen hierarchy. It manages ward creation, retrieval, update, and deletion, validates the public ward-number lookup parameters, preserves the distinction between `wardNo` and internal `wardId`, delegates all business logic to the ward service, and standardizes success and error responses.
