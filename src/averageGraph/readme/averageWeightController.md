# averageWeightController.js Documentation

## 1. File Overview

The Average Weight Controller exposes the average-weight graph endpoint.

It delegates the calculation to:

```text
averageWeightService
```

---

# 2. getAverageWeightGraph()

The controller reads:

```text
req.query.date
```

and passes it to:

```text
averageWeightService.getAverageWeightGraph()
```

---

# 3. Service Request

The service receives:

```json
{
  "date": "..."
}
```

---

# 4. Successful Response

A successful operation returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "...",
  "data": []
}
```

The controller spreads the service result into the response.

---

# 5. Error Handling

Errors are logged as:

```text
Average weight graph error:
```

and return:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "...",
  "data": []
}
```

The service error message is returned when available.

---

# 6. Export

The controller exports:

```text
getAverageWeightGraph
```

---

# 7. Request Flow

```text
HTTP Request
     ↓
Read req.query.date
     ↓
averageWeightService
     ↓
Average Weight Data
     ↓
HTTP 200
```

Errors:

```text
Service Error
     ↓
Log Error
     ↓
HTTP 500
```

---

# 8. Summary

`averageWeightController.js` is the HTTP controller for the average-weight graph. It extracts the requested date, delegates all calculation logic to `averageWeightService`, returns the resulting graph data on success, and provides a standardized error response on failure.
