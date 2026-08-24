# AddUserModal Component Documentation

## 1. File Overview

**File:** `AddUserModal.jsx`  
**Location:** `src/components/users/AddUserModal.jsx`

`AddUserModal` is a reusable modal component for displaying the Add User form.

It provides fields for:
- Full Name
- Email
- Role

The modal can be opened or closed through props supplied by its parent component.

---

## 2. Props

The component receives:

| Prop | Purpose |
|---|---|
| `open` | Controls whether the modal is displayed |
| `onClose` | Closes the modal |
| `title` | Text displayed in the modal header |

---

## 3. Visibility

The component immediately returns `null` when:

```js
if (!open) return null;
```

Therefore, no modal DOM is rendered while the `open` prop is false.

---

## 4. Modal Structure

The modal contains three main sections:

```text
Header
  ↓
Form Body
  ↓
Footer
```

### Header

Displays the supplied `title` and a close button.

The close button uses the Lucide:

```text
X
```

icon.

---

## 5. Form Fields

### Full Name

An input field with:

```text
Placeholder: Enter full name
```

### Email

An input field with:

```text
Placeholder: Enter email
```

### Role

A select field containing:

```text
Select role
Admin
Super Admin
```

---

## 6. Footer Actions

The footer contains:

```text
Cancel
Save User
```

`Cancel` calls:

```js
onClose
```

The `Save User` button is currently a visual action button and does not contain a submission handler in this implementation.

---

## 7. Styling

The component uses Tailwind CSS classes for:

- Overlay
- Modal positioning
- Borders
- Spacing
- Typography
- Focus states
- Buttons
- Shadows
- Rounded corners

The overlay uses:

```text
fixed inset-0 z-50
```

and a semi-transparent black background.

---

## 8. Data Handling

The current component does not maintain form state.

There are no:

```text
useState
useEffect
API requests
form submission handlers
```

inside this component.

It currently represents the user-entry UI.

---

## 9. Component Flow

```text
Parent Component
      ↓
open = true
      ↓
AddUserModal renders
      ↓
User enters details
      ↓
Cancel → onClose
Save User → button currently has no submit logic
```

---

## 10. Summary

`AddUserModal.jsx` is a reusable UI modal for adding users. It receives visibility, title, and close behavior from its parent and currently provides the form interface without backend submission logic.
