# logsController.js Documentation

## 1. File Overview

The Logs Controller provides APIs for:

```text
Logs Summary
Audit Logs
Edit Logs
```

It uses two Prisma connections:

```text
cmadsPrisma
prisma
```

The logs are sourced from:

```text
CMADS audit_logs
SEWAC edit_logs
```

---

# 2. getLogsSummary()

Counts:

```text
cmadsPrisma.audit_logs
```

and:

```text
prisma.edit_logs
```

The response contains:

```text
totalLogs
auditLogs
editLogs
```

`totalLogs` is:

```text
auditLogs + editLogs
```

---

# 3. Logs Summary Response

Successful requests return:

```text
HTTP 200
```

with:

```json
{
  "totalLogs": 0,
  "auditLogs": 0,
  "editLogs": 0
}
```

---

# 4. Logs Summary Error

Unexpected errors return:

```text
HTTP 500
```

with:

```json
{
  "error": "Failed to fetch logs summary"
}
```

---

# 5. getAuditLogs()

Retrieves all records from:

```text
cmadsPrisma.audit_logs
```

ordered by:

```text
created_at DESC
```

Therefore newest audit records are returned first.

---

# 6. Audit Log Formatting

Each audit record is transformed into:

```text
id
time
user
event
description
ipAddress
```

The user field is:

```text
Admin #<admin_id>
```

when `admin_id` exists.

Otherwise:

```text
System
```

is used.

---

# 7. Audit Logs Response

Successful requests return:

```text
HTTP 200
```

with the formatted audit-log array.

---

# 8. Audit Logs Error

Unexpected errors return:

```text
HTTP 500
```

with:

```json
{
  "error": "Failed to fetch audit logs"
}
```

---

# 9. getEditLogs()

Retrieves all records from:

```text
prisma.edit_logs
```

ordered by:

```text
created_at DESC
```

---

# 10. Edit Log Formatting

Each record is transformed into:

```text
id
time
user
role
module
action
recordId
description
ipAddress
```

The fields are mapped from the corresponding edit-log columns.

---

# 11. Edit Logs Response

Successful requests return:

```text
HTTP 200
```

with the formatted edit-log array.

---

# 12. Edit Logs Error

Unexpected errors return:

```text
HTTP 500
```

with:

```json
{
  "error": "Failed to fetch edit logs"
}
```

---

# 13. Complete Flow

```text
Logs Summary
   ↓
Count CMADS audit_logs
   +
Count SEWAC edit_logs
   ↓
Return Combined Summary
```

Audit logs:

```text
Query audit_logs
      ↓
Newest First
      ↓
Format Fields
      ↓
Return Array
```

Edit logs:

```text
Query edit_logs
      ↓
Newest First
      ↓
Format Fields
      ↓
Return Array
```

---

# 14. Summary

`logsController.js` aggregates and exposes system logging information from the CMADS audit log database and SEWAC edit-log database. It provides a combined count summary and separate formatted audit/edit log responses, with newest records returned first.
