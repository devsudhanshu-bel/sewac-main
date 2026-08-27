# ForgotPassword.jsx Documentation

## 1. File Overview

The `ForgotPassword` component provides the administrator password-reset request interface.

It:

```text
Collects administrator email
Sends reset request
Displays loading state
Displays success/error messages
Provides animated UI
```

## 2. Component State

The component maintains:

```text
loading
error
success
email
```

Initial values are:

```text
loading = false
error = ""
success = ""
email = ""
```

## 3. Animation References

The component creates references for:

```text
card
logo
title
subtitle
form
button
bgGlow1
bgGlow2
bgGlow3
```

These are used by GSAP animations.

## 4. GSAP Entrance Animation

On mount, the card animates from:

```text
opacity = 0
scale = 0.85
y = 50
```

to:

```text
opacity = 1
scale = 1
y = 0
```

Additional animations are applied to the logo, title, subtitle, and form children.

## 5. Button Animation

The submit button receives a repeating shadow animation using:

```text
gsap.to()
```

with:

```text
repeat = -1
yoyo = true
```

## 6. Background Animations

Three background glow elements are animated independently.

Their animations modify:

```text
x
y
scale
```

with repeating sine-based motion.

## 7. Password Reset Request

`handleSubmit()` sends:

```text
POST /api/auth/forgot-password
```

The request includes:

```text
Content-Type: application/json
```

and the body:

```json
{
  "email": "<email>"
}
```

## 8. Loading State

At submission:

```text
loading = true
error = ""
success = ""
```

The button changes from:

```text
SEND RESET LINK
```

to:

```text
SENDING...
```

with a loading icon.

## 9. Successful Request

If the API response is successful:

```text
success =
"Reset link sent successfully. Please check your email."
```

The success message is rendered in a green notification box.

## 10. API Error

For a non-successful response:

```text
error = data.message || "Failed to send reset link"
```

The error is displayed in a red notification box.

## 11. Network Error

If the request fails:

```text
error = "Server connection failed"
```

## 12. Form

The interface contains:

```text
Email Address
Send Reset Link
```

The email input is required and uses:

```text
type = email
```

## 13. Styling and Libraries

The component uses:

```text
Tailwind CSS
GSAP
Lucide React
Oswald
Finlandica
```

The page uses a purple/pink gradient background with animated glow effects.

## 14. Footer

The page displays:

```text
© 2026 SEWAC RFID System
```

## 15. Export

The component is exported as:

```text
export default ForgotPassword
```

## 16. Summary

`ForgotPassword.jsx` provides the administrator password-reset request screen. It collects an email address, submits it to the authentication API, handles loading and API/network errors, displays success feedback, and uses GSAP-driven animations for the interface.
