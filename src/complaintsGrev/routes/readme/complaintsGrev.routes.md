# complaintsGrev.routes.js Documentation

## 1. File Overview

**File:** `complaintsGrev.routes.js`  
**Location:** `src/complaintsGrev/routes/complaintsGrev.routes.js`

This router defines the Complaint Grievance Map endpoint.

In `app.js`, the router is mounted for:

```text
/api/complaints-grev
```

---

# 2. GET /api/complaints-grev/locations

The router defines:

```text
GET /locations
```

which becomes:

```text
GET /api/complaints-grev/locations
```

It calls:

```text
getComplaintLocations
```

from:

```text
complaintsGrev.controller.js
```

---

# 3. Purpose

The endpoint supplies the frontend Complaint Grievance Map with:

```text
Bengaluru boundary
Complaint coordinates
Complaint metadata
```

Only complaints that the service determines to be inside Bengaluru are returned in `data`.

---

# 4. Response Structure

The documented/current controller response is:

```json
{
  "success": true,
  "count": 0,
  "boundary": {},
  "data": []
}
```

Each location object contains:

```text
lat
long
data
```

The nested complaint data includes fields such as:

```text
id
ticket_number
phone_number
title
description
category
image_url
address
status
```

---

# 5. Route Flow

```text
GET /api/complaints-grev/locations
              ↓
complaintsGrev.routes.js
              ↓
complaintsGrev.controller.js
              ↓
complaintsGrev.service.js
```

---

# 6. Summary

`complaintsGrev.routes.js` provides the dedicated map-data endpoint for complaint grievance locations.
