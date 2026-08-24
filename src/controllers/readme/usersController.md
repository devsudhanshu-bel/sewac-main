# usersController.js Documentation

## 1. File Overview

**File:** `usersController.js`  
**Location:** `src/controllers/usersController.js`

`usersController.js` is the main HTTP controller for the SEWAC Admin Users module.

Unlike some other backend modules, the current Users implementation keeps the database/business logic directly inside this controller rather than delegating it to a populated `usersService.js`.

The controller uses:

```text
Prisma
bcrypt
editLogger
```

and operates on the:

```text
admins
```

database model.

---

## 2. Main Responsibilities

The controller handles:

```text
List users
Create users
Update users
Soft-delete users
Role-based access control
Search
Pagination
Duplicate email/phone checks
Password validation
Password hashing
Edit logging
```

---

## 3. Dependencies

### bcrypt

Used for hashing passwords during user creation.

```js
bcrypt.hash(password, 10)
```

The password is never stored directly in plain text.

### Prisma

Imported from:

```text
../config/cmadsPrisma
```

Used for:

```text
admins.findUnique()
admins.findFirst()
admins.count()
admins.findMany()
admins.create()
admins.update()
```

### editLogger

Imported from:

```text
../utils/editLogger
```

Used to record:

```text
CREATE
UPDATE
DELETE
```

actions in the Users module.

---

# 4. getUsers()

## Purpose

Retrieves the users visible to the currently authenticated administrator.

The endpoint supports:

```text
type
search
page
limit
```

from `req.query`.

The authenticated administrator is obtained from:

```js
req.user
```

with:

```text
role
id
```

---

## 4.1 Pagination

The controller normalizes:

```text
page >= 1
1 <= limit <= 100
```

The database offset is:

```js
skip = (currentPage - 1) * pageSize
```

The result includes:

```text
page
limit
count
total
totalPages
users
```

---

## 4.2 ADMIN_LAYER_1 Visibility

When the logged-in administrator is:

```text
ADMIN_LAYER_1
```

the target role is determined by:

```text
type=ADMIN_LAYER_1
```

or, otherwise:

```text
ADMIN_LAYER_2
```

Therefore:

```text
ADMIN_LAYER_1
    ↓
can view ADMIN_LAYER_1
or
can view ADMIN_LAYER_2
```

Only:

```text
status = ACTIVE
```

users are returned.

---

## 4.3 ADMIN_LAYER_2 Visibility

When the logged-in administrator is:

```text
ADMIN_LAYER_2
```

the controller only returns:

```text
role = WORKER
```

where:

```text
parent_admin_id = loggedInUser.id
status = ACTIVE
```

This establishes the contractor-to-worker relationship.

---

## 4.4 Search

Search is applied to:

```text
full_name
email
phone_number
```

For:

```text
full_name
email
```

Prisma uses case-insensitive matching.

The phone number is searched using `contains`.

---

## 4.5 Selected User Fields

The list query returns:

```text
id
full_name
email
phone_number
role
status
created_at
```

The password hash is not returned.

---

# 5. createUser()

## Purpose

Creates a new administrator, contractor, or worker according to the role of the logged-in user.

Required fields:

```text
full_name
email
phone_number
password
role
```

If any required field is missing:

```text
HTTP 400
```

---

## 5.1 Role-Based Creation Rules

### ADMIN_LAYER_1

An Admin Layer 1 user can create:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
```

It cannot create:

```text
WORKER
```

---

### ADMIN_LAYER_2

An Admin Layer 2 user can create:

```text
WORKER
```

only.

---

### Other Roles

Any other logged-in role receives:

```text
HTTP 403
Unauthorized.
```

---

# 6. Email Duplicate Validation

Before creating the user:

```js
prisma.admins.findUnique({
  where: { email }
})
```

is used.

If the email already exists:

```text
HTTP 409
Email already exists.
```

---

# 7. Phone Duplicate Validation

The controller checks:

```js
prisma.admins.findFirst({
  where: { phone_number }
})
```

If the phone number already exists:

```text
HTTP 409
Phone number already exists.
```

---

# 8. Password Validation

The password must satisfy the following requirements:

```text
Minimum 8 characters
At least one uppercase letter
At least one lowercase letter
At least one number
At least one special character
```

The validation is implemented with:

```regex
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/
```

Invalid passwords return:

```text
HTTP 400
```

---

# 9. Password Hashing

After validation:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

The database stores:

```text
password_hash
```

not the original password.

---

# 10. Parent Admin Logic

The controller establishes parent relationships.

### ADMIN_LAYER_2

When creating an Admin Layer 2 user:

```text
parent_admin_id = loggedInUser.id
```

### WORKER

When creating a Worker:

```text
parent_admin_id = loggedInUser.id
```

### ADMIN_LAYER_1

The parent ID remains:

```text
null
```

---

# 11. User Creation

A new record is created in:

```text
prisma.admins.create()
```

with:

```text
full_name
email
phone_number
password_hash
role
parent_admin_id
status = ACTIVE
```

---

# 12. CREATE Edit Log

After successful creation, the controller calls:

```js
logEdit()
```

with:

```text
module = Users
action = CREATE
recordId = newUser.id
```

The description identifies the administrator who created the new role/user.

---

# 13. createUser() Response

Successful creation returns:

```http
201 Created
```

and includes:

```text
id
full_name
email
phone_number
role
```

The password hash is not returned.

---

# 14. deleteUser()

## Purpose

Deactivates an existing user.

This is a:

```text
SOFT DELETE
```

rather than a physical database deletion.

---

## 14.1 Self-Delete Protection

A user cannot delete their own account.

If:

```text
userId === loggedInUser.id
```

the controller returns:

```text
HTTP 400
You cannot delete your own account.
```

---

## 14.2 User Existence

The target user is first retrieved using:

```js
prisma.admins.findUnique()
```

If no user exists:

```text
HTTP 404
User not found.
```

---

## 14.3 Last Admin Protection

If the target user is:

```text
ADMIN_LAYER_1
```

the controller counts active Admin Layer 1 users.

If there is only one active Admin Layer 1 user, deletion is blocked.

This prevents the system from removing the final Admin Layer 1 account.

---

# 15. deleteUser() RBAC

### ADMIN_LAYER_1

Can manage:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
```

