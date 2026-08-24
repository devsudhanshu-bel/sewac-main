# DeleteUserModal Component Documentation

## File
`src/components/users/DeleteUserModal.jsx`

## Purpose
Confirms and permanently deletes the selected user.

## Inputs
```text
open
onClose
user
onSuccess
```

## User Name
The display name uses:
```text
user.full_name
user.name
```
with a translated fallback.

## Validation
Deletion is stopped when:
```text
user.id
```
is missing.

## API
The component sends:
```text
DELETE /api/users/:id
```

through the shared Axios instance.

## Loading
A loading state prevents duplicate deletion requests and disables close/delete controls.

## Error Handling
Errors are taken from:
```text
response.data.message
response.data.error
err.message
```
and displayed in the modal.

## Success
After deletion:
```js
onSuccess(user);
onClose();
```

## Summary
`DeleteUserModal.jsx` is the reusable destructive-action confirmation layer for Admin and Contractor user management.
