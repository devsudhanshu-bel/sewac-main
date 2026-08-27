# superAdminRoutes(1).js Documentation

## 1. File Overview

The Super Admin Routes module defines Express endpoints for Super Admin authentication and administrator management.

It uses:

```text
superAdminMiddleware
superAdminController
```

The routes provide:

```text
Super Admin Login
Administrator Creation
Administrator Listing
Administrator Deletion
```

## 2. Router Initialization

An Express router is created using:

```text
express.Router()
```

## 3. Super Admin Login

```text
POST /login
```

Controller:

```text
login
```

No `superAdminMiddleware` is attached because authentication must occur before a Super Admin token can be supplied.

## 4. Create Administrator

```text
POST /admins
```

Middleware:

```text
superAdminMiddleware
```

Controller:

```text
createAdmin
```

Flow:

```text
POST /admins
      ↓
superAdminMiddleware
      ↓
SUPER_ADMIN authorization
      ↓
createAdmin
      ↓
Administrator Creation
```

## 5. List Administrators

```text
GET /admins
```

Middleware:

```text
superAdminMiddleware
```

Controller:

```text
getAdmins
```

Flow:

```text
GET /admins
      ↓
superAdminMiddleware
      ↓
SUPER_ADMIN authorization
      ↓
getAdmins
      ↓
Administrator List
```

## 6. Delete Administrator

```text
DELETE /admins/:id
```

Middleware:

```text
superAdminMiddleware
```

Controller:

```text
deleteAdmin
```

The administrator ID is supplied through:

```text
req.params.id
```

## 7. Route Summary

| Method | Route | Middleware | Controller |
|---|---|---|---|
| POST | `/login` | None | `login` |
| POST | `/admins` | `superAdminMiddleware` | `createAdmin` |
| GET | `/admins` | `superAdminMiddleware` | `getAdmins` |
| DELETE | `/admins/:id` | `superAdminMiddleware` | `deleteAdmin` |

## 8. Middleware Coverage

Super Admin authorization is required for:

```text
POST /admins
GET /admins
DELETE /admins/:id
```

The login endpoint is not protected:

```text
POST /login
```

## 9. Authentication and Authorization Flow

Protected administrator-management requests follow:

```text
Request
  ↓
Authorization Header
  ↓
superAdminMiddleware
  ↓
JWT Verification
  ↓
SUPER_ADMIN Role Check
  ↓
Controller
  ↓
Response
```

## 10. Export

The router is exported as:

```text
module.exports = router
```

## 11. Summary

`superAdminRoutes(1).js` defines the routing layer for Super Admin operations. It exposes a login endpoint and protects administrator creation, listing, and deletion with `superAdminMiddleware`, ensuring those management operations require Super Admin authentication and authorization.
