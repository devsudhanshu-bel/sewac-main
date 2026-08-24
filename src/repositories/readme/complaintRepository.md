# complaintRepository.js Documentation

## 1. File Overview

**File:** `complaintRepository.js`  
**Location:** `src/repositories/complaintRepository.js`

The complaint repository is the database-access layer for the main Complaints module.

It uses:

```js
const { PrismaClient } = require("../generated/sewac");
```

and works with:

```text
citizen_complaints
```

---

# 2. getComplaints()

Retrieves complaint records using pagination and optional filters.

### Pagination

```js
skip = (page - 1) * limit
```

and Prisma uses:

```text
skip
take
```

---

## Status Filter

When provided:

```text
where.status = status
```

---

## Category Filter

When provided:

```text
where.category = category
```

---

## Date Filter

When either date is provided, the repository builds a range on:

```text
created_at
```

`dateFrom` becomes:

```text
00:00:00.000 UTC
```

and `dateTo` becomes:

```text
23:59:59.999 UTC
```

---

## Search Filter

Search is applied across:

```text
ticket_number
phone_number
title
address
```

using case-insensitive `contains`.

---

## Parallel Queries

The repository runs:

```text
findMany()
count()
```

in parallel using:

```js
Promise.all()
```

The returned structure is:

```json
{
  "items": [],
  "total": 0
}
```

---

# 3. getComplaintByTicket()

Uses:

```js
prisma.citizen_complaints.findUnique()
```

with:

```text
ticket_number
```

as the unique lookup field.

---

# 4. updateComplaint()

Updates a complaint using its:

```text
ticket_number
```

The repository currently writes:

```text
status
remarks
closed_at
updated_at
```

when those values are provided.

`updated_at` is always refreshed:

```js
updated_at: new Date()
```

---

## Important Implementation Detail

Although the function comment mentions:

```text
assigned_to
```

the actual `data` object in the current implementation does not write `assigned_to`.

Therefore the current repository implementation persists:

```text
status
remarks
closed_at
updated_at
```

only.

---

# 5. getComplaintKPIs()

Runs five complaint counts in parallel:

```text
Total
PENDING
READY_FOR_VERIFICATION
OTP_SENT
CLOSED
```

The returned object is:

```json
{
  "total": 0,
  "pending": 0,
  "readyForVerification": 0,
  "otpSent": 0,
  "closed": 0
}
```

---

# 6. Database Flow

```text
Complaint Service
       ↓
complaintRepository
       ↓
PrismaClient
       ↓
citizen_complaints
```

---

# 7. Summary

`complaintRepository.js` isolates database operations from complaint business logic. It provides paginated/filterable complaint retrieval, single-ticket lookup, controlled updates, and KPI aggregation.
