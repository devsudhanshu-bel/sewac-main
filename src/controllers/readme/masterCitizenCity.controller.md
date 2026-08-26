# masterCitizenCity.controller.js Documentation

## 1. File Overview

The Master Citizen City Controller manages city-level operations.

It delegates business logic to:

```text
masterCitizenCity.service
```

The available operations are:

```text
Create City
Get City
Get All Cities
```

---

# 2. createCity()

Reads from:

```text
req.body
```

the fields:

```text
cityName
geoBoundary
```

These are passed to:

```text
service.createCity()
```

---

# 3. Successful City Creation

A successful city creation returns:

```text
HTTP 201
```

with:

```json
{
  "success": true,
  "message": "City created successfully",
  "data": "..."
}
```

---

# 4. Create City Error

If city creation fails, the controller logs the error and returns:

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

The service error message is returned directly.

---

# 5. getCity()

Reads:

```text
req.params.cityId
```

and converts it using:

```text
Number()
```

---

# 6. City ID Validation

The city ID must be an integer.

If it is not:

```text
HTTP 400
```

is returned with:

```json
{
  "success": false,
  "message": "Invalid city ID"
}
```

---

# 7. City Retrieval

A valid ID is passed to:

```text
service.getCity(cityId)
```

A successful result returns:

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

# 8. City Not Found

If the service throws exactly:

```text
City not found
```

the controller returns:

```text
HTTP 404
```

Other service errors in this operation return:

```text
HTTP 400
```

---

# 9. getCities()

Calls:

```text
service.getCities()
```

to retrieve all cities.

The result is returned with:

```text
success
count
data
```

---

# 10. Get Cities Response

A successful request returns:

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

# 11. Get Cities Error

Unexpected errors return:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "Failed to fetch cities"
}
```

---

# 12. Controller Flow

Create:

```text
Request Body
    ↓
Extract cityName + geoBoundary
    ↓
service.createCity()
    ↓
HTTP 201
```

Get one:

```text
Route cityId
    ↓
Convert to Number
    ↓
Validate Integer
    ↓
service.getCity()
    ↓
HTTP 200 / 404 / 400
```

Get all:

```text
service.getCities()
    ↓
Count Results
    ↓
HTTP 200
```

---

# 13. Exports

The controller exports:

```text
createCity
getCity
getCities
```

---

# 14. Summary

`masterCitizenCity.controller.js` is the city-management HTTP controller for the Master Citizen module. It delegates city creation and retrieval to the service layer, validates city IDs before lookup, distinguishes the `City not found` condition with HTTP 404, returns city counts for collection requests, and provides structured success and error responses.
