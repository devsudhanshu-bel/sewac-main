# PermissionRequestModal.jsx Documentation

## 1. File Overview

**File:** `PermissionRequestModal.jsx`  
**Location:** `src/components/waste-generators/PermissionRequestModal.jsx`

`PermissionRequestModal` is a reusable confirmation/request form used when a Waste Generator operation requires Admin Layer 1 approval.

---

## 2. Props

```js
{
  open,
  onClose,
  action,
  onSubmit
}
```

### `open`

Controls modal visibility.

### `onClose`

Closes the modal.

### `action`

Describes the operation requiring permission.

### `onSubmit`

Receives the entered reason.

---

## 3. State

The component maintains:

```js
const [reason, setReason] = useState("");
```

This stores the permission-request reason.

---

## 4. Conditional Rendering

When:

```js
!open
```

the component returns:

```js
null
```

---

## 5. Permission Message

The modal explains that the selected operation requires:

```text
Admin Layer 1 approval
```

The operation name is displayed dynamically using:

```text
action
```

---

## 6. Reason Field

The user enters a reason in a textarea.

Placeholder:

```text
Reason for this request...
```

The component updates the state whenever the textarea changes.

---

## 7. Validation

Before submitting:

```js
if (!reason.trim())
```

the component displays:

```text
Please enter a reason.
```

No submission occurs until a non-empty reason is supplied.

---

## 8. Submit Flow

When valid:

```js
onSubmit(reason);
```

is called.

Then:

```js
setReason("");
onClose();
```

clears the reason and closes the modal.

---

## 9. Actions

### Cancel

```js
onClose()
```

### Send Request

```js
handleSubmit()
```

which validates the reason and calls `onSubmit`.

---

## 10. Data Flow

```text
Restricted Operation
        ↓
PermissionRequestModal
        ↓
User enters reason
        ↓
Validation
        ↓
onSubmit(reason)
        ↓
Parent handles permission request
```

---

## 11. Summary

`PermissionRequestModal.jsx` is a reusable permission-request UI. It does not directly call the backend; instead, it sends the entered reason to its parent through `onSubmit`.
