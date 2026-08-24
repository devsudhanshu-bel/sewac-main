# complaintRoutes.js Documentation

## 1. File Overview

**File:** `complaintRoutes.js`  
**Location:** `src/routes/complaintRoutes.js`

The main complaint router is mounted in `app.js` at:

```text
/api/complaints
```

It uses:

```text
authMiddleware
complaintController
```

---

# 2. GET /api/complaints

Calls:

```text
complaintController.getComplaints
```

Protected by:

```text
authMiddleware
```

Supported query parameters:

```text
page
limit
search
status
category
dateFrom
dateTo
```

---

# 3. GET /api/complaints/kpis

Calls:

```text
complaintController.getComplaintKPIs
```

Protected by:

```text
authMiddleware
```

This route must appear before:

```text
/:ticketNumber
```

so that `kpis` is not interpreted as a ticket number.

---

# 4. GET /api/complaints/:ticketNumber

Calls:

```text
getComplaintByTicket
```

Protected by authentication.

---

# 5. PATCH /api/complaints/:ticketNumber

Calls:

```text
updateComplaint
```

The current controller accepts only:

```text
status
remarks
```

from the request body.

---

# 6. POST /api/complaints/:ticketNumber/request-verification

Calls:

```text
requestVerification
```

The service only allows the OTP workflow when the complaint is:

```text
READY_FOR_VERIFICATION
```

---

# 7. POST /api/complaints/:ticketNumber/verify

Calls:

```text
verifyOTP
```

This endpoint receives a six-digit OTP and delegates verification to the complaint service.

---

# 8. Route Ordering

The router uses:

```text
/
/kpis
/:ticketNumber
```

The static `/kpis` route is placed before `/:ticketNumber`.

---

# 9. Complete Route Flow

```text
/api/complaints
       ↓
complaintRoutes
       ↓
authMiddleware
       ↓
complaintController
       ↓
complaintService
       ↓
complaintRepository / Citizen API
```

---

# 10. Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/complaints` | List/filter complaints |
| GET | `/api/complaints/kpis` | Complaint KPI counts |
| GET | `/api/complaints/:ticketNumber` | Single complaint |
| PATCH | `/api/complaints/:ticketNumber` | Update status/remarks |
| POST | `/api/complaints/:ticketNumber/request-verification` | Request OTP |
| POST | `/api/complaints/:ticketNumber/verify` | Verify OTP |

---

# 11. Summary

`complaintRoutes.js` is the main REST routing layer for complaint listing, KPI retrieval, complaint details, updates, OTP requests, and OTP verification.
