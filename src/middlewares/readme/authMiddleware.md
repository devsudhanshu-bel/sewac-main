# authMiddleware.js Documentation

## 1. File Overview

**File:** `authMiddleware(5).js`

The authentication middleware protects API routes using either:

```text
Citizen Internal API Secret
```

or:

```text
Admin JWT Authentication
```

The middleware attaches the authenticated identity to:

```text
req.user
```

---

# 2. Citizen Internal API Authentication

The middleware first checks:

```text
X-Citizen-Internal-Secret
```

from:

```text
req.headers["x-citizen-internal-secret"]
```

It compares the supplied value against:

```text
process.env.CITIZEN_INTERNAL_API_SECRET
```

---

# 3. Successful Internal Authentication

When the internal secret matches, the request is marked as:

```json
{
  "id": "citizen-internal",
  "internal": true,
  "source": "citizen-backend"
}
```

This object is assigned to:

```text
req.user
```

The request then continues using:

```text
next()
```

---

# 4. Admin JWT Authentication

If internal authentication is not used, the middleware reads:

```text
Authorization
```

from the request headers.

The expected structure is:

```text
Authorization: Bearer <token>
```

---

# 5. Missing Authorization Header

If the authorization header is missing, the middleware returns:

```text
HTTP 401
```

with:

```json
{
  "error": "No token provided"
}
```

---

# 6. Missing JWT Token

If the authorization header does not contain a token, the middleware returns:

```text
HTTP 401
```

with:

```json
{
  "error": "Invalid token"
}
```

---

# 7. JWT Verification

The token is verified using:

```text
jwt.verify()
```

with:

```text
process.env.JWT_SECRET
```

---

# 8. Successful JWT Authentication

After successful verification, the decoded JWT payload is assigned to:

```text
req.user
```

The user ID is normalized using:

```text
decoded.id ?? decoded.adminId
```

Therefore both JWT formats are supported:

```text
id
```

or:

```text
adminId
```

---

# 9. Invalid JWT

If JWT verification fails, the middleware returns:

```text
HTTP 401
```

with:

```json
{
  "error": "Invalid token"
}
```

---

# 10. Complete Authentication Flow

```text
Incoming Request
       ↓
Check X-Citizen-Internal-Secret
       ↓
Valid?
 ├── Yes → req.user = citizen-internal → next()
 └── No
       ↓
Check Authorization Header
       ↓
Bearer Token?
 ├── No → HTTP 401
 └── Yes
       ↓
jwt.verify()
       ↓
Valid?
 ├── No → HTTP 401
 └── Yes
       ↓
req.user = decoded payload
       ↓
next()
```

---

# 11. Authentication Modes

| Mode | Credential | Result |
|---|---|---|
| Internal | `X-Citizen-Internal-Secret` | Internal citizen request |
| Admin | `Authorization: Bearer <JWT>` | Authenticated admin request |

---

# 12. Summary

`authMiddleware.js` provides dual authentication support. It allows trusted Citizen backend requests through a dedicated internal secret and authenticates normal Admin requests through JWT. Successful authentication always establishes `req.user` before passing control to the next middleware or route.
