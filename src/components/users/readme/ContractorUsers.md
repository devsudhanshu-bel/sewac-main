# ContractorUsers Component Documentation

## File
`src/components/users/ContractorUsers.jsx`

## Purpose
`ContractorUsers` manages Contractor/Admin Level 2 users.

## API
The component loads users from:
```text
GET /api/users
```

with:
```text
type=ADMIN_LAYER_2
```

## State
The component manages:
```text
contractorUsers
search
loading
error
currentPage
showAddContractorModal
showEditModal
showDeleteModal
selectedUser
```

## Search
Search input is used to filter the loaded contractor records.

## Pagination
The component uses:
```text
10 rows per page
```

and provides previous/next page handling.

## Create
`AddUserModal` is opened with the contractor role. Successful creation refreshes the contractor list.

## Edit
The selected contractor is passed to `EditUserModal`.

## Delete
The selected contractor is passed to `DeleteUserModal`.

## Localization
The current language is mapped to:
```text
en-IN
kn-IN
hi-IN
```
for localized date formatting.

## Status
User status is normalized and translated before display.

## Summary
`ContractorUsers.jsx` is the backend-connected Contractor/Admin Level 2 user-management section with search, pagination, creation, editing, deletion, localization, and refresh handling.
