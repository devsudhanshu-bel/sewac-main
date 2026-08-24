# Users.jsx Page Documentation

## 1. File Overview

**File:** `Users.jsx`  
**Location:** `src/pages/Users.jsx`

`Users` is the main user-management page of the SEWAC admin frontend.

It combines the Admin Level 1 user section and Contractor user section under a common page layout.

---

## 2. Main Dependencies

The page imports:

```js
Header
AdminUsers
ContractorUsers
```

---

## 3. Page Layout

The page structure is:

```text
Header
   ↓
Users Page Heading
   ↓
Admin Level 1 Users
   ↓
Contractor Users
   ↓
Footer
```

---

## 4. Header

The page renders:

```jsx
<Header variant="default" />
```

The default Header is therefore used for the Users page.

---

## 5. Page Heading

The page displays:

```text
Users
```

with the description:

```text
Create and manage users in the system.
```

---

## 6. Admin User Section

The page renders:

```jsx
<AdminUsers />
```

This provides the Admin Level 1 user-management interface.

The Admin section is responsible for its own user table and controls.

---

## 7. Contractor User Section

The page renders:

```jsx
<ContractorUsers />
```

inside a container with top margin.

This provides the Contractor user-management section.

---

## 8. Footer

The page displays:

```text
© 2025 SEWAC. All rights reserved.
```

at the bottom of the page.

---

## 9. Styling

The main page uses:

```text
flex-1
min-h-screen
bg-[#F8F9FD]
```

The content uses:

```text
px-8
py-7
```

for spacing.

---

## 10. Data Handling

`Users.jsx` does not directly fetch users from the backend.

It delegates user-specific functionality to:

```text
AdminUsers
ContractorUsers
```

Therefore, the page acts primarily as a composition/container page.

---

## 11. Component Relationship

```text
Users.jsx
   │
   ├── Header
   │
   ├── AdminUsers
   │
   └── ContractorUsers
```

The lower-level user-management components handle their own display and interaction logic.

---

## 12. Page Responsibility

`Users.jsx` is responsible for:

- Providing the overall Users page layout.
- Rendering the common Header.
- Displaying the Users page heading.
- Rendering Admin Level 1 users.
- Rendering Contractor users.
- Displaying the footer.

It does not contain the detailed user table or modal logic itself.

---

## 13. Summary

`Users.jsx` is the parent page for the SEWAC Users module.

It combines the Admin and Contractor user-management sections into one page while keeping the detailed functionality inside their respective components.
