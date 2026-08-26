# citizenController.js Documentation

## 1. File Overview

The Citizen Controller provides HTTP endpoints for citizen lookup and retrieval.

It delegates database/business logic to:

```text
citizenService
```

The available operations are:

```text
Citizen Search
Get All Citizens
```

---

# 2. searchCitizen()

The method:

```text
searchCitizen(req, res)
```

searches for citizens using a query parameter.

The query is read from:

```text
req.query.query
```

---

# 3. Search Query Validation

If:

```text
query
```

is missing or falsy, the controller returns:

```text
HTTP 400
```

with:

```json
{
  "success": false,
  "message": "Search query is required"
}
```

The citizen service is not called when validation fails.

---

# 4. Citizen Search Service Call

For a valid query, the controller calls:

```text
citizenService.searchCitizen(query)
```

The returned citizens are stored in:

```text
citizens
```

---

# 5. Citizen Search Response

A successful search returns:

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

The count is calculated using:

```text
citizens.length
```

---

# 6. Search Error Handling

Unexpected errors are logged and return:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

The underlying error is not returned to the client.

---

# 7. getAllCitizens()

The method:

```text
getAllCitizens(req, res)
```

retrieves the complete citizen collection through:

```text
citizenService.getAllCitizens()
```

---

# 8. Get All Citizens Response

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

The count is:

```text
citizens.length
```

---

# 9. Get All Citizens Error Handling

If the service throws an error, the controller logs the error and returns:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

# 10. Controller Flow

### Search

```text
Request
  ↓
Read req.query.query
  ↓
Validate query
  ↓
citizenService.searchCitizen()
  ↓
Return count + data
```

### Get All

```text
Request
  ↓
citizenService.getAllCitizens()
  ↓
Return count + data
```

---

# 11. Exports

The controller exports:

```text
searchCitizen
getAllCitizens
```

---

# 12. Summary

`citizenController.js` is the HTTP controller layer for citizen retrieval. It validates search input, delegates citizen search and full-citizen retrieval to `citizenService`, returns standardized success responses containing counts and data, and handles service failures with HTTP 500 responses.
