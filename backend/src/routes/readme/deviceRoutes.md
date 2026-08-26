# deviceRoutes.js Documentation

## 1. File Overview

The Device Routes module defines Express endpoints for administrator device registration, approval, verification, listing, and revocation.

It uses:

```text
authMiddleware
deviceController
```

---

# 2. Router Initialization

An Express router is created using:

```text
express.Router()
```

---

# 3. Device Registration Request

The route is:

```text
POST /request-registration
```

Middleware:

```text
authenticate
```

Controller:

```text
requestDeviceRegistration
```

### Flow

```text
POST /request-registration
        ↓
authenticate
        ↓
requestDeviceRegistration
        ↓
Device Registration Request
```

---

# 4. Device Verification

The route is:

```text
POST /verify
```

Middleware:

```text
authenticate
```

Controller:

```text
verifyDevice
```

### Flow

```text
POST /verify
      ↓
authenticate
      ↓
verifyDevice
      ↓
Device Verification
```

---

# 5. Device Approval

The route is:

```text
GET /approve
```

Controller:

```text
approveDeviceRegistration
```

No authentication middleware is attached to this route.

The route therefore allows the approval controller to process its registration token directly.

### Flow

```text
GET /approve
      ↓
approveDeviceRegistration
      ↓
Device Approval
```

---

# 6. Device Listing

The route is:

```text
GET /list
```

Middleware:

```text
authenticate
```

Controller:

```text
listDevices
```

### Flow

```text
GET /list
     ↓
authenticate
     ↓
listDevices
     ↓
Registered Devices
```

---

# 7. Device Revocation

The route is:

```text
PUT /revoke/:deviceId
```

Middleware:

```text
authenticate
```

Controller:

```text
revokeDevice
```

The device identifier is supplied through:

```text
req.params.deviceId
```

### Flow

```text
PUT /revoke/:deviceId
          ↓
authenticate
          ↓
revokeDevice
          ↓
Device Revocation
```

---

# 8. Route Summary

| Method | Route | Middleware | Controller |
|---|---|---|---|
| POST | `/request-registration` | `authenticate` | `requestDeviceRegistration` |
| POST | `/verify` | `authenticate` | `verifyDevice` |
| GET | `/approve` | None | `approveDeviceRegistration` |
| GET | `/list` | `authenticate` | `listDevices` |
| PUT | `/revoke/:deviceId` | `authenticate` | `revokeDevice` |

---

# 9. Authentication Coverage

Protected routes:

```text
/request-registration
/verify
/list
/revoke/:deviceId
```

Unprotected route:

```text
/approve
```

The approval endpoint does not use `authenticate` because the approval flow is handled through the device registration mechanism in the controller.

---

# 10. Export

The router is exported as:

```text
module.exports = router
```

---

# 11. Complete Flow

```text
Device Request
      ↓
Express Router
      ↓
authenticate (where configured)
      ↓
deviceController
      ↓
Device Operation
      ↓
Response
```

---

# 12. Summary

`deviceRoutes.js` defines the Express routing layer for administrator device management. It provides routes for requesting device registration, verifying devices, approving registration tokens, listing registered devices, and revoking devices. Authentication middleware protects all device-management routes except the approval endpoint.
