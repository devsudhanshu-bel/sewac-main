# EditUserModal.jsx Documentation

## 1. File Overview

### File Name

`EditUserModal.jsx`

### File Location

`src/components/users/EditUserModal.jsx`

### Purpose

`EditUserModal` is the modal component used to edit an existing user.

It allows the user to update:

- Full Name
- Phone Number

The user's Email is displayed but cannot be changed.

The component communicates with the backend through the shared Axios instance and updates the user using the user's ID.

---

## 2. Imports

The component imports:

```js
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../api/axios";
import { useLanguage } from "../../i18n";
```

### `useEffect`

Used to load the selected user's current information whenever the modal opens or the selected user changes.

### `useState`

Used for:

```text
form
loading
error
```

### `X`

Lucide icon used for the modal close button.

### `api`

Shared Axios instance used to send the update request to the backend.

### `useLanguage`

Provides the translation function:

```js
t()
```

for multilingual UI text.

---

## 3. Props

The component receives:

```js
const EditUserModal = ({
  open,
  onClose,
  user,
  title,
  onSuccess,
}) => {
```

### `open`

Controls whether the modal should be displayed.

### `onClose`

Callback used to close the modal.

### `user`

Contains the selected user's existing information.

### `title`

Optional custom modal title.

If no title is supplied, the component uses:

```text
Edit User
```

### `onSuccess`

Optional callback executed after the backend successfully updates the user.

---

## 4. Form State

The component initializes:

```js
const [form, setForm] = useState({
  full_name: "",
  phone_number: "",
});
```

The editable fields are:

```text
full_name
phone_number
```

The email is not included in the editable form state because it is read-only.

---

## 5. Loading State

The component maintains:

```js
const [loading, setLoading] = useState(false);
```

This prevents duplicate submissions and disables controls while the update request is running.

---

## 6. Error State

The component maintains:

```js
const [error, setError] = useState("");
```

This is used to display validation errors and backend/API errors inside the modal.

---

## 7. Loading Existing User Data

The component uses:

```js
useEffect(() => {
  if (open && user) {
    ...
  }
}, [open, user]);
```

When the modal opens and a user is supplied, the form is populated.

### Full Name

The component checks:

```js
user.full_name || user.name || ""
```

This supports both `full_name` and `name` user properties.

### Phone Number

The component checks:

```js
user.phone_number || user.phone || ""
```

This supports both `phone_number` and `phone` user properties.

The error and loading states are also reset when the selected user/modal state changes.

---

## 8. resetAndClose()

The function:

```js
const resetAndClose = () => {
```

performs four actions.

### 1. Clears Error

```js
setError("");
```

### 2. Resets Loading

```js
setLoading(false);
```

### 3. Resets Form

```js
setForm({
  full_name: "",
  phone_number: "",
});
```

### 4. Closes Modal

```js
onClose();
```

This ensures the next time the modal opens it does not retain stale information from the previous user.

---

## 9. handleChange()

The input handler is:

```js
const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (error) {
    setError("");
  }
};
```

It updates the corresponding field dynamically using the input's `name`.

For example:

```text
name="full_name"
```

updates:

```text
form.full_name
```

and:

```text
name="phone_number"
```

updates:

```text
form.phone_number
```

When the user starts editing again, an existing error message is cleared.

---

## 10. handleSubmit()

The main update operation is handled by:

```js
const handleSubmit = async (e) => {
```

The form submission is prevented from refreshing the page:

```js
e.preventDefault();
```

---

## 11. Duplicate Submission Prevention

Before processing the request:

```js
if (loading) return;
```

This prevents another update request from being submitted while the previous request is still running.

---

## 12. Input Preparation

The component trims the values:

```js
const fullName = form.full_name.trim();
const phone = form.phone_number.trim();
```

This removes unnecessary whitespace before validation and submission.

---

## 13. Full Name Validation

The component checks:

```js
if (!fullName)
```

If the field is empty, it displays:

```text
Full name is required.
```

The translation key is:

```text
users.modal.fullNameRequired
```

---

## 14. Phone Number Validation

The component checks:

```js
if (!phone)
```

If the phone number is empty, it displays:

```text
Phone number is required.
```

The translation key is:

```text
users.modal.phoneRequired
```

---

## 15. User ID Validation

Before calling the backend, the component checks:

```js
if (!user?.id)
```

If the selected user does not have an ID, it displays:

```text
User ID is missing.
```

The translation key is:

```text
users.modal.userIdMissing
```

No API request is sent when the ID is missing.

---

## 16. Backend API Request

The update request is:

```js
await api.put(`/api/users/${user.id}`, {
  full_name: fullName,
  phone_number: phone,
});
```

### HTTP Method

```text
PUT
```

### Endpoint

```text
/api/users/:id
```

### Request Body

```js
{
  full_name: fullName,
  phone_number: phone,
}
```

The selected user's ID is inserted into the URL.

---

## 17. Backend Response

The component expects the updated user to be returned as:

```js
response?.data?.user
```

It stores this as:

```js
const updatedUser = response?.data?.user;
```

---

## 18. Missing Response Data

If the backend request succeeds but does not return a user object, the component throws:

