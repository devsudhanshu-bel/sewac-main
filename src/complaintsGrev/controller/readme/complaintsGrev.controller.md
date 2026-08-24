# complaintsGrev.controller.js Documentation

## 1. File Overview

**File:** `complaintsGrev.controller.js`  
**Location:** `src/complaintsGrev/controller/complaintsGrev.controller.js`

This controller provides the backend endpoint for the Complaint Grievance Map.

The module retrieves complaint locations that fall inside the Bengaluru city boundary.

---

# 2. Service Dependency

The controller imports:

```text
../service/complaintsGrev.service
```

The controller delegates all location/boundary processing to:

```text
complaintsGrevService.getComplaintLocations()
```

---

# 3. getComplaintLocations()

The controller calls:

```js
complaintsGrevService.getComplaintLocations()
```

The service result contains:

```text
locations
boundary
```

The controller normalizes the locations value:

```text
Array → locations
otherwise → []
```

and the boundary:

```text
result.boundary || null
```

---

# 4. Success Response

Returns HTTP:

```text
200
```

with:

```json
{
  "success": true,
  "count": 0,
  "boundary": {},
  "data": []
}
```

`data` contains only complaints that passed the service's Bengaluru boundary validation.

---

# 5. Error Response

Returns HTTP:

```text
500
```

with:

```json
{
  "success": false,
  "count": 0,
  "boundary": null,
  "data": [],
  "message": "Failed to fetch complaint locations",
  "error": "..."
}
```

---

# 6. Data Flow

```text
Frontend Map
     ↓
complaintsGrev.routes
     ↓
complaintsGrev.controller
     ↓
complaintsGrev.service
     ↓
Master Citizen DB + Complaint DB
     ↓
Boundary filtering
     ↓
Location response
```

---

# 7. Summary

`complaintsGrev.controller.js` is a thin HTTP controller for the Complaint Grievance Map. It calls the service, formats the response, logs errors, and returns the Bengaluru boundary together with valid complaint locations.
