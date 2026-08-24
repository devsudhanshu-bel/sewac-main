# AddUserModal Component Documentation

## File
`src/components/users/AddUserModal.jsx`

## Purpose
`AddUserModal` creates a new user through a reusable modal form.

## Inputs
```jsx
<AddUserModal
  open={...}
  onClose={...}
  title={...}
  role={...}
  onSuccess={...}
/>
```

- `open` controls visibility.
- `onClose` closes the modal.
- `title` customizes the title.
- `role` identifies the user role to create.
- `onSuccess` receives the created user after success.

## Form
The form manages:
```text
full_name
email
password
phone_number
```

## Validation
The component validates the required form values before submitting.

## API
Creation is performed through:
```text
POST /api/users
```

The role supplied by the parent is included as part of the user-creation request.

## Loading and Errors
The component prevents duplicate submissions with a loading state and displays backend/API errors in the modal.

## Success
After the backend returns the created user, `onSuccess` is called and the form/modal is reset and closed.

## Summary
`AddUserModal.jsx` is the reusable user-creation form shared by the Admin and Contractor user sections.
