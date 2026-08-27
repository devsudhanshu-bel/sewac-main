# emailService(3).js Documentation

## 1. File Overview

The Email Service provides centralized email delivery and several application-specific email functions.

It uses:

```text
axios
Brevo SMTP API
```

The configured sender is:

```text
SEWAC CMADS
```

---

# 2. sendEmail()

`sendEmail()` is the common email-delivery function.

It accepts:

```text
to
subject
html
```

---

# 3. Brevo API

Email is sent through:

```text
https://api.brevo.com/v3/smtp/email
```

using an HTTP POST request.

The request contains:

```text
sender
to
subject
htmlContent
```

---

# 4. Sender Configuration

The sender email is read from:

```text
process.env.SENDER_EMAIL
```

The Brevo API key is read from:

```text
process.env.BREVO_API_KEY
```

---

# 5. Brevo Request Headers

The request sends:

```text
accept: application/json
content-type: application/json
api-key: process.env.BREVO_API_KEY
```

---

# 6. Email Logging

Before sending, the service logs:

```text
TO
SUBJECT
SENDER
API KEY EXISTS
```

The API key itself is not printed; only whether the environment variable exists is logged.

---

# 7. Brevo Success

On successful delivery, the Brevo response data is logged and returned.

---

# 8. Brevo Error Handling

If Brevo returns an error, the service logs:

```text
BREVO ERROR STATUS
BREVO ERROR DATA
BREVO ERROR MESSAGE
```

The original error is then rethrown.

---

# 9. sendPasswordResetEmail()

Creates a password-reset HTML email containing:

```text
Password Reset heading
Reset Password button
15-minute expiry message
```

The reset link is supplied by the caller.

Subject:

```text
CMADS Password Reset
```

---

# 10. sendSecurityAlert()

Creates a security-alert email containing:

```text
Layer
Severity
Type
Description
IP Address
Timestamp
```

The timestamp is generated using:

```text
new Date().toISOString()
```

The recipient is:

```text
process.env.ADMIN_EMAIL
```

The subject follows:

```text
[<severity>] CMADS <layer> Alert
```

---

# 11. sendPermissionApprovalEmail()

Creates an approval email containing:

```text
requesterName
requesterEmail
module
action
target
reason
```

It provides two action links:

```text
APPROVE
REJECT
```

The recipient is:

```text
process.env.ADMIN_EMAIL
```

Subject:

```text
SEWAC Permission Approval
```

---

# 12. sendDeviceRegistrationEmail()

Creates a device-registration approval email for:

```text
recipientEmail
adminName
token
```

The approval link is constructed using:

```text
process.env.FRONTEND_URL
```

and:

```text
/approve-device?token=<token>
```

The email states that the approval link expires in:

```text
60 minutes
```

Subject:

```text
CMADS - New Device Registration
```

---

# 13. Email Function Summary

| Function | Purpose | Recipient |
|---|---|---|
| `sendEmail` | Generic Brevo email delivery | Supplied recipient |
| `sendPasswordResetEmail` | Password reset | Supplied recipient |
| `sendSecurityAlert` | Security notification | `ADMIN_EMAIL` |
| `sendPermissionApprovalEmail` | Permission approval | `ADMIN_EMAIL` |
| `sendDeviceRegistrationEmail` | Device approval | Supplied recipient |

---

# 14. Execution Flow

```text
Application Service
       ↓
Specific Email Function
       ↓
Build HTML
       ↓
sendEmail()
       ↓
Brevo SMTP API
       ↓
Email Delivery
```

---

# 15. Exports

The module exports:

```text
sendSecurityAlert
sendPermissionApprovalEmail
sendPasswordResetEmail
sendDeviceRegistrationEmail
```

`sendEmail()` is used internally and is not included in the exported object.

---

# 16. Summary

`emailService(3).js` centralizes Brevo-based email delivery for the CMADS/SEWAC application. It provides password-reset, security-alert, permission-approval, and device-registration email functions, all routed through the common `sendEmail()` implementation.
