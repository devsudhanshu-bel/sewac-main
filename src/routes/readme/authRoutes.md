# authRoutes.js Documentation

## 1. File Overview

**File:** `authRoutes(2).js`\
**Location:** `src/routes/authRoutes.js`

The authentication router uses:

``` text
authMiddleware
authController
```

It exposes:

``` text
/login
/me
```

------------------------------------------------------------------------

# 2. POST /login

Calls:

``` text
authController.login
```

This route does not use:

``` text
authMiddleware
```

The route is responsible for forwarding login requests to the
authentication controller.

------------------------------------------------------------------------

# 3. GET /me

Calls:

``` text
authController.getMe
```

Protected by:

``` text
authMiddleware
```

The middleware executes before the controller.

------------------------------------------------------------------------

# 4. Route Protection

The authentication routes use the following protection:

  Method   Endpoint   Middleware
  -------- ---------- ------------------
  POST     `/login`   None
  GET      `/me`      `authMiddleware`

------------------------------------------------------------------------

# 5. Complete Route Flow

``` text
Authentication Router
        ↓
+-----------------------+
|                       |
POST /login          GET /me
|                       |
↓                       ↓
login()            authMiddleware
                        ↓
                     getMe()
```

------------------------------------------------------------------------

# 6. Endpoint Summary

  Method   Endpoint   Purpose
  -------- ---------- -------------------------------------
  POST     `/login`   Authentication/login
  GET      `/me`      Retrieve current authenticated user

------------------------------------------------------------------------

# 7. Summary

`authRoutes(2).js` is the authentication routing layer. It forwards
login requests to `authController.login` and protects the `/me` endpoint
with `authMiddleware` before calling `authController.getMe`.
