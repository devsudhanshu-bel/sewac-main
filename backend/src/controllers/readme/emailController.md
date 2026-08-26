# emailController(2).js Documentation

## 1. File Overview

The Email Controller exposes an endpoint for sending permission-approval emails.

It delegates email delivery to:

```text
sendPermissionApprovalEmail()
```

from the email service.

---

# 2. sendPermissionRequestEmail()

The controller receives the permission request through:

```text
req.body
```

The complete request body is passed to:

```text
sendPermissionApprovalEmail(req.body)
```

---

# 3. Successful Email Delivery

If the email service completes successfully, the controller returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "Permission email sent successfully"
}
```

---

# 4. Error Handling

If the email service throws an error, the controller:

```text
logs the error
```

and returns:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

The service error message is returned directly.

---

# 5. Export

The controller exports:

```text
sendPermissionRequestEmail
```

---

# 6. Request Flow

```text
HTTP Request
     ↓
Read req.body
     ↓
sendPermissionApprovalEmail()
     ↓
Email Sent
     ↓
HTTP 200
```

Error path:

```text
Email Service Error
     ↓
Log Error
     ↓
HTTP 500
```

---

# 7. Summary

`emailController(2).js` provides a thin HTTP wrapper around the permission-approval email service. It forwards the request body to the email service and returns standardized success or failure responses.
