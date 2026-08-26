# permissionController.js Documentation

## 1. File Overview

The Permission Controller manages permission-request operations.

It delegates the actual permission workflow to:

```text
permissionService
```

The available operations are:

```text
Request Permission
Approve Permission
Reject Permission
```

---

# 2. requestPermission()

Calls:

```text
permissionService.requestPermission(req)
```

The complete Express request object is passed to the service.

---

# 3. Successful Permission Request

A successful request returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "data": "..."
}
```

---

# 4. Request Permission Error

Unexpected errors return:

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

# 5. approvePermission()

Reads the permission token from:

```text
req.params.token
```

and passes it to:

```text
permissionService.approvePermission(token)
```

---

# 6. Successful Approval

A successful approval returns a JSON response containing:

```text
success: true
data
```

No explicit status is supplied, so the default successful Express response is used.

---

# 7. Approval Error

Approval failures return:

```text
HTTP 400
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

---

# 8. rejectPermission()

The method currently has an empty implementation:

```text
async (req, res) => {}
```

Therefore no rejection workflow is currently implemented in this controller.

---

# 9. Complete Flow

```text
Request Permission
      ↓
permissionService.requestPermission()
      ↓
HTTP 200 / 500
```

```text
Approve Permission
      ↓
Read token
      ↓
permissionService.approvePermission()
      ↓
HTTP 200 / 400
```

```text
Reject Permission
      ↓
Currently no implementation
```

---

# 10. Summary

`permissionController.js` provides the HTTP layer for permission requests and approvals. It delegates permission logic to `permissionService`, returns structured success/error responses, and currently contains an unimplemented `rejectPermission` handler.
