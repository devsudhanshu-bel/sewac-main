# WasteGenDir.jsx Documentation

## 1. File Overview

**File:** `WasteGenDir.jsx`  
**Location:** `src/components/waste-generators/WasteGenDir.jsx`

`WasteGeneratorDirectory` displays the paginated Waste Generator directory.

It is responsible for:

- Search
- Directory table
- Sync action
- Update action
- Pagination
- Page-size selection
- Loading state

It does not directly fetch the directory API. The parent `WasteGenerators.jsx` supplies the data and handlers.

---

## 2. Props

```js
{
  citizens,
  search,
  onSearch,
  onUpdate,
  onSync,
  syncing,
  loading,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange
}
```

---

## 3. Safe Defaults

The component protects against invalid pagination values.

### Page

Defaults to:

```text
1
```

### Page Size

Allowed values:

```text
10
20
50
```

### Total

Defaults to:

```text
0
```

### Total Pages

Defaults to:

```text
0
```

---

## 4. Search

The directory contains a search input.

The current search value is supplied through:

```text
search
```

and changes are passed to:

```text
onSearch
```

The parent page performs the actual directory API request.

---

## 5. Sync Button

The component exposes:

```text
onSync
```

for synchronizing the selected ward.

The button reflects:

```text
syncing
```

to indicate that the synchronization operation is in progress.

---

## 6. Directory Table

The table displays Waste Generator records supplied through:

```text
citizens
```

The component maps the provided records into table rows.

---

## 7. Update Action

When a record's update action is selected:

```js
onUpdate?.(...)
```

is called with the selected record.

The parent can then open the appropriate update modal.

---

## 8. Pagination

The component supports:

```text
Previous
Page numbers
Next
```

and uses:

```text
onPageChange
```

to notify the parent when the page changes.

---

## 9. Page Number Generation

When there are seven or fewer pages, all page numbers are displayed.

For larger datasets, the component generates a compact pagination sequence using:

```text
...
```

Examples:

```text
1 2 3 4 5 6 7
```

or:

```text
1 ... 5 6 7 ... 20
```

depending on the current page.

---

## 10. Display Range

The component calculates:

```text
startRecord
endRecord
```

from:

```text
page
pageSize
total
```

When the total is zero, the displayed range becomes:

```text
0
```

---

## 11. Page Size

The page-size selector supports:

```text
10
20
50
```

Changes are passed through:

```text
onPageSizeChange
```

The parent resets the page when the page size changes.

---

## 12. Loading State

The component accepts:

```text
loading
```

from the parent and uses it to represent directory loading.

---

## 13. Language Support

The component uses:

```js
useLanguage()
```

and the translation function:

```js
t()
```

for directory labels and messages.

---

## 14. Data Flow

```text
WasteGenerators.jsx
       ↓
Directory API
       ↓
citizens + pagination
       ↓
WasteGenDir
       ├── Search → onSearch
       ├── Update → onUpdate
       ├── Sync → onSync
       └── Pagination → onPageChange
```

---

## 15. Summary

`WasteGenDir.jsx` is the presentation and interaction layer for the Waste Generator directory. It receives data from the parent rather than making API calls itself and provides search, update, sync, and pagination controls.
