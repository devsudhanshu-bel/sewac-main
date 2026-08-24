# DeleteUserModal.jsx Documentation

## 1. File Overview

### File Name

`DeleteUserModal.jsx`

### File Location

`src/components/users/DeleteUserModal.jsx`

### Purpose

`DeleteUserModal` is the confirmation modal used to permanently delete a user.

It provides a confirmation message, displays the selected user's name, sends the delete request to the backend, handles errors, and notifies the parent component after successful deletion.

---

## 2. Imports

The component imports:

```js
import { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import api from "../../api/axios";
```

### `useState`

Used for:

```text
loading
error
```

### Lucide Icons

The component uses:

```text
X
Trash2
AlertTriangle
```

for close, delete, and warning UI elements.

### `useLanguage`

Provides the translation function:

```js
t()
```

### `api`

Shared Axios instance used to communicate with the backend.

---

## 3. Props

The component receives:

```js
const DeleteUserModal = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
```

### `open`

Controls whether the delete confirmation modal is displayed.

### `onClose`

Callback used to close the modal.

### `user`

Contains the user selected for deletion.

### `onSuccess`

Optional callback called after the user is successfully deleted.

---

## 4. Loading State

The component maintains:

```js
const [loading, setLoading] = useState(false);
```

This prevents duplicate deletion requests.

When deletion is running, the close, cancel, and delete controls are disabled.

---

## 5. Error State

The component maintains:

```js
const [error, setError] = useState("");
```

This stores validation and backend/API error messages.

When an error exists, it is displayed inside a red error box.

---

## 6. Conditional Rendering

The component immediately returns:

```js
if (!open || !user) return null;
```

Therefore, the modal is only rendered when:

```text
open === true
AND
user exists
```

---

## 7. User Name Resolution

The displayed name is calculated using:

```js
const userName =
  user.full_name ||
  user.name ||
  t(
    "users.modal.userFallback",
    "this user"
  );
```

The component therefore supports both:

```text
user.full_name
user.name
```

If neither exists, it displays:

```text
this user
```

---

## 8. handleDelete()

The main deletion operation is:

```js
const handleDelete = async () => {
```

The first check is:

```js
if (loading) return;
```

This prevents duplicate deletion requests.

---

## 9. User ID Validation

Before sending the API request, the component checks:

```js
if (!user.id)
```

If the ID is missing, it displays:

```text
User ID is missing.
```

using:

```text
users.modal.errors.userIdMissing
```

No deletion request is sent in this situation.

---

## 10. Loading Start

Before making the API request:

```js
setLoading(true);
setError("");
```

This:

- Enables loading state.
- Clears any previous error.

---

## 11. Backend Delete Request

The component sends:

```js
await api.delete(`/api/users/${user.id}`);
```

### HTTP Method

```text
DELETE
```

### Endpoint

```text
/api/users/:id
```

The selected user's ID is inserted into the URL.

---

## 12. Success Callback

After the delete request succeeds:

```js
if (onSuccess) {
  onSuccess(user);
}
```

The deleted user object is passed back to the parent.

This allows the parent component to remove the deleted user from its displayed list or refresh its data.

---

## 13. Successful Completion

After the success callback:

```js
onClose();
```

closes the modal.

---

## 14. Error Handling

Errors are caught using:

```js
catch (err)
```

The component logs:

```text
Delete user error:
```

to the browser console.

It then attempts to retrieve an error message from:

```text
err.response.data.message
err.response.data.error
err.message
```

If no message is available, the fallback is:

```text
Failed to delete user.
```

The final message is stored with:

```js
setError(backendMessage);
```

---

## 15. Finally Block

The component always executes:

```js
setLoading(false);
```

inside the `finally` block.

This guarantees that the loading state is cleared whether deletion succeeds or fails.

---

## 16. handleClose()

The close handler is:

```js
const handleClose = () => {
```

It first checks:

```js
if (loading) return;
```

This prevents the modal from being closed while a deletion request is running.

Then it:

```js
setError("");
onClose();
```

This clears the error and closes the modal.

---

## 17. Modal Overlay

The modal uses a full-screen overlay with:

```text
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
backdrop-blur-sm
```

This places the confirmation dialog above the Users interface.

---

## 18. Modal Size

