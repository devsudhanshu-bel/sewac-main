# ResetPassword.jsx Documentation

## 1. File Overview

The `ResetPassword` component provides the administrator password-reset interface.

It:

```text
Reads reset token
Collects new password
Collects password confirmation
Validates matching passwords
Submits reset request
Displays success/error states
Redirects to login after success
```

## 2. Reset Token

The component reads the token from the URL query parameters using:

```text
useSearchParams()
```

The token is retrieved through:

```text
searchParams.get("token")
```

## 3. Component State

The component maintains:

```text
password
confirmPassword
loading
error
success
```

## 4. Password Matching

Before the API request, the component checks:

```text
password === confirmPassword
```

If they do not match:

```text
error = "Passwords do not match"
loading = false
```

and the API request is not performed.

## 5. Password Reset API

The component sends:

```text
POST /api/auth/reset-password
```

with:

```text
Content-Type: application/json
```

The request body contains:

```text
token
password
```

## 6. Successful Reset

If the response is successful:

```text
success =
"Password reset successful. Redirecting to login..."
```

The component waits:

```text
3 seconds
```

and navigates to:

```text
/
```

## 7. API Failure

For a non-successful response:

```text
error = data.message
```

The error is displayed to the user.

## 8. Network Error

If the API request throws an exception:

```text
error = "Reset failed"
```

## 9. Loading State

While submitting, the button displays:

```text
RESETTING...
```

with a loading spinner.

Otherwise it displays:

```text
RESET PASSWORD
```

## 10. Form Fields

The form contains:

```text
New Password
Confirm Password
Reset Password
```

Both password fields use:

```text
type = password
```

## 11. GSAP Animations

The component animates:

```text
card
logo
button
background glow elements
```

The animations include:

```text
opacity
scale
position
rotation
box shadow
```

with repeating background and button effects.

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
© 2026 SEWAC RFID System
```

## 14. Export

The component is exported as:

```text
export default ResetPassword
```

## 15. Summary

`ResetPassword.jsx` provides the final password-reset interface. It obtains the reset token from the URL, validates that the new and confirmation passwords match, submits the token and new password to the authentication API, displays the resulting status, and redirects the user to login after a successful reset.
