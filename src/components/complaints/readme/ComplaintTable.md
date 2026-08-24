# ComplaintTable Component Documentation

## 1. File Overview

**File:** `ComplaintTable.jsx`  
**Location:** `src/components/complaints/ComplaintTable.jsx`

`ComplaintTable` displays the paginated list of complaints and provides the action used to open complaint details.

---

## 2. Props

```jsx
<ComplaintTable
  complaints={complaints}
  loading={loading}
  error={error}
  pagination={pagination}
  onPageChange={...}
  onSelectComplaint={...}
/>
```

| Prop | Purpose |
|---|---|
| `complaints` | Array of complaints to display |
| `loading` | Indicates that complaint data is being fetched |
| `error` | Error message to display |
| `pagination` | Current pagination information |
| `onPageChange` | Callback for previous/next page |
| `onSelectComplaint` | Callback when a complaint is selected |

---

## 3. Table Columns

The table displays:

```text
Ticket Number
Category
Title
Citizen / Phone
Location
Status
Created At
Action
```

The table has a minimum width of:

```text
900px
```

and supports horizontal scrolling on smaller screens.

---

## 4. Status Configuration

The component defines visual configurations for:

```text
PENDING
READY_FOR_VERIFICATION
OTP_SENT
IN_PROGRESS
ASSIGNED
CLOSED
```

Each status has:

```text
Translation key
Background color
Text color
```

---

## 5. Loading State

When:

```text
loading === true
```

the table displays:

```text
Loading complaints...
```

with a loading spinner.

The table header can also display:

```text
Updating...
```

while data is being refreshed.

---

## 6. Error State

When `error` contains a value, the table displays the error instead of complaint rows.

---

## 7. Empty State

When:

```text
complaints.length === 0
```

and there is no loading/error state, the table displays:

```text
No complaints found.
```

---

## 8. Complaint Rows

Each complaint row uses:

```js
complaint.ticket_number
```

as its React key.

The displayed information comes from fields such as:

```text
ticket_number
category
title
citizen_name
phone_number
address
status
created_at
```

---

## 9. View Action

Each complaint has a view action using the:

```text
Eye
```

icon.

Clicking the action calls:

```js
onSelectComplaint?.(complaint)
```

This allows the parent page to open the selected complaint in `ComplaintDetails`.

---

## 10. Pagination

The component reads:

```text
pagination.page
pagination.limit
pagination.total
pagination.totalPages
```

It calculates:

```text
startItem
endItem
```

for the footer.

---

## 11. Previous Page

The Previous button is disabled when:

```text
currentPage <= 1
```

Otherwise it calls:

```js
onPageChange(currentPage - 1)
```

---

## 12. Next Page

The Next button is disabled when:

```text
totalPages === 0
```

or:

```text
currentPage >= totalPages
```

Otherwise it calls:

```js
onPageChange(currentPage + 1)
```

---

## 13. API Responsibility

`ComplaintTable` does not fetch complaints itself.

The parent page performs the request:

```text
GET /api/complaints
```

and supplies the returned list and pagination data.

---

## 14. Data Flow

```text
Complaints API
      ↓
Complaints.jsx
      ↓
complaints + pagination
      ↓
ComplaintTable
      ↓
Rows
      ↓
Select Complaint
      ↓
Complaints.jsx
      ↓
ComplaintDetails
```

---

## 15. Summary

`ComplaintTable.jsx` is the main complaint-list presentation component. It handles table rendering, status styling, loading/error/empty states, complaint selection, and previous/next pagination while leaving API operations to the parent page.
