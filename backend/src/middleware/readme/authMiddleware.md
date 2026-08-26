# authMiddleware(6).js Documentation

## 1. File Overview

The Authentication Middleware validates JWT access tokens before allowing a request to continue.

Its primary responsibilities are:

```text
Read Authorization header
Validate JWT
Decode administrator identity
Attach decoded identity to request
Allow authenticated request to continue
```

---

# 2. authenticate()

The middleware function receives:

```text
req
res
next
```

It is designed to run before protected route handlers.

---

# 3. Authorization Header

The middleware reads:

```text
req.headers.authorization
```

If the Authorization header is missing, the request is rejected.

The response is:

```text
HTTP 401
```

with:

```json
{
  "success": false,
  "message": "Token missing"
}
```

---

# 4. Token Extraction

The token is extracted using:

```text
authHeader.split(" ")[1]
```

This expects the Authorization header to contain a scheme followed by a token, such as:

```text
Bearer <JWT>
```

---

# 5. JWT Verification

The token is verified using:

```text
jwt.verify(
  token,
  process.env.JWT_SECRET
)
```

The middleware therefore relies on:

```text
process.env.JWT_SECRET
```

for JWT signature verification.

---

# 6. Decoded Administrator Data

After successful verification, the decoded JWT payload is attached to:

```text
req.admin
```

This allows downstream controllers and middleware to access the authenticated administrator identity and other JWT claims.

---

# 7. Successful Authentication

When the JWT is valid:

```text
next()
```

is called.

The request therefore continues to the next middleware or route handler.

---

# 8. Invalid Token

Any verification failure is caught by the `catch` block.

The middleware returns:

```text
HTTP 401
```

with:

```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

# 9. Request Flow

```text
Incoming Request
       ↓
Read Authorization Header
       ↓
Header Present?
   ├── No → HTTP 401 Token missing
   └── Yes
          ↓
Extract Token
          ↓
jwt.verify()
          ↓
Valid?
   ├── No → HTTP 401 Invalid token
   └── Yes
          ↓
req.admin = decoded
          ↓
next()
```

---

# 10. Export

The middleware exports:

```text
authenticate
```

as the module's default exported value.

---

# 11. Summary

`authMiddleware(6).js` protects authenticated routes by extracting a JWT from the Authorization header, verifying it with `JWT_SECRET`, attaching the decoded administrator information to `req.admin`, and allowing valid requests to proceed. Missing or invalid tokens are rejected with HTTP 401 responses.
