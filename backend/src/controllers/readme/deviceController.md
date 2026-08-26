# deviceController.js Documentation

## 1. File Overview

The Device Controller manages administrator device registration, approval, verification, listing, and revocation.

It integrates:

```text
PostgreSQL
Crypto
Email Service
Device Service
Audit Service
Alert Service
```

The device lifecycle is:

```text
Registration Request
        ↓
PENDING
        ↓
Email Approval
        ↓
ACTIVE
        ↓
Verification
        ↓
REVOKED
```

---

# 2. requestDeviceRegistration()

The administrator ID is obtained from:

```text
req.admin.adminId
```

The request body provides:

```text
device_name
```

---

# 3. Device Fingerprint

A device fingerprint is generated using:

```text
generateFingerprint(req)
```

This fingerprint is used to identify the requesting device for the administrator.

---

# 4. Registration Token

A cryptographically secure token is generated using:

```text
crypto.randomBytes(32)
```

The token is converted to hexadecimal.

Only the SHA-256 hash of the token is stored:

```text
registration_token_hash
```

The original token is used for the approval email.

---

# 5. Token Expiry

Registration tokens are valid for:

```text
60 minutes
```

The expiry is stored in:

```text
token_expires_at
```

---

# 6. Existing Device

The controller searches `devices` using:

```text
admin_id
device_fingerprint
```

If the device already exists and has:

```text
status = PENDING
```

with a still-valid token, the controller returns:

```text
HTTP 200
```

and informs the administrator that the registration email has already been sent.

---

# 7. Existing Expired or Revoked Device

If an existing device does not have a valid pending registration, its registration information is refreshed:

```text
registration_token_hash
token_expires_at
status = PENDING
device_name
```

---

# 8. New Device

A new device is inserted with:

```text
admin_id
device_fingerprint
device_name
trust_score = 50
status = PENDING
registration_token_hash
token_expires_at
```

---

# 9. Administrator Lookup

The controller retrieves:

```text
full_name
email
```

from:

```text
admins
```

If the administrator is not found:

```text
HTTP 404
```

is returned.

---

# 10. Registration Email

The approval token is sent using:

```text
sendDeviceRegistrationEmail()
```

The event is recorded as:

```text
DEVICE_REGISTRATION_REQUESTED
```

---

# 11. Registration Response

Successful requests return:

```text
HTTP 200
```

with:

```text
A device approval email has been sent to your registered email address.
```

---

# 12. approveDeviceRegistration()

Reads:

```text
req.query.token
```

If the token is missing:

```text
HTTP 400
```

is returned.

---

# 13. Token Verification

The received token is hashed using SHA-256.

The hash is matched against:

```text
registration_token_hash
```

for a device whose status is:

```text
PENDING
```

---

# 14. Invalid Registration Link

If no matching pending device exists:

```text
HTTP 400
```

with:

```text
Invalid or expired registration link.
```

---

# 15. Registration Expiry

If the token has expired:

```text
HTTP 400
```

with:

```text
Registration link has expired.
```

---

# 16. Device Activation

A successfully approved device is updated to:

```text
status = ACTIVE
trust_score = 80
registration_token_hash = NULL
token_expires_at = NULL
first_seen = NOW()
last_seen = NOW()
```

The event:

```text
DEVICE_APPROVED
```

is logged.

---

# 17. Approval Response

Successful approval returns:

```text
HTTP 200
```

with:

```text
Device approved successfully. You can now log in from this device.
```

---

# 18. verifyDevice()

Uses:

```text
req.admin.adminId
```

and:

```text
generateFingerprint(req)
```

to identify the current device.

---

# 19. Revoked Device Detection

A device is considered revoked when:

```text
admin_id matches
device_fingerprint matches
status = REVOKED
```

A revoked-device attempt:

```text
logs REVOKED_DEVICE_ATTEMPT
creates a CRITICAL DEVICE alert
```

and returns:

```text
HTTP 403
```

with:

```text
Revoked device detected
```

---

# 20. Active Device Detection

The controller searches for:

```text
status = ACTIVE
```

using the administrator ID and fingerprint.

---

# 21. Trust Score Update

For a known active device:

```text
trust_score + 2
```

is calculated and capped at:

```text
80
```

The device's:

```text
last_seen
trust_score
```

are updated.

---

# 22. Known Device Audit

The event:

```text
KNOWN_DEVICE_DETECTED
```

is logged.

The response contains:

```text
success
known = true
trust_score
device
```

---

# 23. Unknown Device

If the device is neither revoked nor active, the controller returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "known": false,
  "trust_score": 0
}
```

The currently active unknown-device logging/alert block is commented out.

---

# 24. listDevices()

Uses:

```text
req.admin.adminId
```

to retrieve all administrator devices.

Records are ordered by:

```text
last_seen DESC
```

---

# 25. List Response

Successful requests return:

```text
HTTP 200
```

with:

```text
success
count
devices
```

---

# 26. revokeDevice()

Reads:

```text
req.params.deviceId
```

and ensures the device belongs to:

```text
req.admin.adminId
```

If the device does not exist:

```text
HTTP 404
```

is returned.

---

# 27. Device Revocation

The selected device is updated to:

```text
status = REVOKED
```

The event:

```text
DEVICE_REVOKED
```

is recorded.

---

# 28. Revocation Response

Successful revocation returns:

```text
HTTP 200
```

with:

```text
Device revoked successfully
```

---

# 29. Exports

The controller exports:

```text
requestDeviceRegistration
approveDeviceRegistration
verifyDevice
listDevices
revokeDevice
```

---

# 30. Summary

`deviceController.js` implements the administrator device-trust lifecycle. It securely generates and hashes registration tokens, sends device approval emails, activates approved devices, verifies fingerprints, increases trust scores for known devices, blocks revoked devices, lists registered devices, and supports explicit device revocation.
