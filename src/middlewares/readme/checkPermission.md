# checkPermission.js Documentation

## 1. File Overview

**File:** `checkPermission(3).js`

The permission middleware provides role-based access control for API routes.

It uses:

```text
ROLE_ACCESS
```

from:

```text
../config/permissions
```

---

# 2. Middleware Factory

The exported function accepts:

```text
pageKey
```

and returns an Express middleware function.

Usage conceptually:

```text
checkPermission("logs")
```

---

# 3. User Role

The middleware reads the authenticated role from:

```text
req.user.role
```

This requires authentication middleware to have already populated:

```text
req.user
```

---

# 4. Role Permissions

The middleware retrieves the permissions for the role using:

```text
ROLE_ACCESS[role]
```

It then checks:

```text
permissions?.[pageKey]
```

---

# 5. Permission Granted

If the requested page/module permission exists and evaluates as allowed:

```text
next()
```

is called.

The request continues to the next middleware or route handler.

---

# 6. Permission Denied

If the role does not have the requested permission, the middleware returns:

```text
HTTP 403
```

with:

```json
{
  "error": "Access denied"
}
```

---

# 7. Access Control Flow

```text
Authenticated Request
        ↓
req.user.role
        ↓
ROLE_ACCESS[role]
        ↓
Check pageKey
        ↓
Permission exists?
 ├── Yes → next()
 └── No  → HTTP 403
```

---

# 8. Dependency

The middleware depends on:

```text
../config/permissions
```

The configuration determines which pages/modules each role can access.

---

# 9. Authentication Dependency

This middleware does not itself authenticate the user.

It expects:

```text
req.user
```

to already exist.

Therefore the typical flow is:

```text
authMiddleware
      ↓
checkPermission(pageKey)
      ↓
Controller / Route
```

---

# 10. Summary

`checkPermission.js` implements role-based authorization. It reads the authenticated user's role, looks up that role in `ROLE_ACCESS`, verifies access to the requested `pageKey`, allows authorized requests to continue, and returns HTTP 403 for unauthorized access.
