# EditUserModal Component Documentation

## File
`src/components/users/EditUserModal.jsx`

## Purpose
Edits an existing user.

## Inputs
```text
open
onClose
user
title
onSuccess
```

## Editable Fields
The form manages:
```text
full_name
phone_number
```

The user's email is displayed as read-only and is not part of the update payload.

## Existing Data
When the modal opens for a selected user, the current name and phone values are loaded into the form.

## Validation
The component validates:
```text
Full name
Phone number
User ID
```

## API
The update request is:
```text
PUT /api/users/:id
```

with:
```js
{
  full_name,
  phone_number
}
```

## Success
The returned updated user is passed to:
```text
onSuccess(updatedUser)
```

and the modal resets and closes.

## Errors
Backend/API error messages are displayed inside the modal.

## Summary
`EditUserModal.jsx` is the shared user-editing modal used by the Admin and Contractor sections.
