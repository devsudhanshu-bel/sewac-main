# UserSection Component Documentation

## 1. File Overview

**File:** `UserSection.jsx`  
**Location:** `src/components/users/UserSection.jsx`

`UserSection` is a reusable section component for displaying different categories of users using the same layout.

It accepts configuration through props instead of hard-coding a specific user type.

---

## 2. Props

The component receives:

| Prop | Purpose |
|---|---|
| `title` | Section heading |
| `description` | Supporting description |
| `badge` | Access/status badge text |
| `badgeColor` | Tailwind classes for the icon container |
| `buttonColor` | Tailwind classes for the add button |
| `buttonText` | Add button label |
| `searchPlaceholder` | Search input placeholder |
| `icon` | Icon component |
| `users` | User data passed to `UserTable` |
| `onAdd` | Handler executed by the add button |

---

## 3. Dynamic Icon

The icon is received through:

```js
icon: Icon
```

and rendered as:

```jsx
<Icon className="w-4 h-4" />
```

This allows different user sections to supply different icons.

---

## 4. Header

The header dynamically displays:

```text
title
badge
description
```

This makes the component reusable for multiple user categories.

---

## 5. Search Field

The search input uses:

```text
searchPlaceholder
```

to determine its placeholder text.

The current component does not manage search state or filtering.

---

## 6. Add Button

The button uses:

```text
buttonColor
buttonText
onAdd
```

The click handler is:

```js
onClick={onAdd}
```

Therefore, the parent component controls what happens when a user clicks Add.

---

## 7. UserTable Integration

The component renders:

```jsx
<UserTable users={users} />
```

This separates the section header/control UI from the actual user table.

---

## 8. Reusability

The intended structure is:

```text
UserSection
├── Section Header
├── Badge
├── Search
├── Add Button
└── UserTable
```

The same component can therefore support different user groups by changing its props.

---

## 9. Component Flow

```text
Parent
  ↓
UserSection props
  ↓
Header + Search + Add Button
  ↓
UserTable
  ↓
User Data
```

---

## 10. Summary

`UserSection.jsx` is the reusable layout component for user-management sections. It receives configuration and user data through props and delegates table rendering to `UserTable.jsx`.