```text
User was updated, but no user data was returned.
```

This prevents the parent from receiving an undefined updated user.

---

## 19. Success Callback

When a valid updated user is returned:

```js
if (onSuccess) {
  onSuccess(updatedUser);
}
```

The parent component can therefore immediately update or refresh the displayed user information.

---

## 20. Successful Completion

After a successful update:

```js
resetAndClose();
```

The form is cleared, the error is removed, loading is reset, and the modal closes.

---

## 21. Error Handling

Errors are caught using:

```js
catch (err)
```

The component logs:

```text
Update user error:
```

to the browser console.

It then attempts to retrieve the most useful error message from:

```text
err.response.data.message
err.response.data.error
err.message
```

If none are available, it falls back to:

```text
Failed to update user.
```

The error is stored in:

```js
setError(backendMessage);
```

and displayed inside the modal.

---

## 22. Finally Block

The component always resets:

```js
setLoading(false);
```

inside:

```js
finally
```

This ensures the modal does not remain permanently disabled after an error.

---

## 23. Conditional Rendering

The component returns nothing when:

```js
if (!open || !user) return null;
```

Therefore the modal only appears when:

```text
open === true
AND
user exists
```

---

## 24. Modal Title

The title is determined by:

```js
const modalTitle =
  title ||
  t(
    "users.contractor.modals.editTitle",
    "Edit User"
  );
```

A custom `title` takes priority.

Otherwise the translated `Edit User` label is used.

---

## 25. Modal Layout

The modal consists of:

```text
Overlay
   ↓
Modal Container
   ↓
Header
   ↓
Scrollable Form Body
   ↓
Footer
```

The modal is responsive and has a maximum width of:

```text
560px
```

---

## 26. Header

The header contains:

```text
Modal Title
Close Button
```

The close button uses:

```text
X
```

from Lucide React.

The button calls:

```js
resetAndClose
```

and is disabled while an update is running.

---

## 27. Error Display

When:

```js
error
```

contains a value, a red error message box is displayed.

The styling includes:

```text
border-red-200
bg-red-50
text-red-600
```

---

## 28. Full Name Field

The Full Name field contains:

```text
Label: Full Name
Type: text
Name: full_name
```

The value comes from:

```js
form.full_name
```

Changes are handled by:

```js
handleChange
```

The field is disabled while loading.

---

## 29. Email Field

The Email field is:

```text
type="email"
```

but it is:

```text
disabled
readOnly
```

Its value comes directly from:

```js
user.email || ""
```

The UI explicitly informs the user:

```text
Email cannot be changed.
```

Therefore the edit request does not send an email value.

---

## 30. Phone Number Field

The Phone Number field contains:

```text
Type: tel
Name: phone_number
```

It uses:

```text
autoComplete="tel"
inputMode="numeric"
```

The value comes from:

```js
form.phone_number
```

---

## 31. Cancel Button

The Cancel button calls:

```js
resetAndClose
```

It is disabled while the update request is running.

---

## 32. Update Button

The Update button is:

```html
type="submit"
```

so it triggers:

```js
handleSubmit
```

Its displayed text changes according to loading state:

```text
Update
```

or:

```text
Updating...
```

The button is disabled while loading.

---

## 33. Translation Support

The component uses:

```js
const { t } = useLanguage();
```

Translation keys include:

```text
users.modal.fullNameRequired
users.modal.phoneRequired
users.modal.userIdMissing
users.modal.updateNoData
users.modal.errors.updateFailed
users.contractor.modals.editTitle
users.modal.close
users.modal.fullName
users.modal.fullNamePlaceholder
users.modal.email
users.modal.emailCannotChange
users.modal.phoneNumber
users.modal.phoneNumberPlaceholder
users.modal.cancel
users.modal.updating
users.modal.update
```

Fallback English text is supplied for each key.

---

## 34. Complete Data Flow

```text
User Table
     ↓
Select User
     ↓
Open EditUserModal
     ↓
Load Existing User Data
     ↓
Edit Full Name / Phone
     ↓
Validate Fields
     ↓
PUT /api/users/:id
     ↓
Receive Updated User
     ↓
onSuccess(updatedUser)
     ↓
Reset Form
     ↓
Close Modal
```

---

## 35. Error Flow

```text
Submit
   ↓
Validation
   ↓
Invalid?
 ┌─Yes──────────────→ Display Error
 │
 No
 ↓
API Request
 ↓
Request Fails?
 ┌─Yes──────────────→ Extract Backend Error
 │                    ↓
 │                 Display Error
 │
 No
 ↓
Check response.data.user
 ↓
onSuccess()
 ↓
Close Modal
```

---

## 36. Summary

`EditUserModal.jsx` is the reusable user-editing modal for the Users module.

It:

- Loads the selected user's existing data.
- Allows Full Name editing.
- Allows Phone Number editing.
- Keeps Email read-only.
- Validates required fields.
- Validates the presence of the user ID.
- Sends a `PUT` request to `/api/users/:id`.
- Handles loading and duplicate-submit prevention.
- Displays backend/API errors.
- Returns the updated user through `onSuccess`.
- Resets its state and closes after a successful update.
- Supports multilingual labels through `useLanguage`.
