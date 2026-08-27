# threatDetectionService.js Documentation

## 1. File Overview

The Threat Detection Service monitors failed login attempts and creates security alerts when configured thresholds are reached.

It integrates:

```text
PostgreSQL
Alert Service
```

---

# 2. checkFailedLoginThreshold()

The function accepts:

```text
email
adminId
ipAddress
```

The current implementation uses:

```text
adminId
ipAddress
```

when creating a security alert.

The `email` parameter is accepted but is not included in the current database query.

---

# 3. Failed Login Query

The service queries:

```text
audit_logs
```

and counts events where:

```text
event_type = 'LOGIN_FAILED'
```

and:

```text
created_at >= NOW() - INTERVAL '10 minutes'
```

The query therefore counts failed login events occurring within the latest ten-minute window.

---

# 4. Failure Count

The returned count is converted to a JavaScript number:

```text
Number(result.rows[0].failures)
```

---

# 5. Severity Thresholds

The service maps exact failure counts to severity levels:

| Failed Attempts | Severity |
|---:|---|
| 3 | MEDIUM |
| 6 | HIGH |
| 10 | CRITICAL |

No alert is created for other counts.

---

# 6. Security Alert

When one of the thresholds is reached, the service calls:

```text
createAlert()
```

with:

```text
adminId
layer = IDENTITY
severity
type = FAILED_LOGIN_THRESHOLD
description
ipAddress
```

---

# 7. Alert Description

The generated description follows:

```text
<failures> failed login attempts detected within 10 minutes
```

---

# 8. Alert Flow

```text
checkFailedLoginThreshold()
        ↓
Count LOGIN_FAILED events
        ↓
10-minute window
        ↓
Evaluate failure count
        ↓
3 → MEDIUM
6 → HIGH
10 → CRITICAL
        ↓
createAlert()
        ↓
Security Alert
```

---

# 9. No Threshold Match

If the failure count is not:

```text
3
6
10
```

then:

```text
severity = null
```

and no alert is created.

---

# 10. Export

The module exports:

```text
checkFailedLoginThreshold
```

---

# 11. Summary

`threatDetectionService.js` implements failed-login threshold detection. It counts `LOGIN_FAILED` audit events from the previous ten minutes and generates `IDENTITY` security alerts at exactly 3, 6, and 10 failures, corresponding to MEDIUM, HIGH, and CRITICAL severity respectively.
