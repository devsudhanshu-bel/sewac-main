# Login(2).jsx Documentation

## 1. File Overview

The `Login` component implements the SEWAC administrator login interface and authentication flow.

The flow consists of:

```text
Identity Authentication
        ↓
Worker Role Check
        ↓
Device Verification
        ↓
Unknown Device Registration
        ↓
Successful Authentication
        ↓
SEWAC Redirect
```

Behavioral authentication and risk evaluation are explicitly removed from the current flow.

## 2. Component State

The component maintains:

```text
showPassword
email
password
loading
error
message
```

## 3. Identity Authentication

The component sends:

```text
POST /api/auth/login
```

with:

```json
{
  "email": "<email>",
  "password": "<password>"
}
```

The response is expected to contain:

```text
token
admin
permissions
```

## 4. Authentication Failure

If the login response is not successful:

```text
error = data.message || "Invalid credentials"
```

The login process stops.

If the response does not provide:

```text
token
admin
```

the component displays:

```text
Authentication Failed
```

## 5. Worker Login

If:

```text
tempAdmin.role === "WORKER"
```

the device-verification step is bypassed.

The component stores:

```text
token
admin
permissions
```

in session storage and redirects directly to the SEWAC frontend callback:

```text
/auth/callback?token=<token>
```

## 6. Device Fingerprint

For non-worker administrators, the component calls:

```text
getDeviceFingerprint()
```

The resulting fingerprint is used for device verification.

## 7. Device Verification

The component sends:

```text
POST /api/devices/verify
```

with:

```text
Authorization: Bearer <tempToken>
Content-Type: application/json
```

and:

```json
{
  "fingerprint": "<fingerprint>"
}
```

## 8. Verification Failure

If:

```text
device.success === false
```

the component removes:

```text
token
admin
permissions
```

from session storage and displays the device error message.

## 9. Unknown Device

If:

```text
device.known === false
```

the component determines the browser from the user agent:

```text
Microsoft Edge
Google Chrome
Mozilla Firefox
Safari
Unknown Browser
```

It also determines the operating system:

```text
Windows
macOS
Linux
Unknown OS
```

A device name is constructed as:

```text
<browser> (<os>)
```

## 10. Device Registration Request

The component sends:

```text
POST /api/devices/request-registration
```

with the authenticated temporary token.

The body contains:

```text
device_name
fingerprint
```

The backend response message is shown to the user.

Authentication data is removed from session storage after the registration request.

## 11. Known Device

When the device is known and verification succeeds, the component stores:

```text
token
admin
permissions
```

in session storage.

It then redirects to:

```text
https://sewac-main-frontend.onrender.com/auth/callback?token=<token>
```

## 12. Behavioral Authentication

The current implementation explicitly states that:

```text
Behavioral authentication has been removed.
```

No behavioral authentication step is executed.

## 13. Risk Evaluation

The successful-authentication flow explicitly states:

```text
No risk evaluation.
```

The component therefore does not perform a risk-evaluation step before redirecting.

## 14. Forgot Password

A button navigates to:

```text
/forgot-password
```

using React Router's:

```text
navigate()
```

## 15. Password Visibility

The password field can switch between:

```text
password
text
```

using:

```text
showPassword
```

The UI toggles between:

```text
Eye
EyeOff
```

icons.

## 16. UI Animation

GSAP animates:

```text
login card
logo
title
subtitle
form children
button shadow
background glows
```

## 17. Error and Message Display

The interface provides separate areas for:

```text
message
error
```

Messages are displayed in styled notification containers.

## 18. Styling

The component uses:

```text
Tailwind CSS
GSAP
Lucide React
Oswald
Finlandica
```

## 19. Export

The component is exported as:

```text
export default Login
```

## 20. Summary

`Login(2).jsx` implements the main SEWAC administrator authentication flow. It authenticates credentials, handles the worker bypass, verifies registered devices for other administrators, initiates device registration for unknown devices, stores authentication data for verified users, and redirects successful users to the SEWAC frontend. Behavioral authentication and risk evaluation are not part of the current implementation.
