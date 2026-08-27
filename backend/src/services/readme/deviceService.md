# deviceService.js Documentation

## 1. File Overview

The Device Service generates a deterministic device fingerprint from browser/device characteristics.

It uses:

```text
crypto
```

from Node.js.

---

# 2. generateFingerprint()

The function receives:

```text
req
```

and reads:

```text
req.body.fingerprint
```

If no fingerprint object is supplied, an empty object is used.

---

# 3. Fingerprint Attributes

The fingerprint is constructed from:

```text
userAgent
platform
language
timezone
screenWidth
screenHeight
colorDepth
hardwareConcurrency
deviceMemory
cookieEnabled
touchPoints
```

---

# 4. Fingerprint String

The values are concatenated in a fixed order using:

```text
|
```

as the separator.

The resulting string therefore represents the supplied device/browser characteristics in a consistent format.

---

# 5. SHA-256 Hash

The fingerprint string is hashed using:

```text
crypto.createHash("sha256")
```

The final digest is encoded as:

```text
hex
```

The returned value is therefore a SHA-256 hexadecimal fingerprint.

---

# 6. Execution Flow

```text
req.body.fingerprint
        ↓
Read Device Attributes
        ↓
Join Values With "|"
        ↓
SHA-256 Hash
        ↓
Hex Digest
        ↓
Return Fingerprint
```

---

# 7. Export

The module exports:

```text
generateFingerprint
```

The source contains the export declaration twice; both declarations expose the same function.

---

# 8. Summary

`deviceService.js` converts a collection of browser/device attributes into a deterministic SHA-256 hexadecimal fingerprint. The resulting fingerprint can be used by the device-management workflow to identify a device consistently across requests.
