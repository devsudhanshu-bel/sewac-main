# citizenRoutes.js Documentation

## 1. File Overview

**File:** `citizenRoutes(1).js`\
**Location:** `src/routes/citizenRoutes.js`

The citizen router uses:

``` text
authMiddleware
checkPermission
citizenController
```

It exposes:

``` text
/search
/all
```

Both routes are restricted to authenticated users with the:

``` text
users
```

permission.

------------------------------------------------------------------------

# 2. GET /search

Calls:

``` text
citizenController.searchCitizen
```

Protected by:

``` text
authMiddleware
checkPermission("users")
```

The middleware order is:

``` text
authMiddleware
      ↓
checkPermission("users")
      ↓
searchCitizen
```

The route is explicitly documented as the citizen-search endpoint
restricted to the users page permission.

------------------------------------------------------------------------

# 3. GET /all

Calls:

``` text
citizenController.getAllCitizens
```

Protected by:

``` text
authMiddleware
checkPermission("users")
```

The middleware order is:

``` text
authMiddleware
      ↓
checkPermission("users")
      ↓
getAllCitizens
```

------------------------------------------------------------------------

# 4. Route Protection

Both citizen routes require:

``` text
Authentication
+
"users" Permission
```

  -----------------------------------------------------------------------------------
  Method            Endpoint          Middleware                   Controller
  ----------------- ----------------- ---------------------------- ------------------
  GET               `/search`         `authMiddleware` +           `searchCitizen`
                                      `checkPermission("users")`   

  GET               `/all`            `authMiddleware` +           `getAllCitizens`
                                      `checkPermission("users")`   
  -----------------------------------------------------------------------------------

------------------------------------------------------------------------

# 5. Complete Route Flow

``` text
Citizen Router
       ↓
authMiddleware
       ↓
checkPermission("users")
       ↓
+-----------------------+
|                       |
GET /search          GET /all
|                       |
↓                       ↓
searchCitizen       getAllCitizens
```

------------------------------------------------------------------------

# 6. Endpoint Summary

  Method   Endpoint    Purpose
  -------- ----------- -----------------------
  GET      `/search`   Search citizens
  GET      `/all`      Retrieve all citizens

------------------------------------------------------------------------

# 7. Summary

`citizenRoutes(1).js` is the protected citizen routing layer. Both
citizen endpoints require authentication and the `users` page permission
before delegating to the appropriate citizen controller method.
