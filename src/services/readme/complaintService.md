# complaintService.js Documentation

## 1. File Overview

**File:** `complaintService.js`  
**Location:** `src/services/complaintService.js`

This is the business-logic layer for the main Complaints API.

It handles:

```text
Complaint retrieval
Filtering/pagination
Complaint updates
KPI retrieval
OTP generation
OTP request
OTP verification
Status-transition rules
```

---

## 2. Dependencies

The service uses:

```text
crypto
CITIZEN_API
CITIZEN_INTERNAL_API_SECRET
complaintRepository
```

The OTP expiry duration is:

```text
5 minutes
```

---

# 3. generateOTP()

The internal helper uses:

```js
crypto.randomInt(100000, 1000000)
```

and converts the result to a string.

This generates a six-digit OTP.

The helper is not exported.

---

# 4. requestVerification()

## Preconditions

The following environment variables must exist:

```text
CITIZEN_API
CITIZEN_INTERNAL_API_SECRET
```

The complaint must exist.

The complaint status must be exactly:

```text
READY_FOR_VERIFICATION
```

The service blocks OTP requests for:

```text
PENDING
ASSIGNED
IN_PROGRESS
CLOSED
```

according to the implemented rule.

---

## OTP Creation

The service:

1. Generates a six-digit OTP.
2. Creates an expiry timestamp five minutes in the future.
3. Sends the OTP to the Citizen API.

The internal endpoint is:

```text
/api/internal/complaints/:ticketNumber/request-verification
```

The request contains:

```json
{
  "otp": "...",
  "expiresAt": "...",
  "adminId": "..."
}
```

The internal secret is sent using:

```text
X-Internal-Secret
```

---

## Security

The generated OTP is **not returned to the admin frontend**.

The service returns only:

```text
ticketNumber
expiresAt
status
```

---

# 5. verifyComplaintOTP()

The service sends the supplied OTP to the Citizen API:

```text
/api/internal/complaints/:ticketNumber/verify
```

Headers include:

```text
X-Internal-Secret
```

Body:

```json
{
  "otp": "...",
  "adminId": "..."
}
```

If the Citizen API reports failure, the service throws an error.

On success it returns:

```text
data.data
```

from the Citizen API response.

---

# 6. getComplaints()

Normalizes pagination:

```text
page >= 1
1 <= limit <= 100
```

Defaults:

```text
page = 1
limit = 10
```

It forwards:

```text
search
status
category
dateFrom
dateTo
```

to `complaintRepository.getComplaints()`.

The final response contains:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

---

# 7. getComplaintByTicket()

Requires:

```text
ticketNumber
```

It delegates to:

```js
complaintRepository.getComplaintByTicket()
```

and throws:

```text
Complaint not found.
```

when no record exists.

---

# 8. updateComplaint()

This method enforces the administrator's complaint workflow.

The intended workflow is:

```text
PENDING
   ↓
READY_FOR_VERIFICATION
   ↓
OTP_SENT
   ↓
CLOSED
```

The admin service itself only allows:

```text
PENDING → READY_FOR_VERIFICATION
```

or a no-op status update.

The service does not allow the admin to manually perform:

```text
READY_FOR_VERIFICATION → OTP_SENT
OTP_SENT → CLOSED
CLOSED → another status
```

Those transitions belong to the verification/system flow.

---

## Editable Fields

The service receives:

```text
status
assigned_to
remarks
```

However, the current controller only forwards:

```text
status
remarks
```

Therefore `assigned_to` is not currently reachable through the main controller endpoint.

---

## Empty Update Protection

If none of the supported update fields are supplied, the service throws:

```text
No complaint changes were provided.
```

---

## Closed Complaint Rule

If a complaint is already:

```text
CLOSED
```

its status cannot be changed.

The service still permits the other supported update data according to the current implementation.

---

## closed_at

The service intentionally does not allow the admin update flow to directly close a complaint.

`closed_at` remains controlled by the OTP verification flow.

---

# 9. getComplaintKPIs()

Delegates KPI calculation to:

```js
complaintRepository.getComplaintKPIs()
```

---

# 10. Error Propagation

The service throws errors instead of constructing HTTP responses.

The controller decides the final HTTP status and JSON response.

---

# 11. Architecture

```text
Controller
    ↓
Complaint Service
    ├── Complaint Repository
    │       ↓
    │   Database
    │
    └── Citizen Internal API
            ↓
       OTP Verification
```

---

# 12. Summary

`complaintService.js` is the main business-logic layer for complaint management. It combines repository-based complaint operations with the Citizen internal API for secure OTP-based complaint verification and closure.