Cannot manage:

```text
WORKER
```

---

### ADMIN_LAYER_2

Can delete only:

```text
WORKER
```

whose:

```text
parent_admin_id
```

matches the logged-in Admin Layer 2 ID.

---

# 16. Soft Delete Operation

The target user is updated:

```js
{
  status: "INACTIVE"
}
```

The database record remains present.

Inactive users are excluded from the normal active-user listing.

---

# 17. DELETE Edit Log

The deletion is recorded using:

```text
module = Users
action = DELETE
```

The log description records which administrator deactivated which user.

---

# 18. updateUser()

## Purpose

Updates an existing user's:

```text
full_name
phone_number
status
```

The target user ID is read from:

```text
req.params.id
```

---

# 19. User Existence

The controller first calls:

```text
admins.findUnique()
```

If the user does not exist:

```text
HTTP 404
```

---

# 20. updateUser() RBAC

### ADMIN_LAYER_1

Can update:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
```

Cannot update:

```text
WORKER
```

### ADMIN_LAYER_2

Can update only:

```text
WORKER
```

where:

```text
parent_admin_id === loggedInUser.id
```

---

# 21. Phone Duplicate Check

If a phone number is provided, the controller searches for another user with the same phone.

The current user's own ID is excluded using:

```text
NOT: { id: userId }
```

If a duplicate exists:

```text
HTTP 409
Phone number already exists.
```

---

# 22. User Update

The controller updates:

```text
full_name
phone_number
status
```

using:

```js
prisma.admins.update()
```

---

# 23. UPDATE Edit Log

After a successful update:

```text
module = Users
action = UPDATE
```

is recorded through `logEdit()`.

---

# 24. Update Response

Successful update returns:

```http
200 OK
```

with:

```json
{
  "success": true,
  "message": "User updated successfully.",
  "user": {}
}
```

---

# 25. Error Handling

Each operation is wrapped in:

```js
try {
   ...
} catch (error) {
   console.error(...);
   ...
}
```

Typical responses include:

```text
400 - Validation/business rule failure
403 - Unauthorized role operation
404 - User not found
409 - Duplicate email/phone
500 - Server/database failure
```

---

# 26. Complete User Flow

```text
Frontend Users Page
        ↓
/api/users
        ↓
usersRoutes.js
        ↓
authMiddleware
        ↓
checkPermission("users")
        ↓
usersController.js
        ↓
Prisma admins model
        ↓
Database
```

For mutations:

```text
Create / Update / Delete
        ↓
Prisma
        ↓
admins table
        ↓
editLogger
```

---

# 27. Important Implementation Notes

- The current Users controller directly accesses Prisma.
- `usersService.js` exists in the backend source but is currently empty.
- Authentication is supplied through `req.user`.
- Permission middleware is applied by `usersRoutes.js`.
- Users are stored in the `admins` model.
- Workers are represented with role `WORKER`.
- Admin Layer 2 users can be parent administrators for workers.
- Deletion is implemented using `status = INACTIVE`.
- Active users are returned by `getUsers()`.
- Passwords are hashed with bcrypt.
- Email and phone uniqueness are checked before creation.
- Phone uniqueness is checked again during updates.
- User creation/update/deletion are recorded through the edit logger.
- The controller prevents deleting the final active Admin Layer 1 account.

---

# 28. Summary

`usersController.js` is the central backend implementation for SEWAC user administration.

It provides:

```text
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

with role-based visibility and management rules for:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
WORKER
```

The controller combines authentication context, RBAC checks, validation, Prisma database operations, password hashing, soft deletion, and audit logging.
