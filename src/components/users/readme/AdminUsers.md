# AdminUsers Component Documentation

## File
`src/components/users/AdminUsers.jsx`

## Purpose
`AdminUsers` manages and displays Admin Level 1 users.

## API
The component loads Admin Level 1 users from:
```text
GET /api/users
```

with:
```text
type=ADMIN_LAYER_1
```

## State
The component manages:
```text
adminUsers
search
loading
error
currentPage
showAddAdminModal
showEditModal
showDeleteModal
selectedUser
```

## Search
The loaded Admin users are filtered client-side using the current search value.

## Pagination
The component uses a fixed page size of:
```text
10 rows
```

It calculates filtered totals, page indexes, and paginated Admin records.

## Create
`AddUserModal` is opened for Admin creation. After a successful create operation, the Admin list is refreshed.

## Edit
The selected user is passed to `EditUserModal`. On successful update, the list is refreshed.

## Delete
The selected user is passed to `DeleteUserModal`. On successful deletion, the list is refreshed.

## Status
Status values are normalized and translated into the application's language.

## Dates
Created dates are formatted using the current language/locale.

## Summary
`AdminUsers.jsx` is the backend-connected Admin Level 1 management section. It handles loading, search, pagination, create, edit, delete, status translation, and refresh behavior.
