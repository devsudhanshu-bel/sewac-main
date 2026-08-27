# permissionService(20260827-033511).js Documentation

## 1. File Overview

The Permission Service handles creation of administrator edit/permission requests and retrieval of role-based permissions.

It integrates:

```text
Prisma
JWT
Permission Configuration
Email Service
```

---

# 2. Prisma Client

The service initializes:

```text
PrismaClient
```

from:

```text
../generated/cmads
```

---

# 3. requestPermission()

The function receives the complete Express request:

```text
req
```

It extracts from:

```text
req.body
```

the following fields:

```text
requested_by_admin_id
module
action
target_identifier
reason
```

---

# 4. Permission Request Creation

A new record is created in:

```text
edit_requests
```

using Prisma:

```text
prisma.edit_requests.create()
```

The supplied fields are stored as:

```text
requested_by_admin_id
module
action
target_identifier
reason
```

---

# 5. Approval Token

After the request is created, a JWT approval token is generated.

The token payload contains:

```text
requestId
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

# 6. Token Storage

The generated approval token is written back to the same:

```text
edit_requests
```

record through:

```text
prisma.edit_requests.update()
```

The field updated is:

```text
approval_token
```

---

# 7. Return Value

The function returns:

```text
request
approvalToken
```

---

# 8. getPermissionsByRole()

The service also defines:

```text
getPermissionsByRole(role)
```

It reads from:

```text
ROLE_ACCESS
```

and returns:

```text
ROLE_ACCESS[role]
```

If the role is not configured, it returns:

```text
{}
```

---

# 9. Execution Flow

Permission request:

```text
Request Body
     ↓
Create edit_requests Record
     ↓
Generate 15-minute JWT
     ↓
Store approval_token
     ↓
Return Request + Token
```

Permission lookup:

```text
Role
 ↓
ROLE_ACCESS
 ↓
Permissions
```

---

# 10. Email Integration

The file imports:

```text
sendPermissionApprovalEmail
```

from the email service.

The imported function is not invoked within the currently defined `requestPermission()` implementation.

---

# 11. Exports

The source exports:

```text
getPermissionsByRole
```

through:

```text
exports.getPermissionsByRole
```

The `requestPermission` function is declared but is not included in the final explicit export object shown in the file.

---

# 12. Summary

`permissionService(20260827-033511).js` manages creation of edit/permission requests and role-permission lookup. It persists requests in `edit_requests`, generates a 15-minute JWT approval token, stores that token with the request, returns the request and token, and exposes configured role permissions through `ROLE_ACCESS`.
