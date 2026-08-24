# UserTable Component Documentation

## File
`src/components/users/UserTable.jsx`

## Purpose
`UserTable` is the shared paginated table for user records.

## Inputs
```jsx
<UserTable
  users={...}
  onEdit={...}
  onDelete={...}
/>
```

## Table Data
The component safely handles the supplied users array and displays the user records in a consistent table structure.

## Pagination
The table uses:
```text
10 rows per page
```

It calculates:
```text
totalUsers
totalPages
startIndex
endIndex
paginatedUsers
```

and exposes previous/next page controls.

## Actions
The table accepts:
```text
onEdit
onDelete
```

and invokes them for the corresponding user.

## Status
Status values are normalized.

The component maps:
```text
ACTIVE → Active
INACTIVE → Inactive
```

and applies different status classes.

## Summary
`UserTable.jsx` is the reusable table/pagination layer shared by the user-management UI.
