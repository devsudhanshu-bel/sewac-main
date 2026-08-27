# auditService.js Documentation

## 1. File Overview

The Audit Service records administrator security and application events in the database.

It uses:

```text
PostgreSQL
```

through the shared database pool.

---

# 2. logEvent()

The service accepts:

```text
adminId
eventType
description
ipAddress
```

---

# 3. Audit Log Insert

The event is inserted into:

```text
audit_logs
```

The stored fields are:

```text
admin_id
event_type
event_description
ip_address
```

The query uses parameterized values:

```text
$1
$2
$3
$4
```

---

# 4. Error Handling

The database operation is wrapped in:

```text
try/catch
```

If an error occurs, the service logs:

```text
Audit Error:
```

---

# 5. Failure Isolation

Audit failures are not rethrown.

Therefore an audit-log database failure does not directly propagate to the caller.

This allows the primary application operation to continue even if audit logging fails.

---

# 6. Execution Flow

```text
logEvent()
     ↓
INSERT INTO audit_logs
     ↓
Success
     └── Return normally

Failure
     ↓
Catch Error
     ↓
Log Audit Error
     ↓
Do Not Rethrow
```

---

# 7. Export

The module exports:

```text
logEvent
```

---

# 8. Summary

`auditService.js` provides centralized audit-event persistence. It inserts administrator/application event information into `audit_logs` and intentionally isolates audit failures by logging errors without rethrowing them.
