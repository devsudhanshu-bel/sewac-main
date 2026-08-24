# ListOfWorkers Component Documentation

## File
`src/components/users2/ListOfWorkers.jsx`

## Purpose
`ListOfWorkers` is the complete worker-management interface. Unlike the earlier static implementation, the current version is connected to the backend and supports worker creation, editing, deletion, searching, and pagination.

## API
Workers are loaded with:
```text
GET /api/users?type=WORKER&page=1&limit=100
```

Worker updates/deletion use:
```text
PUT /api/users/:id
DELETE /api/users/:id
```

Worker creation uses the user-management API through the shared Axios instance.

## Authentication
The component checks:
```text
token
authToken
accessToken
```
from localStorage/session authentication sources and sends a Bearer token when available.

## State
The component manages:
```text
workers
search
showModal
showEditModal
selectedWorker
showDeleteModal
workerToDelete
loading
saving
deleting
error
successMessage
currentPage
rowsPerPage
```

## Add Worker
The Add Worker form contains:
```text
full_name
email
phone_number
password
```

Submitting the form sends the worker creation request and refreshes the worker list after success.

## Edit Worker
The selected worker is loaded into:
```text
editForm
```

with:
```text
full_name
email
phone_number
```

The update operation sends the changed worker information to `/api/users/:id`.

## Delete Worker
Deletion is a two-step flow:
```text
Worker action
   ↓
Confirmation modal
   ↓
DELETE /api/users/:id
   ↓
Refresh workers
```

## Search
Workers can be filtered from the loaded list using the search value.

## Pagination
The component maintains:
```text
currentPage
rowsPerPage
```

and derives:
```text
totalEntries
totalPages
startIndex
endIndex
paginatedWorkers
```

## Date Formatting
Created dates are formatted using the `en-IN` locale with date and time.

## Loading and Errors
The component displays loading, error, and success states while worker operations are in progress.

## Summary
`ListOfWorkers.jsx` is the backend-connected worker management screen. It covers the full worker CRUD lifecycle plus search, pagination, authentication headers, and operation feedback.
