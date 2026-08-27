# SuperAdminLogin.jsx Documentation

## 1. File Overview

The `SuperAdminLogin` component provides the dedicated Super Admin authentication interface.

It handles:

```text
Email input
Password input
Password visibility
Super Admin login
JWT storage
Navigation to Super Admin dashboard
Loading state
Error handling
UI animations
```

## 2. Component State

The component maintains:

```text
showPassword
email
password
loading
error
```

## 3. Super Admin Login API

On submission, the component sends:

```text
POST /api/super-admin/login
```

with:

```text
Content-Type: application/json
```

The request body contains:

```text
email
password
```

## 4. Authentication Failure

If the response is unsuccessful:

```text
error = data.message || "Invalid Credentials"
```

The error is displayed in the login interface.

## 5. Successful Authentication

A successful response is expected to provide:

```text
token
admin
```

The component stores:

```text
superAdminToken
superAdmin
```

in:

```text
sessionStorage
```

## 6. Dashboard Navigation

After successful authentication, the component navigates to:

```text
/super-admin/dashboard
```

## 7. Loading State

During authentication:

```text
loading = true
```

The button displays:

```text
SIGNING IN
```

with a loading spinner.

Otherwise:

```text
SIGN IN
```

is displayed.

## 8. Password Visibility

The password input switches between:

```text
password
text
```

using:

```text
showPassword
```

The interface uses:

```text
Eye
EyeOff
```

icons.

## 9. Error Handling

Network or unexpected errors are logged and result in:

```text
Server Error
```

being displayed.

## 10. GSAP Animations

On mount, GSAP animates:

```text
login card
logo
title
subtitle
form children
button shadow
background glow elements
```

The animations include:

```text
opacity
scale
position
rotation
shadow
```

and several repeating background effects.

## 11. UI Structure

```text
Background
   ↓
Animated Glow Effects
   ↓
Super Admin Login Card
   ├── Security Icon
   ├── SUPER ADMIN Title
   ├── Email Input
   ├── Password Input
   └── Sign In Button
```

## 12. Styling and Libraries

The component uses:

```text
Tailwind CSS
GSAP
Lucide React
Oswald
Finlandica
```

## 13. Footer

The page displays:

```text
© 2026 SEWAC Super Administrator
```

## 14. Export

The component is exported as:

```text
export default SuperAdminLogin
```

## 15. Summary

`SuperAdminLogin.jsx` implements the dedicated Super Admin login screen. It submits Super Admin credentials to the authentication endpoint, stores the returned token and administrator information in session storage, handles loading and errors, supports password visibility, and redirects successful authentication to the Super Admin dashboard.
