# ContractorUsers Component Documentation

## 1. File Overview

**File:** `ContractorUsers.jsx`  
**Location:** `src/components/users/ContractorUsers.jsx`

`ContractorUsers` provides the Contractor Users section of the Users module.

It displays a header, search interface, add-contractor button, and a reusable `UserTable`.

---

## 2. Dependencies

The component imports:

```text
React
Building2
Plus
Search
UserTable
```

`Building2`, `Plus`, and `Search` come from `lucide-react`.

---

## 3. Contractor Data

The component defines a local `contractorUsers` array.

Each record contains:

```text
id
name
email
role
lastLogin
status
```

The current implementation contains three sample contractor records.

---

## 4. Header

The section title is:

```text
Contractor Users
```

The badge is:

```text
Limited Access
```

The description is:

```text
Manage contractor accounts and permissions.
```

The `Building2` icon is used to represent contractor accounts.

---

## 5. Search

A search input is displayed with:

```text
Search contractors...
```

The current search field does not have local state or filtering behavior.

It is currently a UI element.

---

## 6. Add Contractor

The component displays:

```text
Add Contractor
```

with a `Plus` icon.

The button currently does not have an event handler.

---

## 7. Reusable UserTable

Instead of rendering its own table, `ContractorUsers` passes the contractor data to:

```jsx
<UserTable users={contractorUsers} />
```

This keeps the table rendering logic reusable.

---

## 8. Component Flow

```text
contractorUsers
      ↓
ContractorUsers
      ↓
UserTable
      ↓
Contractor table
```

---

## 9. Summary

`ContractorUsers.jsx` is a wrapper/presentation component for contractor accounts. It provides the contractor-specific header and controls and delegates table rendering to `UserTable.jsx`.
