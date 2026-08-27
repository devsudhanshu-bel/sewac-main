# deviceFingerprint.js Documentation

## 1. File Overview

The `deviceFingerprint.js` module collects browser and device characteristics and returns them as a fingerprint-data object.

The collected information can be used by the frontend device-management and verification workflow.

---

# 2. getDeviceFingerprint()

The module exports:

```text
getDeviceFingerprint()
```

The function does not accept any arguments.

It reads device information directly from browser APIs.

---

# 3. Browser Information

The function collects:

```text
userAgent
platform
language
timezone
```

### userAgent

Obtained from:

```text
navigator.userAgent
```

This identifies the browser's user-agent string.

### platform

Obtained from:

```text
navigator.platform
```

### language

Obtained from:

```text
navigator.language
```

### timezone

Obtained from:

```text
Intl.DateTimeFormat().resolvedOptions().timeZone
```

---

# 4. Screen Information

The function collects:

```text
screenWidth
screenHeight
colorDepth
```

from:

```text
window.screen
```

Specifically:

```text
window.screen.width
window.screen.height
window.screen.colorDepth
```

---

# 5. Hardware Information

The function collects:

```text
hardwareConcurrency
deviceMemory
```

### hardwareConcurrency

Obtained from:

```text
navigator.hardwareConcurrency
```

If unavailable, the fallback value is:

```text
0
```

### deviceMemory

Obtained from:

```text
navigator.deviceMemory
```

If unavailable, the fallback value is:

```text
0
```

---

# 6. Browser Capability Information

The function also collects:

```text
cookieEnabled
touchPoints
```

### cookieEnabled

Obtained from:

```text
navigator.cookieEnabled
```

This indicates whether cookies are enabled in the browser.

### touchPoints

Obtained from:

```text
navigator.maxTouchPoints
```

If unavailable, the fallback value is:

```text
0
```

---

# 7. Returned Object

The function returns an object containing:

```text
{
  userAgent,
  platform,
  language,
  timezone,
  screenWidth,
  screenHeight,
  colorDepth,
  hardwareConcurrency,
  deviceMemory,
  cookieEnabled,
  touchPoints
}
```

---

# 8. Data Collection Flow

```text
getDeviceFingerprint()
        ↓
Read Browser Information
        ↓
Read Screen Information
        ↓
Read Hardware Information
        ↓
Read Browser Capabilities
        ↓
Return Fingerprint Object
```

---

# 9. Integration

The returned object can be supplied to the backend device-management workflow as device fingerprint information.

The function itself does not:

```text
hash the data
send an API request
store the fingerprint
authenticate the device
```

It only collects and returns the browser/device attributes.

---

# 10. Export

The module provides:

```text
getDeviceFingerprint
```

as a named export.

---

# 11. Summary

`deviceFingerprint.js` provides a frontend utility for collecting browser, screen, hardware, and browser-capability attributes. `getDeviceFingerprint()` returns these values as a structured object, which can then be used by the application's device registration and verification workflow.
