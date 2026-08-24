# usersRoutes.js Documentation

## 1. File Overview

**File:** `usersRoutes.js`  
**Location:** `src/routes/usersRoutes.js`

`usersRoutes.js` defines the REST endpoints for the SEWAC Users module.

The router connects:

```text
HTTP request
    ↓
Authentication
    ↓
Permission check
    ↓
usersController
```

---

# 2. Dependencies

The router imports:

```text
express
authMiddleware
checkPermission
usersController
```

---

# 3. Base Route

When the router is mounted by the backend application, the Users endpoints are exposed under:

```text
/api/users
```

The exact mount path is determined by the application's main route registration.

---

# 4. GET /api/users

```js
router.get(
  "/",
  authMiddleware,
  checkPermission("users"),
  usersController.getUsers
);
```

### Middleware

The request must pass:

```text
authMiddleware
```

and:

```text
checkPermission("users")
```

before reaching the controller.

### Purpose

Returns the users visible to the logged-in administrator.

Supported query parameters are handled by the controller:

```text
type
search
page
limit
```

---

# 5. POST /api/users

```js
router.post(
  "/",
  authMiddleware,
  checkPermission("users"),
  usersController.createUser
);
```

### Purpose

Creates a new:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
WORKER
```

subject to the controller's RBAC rules.

---

# 6. DELETE /api/users/:id

```js
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("users"),
  usersController.deleteUser
);
```

### Purpose

Deactivates a user.

The controller performs a soft delete by setting:

```text
status = INACTIVE
```

---

# 7. PUT /api/users/:id

```js
router.put(
  "/:id",
  authMiddleware,
  checkPermission("users"),
  usersController.updateUser
);
```

### Purpose

Updates:

```text
full_name
phone_number
status
```

subject to role-based access checks.

---

# 8. Middleware Order

Every Users route follows:

```text
Request
   ↓
authMiddleware
   ↓
checkPermission("users")
   ↓
usersController
```

Therefore:

### authMiddleware

Establishes the authenticated user and provides:

```text
req.user
```

### checkPermission("users")

Checks whether the authenticated account has permission to access the Users module.

### usersController

Performs the actual Users operation.

---

# 9. Complete Endpoint Table

| Method | Endpoint | Controller | Purpose |
|---|---|---|---|
| GET | `/api/users` | `getUsers` | List/search/paginate users |
| POST | `/api/users` | `createUser` | Create user |
| PUT | `/api/users/:id` | `updateUser` | Update user |
| DELETE | `/api/users/:id` | `deleteUser` | Soft-delete user |

---

# 10. Relationship to Controller

```text
usersRoutes.js
       ↓
usersController.js
       ↓
Prisma admins model
       ↓
Database
```

Unlike modules that use a service layer, the current Users controller performs the Prisma operations directly.

---

# 11. Worker Relationship

There is no separate Worker CRUD route in this router.

Workers are managed through:

```text
/api/users
```

using:

```text
role = WORKER
```

and:

```text
parent_admin_id
```

The controller determines which workers an Admin Layer 2 account can access.

---

# 12. Summary

`usersRoutes.js` is the routing and middleware layer for the Users module. It protects all Users operations with authentication and the `users` permission before delegating the request to `usersController.js`.
