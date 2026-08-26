# superAdminController(1).js Documentation

## 1. File Overview

The Super Admin Controller provides privileged administrator-management operations.

The available operations are:

```text
Super Admin Login
Create Administrator
Get Administrators
Delete Administrator
```

The controller uses:

```text
PostgreSQL
bcrypt
JWT
```

---

# 2. login()

Reads:

```text
email
password
```

from the request body.

The controller searches:

```text
admins
```

by email.

---

# 3. Administrator Existence Check

If no administrator exists for the submitted email:

```text
HTTP 401
```

is returned with:

```text
Invalid Credentials
```

---

# 4. Super Admin Role Validation

After finding the administrator, the controller checks:

```text
admin.role === "SUPER_ADMIN"
```

If the administrator has another role:

```text
HTTP 403
```

is returned with:

```text
Not Super Admin
```

---

# 5. Password Verification

The submitted password is compared against:

```text
admin.password_hash
```

using:

```text
bcrypt.compare()
```

An incorrect password returns:

```text
HTTP 401
```

with:

```text
Invalid Credentials
```

---

# 6. JWT Generation

Successful Super Admin authentication creates a JWT containing:

```text
adminId
role
```

The token uses:

```text
process.env.JWT_SECRET
```

and expires after:

```text
4 hours
```

---

# 7. Super Admin Login Response

Successful authentication returns:

```text
success
token
admin
```

using the default successful response status.

---

# 8. createAdmin()

Creates an administrator account.

Required fields:

```text
full_name
email
phone_number
password
role
```

---

# 9. Required Field Validation

If any required field is missing:

```text
HTTP 400
```

with:

```text
All fields are required
```

---

# 10. Input Normalization

The controller normalizes:

```text
full_name → trim()
email → trim().toLowerCase()
phone_number → trim()
```

The normalized values are used for validation and database operations.

---

# 11. Phone Validation

The phone number must contain exactly:

```text
10 digits
```

The validation pattern is:

```text
^\d{10}$
```

Invalid phone numbers return:

```text
HTTP 400
```

with:

```text
Phone number must contain exactly 10 digits
```

---

# 12. Role Validation

Only these roles can be created:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
```

Any other role returns:

```text
HTTP 400
```

with:

```text
Invalid Role
```

This prevents this endpoint from creating another:

```text
SUPER_ADMIN
```

account through the supplied role value.

---

# 13. Email Duplicate Check

The controller checks:

```text
admins.email
```

before insertion.

If the email already exists:

```text
HTTP 400
```

with:

```text
Email already exists
```

---

# 14. Phone Duplicate Check

The controller checks:

```text
admins.phone_number
```

before insertion.

If the phone number already exists:

```text
HTTP 400
```

with:

```text
Phone number already exists
```

---

# 15. Password Hashing

The administrator password is hashed using:

```text
bcrypt.hash(password, 10)
```

The resulting value is stored as:

```text
password_hash
```

---

# 16. Administrator Creation

The controller inserts:

```text
full_name
email
phone_number
password_hash
role
```

into:

```text
admins
```

The returned administrator fields are:

```text
id
full_name
email
phone_number
role
created_at
```

---

# 17. Create Response

Successful administrator creation returns:

```text
HTTP 201
```

with:

```json
{
  "success": true,
  "message": "Administrator created successfully",
  "admin": "..."
}
```

---

# 18. getAdmins()

Retrieves administrators whose roles are:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
```

The query explicitly excludes:

```text
SUPER_ADMIN
```

from the returned administrator list.

---

# 19. Administrator Ordering

Administrators are ordered by:

```text
created_at DESC
```

so newer records appear first.

---

# 20. Get Administrators Response

Successful requests return:

```text
success
admins
```

The returned administrator fields are:

```text
id
full_name
email
phone_number
role
created_at
```

---

# 21. deleteAdmin()

Reads:

```text
req.params.id
```

and first searches for the corresponding administrator.

---

# 22. Administrator Not Found

If no administrator exists:

```text
HTTP 404
```

with:

```text
Administrator not found
```

---

# 23. Administrator Deletion

If the administrator exists, the controller executes:

```text
DELETE FROM admins WHERE id=$1
```

---

# 24. Delete Response

Successful deletion returns:

```text
success: true
message: Administrator deleted successfully
```

using the default successful response status.

---

# 25. General Error Handling

Unexpected errors in any operation are logged.

The controller returns:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "Server Error"
}
```

---

# 26. Controller Flow

Super Admin login:

```text
Email + Password
      ↓
Find Administrator
      ↓
Check SUPER_ADMIN Role
      ↓
Compare Password
      ↓
Generate JWT
      ↓
Return Token
```

Create administrator:

```text
Validate Fields
      ↓
Normalize Input
      ↓
Validate Phone
      ↓
Validate Role
      ↓
Check Email
      ↓
Check Phone
      ↓
Hash Password
      ↓
Insert Administrator
      ↓
HTTP 201
```

List administrators:

```text
Query ADMIN_LAYER_1 + ADMIN_LAYER_2
      ↓
Sort by created_at DESC
      ↓
Return Administrators
```

Delete:

```text
Find Administrator
      ↓
Delete by ID
      ↓
Return Success
```

---

# 27. Exports

The controller exports:

```text
login
createAdmin
getAdmins
deleteAdmin
```

---

# 28. Summary

`superAdminController(1).js` provides privileged administrator management. It authenticates only `SUPER_ADMIN` accounts, issues four-hour JWTs, creates `ADMIN_LAYER_1` and `ADMIN_LAYER_2` administrators after validating and hashing their credentials, lists those administrator layers, and supports administrator deletion.
