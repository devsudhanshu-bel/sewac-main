# securityController.js Documentation

## 1. File Overview

The Security Controller provides the administrator profile retrieval endpoint.

It uses the PostgreSQL connection pool from:

```text
../config/db
```

---

# 2. getProfile()

The administrator identity is obtained from:

```text
req.admin.adminId
```

This indicates that the endpoint expects authentication middleware to populate:

```text
req.admin
```

---

# 3. Database Query

The controller queries:

```text
admins
```

using the authenticated administrator ID.

Only the following fields are selected:

```text
id
full_name
email
created_at
```

---

# 4. Administrator Not Found

If no matching administrator exists:

```text
HTTP 404
```

is returned with:

```json
{
  "success": false,
  "message": "Admin not found"
}
```

---

# 5. Successful Profile Response

A successful lookup returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "admin": "..."
}
```

The administrator data contains:

```text
id
full_name
email
created_at
```

---

# 6. Error Handling

Unexpected database or processing errors are logged.

The controller returns:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "Server Error"
}
```

---

# 7. Export

The controller exports:

```text
getProfile
```

---

# 8. Request Flow

```text
Authenticated Request
        ↓
req.admin.adminId
        ↓
Query admins
        ↓
Administrator Found?
   ├── No → HTTP 404
   └── Yes → HTTP 200
```

---

# 9. Summary

`securityController.js` provides the authenticated administrator profile endpoint. It uses the administrator ID supplied by authentication middleware, retrieves the administrator's basic profile information from PostgreSQL, returns HTTP 404 when the administrator cannot be found, and returns HTTP 500 for unexpected errors.
