# emailRoutes(2).js Documentation

## 1. File Overview

The Email Routes module defines the Express endpoint used to send permission-request emails.

It delegates request handling to:

```text
emailController
```

---

# 2. Router Initialization

An Express router is created using:

```text
express.Router()
```

---

# 3. Permission Request Email Route

The route is:

```text
POST /permission-request
```

The controller handler is:

```text
emailController.sendPermissionRequestEmail
```

### Flow

```text
POST /permission-request
          ↓
sendPermissionRequestEmail()
          ↓
Permission Approval Email
```

---

# 4. Middleware

No authentication middleware is attached directly to this route.

The request is therefore passed directly to:

```text
emailController.sendPermissionRequestEmail
```

---

# 5. Route Summary

| Method | Route | Middleware | Controller |
|---|---|---|---|
| POST | `/permission-request` | None | `sendPermissionRequestEmail` |

---

# 6. Export

The router is exported as:

```text
module.exports = router
```

---

# 7. Complete Flow

```text
Client
  ↓
POST /permission-request
  ↓
emailRoutes
  ↓
emailController
  ↓
sendPermissionApprovalEmail()
  ↓
Response
```

---

# 8. Summary

`emailRoutes(2).js` provides a single Express POST endpoint for permission-request email handling. The route delegates directly to `sendPermissionRequestEmail` in the email controller and does not attach authentication middleware within the route definition.