The modal has:

```text
max-w-[440px]
```

and responsive rounded corners:

```text
rounded-[20px]
sm:rounded-[24px]
```

---

## 19. Header

The header contains:

```text
Warning Icon
Delete User title
Close button
```

The warning icon is:

```text
AlertTriangle
```

and is displayed inside a red circular background.

---

## 20. Delete Title

The title uses:

```js
t(
  "users.modal.deleteTitle",
  "Delete User"
)
```

The fallback displayed to the user is:

```text
Delete User
```

---

## 21. Close Button

The close button uses:

```text
X
```

from Lucide React.

It calls:

```js
handleClose
```

and is disabled while deletion is in progress.

---

## 22. Error Display

When:

```js
error
```

contains a message, the component renders a red error container.

The styling includes:

```text
border-red-200
bg-red-50
text-red-600
```

---

## 23. Confirmation Message

The modal asks the user to confirm deletion.

The message is built using:

```js
t(
  "users.modal.deleteConfirmation",
  "Are you sure you want to permanently delete"
)
```

followed by the selected user's name.

The user's name is displayed with:

```text
font-semibold
text-gray-900
```

---

## 24. Permanent Deletion Warning

The modal also displays:

```text
This action will permanently remove this user from the system and cannot be undone.
```

This warning makes the destructive nature of the operation explicit before confirmation.

The translation key is:

```text
users.modal.deleteWarning
```

---

## 25. Cancel Button

The Cancel button:

```js
onClick={handleClose}
```

and is disabled while deletion is running.

Its label is:

```text
Cancel
```

through:

```text
users.modal.cancel
```

---

## 26. Delete Button

The Delete button:

```js
onClick={handleDelete}
```

and is disabled while loading.

It contains:

```text
Trash2
```

and displays:

```text
Delete
```

during normal operation.

While the request is running it displays:

```text
Deleting...
```

---

## 27. Translation Support

The component uses:

```js
const { t } = useLanguage();
```

Translation keys include:

```text
users.modal.userFallback
users.modal.errors.userIdMissing
users.modal.errors.deleteFailed
users.modal.deleteTitle
users.modal.close
users.modal.deleteConfirmation
users.modal.deleteWarning
users.modal.cancel
users.modal.deleting
users.modal.delete
```

Each key has fallback English text.

---

## 28. Complete Data Flow

```text
User Table
     ↓
Select Delete
     ↓
DeleteUserModal Opens
     ↓
Display Selected User
     ↓
User Confirms Delete
     ↓
Validate User ID
     ↓
DELETE /api/users/:id
     ↓
Backend Response
     ↓
onSuccess(user)
     ↓
Close Modal
```

---

## 29. Error Flow

```text
Delete
  ↓
Check loading
  ↓
Check user.id
  ↓
Missing?
 └── Yes → Display "User ID is missing."
  ↓
API Request
  ↓
Request Fails?
 └── Yes → Extract Error Message
             ↓
          Display Error
  ↓
finally
  ↓
setLoading(false)
```

---

## 30. Duplicate Request Prevention

The component prevents repeated deletion requests using:

```js
if (loading) return;
```

The Delete button is also disabled while the request is running.

This prevents accidental double-clicks from creating multiple delete requests.

---

## 31. Parent Integration

The component communicates with its parent through:

```text
onClose
onSuccess
```

### `onClose`

Closes the modal.

### `onSuccess`

Receives the deleted user:

```js
onSuccess(user);
```

The parent can then update the Users table.

---

## 32. Complete Component Responsibility

`DeleteUserModal.jsx` handles:

- Delete confirmation UI.
- Selected-user name display.
- User ID validation.
- DELETE API request.
- Loading state.
- Duplicate-submit prevention.
- API error handling.
- Success callback.
- Modal closing.
- Translation support.
- Responsive modal styling.

---

## 33. Summary

`DeleteUserModal.jsx` is the destructive-action confirmation component for the Users module.

It sends:

```text
DELETE /api/users/:id
```

for the selected user and provides a controlled flow:

```text
Confirm
  ↓
Validate
  ↓
Delete
  ↓
onSuccess
  ↓
Close
```

If the request fails, the error is displayed inside the modal and the user remains able to retry or close the dialog.
