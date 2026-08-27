# alertService.js Documentation

## 1. File Overview

The Alert Service creates security alerts in the database and sends a corresponding security-alert email.

It integrates:

```text
PostgreSQL
Email Service
```

---

# 2. createAlert()

The service accepts:

```text
adminId
layer
severity
type
description
ipAddress
```

---

# 3. Database Insert

A new record is inserted into:

```text
security_alerts
```

The stored fields are:

```text
admin_id
alert_layer
severity
alert_type
description
ip_address
```

The values are supplied to PostgreSQL through parameterized query placeholders:

```text
$1
$2
$3
$4
$5
$6
```

---

# 4. Security Alert Email

After the database insertion succeeds, the service calls:

```text
sendSecurityAlert()
```

with:

```text
layer
severity
type
description
ipAddress
```

The email service is therefore responsible for delivering the alert notification.

---

# 5. Execution Flow

```text
createAlert()
      ↓
Insert into security_alerts
      ↓
Database Insert Successful
      ↓
sendSecurityAlert()
      ↓
Security Alert Email
```

---

# 6. Error Behavior

The service itself does not contain a `try/catch` block.

Therefore database or email errors propagate to the caller.

---

# 7. Export

The module exports:

```text
createAlert
```

---

# 8. Summary

`alertService.js` provides the security-alert creation layer. It persists alert information in `security_alerts` and, after successful persistence, sends the corresponding security notification through the email service.
