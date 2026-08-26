# superAdminMiddleware.js Documentation

## 1. File Overview

The Super Admin Middleware provides JWT authentication combined with a role check specifically for:

```text
SUPER_ADMIN
```

Its responsibilities are:

```text
Validate Authorization header
Extract JWT
Verify JWT
Validate SUPER_ADMIN role
Attach decoded identity to request
Allow authorized request to continue
```

---

# 2. Authorization Header Validation

The middleware reads:

```text
req.headers.authorization
```

It requires the header to exist and start with:

```text
Bearer 
```

The condition is:

```text
authHeader.startsWith("Bearer ")
```

If this requirement is not satisfied, the request returns:

```text
HTTP 401
```

with:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

# 3. Token Extraction

After validating the header format, the token is extracted using:

```text
authHeader.split(" ")[1]
```

---

# 4. JWT Verification

The token is verified using:

```text
jwt.verify(
  token,
  process.env.JWT_SECRET
)
```

The middleware therefore depends on:

```text
process.env.JWT_SECRET
```

for JWT signature validation.

---

# 5. Role Verification

After successful JWT verification, the middleware checks:

```text
decoded.role !== "SUPER_ADMIN"
```

If the decoded role is not:

```text
SUPER_ADMIN
```

the request is rejected.

The response is:

```text
HTTP 403
```

with:

```json
{
  "success": false,
  "message": "Access Denied"
}
```

---

# 6. Administrator Identity

For a valid Super Admin token, the decoded JWT payload is attached to:

```text
req.admin
```

Downstream handlers can therefore access the authenticated Super Admin information through:

```text
req.admin
```

---

# 7. Successful Authorization

If:

```text
Authorization header is valid
        ↓
JWT is valid
        ↓
role = SUPER_ADMIN
```

the middleware calls:

```text
next()
```

and allows the request to continue.

---

# 8. Invalid Token

JWT verification errors are caught and return:

```text
HTTP 401
```

with:

```json
{
  "success": false,
  "message": "Invalid Token"
}
```

---

# 9. Request Flow

```text
Incoming Request
       ↓
Read Authorization Header
       ↓
Bearer Header?
   ├── No → HTTP 401 Unauthorized
   └── Yes
          ↓
Extract JWT
          ↓
jwt.verify()
          ↓
Valid Token?
   ├── No → HTTP 401 Invalid Token
   └── Yes
          ↓
Check decoded.role
          ↓
SUPER_ADMIN?
   ├── No → HTTP 403 Access Denied
   └── Yes
          ↓
req.admin = decoded
          ↓
next()
```

---

# 10. Authentication vs Authorization

This middleware performs two separate checks:

### Authentication

Determines whether the JWT is valid:

```text
jwt.verify()
```

### Authorization

Determines whether the authenticated identity has the required role:

```text
decoded.role === "SUPER_ADMIN"
```

Both checks must succeed before the protected request continues.

---

# 11. Export

The middleware exports:

```text
superAdminMiddleware
```

as the module's default exported value.

---

# 12. Summary

`superAdminMiddleware.js` protects Super Admin routes by requiring a properly formatted Bearer JWT, validating the token with `JWT_SECRET`, verifying that the decoded role is exactly `SUPER_ADMIN`, attaching the decoded identity to `req.admin`, and forwarding authorized requests. Missing/incorrect authorization headers produce HTTP 401, invalid JWTs produce HTTP 401, and authenticated non-Super-Admin users receive HTTP 403.
