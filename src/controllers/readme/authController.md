# authController.js Documentation

## 1. File Overview

The authentication controller handles:

```text
Admin Login
Current Authenticated User Retrieval
```

It uses:

```text
cmadsService
permissions configuration
JWT
```

---

# 2. login()

The method:

```text
login(req, res)
```

authenticates an administrator.

It passes the request body to:

```text
verifyCMADS(req.body)
```

---

# 3. CMADS Verification

The controller delegates credential verification to:

```text
verifyCMADS()
```

The returned object provides:

```text
admin
```

The controller extracts:

```text
admin.id
admin.full_name
admin.email
admin.role
```

---

# 4. Role Resolution

The administrator role is read from:

```text
admin.role
```

Permissions are resolved using:

```text
ROLE_ACCESS[role]
```

---

# 5. JWT Generation

After successful authentication, the controller generates a JWT using:

```text
jwt.sign()
```

The payload contains:

```text
id
full_name
email
role
```

The signing secret is:

```text
process.env.JWT_SECRET
```

---

# 6. JWT Expiration

The generated JWT has:

```text
expiresIn: "1d"
```

Therefore the login token is valid for:

```text
1 day
```

---

# 7. Login Response

A successful login returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "token": "...",
  "admin": "...",
  "permissions": "..."
}
```

---

# 8. login() Error Handling

If authentication or JWT creation fails, the controller returns:

```text
HTTP 500
```

with:

```json
{
  "error": "..."
}
```

The error message is taken from:

```text
error.message
```

with:

```text
Login failed
```

as fallback.

---

# 9. getMe()

The method:

```text
getMe(req, res)
```

returns information about the currently authenticated administrator.

It reads:

```text
req.user.role
```

and resolves:

```text
ROLE_ACCESS[role]
```

---

# 10. Current User Response

A successful request returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "admin": "...",
  "permissions": "..."
}
```

The `admin` object comes directly from:

```text
req.user
```

---

# 11. getMe() Error Handling

Unexpected failures return:

```text
HTTP 500
```

with:

```json
{
  "error": "Failed to fetch current user"
}
```

---

# 12. Authentication Flow

```text
Login Request
      ↓
verifyCMADS()
      ↓
Authenticated Admin
      ↓
Resolve Role
      ↓
Resolve Permissions
      ↓
Create JWT
      ↓
Return Token + Admin + Permissions
```

For authenticated-user retrieval:

```text
JWT Authentication Middleware
      ↓
req.user
      ↓
getMe()
      ↓
Resolve Permissions
      ↓
Return Current User
```

---

# 13. Exports

The controller exports:

```text
login
getMe
```

---

# 14. Summary

`authController.js` is the authentication controller for administrator access. It delegates credential verification to CMADS, resolves role permissions, creates one-day JWT tokens containing the administrator identity, returns login information, and provides a `getMe` operation for retrieving the currently authenticated administrator and their permissions.
