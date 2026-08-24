# AdminUsers Component Documentation

## 1. File Overview

**File:** `AdminUsers.jsx`  
**Location:** `src/components/users/AdminUsers.jsx`

`AdminUsers` displays a management table for Admin Level 1 users.

The current implementation uses a local static `adminUsers` array.

---

## 2. Admin User Data

The component defines sample admin records containing:

```text
id
name
email
phone
status
createdAt
```

The current list contains four sample users.

---

## 3. Header

The header identifies the section as:

```text
Admin Level 1 Users
```

and displays the badge:

```text
Full access to system
```

The description explains that the section manages other Admin Level 1 users.

The `ShieldCheck` icon is used for the section indicator.

---

## 4. Search

The component displays a search input with:

```text
Search by name, email or phone...
```

The search field is currently presentational.

There is no state or filtering logic attached to it in the current implementation.

---

## 5. Add Admin Button

The header includes:

```text
Add Admin
```

with a `Plus` icon.

The button is currently visual and does not have an `onClick` handler.

---

## 6. Admin Table

The table displays:

```text
SL.No
Admin Name
Email
Phone Number
Status
Created At
Actions
```

The rows are generated using:

```js
adminUsers.map(...)
```

---

## 7. Status

Each user displays an `Active` status badge.

The current styling uses a green badge.

---

## 8. Actions

Each row displays:

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

The buttons currently do not contain action handlers.

---

## 9. Pagination Footer

The footer displays:

```text
Showing 1 to 4 of 4 entries
```

and provides a rows-per-page select containing:

```text
10
25
50
```

The pagination controls are currently presentational.

---

## 10. Data Flow

```text
adminUsers static array
        ↓
AdminUsers
        ↓
Map users into table rows
        ↓
Display admin information
```

---

## 11. Summary

`AdminUsers.jsx` is the Admin Level 1 user-management table. The current implementation is UI-focused and uses local static data; search, add, edit, delete, and pagination controls do not currently contain functional handlers.
