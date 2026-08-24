# complaintController.js Documentation

## 1. File Overview

**File:** `complaintController.js`  
**Location:** `src/controllers/complaintController.js`

This controller handles HTTP requests for the main Complaints module.

It delegates business logic to:

```text
src/services/complaintService.js
```

---

## 2. Exported Functions

The controller exports:

```text
requestVerification
verifyOTP
getComplaints
getComplaintByTicket
updateComplaint
getComplaintKPIs
```

---

# 3. requestVerification()

### Input

```text
req.params.ticketNumber
req.user.adminId
```

The ticket number is required.

The controller calls:

```js
complaintService.requestVerification(
  ticketNumber,
  adminId
)
```

### Success

Returns HTTP `200`:

```json
{
  "success": true,
  "message": "Verification OTP sent to the citizen.",
  "data": {}
}
```

### Error

Uses:

```text
error.statusCode || 400
```

and returns:

```json
{
  "success": false,
  "message": "..."
}
```

---

# 4. verifyOTP()

Reads:

```text
ticketNumber
otp
```

The OTP must match:

```regex
^\d{6}$
```

Therefore exactly six digits are required.

The service receives:

```text
ticketNumber
OTP
req.user.id
```

On success:

```http
200 OK
```

and the message indicates that the complaint was closed successfully.

---

# 5. getComplaints()

Reads:

```text
page
limit
search
status
category
dateFrom
dateTo
```

Defaults:

```text
page = 1
limit = 10
search = ""
```

The values are passed to:

```js
complaintService.getComplaints()
```

Successful response:

```json
{
  "success": true,
  "message": "Complaints fetched successfully.",
  "data": {}
}
```

Errors return HTTP `500`.

---

# 6. getComplaintByTicket()

Reads:

```text
req.params.ticketNumber
```

If missing, returns:

```text
400
```

Otherwise calls:

```js
complaintService.getComplaintByTicket(ticketNumber)
```

A successful request returns HTTP `200`.

Not-found/service errors currently return HTTP `404`.

---

# 7. updateComplaint()

Reads:

```text
ticketNumber
status
remarks
```

The controller explicitly whitelists only:

```text
status
remarks
```

This is important because sensitive fields such as:

```text
otp_hash
verification_code
phone_number
ticket_number
```

are not forwarded from the request body.

The service is called with the resulting update object.

---

# 8. getComplaintKPIs()

Calls:

```js
complaintService.getComplaintKPIs()
```

No query parameters are required.

Returns:

```json
{
  "success": true,
  "message": "Complaint KPIs fetched successfully.",
  "data": {}
}
```

---

# 9. Error Handling

The controller logs errors using:

```js
console.error()
```

and returns structured JSON responses.

Status codes used by the current implementation include:

```text
200
201 not used here
400
404
500
```

---

# 10. Architecture

```text
Frontend
   ↓
complaintRoutes.js
   ↓
complaintController.js
   ↓
complaintService.js
   ↓
complaintRepository.js
   ↓
citizen_complaints
```

For OTP operations, the service additionally communicates with the Citizen API.

---

# 11. Summary

`complaintController.js` is responsible for HTTP-level validation, parameter extraction, calling the complaint service, and returning API responses. Business rules and database operations remain outside the controller.
