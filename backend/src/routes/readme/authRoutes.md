# authRoutes(3).js Documentation

## 1. File Overview

The Authentication Routes module defines the Express endpoints for administrator authentication and password management.

The routes delegate request handling to:

```text
authController
```

---

# 2. Router Initialization

An Express router is created using:

```text
express.Router()
```

---

# 3. Register Route

The route is:

```text
POST /register
```

It delegates to:

```text
register
```

from the authentication controller.

### Flow

```text
POST /register
      ↓
register()
      ↓
Administrator Registration
```

---

# 4. Login Route

The route is:

```text
POST /login
```

It delegates to:

```text
login
```

from the authentication controller.

### Flow

```text
POST /login
      ↓
login()
      ↓
Administrator Authentication
```

---

# 5. Forgot Password Route

The route is:

```text
POST /forgot-password
```

It delegates to:

```text
forgotPassword
```

from the authentication controller.

### Flow

```text
POST /forgot-password
      ↓
forgotPassword()
      ↓
Password Reset Request
```

---

# 6. Reset Password Route

The route is:

```text
POST /reset-password
```

It delegates to:

```text
resetPassword
```

from the authentication controller.

### Flow

```text
POST /reset-password
      ↓
resetPassword()
      ↓
Password Update
```

---

# 7. Authentication Route Summary

| Method | Route | Controller |
|---|---|---|
| POST | `/register` | `register` |
| POST | `/login` | `login` |
| POST | `/forgot-password` | `forgotPassword` |
| POST | `/reset-password` | `resetPassword` |

---

# 8. Middleware

No authentication middleware is attached directly to these routes.

Therefore the authentication endpoints are delegated directly to their corresponding controller functions.

---

# 9. Export

The router is exported as:

```text
module.exports = router
```

---

# 10. Complete Flow

```text
Client
  ↓
Authentication Route
  ↓
authController
  ↓
Authentication / Password Operation
  ↓
Response
```

---

# 11. Summary

`authRoutes(3).js` defines the Express routing layer for administrator registration, login, forgot-password requests, and password-reset operations. Each route uses HTTP POST and delegates its processing directly to the corresponding authentication controller function.
