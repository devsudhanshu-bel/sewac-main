# checkTemporaryPermission.js Documentation

## 1. File Overview

**File:** `checkTemporaryPermission(3).js`

The temporary permission middleware provides target-specific, time-limited authorization.

It uses:

```text
temporary_permissions
```

through Prisma.

---

# 2. Middleware Factory

The exported function accepts:

```text
moduleName
```

and returns an Express middleware.

Conceptually:

```text
checkTemporaryPermission("module")
```

---

# 3. Admin Identification

The middleware reads:

```text
req.user.id
```

and stores it as:

```text
adminId
```

This identifies the administrator requesting temporary access.

---

# 4. Target Identification

The target is read from:

```text
req.params.phoneNumber
```

The target therefore depends on a route containing:

```text
:phoneNumber
```

---

# 5. Permission Lookup

The middleware searches:

```text
temporary_permissions
```

using:

```text
admin_id
module
target_identifier
```

The lookup is performed with:

```text
findFirst()
```

---

# 6. Permission Record

A matching permission must contain:

```text
admin_id = req.user.id
module = supplied moduleName
target_identifier = req.params.phoneNumber
```

---

# 7. Missing Permission

If no matching permission exists, the middleware returns:

```text
HTTP 403
```

with:

```json
{
  "success": false,
  "message": "Permission denied."
}
```

---

# 8. Permission Expiration

The middleware checks:

```text
permission.expires_at
```

against:

```text
new Date()
```

If:

```text
expires_at < current time
```

the permission is considered expired.

---

# 9. Expired Permission Response

An expired permission returns:

```text
HTTP 403
```

with:

```json
{
  "success": false,
  "message": "Permission expired."
}
```

---

# 10. Valid Temporary Permission

If a matching permission exists and has not expired:

```text
next()
```

is called.

The request continues to the next middleware or route handler.

---

# 11. Database Error Handling

The permission lookup is wrapped in:

```text
try / catch
```

If a database or runtime error occurs, the middleware logs the error and returns:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

The message contains:

```text
error.message
```

---

# 12. Complete Authorization Flow

```text
Authenticated Request
        ↓
req.user.id
        ↓
req.params.phoneNumber
        ↓
moduleName
        ↓
temporary_permissions lookup
        ↓
Permission found?
 ├── No → HTTP 403
 └── Yes
       ↓
Check expires_at
       ↓
Expired?
 ├── Yes → HTTP 403
 └── No
       ↓
next()
```

---

# 13. Authentication Dependency

The middleware expects authentication to have already populated:

```text
req.user.id
```

A typical middleware sequence is:

```text
authMiddleware
      ↓
checkTemporaryPermission(moduleName)
      ↓
Controller / Route
```

---

# 14. Target-Specific Authorization

Unlike role-based permission checking, this middleware evaluates authorization against a specific target:

```text
phoneNumber
```

Therefore access can be granted temporarily for one particular target without automatically granting access to all targets.

---

# 15. Summary

`checkTemporaryPermission.js` implements temporary, target-specific authorization. It verifies the authenticated admin, module name, and target phone number against `temporary_permissions`, rejects missing or expired permissions with HTTP 403, allows valid permissions to continue, and returns HTTP 500 for unexpected database/runtime errors.
