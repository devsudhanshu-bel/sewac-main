# authController(6).js Documentation

## 1. File Overview

The Authentication Controller manages administrator authentication and password-management operations.

The available operations are:

```text
Register Administrator
Login
Forgot Password
Reset Password
```

The controller integrates:

```text
PostgreSQL
bcrypt
validator
JWT
Email Service
Audit Service
Threat Detection Service
Role Permission Service
```

---

# 2. register()

Registers a new administrator.

The request body requires:

```text
full_name
email
password
```

---

# 3. Registration Validation

If any required field is missing, the controller returns:

```text
HTTP 400
```

with:

```text
All fields are required
```

The email is validated using:

```text
validator.isEmail()
```

Invalid email addresses return:

```text
HTTP 400
```

with:

```text
Invalid email
```

---

# 4. Existing Administrator Check

The controller queries:

```text
admins
```

using the submitted email.

If an administrator already exists:

```text
HTTP 409
```

is returned with:

```text
Admin already exists
```

---

# 5. Password Hashing

The password is hashed using:

```text
bcrypt.hash(password, 10)
```

The resulting hash is stored as:

```text
password_hash
```

---

# 6. Administrator Creation

The controller inserts:

```text
full_name
email
password_hash
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
created_at
```

---

# 7. Registration Response

Successful registration returns:

```text
HTTP 201
```

with:

```json
{
  "success": true,
  "message": "Admin registered successfully",
  "admin": "..."
}
```

---

# 8. login()

Reads:

```text
email
password
```

from the request body.

Missing credentials return:

```text
HTTP 400
```

with:

```text
Email and password required
```

---

# 9. Administrator Lookup

The controller searches:

```text
admins
```

by email.

If the administrator does not exist, it:

```text
logs LOGIN_FAILED
checks failed-login threshold
```

and returns:

```text
HTTP 401
```

with:

```text
Invalid credentials
```

---

# 10. Password Verification

The submitted password is compared with:

```text
admin.password_hash
```

using:

```text
bcrypt.compare()
```

An incorrect password triggers:

```text
LOGIN_FAILED
```

audit logging and failed-login threshold checking.

The response is:

```text
HTTP 401
```

with:

```text
Invalid credentials
```

---

# 11. JWT Generation

Successful authentication creates a JWT containing:

```text
adminId
email
role
```

The token is signed using:

```text
process.env.JWT_SECRET
```

and expires after:

```text
4 hours
```

---

# 12. Role Permissions

After authentication, the controller retrieves permissions through:

```text
rolePermissionService.getPermissionsByRole(admin.role)
```

---

# 13. Successful Login

The controller records:

```text
IDENTITY_AUTH_SUCCESS
```

through the audit service.

It returns:

```text
HTTP 200
```

with:

```text
success
message
adminId
token
admin
permissions
```

The administrator object contains:

```text
id
full_name
email
role
```

---

# 14. forgotPassword()

Reads:

```text
email
```

from the request body.

Missing email returns:

```text
HTTP 400
```

with:

```text
Email is required
```

---

# 15. Unknown Email Handling

If the email does not exist, the controller still returns:

```text
HTTP 200
```

with:

```text
If the email exists, a reset link has been sent.
```

This avoids revealing whether an administrator account exists.

---

# 16. Reset Token

For an existing administrator, the controller creates a JWT reset token containing:

```text
adminId
email
```

The token uses:

```text
process.env.JWT_SECRET
```

and expires after:

```text
15 minutes
```

---

# 17. Reset Link

The reset URL is constructed from:

```text
process.env.FRONTEND_URL
```

with:

```text
/reset-password?token=<resetToken>
```

The reset link is sent through:

```text
sendPasswordResetEmail()
```

---

# 18. Password Reset Response

Successful email dispatch returns:

```text
HTTP 200
```

with:

```text
Reset link sent successfully
```

---

# 19. resetPassword()

Reads:

```text
token
password
```

from the request body.

Missing values return:

```text
HTTP 400
```

with:

```text
Token and password required
```

---

# 20. Reset Token Verification

The controller verifies the token using:

```text
jwt.verify()
```

and:

```text
process.env.JWT_SECRET
```

The decoded token supplies:

```text
adminId
```

---

# 21. Password Update

The new password is hashed using:

```text
bcrypt.hash(password, 10)
```

The administrator's:

```text
password_hash
```

is then updated using the decoded:

```text
adminId
```

---

# 22. Reset Success

Successful password reset returns:

```text
HTTP 200
```

with:

```text
Password reset successful
```

---

# 23. Reset Error

Invalid or expired reset tokens return:

```text
HTTP 400
```

with:

```text
Invalid or expired token
```

---

# 24. General Error Handling

Unexpected registration, login, or forgot-password errors return:

```text
HTTP 500
```

with:

```text
Server Error
```

---

# 25. Exports

The controller exports:

```text
register
login
forgotPassword
resetPassword
```

---

# 26. Summary

`authController(6).js` provides the administrator authentication layer. It handles administrator registration, bcrypt password hashing, credential verification, JWT authentication, role-based permission retrieval, failed-login monitoring, password-reset email generation, and secure password updates using short-lived reset tokens.
