# ListOfWorkers Component Documentation

## 1. File Overview

**File:** `ListOfWorkers.jsx`  
**Location:** `src/components/users2/ListOfWorkers.jsx`

`ListOfWorkers` is the worker-management component under the `users2` module.

It displays a searchable list of workers, provides an Add Workers modal, and provides a per-worker action menu.

---

## 2. Main Dependencies

The component uses React hooks:

```text
useState
useEffect
useRef
```

It also uses Lucide icons:

```text
PlusCircle
Search
MoreHorizontal
Trash2
ChevronDown
X
```

---

## 3. Worker Data

The current component uses a local static `workers` array.

Each worker contains:

```text
id
name
phone
zone
wards
```

The current data contains seven worker records.

---

## 4. State Management

The component maintains three pieces of state.

### Search

```js
const [search, setSearch] = useState("");
```

Stores the current search text.

### Active Menu

```js
const [activeMenu, setActiveMenu] = useState(null);
```

Stores the worker whose action menu is currently open.

### Show Modal

```js
const [showModal, setShowModal] = useState(false);
```

Controls the Add Worker modal.

---

## 5. Outside-Click Handling

The component creates:

```js
const menuRef = useRef(null);
```

An effect adds a `mousedown` event listener to the document.

If the click occurs outside the active menu, the component executes:

```js
setActiveMenu(null);
```

This automatically closes the worker action menu.

---

## 6. Search Filtering

Workers are filtered by:

```text
Name
Phone Number
Zone
```

The search value is converted to lowercase and compared with the worker's name and zone.

The phone number is checked directly using:

```js
worker.phone.includes(value)
```

---

## 7. Search Flow

```text
User enters search
      ↓
setSearch()
      ↓
workers.filter()
      ↓
Name / Phone / Zone matching
      ↓
filteredWorkers
      ↓
Table
```

---

## 8. Header

The component displays:

```text
List of Workers
```

and a search field with:

```text
Search by phone number, name or zone...
```

---

## 9. Add Workers Button

The button displays:

```text
Add workers
```

with a `PlusCircle` icon.

Clicking the button executes:

```js
setShowModal(true)
```

which opens the Add Worker modal.

---

## 10. Worker Table

The table contains:

```text
Sl.No
Worker Name
Phone Number
Zone Name
Number of Wards under the Zone
Actions
```

The rows are generated from:

```js
filteredWorkers.map(...)
```

---

## 11. Worker Action Menu

Each worker has a three-dot action button.

The button toggles:

```js
activeMenu
```

between the worker ID and `null`.

The currently displayed menu contains:

```text
Delete
```

with the `Trash2` icon.

The Delete button is currently visual and does not contain deletion logic.

---

## 12. Table Footer

The footer displays:

```text
Showing 1 to {filteredWorkers.length} of {workers.length} entries
```

It also displays:

```text
Rows per page: 10
```

with a dropdown-style button.

The rows-per-page control is currently visual.

---

## 13. Add Worker Modal

The modal appears when:

```js
showModal === true
```

The overlay uses:

```text
fixed
inset-0
z-[999]
bg-black/25
backdrop-blur-sm
```

---

## 14. Add Worker Fields

The modal contains:

### Name

```text
Enter worker name
```

### Phone Number

```text
Enter phone number
```

### Zone Name

A button displays:

```text
Select Zone
```

with a `ChevronDown` icon.

---

## 15. Modal Actions

The modal has:

```text
Cancel
Save
```

The Cancel button closes the modal using:

```js
setShowModal(false)
```

The Save button currently has no submission handler.

---

## 16. Worker Data Flow

```text
workers static array
       ↓
Search input
       ↓
filteredWorkers
       ↓
Worker Table
       ↓
Action Menu
```

---

## 17. Add Worker Flow

```text
Add workers
     ↓
setShowModal(true)
     ↓
Add Worker Modal
     ↓
Name / Phone / Zone fields
     ↓
Cancel or Save
```

---

## 18. Current Implementation Scope

The current component is primarily a frontend UI implementation.

It currently does not contain:

```text
Backend worker API calls
Database operations
Worker creation submission
Worker deletion API
Zone API integration
Server-side pagination
```

The worker list and form controls are currently represented locally.

---

## 19. Summary

`ListOfWorkers.jsx` is the worker-management UI under `users2`.

It provides:

- Worker listing
- Search by name, phone, and zone
- Add Worker modal
- Worker action menu
- Delete action UI
- Rows-per-page UI
- Outside-click handling for the action menu

The current worker records are local static data and the Add/Delete operations are not yet connected to backend functionality.
