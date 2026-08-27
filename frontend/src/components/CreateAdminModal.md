# CreateAdminModal(1).jsx Documentation

## 1. File Overview

The `CreateAdminModal` component provides a modal form for creating a new administrator from the Super Admin interface.

It manages:

```text
Administrator details
Phone validation
Role selection
API submission
Loading state
Success handling
Error handling
Modal close
```

## 2. Component Props

The component receives:

```text
onClose
onSuccess
```

### onClose

Closes the modal after successful administrator creation or when the close button is selected.

### onSuccess

Refreshes the administrator list after a successful creation.

## 3. Form State

The initial form state contains:

```text
full_name = ""
email = ""
phone_number = ""
password = ""
role = "ADMIN_LAYER_2"
```

The default administrator role is therefore:

```text
ADMIN_LAYER_2
```

## 4. Form Handling

`handleChange()` reads the changed input's:

```text
name
value
```

and updates the corresponding property in the form state.

## 5. Phone Validation

Before submission, the phone number is trimmed and validated against:

```text
/^\d{10}$/
```

The value must contain exactly:

```text
10 digits
```

Invalid values trigger:

```text
Please enter a valid 10-digit phone number.
```

and stop submission.

## 6. Authentication Token

The component retrieves:

```text
superAdminToken
```

from:

```text
sessionStorage
```

The token is sent in the Authorization header as:

```text
Bearer <token>
```

## 7. Create Administrator API

The component sends:

```text
POST /api/super-admin/admins
```

with:

```text
Content-Type: application/json
Authorization: Bearer <superAdminToken>
```

## 8. Request Body

The submitted JSON contains:

```text
full_name
email
phone_number
password
role
```

The name and email are trimmed before submission.

## 9. Loading State

During submission:

```text
loading = true
```

The submit button changes from:

```text
Create Administrator
```

to:

```text
Creating...
```

The close button is also disabled.

## 10. API Success

If the response is successful, the component:

```text
shows Administrator Created Successfully
calls onSuccess()
calls onClose()
```

## 11. API Failure

For a non-successful response, the component displays the API-provided:

```text
data.message
```

or:

```text
Failed to create administrator.
```

## 12. Network Error

If the request throws an exception:

```text
Create Administrator Error
```

is logged and the user receives:

```text
Server Error
```

## 13. Form Fields

The modal contains:

```text
Full Name
Email
Phone Number
Password
Role
```

The role selector provides:

```text
Admin Layer 1
Admin Layer 2
```

## 14. UI Structure

```text
Modal Overlay
      ↓
Modal Card
      ↓
Header + Close Button
      ↓
Administrator Form
      ↓
Create Administrator Button
```

The interface uses Tailwind CSS classes and Lucide's `X` icon.

## 15. Export

The component is exported as the default export:

```text
CreateAdminModal
```

## 16. Summary

`CreateAdminModal(1).jsx` provides the Super Admin administrator-creation interface. It collects administrator information, validates the phone number, retrieves the Super Admin JWT from session storage, submits the administrator data to the backend, handles loading/errors, refreshes the administrator list, and closes the modal after successful creation.
