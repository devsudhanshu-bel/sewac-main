# UserTable Component Documentation

## 1. File Overview

**File:** `UserTable.jsx`  
**Location:** `src/components/users/UserTable.jsx`

`UserTable` is a reusable table component used to display user records.

It receives its data through the `users` prop.

---

## 2. Props

The component accepts:

```js
users
```

The expected user object fields are:

```text
id
name
email
role
lastLogin
status
```

---

## 3. Table Columns

The table displays:

```text
Name
Email
Role
Last Login
Status
Actions
```

---

## 4. Rendering User Rows

Rows are generated using:

```js
users.map((user) => ...)
```

The user's `id` is used as the React key.

---

## 5. Name

The user's name is displayed as a medium-weight text value.

---

## 6. Email

The user's email is displayed as secondary gray text.

---

## 7. Role

The component displays the user's role.

Examples include:

```text
Contractor Manager
Supervisor
Site Manager
```

depending on the data supplied by the parent.

---

## 8. Last Login

The component displays:

```text
user.lastLogin
```

as the last-login value.

---

## 9. Status

The user's status is displayed in a rounded green badge.

The current implementation is designed around the status value supplied by the data object.

---

## 10. Actions

Each row contains:

```text
Edit
Delete
```

using:

```text
Pencil
Trash2
```

icons.

The current buttons are visual controls and do not contain callback props or action handlers.

---

## 11. Footer

The table footer displays:

```text
Showing 1–5 of 5 users
Rows per page: 10
```

and two navigation buttons:

```text
←
→
```

The current footer is static and does not implement pagination state.

---

## 12. Reusability

`UserTable` is used by components such as:

```text
ContractorUsers
UserSection
```

The parent supplies the user array:

```jsx
<UserTable users={contractorUsers} />
```

This avoids duplicating table markup for every user category.

---

## 13. Data Flow

```text
Parent Component
      ↓
users prop
      ↓
UserTable
      ↓
users.map()
      ↓
Table Rows
```

---

## 14. Summary

`UserTable.jsx` is the shared presentation component for user records. It standardizes the table layout, status badges, actions, and footer across user-management sections.
